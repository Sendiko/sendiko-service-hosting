CREATE TABLE "public"."Billing" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Billing_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Billing_clientId_idx" ON "public"."Billing"("clientId");
CREATE INDEX "Billing_date_idx" ON "public"."Billing"("date");

ALTER TABLE "public"."Billing"
ADD CONSTRAINT "Billing_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
