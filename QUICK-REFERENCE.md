# Quick Reference Card

## 🏠 Local Development

```bash
cd kairoo-storage
npm run dev
```

Visit: `http://localhost:3000`

---

## 🚀 Production URLs

| Service     | URL                                 | Purpose            |
| ----------- | ----------------------------------- | ------------------ |
| Dashboard   | https://app.kairoo.me               | UI and management  |
| Upload API  | https://uploads.kairoo.me           | File uploads       |
| File Access | https://uploads.kairoo.me/files/... | Direct file access |

---

## 📡 API Endpoints

### Upload File

```bash
curl -X POST https://uploads.kairoo.me/upload \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@image.jpg"
```

### List Files

```bash
curl https://app.kairoo.me/api/v1/files \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Delete File

```bash
curl -X DELETE https://uploads.kairoo.me/files/123 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Access File

```
https://uploads.kairoo.me/files/project-name/images/filename.jpg
```

---

## 🔧 Oracle VPS Commands

```bash
# SSH
ssh user@158.178.204.36

# Service status
pm2 status

# View logs
pm2 logs kairoo-upload-service

# Restart
pm2 restart kairoo-upload-service

# Monitor
pm2 monit

# Update service
cd /var/www/KairoStorageSerivce/upload-service
git pull && npm install && pm2 restart kairoo-upload-service
```

---

## 🌐 Vercel Commands

```bash
# Deploy
vercel --prod

# Or just push
git push origin main
```

---

## 🔍 Health Checks

```bash
# Upload service
curl https://uploads.kairoo.me/health

# Dashboard
curl https://app.kairoo.me
```

---

## 📊 Check Logs

```bash
# Upload service
pm2 logs kairoo-upload-service --lines 100

# Nginx access
sudo tail -f /var/log/nginx/access.log

# Nginx errors
sudo tail -f /var/log/nginx/error.log

# PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-*-main.log
```

---

## 🔥 Emergency Commands

```bash
# Restart everything
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart postgresql

# Check what's using port 4000
sudo netstat -tulpn | grep 4000

# Check disk space
df -h

# Check memory
free -h

# Check processes
top
```

---

## 🗄️ Database

```bash
# Connect
psql -U kairoo -d kairoo_storage

# Backup
pg_dump kairoo_storage > backup.sql

# Restore
psql kairoo_storage < backup.sql
```

---

## 📁 File Locations

| Item           | Location                                       |
| -------------- | ---------------------------------------------- |
| Upload Service | `/var/www/KairoStorageSerivce/upload-service`  |
| Uploaded Files | `/var/www/KairooStorageFiles/`                 |
| Nginx Config   | `/etc/nginx/sites-available/uploads.kairoo.me` |
| Service Logs   | `/var/www/.../upload-service/logs/`            |
| PM2 Logs       | `~/.pm2/logs/`                                 |

---

## 🔐 Environment Variables

### Oracle (.env)

```env
PORT=4000
UPLOADS_ROOT=/var/www/KairooStorageFiles
DATABASE_URL=postgresql://...
PUBLIC_URL=https://uploads.kairoo.me
NODE_ENV=production
```

### Vercel

```env
DATABASE_URL=postgresql://...@158.178.204.36:5432/kairoo_storage
STORAGE_BACKEND_URL=https://uploads.kairoo.me
ADMIN_EMAIL=boussettah.dev@gmail.com
ADMIN_JWT_SECRET=...
NODE_ENV=production
```

---

## 🆘 Common Issues

### Upload fails

```bash
pm2 logs kairoo-upload-service
pm2 restart kairoo-upload-service
```

### Files not accessible

```bash
sudo chown -R www-data:www-data /var/www/KairooStorageFiles/
sudo chmod -R 755 /var/www/KairooStorageFiles/
sudo systemctl reload nginx
```

### Database connection fails

```bash
sudo systemctl status postgresql
sudo ufw status
psql $DATABASE_URL -c "SELECT 1"
```

### SSL issues

```bash
sudo certbot certificates
sudo certbot renew
```

---

## 📚 Full Documentation

- **Complete Guide**: `docs/DEPLOYMENT.md`
- **Architecture**: `docs/deployment-architecture.md`
- **Setup Summary**: `HYBRID-SETUP-COMPLETE.md`
- **Upload Service**: `upload-service/README.md`

---

## 🎯 Deployment Steps

1. **Oracle Setup** (30 min)

   ```bash
   cd /var/www/KairoStorageSerivce/upload-service
   ./setup.sh
   ```

2. **Vercel Deploy** (10 min)

   - Push to GitHub
   - Import to Vercel
   - Add env variables
   - Deploy

3. **DNS Config** (5 min)

   - Cloudflare: Add CNAME for app
   - Cloudflare: Add A record for uploads

4. **Test** (5 min)
   - Health checks
   - Upload file
   - View in dashboard

---

**Total Setup Time: ~50 minutes**
