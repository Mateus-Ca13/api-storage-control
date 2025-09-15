/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `MovementBatch` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MovementBatch` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `MovementProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MovementProduct` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `NfeProductMapping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `NfeProductMapping` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `categoryId` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `RefreshToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RefreshToken` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Stock` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Stock` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `StockedProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `StockedProduct` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `destinationStockId` to the `MovementBatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originStockId` to the `MovementBatch` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userCreatorId` on the `MovementBatch` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productId` on the `MovementProduct` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `movementBatchId` on the `MovementProduct` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productId` on the `NfeProductMapping` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `RefreshToken` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productId` on the `StockedProduct` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stockId` on the `StockedProduct` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."MovementBatch" DROP CONSTRAINT "MovementBatch_userCreatorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MovementProduct" DROP CONSTRAINT "MovementProduct_movementBatchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MovementProduct" DROP CONSTRAINT "MovementProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NfeProductMapping" DROP CONSTRAINT "NfeProductMapping_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockedProduct" DROP CONSTRAINT "StockedProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockedProduct" DROP CONSTRAINT "StockedProduct_stockId_fkey";

-- AlterTable
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."MovementBatch" DROP CONSTRAINT "MovementBatch_pkey",
ADD COLUMN     "destinationStockId" INTEGER NOT NULL,
ADD COLUMN     "originStockId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userCreatorId",
ADD COLUMN     "userCreatorId" INTEGER NOT NULL,
ADD CONSTRAINT "MovementBatch_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."MovementProduct" DROP CONSTRAINT "MovementProduct_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL,
DROP COLUMN "movementBatchId",
ADD COLUMN     "movementBatchId" INTEGER NOT NULL,
ADD CONSTRAINT "MovementProduct_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."NfeProductMapping" DROP CONSTRAINT "NfeProductMapping_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD CONSTRAINT "NfeProductMapping_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."RefreshToken" DROP CONSTRAINT "RefreshToken_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Stock" DROP CONSTRAINT "Stock_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Stock_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."StockedProduct" DROP CONSTRAINT "StockedProduct_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL,
DROP COLUMN "stockId",
ADD COLUMN     "stockId" INTEGER NOT NULL,
ADD CONSTRAINT "StockedProduct_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockedProduct" ADD CONSTRAINT "StockedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockedProduct" ADD CONSTRAINT "StockedProduct_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "public"."Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovementBatch" ADD CONSTRAINT "MovementBatch_originStockId_fkey" FOREIGN KEY ("originStockId") REFERENCES "public"."Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovementBatch" ADD CONSTRAINT "MovementBatch_destinationStockId_fkey" FOREIGN KEY ("destinationStockId") REFERENCES "public"."Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovementBatch" ADD CONSTRAINT "MovementBatch_userCreatorId_fkey" FOREIGN KEY ("userCreatorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovementProduct" ADD CONSTRAINT "MovementProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovementProduct" ADD CONSTRAINT "MovementProduct_movementBatchId_fkey" FOREIGN KEY ("movementBatchId") REFERENCES "public"."MovementBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NfeProductMapping" ADD CONSTRAINT "NfeProductMapping_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
