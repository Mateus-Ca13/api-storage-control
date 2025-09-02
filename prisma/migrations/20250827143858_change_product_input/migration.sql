/*
  Warnings:

  - Made the column `measurement` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "measurement" SET NOT NULL;
