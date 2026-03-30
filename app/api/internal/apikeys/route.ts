import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Tạo mới ApiKey
export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Tên Client không hợp lệ' }, { status: 400 });
    }

    // Generate prefix and long hex key for the RAW password
    // Prefix 'dg_' (dugate) to easily identify keys
    const rawKey = 'dg_' + crypto.randomBytes(32).toString('base64url');

    const apiKey = await prisma.apiKey.create({
      data: {
        name: name.trim(),
        keyHash: rawKey, // Store plain text directly for Admin visibility
        prefix: 'dg_',
        status: 'active',
      },
    });

    return NextResponse.json({
      success: true,
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
        status: apiKey.status,
      },
      rawKey, // NOTE: Chỉ trả về nguyên bản ở bước tạo này, Admin phải copy thủ công
    });
  } catch (error: any) {
    console.error('[ApiKey API - POST Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
