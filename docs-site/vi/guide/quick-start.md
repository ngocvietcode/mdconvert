# Báº¯t Ä‘áº§u nhanh

## 1. Láº§n cháº¡y Ä‘áº§u â€” Setup Wizard

Sau khi khá»Ÿi Ä‘á»™ng dugate láº§n Ä‘áº§u, má»Ÿ:

```
http://localhost:2023/setup
```

Táº¡o tÃ i khoáº£n admin (email + máº­t kháº©u). Trang nÃ y chá»‰ hiá»ƒn thá»‹ khi chÆ°a cÃ³ user nÃ o trong database â€” cÃ¡c láº§n sau sáº½ tá»± chuyá»ƒn vá» trang Ä‘Äƒng nháº­p.

## 2. Cáº¥u hÃ¬nh AI Provider

VÃ o **CÃ i Ä‘áº·t** (`/settings`) vÃ  chá»n AI provider:

| Provider | API key cáº§n thiáº¿t |
|---|---|
| Google Gemini | `GEMINI_API_KEY` (hoáº·c nháº­p trong UI) |
| OpenAI | Nháº­p API key trong Settings |
| Anthropic | Nháº­p API key trong Settings |

Key nháº­p trong UI Ä‘Æ°á»£c mÃ£ hÃ³a AES-256 trÆ°á»›c khi lÆ°u vÃ o database.

Báº¡n cÃ³ thá»ƒ tÃ¹y chá»‰nh prompt AI hoáº·c chá»n preset ngÃ´n ngá»¯ (Tiáº¿ng Anh / Tiáº¿ng Viá»‡t).

## 3. Upload file Ä‘áº§u tiÃªn

VÃ o trang chá»§ (`/`) vÃ :

1. KÃ©o tháº£ hoáº·c chá»n file `.docx` hoáº·c `.pdf` (tá»‘i Ä‘a 100MB)
2. Vá»›i PDF: chá»n má»©c nÃ©n (khuyáº¿n nghá»‹ dÃ¹ng ebook)
3. Nháº¥n **Transform**

QuÃ¡ trÃ¬nh transform cháº¡y ná»n. Trang tá»± Ä‘á»™ng cáº­p nháº­t tráº¡ng thÃ¡i.

## 4. Xem vÃ  táº£i vá»

Sau khi transform xong:

- **Preview** káº¿t quáº£ Markdown
- **Sá»­a** trá»±c tiáº¿p náº¿u cáº§n
- **Táº£i vá»** ZIP chá»©a táº¥t cáº£ file output

### Output DOCX

```
[tÃªn-file]-YYYYMMDD.zip
â”œâ”€â”€ [tÃªn-file]-full.md        â† text + mÃ´ táº£ hÃ¬nh áº£nh
â”œâ”€â”€ [tÃªn-file]-text-only.md   â† chá»‰ text
â””â”€â”€ images/
    â”œâ”€â”€ [tÃªn-file]-img-001.png
    â””â”€â”€ ...
```

### Output PDF

```
[tÃªn-file]-YYYYMMDD.zip
â””â”€â”€ [tÃªn-file]-text-only.md
```

## 5. Upload hÃ ng loáº¡t

VÃ o `/batch` Ä‘á»ƒ upload nhiá»u file cÃ¹ng lÃºc. Má»—i file Ä‘Æ°á»£c xá»­ lÃ½ Ä‘á»™c láº­p vÃ  cÃ³ thá»ƒ táº£i vá» táº¥t cáº£ káº¿t quáº£ trong má»™t ZIP.

## 6. Lá»‹ch sá»­

VÃ o `/history` Ä‘á»ƒ xem táº¥t cáº£ láº§n transform trÆ°á»›c, táº£i láº¡i káº¿t quáº£ hoáº·c xÃ³a.
