/*
  Warnings:

  - You are about to drop the `nfeProductMapping` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."nfeProductMapping" DROP CONSTRAINT "nfeProductMapping_productId_fkey";

-- DropTable
DROP TABLE "public"."nfeProductMapping";

-- CreateTable
CREATE TABLE "public"."NfeProductMapping" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "nfeProductId" TEXT NOT NULL,

    CONSTRAINT "NfeProductMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "public"."RefreshToken"("token");

-- AddForeignKey
ALTER TABLE "public"."NfeProductMapping" ADD CONSTRAINT "NfeProductMapping_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
