import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertServiceCategorySchema,
  insertServiceProviderSchema,
  insertServiceSchema,
  insertFurnitureProductSchema,
  insertBookingSchema,
  insertFurnitureOrderSchema,
  insertReviewSchema,
  insertCostEstimateSchema
} from "@shared/schema";
import Stripe from "stripe";

// Simple demo authentication middleware
function demoIsAuthenticated(req: Request, res: Response, next: NextFunction) {
  // For demo: check for a header or cookie (simulate localStorage)
  // In production, use proper session/cookie auth
  const isAuthenticated = req.headers["x-demo-authenticated"] === "true";
  if (!isAuthenticated) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Attach a demo user object
  (req as any).user = {
    id: "demo-user-id",
    email: "user@demo.com",
    firstName: "Demo",
    lastName: "User",
    role: req.headers["x-demo-user-type"] || "user"
  };
  next();
}

// Stripe placeholder - for demo purposes
const stripe = {
  paymentIntents: {
    create: () => Promise.resolve({ client_secret: "demo_client_secret" })
  }
} as any;

export async function registerRoutes(app: Express): Promise<Server> {
  // Removed: await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', demoIsAuthenticated, async (req: Request, res: Response) => {
    // Return the demo user object
    res.json((req as any).user);
  });

  // Service categories
  app.get('/api/service-categories', async (req, res) => {
    try {
      const categories = await storage.getServiceCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching service categories:", error);
      res.status(500).json({ message: "Failed to fetch service categories" });
    }
  });

  app.post('/api/service-categories', demoIsAuthenticated, async (req: Request, res: Response) => {
    try {
      const categoryData = insertServiceCategorySchema.parse(req.body);
      const category = await storage.createServiceCategory(categoryData);
      res.json(category);
    } catch (error) {
      console.error("Error creating service category:", error);
      res.status(500).json({ message: "Failed to create service category" });
    }
  });

  // Service providers
  app.get('/api/service-providers', async (req, res) => {
    try {
      const { location } = req.query;
      const providers = await storage.getServiceProviders(location as string);
      res.json(providers);
    } catch (error) {
      console.error("Error fetching service providers:", error);
      res.status(500).json({ message: "Failed to fetch service providers" });
    }
  });

  app.get('/api/service-providers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const provider = await storage.getServiceProviderById(id);
      if (!provider) {
        return res.status(404).json({ message: "Service provider not found" });
      }
      res.json(provider);
    } catch (error) {
      console.error("Error fetching service provider:", error);
      res.status(500).json({ message: "Failed to fetch service provider" });
    }
  });

  app.post('/api/service-providers', demoIsAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id; // Use req.user.id for demo
      const providerData = insertServiceProviderSchema.parse({ ...req.body, userId });
      const provider = await storage.createServiceProvider(providerData);
      res.json(provider);
    } catch (error) {
      console.error("Error creating service provider:", error);
      res.status(500).json({ message: "Failed to create service provider" });
    }
  });

  // Services
  app.post('/api/services', async (req, res) => {
    try {
      const serviceData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(serviceData);
      res.json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  app.get('/api/services', async (req, res) => {
    try {
      const { categoryId, providerId } = req.query;
      const services = await storage.getServices(
        categoryId ? parseInt(categoryId as string) : undefined,
        providerId ? parseInt(providerId as string) : undefined
      );
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get('/api/services/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.getServiceById(id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  app.post('/api/services', demoIsAuthenticated, async (req: Request, res: Response) => {
    try {
      const serviceData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(serviceData);
      res.json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  // Furniture products
  app.post('/api/furniture-products', async (req, res) => {
    try {
      const productData = insertFurnitureProductSchema.parse(req.body);
      const product = await storage.createFurnitureProduct(productData);
      res.json(product);
    } catch (error) {
      console.error("Error creating furniture product:", error);
      res.status(500).json({ message: "Failed to create furniture product" });
    }
  });

  app.get('/api/furniture-products', async (req, res) => {
    try {
      const { providerId, category } = req.query;
      const products = await storage.getFurnitureProducts(
        providerId ? parseInt(providerId as string) : undefined,
        category as string
      );
      res.json(products);
    } catch (error) {
      console.error("Error fetching furniture products:", error);
      res.status(500).json({ message: "Failed to fetch furniture products" });
    }
  });

  app.get('/api/furniture-products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getFurnitureProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Furniture product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching furniture product:", error);
      res.status(500).json({ message: "Failed to fetch furniture product" });
    }
  });

  app.post('/api/furniture-products', demoIsAuthenticated, async (req: Request, res: Response) => {
    try {
      const productData = insertFurnitureProductSchema.parse(req.body);
      const product = await storage.createFurnitureProduct(productData);
      res.json(product);
    } catch (error) {
      console.error("Error creating furniture product:", error);
      res.status(500).json({ message: "Failed to create furniture product" });
    }
  });

  // Bookings
  app.get('/api/bookings', demoIsAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id; // Use req.user.id for demo
      const { providerId } = req.query;
      const bookings = await storage.getBookings(
        userId,
        providerId ? parseInt(providerId as string) : undefined
      );
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.post('/api/bookings', demoIsAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id; // Use req.user.id for demo
      const bookingData = insertBookingSchema.parse({ ...req.body, userId });
      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Cost estimates
  app.get('/api/cost-estimates', demoIsAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id; // Use req.user.id for demo
      const estimates = await storage.getCostEstimates(userId);
      res.json(estimates);
    } catch (error) {
      console.error("Error fetching cost estimates:", error);
      res.status(500).json({ message: "Failed to fetch cost estimates" });
    }
  });

  app.post('/api/cost-estimates', async (req, res) => {
    try {
      const estimateData = insertCostEstimateSchema.parse(req.body);
      
      // Calculate cost based on room type, size, service type, and quality level
      const baseCosts = {
        living_room: { premium: 800, standard: 500, budget: 300 },
        bedroom: { premium: 600, standard: 400, budget: 250 },
        kitchen: { premium: 1200, standard: 800, budget: 500 },
        bathroom: { premium: 900, standard: 600, budget: 350 },
        office: { premium: 700, standard: 450, budget: 280 }
      };

      const serviceMultipliers = {
        interior_design: 1.0,
        furniture: 1.2,
        complete_package: 1.8
      };

      const roomType = estimateData.roomType as keyof typeof baseCosts;
      const qualityLevel = estimateData.qualityLevel as keyof typeof baseCosts[typeof roomType];
      const serviceType = estimateData.serviceType as keyof typeof serviceMultipliers;

      const baseCostPerSqft = baseCosts[roomType]?.[qualityLevel] || 400;
      const serviceMultiplier = serviceMultipliers[serviceType] || 1.0;
      
      const materialCost = Math.round(baseCostPerSqft * estimateData.roomSize * serviceMultiplier * 0.6);
      const laborCost = Math.round(baseCostPerSqft * estimateData.roomSize * serviceMultiplier * 0.4);
      const totalCost = materialCost + laborCost;

      const estimate = await storage.createCostEstimate({
        ...estimateData,
        materialCost: materialCost.toString(),
        laborCost: laborCost.toString(),
        totalCost: totalCost.toString()
      });

      res.json(estimate);
    } catch (error) {
      console.error("Error creating cost estimate:", error);
      res.status(500).json({ message: "Failed to create cost estimate" });
    }
  });

  // Reviews
  app.get('/api/reviews', async (req, res) => {
    try {
      const { providerId, serviceId, productId } = req.query;
      const reviews = await storage.getReviews(
        providerId ? parseInt(providerId as string) : undefined,
        serviceId ? parseInt(serviceId as string) : undefined,
        productId ? parseInt(productId as string) : undefined
      );
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/reviews', demoIsAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id; // Use req.user.id for demo
      const reviewData = insertReviewSchema.parse({ ...req.body, userId });
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Search
  app.get('/api/search/services', async (req, res) => {
    try {
      const { q, location } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      const services = await storage.searchServices(q as string, location as string);
      res.json(services);
    } catch (error) {
      console.error("Error searching services:", error);
      res.status(500).json({ message: "Failed to search services" });
    }
  });

  app.get('/api/search/furniture', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      const products = await storage.searchFurnitureProducts(q as string);
      res.json(products);
    } catch (error) {
      console.error("Error searching furniture products:", error);
      res.status(500).json({ message: "Failed to search furniture products" });
    }
  });

  // Stripe payment routes
  if (stripe) {
    app.post("/api/create-payment-intent", async (req, res) => {
      try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "inr",
        });
        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        res.status(500).json({ message: "Error creating payment intent: " + error.message });
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}
