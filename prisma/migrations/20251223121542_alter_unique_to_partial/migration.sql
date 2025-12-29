-- Product
DROP INDEX "Product_codebar_key";
CREATE UNIQUE INDEX "product_name_active_idx" ON "Product"("name") WHERE "active" = true;
CREATE UNIQUE INDEX "product_codebar_active_idx" ON "Product"("codebar") WHERE "active" = true;

-- User
DROP INDEX "User_email_key";
DROP INDEX "User_username_key";
CREATE UNIQUE INDEX "user_username_active_idx" ON "User"("username") WHERE "active" = true;
CREATE UNIQUE INDEX "user_email_active_idx" ON "User"("email") WHERE "active" = true;

-- Stock
CREATE UNIQUE INDEX "stock_name_active_idx" ON "Stock"("name") WHERE "active" = true;