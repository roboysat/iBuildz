import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // user, merchant, admin
  phone: varchar("phone"),
  location: varchar("location"), // L.B. Nagar, B.N. Reddy
  language: varchar("language").default("en"), // en, te
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Service categories
export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  nameTE: varchar("name_te"), // Telugu translation
  description: text("description"),
  descriptionTE: text("description_te"),
  icon: varchar("icon"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Service providers (merchants)
export const serviceProviders = pgTable("service_providers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  businessName: varchar("business_name").notNull(),
  businessNameTE: varchar("business_name_te"),
  description: text("description"),
  descriptionTE: text("description_te"),
  categoryId: integer("category_id").references(() => serviceCategories.id),
  location: varchar("location").notNull(),
  phone: varchar("phone").notNull(),
  email: varchar("email"),
  website: varchar("website"),
  experience: integer("experience"), // years
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: integer("review_count").default(0),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services offered by providers
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => serviceProviders.id),
  categoryId: integer("category_id").references(() => serviceCategories.id),
  title: varchar("title").notNull(),
  titleTE: varchar("title_te"),
  description: text("description"),
  descriptionTE: text("description_te"),
  price: decimal("price", { precision: 10, scale: 2 }),
  priceUnit: varchar("price_unit").default("per_project"), // per_project, per_sqft, per_hour
  images: jsonb("images"), // array of image URLs
  features: jsonb("features"), // array of features
  featuresTE: jsonb("features_te"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Furniture products
export const furnitureProducts = pgTable("furniture_products", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => serviceProviders.id),
  name: varchar("name").notNull(),
  nameTE: varchar("name_te"),
  description: text("description"),
  descriptionTE: text("description_te"),
  category: varchar("category").notNull(), // sofa, table, chair, wardrobe, etc.
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discountPrice: decimal("discount_price", { precision: 10, scale: 2 }),
  images: jsonb("images"), // array of image URLs
  materials: jsonb("materials"), // wood, metal, fabric, etc.
  dimensions: jsonb("dimensions"), // {width, height, depth}
  colors: jsonb("colors"), // available colors
  inStock: boolean("in_stock").default(true),
  stockQuantity: integer("stock_quantity").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: integer("review_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Service bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  serviceId: integer("service_id").references(() => services.id),
  providerId: integer("provider_id").references(() => serviceProviders.id),
  status: varchar("status").default("pending"), // pending, confirmed, in_progress, completed, cancelled
  scheduledDate: timestamp("scheduled_date"),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  finalCost: decimal("final_cost", { precision: 10, scale: 2 }),
  notes: text("notes"),
  customerName: varchar("customer_name").notNull(),
  customerPhone: varchar("customer_phone").notNull(),
  customerEmail: varchar("customer_email"),
  location: varchar("location").notNull(),
  projectDetails: jsonb("project_details"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Furniture orders
export const furnitureOrders = pgTable("furniture_orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  providerId: integer("provider_id").references(() => serviceProviders.id),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").default("pending"), // pending, confirmed, shipped, delivered, cancelled
  paymentStatus: varchar("payment_status").default("pending"), // pending, completed, failed
  paymentMethod: varchar("payment_method"), // stripe, upi
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  shippingAddress: jsonb("shipping_address"),
  customerName: varchar("customer_name").notNull(),
  customerPhone: varchar("customer_phone").notNull(),
  customerEmail: varchar("customer_email"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Furniture order items
export const furnitureOrderItems = pgTable("furniture_order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => furnitureOrders.id),
  productId: integer("product_id").references(() => furnitureProducts.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  selectedColor: varchar("selected_color"),
  selectedMaterial: varchar("selected_material"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews and ratings
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  providerId: integer("provider_id").references(() => serviceProviders.id),
  serviceId: integer("service_id").references(() => services.id),
  productId: integer("product_id").references(() => furnitureProducts.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  commentTE: text("comment_te"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cost estimates
export const costEstimates = pgTable("cost_estimates", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  roomType: varchar("room_type").notNull(),
  roomSize: integer("room_size").notNull(), // sq ft
  serviceType: varchar("service_type").notNull(), // interior_design, furniture, complete_package
  qualityLevel: varchar("quality_level").notNull(), // premium, standard, budget
  materialCost: decimal("material_cost", { precision: 10, scale: 2 }),
  laborCost: decimal("labor_cost", { precision: 10, scale: 2 }),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  location: varchar("location"),
  estimateDetails: jsonb("estimate_details"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const userRelations = relations(users, ({ many }) => ({
  serviceProviders: many(serviceProviders),
  bookings: many(bookings),
  furnitureOrders: many(furnitureOrders),
  reviews: many(reviews),
  costEstimates: many(costEstimates),
}));

export const serviceProviderRelations = relations(serviceProviders, ({ one, many }) => ({
  user: one(users, { fields: [serviceProviders.userId], references: [users.id] }),
  category: one(serviceCategories, { fields: [serviceProviders.categoryId], references: [serviceCategories.id] }),
  services: many(services),
  furnitureProducts: many(furnitureProducts),
  bookings: many(bookings),
  furnitureOrders: many(furnitureOrders),
  reviews: many(reviews),
}));

export const serviceRelations = relations(services, ({ one, many }) => ({
  provider: one(serviceProviders, { fields: [services.providerId], references: [serviceProviders.id] }),
  category: one(serviceCategories, { fields: [services.categoryId], references: [serviceCategories.id] }),
  bookings: many(bookings),
  reviews: many(reviews),
}));

export const furnitureProductRelations = relations(furnitureProducts, ({ one, many }) => ({
  provider: one(serviceProviders, { fields: [furnitureProducts.providerId], references: [serviceProviders.id] }),
  orderItems: many(furnitureOrderItems),
  reviews: many(reviews),
}));

export const bookingRelations = relations(bookings, ({ one }) => ({
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
  service: one(services, { fields: [bookings.serviceId], references: [services.id] }),
  provider: one(serviceProviders, { fields: [bookings.providerId], references: [serviceProviders.id] }),
}));

export const furnitureOrderRelations = relations(furnitureOrders, ({ one, many }) => ({
  user: one(users, { fields: [furnitureOrders.userId], references: [users.id] }),
  provider: one(serviceProviders, { fields: [furnitureOrders.providerId], references: [serviceProviders.id] }),
  items: many(furnitureOrderItems),
}));

export const furnitureOrderItemRelations = relations(furnitureOrderItems, ({ one }) => ({
  order: one(furnitureOrders, { fields: [furnitureOrderItems.orderId], references: [furnitureOrders.id] }),
  product: one(furnitureProducts, { fields: [furnitureOrderItems.productId], references: [furnitureProducts.id] }),
}));

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  provider: one(serviceProviders, { fields: [reviews.providerId], references: [serviceProviders.id] }),
  service: one(services, { fields: [reviews.serviceId], references: [services.id] }),
  product: one(furnitureProducts, { fields: [reviews.productId], references: [furnitureProducts.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({ id: true, createdAt: true });
export const insertServiceProviderSchema = createInsertSchema(serviceProviders).omit({ id: true, createdAt: true, updatedAt: true });
export const insertServiceSchema = createInsertSchema(services).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFurnitureProductSchema = createInsertSchema(furnitureProducts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFurnitureOrderSchema = createInsertSchema(furnitureOrders).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFurnitureOrderItemSchema = createInsertSchema(furnitureOrderItems).omit({ id: true, createdAt: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export const insertCostEstimateSchema = createInsertSchema(costEstimates).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type ServiceProvider = typeof serviceProviders.$inferSelect;
export type Service = typeof services.$inferSelect;
export type FurnitureProduct = typeof furnitureProducts.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type FurnitureOrder = typeof furnitureOrders.$inferSelect;
export type FurnitureOrderItem = typeof furnitureOrderItems.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type CostEstimate = typeof costEstimates.$inferSelect;

export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;
export type InsertServiceProvider = z.infer<typeof insertServiceProviderSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertFurnitureProduct = z.infer<typeof insertFurnitureProductSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertFurnitureOrder = z.infer<typeof insertFurnitureOrderSchema>;
export type InsertFurnitureOrderItem = z.infer<typeof insertFurnitureOrderItemSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertCostEstimate = z.infer<typeof insertCostEstimateSchema>;
