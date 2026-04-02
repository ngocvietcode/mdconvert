CREATE TABLE "EndpointConnectionConfig" (
    "id" TEXT NOT NULL,
    "endpointSlug" TEXT NOT NULL,
    "connections" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EndpointConnectionConfig_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EndpointConnectionConfig_endpointSlug_key" ON "EndpointConnectionConfig"("endpointSlug");
CREATE INDEX "EndpointConnectionConfig_endpointSlug_idx" ON "EndpointConnectionConfig"("endpointSlug");
