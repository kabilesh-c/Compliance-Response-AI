-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enums
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'PHARMACIST', 'INVENTORY_MANAGER', 'SALES_CLERK');
CREATE TYPE "OrganizationType" AS ENUM ('RETAIL_PHARMACY', 'HOSPITAL');
CREATE TYPE "AIActionType" AS ENUM ('REORDER_STOCK', 'ADJUST_PRICE', 'SEND_NOTIFICATION', 'FLAG_EXPIRY', 'ANALYZE_SALES');
CREATE TYPE "AIActionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXECUTED', 'FAILED');

-- Create Organization Table
CREATE TABLE "Organization" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL DEFAULT 'RETAIL_PHARMACY',
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "licenseNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Department Table (For Hospitals)
CREATE TABLE "Department" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "organizationId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "headOfDepartment" TEXT,
    "phoneNumber" TEXT, -- Added for N8N/WhatsApp integration
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create User Table
CREATE TABLE "User" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" TEXT UNIQUE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PHARMACIST',
    "phoneNumber" TEXT, -- Added for N8N/WhatsApp integration
    "organizationId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "departmentId" UUID REFERENCES "Department"("id") ON DELETE SET NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Supplier Table
CREATE TABLE "Supplier" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "contactPerson" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT, -- Added for AI Agent calls
    "address" TEXT,
    "organizationId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Product Table
CREATE TABLE "Product" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "genericName" TEXT,
    "description" TEXT,
    "manufacturer" TEXT,
    "barcode" TEXT,
    "sku" TEXT,
    "category" TEXT,
    "unit" TEXT NOT NULL DEFAULT 'pcs',
    "organizationId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Inventory Table
CREATE TABLE "Inventory" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "productId" UUID NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
    "batchNumber" TEXT,
    "expiryDate" TIMESTAMP(3),
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "costPrice" DECIMAL(10, 2) NOT NULL,
    "sellingPrice" DECIMAL(10, 2) NOT NULL,
    "location" TEXT,
    "supplierId" UUID REFERENCES "Supplier"("id") ON DELETE SET NULL,
    "organizationId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "departmentId" UUID REFERENCES "Department"("id") ON DELETE SET NULL,
    "lowStockThreshold" INTEGER DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Sale Table
CREATE TABLE "Sale" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "receiptNumber" TEXT UNIQUE NOT NULL,
    "totalAmount" DECIMAL(10, 2) NOT NULL,
    "paymentMethod" TEXT NOT NULL, -- 'CASH', 'CARD', 'INSURANCE', 'MOBILE_MONEY'
    "status" TEXT NOT NULL DEFAULT 'COMPLETED', -- 'COMPLETED', 'PENDING', 'CANCELLED'
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
    "organizationId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "patientId" TEXT, -- Optional link to a patient system
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create SaleItem Table
CREATE TABLE "SaleItem" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "saleId" UUID NOT NULL REFERENCES "Sale"("id") ON DELETE CASCADE,
    "inventoryId" UUID NOT NULL REFERENCES "Inventory"("id") ON DELETE RESTRICT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10, 2) NOT NULL,
    "subtotal" DECIMAL(10, 2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create InventoryReturn Table (New Feature)
CREATE TABLE "InventoryReturn" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "returnNumber" TEXT UNIQUE NOT NULL,
    "supplierId" UUID REFERENCES "Supplier"("id") ON DELETE RESTRICT,
    "organizationId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "status" TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'
    "reason" TEXT,
    "processedBy" UUID REFERENCES "User"("id"),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create InventoryReturnItem Table (New Feature)
CREATE TABLE "InventoryReturnItem" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "returnId" UUID NOT NULL REFERENCES "InventoryReturn"("id") ON DELETE CASCADE,
    "inventoryId" UUID NOT NULL REFERENCES "Inventory"("id") ON DELETE RESTRICT,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create AIActionLog Table (For AI Agent History)
CREATE TABLE "AIActionLog" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "actionType" "AIActionType" NOT NULL,
    "description" TEXT NOT NULL,
    "status" "AIActionStatus" NOT NULL DEFAULT 'PENDING',
    "confidenceScore" DECIMAL(5, 4), -- 0.0 to 1.0
    "metadata" JSONB, -- Store extra details like { "supplierId": "...", "orderId": "..." }
    "userId" UUID REFERENCES "User"("id") ON DELETE SET NULL, -- If triggered by a user
    "organizationId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executedAt" TIMESTAMP(3)
);

-- Create Indexes for Performance
CREATE INDEX "idx_inventory_product" ON "Inventory"("productId");
CREATE INDEX "idx_inventory_expiry" ON "Inventory"("expiryDate");
CREATE INDEX "idx_sale_organization" ON "Sale"("organizationId");
CREATE INDEX "idx_sale_created_at" ON "Sale"("createdAt");
CREATE INDEX "idx_aiaction_status" ON "AIActionLog"("status");
