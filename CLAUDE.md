# dugate
<!-- v1.0 - 2026-03 -->

## Project Overview

| ThÃ´ng tin | GiÃ¡ trá»‹ |
|---|---|
| TÃªn | dugate |
| Má»¥c tiÃªu | Transform file SOP (.docx, .pdf) sang Markdown tá»‘i Æ°u cho AI agent, Claude Project, Claude Code |
| Stack | Next.js 14 + TypeScript + Prisma + PostgreSQL + Tailwind CSS |
| External tools | Pandoc (CLI), Ghostscript (CLI), Gemini API, sharp (npm) |
| Port | 2023 (dev), 2023 (prod) |
| PM2 | dugate |
| Tráº¡ng thÃ¡i | v1.0 open source âœ… |

## Hai flow xá»­ lÃ½

| Input | Engine | Compress | Output |
|---|---|---|---|
| .docx | Pandoc â†’ sharp â†’ Gemini | sharp (resize 1600px, quality 80%) | full.md + text-only.md + images/ |
| .pdf | Ghostscript â†’ Gemini | Ghostscript (4 preset: screen/ebook/printer/prepress) | text-only.md |

## Quy táº¯c quan trá»ng

â†’ Xem docs/constitution.md
â†’ Xem docs/security-requirements.md

## MÃ´i trÆ°á»ng & Credentials

| Biáº¿n | MÃ´ táº£ |
|---|---|
| DATABASE_URL | postgresql://user:password@localhost:5432/dugate |
| NEXTAUTH_SECRET | Auth secret (>= 32 kÃ½ tá»±) |
| NEXTAUTH_URL | http://localhost:2023 |
| GEMINI_API_KEY | Google AI Studio API key (hoáº·c nháº­p qua /settings) |
| ENCRYPTION_KEY | AES-256 key cho AppSetting (32 chars) |
| UPLOAD_DIR | ./uploads |
| OUTPUT_DIR | ./outputs |

## Deploy

```bash
# Sync code lÃªn VPS (configure VPS_IP, VPS_PORT, APP_DIR trong deploy/deploy.sh)
bash deploy/deploy.sh
```

## First run

Sau khi deploy, má»Ÿ `https://your-domain.com/setup` Ä‘á»ƒ táº¡o tÃ i khoáº£n admin Ä‘áº§u tiÃªn.

## Milestone

| ÄÃ£ lÃ m | ChÆ°a lÃ m |
|---|---|
| Phase 1: DOCX transform engine | Multi-user / role management |
| Phase 2: Batch upload + history + settings | Realtime collaboration |
| Phase 3: Deploy + Auth + Setup Wizard | - |
