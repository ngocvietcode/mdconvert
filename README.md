# ðŸ—ï¸ DUGate (Document Understanding API Gateway)

> **Transforming unstructured documents into intelligent, actionable data with a unified API.**

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

DUGate is a powerful, self-hosted Document Understanding API Gateway. It abstracts the complexity of working with OCR, LLMs, and parsing engines (Pandoc, Ghostscript) into **6 simple, expressive API endpoints**. 

Whether you need to extract data from invoices, compliance-check a contract, or redact sensitive PII, DUGate provides an asynchronous, scalable, and profile-driven architecture to handle it.

---

## âœ¨ Key Features

- **6 Core API Endpoints** â€” Consolidates fragmented legacy integrations into a clean, unified architectural standard (`ingest`, `extract`, `analyze`, `transform`, `generate`, `compare`).
- **Deep Profile-Driven Override Routing** â€” Administrators can enforce specific internal LLM models, system context, or overwrite connection setups entirely *per API Key*. Client applications interact transparently without requiring codebase modifications.
- **Visual Pipeline Chain Builder** â€” An intuitive **Visual Interface in the Profiles Dashboard** allowing Administrators to securely orchestrate, re-order, and inject *Contextual Prompts* using variable mapping (`{{input_content}}`) dynamically across executing connectors.
- **Asynchronous Pipeline Engine** â€” Processes large-scale documents seamlessly via an enterprise-grade asynchronous worker queue (`202 Accepted` + Polling/Webhook pattern).
- **Multiple AI Backends** â€” Natively routes downward into Google Gemini, OpenAI, Claude, or modular internal APIs to comply with strict data locality policies.
- **Standalone Mock Service Engine** â€” Safely develop and run high-volume Automated Tests against a dedicated internal HTTP Mock Service locally, optimizing integration efforts without incurring external AI token costs.
- **Diagnostic Logging & Auditing** â€” Includes complete cURL reconstruction and dynamic log extraction for comprehensive tracing and rapid incident resolution.
---

## ðŸš€ The 6 Core APIs

Instead of rigid endpoints, DUGate uses **action parameters** to adapt to thousands of use cases:

| Endpoint | Purpose | Sub-cases |
|---|---|---|
| `POST /api/v1/ingest` | Parse, OCR, and digitize documents. | `parse`, `ocr`, `digitize`, `split` |
| `POST /api/v1/extract` | Pull structured JSON from forms & docs. | `invoice`, `contract`, `id-card`, `receipt`, `table`, `custom` |
| `POST /api/v1/analyze` | Evaluate, fact-check, and classify content. | `classify`, `sentiment`, `compliance`, `fact-check`, `quality`, `risk`, `summarize-eval` |
| `POST /api/v1/transform` | Convert formats, translate, or redact PII. | `convert`, `translate`, `rewrite`, `redact`, `template` |
| `POST /api/v1/generate` | Create new content (summaries, QA, emails). | `summary`, `qa`, `outline`, `report`, `email`, `minutes` |
| `POST /api/v1/compare` | Semantic or text comparisons between files. | `diff`, `semantic`, `version` |

*For full parameter lists and JSON structures, refer to the [Integration Guide](docs/DU_INTEGRATION_GUIDE.md).*

---

## âš¡ Quick Start

### ðŸ³ Docker (Recommended)

The easiest way to get DUGate running along with its PostgreSQL database and mock services.

```bash
git clone https://github.com/ngocvietcode/dugate.git dugate
cd dugate
cp .env.example .env

# Edit .env to set DATABASE_URL, NEXTAUTH_SECRET, and your AI API Keys
docker compose up -d
```

### ðŸ’» Local Development

Prerequisites: `pandoc`, `ghostscript`, `Node.js 20+`.

```bash
npm install
cp .env.example .env

# Setup your Postgres Database locally, then run:
npx prisma generate
npx prisma db push
npx prisma db seed

npm run dev
# Access the Gateway UI at http://localhost:2023
```

---

## ðŸ“– Documentation & Architecture

Dive deeper into the design philosophy, client integration, and the powerful admin configuration interfaces:

- **[Admin Multi-Connector Guide](docs/admin-multi-connector-guide.md)** â€” Guide on routing overrides, visual dynamic pipeline chain building, and connector mapping (ex: output mapping into subsequent prompts).
- **[API Design Proposal](docs/API_DESIGN_PROPOSAL.md)** â€” Architectural overview, endpoint philosophy, and request/response lifecycles.
- **[Integration & Admin Guide](docs/DU_INTEGRATION_GUIDE.md)** â€” Comprehensive guide on API parameter usage, Async polling patterns, and basic Profile configuration.

---

## ðŸ› ï¸ Tech Stack

- **Core**: Next.js 14 (App Router), TypeScript, NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Engines**: 
  - `Pandoc` (DOCX structure parsing)
  - `Ghostscript` (PDF rendering & compression)
  - `Sharp` (Image optimization)
