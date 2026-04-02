# Giá»›i thiá»‡u

## dugate lÃ  gÃ¬?

**dugate** lÃ  cÃ´ng cá»¥ web tá»± host giÃºp chuyá»ƒn Ä‘á»•i file `.docx` vÃ  `.pdf` thÃ nh Markdown sáº¡ch, tá»‘i Æ°u cho AI agents, Claude Projects vÃ  Claude Code.

Khi Ä‘Æ°a tÃ i liá»‡u vÃ o AI, vÄƒn báº£n thuáº§n thÆ°á»ng khÃ´ng Ä‘á»§ â€” Ä‘áº·c biá»‡t vá»›i SOP, hÆ°á»›ng dáº«n váº­n hÃ nh, hay tÃ i liá»‡u cÃ³ nhiá»u hÃ¬nh áº£nh. dugate giáº£i quyáº¿t Ä‘iá»u nÃ y báº±ng cÃ¡ch:

1. TrÃ­ch xuáº¥t hÃ¬nh áº£nh tá»« file Word
2. Gá»­i tá»«ng hÃ¬nh Ä‘áº¿n AI Vision (Gemini / OpenAI / Anthropic)
3. Táº¡o mÃ´ táº£ chi tiáº¿t cho tá»«ng hÃ¬nh
4. GhÃ©p táº¥t cáº£ thÃ nh file Markdown hoÃ n chá»‰nh

Káº¿t quáº£ lÃ  `full.md` mÃ  AI cÃ³ thá»ƒ hiá»ƒu Ä‘áº§y Ä‘á»§ â€” ká»ƒ cáº£ pháº§n hÃ¬nh áº£nh.

## TrÆ°á»ng há»£p sá»­ dá»¥ng

| TrÆ°á»ng há»£p | dugate giÃºp gÃ¬ |
|---|---|
| **Claude Projects** | Upload SOP dáº¡ng Markdown â€” Claude hiá»ƒu Ä‘Æ°á»£c cáº£ hÃ¬nh áº£nh |
| **Claude Code** | ÄÆ°a `full.md` vÃ o project Ä‘á»ƒ Claude Code cÃ³ Ä‘á»§ context |
| **AI Agents** | Feed Markdown cÃ³ cáº¥u trÃºc thay vÃ¬ PDF thÃ´ |
| **Knowledge base** | Transform tÃ i liá»‡u cÃ´ng ty sang Markdown Ä‘á»ƒ index |
| **BiÃªn dá»‹ch / chá»‰nh sá»­a** | Sá»­a Markdown trá»±c tiáº¿p trÃªn editor tÃ­ch há»£p |

## Hai luá»“ng xá»­ lÃ½

```
DOCX â†’ Pandoc â†’ trÃ­ch xuáº¥t text + hÃ¬nh â†’ AI Vision â†’ full.md + text-only.md + images/

PDF  â†’ Ghostscript â†’ nÃ©n â†’ AI Vision (tá»«ng trang) â†’ text-only.md
```

## TÃ­nh nÄƒng chÃ­nh

- **Upload hÃ ng loáº¡t** â€” transform nhiá»u file trong má»™t phiÃªn
- **Äa AI provider** â€” Gemini, OpenAI, Anthropic â€” chuyá»ƒn Ä‘á»•i ngay trÃªn UI
- **Editor tÃ­ch há»£p** â€” preview vÃ  sá»­a Markdown trÆ°á»›c khi táº£i vá»
- **Tá»± Ä‘á»™ng dá»n dáº¹p** â€” file bá»‹ xÃ³a sau 24 giá»
- **Tá»± host** â€” dá»¯ liá»‡u á»Ÿ láº¡i server cá»§a báº¡n
- **Prompt song ngá»¯** â€” preset tiáº¿ng Anh vÃ  tiáº¿ng Viá»‡t

## Tech Stack

| Layer | CÃ´ng nghá»‡ |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Prisma ORM |
| Database | PostgreSQL |
| Xá»­ lÃ½ DOCX | Pandoc (CLI) |
| Xá»­ lÃ½ PDF | Ghostscript (CLI) |
| NÃ©n áº£nh | Sharp |
| AI Vision | Gemini / OpenAI / Anthropic |
| XÃ¡c thá»±c | NextAuth.js |
