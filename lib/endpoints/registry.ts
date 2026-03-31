// lib/endpoints/registry.ts
// Centralized SERVICE_REGISTRY — nested 6-service architecture with sub-cases.

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SubCaseDef {
  displayName: string;
  description: string;
  /** Parameters clients are allowed to send */
  clientParams: string[];
  /** Parameters ONLY settable by admin via ProfileEndpoint — blocked from client */
  profileOnlyParams: string[];
  /** Ordered list of ExternalApiConnection slugs to execute as pipeline */
  connections: string[];
}

export interface ServiceDef {
  slug: string;
  displayName: string;
  route: string;
  /** Form field name that discriminates which sub-case to run */
  discriminatorName: string;
  subCases: Record<string, SubCaseDef>;
}

// ─── Registry ────────────────────────────────────────────────────────────────

export const SERVICE_REGISTRY: Record<string, ServiceDef> = {

  // ── 1. Ingest ─────────────────────────────────────────────────────────────
  ingest: {
    slug: 'ingest',
    displayName: 'Document Ingestion',
    route: 'POST /api/v1/ingest',
    discriminatorName: 'mode',
    subCases: {
      parse: {
        displayName: 'Parse Structure',
        description: 'Parse PDF/DOCX → Markdown/HTML/Text',
        clientParams: ['output_format', 'language'],
        profileOnlyParams: [],
        connections: ['ext-doc-layout'],
      },
      ocr: {
        displayName: 'OCR',
        description: 'Nhận dạng ký tự từ ảnh/scan',
        clientParams: ['language'],
        profileOnlyParams: [],
        connections: ['ext-doc-layout'],
      },
      digitize: {
        displayName: 'Handwriting Digitizer',
        description: 'Số hóa tài liệu viết tay',
        clientParams: [],
        profileOnlyParams: [],
        connections: ['ext-vision-reader'],
      },
      split: {
        displayName: 'PDF Split',
        description: 'Tách trang PDF theo điều kiện',
        clientParams: ['pages'],
        profileOnlyParams: [],
        connections: ['ext-pdf-tools'],
      },
    },
  },

  // ── 2. Extract ────────────────────────────────────────────────────────────
  extract: {
    slug: 'extract',
    displayName: 'Data Extraction',
    route: 'POST /api/v1/extract',
    discriminatorName: 'type',
    subCases: {
      // _default handles all types — preset fields injected by runner for known types
      _default: {
        displayName: 'Custom/Preset Extraction',
        description: 'Trích xuất dữ liệu có cấu trúc. Dùng type= cho preset hoặc fields= cho tùy chỉnh.',
        clientParams: ['type', 'fields', 'schema'],
        profileOnlyParams: ['business_rules'],
        connections: ['ext-data-extractor'],
      },
    },
  },

  // ── 3. Analyze ────────────────────────────────────────────────────────────
  analyze: {
    slug: 'analyze',
    displayName: 'Document Analysis',
    route: 'POST /api/v1/analyze',
    discriminatorName: 'task',
    subCases: {
      classify: {
        displayName: 'Document Classification',
        description: 'Phân loại tài liệu vào danh mục định sẵn',
        clientParams: ['categories'],
        profileOnlyParams: ['business_rules'],
        connections: ['ext-classifier'],
      },
      sentiment: {
        displayName: 'Sentiment Analysis',
        description: 'Phân tích cảm xúc / quan điểm',
        clientParams: [],
        profileOnlyParams: [],
        connections: ['ext-sentiment'],
      },
      compliance: {
        displayName: 'Compliance Check',
        description: 'Kiểm tra tuân thủ quy định, chính sách',
        clientParams: ['criteria'],
        profileOnlyParams: ['business_rules'],
        connections: ['ext-compliance'],
      },
      'fact-check': {
        displayName: 'Fact Check',
        description: 'Kiểm chứng thông tin (2-step: extract → verify)',
        clientParams: ['reference_data', 'extract_fields'],
        profileOnlyParams: ['business_rules'],
        connections: ['ext-data-extractor', 'ext-fact-verifier'],
      },
      quality: {
        displayName: 'Quality Evaluation',
        description: 'Đánh giá chất lượng nội dung tài liệu',
        clientParams: ['criteria'],
        profileOnlyParams: [],
        connections: ['ext-quality-eval'],
      },
      risk: {
        displayName: 'Risk Assessment',
        description: 'Đánh giá rủi ro theo nghiệp vụ',
        clientParams: [],
        profileOnlyParams: ['business_rules'],
        connections: ['ext-quality-eval'],
      },
      'summarize-eval': {
        displayName: 'Summarize & Evaluate',
        description: 'Tóm tắt tài liệu và đánh giá theo tiêu chí (1-step, hỗ trợ N files)',
        clientParams: ['criteria', 'focus'],
        profileOnlyParams: ['focus_areas'],
        connections: ['ext-content-gen'],
      },
    },
  },

  // ── 4. Transform ──────────────────────────────────────────────────────────
  transform: {
    slug: 'transform',
    displayName: 'Document Transformation',
    route: 'POST /api/v1/transform',
    discriminatorName: 'action',
    subCases: {
      convert: {
        displayName: 'Format Convert',
        description: 'Chuyển đổi định dạng tài liệu (PDF/DOCX → MD/HTML/JSON/DOCX)',
        clientParams: ['output_format'],
        profileOnlyParams: [],
        connections: ['ext-doc-layout'],
      },
      translate: {
        displayName: 'Translation',
        description: 'Dịch tài liệu sang ngôn ngữ khác',
        clientParams: ['target_language', 'tone'],
        profileOnlyParams: ['glossary'],
        connections: ['ext-translator'],
      },
      rewrite: {
        displayName: 'Content Rewrite',
        description: 'Viết lại nội dung theo phong cách/giọng điệu',
        clientParams: ['style', 'tone'],
        profileOnlyParams: [],
        connections: ['ext-rewriter'],
      },
      redact: {
        displayName: 'PII Redaction',
        description: 'Che/xóa thông tin cá nhân nhạy cảm',
        clientParams: [],
        profileOnlyParams: ['redact_patterns'],
        connections: ['ext-redactor'],
      },
      template: {
        displayName: 'Template Apply',
        description: 'Điền dữ liệu vào template tài liệu',
        clientParams: ['template'],
        profileOnlyParams: [],
        connections: ['ext-redactor'],
      },
    },
  },

  // ── 5. Generate ───────────────────────────────────────────────────────────
  generate: {
    slug: 'generate',
    displayName: 'Content Generation',
    route: 'POST /api/v1/generate',
    discriminatorName: 'task',
    subCases: {
      summary: {
        displayName: 'Summarize',
        description: 'Tóm tắt tài liệu theo độ dài và định dạng',
        clientParams: ['max_words', 'format', 'audience'],
        profileOnlyParams: ['focus_areas', 'tone'],
        connections: ['ext-content-gen'],
      },
      outline: {
        displayName: 'Outline',
        description: 'Tạo dàn ý / mục lục tài liệu',
        clientParams: ['format'],
        profileOnlyParams: [],
        connections: ['ext-content-gen'],
      },
      report: {
        displayName: 'Report',
        description: 'Tạo báo cáo từ dữ liệu tài liệu',
        clientParams: ['tone', 'audience'],
        profileOnlyParams: ['focus_areas'],
        connections: ['ext-content-gen'],
      },
      email: {
        displayName: 'Email Draft',
        description: 'Soạn thảo email từ context tài liệu',
        clientParams: ['tone'],
        profileOnlyParams: [],
        connections: ['ext-content-gen'],
      },
      minutes: {
        displayName: 'Meeting Minutes',
        description: 'Tạo biên bản họp từ ghi chú/transcript',
        clientParams: ['format'],
        profileOnlyParams: [],
        connections: ['ext-content-gen'],
      },
      qa: {
        displayName: 'Document QA',
        description: 'Hỏi đáp nội dung tài liệu',
        clientParams: ['questions'],
        profileOnlyParams: [],
        connections: ['ext-qa-engine'],
      },
    },
  },

  // ── 6. Compare ────────────────────────────────────────────────────────────
  compare: {
    slug: 'compare',
    displayName: 'Document Comparison',
    route: 'POST /api/v1/compare',
    discriminatorName: 'mode',
    subCases: {
      diff: {
        displayName: 'Text Diff',
        description: 'So sánh text line-by-line (structural diff)',
        clientParams: ['output_format'],
        profileOnlyParams: [],
        connections: ['ext-comparator'],
      },
      semantic: {
        displayName: 'Semantic Compare',
        description: 'So sánh ngữ nghĩa bằng AI',
        clientParams: ['focus'],
        profileOnlyParams: ['business_rules'],
        connections: ['ext-comparator'],
      },
      version: {
        displayName: 'Version Changelog',
        description: 'So sánh 2 phiên bản tài liệu → tạo changelog',
        clientParams: ['output_format'],
        profileOnlyParams: [],
        connections: ['ext-comparator'],
      },
    },
  },
};

// ─── Helper ──────────────────────────────────────────────────────────────────

/**
 * Flatten SERVICE_REGISTRY into a list of all endpoint slugs (service:subcase).
 * Used by admin APIs to enumerate valid ProfileEndpoint slugs.
 */
export function getAllEndpointSlugs(): Array<{
  slug: string;
  displayName: string;
  serviceName: string;
  serviceSlug: string;
  connections: string[];
  clientParams: string[];
  profileOnlyParams: string[];
}> {
  return Object.entries(SERVICE_REGISTRY).flatMap(([svcSlug, svc]) =>
    Object.entries(svc.subCases).map(([caseKey, sub]) => ({
      slug: caseKey === '_default' ? svcSlug : `${svcSlug}:${caseKey}`,
      displayName: sub.displayName,
      serviceName: svc.displayName,
      serviceSlug: svcSlug,
      connections: sub.connections,
      clientParams: sub.clientParams,
      profileOnlyParams: sub.profileOnlyParams,
    }))
  );
}
