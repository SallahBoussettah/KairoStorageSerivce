# Production Deployment Guide

### Goal

Deploy Kairoo Storage as a **serverless Vercel full-stack webapp**
connected to the **Oracle VPS upload listener (port 4000)**.

---

## 1. Production Overview

| Component                | Platform               | Description                    |
| ------------------------ | ---------------------- | ------------------------------ |
| **Frontend + Dashboard** | Vercel                 | Fast global delivery           |
| **Upload Backend**       | Oracle VPS (port 4000) | Handles uploads + writes to DB |
| **Database**             | PostgreSQL (on Oracle) | Stores metadata + projects     |
| **DNS / SSL**            | Cloudflare + Certbot   | Domains & security             |

---

## 2. Cloudflare Setup

1. In Cloudflare DNS for _kairoo.me_:

   - `A @` → `158.178.204.36` (Proxy ON)
   - `A uploads` → `158.178.204.36` (Proxy ON)
   - `CNAME app` → `cname.vercel-dns.com`

2. SSL/TLS → **Full** mode.

---

## 3. Oracle VPS Setup

```bash
sudo mkdir -p /var/www/KairoStorageSerivce/KairooStorageFiles
sudo chown -R www-data:www-data /var/www/KairoStorageSerivce/KairooStorageFiles
```

Install Node + Nginx + Certbot + Postgres client.
Pull upload service code into `/var/www/KairoStorageSerivce/upload-service`.

---

## 4. Upload Service (Port 4000)

Environment `.env.production`

```env
PORT=4000
UPLOADS_ROOT=/var/www/KairooStorageFiles
DATABASE_URL=postgresql://postgres:pass@127.0.0.1:5432/kairoo_storage
```

Start with PM2 or systemd.

---

## 5. Nginx Reverse Proxy

`/etc/nginx/sites-available/uploads.kairoo.me`

```nginx
server {
  listen 80;
  server_name uploads.kairoo.me;

  location /files/ {
    alias /var/www/KairooStorageFiles/;
    add_header Access-Control-Allow-Origin *;
    try_files $uri =404;
  }

  location /upload {
    proxy_pass http://127.0.0.1:4000;
  }
}
```

Enable & SSL:

```bash
sudo ln -s /etc/nginx/sites-available/uploads.kairoo.me /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d uploads.kairoo.me
```

---

## 6. Vercel Deployment

1. Push your Next.js project to GitHub.
2. Import into Vercel.
3. Add Environment Variables:

   ```env
   DATABASE_URL=postgresql://postgres:pass@158.178.204.36:5432/kairoo_storage
   STORAGE_BACKEND_URL=https://uploads.kairoo.me
   ADMIN_EMAIL=boussettah.dev@gmail.com
   ```

4. Vercel auto-deploys dashboard to `app.kairoo.me`.

---

## 7. Automatic Migrations

On Vercel build:

```bash
npx drizzle-kit push:pg
```

On Oracle upload service start:

```ts
await migrate(db, { migrationsFolder: "./drizzle/migrations" });
```

---

## 8. Post-Deployment Checklist

| ✅  | Task                                        |
| --- | ------------------------------------------- |
| ☑️  | HTTPS works for uploads.kairoo.me           |
| ☑️  | Database connected and synced               |
| ☑️  | Upload service responds to `POST /upload`   |
| ☑️  | Dashboard shows projects + files            |
| ☑️  | Docs page visible and playground functional |

---

## 9. Maintenance Notes

- Rotate API keys regularly.
- Back up `/var/www/KairoStorageSerivce/KairooStorageFiles` and PostgreSQL.
- Use `pm2 restart upload-service` after updates.
- Monitor with UptimeRobot or Cronitor.

---
