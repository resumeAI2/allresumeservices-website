import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as blogService from './blog';
import * as categoriesAndTagsService from './categoriesAndTags';
import * as dashboardService from './dashboard';
import * as servicesService from './services';
import * as caseStudiesService from './caseStudies';
import * as socialMediaService from './socialMedia';
import * as emailSubscribersService from './emailSubscribers';
import * as leadMagnetService from './leadMagnet';
import { clientIntakeRouter } from './clientIntake';
import { intakeFileUploadRouter } from './intakeFileUpload';

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,

  backup: router({
    create: adminProcedure.mutation(async () => {
      const { createDatabaseBackup } = await import('./services/databaseBackup');
      return await createDatabaseBackup();
    }),
    stats: adminProcedure.query(async () => {
      const { getDatabaseStats } = await import('./services/databaseBackup');
      return await getDatabaseStats();
    }),
  }),

  health: router({
    check: adminProcedure.query(async () => {
      const startTime = Date.now();
      let dbStatus = 'unknown';
      let dbLatency = 0;

      try {
        const { getDb } = await import('./db');
        const db = await getDb();
        const dbStart = Date.now();
        await db!.execute('SELECT 1');
        dbLatency = Date.now() - dbStart;
        dbStatus = 'connected';
      } catch (error) {
        dbStatus = 'error';
      }

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        responseTime: Date.now() - startTime,
        database: {
          status: dbStatus,
          latency: dbLatency
        },
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        },
        version: '1.0.0'
      };
    }),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),

    // Sign up with email/password
    signup: publicProcedure
      .input(z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }))
      .mutation(async ({ input }) => {
        const bcrypt = await import("bcryptjs");
        const { eq } = await import("drizzle-orm");
        const { getDb } = await import("./db");
        const { users } = await import("../drizzle/schema");
        const { ENV } = await import("./_core/env");

        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        // Check if user already exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1)
          .then((rows) => rows[0]);

        if (existingUser) {
          throw new Error("User with this email already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, 10);

        // Determine if user should be admin
        const isAdmin = input.email === ENV.adminEmail;

        // Create user
        const newUser = await db
          .insert(users)
          .values({
            name: input.name,
            email: input.email,
            password: hashedPassword,
            emailVerified: new Date(),
            loginMethod: "email",
            role: isAdmin ? "admin" : "user",
            lastSignedIn: new Date(),
          })
          .returning()
          .then((rows) => rows[0]);

        return {
          success: true,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
        };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie?.(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
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
        const protocol = ctx.req?.protocol ?? "https";
        const host = ctx.req?.get?.("host") ?? "allresumeservices.com.au";
        const paypalOrder = await createPayPalOrder({
          amount: input.amount,
          currency: "AUD",
          description: `All Résumé Services - ${input.packageName}`,
          returnUrl: `${protocol}://${host}/payment/success?orderId=${order.id}`,
          cancelUrl: `${protocol}://${host}/payment/cancel?orderId=${order.id}`,
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

    getOrder: protectedProcedure
      .input(z.object({
        orderId: z.number(),
      }))
      .query(async ({ input, ctx }) => {
        const { getOrderById } = await import("./orders");
        const order = await getOrderById(input.orderId);
        if (!order) return null;
        // Only allow users to view their own orders (admins use orders.getById)
        if (order.userId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new Error("Unauthorized: You can only view your own orders");
        }
        return order;
      }),
  }),

  services: router({ getAllServices: publicProcedure
      .query(async () => {
        try {
          return await servicesService.getAllServices();
        } catch (err) {
          console.error('[Catalog] getAllServices failed:', err instanceof Error ? err.message : err);
          if (err instanceof Error && err.stack) console.error(err.stack);
          throw err;
        }
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
        sessionId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Use authenticated user ID from session, not client input
        const userId = ctx.user?.id;
        return await servicesService.addToCart({ ...input, userId });
      }),
    getCartItems: publicProcedure
      .input(z.object({
        sessionId: z.string().optional(),
      }))
      .query(async ({ input, ctx }) => {
        const userId = ctx.user?.id;
        return await servicesService.getCartItems(userId, input.sessionId);
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
        sessionId: z.string().optional(),
      }))
      .query(async ({ input, ctx }) => {
        const userId = ctx.user?.id;
        return await servicesService.getCartItemCount(userId, input.sessionId);
      }),
    mergeGuestCart: protectedProcedure
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
    addTestimonial: adminProcedure
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
    updateTestimonial: adminProcedure
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
    deleteTestimonial: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await servicesService.deleteTestimonial(input);
      }),
  }),

  clientIntake: clientIntakeRouter,
  intakeFileUpload: intakeFileUploadRouter,

  leadMagnet: router({
    capture: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        downloadedTemplate: z.string(),
        sourcePost: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Save to database
        await leadMagnetService.captureLeadMagnetEmail(input);

        // Send email with PDF download link
        const { sendLeadMagnetEmail } = await import('./emailService');
        const protocol = ctx.req?.protocol ?? "https";
        const host = ctx.req?.get?.("host") ?? "allresumeservices.com.au";
        const pdfUrl = `${protocol}://${host}/downloads/ats-resume-mistakes-guide.pdf`;
        await sendLeadMagnetEmail(input.name, input.email, pdfUrl);

        return { success: true, message: 'Guide sent to your email' };
      }),
    getAll: adminProcedure
      .query(async () => {
        return await leadMagnetService.getAllLeadMagnetSubscribers();
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
        resumeFileUrl: z.string().optional(),
        honeypot: z.string().optional(),
        submissionTime: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createContactSubmission } = await import("./contact");
        return await createContactSubmission(input);
      }),
    getAll: adminProcedure
      .query(async () => {
        const { getAllContactSubmissions } = await import("./contact");
        return await getAllContactSubmissions();
      }),
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "converted", "archived"]),
      }))
      .mutation(async ({ input }) => {
        const { updateContactSubmissionStatus } = await import("./contact");
        return await updateContactSubmissionStatus(input.id, input.status);
      }),
    updateNotes: adminProcedure
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
    create: adminProcedure
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
    update: adminProcedure
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
    delete: adminProcedure
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
        const rawUserAgent = ctx.req?.headers?.["user-agent"];
        const userAgent = Array.isArray(rawUserAgent) ? rawUserAgent[0] : rawUserAgent;
        const ipAddress = ctx.req?.ip ?? ctx.req?.socket?.remoteAddress ?? "unknown";
        return await logFaqSearch({
          query: input.query,
          resultsCount: input.resultsCount,
          userAgent,
          ipAddress,
        });
      }),
    getSearchAnalytics: adminProcedure
      .input(z.object({
        limit: z.number().optional().default(50),
      }))
      .query(async ({ input }) => {
        const { getSearchAnalytics } = await import("./faqAnalytics");
        return await getSearchAnalytics(input.limit);
      }),
    getTopSearches: adminProcedure
      .input(z.object({
        limit: z.number().optional().default(10),
      }))
      .query(async ({ input }) => {
        const { getTopSearches } = await import("./faqAnalytics");
        return await getTopSearches(input.limit);
      }),
    getNoResultSearches: adminProcedure
      .query(async () => {
        const { getNoResultSearches } = await import("./faqAnalytics");
        return await getNoResultSearches();
      }),
  }),

  blog: router({
    uploadImage: adminProcedure
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
    create: adminProcedure
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
    update: adminProcedure
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
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await blogService.deleteBlogPost(input.id);
      }),
    getAllImages: adminProcedure
      .query(async () => {
        return await blogService.getAllUploadedImages();
      }),
    updateImageAltText: adminProcedure
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
    createCategory: adminProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await categoriesAndTagsService.createCategory(input.name, input.slug, input.description);
      }),
    updateCategory: adminProcedure
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
    deleteCategory: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await categoriesAndTagsService.deleteCategory(input.id);
      }),
    // Tags
    getAllTags: publicProcedure
      .query(async () => {
        return await categoriesAndTagsService.getAllTags();
      }),
    createTag: adminProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await categoriesAndTagsService.createTag(input.name, input.slug);
      }),
    updateTag: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await categoriesAndTagsService.updateTag(id, data);
      }),
    deleteTag: adminProcedure
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
    setPostTags: adminProcedure
      .input(z.object({
        postId: z.number(),
        tagIds: z.array(z.number()),
      }))
      .mutation(async ({ input }) => {
        return await categoriesAndTagsService.setPostTags(input.postId, input.tagIds);
      }),
  }),
  dashboard: router({
    getMetrics: adminProcedure
      .query(async () => {
        return await dashboardService.getDashboardMetrics();
      }),
    getRecentContacts: adminProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await dashboardService.getRecentContactSubmissions(input.limit);
      }),
    getRecentPosts: adminProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await dashboardService.getRecentBlogPosts(input.limit);
      }),
    getScheduledPosts: adminProcedure
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
    create: adminProcedure
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
    update: adminProcedure
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
    delete: adminProcedure
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
    createPostsForBlog: adminProcedure
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
    getPostsForBlog: adminProcedure
      .input(z.object({ blogPostId: z.number() }))
      .query(async ({ input }) => {
        return await socialMediaService.getSocialMediaPostsForBlog(input.blogPostId);
      }),
    getPendingPosts: adminProcedure
      .query(async () => {
        return await socialMediaService.getPendingSocialMediaPosts();
      }),
    getPostingHistory: adminProcedure
      .input(z.object({ limit: z.number().optional().default(50) }))
      .query(async ({ input }) => {
        return await socialMediaService.getSocialMediaPostingHistory(input.limit);
      }),
    markAsPosted: adminProcedure
      .input(z.object({
        id: z.number(),
        postUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await socialMediaService.markSocialMediaPostAsPosted(input.id, input.postUrl);
      }),
    markAsFailed: adminProcedure
      .input(z.object({
        id: z.number(),
        errorMessage: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await socialMediaService.markSocialMediaPostAsFailed(input.id, input.errorMessage);
      }),
    deletePostsForBlog: adminProcedure
      .input(z.object({ blogPostId: z.number() }))
      .mutation(async ({ input }) => {
        return await socialMediaService.deleteSocialMediaPostsForBlog(input.blogPostId);
      }),
  }),
  emailSubscribers: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional(),
        source: z.string().optional(),
        caseStudyId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await emailSubscribersService.subscribeEmail(
          input.email,
          input.name,
          input.source,
          input.caseStudyId
        );
      }),
    unsubscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        return await emailSubscribersService.unsubscribeEmail(input.email);
      }),
    getAll: adminProcedure
      .input(z.object({ subscribedOnly: z.boolean().optional().default(true) }))
      .query(async ({ input }) => {
        return await emailSubscribersService.getAllSubscribers(input.subscribedOnly);
      }),
    getCount: adminProcedure
      .query(async () => {
        return await emailSubscribersService.getSubscriberCount();
      }),
  }),
  email: router({
    testEmail: adminProcedure
      .input(z.object({ recipientEmail: z.string().email() }))
      .mutation(async ({ input }) => {
        const { sendTestEmail, isEmailConfigured } = await import('./emailService');

        if (!isEmailConfigured()) {
          throw new Error('Email is not configured. Please add SMTP_PASSWORD to environment variables.');
        }

        const success = await sendTestEmail(input.recipientEmail);

        if (!success) {
          throw new Error('Failed to send test email. Check server logs for details.');
        }

        return { success: true, message: `Test email sent to ${input.recipientEmail}` };
      }),
    checkConfiguration: adminProcedure
      .query(async () => {
        const { isEmailConfigured } = await import('./emailService');
        return { configured: isEmailConfigured() };
      }),
    // Email logging endpoints
    getLogs: adminProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        const { getRecentEmailLogs } = await import('./services/emailLogger');
        return await getRecentEmailLogs(input?.limit || 50);
      }),
    getStatistics: adminProcedure
      .input(z.object({ days: z.number().optional() }).optional())
      .query(async ({ input }) => {
        const { getEmailStatistics } = await import('./services/emailLogger');
        return await getEmailStatistics(input?.days || 30);
      }),
    getLogsByType: adminProcedure
      .input(z.object({ emailType: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        const { getLogsByType } = await import('./services/emailLogger');
        return await getLogsByType(input.emailType as any, input.limit || 50);
      }),
    getLogsByRecipient: adminProcedure
      .input(z.object({ email: z.string().email(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        const { getLogsByRecipient } = await import('./services/emailLogger');
        return await getLogsByRecipient(input.email, input.limit || 50);
      }),
  }),
  promoCodes: router({
    getAll: adminProcedure
      .input(z.object({ active: z.boolean().optional() }).optional())
      .query(async ({ input }) => {
        const { getAllPromoCodes } = await import('./promoCodes');
        return await getAllPromoCodes(input);
      }),
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getPromoCodeById } = await import('./promoCodes');
        return await getPromoCodeById(input.id);
      }),
    validate: publicProcedure
      .input(z.object({ code: z.string(), orderAmount: z.number() }))
      .mutation(async ({ input }) => {
        const { validatePromoCode } = await import('./promoCodes');
        return await validatePromoCode(input.code, input.orderAmount);
      }),
    create: adminProcedure
      .input(z.object({
        code: z.string(),
        description: z.string().optional(),
        discountType: z.enum(["percentage", "fixed"]),
        discountValue: z.string(),
        minPurchase: z.string().optional(),
        maxUses: z.number().optional(),
        expiresAt: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createPromoCode } = await import('./promoCodes');
        return await createPromoCode(input);
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        code: z.string().optional(),
        description: z.string().optional(),
        discountType: z.enum(["percentage", "fixed"]).optional(),
        discountValue: z.string().optional(),
        minPurchase: z.string().optional(),
        maxUses: z.number().optional(),
        expiresAt: z.date().optional(),
        active: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { updatePromoCode } = await import('./promoCodes');
        const { id, ...updates } = input;
        return await updatePromoCode(id, updates);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deletePromoCode } = await import('./promoCodes');
        await deletePromoCode(input.id);
        return { success: true };
      }),
    getStatistics: adminProcedure
      .query(async () => {
        const { getPromoCodeStatistics } = await import('./promoCodes');
        return await getPromoCodeStatistics();
      }),
  }),
  orders: router({
    getAll: adminProcedure
      .input(z.object({
        status: z.enum(["pending", "completed", "cancelled", "failed"]).optional(),
        search: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }).optional())
      .query(async ({ input }) => {
        const { getAllOrders } = await import('./orders');
        return await getAllOrders(input);
      }),
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getOrderById } = await import('./orders');
        return await getOrderById(input.id);
      }),
    getStatistics: adminProcedure
      .query(async () => {
        const { getOrderStatistics } = await import('./orders');
        return await getOrderStatistics();
      }),
    getRecent: adminProcedure
      .input(z.object({ limit: z.number().optional().default(10) }))
      .query(async ({ input }) => {
        const { getRecentOrders } = await import('./orders');
        return await getRecentOrders(input.limit);
      }),
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "completed", "cancelled", "failed"]),
      }))
      .mutation(async ({ input }) => {
        const { updateOrderStatus } = await import('./orders');
        await updateOrderStatus(input.id, input.status);
        return { success: true };
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        customerName: z.string().optional(),
        customerEmail: z.string().email().optional(),
        customerPhone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { updateOrder } = await import('./orders');
        const { id, ...updates } = input;
        await updateOrder(id, updates);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteOrder } = await import('./orders');
        await deleteOrder(input.id);
        return { success: true };
      }),
    getUserOrders: protectedProcedure
      .query(async ({ ctx }) => {
        const { getUserOrders } = await import('./orders');
        return await getUserOrders(ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
