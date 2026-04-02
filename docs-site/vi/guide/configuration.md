# Cáº¥u hÃ¬nh

## Biáº¿n mÃ´i trÆ°á»ng

Copy `.env.example` thÃ nh `.env` vÃ  Ä‘iá»n vÃ o:

| Biáº¿n | Báº¯t buá»™c | MÃ´ táº£ |
|---|---|---|
| `DATABASE_URL` | CÃ³ | Connection string PostgreSQL, vÃ­ dá»¥: `postgresql://user:pass@localhost:5432/dugate` |
| `NEXTAUTH_SECRET` | CÃ³ | Chuá»—i ngáº«u nhiÃªn â‰¥ 32 kÃ½ tá»±. Táº¡o báº±ng: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | CÃ³ | URL cá»§a app, vÃ­ dá»¥: `http://localhost:2023` |
| `ENCRYPTION_KEY` | CÃ³ | ÄÃºng 32 kÃ½ tá»±. DÃ¹ng Ä‘á»ƒ mÃ£ hÃ³a API key trong DB |
| `GEMINI_API_KEY` | KhÃ´ng | Google AI Studio key. CÃ³ thá»ƒ nháº­p trong trang Settings |
| `UPLOAD_DIR` | KhÃ´ng | Máº·c Ä‘á»‹nh: `./uploads` |
| `OUTPUT_DIR` | KhÃ´ng | Máº·c Ä‘á»‹nh: `./outputs` |

## AI Providers

CÃ³ thá»ƒ chuyá»ƒn Ä‘á»•i provider báº¥t ká»³ lÃºc nÃ o tá»« trang **Settings** mÃ  khÃ´ng cáº§n khá»Ÿi Ä‘á»™ng láº¡i server.

### Google Gemini

Láº¥y API key táº¡i [Google AI Studio](https://aistudio.google.com/).

Model há»— trá»£:
- `gemini-1.5-flash` (nhanh, khuyáº¿n nghá»‹)
- `gemini-1.5-pro` (cháº¥t lÆ°á»£ng cao hÆ¡n)

### OpenAI

Láº¥y API key táº¡i [platform.openai.com](https://platform.openai.com/).

Model há»— trá»£:
- `gpt-4o`
- `gpt-4o-mini`

### Anthropic

Láº¥y API key táº¡i [console.anthropic.com](https://console.anthropic.com/).

Model há»— trá»£:
- `claude-3-5-sonnet-20241022`
- `claude-3-haiku-20240307`

## Prompt AI

Prompt máº·c Ä‘á»‹nh hÆ°á»›ng dáº«n AI mÃ´ táº£ hÃ¬nh áº£nh chi tiáº¿t vÃ  chuyá»ƒn Ä‘á»•i cáº¥u trÃºc tÃ i liá»‡u sang Markdown sáº¡ch.

Báº¡n cÃ³ thá»ƒ tÃ¹y chá»‰nh prompt trong **Settings** hoáº·c chá»n preset:

| Preset | NgÃ´n ngá»¯ output |
|---|---|
| English (máº·c Ä‘á»‹nh) | Tiáº¿ng Anh |
| Vietnamese | Tiáº¿ng Viá»‡t |

## Tá»± Ä‘á»™ng dá»n dáº¹p

File trong `uploads/` vÃ  `outputs/` tá»± Ä‘á»™ng bá»‹ xÃ³a sau **24 giá»**. Scheduler cháº¡y má»—i 6 giá» trong ná»n.

Äá»ƒ táº¯t hoáº·c Ä‘iá»u chá»‰nh, sá»­a file `lib/cleanup-scheduler.ts`.
