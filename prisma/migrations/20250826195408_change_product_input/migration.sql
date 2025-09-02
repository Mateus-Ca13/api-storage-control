/*
  Warnings:

  - You are about to drop the column `isBelowMinimum` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `minimumAmount` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "isBelowMinimum",
DROP COLUMN "minimumAmount",
ADD COLUMN     "isBelowMinStock" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "minStock" DECIMAL(10,2) NOT NULL DEFAULT 0;
