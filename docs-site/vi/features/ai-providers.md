# AI Providers

dugate há»— trá»£ ba AI Vision provider. Báº¡n cÃ³ thá»ƒ chuyá»ƒn Ä‘á»•i báº¥t ká»³ lÃºc nÃ o tá»« trang **Settings** â€” khÃ´ng cáº§n khá»Ÿi Ä‘á»™ng láº¡i server.

## Provider Ä‘Æ°á»£c há»— trá»£

### Google Gemini

| ThÃ´ng tin | GiÃ¡ trá»‹ |
|---|---|
| Láº¥y API key | [aistudio.google.com](https://aistudio.google.com/) |
| Model khuyáº¿n nghá»‹ | `gemini-1.5-flash` |
| Ghi chÃº | Nhanh vÃ  tiáº¿t kiá»‡m chi phÃ­. Provider máº·c Ä‘á»‹nh. |

### OpenAI

| ThÃ´ng tin | GiÃ¡ trá»‹ |
|---|---|
| Láº¥y API key | [platform.openai.com](https://platform.openai.com/) |
| Model khuyáº¿n nghá»‹ | `gpt-4o` |
| Ghi chÃº | Kháº£ nÄƒng vision máº¡nh. Chi phÃ­ cao hÆ¡n Gemini. |

### Anthropic

| ThÃ´ng tin | GiÃ¡ trá»‹ |
|---|---|
| Láº¥y API key | [console.anthropic.com](https://console.anthropic.com/) |
| Model khuyáº¿n nghá»‹ | `claude-3-5-sonnet-20241022` |
| Ghi chÃº | Tá»‘t nháº¥t cho tÃ i liá»‡u phá»©c táº¡p. |

## Báº£o máº­t

API key nháº­p trong UI Ä‘Æ°á»£c **mÃ£ hÃ³a AES-256** trÆ°á»›c khi lÆ°u vÃ o database. Biáº¿n `ENCRYPTION_KEY` (32 kÃ½ tá»±) Ä‘Æ°á»£c dÃ¹ng lÃ m khÃ³a mÃ£ hÃ³a.

Key Ä‘áº·t qua biáº¿n mÃ´i trÆ°á»ng (`GEMINI_API_KEY`) sáº½ Ä‘Æ°á»£c Æ°u tiÃªn hÆ¡n key nháº­p trong UI cho Gemini.

## CÃ¡ch chuyá»ƒn Ä‘á»•i provider

1. VÃ o **Settings** (`/settings`)
2. Chá»n provider tá»« dropdown
3. Nháº­p API key
4. Nháº¥n **Save**
5. Test káº¿t ná»‘i báº±ng nÃºt **Test**

Thay Ä‘á»•i cÃ³ hiá»‡u lá»±c ngay láº­p tá»©c â€” khÃ´ng áº£nh hÆ°á»Ÿng Ä‘áº¿n cÃ¡c láº§n transform Ä‘ang cháº¡y.

## TÃ¹y chá»‰nh Prompt

Báº¡n cÃ³ thá»ƒ tÃ¹y chá»‰nh prompt gá»­i Ä‘áº¿n AI trong Settings. CÃ³ hai preset sáºµn:

- **English** â€” output mÃ´ táº£ hÃ¬nh áº£nh vÃ  Markdown báº±ng tiáº¿ng Anh
- **Vietnamese** â€” output báº±ng tiáº¿ng Viá»‡t

Hoáº·c viáº¿t prompt riÃªng cho thuáº­t ngá»¯ chuyÃªn ngÃ nh cá»§a báº¡n.
