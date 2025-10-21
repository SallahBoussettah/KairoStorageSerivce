# 🎉 Hybrid Architecture Setup Complete!

Your Kairoo Storage is now configured for hybrid deployment.

## 📁 What Was Created

### Upload Service (Oracle VPS)

```
upload-service/
├── index.js              # Main Express server
├── db.js                 # Database connection
├── schema.js             # Database schema
├── utils.js              # Helper functions
├── package.json          # Dependencies
├── ecosystem.config.cjs  # PM2 configuration
├── nginx.conf            # Nginx configuration
├── setup.sh              # Automated setup script
├── .env.example          # Environment template
└── README.md             # Detailed instructions
```

### Documentation

```
docs/
├── DEPLOYMENT.md                  # Complete deployment guide
├── deployment-architecture.md     # Architecture explanation
├── local-development-guide.md     # Local dev guide
└── oracle-production-guide.md     # Oracle setup guide
```

### Next.js Updates

- Updated upload route to support both local and production
- Created environment variable examples
- File serving route for local development

---

## 🚀 Quick Start

### For Local Development (Right Now)

Your current setup already works! Just keep using:

```bash
cd kairoo-storage
npm run dev
```

Files are served via Next.js API routes at `http://localhost:3000`

### For Production Deployment

#### 1. Oracle VPS Setup (30 minutes)

```bash
# SSH into Oracle
ssh user@158.178.204.36

# Clone repo
cd /var/www
git clone https://github.com/yourusername/KairoStorageSerivce.git
cd KairoStorageSerivce/upload-service

# Run setup script
chmod +x setup.sh
./setup.sh
```

The script will:

- ✅ Create upload directories
- ✅ Install dependencies
- ✅ Setup environment
- ✅ Start PM2 service
- ✅ Configure Nginx
- ✅ Setup SSL

#### 2. Vercel Deployment (10 minutes)

```bash
# Push to GitHub
git add .
git commit -m "Add hybrid architecture"
git push origin main

# Deploy to Vercel
# 1. Go to vercel.com
# 2. Import your repo
# 3. Add environment variables:
#    - DATABASE_URL=postgresql://...@158.178.204.36:5432/kairoo_storage
#    - STORAGE_BACKEND_URL=https://uploads.kairoo.me
#    - ADMIN_EMAIL=boussettah.dev@gmail.com
#    - ADMIN_JWT_SECRET=your-secret
# 4. Deploy!
```

#### 3. DNS Configuration (5 minutes)

In Cloudflare:

```
A     uploads  →  158.178.204.36  (Proxied)
CNAME app      →  cname.vercel-dns.com  (DNS only)
```

---

## 🏗️ Architecture

```
User Browser
     │
     ├─→ Dashboard UI ──→ Vercel (app.kairoo.me)
     │                     └─→ Next.js pages
     │                     └─→ Auth API
     │                     └─→ Projects API
     │
     └─→ File Upload ───→ Oracle VPS (uploads.kairoo.me)
                           ├─→ Upload Service (port 4000)
                           ├─→ Nginx (serves files)
                           ├─→ PostgreSQL
                           └─→ /var/www/KairooStorageFiles/
```

---

## 📋 Deployment Checklist

### Oracle VPS

- [ ] PostgreSQL installed and configured
- [ ] Upload service running on port 4000
- [ ] Nginx configured and running
- [ ] SSL certificate installed
- [ ] Firewall configured (ports 80, 443, 5432)
- [ ] PM2 configured to start on boot
- [ ] Upload directory created with correct permissions

### Vercel

- [ ] Repository pushed to GitHub
- [ ] Project imported to Vercel
- [ ] Environment variables configured
- [ ] Custom domain configured (app.kairoo.me)
- [ ] Deployment successful

### DNS

- [ ] uploads.kairoo.me → Oracle VPS
- [ ] app.kairoo.me → Vercel
- [ ] SSL working on both domains

### Testing

