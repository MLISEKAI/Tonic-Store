-- CreateEnum
CREATE TYPE "PaymentGateway" AS ENUM ('ZALO_PAY', 'MOMO', 'PAYPAL', 'BANK_TRANSFER', 'VN_PAY');

-- CreateEnum
CREATE TYPE "PaymentGatewayStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'ZALO_PAY';

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'MOMO';

-- CreateTable
CREATE TABLE "TopUpPackage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(15,2) NOT NULL,
    "bonusAmount" DECIMAL(15,2),
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopUpPackage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TopUpPackage_isActive_idx" ON "TopUpPackage"("isActive");

-- CreateIndex
CREATE INDEX "TopUpPackage_displayOrder_idx" ON "TopUpPackage"("displayOrder");

-- CreateTable
CREATE TABLE "PaymentGatewayTransaction" (
    "id" SERIAL NOT NULL,
    "walletId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "gateway" "PaymentGateway" NOT NULL,
    "status" "PaymentGatewayStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "gatewayTransactionId" TEXT,
    "gatewayResponse" JSONB,
    "description" TEXT,
    "metadata" JSONB,
    "idempotencyKey" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentGatewayTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentGatewayTransaction_gatewayTransactionId_key" ON "PaymentGatewayTransaction"("gatewayTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentGatewayTransaction_idempotencyKey_key" ON "PaymentGatewayTransaction"("idempotencyKey");

-- CreateIndex
CREATE INDEX "PaymentGatewayTransaction_walletId_idx" ON "PaymentGatewayTransaction"("walletId");

-- CreateIndex
CREATE INDEX "PaymentGatewayTransaction_userId_idx" ON "PaymentGatewayTransaction"("userId");

-- CreateIndex
CREATE INDEX "PaymentGatewayTransaction_idempotencyKey_idx" ON "PaymentGatewayTransaction"("idempotencyKey");

-- CreateIndex
CREATE INDEX "PaymentGatewayTransaction_gateway_status_idx" ON "PaymentGatewayTransaction"("gateway", "status");

-- AddForeignKey
ALTER TABLE "PaymentGatewayTransaction" ADD CONSTRAINT "PaymentGatewayTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentGatewayTransaction" ADD CONSTRAINT "PaymentGatewayTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
