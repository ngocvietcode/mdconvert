# Database Schema

## Database

| ThÃ´ng tin | GiÃ¡ trá»‹ |
|---|---|
| Engine | PostgreSQL |
| ORM | Prisma |
| DB name | `dugate` (configurable qua `DATABASE_URL`) |

---

## Models

### Transformation

| Cá»™t | Type | Nullable | Default | MÃ´ táº£ |
|---|---|---|---|---|
| `id` | String (UUID) | KhÃ´ng | `uuid()` | Primary key |
| `fileName` | String | KhÃ´ng | | TÃªn file gá»‘c |
| `fileType` | String | KhÃ´ng | | `docx` hoáº·c `pdf` |
| `fileSize` | Int | KhÃ´ng | | Dung lÆ°á»£ng file gá»‘c (bytes) |
| `compressLevel` | String | CÃ³ | null | PDF: `screen`/`ebook`/`printer`/`prepress`. DOCX: null |
| `compressedSize` | Int | CÃ³ | null | Dung lÆ°á»£ng sau nÃ©n (bytes) |
| `originalPath` | String | KhÃ´ng | | ÄÆ°á»ng dáº«n file trong `uploads/` |
| `fullMdPath` | String | CÃ³ | null | ÄÆ°á»ng dáº«n `full.md` (chá»‰ DOCX) |
| `textOnlyMdPath` | String | KhÃ´ng | | ÄÆ°á»ng dáº«n `text-only.md` |
| `imagesDir` | String | CÃ³ | null | ÄÆ°á»ng dáº«n thÆ° má»¥c `images/` (chá»‰ DOCX) |
| `imageCount` | Int | KhÃ´ng | 0 | Sá»‘ hÃ¬nh Ä‘Ã£ xá»­ lÃ½ (PDF = 0) |
| `status` | String | KhÃ´ng | `pending` | Xem luá»“ng tráº¡ng thÃ¡i bÃªn dÆ°á»›i |
| `errorMessage` | String | CÃ³ | null | Chi tiáº¿t lá»—i náº¿u `status = failed` |
| `createdBy` | String | KhÃ´ng | | User ID tá»« NextAuth |
| `createdAt` | DateTime | KhÃ´ng | `now()` | |
| `updatedAt` | DateTime | KhÃ´ng | auto | |
| `deletedAt` | DateTime | CÃ³ | null | Soft delete |

### ImageDescription

| Cá»™t | Type | Nullable | MÃ´ táº£ |
|---|---|---|---|
| `id` | String (UUID) | KhÃ´ng | Primary key |
| `conversionId` | String | KhÃ´ng | FK â†’ Transformation.id |
| `imageName` | String | KhÃ´ng | TÃªn file hÃ¬nh |
| `imagePath` | String | KhÃ´ng | ÄÆ°á»ng dáº«n hÃ¬nh |
| `description` | String | KhÃ´ng | MÃ´ táº£ chi tiáº¿t tá»« AI |
| `shortAlt` | String | KhÃ´ng | Alt text ngáº¯n cho Markdown |
| `createdAt` | DateTime | KhÃ´ng | |

---

## Quan há»‡

```
User       1 â”€â”€â”€â”€ * Transformation
Transformation 1 â”€â”€â”€â”€ * ImageDescription
```

---

## Luá»“ng tráº¡ng thÃ¡i

```
pending â†’ compressing â†’ processing â†’ completed
    â”‚          â”‚             â”‚
    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â†’ failed
```

| Tráº¡ng thÃ¡i | Ã nghÄ©a |
|---|---|
| `pending` | File Ä‘Ã£ upload, chá» xá»­ lÃ½ |
| `compressing` | Ghostscript (PDF) hoáº·c Sharp (áº£nh DOCX) Ä‘ang cháº¡y |
| `processing` | Äang gá»i AI Vision API |
| `completed` | Xong â€” output sáºµn sÃ ng |
| `failed` | Lá»—i á»Ÿ báº¥t ká»³ bÆ°á»›c nÃ o â€” xem `errorMessage` |