- [ ] Health check: `curl https://uploads.kairoo.me/health`
- [ ] Dashboard accessible: `https://app.kairoo.me`
- [ ] Can login to dashboard
- [ ] Can create project
- [ ] Can upload file via API
- [ ] Can view file in browser
- [ ] Can delete file

---

## 🔧 Management Commands

### Oracle VPS

```bash
# SSH into server
ssh user@158.178.204.36

# Check service status
pm2 status

# View logs
pm2 logs kairoo-upload-service

# Restart service
pm2 restart kairoo-upload-service

# Monitor
pm2 monit

# Update service
cd /var/www/KairoStorageSerivce/upload-service
git pull
npm install
pm2 restart kairoo-upload-service
```

### Vercel

```bash
# Deploy from CLI
vercel --prod

# Or just push to GitHub
git push origin main
# Vercel auto-deploys
```

---

## 📊 Monitoring

### Health Checks

```bash
# Upload service
curl https://uploads.kairoo.me/health

# Dashboard
curl https://app.kairoo.me
```

### Logs

```bash
# Upload service logs
pm2 logs kairoo-upload-service

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*-main.log
```

### Monitoring Services (Optional)

- **UptimeRobot**: Monitor uptime
- **PM2 Plus**: Monitor Node.js performance
- **Vercel Analytics**: Monitor dashboard performance

---

## 💰 Cost Breakdown

| Service    | Cost          | Notes                 |
| ---------- | ------------- | --------------------- |
| Oracle VPS | Free / $10/mo | Free tier available   |
| Vercel     | Free          | Hobby plan            |
| Cloudflare | Free          | Free plan             |
| Domain     | ~$12/year     | kairoo.me             |
| **Total**  | **$0-10/mo**  | + $12/year for domain |

---

## 🆘 Troubleshooting

### Upload fails with 500 error

```bash
# Check upload service logs
pm2 logs kairoo-upload-service

# Check if service is running
pm2 status

# Restart service
pm2 restart kairoo-upload-service
```

### Files not accessible

```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check file permissions
ls -la /var/www/KairooStorageFiles/

# Fix permissions
sudo chown -R www-data:www-data /var/www/KairooStorageFiles/
sudo chmod -R 755 /var/www/KairooStorageFiles/
```

### Database connection fails

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check PostgreSQL is running
sudo systemctl status postgresql

# Check firewall
sudo ufw status
```

---

## 📚 Documentation

- **Full Deployment Guide**: `docs/DEPLOYMENT.md`
- **Architecture Explanation**: `docs/deployment-architecture.md`
- **Upload Service README**: `upload-service/README.md`
- **Local Development**: `docs/local-development-guide.md`

---

## 🎯 Next Steps

1. **Test locally** - Make sure everything works in development
2. **Setup Oracle VPS** - Follow `docs/DEPLOYMENT.md` Part 1
3. **Deploy to Vercel** - Follow `docs/DEPLOYMENT.md` Part 2
4. **Configure DNS** - Follow `docs/DEPLOYMENT.md` Part 3
5. **Test production** - Upload files and verify everything works
6. **Setup monitoring** - Configure UptimeRobot or similar
7. **Setup backups** - Automate database and file backups

---

## ✅ Benefits of This Architecture

- ✅ **Persistent Storage**: Files stored on Oracle VPS
- ✅ **Fast Dashboard**: Vercel's global CDN
- ✅ **Cost Effective**: Free tier for most services
- ✅ **Scalable**: Can upgrade Oracle VPS as needed
- ✅ **Reliable**: PM2 auto-restarts on failure
- ✅ **Secure**: SSL on both domains
- ✅ **Easy Updates**: Push to GitHub to update dashboard

---

## 🤝 Support

Need help? Check:

1. Documentation in `docs/` folder
2. Logs: `pm2 logs kairoo-upload-service`
3. Email: boussettah.dev@gmail.com

---

**Happy deploying! 🚀**
