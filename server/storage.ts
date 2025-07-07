import {
  users,
  serviceCategories,
  serviceProviders,
  services,
  furnitureProducts,
  bookings,
  furnitureOrders,
  reviews,
  costEstimates,
  type User,
  type UpsertUser,
  type ServiceCategory,
  type ServiceProvider,
  type Service,
  type FurnitureProduct,
  type Booking,
  type FurnitureOrder,
  type Review,
  type CostEstimate,
  type InsertServiceCategory,
  type InsertServiceProvider,
  type InsertService,
  type InsertFurnitureProduct,
  type InsertBooking,
  type InsertFurnitureOrder,
  type InsertReview,
  type InsertCostEstimate,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, like, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Service categories
  getServiceCategories(): Promise<ServiceCategory[]>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;

  // Service providers
  getServiceProviders(location?: string): Promise<ServiceProvider[]>;
  getServiceProviderById(id: number): Promise<ServiceProvider | undefined>;
  createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;
  updateServiceProvider(id: number, provider: Partial<InsertServiceProvider>): Promise<ServiceProvider>;

  // Services
  getServices(categoryId?: number, providerId?: number): Promise<Service[]>;
  getServiceById(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;

  // Furniture products
  getFurnitureProducts(providerId?: number, category?: string): Promise<FurnitureProduct[]>;
  getFurnitureProductById(id: number): Promise<FurnitureProduct | undefined>;
  createFurnitureProduct(product: InsertFurnitureProduct): Promise<FurnitureProduct>;
  updateFurnitureProduct(id: number, product: Partial<InsertFurnitureProduct>): Promise<FurnitureProduct>;

  // Bookings
  getBookings(userId?: string, providerId?: number): Promise<Booking[]>;
  getBookingById(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking>;

  // Furniture orders
  getFurnitureOrders(userId?: string, providerId?: number): Promise<FurnitureOrder[]>;
  getFurnitureOrderById(id: number): Promise<FurnitureOrder | undefined>;
  createFurnitureOrder(order: InsertFurnitureOrder): Promise<FurnitureOrder>;
  updateFurnitureOrder(id: number, order: Partial<InsertFurnitureOrder>): Promise<FurnitureOrder>;

  // Reviews
  getReviews(providerId?: number, serviceId?: number, productId?: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Cost estimates
  getCostEstimates(userId?: string): Promise<CostEstimate[]>;
  createCostEstimate(estimate: InsertCostEstimate): Promise<CostEstimate>;

  // Search
  searchServices(query: string, location?: string): Promise<Service[]>;
  searchFurnitureProducts(query: string): Promise<FurnitureProduct[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Service categories
  async getServiceCategories(): Promise<ServiceCategory[]> {
    return await db.select().from(serviceCategories);
  }

  async createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory> {
    const [newCategory] = await db.insert(serviceCategories).values(category).returning();
    return newCategory;
  }

  // Service providers
  async getServiceProviders(location?: string): Promise<ServiceProvider[]> {
    if (location) {
      return await db.select().from(serviceProviders).where(
        and(eq(serviceProviders.isActive, true), eq(serviceProviders.location, location))
      );
    }
    return await db.select().from(serviceProviders).where(eq(serviceProviders.isActive, true));
  }

  async getServiceProviderById(id: number): Promise<ServiceProvider | undefined> {
    const [provider] = await db.select().from(serviceProviders).where(eq(serviceProviders.id, id));
    return provider;
  }

  async createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider> {
    const [newProvider] = await db.insert(serviceProviders).values(provider).returning();
    return newProvider;
  }

  async updateServiceProvider(id: number, provider: Partial<InsertServiceProvider>): Promise<ServiceProvider> {
    const [updatedProvider] = await db
      .update(serviceProviders)
      .set(provider)
      .where(eq(serviceProviders.id, id))
      .returning();
    return updatedProvider;
  }

  // Services
  async getServices(categoryId?: number, providerId?: number): Promise<Service[]> {
    let query = db.select().from(services);
    
    if (categoryId && providerId) {
      return await db.select().from(services).where(
        and(eq(services.categoryId, categoryId), eq(services.providerId, providerId))
      );
    } else if (categoryId) {
      return await db.select().from(services).where(eq(services.categoryId, categoryId));
    } else if (providerId) {
      return await db.select().from(services).where(eq(services.providerId, providerId));
    }
    
    return await db.select().from(services);
  }

  async getServiceById(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  // Furniture products
  async getFurnitureProducts(providerId?: number, category?: string): Promise<FurnitureProduct[]> {
    if (providerId && category) {
      return await db.select().from(furnitureProducts).where(
        and(eq(furnitureProducts.providerId, providerId), eq(furnitureProducts.category, category))
      );
    } else if (providerId) {
      return await db.select().from(furnitureProducts).where(eq(furnitureProducts.providerId, providerId));
    } else if (category) {
      return await db.select().from(furnitureProducts).where(eq(furnitureProducts.category, category));
    }
    
    return await db.select().from(furnitureProducts);
  }

  async getFurnitureProductById(id: number): Promise<FurnitureProduct | undefined> {
    const [product] = await db.select().from(furnitureProducts).where(eq(furnitureProducts.id, id));
    return product;
  }

  async createFurnitureProduct(product: InsertFurnitureProduct): Promise<FurnitureProduct> {
    const [newProduct] = await db.insert(furnitureProducts).values(product).returning();
    return newProduct;
  }

  async updateFurnitureProduct(id: number, product: Partial<InsertFurnitureProduct>): Promise<FurnitureProduct> {
    const [updatedProduct] = await db
      .update(furnitureProducts)
      .set(product)
      .where(eq(furnitureProducts.id, id))
      .returning();
    return updatedProduct;
  }

  // Bookings
  async getBookings(userId?: string, providerId?: number): Promise<Booking[]> {
    if (userId && providerId) {
      return await db.select().from(bookings).where(
        and(eq(bookings.userId, userId), eq(bookings.providerId, providerId))
      );
    } else if (userId) {
      return await db.select().from(bookings).where(eq(bookings.userId, userId));
    } else if (providerId) {
      return await db.select().from(bookings).where(eq(bookings.providerId, providerId));
    }
    
    return await db.select().from(bookings);
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking> {
    const [updatedBooking] = await db
      .update(bookings)
      .set(booking)
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }

  // Furniture orders
  async getFurnitureOrders(userId?: string, providerId?: number): Promise<FurnitureOrder[]> {
    if (userId && providerId) {
      return await db.select().from(furnitureOrders).where(
        and(eq(furnitureOrders.userId, userId), eq(furnitureOrders.providerId, providerId))
      );
    } else if (userId) {
      return await db.select().from(furnitureOrders).where(eq(furnitureOrders.userId, userId));
    } else if (providerId) {
      return await db.select().from(furnitureOrders).where(eq(furnitureOrders.providerId, providerId));
    }
    
    return await db.select().from(furnitureOrders);
  }

  async getFurnitureOrderById(id: number): Promise<FurnitureOrder | undefined> {
    const [order] = await db.select().from(furnitureOrders).where(eq(furnitureOrders.id, id));
    return order;
  }

  async createFurnitureOrder(order: InsertFurnitureOrder): Promise<FurnitureOrder> {
    const [newOrder] = await db.insert(furnitureOrders).values(order).returning();
    return newOrder;
  }

  async updateFurnitureOrder(id: number, order: Partial<InsertFurnitureOrder>): Promise<FurnitureOrder> {
    const [updatedOrder] = await db
      .update(furnitureOrders)
      .set(order)
      .where(eq(furnitureOrders.id, id))
      .returning();
    return updatedOrder;
  }

  // Reviews
  async getReviews(providerId?: number, serviceId?: number, productId?: number): Promise<Review[]> {
    const conditions = [];
    if (providerId) conditions.push(eq(reviews.providerId, providerId));
    if (serviceId) conditions.push(eq(reviews.serviceId, serviceId));
    if (productId) conditions.push(eq(reviews.productId, productId));
    
    if (conditions.length > 0) {
      return await db.select().from(reviews).where(and(...conditions));
    }
    
    return await db.select().from(reviews);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  // Cost estimates
  async getCostEstimates(userId?: string): Promise<CostEstimate[]> {
    if (userId) {
      return await db.select().from(costEstimates).where(eq(costEstimates.userId, userId));
    }
    return await db.select().from(costEstimates);
  }

  async createCostEstimate(estimate: InsertCostEstimate): Promise<CostEstimate> {
    const [newEstimate] = await db.insert(costEstimates).values(estimate).returning();
    return newEstimate;
  }

  // Search
  async searchServices(query: string, location?: string): Promise<Service[]> {
    const conditions = [like(services.title, `%${query}%`)];
    if (location) {
      // Note: This would require joining with service providers to search by location
      // For now, we'll just search by service title
    }
    
    return await db.select().from(services).where(and(...conditions));
  }

  async searchFurnitureProducts(query: string): Promise<FurnitureProduct[]> {
    return await db.select().from(furnitureProducts).where(like(furnitureProducts.name, `%${query}%`));
  }
}

export const storage = new DatabaseStorage();