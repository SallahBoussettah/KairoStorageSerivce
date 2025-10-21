# Production Setup Guide

Complete guide for deploying Kairoo Storage to production.

## 🏗️ Architecture Overview

- **Frontend**: Next.js dashboard on Vercel (`app.kairoo.me`)
- **Backend**: Node.js upload service on Oracle VPS (`uploads.kairoo.me`)
- **Database**: PostgreSQL on Oracle VPS (shared)
- **Storage**: File system on Oracle VPS
- **Web Server**: Nginx with SSL

---

## 📋 Prerequisites

### Oracle VPS

- Ubuntu/Debian server
- Node.js 18+
- PostgreSQL 14+
- Nginx
- PM2 (`npm install -g pm2`)
- Certbot (for SSL)

### Vercel Account

- GitHub repository connected
- Vercel CLI (optional)

### DNS

- Domain configured in Cloudflare/DNS provider
- A record: `uploads.kairoo.me` → Oracle VPS IP
- CNAME: `app.kairoo.me` → Vercel

---

## 🚀 Part 1: Oracle VPS Setup

### 1. Database Configuration

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE kairoo_storage;

# Create user
CREATE USER kairoo_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE kairoo_storage TO kairoo_user;

# Exit
\q
```

### 2. Upload Service Setup

```bash
# Navigate to upload service
cd /var/www/KairoStorageSerivce/upload-service

# Install dependencies
npm install

# Configure environment
cp .env.production.example .env
nano .env
```

**Edit `.env`:**

```env
PORT=4000
NODE_ENV=production
UPLOADS_ROOT=/var/www/KairooStorageFiles
DATABASE_URL=postgresql://kairoo_user:your_password@localhost:5432/kairoo_storage
PUBLIC_URL=https://uploads.kairoo.me
```

### 3. Create Upload Directory

```bash
# Create directory
sudo mkdir -p /var/www/KairooStorageFiles

# Set ownership
sudo chown -R $USER:$USER /var/www/KairooStorageFiles

# Set permissions
sudo chmod -R 755 /var/www/KairooStorageFiles
```

### 4. Test Service

```bash
# Test run
node index.js

# Should see:
# ✅ Database connected successfully
# 🚀 Kairoo Upload Service running on port 4000

# Press Ctrl+C to stop
```

### 5. Start with PM2

```bash
# Start service
pm2 start ecosystem.config.cjs

# Save configuration
pm2 save

# Setup auto-start on boot
pm2 startup
# Run the command it outputs

# Verify
pm2 status
pm2 logs kairoo-upload-service
```

### 6. Configure Nginx

```bash
# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/uploads.kairoo.me

# Enable site
sudo ln -s /etc/nginx/sites-available/uploads.kairoo.me /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 7. Setup SSL

```bash
# Get SSL certificate
sudo certbot --nginx -d uploads.kairoo.me

# Test auto-renewal
sudo certbot renew --dry-run
```

### 8. Configure Firewall

```bash
# Allow ports
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 443/tcp    # HTTPS
sudo ufw allow 22/tcp     # SSH
sudo ufw allow 5432/tcp   # PostgreSQL (for Vercel)

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 9. Verify Upload Service

```bash
# Health check
curl https://uploads.kairoo.me/health

# Should return:
# {"status":"ok","service":"kairoo-upload-service"}
```

---

## 🌐 Part 2: Vercel Deployment

### 1. Prepare Repository

```bash
cd /path/to/KairoStorageSerivce/kairoo-storage

# Ensure .env.production.example exists
cat .env.production.example
```

### 2. Deploy to Vercel

**Option A: Via Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select `kairoo-storage` as root directory
4. Add environment variables (see below)
5. Deploy

**Option B: Via CLI**

```bash
cd kairoo-storage

# Login
vercel login

# Deploy
vercel --prod
```

### 3. Configure Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

```env
DATABASE_URL=postgresql://kairoo_user:password@158.178.204.36:5432/kairoo_storage
STORAGE_BACKEND_URL=https://uploads.kairoo.me
ADMIN_EMAIL=boussettah.dev@gmail.com
ADMIN_JWT_SECRET=your_production_secret_here
NODE_ENV=production
```

**Important**: Replace with your actual values!

### 4. Configure Custom Domain

1. Go to Vercel project settings
2. Add domain: `app.kairoo.me`
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

---

## ✅ Part 3: Verification

### 1. Test Upload Service

```bash
# Health check
curl https://uploads.kairoo.me/health

# Test upload (get API key from dashboard first)
curl -X POST https://uploads.kairoo.me/upload \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@test.jpg"
```

### 2. Test Dashboard

1. Visit: `https://app.kairoo.me`
2. Login with admin email
3. Create a test project
4. Copy API key
5. Test upload in API playground

