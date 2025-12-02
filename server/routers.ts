import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as blogService from './blog';
import * as categoriesAndTagsService from './categoriesAndTags';
import * as dashboardService from './dashboard';
import * as servicesService from './services';
import * as caseStudiesService from './caseStudies';
import * as socialMediaService from './socialMedia';

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

  services: router({ getAllServices: publicProcedure
      .query(async () => {
        return await servicesService.getAllServices();
      }),
    getServicesByType: publicProcedure
      .input(z.enum(['individual', 'package', 'addon']))
      .query(async ({ input }) => {
        return await servicesService.getServicesByType(input);
      }),
    getServicesByCategory: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await servicesService.getServicesByCategory(input);
      }),
    addToCart: publicProcedure
      .input(z.object({
        serviceId: z.number(),
        quantity: z.number().default(1),
        userId: z.number().optional(),
        sessionId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await servicesService.addToCart(input);
      }),
    getCartItems: publicProcedure
      .input(z.object({
        userId: z.number().optional(),
        sessionId: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await servicesService.getCartItems(input.userId, input.sessionId);
      }),
    updateCartItemQuantity: publicProcedure
      .input(z.object({
        itemId: z.number(),
        quantity: z.number(),
      }))
      .mutation(async ({ input }) => {
        await servicesService.updateCartItemQuantity(input.itemId, input.quantity);
        return { success: true };
      }),
    removeFromCart: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await servicesService.removeFromCart(input);
        return { success: true };
      }),
    getCartItemCount: publicProcedure
      .input(z.object({
        userId: z.number().optional(),
        sessionId: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await servicesService.getCartItemCount(input.userId, input.sessionId);
      }),
    mergeGuestCart: publicProcedure
      .input(z.object({
        userId: z.number(),
        sessionId: z.string(),
      }))
      .mutation(async ({ input }) => {
        await servicesService.mergeGuestCartWithUserCart(input.userId, input.sessionId);
        return { success: true };
      }),
    getFeaturedTestimonials: publicProcedure
      .query(async () => {
        return await servicesService.getFeaturedTestimonials();
      }),
    getAllTestimonials: publicProcedure
      .query(async () => {
        return await servicesService.getAllTestimonials();
      }),
    addTestimonial: publicProcedure
      .input(z.object({
        clientName: z.string(),
        clientTitle: z.string().optional(),
        rating: z.number().min(1).max(5),
        testimonialText: z.string(),
        serviceUsed: z.string().optional(),
        featured: z.number().optional(),
        approved: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await servicesService.addTestimonial(input);
      }),
    updateTestimonial: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          clientName: z.string().optional(),
          clientTitle: z.string().optional(),
          rating: z.number().min(1).max(5).optional(),
          testimonialText: z.string().optional(),
          serviceUsed: z.string().optional(),
          featured: z.number().optional(),
          approved: z.number().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return await servicesService.updateTestimonial(input.id, input.data);
      }),
    deleteTestimonial: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await servicesService.deleteTestimonial(input);
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        serviceInterest: z.string().optional(),
        message: z.string().min(10),
        honeypot: z.string().optional(),
        submissionTime: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createContactSubmission } = await import("./contact");
        return await createContactSubmission(input);
      }),
    getAll: publicProcedure
      .query(async () => {
        const { getAllContactSubmissions } = await import("./contact");
        return await getAllContactSubmissions();
      }),
    updateStatus: publicProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "converted", "archived"]),
      }))
      .mutation(async ({ input }) => {
        const { updateContactSubmissionStatus } = await import("./contact");
        return await updateContactSubmissionStatus(input.id, input.status);
      }),
    updateNotes: publicProcedure
      .input(z.object({
        id: z.number(),
        notes: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { updateContactSubmissionNotes } = await import("./contact");
        return await updateContactSubmissionNotes(input.id, input.notes);
      }),
  }),

  testimonials: router({
    create: publicProcedure
      .input(z.object({
        clientName: z.string().min(1),
        clientTitle: z.string().optional(),
        clientPhoto: z.string().optional(),
        rating: z.number().min(1).max(5),
        testimonialText: z.string().min(10),
        serviceUsed: z.string().optional(),
        featured: z.number().optional(),
        approved: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createTestimonial } = await import("./testimonials");
        return await createTestimonial(input);
      }),
    getAll: publicProcedure
      .input(z.object({
        approvedOnly: z.boolean().optional(),
        featuredOnly: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        const { getAllTestimonials } = await import("./testimonials");
        return await getAllTestimonials(input?.approvedOnly, input?.featuredOnly);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getTestimonialById } = await import("./testimonials");
        return await getTestimonialById(input.id);
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        clientName: z.string().optional(),
        clientTitle: z.string().optional(),
        clientPhoto: z.string().optional(),
        rating: z.number().min(1).max(5).optional(),
        testimonialText: z.string().optional(),
        serviceUsed: z.string().optional(),
        featured: z.number().optional(),
        approved: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const { updateTestimonial } = await import("./testimonials");
        return await updateTestimonial(id, data);
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteTestimonial } = await import("./testimonials");
        return await deleteTestimonial(input.id);
      }),
  }),

  faq: router({
    logSearch: publicProcedure
      .input(z.object({
        query: z.string(),
        resultsCount: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { logFaqSearch } = await import("./faqAnalytics");
        return await logFaqSearch({
          query: input.query,
          resultsCount: input.resultsCount,
          userAgent: ctx.req.headers['user-agent'],
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress,
        });
      }),
    getSearchAnalytics: publicProcedure
      .input(z.object({
        limit: z.number().optional().default(50),
      }))
      .query(async ({ input }) => {
        const { getSearchAnalytics } = await import("./faqAnalytics");
        return await getSearchAnalytics(input.limit);
      }),
    getTopSearches: publicProcedure
      .input(z.object({
        limit: z.number().optional().default(10),
      }))
      .query(async ({ input }) => {
        const { getTopSearches } = await import("./faqAnalytics");
        return await getTopSearches(input.limit);
      }),
    getNoResultSearches: publicProcedure
      .query(async () => {
        const { getNoResultSearches } = await import("./faqAnalytics");
        return await getNoResultSearches();
      }),
  }),

  blog: router({
    uploadImage: publicProcedure
      .input(z.object({
        filename: z.string(),
        contentType: z.string(),
        base64Data: z.string(),
        altText: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await blogService.uploadImage(input.filename, input.contentType, input.base64Data, input.altText);
      }),
    getAll: publicProcedure
      .input(z.object({ publishedOnly: z.boolean().optional().default(true) }))
      .query(async ({ input }) => {
        return await blogService.getAllBlogPosts(input.publishedOnly);
      }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await blogService.getBlogPostBySlug(input.slug);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await blogService.getBlogPostById(input.id);
      }),
    create: publicProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        excerpt: z.string(),
        content: z.string(),
        category: z.string(),
        image: z.string(),
        published: z.number().min(0).max(1),
        scheduledPublishDate: z.string().nullable().optional(),
      }))
      .mutation(async ({ input }) => {
        return await blogService.createBlogPost(input);
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        image: z.string().optional(),
        published: z.number().min(0).max(1).optional(),
        scheduledPublishDate: z.string().nullable().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await blogService.updateBlogPost(id, data);
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await blogService.deleteBlogPost(input.id);
      }),
    getAllImages: publicProcedure
      .query(async () => {
        return await blogService.getAllUploadedImages();
      }),
    updateImageAltText: publicProcedure
      .input(z.object({
        id: z.number(),
        altText: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await blogService.updateImageAltText(input.id, input.altText);
      }),
    incrementViewCount: publicProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ input }) => {
        return await blogService.incrementBlogPostViewCount(input.slug);
      }),
    getPopularPosts: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await blogService.getPopularBlogPosts(input.limit);
      }),
    getSmartRelatedPosts: publicProcedure
      .input(z.object({ postId: z.number(), limit: z.number().optional().default(3) }))
      .query(async ({ input }) => {
        const { getSmartRelatedPosts } = await import("./smartRelatedPosts");
        return await getSmartRelatedPosts(input.postId, input.limit);
      }),
    // Categories
    getAllCategories: publicProcedure
      .query(async () => {
        return await categoriesAndTagsService.getAllCategories();
      }),
    createCategory: publicProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await categoriesAndTagsService.createCategory(input.name, input.slug, input.description);
      }),
    updateCategory: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await categoriesAndTagsService.updateCategory(id, data);
      }),
    deleteCategory: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await categoriesAndTagsService.deleteCategory(input.id);
      }),
    // Tags
    getAllTags: publicProcedure
      .query(async () => {
        return await categoriesAndTagsService.getAllTags();
      }),
    createTag: publicProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await categoriesAndTagsService.createTag(input.name, input.slug);
      }),
    updateTag: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await categoriesAndTagsService.updateTag(id, data);
      }),
    deleteTag: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await categoriesAndTagsService.deleteTag(input.id);
      }),
    // Post-Tag relationships
    getTagsForPost: publicProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        return await categoriesAndTagsService.getTagsForPost(input.postId);
      }),
    setPostTags: publicProcedure
      .input(z.object({
        postId: z.number(),
        tagIds: z.array(z.number()),
      }))
      .mutation(async ({ input }) => {
        return await categoriesAndTagsService.setPostTags(input.postId, input.tagIds);
      }),
  }),
  dashboard: router({
    getMetrics: publicProcedure
      .query(async () => {
        return await dashboardService.getDashboardMetrics();
      }),
    getRecentContacts: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await dashboardService.getRecentContactSubmissions(input.limit);
      }),
    getRecentPosts: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await dashboardService.getRecentBlogPosts(input.limit);
      }),
    getScheduledPosts: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await dashboardService.getScheduledBlogPosts(input.limit);
      }),
  }),
  caseStudies: router({
    getAll: publicProcedure
      .input(z.object({ publishedOnly: z.boolean().optional().default(true) }))
      .query(async ({ input }) => {
        return await caseStudiesService.getAllCaseStudies(input.publishedOnly);
      }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await caseStudiesService.getCaseStudyBySlug(input.slug);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await caseStudiesService.getCaseStudyById(input.id);
      }),
    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().optional().default(3) }))
      .query(async ({ input }) => {
        return await caseStudiesService.getFeaturedCaseStudies(input.limit);
      }),
    create: publicProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        category: z.string(),
        clientName: z.string(),
        challenge: z.string(),
        solution: z.string(),
        result: z.string(),
        testimonialQuote: z.string().optional(),
        image: z.string().optional(),
        published: z.number().optional().default(0),
        featured: z.number().optional().default(0),
      }))
      .mutation(async ({ input }) => {
        return await caseStudiesService.createCaseStudy({
          ...input,
          testimonialQuote: input.testimonialQuote || null,
          image: input.image || null,
          published: input.published || 0,
          featured: input.featured || 0,
          viewCount: 0,
        });
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        category: z.string().optional(),
        clientName: z.string().optional(),
        challenge: z.string().optional(),
        solution: z.string().optional(),
        result: z.string().optional(),
        testimonialQuote: z.string().optional(),
        image: z.string().optional(),
        published: z.number().optional(),
        featured: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await caseStudiesService.updateCaseStudy(id, data);
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await caseStudiesService.deleteCaseStudy(input.id);
      }),
    incrementViewCount: publicProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ input }) => {
        return await caseStudiesService.incrementCaseStudyViewCount(input.slug);
      }),
  }),
  socialMedia: router({
    createPostsForBlog: publicProcedure
      .input(z.object({
        blogPostId: z.number(),
        blogPostTitle: z.string(),
        blogPostSlug: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await socialMediaService.createSocialMediaPostsForBlog(
          input.blogPostId,
          input.blogPostTitle,
          input.blogPostSlug
        );
      }),
    getPostsForBlog: publicProcedure
      .input(z.object({ blogPostId: z.number() }))
      .query(async ({ input }) => {
        return await socialMediaService.getSocialMediaPostsForBlog(input.blogPostId);
      }),
    getPendingPosts: publicProcedure
      .query(async () => {
        return await socialMediaService.getPendingSocialMediaPosts();
      }),
    getPostingHistory: publicProcedure
      .input(z.object({ limit: z.number().optional().default(50) }))
      .query(async ({ input }) => {
        return await socialMediaService.getSocialMediaPostingHistory(input.limit);
      }),
    markAsPosted: publicProcedure
      .input(z.object({
        id: z.number(),
        postUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await socialMediaService.markSocialMediaPostAsPosted(input.id, input.postUrl);
      }),
    markAsFailed: publicProcedure
      .input(z.object({
        id: z.number(),
        errorMessage: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await socialMediaService.markSocialMediaPostAsFailed(input.id, input.errorMessage);
      }),
    deletePostsForBlog: publicProcedure
      .input(z.object({ blogPostId: z.number() }))
      .mutation(async ({ input }) => {
        return await socialMediaService.deleteSocialMediaPostsForBlog(input.blogPostId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
