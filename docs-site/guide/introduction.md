# Introduction

## What is dugate?

**dugate** is a self-hosted web tool that transforms `.docx` and `.pdf` files into clean Markdown, optimized for use with AI agents, Claude Projects, and Claude Code.

When you feed documents to an AI, raw text is often not enough â€” especially for SOPs, manuals, or guides that contain images. dugate solves this by:

1. Extracting images from Word documents
2. Sending each image to AI Vision (Gemini / OpenAI / Anthropic)
3. Generating a detailed text description for each image
4. Assembling everything into a single Markdown file

The result is a `full.md` that an AI can fully understand â€” even the visual parts.

## Use Cases

| Use case | How dugate helps |
|---|---|
| **Claude Projects** | Upload SOP or manual as Markdown context â€” Claude understands every image |
| **Claude Code** | Drop `full.md` into your project so Claude Code has full context |
| **AI Agents** | Feed structured Markdown to your agent instead of raw PDFs |
| **Knowledge base** | Transform company documentation to Markdown for indexing |
| **Translation / editing** | Edit Markdown output in the built-in editor before using |

## Two Transformation Flows

```
DOCX â†’ Pandoc â†’ extract text + images â†’ AI Vision â†’ full.md + text-only.md + images/

PDF  â†’ Ghostscript â†’ compress â†’ AI Vision (page by page) â†’ text-only.md
```

## Key Features

- **Batch upload** â€” transform multiple files in one session
- **Multi AI provider** â€” Gemini, OpenAI, Anthropic â€” switchable from the UI
- **Inline editor** â€” preview and edit Markdown before downloading
- **Auto cleanup** â€” files deleted after 24h
- **Self-hosted** â€” your data stays on your server
- **Bilingual prompts** â€” English and Vietnamese presets

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Prisma ORM |
| Database | PostgreSQL |
| DOCX parsing | Pandoc (CLI) |
| PDF rendering | Ghostscript (CLI) |
| Image processing | Sharp |
| AI Vision | Gemini / OpenAI / Anthropic |
| Auth | NextAuth.js |
