/*
  Warnings:

  - The `type` column on the `Stock` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Stock` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdAt` on the `StockedProduct` table. All the data in the column will be lost.
  - Added the required column `userCreatorId` to the `MovementBatch` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `MovementBatch` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."StockTypeEnum" AS ENUM ('CENTRAL', 'SECONDARY');

-- CreateEnum
CREATE TYPE "public"."StockStatusEnum" AS ENUM ('ACTIVE', 'MAINTENANCE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."MovementTypeEnum" AS ENUM ('ENTRY', 'EXIT', 'TRANSFER');

-- AlterTable
ALTER TABLE "public"."MovementBatch" ADD COLUMN     "userCreatorId" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "public"."MovementTypeEnum" NOT NULL;

-- AlterTable
ALTER TABLE "public"."MovementProduct" ADD COLUMN     "pricePerUnit" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "public"."Stock" DROP COLUMN "type",
ADD COLUMN     "type" "public"."StockTypeEnum" NOT NULL DEFAULT 'CENTRAL',
DROP COLUMN "status",
ADD COLUMN     "status" "public"."StockStatusEnum" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "public"."StockedProduct" DROP COLUMN "createdAt",
ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(65,30);

-- AddForeignKey
ALTER TABLE "public"."MovementBatch" ADD CONSTRAINT "MovementBatch_userCreatorId_fkey" FOREIGN KEY ("userCreatorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
