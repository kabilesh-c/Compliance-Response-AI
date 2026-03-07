# Design Document

## Overview

The Pharmacy Operations Application is a role-based web application designed for retail pharmacies and hospitals. Phase-1 focuses on exact UI/UX replication from Figma designs, implementing role-based dashboards, inventory management, and Point of Sale (POS) functionality with mock data. The application uses a modern tech stack with React/Next.js frontend, Node.js/Express backend, and PostgreSQL database.

The design emphasizes:
- Pixel-perfect UI replication with soft rounded cards, cream backgrounds, and yellow accents
- Role-based access control (Admin, Manager, Pharmacist)
- Real-time inventory tracking and expiry management
- Intuitive POS interface for quick sales processing
- Scalable architecture ready for Phase-2 AI integration

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │   React/Next.js Frontend Application               │    │
│  │   - Role-based routing                             │    │
│  │   - State management (Zustand/Redux)               │    │
│  │   - UI components (shadcn/ui + custom)             │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS/REST API
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │   Node.js/Express Backend API                      │    │
│  │   - Authentication middleware (JWT)                │    │
│  │   - Role-based authorization                       │    │
│  │   - Business logic services                        │    │
│  │   - API route handlers                             │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕ SQL Queries
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │   PostgreSQL Database                              │    │
│  │   - Users & Roles                                  │    │
│  │   - Medicines & Inventory                          │    │
│  │   - Orders & Transactions                          │    │
│  │   - Audit logs                                     │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui (customized to match Figma)
- State Management: Zustand
- Charts: Recharts
- HTTP Client: Axios
- Form Handling: React Hook Form + Zod validation

**Backend:**
- Runtime: Node.js 20+
- Framework: Express.js
- Language: TypeScript
- Authentication: JWT (jsonwebtoken)
- Password Hashing: bcrypt
- Validation: Zod
- ORM: Prisma

**Database:**
- Primary: PostgreSQL 15+
- Schema migrations: Prisma Migrate

**Development Tools:**
- Package Manager: npm/pnpm
- Linting: ESLint
- Formatting: Prettier
- Version Control: Git

## Components and Interfaces

### Frontend Component Structure

```
src/
├── app/                          # Next.js app router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/              # Protected route group
│   │   ├── layout.tsx            # Sidebar + top bar layout
│   │   ├── dashboard/
│   │   ├── pos/
│   │   ├── inventory/
│   │   ├── analytics/
│   │   ├── automation/
│   │   └── settings/
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # shadcn/ui base components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── dashboard/
│   │   ├── MedicineInfoCard.tsx
│   │   ├── ActiveSalesmanCard.tsx
│   │   ├── PrescriptionsCard.tsx
│   │   ├── RecentOrdersCard.tsx
│   │   ├── StockAlertCard.tsx
│   │   ├── ExpiredCard.tsx
│   │   ├── ExpiringSoonCard.tsx
│   │   └── MetricCard.tsx
│   ├── pos/
│   │   ├── ActiveOrdersBar.tsx
│   │   ├── MedicineCard.tsx
│   │   ├── MedicineGrid.tsx
│   │   └── BillingPanel.tsx
│   └── inventory/
│       ├── StockListTable.tsx
│       ├── ExpiryManagement.tsx
│       └── StockAlertsTable.tsx
├── lib/
│   ├── api.ts                    # API client
│   ├── auth.ts                   # Auth utilities
│   └── utils.ts                  # Helper functions
├── stores/
│   ├── authStore.ts              # User & auth state
│   ├── posStore.ts               # POS cart state
│   └── inventoryStore.ts         # Inventory filters
├── types/
│   └── index.ts                  # TypeScript types
└── styles/
    └── globals.css               # Global styles + Tailwind
```

### Backend API Structure

