# Kiáº¿n trÃºc

## Luá»“ng dá»¯ liá»‡u

```
Browser â†’ Upload API â†’ File Storage (uploads/)
                            â”‚
                â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                â”‚                       â”‚
            .docx?                  .pdf?
                â”‚                       â”‚
                â–¼                       â–¼
        Pandoc CLI              Ghostscript CLI
        (trÃ­ch xuáº¥t md + áº£nh)   (nÃ©n PDF)
                â”‚                       â”‚
                â–¼                       â–¼
        Sharp compress          AI Vision API
        (resize áº£nh)            (PDF â†’ markdown)
                â”‚                       â”‚
                â–¼                       â”‚
        AI Vision API                   â”‚
        (áº£nh â†’ mÃ´ táº£)                  â”‚
                â”‚                       â”‚
                â–¼                       â–¼
        Assembler               Output: text-only.md
        (ghÃ©p md + mÃ´ táº£)
                â”‚
                â–¼
        Output: full.md + text-only.md + images/
                â”‚
                â–¼
        DB (Transformation record) + File Storage (outputs/)
                â”‚
                â–¼
        Preview / Edit / Download ZIP
```

## Cáº¥u trÃºc thÆ° má»¥c

```
dugate/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ page.tsx                    # Trang upload
â”‚   â”œâ”€â”€ login/page.tsx
â”‚   â”œâ”€â”€ setup/page.tsx              # Wizard láº§n Ä‘áº§u
â”‚   â”œâ”€â”€ batch/page.tsx              # Upload hÃ ng loáº¡t
â”‚   â”œâ”€â”€ transform/[id]/page.tsx       # Káº¿t quáº£: preview + edit + download
â”‚   â”œâ”€â”€ history/page.tsx
â”‚   â””â”€â”€ api/
â”‚       â”œâ”€â”€ auth/[...nextauth]/route.ts
â”‚       â”œâ”€â”€ upload/route.ts
â”‚       â”œâ”€â”€ transform/route.ts
â”‚       â”œâ”€â”€ transform/[id]/route.ts
â”‚       â”œâ”€â”€ transform/[id]/edit/route.ts
â”‚       â”œâ”€â”€ transform/[id]/download/route.ts
â”‚       â”œâ”€â”€ history/route.ts
â”‚       â”œâ”€â”€ settings/route.ts
â”‚       â””â”€â”€ setup/route.ts
â”œâ”€â”€ components/
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ transformers/docx.ts          # Pipeline Pandoc + assemble
â”‚   â”œâ”€â”€ transformers/pdf.ts           # Pipeline Ghostscript + AI
â”‚   â”œâ”€â”€ compress/images.ts          # Sharp resize + quality
â”‚   â”œâ”€â”€ compress/pdf.ts             # Ghostscript presets
â”‚   â”œâ”€â”€ ai/gemini.ts                # AI provider wrapper
â”‚   â”œâ”€â”€ assembler.ts                # GhÃ©p raw.md + mÃ´ táº£ â†’ full.md
â”‚   â”œâ”€â”€ settings.ts                 # AppSetting CRUD + mÃ£ hÃ³a
â”‚   â”œâ”€â”€ cleanup.ts                  # XÃ³a file cÅ©
â”‚   â”œâ”€â”€ cleanup-scheduler.ts        # Cleanup tá»± Ä‘á»™ng má»—i 6h
â”‚   â””â”€â”€ prisma.ts                   # Prisma client singleton
â””â”€â”€ prisma/schema.prisma
```

## Component Map

| Component | DÃ¹ng á»Ÿ | Chá»©c nÄƒng |
|---|---|---|
| `UploadForm` | `/` | Drag-drop upload, hiá»ƒn thá»‹ file info |
| `CompressSelector` | `/` | 4 má»©c Ghostscript, chá»‰ hiá»‡n khi upload PDF |
| `MarkdownPreview` | `/transform/[id]` | Render HTML tá»« Markdown |
| `MarkdownEditor` | `/transform/[id]` | Textarea sá»­a Markdown |
| `ConversionHistory` | `/history` | Báº£ng danh sÃ¡ch sort theo ngÃ y |
| `StatusBadge` | Nhiá»u trang | Badge tráº¡ng thÃ¡i: pending/compressing/processing/completed/failed |
| `HeaderNav` | Má»i trang | Top nav â€” áº©n trÃªn `/login` vÃ  `/setup` |
