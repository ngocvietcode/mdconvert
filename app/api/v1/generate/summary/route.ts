// app/api/v1/generate/summary/route.ts
// POST /api/v1/generate/summary — Recipe: Summarize a document
// Shortcut for pipeline: [{ processor: "prebuilt-summarize", variables: { max_words } }]

import { NextRequest, NextResponse } from 'next/server';
import { submitPipelineJob } from '@/lib/pipelines/submit';
import { formatOperationResponse } from '@/lib/pipelines/format';
import { resolveRecipeOverride } from '@/lib/recipes/override';

/**
 * @swagger
 * /api/v1/generate/summary:
 *   post:
 *     summary: Generate a concise summary of a document
 *     description: |
 *       Recipe shortcut for the `prebuilt-summarize` processor.
 *       Produces a clear, professional summary of the document content, preserving key facts and figures.
 *       Control output length with `max_words` (default: 500 words).
 *     tags: [Generate]
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
 *                 description: Document to summarize — PDF or DOCX
 *               max_words:
 *                 type: integer
 *                 default: 500
 *                 description: Maximum word count for the summary
 *               output_format:
 *                 type: string
 *                 enum: [md, html]
 *                 default: md
 *               webhook_url:
 *                 type: string
 *                 description: Optional URL for async completion notification
 *     responses:
 *       202:
 *         description: Operation created. Result contains content with the summary text.
 *       400:
 *         description: Missing file
 */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const apiKeyId = req.headers.get('x-api-key-id') ?? undefined;

    const maxWordsRaw = form.get('max_words') as string | null;
    let maxWords = maxWordsRaw ? parseInt(maxWordsRaw, 10) || 500 : 500;
    let outputFormat = (form.get('output_format') as string) ?? 'md';
    let pipelineVariables: Record<string, unknown> = {};

    // ── Recipe-level Override (Scope B) ────────────────────────────────────
    if (apiKeyId) {
      const recipeOverride = await resolveRecipeOverride('recipe-generate-summary', apiKeyId);
      if (recipeOverride) {
        pipelineVariables = { ...recipeOverride.extraVariables };
        // Allow override to set default max_words via extraVariables
        if (recipeOverride.extraVariables.max_words && !maxWordsRaw) {
          maxWords = parseInt(recipeOverride.extraVariables.max_words, 10) || maxWords;
        }
        if (recipeOverride.outputFormat) outputFormat = recipeOverride.outputFormat;
        if (recipeOverride.systemPromptAddon) {
          pipelineVariables['__system_prompt_addon'] = recipeOverride.systemPromptAddon;
        }
      }
    }

    const result = await submitPipelineJob({
      pipeline: [{
        processor: 'prebuilt-summarize',
        variables: { max_words: maxWords, ...pipelineVariables },
      }],
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
    console.error('[POST /api/v1/generate/summary] Error:', msg);
    return NextResponse.json(
      { type: 'https://dugate.vn/errors/internal', title: 'Internal Error', status: 500, detail: msg },
      { status: 500 },
    );
  }
}