```
src/
├── controllers/
│   ├── authController.ts         # Login, signup, token refresh
│   ├── userController.ts         # User management
│   ├── medicineController.ts     # Medicine CRUD
│   ├── inventoryController.ts    # Stock operations
│   ├── orderController.ts        # Order processing
│   └── dashboardController.ts    # Dashboard aggregations
├── middleware/
│   ├── auth.ts                   # JWT verification
│   ├── roleCheck.ts              # Role-based access
│   ├── errorHandler.ts           # Global error handling
│   └── validation.ts             # Request validation
├── routes/
│   ├── authRoutes.ts
│   ├── userRoutes.ts
│   ├── medicineRoutes.ts
│   ├── inventoryRoutes.ts
│   ├── orderRoutes.ts
│   └── dashboardRoutes.ts
├── services/
│   ├── authService.ts            # Auth business logic
│   ├── medicineService.ts        # Medicine operations
│   ├── inventoryService.ts       # Inventory calculations
│   └── orderService.ts           # Order processing
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Mock data seeding
├── types/
│   └── index.ts                  # Shared types
└── server.ts                     # Express app entry
```

### Key API Endpoints

**Authentication:**
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user, return JWT
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile

**Dashboard:**
- `GET /api/dashboard/overview` - Get all dashboard data
- `GET /api/dashboard/medicine-info` - Medicine inventory stats
- `GET /api/dashboard/recent-orders` - Recent orders with filters
- `GET /api/dashboard/stock-alerts` - Low/zero stock items
- `GET /api/dashboard/expired` - Expired medicines
- `GET /api/dashboard/expiring-soon` - Medicines expiring by month
- `GET /api/dashboard/metrics` - Financial metrics

**Point of Sale:**
- `GET /api/pos/medicines` - Get available medicines for sale
- `GET /api/pos/active-orders` - Get active orders
- `POST /api/pos/orders` - Create new order
- `PUT /api/pos/orders/:id` - Update order
- `POST /api/pos/orders/:id/complete` - Complete sale

**Inventory:**
- `GET /api/inventory/medicines` - List all medicines with filters
- `GET /api/inventory/stock-alerts` - Low/zero stock alerts
- `GET /api/inventory/expiry` - Expiry management data
- `POST /api/inventory/medicines` - Add new medicine
- `PUT /api/inventory/medicines/:id` - Update medicine
- `DELETE /api/inventory/medicines/:id` - Remove medicine

**Analytics:**
- `GET /api/analytics/trends` - Inventory trends data
- `GET /api/analytics/waste` - Waste analytics
- `GET /api/analytics/reports` - Generate reports

**Settings:**
- `GET /api/settings/profile` - Get user profile
- `PUT /api/settings/profile` - Update profile
- `GET /api/settings/mode` - Get system mode (Retail/Hospital)
- `PUT /api/settings/mode` - Update system mode
- `GET /api/settings/roles` - Get role permissions (Admin only)

## Data Models

### Database Schema (Prisma)

