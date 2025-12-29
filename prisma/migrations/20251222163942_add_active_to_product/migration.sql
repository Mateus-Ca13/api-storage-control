-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
