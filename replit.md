# iBuildz - Real Estate Service Aggregator

## Overview

iBuildz is a comprehensive real estate service aggregator web application that connects property owners with verified construction service providers. The platform serves as a marketplace for interior design services and furniture solutions, specifically targeting the L.B. Nagar and B.N. Reddy areas with bilingual support (Telugu and English).

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom iBuildz theme (cream/beige color palette)
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: Custom i18n system supporting English and Telugu

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (via Neon serverless)
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **Payment Processing**: Stripe integration for furniture purchases

### Key Components

1. **Authentication System**
   - Three-factor authentication (email verification, reCAPTCHA, OTP)
   - Role-based access control (user, merchant, admin)
   - Session-based authentication using Replit Auth

2. **Service Management**
   - Service categories (Interior Design, Furniture)
   - Service provider profiles and portfolios
   - Service listings with pricing and availability
   - Booking and cost estimation system

3. **E-commerce Integration**
   - Furniture catalog with product management
   - Shopping cart and checkout flow
   - Stripe payment processing
   - Order management system

4. **User Portals**
   - **User Portal**: Browse services, view portfolios, book services, purchase furniture
   - **Merchant Portal**: Manage services, update availability, handle bookings

## Data Flow

1. **User Registration/Login**: Users authenticate via Replit Auth, creating profiles in the PostgreSQL database
2. **Service Discovery**: Users browse categorized services filtered by location (L.B. Nagar, B.N. Reddy)
3. **Service Booking**: Users submit booking requests to service providers
4. **Cost Estimation**: Real-time cost calculations based on room type, size, and service requirements
5. **Payment Processing**: Stripe handles secure payment transactions for furniture purchases
6. **Merchant Management**: Service providers manage their profiles, services, and bookings through dedicated portal

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **stripe**: Payment processing
- **passport**: Authentication middleware
- **openid-client**: OpenID Connect authentication

### UI Dependencies
- **@radix-ui/***: Headless UI components
- **@tanstack/react-query**: Server state management
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing
- **react-hook-form**: Form handling
- **zod**: Schema validation

## Deployment Strategy

### Development Environment
- **Development Server**: Vite dev server with HMR
- **Build Process**: Vite bundling for frontend, esbuild for backend
- **Environment**: Replit-optimized with runtime error overlay

### Production Build
- **Frontend**: Static assets generated in `dist/public`
- **Backend**: Bundled Node.js application in `dist/index.js`
- **Database**: Neon PostgreSQL serverless database
- **Session Store**: PostgreSQL-backed session storage

### Configuration
- **Environment Variables**: Database URL, Stripe keys, session secrets
- **Build Scripts**: Separate dev, build, and start commands
- **Database Migrations**: Drizzle Kit for schema management

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 07, 2025. Initial setup
- July 07, 2025. Removed Replit Authentication and implemented simple localStorage-based authentication
- July 07, 2025. Created About and Contact pages with bilingual support
- July 07, 2025. Added simple login portal for users and merchants
- July 07, 2025. Updated translation structure to support new page content

## Current Status
- Authentication: Simple demo authentication using localStorage
- Pages: Landing, Services, About, Contact, Login, Cost Estimator, Merchant Portal
- Database: PostgreSQL with Drizzle ORM
- Sample Data: Initialized with service providers, services, and furniture products
- Login System: Fully functional with hardcoded strings (no translation errors)

## Local Setup Instructions

### Prerequisites
1. **Node.js** (version 18 or higher)
2. **npm** (comes with Node.js)
3. **PostgreSQL database** (local installation or cloud service like Neon)

### Installation Steps

1. **Clone/Download the project files**
   ```bash
   git clone [your-repo-url]
   cd ibuildz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret_key
   NODE_ENV=development
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Initialize sample data** (optional)
   - Visit: `http://localhost:5000/api/init-sample-data`
   - Or use: `curl -X POST http://localhost:5000/api/init-sample-data`

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes