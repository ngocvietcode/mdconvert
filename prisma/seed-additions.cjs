'use strict';
// prisma/seed-additions.cjs
// CommonJS seed script — chạy được trong Docker runner (không cần tsx)
// CMD: node ./prisma/seed-additions.cjs
// Được gọi tự động khi container khởi động (trước node server.js)

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PDF_DOCX_MIMES =
  'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

// ─── Processors cần upsert khi deploy ──────────────────────────────────────
// Danh sách này là delta — chỉ chứa processors mới/cập nhật.
// Idempotent: an toàn chạy nhiều lần.

const ADDITIONAL_PROCESSORS = [
  {
    slug: 'prebuilt-fact-check',
    displayName: 'Kiểm tra & Đối chiếu Nội dung (Fact-Check)',
    type: 'PREBUILT',
    category: 'analyze',
    description:
      'Kiểm tra và đối chiếu nội dung tài liệu với dữ liệu tham chiếu theo các quy tắc nghiệp vụ tùy chỉnh. Trả về kết quả PASS/FAIL/WARNING cho từng điều khoản kiểm tra kèm giải thích chi tiết.',
    systemPrompt: `You are a professional document compliance and fact-checking auditor.

**TASK:** Verify the document content against the provided reference data, following the business rules specified below.

---

**BUSINESS RULES / CHECK CRITERIA:**
{{check_prompt}}

---

**REFERENCE DATA:**
{{reference_text}}

---

**DOCUMENT CONTENT:**
{{input_content}}

---

**Instructions:**
Carefully compare the document content against the reference data for each rule or criterion. For each check:
- Extract the exact value/statement from the document
- Compare it with the corresponding value in the reference data
- Assign a status: PASS (matches/compliant), FAIL (contradicts/non-compliant), WARNING (partially matches or ambiguous), NOT_APPLICABLE (rule doesn't apply to this document)

Return ONLY a valid JSON object with this exact structure (no markdown fences, no extra text outside JSON):
{
  "verdict": "PASS | FAIL | WARNING | INCONCLUSIVE",
  "score": <integer 0-100, overall compliance percentage>,
  "summary": "<2-3 sentence overall compliance assessment>",
  "checks": [
    {
      "rule": "<specific rule or criterion checked>",
      "status": "PASS | FAIL | WARNING | NOT_APPLICABLE",
      "document_value": "<exact value or text found in the document>",
      "reference_value": "<corresponding expected value from reference data>",
      "explanation": "<concise explanation of why this check passed or failed>"
    }
  ],
  "discrepancies": ["<list of key discrepancies found, each as a concise statement>"]
}`,
    responseSchema: JSON.stringify({
      type: 'object',
      required: ['verdict', 'score', 'summary', 'checks'],
      properties: {
        verdict: { type: 'string', enum: ['PASS', 'FAIL', 'WARNING', 'INCONCLUSIVE'] },
        score: { type: 'integer', minimum: 0, maximum: 100 },
        summary: { type: 'string' },
        checks: {
          type: 'array',
          items: {
            type: 'object',
            required: ['rule', 'status', 'explanation'],
            properties: {
              rule: { type: 'string' },
              status: { type: 'string', enum: ['PASS', 'FAIL', 'WARNING', 'NOT_APPLICABLE'] },
              document_value: { type: 'string' },
              reference_value: { type: 'string' },
              explanation: { type: 'string' },
            },
          },
        },
        discrepancies: { type: 'array', items: { type: 'string' } },
      },
    }),
    acceptedMimes: PDF_DOCX_MIMES,
    outputFormats: 'json',
    variablesSchema: JSON.stringify({
      type: 'object',
      required: ['reference_text', 'check_prompt'],
      properties: {
        reference_text: {
          type: 'string',
          description: 'Dữ liệu tham chiếu để đối chiếu (văn bản thuần hoặc JSON string)',
        },
        check_prompt: {
          type: 'string',
          description: 'Quy tắc nghiệp vụ hoặc tiêu chí kiểm tra cụ thể',
        },
      },
    }),
    canBeFirstStep: true,
    canBeChainStep: true,
    processorConfig: JSON.stringify({ docxMode: 'ai', docxFormat: 'html', compressLevel: 'ebook' }),
    state: 'ENABLED',
  },
];

// ─── Recipe Processor Anchors ────────────────────────────────────────────────
// Đây là các Processor ảo (type = RECIPE) đại diện cho từng Recipe Endpoint.
// Chúng KHÔNG tham gia pipeline execution — chỉ là anchor để gắn ProcessorOverride.
// Override sẽ lưu: systemPromptAddon (nối vào processor bên trong) + extraVariables (JSON).

const RECIPE_PROCESSORS = [
  {
    slug: 'recipe-transform',
    displayName: 'Recipe: Bóc tách & Chuyển đổi (/transform)',
    type: 'RECIPE',
    category: 'extract',
    description: 'Override cho Recipe Endpoint /api/v1/transform. Ghi đè output format hoặc inject system prompt addon vào prebuilt-layout.',
    systemPrompt: '',
    acceptedMimes: PDF_DOCX_MIMES,
    outputFormats: 'md,html',
    canBeFirstStep: false,
    canBeChainStep: false,
    state: 'ENABLED',
  },
  {
    slug: 'recipe-compare',
    displayName: 'Recipe: So sánh & Tìm điểm khác (/compare)',
    type: 'RECIPE',
    category: 'analyze',
    description: 'Override cho Recipe Endpoint /api/v1/compare. Inject system prompt addon vào prebuilt-compare hoặc ghi đè model.',
    systemPrompt: '',
    acceptedMimes: PDF_DOCX_MIMES,
    outputFormats: 'json',
    canBeFirstStep: false,
    canBeChainStep: false,
    state: 'ENABLED',
  },
  {
    slug: 'recipe-fact-check',
    displayName: 'Recipe: Fact-check & Xác minh (/fact-check)',
    type: 'RECIPE',
    category: 'analyze',
    description: 'Override cho Recipe Endpoint /api/v1/fact-check. Nối thêm check_prompt cố định, hoặc inject system prompt addon vào prebuilt-fact-check.',
    systemPrompt: '',
    acceptedMimes: PDF_DOCX_MIMES,
    outputFormats: 'json',
    canBeFirstStep: false,
    canBeChainStep: false,
    state: 'ENABLED',
  },
  {
    slug: 'recipe-generate-summary',
    displayName: 'Recipe: Tóm tắt AI (/generate/summary)',
    type: 'RECIPE',
    category: 'generate',
    description: 'Override cho Recipe Endpoint /api/v1/generate/summary. Ghi đè max_words mặc định hoặc inject system prompt addon vào prebuilt-summarize.',
    systemPrompt: '',
    acceptedMimes: PDF_DOCX_MIMES,
    outputFormats: 'md,html',
    canBeFirstStep: false,
    canBeChainStep: false,
    state: 'ENABLED',
  },
  {
    slug: 'recipe-generate-translate',
    displayName: 'Recipe: Dịch thuật AI (/generate/translate)',
    type: 'RECIPE',
    category: 'generate',
    description: 'Override cho Recipe Endpoint /api/v1/generate/translate. Ghi đè ngôn ngữ mặc định hoặc inject system prompt addon vào prebuilt-translate.',
    systemPrompt: '',
    acceptedMimes: PDF_DOCX_MIMES,
    outputFormats: 'md,html',
    canBeFirstStep: false,
    canBeChainStep: false,
    state: 'ENABLED',
  },
];

async function main() {
  console.log('🌱 [seed-additions] Seeding additional processors...');
  for (const proc of ADDITIONAL_PROCESSORS) {
    await prisma.processor.upsert({
      where: { slug: proc.slug },
      update: proc,
      create: proc,
    });
    console.log(`  ✅ ${proc.slug}`);
  }

  console.log('\n🌱 [seed-additions] Seeding recipe processor anchors...');
  for (const proc of RECIPE_PROCESSORS) {
    await prisma.processor.upsert({
      where: { slug: proc.slug },
      update: proc,
      create: proc,
    });
    console.log(`  ✅ ${proc.slug}`);
  }

  const total = ADDITIONAL_PROCESSORS.length + RECIPE_PROCESSORS.length;
  console.log(`\n🎉 [seed-additions] Done. ${total} processors upserted.`);
}

main()
  .catch((err) => {
    console.error('[seed-additions] Error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