- **AI Integration**: Official SDKs for Gemini, OpenAI, Claude.

---

## ðŸ¤ Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on setting up the developer environment and submitting pull requests.

---

## ðŸ“„ License

[AGPL-3.0](LICENSE) â€” Free to use and self-host. Modifications must be open-sourced under the same license. 

> *Built to give developers total control over Document AI workflows.*

<br/>

---

# ðŸ‡»ðŸ‡³ DUGate (Vietnamese Version)

> **Giáº£i phÃ¡p kiáº¿n trÃºc cá»•ng trung gian API (Gateway) váº­n hÃ nh quy chuáº©n, trÃ­ch xuáº¥t vÃ  biáº¿n Ä‘á»•i tÃ i liá»‡u phi cáº¥u trÃºc thÃ nh dá»¯ liá»‡u thÃ´ng minh an toÃ n vÃ  tin cáº­y.**

DUGate lÃ  má»™t há»‡ thá»‘ng ná»™i bá»™ Ä‘Ã³ng vai trÃ² lÃ  API Gateway chuyÃªn biá»‡t cho cÃ¡c bÃ i toÃ¡n PhÃ¢n tÃ­ch TÃ i liá»‡u (Document Understanding). Thay vÃ¬ Ä‘á»ƒ cÃ¡c á»©ng dá»¥ng nghiá»‡p vá»¥ gá»i trá»±c tiáº¿p vÃ  phÃ¢n máº£nh Ä‘áº¿n cÃ¡c dá»‹ch vá»¥ OCR, LLM hay cÃ´ng cá»¥ parse file khÃ¡c nhau, DUGate quy chuáº©n hÃ³a toÃ n bá»™ sá»± phá»©c táº¡p Ä‘Ã³ vÃ o **6 API tiÃªu chuáº©n cáº¥p doanh nghiá»‡p**.

Há»‡ thá»‘ng Ä‘Æ°á»£c thiáº¿t káº¿ Ä‘áº·c biá»‡t phÃ¹ há»£p cho cÃ¡c quy trÃ¬nh nghiá»‡p vá»¥ yÃªu cáº§u tÃ­nh báº£o máº­t, chÃ­nh xÃ¡c vÃ  nháº¥t quÃ¡n cao nhÆ°: trÃ­ch xuáº¥t thÃ´ng tin hoÃ¡ Ä‘Æ¡n chá»©ng tá»«, Ä‘Ã¡nh giÃ¡ rá»§i ro há»£p Ä‘á»“ng, hay kiá»ƒm duyá»‡t tÃ i liá»‡u. Äiá»u nÃ y Ä‘Æ°á»£c Ä‘áº£m báº£o thÃ´ng qua cÆ¡ cháº¿ Ä‘á»‹nh tuyáº¿n cháº·t cháº½ theo Há»“ sÆ¡ thiáº¿t láº­p (Profile-Driven).

## âœ¨ NÄƒng Lá»±c Cá»‘t LÃµi

