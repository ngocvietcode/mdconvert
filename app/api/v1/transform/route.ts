// app/api/v1/transform/route.ts
// POST /api/v1/transform — Recipe: PDF/DOCX → Markdown or HTML
// Shortcut for pipeline: [{ processor: "prebuilt-layout" }]

import { NextRequest, NextResponse } from 'next/server';
import { submitPipelineJob } from '@/lib/pipelines/submit';
import { formatOperationResponse } from '@/lib/pipelines/format';
import { resolveRecipeOverride } from '@/lib/recipes/override';

/**
 * @swagger
 * /api/v1/transform:
 *   post:
 *     summary: Convert PDF/DOCX to Markdown or HTML
 *     description: |
 *       Recipe shortcut for the `prebuilt-layout` processor.
 *       Converts a PDF or DOCX file to well-structured Markdown (or HTML),
 *       preserving headings, tables, lists, and image references.
 *     tags: [Transform]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF or DOCX file to convert
 *               output_format:
 *                 type: string
 *                 enum: [md, html]
 *                 default: md
 *               webhook_url:
 *                 type: string
 *                 description: Optional URL for async completion notification
 *     responses:
 *       202:
 *         description: Operation created. Poll GET /api/v1/operations/{id} for result.
 *       400:
 *         description: Missing or invalid file
 */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const apiKeyId = req.headers.get('x-api-key-id') ?? undefined;

    // ── Recipe-level Override (Scope B) ────────────────────────────────────
    let pipelineVariables: Record<string, unknown> = {};
    let outputFormat = (form.get('output_format') as string) ?? 'md';
    let modelOverride: string | undefined;

    if (apiKeyId) {
      const recipeOverride = await resolveRecipeOverride('recipe-transform', apiKeyId);
      if (recipeOverride) {
        pipelineVariables = { ...recipeOverride.extraVariables };
        if (recipeOverride.outputFormat) outputFormat = recipeOverride.outputFormat;
        if (recipeOverride.modelOverride) modelOverride = recipeOverride.modelOverride;
        // systemPromptAddon được inject thông qua variables để engine xử lý
        if (recipeOverride.systemPromptAddon) {
          pipelineVariables['__system_prompt_addon'] = recipeOverride.systemPromptAddon;
        }
      }
    }

    const result = await submitPipelineJob({
      pipeline: [{ processor: 'prebuilt-layout', variables: pipelineVariables }],
      file:         form.get('file') as File | null,
      outputFormat,
      webhookUrl:   form.get('webhook_url') as string | null,
      idempotencyKey: req.headers.get('idempotency-key') ?? undefined,
      apiKeyId,
    });

    if (!result.ok) return result.errorResponse;

    return NextResponse.json(formatOperationResponse(result.operation), {
      status: result.isIdempotent ? 200 : 202,
      headers: result.isIdempotent
        ? {}
        : { 'Operation-Location': `/api/v1/operations/${result.operation.id}` },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[POST /api/v1/transform] Error:', msg);
    return NextResponse.json(
      { type: 'https://dugate.vn/errors/internal', title: 'Internal Error', status: 500, detail: msg },
      { status: 500 },
    );
  }
}