```prisma
// User and Authentication
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String    // bcrypt hashed
  name          String
  role          Role      @default(PHARMACIST)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  orders        Order[]
  auditLogs     AuditLog[]
}

enum Role {
  ADMIN
  MANAGER
  PHARMACIST
}

// Medicine and Inventory
model Medicine {
  id            String    @id @default(uuid())
  name          String
  genericName   String?
  brand         String
  dosage        String
  form          String    // tablet, syrup, injection, etc.
  imageUrl      String?
  price         Decimal   @db.Decimal(10, 2)
  costPrice     Decimal?  @db.Decimal(10, 2)
  rack          String
  description   String?
  isCritical    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  batches       Batch[]
  orderItems    OrderItem[]
  
  @@index([name])
  @@index([brand])
}

model Batch {
  id            String    @id @default(uuid())
  medicineId    String
  batchNumber   String
  quantity      Int
  expiryDate    DateTime
  manufactureDate DateTime?
  supplier      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  medicine      Medicine  @relation(fields: [medicineId], references: [id], onDelete: Cascade)
  
  @@index([medicineId])
  @@index([expiryDate])
  @@unique([medicineId, batchNumber])
}

// Orders and Sales
model Order {
  id            String      @id @default(uuid())
  orderNumber   String      @unique
  patientName   String
  patientPhone  String?
  patientId     String?     // For hospital mode
  doctorName    String?
  orderType     OrderType   @default(RETAIL)
  status        OrderStatus @default(PENDING)
  subtotal      Decimal     @db.Decimal(10, 2)
  discount      Decimal     @default(0) @db.Decimal(10, 2)
  discountType  DiscountType @default(AMOUNT)
  total         Decimal     @db.Decimal(10, 2)
  received      Decimal     @default(0) @db.Decimal(10, 2)
  due           Decimal     @default(0) @db.Decimal(10, 2)
  paymentMethod PaymentMethod @default(CASH)
  counter       String?
  userId        String
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  completedAt   DateTime?
  
  user          User        @relation(fields: [userId], references: [id])
  items         OrderItem[]
  
  @@index([userId])
  @@index([status])
  @@index([orderType])
  @@index([createdAt])
}

enum OrderType {
  RETAIL
  OPD
  IPD
  OT
}

enum OrderStatus {
  PENDING
  COMPLETED
  CANCELLED
}

enum DiscountType {
  AMOUNT
  PERCENTAGE
}

enum PaymentMethod {
  CASH
  CARD
  CODE
}

model OrderItem {
  id            String    @id @default(uuid())
  orderId       String
  medicineId    String
  quantity      Int
  unitPrice     Decimal   @db.Decimal(10, 2)
  total         Decimal   @db.Decimal(10, 2)
  
  order         Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  medicine      Medicine  @relation(fields: [medicineId], references: [id])
  
  @@index([orderId])
  @@index([medicineId])
}

// System Configuration
model SystemConfig {
  id            String    @id @default(uuid())
  key           String    @unique
  value         String
  updatedAt     DateTime  @updatedAt
}

// Audit Trail
model AuditLog {
  id            String    @id @default(uuid())
  userId        String
  action        String
  entity        String
  entityId      String?
  details       Json?
  ipAddress     String?
  createdAt     DateTime  @default(now())
  
  user          User      @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([createdAt])
  @@index([entity])
}
```

### TypeScript Interfaces

```typescript
// Frontend Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'PHARMACIST';
  isActive: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  brand: string;
  dosage: string;
  form: string;
  imageUrl?: string;
  price: number;
  costPrice?: number;
  rack: string;
  description?: string;
  isCritical: boolean;
  totalStock: number;
  batches: Batch[];
}

export interface Batch {
  id: string;
  medicineId: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  manufactureDate?: string;
  supplier?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  patientName: string;
  patientPhone?: string;
  patientId?: string;
  doctorName?: string;
  orderType: 'RETAIL' | 'OPD' | 'IPD' | 'OT';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  subtotal: number;
  discount: number;
  discountType: 'AMOUNT' | 'PERCENTAGE';
  total: number;
  received: number;
  due: number;
  paymentMethod: 'CASH' | 'CARD' | 'CODE';
  counter?: string;
  items: OrderItem[];
  createdAt: string;
  completedAt?: string;
}

export interface OrderItem {
  id: string;
  medicineId: string;
  medicine: Medicine;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface DashboardData {
  medicineInfo: {
    available: number;
    lowStock: number;
    outOfStock: number;
  };
  activeSalesmen: User[];
  prescriptions: {
    patientCount: number;
    customerCount: number;
    completionRate: number;
  };
  recentOrders: Order[];
  stockAlerts: StockAlert[];
  expired: ExpiredMedicine[];
  expiringSoon: ExpiringSoonData;
  metrics: FinancialMetrics;
}

export interface StockAlert {
  medicine: Medicine;
  currentStock: number;
  status: 'LOW_STOCK' | 'ZERO_STOCK' | 'REQUESTED';
}

export interface ExpiredMedicine {
  medicine: Medicine;
  batch: Batch;
  expiryDate: string;
}

export interface ExpiringSoonData {
  byMonth: {
    month: string;
    count: number;
    medicines: Array<{
      medicine: Medicine;
      batch: Batch;
      expiryDate: string;
    }>;
  }[];
}

export interface FinancialMetrics {
  invoices: number;
  paid: number;
  discount: number;
  dues: number;
  refund: number;
}

// POS Cart State
export interface CartItem {
  medicine: Medicine;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountType: 'AMOUNT' | 'PERCENTAGE';
  total: number;
  received: number;
  due: number;
  paymentMethod: 'CASH' | 'CARD' | 'CODE';
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

