# CÃ i Ä‘áº·t

## CÃ¡ch 1: Docker (Khuyáº¿n nghá»‹)

**YÃªu cáº§u:** Docker, Docker Compose

```bash
git clone https://github.com/nhannguyen09/dugate.git
cd dugate

cp .env.example .env
# Sá»­a .env: Ä‘iá»n DATABASE_URL, NEXTAUTH_SECRET, ENCRYPTION_KEY, NEXTAUTH_URL

docker compose up -d
```

Má»Ÿ `http://your-server:2023/setup` Ä‘á»ƒ táº¡o tÃ i khoáº£n admin.

**Cáº­p nháº­t:**

```bash
git pull
docker compose down
docker compose up -d --build
```

---

## CÃ¡ch 2: VPS â€” Ubuntu 22.04

### 1. CÃ i dependencies

```bash
sudo apt update && sudo apt install -y pandoc ghostscript nodejs npm postgresql nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

### 2. Táº¡o database PostgreSQL

```bash
sudo -u postgres psql -c "CREATE USER dugate WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "CREATE DATABASE dugate OWNER dugate;"
```

### 3. Clone vÃ  cáº¥u hÃ¬nh

```bash
git clone https://github.com/nhannguyen09/dugate.git /var/www/dugate
cd /var/www/dugate
npm install
cp .env.example .env
# Sá»­a .env
npx prisma migrate deploy
npm run build
```

### 4. Khá»Ÿi Ä‘á»™ng vá»›i PM2

```bash
pm2 start npm --name dugate -- start
pm2 save
pm2 startup
```

### 5. Nginx + SSL

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/dugate
sudo ln -s /etc/nginx/sites-available/dugate /etc/nginx/sites-enabled/
# Sá»­a config: thay YOUR_DOMAIN
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.com
```

---

## CÃ¡ch 3: Vercel (Giá»›i háº¡n)

::: warning
Vercel khÃ´ng há»— trá»£ Pandoc vÃ  Ghostscript. TÃ­nh nÄƒng transform DOCX khÃ´ng hoáº¡t Ä‘á»™ng. Chá»‰ dÃ¹ng Ä‘Æ°á»£c PDF vá»›i AI Vision trá»±c tiáº¿p.
:::

```bash
npm install -g vercel
vercel --prod
```

CÃ i biáº¿n mÃ´i trÆ°á»ng trong Vercel dashboard. DÃ¹ng PostgreSQL ngoÃ i (Supabase, Neon) cho `DATABASE_URL`.

Äá»ƒ dÃ¹ng Ä‘áº§y Ä‘á»§ tÃ­nh nÄƒng, hÃ£y chá»n Docker hoáº·c VPS.
