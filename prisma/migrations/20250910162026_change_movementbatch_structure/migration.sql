-- DropForeignKey
ALTER TABLE "public"."MovementBatch" DROP CONSTRAINT "MovementBatch_destinationStockId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MovementBatch" DROP CONSTRAINT "MovementBatch_originStockId_fkey";

-- AlterTable
ALTER TABLE "public"."MovementBatch" ALTER COLUMN "destinationStockId" DROP NOT NULL,
ALTER COLUMN "originStockId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."MovementBatch" ADD CONSTRAINT "MovementBatch_originStockId_fkey" FOREIGN KEY ("originStockId") REFERENCES "public"."Stock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovementBatch" ADD CONSTRAINT "MovementBatch_destinationStockId_fkey" FOREIGN KEY ("destinationStockId") REFERENCES "public"."Stock"("id") ON DELETE SET NULL ON UPDATE CASCADE;
