/*
  Warnings:

  - The `measurement` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."ProductMeasurementEnum" AS ENUM ('UN', 'KG', 'L', 'M');

-- CreateEnum
CREATE TYPE "public"."UserRoleEnum" AS ENUM ('ADMIN', 'USER', 'SUPER_ADMIN');

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "measurement",
ADD COLUMN     "measurement" "public"."ProductMeasurementEnum" NOT NULL DEFAULT 'UN';

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "role",
ADD COLUMN     "role" "public"."UserRoleEnum" NOT NULL DEFAULT 'ADMIN';
