# Hybrid Deployment Guide

This guide walks you through deploying Kairoo Storage in a hybrid architecture:

- **Vercel**: Next.js dashboard and API (app.kairoo.me)
- **Oracle VPS**: File upload service and storage (uploads.kairoo.me)

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│   Vercel (app.kairoo.me)            │
│   ├── Dashboard UI                  │
│   ├── Auth API                      │
│   ├── Projects API                  │
│   └── Files List API (read-only)    │
└──────────────┬──────────────────────┘
               │
               │ Uploads go directly to Oracle
               ↓
┌─────────────────────────────────────┐
│   Oracle VPS (uploads.kairoo.me)    │
│   ├── Upload Service (port 4000)    │
│   ├── Nginx (serves files)          │
│   ├── PostgreSQL                    │
│   └── /var/www/KairooStorageFiles/  │
└─────────────────────────────────────┘
```

---

## Part 1: Oracle VPS Setup

### Step 1: Install Prerequisites

```bash
# SSH into your Oracle VPS
ssh user@158.178.204.36

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt-get install -y nginx

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib
```

### Step 2: Setup PostgreSQL

**Important:** Both kairoo-storage (Vercel) and upload-service (Oracle) use the SAME database!

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE kairoo_storage;
CREATE USER postgres WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE kairoo_storage TO postgres;
\q

# Allow remote connections (for Vercel to connect)
sudo nano /etc/postgresql/*/main/postgresql.conf
# Change: listen_addresses = '*'

sudo nano /etc/postgresql/*/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5

# Restart PostgreSQL
sudo systemctl restart postgresql

# Open PostgreSQL port in firewall (for Vercel)
sudo ufw allow 5432/tcp
```

### Step 3: Setup Upload Directory

```bash
# Create directory
sudo mkdir -p /var/www/KairooStorageFiles
sudo chown -R $USER:$USER /var/www/KairooStorageFiles
sudo chmod -R 755 /var/www/KairooStorageFiles
```

### Step 4: Deploy Upload Service

```bash
# Clone your repository
cd /var/www
git clone https://github.com/yourusername/KairoStorageSerivce.git
cd KairoStorageSerivce/upload-service

# Install dependencies
npm install

# Create .env file
nano .env
```

Add to `.env`:

```env
PORT=4000
NODE_ENV=production
UPLOADS_ROOT=/var/www/KairooStorageFiles
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kairoo_storage
DB_USER=postgres
DB_PASSWORD=your_secure_password
PUBLIC_URL=https://uploads.kairoo.me
```

**Important:** Use the same database credentials as kairoo-storage!

```bash
# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.cjs

# Save PM2 config
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command it outputs
```

### Step 5: Configure Nginx

```bash
# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/uploads.kairoo.me

# Enable site
sudo ln -s /etc/nginx/sites-available/uploads.kairoo.me /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Step 6: Setup SSL

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d uploads.kairoo.me

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 7: Configure Firewall

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw allow 5432/tcp

# Enable firewall
sudo ufw enable
```

### Step 8: Verify Oracle Setup

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs kairoo-upload-service

# Test health endpoint
curl http://localhost:4000/health

# Test from outside
curl https://uploads.kairoo.me/health
```

---

## Part 2: Vercel Deployment

### Step 1: Prepare Next.js App

```bash
# In your local kairoo-storage directory
cd kairoo-storage

# Make sure all dependencies are installed
npm install

# Test build locally
npm run build
```

### Step 2: Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Prepare for Vercel deployment"

# Push to GitHub
git remote add origin https://github.com/yourusername/KairoStorageSerivce.git
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `kairoo-storage`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 4: Add Environment Variables in Vercel

In Vercel project settings → Environment Variables, add:

```env
DATABASE_URL=postgresql://postgres:your_secure_password@158.178.204.36:5432/kairoo_storage
STORAGE_BACKEND_URL=https://uploads.kairoo.me
ADMIN_EMAIL=boussettah.dev@gmail.com
ADMIN_JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

**Important:** Use the same database credentials as upload-service!

### Step 5: Configure Custom Domain

1. In Vercel project settings → Domains
2. Add domain: `app.kairoo.me`
3. In Cloudflare DNS, add:
   ```
   CNAME app cname.vercel-dns.com
   ```
4. Wait for DNS propagation (5-10 minutes)

### Step 6: Deploy

```bash
# Vercel will auto-deploy on push, or manually:
vercel --prod
```

---