### 3. Test File Access

```bash
# Use URL from upload response
curl https://uploads.kairoo.me/files/project-name/images/filename.jpg
```

### 4. Test Full Flow

1. **Dashboard**: Create project → Get API key
2. **Upload**: Upload file via API
3. **List**: View files in dashboard
4. **Access**: Open file URL in browser
5. **Delete**: Delete file from dashboard

---

## 🔧 Management Commands

### Oracle VPS

```bash
# SSH to server
ssh user@158.178.204.36

# Service management
pm2 status
pm2 logs kairoo-upload-service
pm2 restart kairoo-upload-service
pm2 monit

# Nginx
sudo systemctl status nginx
sudo systemctl reload nginx
sudo tail -f /var/log/nginx/error.log

# Database
sudo systemctl status postgresql
psql -U kairoo_user -d kairoo_storage
```

### Vercel

```bash
# View deployments
vercel ls

# View logs
vercel logs

# Redeploy
vercel --prod

# Or just push to GitHub
git push origin main
```

---

## 🆘 Troubleshooting

### Upload Service Issues

```bash
# Check logs
pm2 logs kairoo-upload-service --lines 100

# Check if running
pm2 status

# Restart
pm2 restart kairoo-upload-service

# Check port
sudo netstat -tulpn | grep 4000
```

### Database Connection Issues

```bash
# Test connection
psql -U kairoo_user -d kairoo_storage -h localhost

# Check PostgreSQL
sudo systemctl status postgresql

# View logs
sudo tail -f /var/log/postgresql/postgresql-*-main.log

# Check firewall
sudo ufw status
```

### File Upload/Access Issues

```bash
# Check directory permissions
ls -la /var/www/KairooStorageFiles/

# Fix permissions
sudo chown -R www-data:www-data /var/www/KairooStorageFiles/
sudo chmod -R 755 /var/www/KairooStorageFiles/

# Check nginx
sudo nginx -t
sudo systemctl reload nginx
```

### SSL Certificate Issues

```bash
# Check certificates
sudo certbot certificates

# Renew
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

### Vercel Deployment Issues

```bash
# Check build logs in Vercel dashboard
# Check environment variables are set
# Verify DATABASE_URL is accessible from Vercel
```

---

## 🔐 Security Checklist

- ✅ Strong database password
- ✅ Firewall configured (ufw)
- ✅ SSL certificates active
- ✅ API keys secured
- ✅ JWT secret is strong
- ✅ PostgreSQL only allows necessary connections
- ✅ File upload directory has correct permissions
- ✅ Environment variables not committed to git

---

## 📊 Monitoring

### Health Checks

```bash
# Upload service
curl https://uploads.kairoo.me/health

# Dashboard
curl https://app.kairoo.me
```

### Setup Monitoring (Optional)

- **UptimeRobot**: Monitor both URLs
- **PM2 Plus**: Advanced monitoring
- **Sentry**: Error tracking for dashboard

---

## 🔄 Updates

### Update Upload Service

```bash
cd /var/www/KairoStorageSerivce/upload-service
git pull
npm install
pm2 restart kairoo-upload-service
```

### Update Dashboard

```bash
# Just push to GitHub
git push origin main

# Vercel auto-deploys
```

---

## 📁 Important Paths

| Item            | Path                                           |
| --------------- | ---------------------------------------------- |
| Upload Service  | `/var/www/KairoStorageSerivce/upload-service`  |
| Uploaded Files  | `/var/www/KairooStorageFiles/`                 |
| Nginx Config    | `/etc/nginx/sites-available/uploads.kairoo.me` |
| PM2 Logs        | `~/.pm2/logs/`                                 |
| Nginx Logs      | `/var/log/nginx/`                              |
| PostgreSQL Logs | `/var/log/postgresql/`                         |

---

## 🎯 Post-Deployment

1. ✅ Test all API endpoints
2. ✅ Upload test files
3. ✅ Verify file access
4. ✅ Test file deletion
5. ✅ Setup monitoring
6. ✅ Configure backups
7. ✅ Document API keys
8. ✅ Share documentation with team

---

## 📚 Related Documentation

- **[Production API](PRODUCTION-API.md)** - API reference
- **[Quick Reference](QUICK-REFERENCE.md)** - Commands and URLs
- **[Dashboard README](../kairoo-storage/README.md)** - Frontend details
- **[Upload Service README](../upload-service/README.md)** - Backend details

---

## 📧 Support

**Email**: boussettah.dev@gmail.com

---

**Total Setup Time: ~45 minutes**