- **6 Endpoint Xá»­ LÃ½ Táº­p Trung** â€” Quy chuáº©n hoÃ¡ hÃ ng trÄƒm nghiá»‡p vá»¥ tÃ i liá»‡u thÃ´ng thÆ°á»ng thÃ nh cáº¥u trÃºc API Ä‘á»“ng nháº¥t (`ingest`, `extract`, `analyze`, `transform`, `generate`, `compare`).
- **Override Routing Dá»±a TrÃªn Profile** â€” Quáº£n trá»‹ viÃªn há»‡ thá»‘ng cÃ³ tháº©m quyá»n can thiá»‡p vÃ o viá»‡c Ä‘á»‹nh tuyáº¿n LLM model, thay Ä‘á»•i System Prompt, hoáº·c cáº¥u hÃ¬nh láº¡i cÃ¡c luá»“ng xá»­ lÃ½ Pipeline theo tá»«ng API Key. Äáº£m báº£o á»©ng dá»¥ng Client giao tiáº¿p má»™t cÃ¡ch minh báº¡ch mÃ  khÃ´ng cáº§n can thiá»‡p mÃ£ nguá»“n.
- **Chuá»—i Nghiá»‡p Vá»¥ Trá»±c Quan (Pipeline Builder)** â€” Giao diá»‡n Dashboard cung cáº¥p kháº£ nÄƒng thiáº¿t láº­p luá»“ng xá»­ lÃ½ chuyÃªn sÃ¢u, cho phÃ©p phÃ¢n bá»• vÃ  Ã¡nh xáº¡ Prompt Ä‘á»™ng cho cÃ¡c dá»‹ch vá»¥ liÃªn tiáº¿p nhau (vd: káº¿t quáº£ nghiá»‡p vá»¥ A sáº½ Ä‘Ã³ng vai trÃ² Dá»¯ liá»‡u Ä‘áº§u vÃ o cho Prompt nghiá»‡p vá»¥ B thÃ´ng qua biáº¿n `{{input_content}}`).
- **CÆ¡ Cháº¿ Xá»­ LÃ½ Báº¥t Äá»“ng Bá»™ (Async Engine)** â€” ÄÃ¡p á»©ng kháº£ nÄƒng khai thÃ¡c khá»‘i lÆ°á»£ng tÃ i liá»‡u lá»›n thÃ´ng qua cÆ¡ cháº¿ pháº£n há»“i `202 Accepted` káº¿t há»£p Webhook/Polling, Ä‘áº£m báº£o tÃ­nh á»•n Ä‘á»‹nh cá»§a há»‡ thá»‘ng lÃµi.
- **Há»— Trá»£ Má»Ÿ Rá»™ng Äa Ná»n Táº£ng AI** â€” Há»— trá»£ káº¿t ná»‘i an toÃ n Ä‘áº¿n Google Gemini, OpenAI, Claude, hoáº·c tÃ­ch há»£p trá»±c tiáº¿p vÃ o cÃ¡c mÃ´ hÃ¬nh AI/Dá»‹ch vá»¥ ná»™i bá»™ cá»§a doanh nghiá»‡p nháº±m Ä‘Ã¡p á»©ng tiÃªu chuáº©n ná»™i bá»™.
- **Há»‡ Thá»‘ng Dá»‹ch Vá»¥ Giáº£ Láº­p (Mock Service)** â€” MÃ´i trÆ°á»ng Mock HTTP Ä‘á»™c láº­p há»— trá»£ ká»¹ sÆ° váº­n hÃ nh cÃ¡c ká»‹ch báº£n kiá»ƒm thá»­ tá»± Ä‘á»™ng (Automated/E2E Test) trÃªn quy mÃ´ lá»›n, tá»‘i Æ°u hÃ³a triá»‡t Ä‘á»ƒ chi phÃ­ váº­n hÃ nh API.
- **GiÃ¡m SÃ¡t Äá»‹nh Tuyáº¿n & Truy Váº¿t (Diagnostic)** â€” Gateway tá»± Ä‘á»™ng khá»Ÿi táº¡o vÃ  lÆ°u váº¿t mÃ£ cURL ná»™i bá»™ má»—i khi thá»±c hiá»‡n giao tiáº¿p vá»›i dá»‹ch vá»¥ bÃªn thá»© 3, há»— trá»£ cÃ´ng tÃ¡c kiá»ƒm toÃ¡n (audit) vÃ  phÃ¡t hiá»‡n lá»—i nhanh chÃ³ng.

## ðŸš€ 6 API ChÃ­nh

| Endpoint | Chá»©c NÄƒng | CÃ¡c bÃ i toÃ¡n (Sub-cases) |
|---|---|---|
| `POST /api/v1/ingest` | Äá»c, OCR, vÃ  sá»‘ hoÃ¡ vÄƒn báº£n thÃ´. | `parse`, `ocr`, `digitize`, `split` |
| `POST /api/v1/extract` | TrÃ­ch xuáº¥t JSON tá»« cÃ¡c biá»ƒu máº«u. | `invoice`, `contract`, `id-card`, `receipt`, `table`, `custom` |
| `POST /api/v1/analyze` | ÄÃ¡nh giÃ¡, fact-check, phÃ¢n loáº¡i. | `classify`, `sentiment`, `compliance`, `fact-check`, `quality`, `risk`, `summarize-eval` |
| `POST /api/v1/transform` | Chuyá»ƒn Ä‘á»•i Ä‘á»‹nh dáº¡ng, dá»‹ch thuáº­t, mÃ£ hoÃ¡ PII. | `convert`, `translate`, `rewrite`, `redact`, `template` |
| `POST /api/v1/generate` | Sinh ná»™i dung má»›i (summary, bÃ¡o cÃ¡o). | `summary`, `qa`, `outline`, `report`, `email`, `minutes` |
| `POST /api/v1/compare` | So sÃ¡nh vÄƒn báº£n hoáº·c tÃ¬m khÃ¡c biá»‡t. | `diff`, `semantic`, `version` |

*Chi tiáº¿t vui lÃ²ng tham kháº£o [Integration Guide](docs/DU_INTEGRATION_GUIDE.md).*

## âš¡ Báº¯t Äáº§u Nhanh

### ðŸ³ Docker (KhuyÃªn dÃ¹ng)

CÃ¡ch nhanh nháº¥t Ä‘á»ƒ cháº¡y DUGate kÃ¨m PostgreSQL vÃ  Mock Service:

```bash
git clone https://github.com/ngocvietcode/dugate.git dugate
cd dugate
cp .env.example .env

# Sá»­a láº¡i file .env vá»›i thÃ´ng tin CSDL vÃ  API Key cá»§a báº¡n
docker compose up -d
```
Báº¡n sáº½ truy cáº­p Ä‘Æ°á»£c trang quáº£n trá»‹ Gateway UI táº¡i `http://localhost:2023`.