## Part 3: Cloudflare DNS Configuration

In your Cloudflare dashboard for `kairoo.me`:

| Type  | Name    | Content              | Proxy Status |
| ----- | ------- | -------------------- | ------------ |
| A     | @       | 158.178.204.36       | Proxied      |
| A     | uploads | 158.178.204.36       | Proxied      |
| CNAME | app     | cname.vercel-dns.com | DNS only     |

---

## Part 4: Testing the Deployment

### Test 1: Health Checks

```bash
# Oracle upload service
curl https://uploads.kairoo.me/health

# Vercel dashboard
curl https://app.kairoo.me
```

### Test 2: Upload a File

```bash
# First, get an API key from the dashboard
# Then test upload:

curl -X POST https://uploads.kairoo.me/upload \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@test-image.jpg"
```

### Test 3: Access File

```bash
# Use the URL returned from upload
curl https://uploads.kairoo.me/files/project-name/images/filename.jpg
```

### Test 4: Dashboard

1. Visit https://app.kairoo.me
2. Login with admin credentials
3. Create a project
4. Upload a file via API
5. View file in dashboard

---

## Part 5: Monitoring & Maintenance

### Monitor Upload Service

```bash
# SSH into Oracle
ssh user@158.178.204.36

# Check PM2 status
pm2 status

# View logs
pm2 logs kairoo-upload-service

# Monitor resources
pm2 monit
```

### Monitor Vercel

- Check Vercel dashboard for deployment status
- View function logs in Vercel
- Set up Vercel Analytics (optional)

### Backup Strategy

```bash
# Backup database (run on Oracle)
pg_dump kairoo_storage > backup_$(date +%Y%m%d).sql

# Backup files
tar -czf files_backup_$(date +%Y%m%d).tar.gz /var/www/KairooStorageFiles/

# Setup automated backups with cron
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

### Update Upload Service

```bash
# SSH into Oracle
cd /var/www/KairoStorageSerivce/upload-service

# Pull latest changes
git pull

# Install dependencies
npm install

# Restart service
pm2 restart kairoo-upload-service
```

### Update Next.js App

```bash
# Just push to GitHub
git push origin main

# Vercel will auto-deploy
```

---

## Troubleshooting

### Upload Service Issues

```bash
# Check if service is running
pm2 status

# View recent logs
pm2 logs kairoo-upload-service --lines 100

# Restart service
pm2 restart kairoo-upload-service

# Check port 4000
sudo netstat -tulpn | grep 4000
```

### Database Connection Issues

```bash
# Test connection from Oracle
psql -U kairoo -d kairoo_storage -h 127.0.0.1

# Test connection from outside (Vercel)
psql -U kairoo -d kairoo_storage -h 158.178.204.36

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*-main.log
```

### Nginx Issues

```bash
# Check nginx status
sudo systemctl status nginx

# Test config
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# Reload nginx
sudo systemctl reload nginx
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

---

## Security Checklist

- [ ] PostgreSQL password is strong and unique
- [ ] JWT secret is strong and unique
- [ ] Firewall is enabled and configured
- [ ] SSL certificates are installed and auto-renewing
- [ ] Database backups are automated
- [ ] File backups are automated
- [ ] PM2 is configured to restart on failure
- [ ] Monitoring is set up (UptimeRobot, etc.)
- [ ] API keys are rotated regularly
- [ ] Environment variables are not committed to git

---

## Performance Optimization

### Oracle VPS

```bash
# Increase PM2 instances if needed
pm2 scale kairoo-upload-service 2

# Enable PM2 cluster mode
# Edit ecosystem.config.cjs:
# instances: "max"
# exec_mode: "cluster"
```

### Nginx Caching

Add to nginx config:

```nginx
# Cache static files
location /files/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Database Optimization

```sql
-- Add indexes for better performance
CREATE INDEX idx_files_project_id ON files(project_id);
CREATE INDEX idx_files_type ON files(type);
CREATE INDEX idx_projects_api_key ON projects(api_key);
```

---

## Cost Estimate

- **Oracle VPS**: Free tier (or ~$10/month)
- **Vercel**: Free tier for hobby projects
- **Cloudflare**: Free tier
- **Domain**: ~$12/year

**Total**: ~$0-10/month + domain

---

## Support

For issues or questions:

- Email: boussettah.dev@gmail.com
- Check logs: `pm2 logs kairoo-upload-service`
- Vercel logs: Check Vercel dashboard
