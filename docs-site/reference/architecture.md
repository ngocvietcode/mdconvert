# Architecture

## Data Flow

```
Browser â†’ Upload API â†’ File Storage (uploads/)
                            â”‚
                â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                â”‚                       â”‚
            .docx?                  .pdf?
                â”‚                       â”‚
                â–¼                       â–¼
        Pandoc CLI              Ghostscript CLI
        (extract md + images)   (compress PDF)
                â”‚                       â”‚
                â–¼                       â–¼
        Sharp compress          AI Vision API
        (resize images)         (PDF â†’ markdown)
                â”‚                       â”‚
                â–¼                       â”‚
        AI Vision API                   â”‚
        (image â†’ description)           â”‚
                â”‚                       â”‚
                â–¼                       â–¼
        Assembler               Output: text-only.md
        (merge md + descriptions)
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

## Directory Structure

```
dugate/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ layout.tsx
â”‚   â”œâ”€â”€ page.tsx                    # Upload page
â”‚   â”œâ”€â”€ login/page.tsx
â”‚   â”œâ”€â”€ setup/page.tsx              # First-run wizard
â”‚   â”œâ”€â”€ batch/page.tsx              # Batch upload
â”‚   â”œâ”€â”€ transform/[id]/page.tsx       # Result: preview + edit + download
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
â”‚   â”œâ”€â”€ UploadForm.tsx
â”‚   â”œâ”€â”€ CompressSelector.tsx
â”‚   â”œâ”€â”€ MarkdownPreview.tsx
â”‚   â”œâ”€â”€ MarkdownEditor.tsx
â”‚   â”œâ”€â”€ ConversionHistory.tsx
â”‚   â”œâ”€â”€ HeaderNav.tsx
â”‚   â””â”€â”€ StatusBadge.tsx
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ transformers/
â”‚   â”‚   â”œâ”€â”€ docx.ts                 # Pandoc + assemble pipeline
â”‚   â”‚   â””â”€â”€ pdf.ts                  # Ghostscript + AI pipeline
â”‚   â”œâ”€â”€ compress/
â”‚   â”‚   â”œâ”€â”€ images.ts               # Sharp resize + quality
â”‚   â”‚   â””â”€â”€ pdf.ts                  # Ghostscript presets
â”‚   â”œâ”€â”€ ai/
â”‚   â”‚   â””â”€â”€ gemini.ts               # AI provider wrapper
â”‚   â”œâ”€â”€ assembler.ts                # Merge raw.md + descriptions â†’ full.md
â”‚   â”œâ”€â”€ settings.ts                 # AppSetting CRUD + encryption
â”‚   â”œâ”€â”€ cleanup.ts                  # Delete old files
â”‚   â”œâ”€â”€ cleanup-scheduler.ts        # Background cleanup every 6h
â”‚   â”œâ”€â”€ zip.ts                      # Package output as ZIP
â”‚   â””â”€â”€ prisma.ts                   # Prisma client singleton
â”œâ”€â”€ prisma/
â”‚   â””â”€â”€ schema.prisma
â”œâ”€â”€ uploads/                        # Git-ignored
â””â”€â”€ outputs/                        # Git-ignored
    â””â”€â”€ [transformation-id]/
        â”œâ”€â”€ raw.md
        â”œâ”€â”€ full.md
        â”œâ”€â”€ text-only.md
        â””â”€â”€ images/
```

## Component Map

| Component | Used in | Function |
|---|---|---|
| `UploadForm` | `/` | Drag-drop or click upload, shows file info |
| `CompressSelector` | `/` | 4 Ghostscript presets, shown for PDF only |
| `MarkdownPreview` | `/transform/[id]` | react-markdown renders HTML from Markdown |
| `MarkdownEditor` | `/transform/[id]` | Textarea for editing Markdown |
| `ConversionHistory` | `/history` | Table of transformations sorted by date |
| `StatusBadge` | `/history`, `/transform/[id]` | Status pill: pending / compressing / processing / completed / failed |
| `HeaderNav` | All pages | Top nav â€” hidden on `/login` and `/setup` |
