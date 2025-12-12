/*
  Warnings:

  - A unique constraint covering the columns `[stockId,productId]` on the table `StockedProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StockedProduct_stockId_productId_key" ON "public"."StockedProduct"("stockId", "productId");
