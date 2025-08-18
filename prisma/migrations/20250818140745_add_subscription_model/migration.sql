/*
  Warnings:

  - You are about to drop the column `billingInterval` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `nextRenewalDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `priceCents` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `billingCycle` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextRenewal` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."BillingCycle" AS ENUM ('MONTHLY', 'YEARLY');

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Subscription" DROP COLUMN "billingInterval",
DROP COLUMN "nextRenewalDate",
DROP COLUMN "priceCents",
ADD COLUMN     "billingCycle" "public"."BillingCycle" NOT NULL,
ADD COLUMN     "cost" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "nextRenewal" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "currency" SET DEFAULT 'USD',
ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "public"."Subscription"("userId");

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
