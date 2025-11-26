import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  payment: router({
    createOrder: publicProcedure
      .input(z.object({
        packageName: z.string(),
        amount: z.string(),
        customerName: z.string().optional(),
        customerEmail: z.string().email().optional(),
        customerPhone: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createOrder } = await import("./orders");
        const { createPayPalOrder } = await import("./paypal");

        // Create order in database
        const order = await createOrder({
          userId: ctx.user?.id,
          packageName: input.packageName,
          amount: input.amount,
          currency: "AUD",
          status: "pending",
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
        });

        // Create PayPal order
        const paypalOrder = await createPayPalOrder({
          amount: input.amount,
          currency: "AUD",
          description: `All Resume Services - ${input.packageName}`,
          returnUrl: `${ctx.req.protocol}://${ctx.req.get("host")}/payment/success?orderId=${order.id}`,
          cancelUrl: `${ctx.req.protocol}://${ctx.req.get("host")}/payment/cancel?orderId=${order.id}`,
        });

        // Update order with PayPal order ID
        const { getDb } = await import("./db");
        const { orders } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const db = await getDb();
        if (db) {
          await db.update(orders).set({ paypalOrderId: paypalOrder.id }).where(eq(orders.id, order.id));
        }

        // Find approval URL
        const approvalUrl = paypalOrder.links.find((link: any) => link.rel === "approve")?.href;

        return {
          orderId: order.id,
          paypalOrderId: paypalOrder.id,
          approvalUrl,
        };
      }),

    captureOrder: publicProcedure
      .input(z.object({
        orderId: z.number(),
        paypalOrderId: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { capturePayPalOrder } = await import("./paypal");
        const { updateOrderStatus } = await import("./orders");

        try {
          const captureData = await capturePayPalOrder(input.paypalOrderId);
          
          // Update order status
          await updateOrderStatus(
            input.orderId,
            "completed",
            captureData.payer?.payer_id
          );

          return {
            success: true,
            captureData,
          };
        } catch (error) {
          await updateOrderStatus(input.orderId, "failed");
          throw error;
        }
      }),

    getOrder: publicProcedure
      .input(z.object({
        orderId: z.number(),
      }))
      .query(async ({ input }) => {
        const { getOrderById } = await import("./orders");
        return await getOrderById(input.orderId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
