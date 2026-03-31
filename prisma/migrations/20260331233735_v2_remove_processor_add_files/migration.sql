-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL,
    "apiKeyId" TEXT,
    "idempotencyKey" TEXT,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "state" TEXT NOT NULL DEFAULT 'RUNNING',
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "progressMessage" TEXT,
    "endpointSlug" TEXT,
    "pipelineJson" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "failedAtStep" INTEGER,
    "filesJson" TEXT,
    "outputFormat" TEXT NOT NULL DEFAULT 'json',
    "outputContent" TEXT,
    "outputFilePath" TEXT,
    "extractedData" TEXT,
    "stepsResultJson" TEXT,
    "totalInputTokens" INTEGER NOT NULL DEFAULT 0,
    "totalOutputTokens" INTEGER NOT NULL DEFAULT 0,
    "pagesProcessed" INTEGER NOT NULL DEFAULT 0,
    "modelUsed" TEXT,
    "totalCostUsd" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "usageBreakdown" TEXT,
    "webhookUrl" TEXT,
    "webhookSentAt" TIMESTAMP(3),
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "filesDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STANDARD',
    "spendingLimit" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalUsed" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalApiConnection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "endpointUrl" TEXT NOT NULL,
    "httpMethod" TEXT NOT NULL DEFAULT 'POST',
    "authType" TEXT NOT NULL DEFAULT 'API_KEY_HEADER',
    "authKeyHeader" TEXT NOT NULL DEFAULT 'x-api-key',
    "authSecret" TEXT NOT NULL,
    "promptFieldName" TEXT NOT NULL DEFAULT 'query',
    "fileFieldName" TEXT NOT NULL DEFAULT 'files',
    "defaultPrompt" TEXT NOT NULL,
    "staticFormFields" TEXT,
    "extraHeaders" TEXT,
    "responseContentPath" TEXT DEFAULT 'content',
    "timeoutSec" INTEGER NOT NULL DEFAULT 60,
    "state" TEXT NOT NULL DEFAULT 'ENABLED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalApiConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalApiOverride" (
    "id" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "promptOverride" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalApiOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileEndpoint" (
    "id" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "endpointSlug" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "defaultParams" TEXT,
    "profileParams" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileEndpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Operation_idempotencyKey_key" ON "Operation"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Operation_state_idx" ON "Operation"("state");

-- CreateIndex
CREATE INDEX "Operation_apiKeyId_createdAt_idx" ON "Operation"("apiKeyId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Operation_createdAt_idx" ON "Operation"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Operation_idempotencyKey_idx" ON "Operation"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Operation_endpointSlug_idx" ON "Operation"("endpointSlug");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_keyHash_key" ON "ApiKey"("keyHash");

-- CreateIndex
CREATE INDEX "ApiKey_status_idx" ON "ApiKey"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalApiConnection_slug_key" ON "ExternalApiConnection"("slug");

-- CreateIndex
CREATE INDEX "ExternalApiConnection_slug_idx" ON "ExternalApiConnection"("slug");

-- CreateIndex
CREATE INDEX "ExternalApiConnection_state_idx" ON "ExternalApiConnection"("state");

-- CreateIndex
CREATE INDEX "ExternalApiOverride_apiKeyId_idx" ON "ExternalApiOverride"("apiKeyId");

-- CreateIndex
CREATE INDEX "ExternalApiOverride_connectionId_idx" ON "ExternalApiOverride"("connectionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalApiOverride_connectionId_apiKeyId_key" ON "ExternalApiOverride"("connectionId", "apiKeyId");

-- CreateIndex
CREATE INDEX "ProfileEndpoint_apiKeyId_idx" ON "ProfileEndpoint"("apiKeyId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileEndpoint_apiKeyId_endpointSlug_key" ON "ProfileEndpoint"("apiKeyId", "endpointSlug");

-- CreateIndex
CREATE UNIQUE INDEX "AppSetting_key_key" ON "AppSetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalApiOverride" ADD CONSTRAINT "ExternalApiOverride_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "ExternalApiConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalApiOverride" ADD CONSTRAINT "ExternalApiOverride_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileEndpoint" ADD CONSTRAINT "ProfileEndpoint_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
