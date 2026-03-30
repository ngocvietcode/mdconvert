import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Lấy danh sách Client, Processor và Overrides
export async function GET(req: NextRequest) {
  try {
    const [apiKeys, processors, overrides] = await Promise.all([
      prisma.apiKey.findMany({ select: { id: true, name: true, status: true, keyHash: true } }),
      prisma.processor.findMany({
        where: { type: { in: ['PREBUILT', 'RECIPE'] } },
        orderBy: [{ type: 'asc' }, { displayName: 'asc' }],
      }),
      prisma.processorOverride.findMany(),
    ]);

    return NextResponse.json({
      success: true,
      apiKeys,
      processors,
      overrides,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Bật tắt hoặc cập nhật System Prompt Override cho Client
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKeyId, processorId, isActive, systemPrompt, temperature, maxOutputTokens, modelOverride } = body;

    if (!apiKeyId || !processorId) {
      return NextResponse.json({ success: false, error: 'Thiếu apiKeyId hoặc processorId' }, { status: 400 });
    }

    if (!isActive) {
      // Tắt Override -> Xóa record
      await prisma.processorOverride.deleteMany({
        where: { processorId, apiKeyId },
      });
      return NextResponse.json({ success: true, action: 'deleted' });
    }

    // Bật hoặc Cập nhật Override -> Upsert
    const override = await prisma.processorOverride.upsert({
      where: {
        processorId_apiKeyId: {
          processorId,
          apiKeyId,
        },
      },
      update: {
        systemPrompt,
        temperature,
        maxOutputTokens,
        modelOverride,
      },
      create: {
        processorId,
        apiKeyId,
        systemPrompt,
        temperature,
        maxOutputTokens,
        modelOverride,
      },
    });

    return NextResponse.json({ success: true, action: 'upserted', override });
  } catch (error: any) {
    console.error('[Override API POST Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
