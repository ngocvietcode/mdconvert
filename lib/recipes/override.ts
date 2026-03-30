// lib/recipes/override.ts
// Helper: Tra cứu Recipe-level Override cho một API Key
// Scope B: extraVariables (inject vào variables) + systemPromptAddon (nối vào prompt của processor bên trong)

import { prisma } from '@/lib/prisma';

export interface RecipeOverrideResult {
  /** Variables bổ sung inject vào pipeline step (merge với variables gốc) */
  extraVariables: Record<string, string>;
  /** Đoạn text nối thêm vào cuối System Prompt của processor bên trong */
  systemPromptAddon: string;
  /** Override output format nếu client muốn khác mặc định */
  outputFormat?: string;
  /** Override model nếu client muốn dùng model khác */
  modelOverride?: string;
}

/**
 * Tra cứu ProcessorOverride cho một Recipe (type = RECIPE) theo apiKeyId.
 * Trả về null nếu không có override nào được cấu hình.
 *
 * @param recipeSlug  - Slug của Recipe Processor anchor (vd: 'recipe-fact-check')
 * @param apiKeyId    - UUID của API Key từ header x-api-key-id
 */
export async function resolveRecipeOverride(
  recipeSlug: string,
  apiKeyId: string,
): Promise<RecipeOverrideResult | null> {
  try {
    // Tìm Processor anchor (type = RECIPE)
    const recipeProcessor = await prisma.processor.findUnique({
      where: { slug: recipeSlug },
    });

    if (!recipeProcessor) {
      // Recipe anchor chưa được seed — bỏ qua, không ảnh hưởng luồng chính
      return null;
    }

    // Tra cứu Override theo (processorId, apiKeyId)
    const override = await prisma.processorOverride.findUnique({
      where: {
        processorId_apiKeyId: {
          processorId: recipeProcessor.id,
          apiKeyId,
        },
      },
    });

    if (!override) return null;

    // Parse extraVariables từ processorConfig (JSON object)
    let extraVariables: Record<string, string> = {};
    if (override.processorConfig) {
      try {
        const parsed = JSON.parse(override.processorConfig) as Record<string, unknown>;
        // processorConfig lưu dạng { extraVariables: { key: "val" } }
        if (parsed.extraVariables && typeof parsed.extraVariables === 'object') {
          extraVariables = parsed.extraVariables as Record<string, string>;
        }
      } catch {
        // Nếu JSON invalid thì bỏ qua
      }
    }

    // systemPrompt của override = systemPromptAddon (nối vào cuối prompt của processor bên trong)
    const systemPromptAddon = override.systemPrompt?.trim() ?? '';

    console.log(`[RecipeOverride] Applied override for '${recipeSlug}' (apiKeyId: ${apiKeyId})`);

    return {
      extraVariables,
      systemPromptAddon,
      modelOverride: override.modelOverride ?? undefined,
    };
  } catch (err) {
    // Không để lỗi override phá vỡ pipeline chính
    console.error(`[RecipeOverride] Error resolving override for '${recipeSlug}':`, err);
    return null;
  }
}
