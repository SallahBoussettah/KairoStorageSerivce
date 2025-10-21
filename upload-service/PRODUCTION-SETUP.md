# Upload Service - Production Setup on Oracle VPS

## Prerequisites

- Oracle VPS with Ubuntu/Debian
- Node.js 20+ installed
- PostgreSQL installed and running
- Nginx installed
- PM2 installed globally (`npm install -g pm2`)

---

## Step 1: Setup Database

The upload-service uses the **same database** as kairoo-storage.

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database (if not already created)
CREATE DATABASE kairoo_storage;

# Create user (if not already created)
CREATE USER postgres WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE kairoo_storage TO postgres;

# Exit
\q
```

---

## Step 2: Clone and Setup Upload Service

```bash
# Navigate to your project directory
cd /var/www/KairoStorageSerivce/upload-service

# Install dependencies
npm install

# Create production environment file
cp .env.production.example .env

# Edit the .env file
nano .env
```

### Configure `.env`:

```env
PORT=4000
NODE_ENV=production
UPLOADS_ROOT=/var/www/KairooStorageFiles
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kairoo_storage
DB_USER=postgres
DB_PASSWORD=your_actual_password_here
PUBLIC_URL=https://uploads.kairoo.me
```

**Important:** Update `DB_PASSWORD` with your actual PostgreSQL password!

---

## Step 3: Create Upload Directory

```bash
# Create the uploads directory
sudo mkdir -p /var/www/KairooStorageFiles

# Set ownership
sudo chown -R $USER:$USER /var/www/KairooStorageFiles

# Set permissions
sudo chmod -R 755 /var/www/KairooStorageFiles
```

---

## Step 4: Test the Service

```bash
# Test run
node index.js

# You should see:
# 🚀 Kairoo Upload Service running on port 4000
# 📁 Uploads directory: /var/www/KairooStorageFiles
# 🗄️  Database: localhost:5432/kairoo_storage
# ✅ Database connected successfully

# Press Ctrl+C to stop
```

---

## Step 5: Start with PM2

```bash
# Start the service
pm2 start ecosystem.config.cjs

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command it outputs (usually starts with 'sudo')

# Check status
pm2 status

# View logs
pm2 logs kairoo-upload-service
```

---

## Step 6: Configure Nginx

```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/uploads.kairoo.me

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/uploads.kairoo.me /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

## Step 7: Setup SSL with Certbot

```bash
# Install Certbot (if not already installed)
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d uploads.kairoo.me

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## Step 8: Configure Firewall

```bash
# Allow necessary ports
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 5432/tcp  # PostgreSQL (for Vercel connection)

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Step 9: Verify Everything Works

### Test Health Endpoint

```bash
curl http://localhost:4000/health
# Should return: {"status":"ok","service":"kairoo-upload-service"}

curl https://uploads.kairoo.me/health
# Should return the same
```

### Test Upload (with API key from dashboard)

```bash
curl -X POST https://uploads.kairoo.me/upload \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@test-image.jpg"
```

### Test File Access

```bash
# Use the URL returned from upload
curl https://uploads.kairoo.me/files/project-name/images/filename.jpg
```

---

## Management Commands

```bash
# View logs
pm2 logs kairoo-upload-service

# Restart service
pm2 restart kairoo-upload-service

# Stop service
pm2 stop kairoo-upload-service

# Monitor
pm2 monit

# View detailed info
pm2 info kairoo-upload-service
```

---

## Updating the Service

```bash
# Pull latest changes
cd /var/www/KairoStorageSerivce/upload-service
git pull

# Install new dependencies (if any)
npm install

# Restart service
pm2 restart kairoo-upload-service
```

---

## Troubleshooting

### Service won't start

```bash
# Check logs
pm2 logs kairoo-upload-service --lines 100

# Check if port 4000 is available
sudo netstat -tulpn | grep 4000

# Check database connection
psql -U postgres -d kairoo_storage -h localhost
```

### Database connection fails

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*-main.log

# Test connection
psql -U postgres -d kairoo_storage -h localhost -W
```

### Files not accessible

```bash
# Check directory permissions
ls -la /var/www/KairooStorageFiles/

# Fix permissions
sudo chown -R www-data:www-data /var/www/KairooStorageFiles/
sudo chmod -R 755 /var/www/KairooStorageFiles/

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

### SSL certificate issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

---

## Important Notes

1. **Database Password**: Make sure to use a strong password and keep it secure
2. **Same Database**: Upload-service and kairoo-storage use the SAME database
3. **File Permissions**: Ensure upload directory has correct permissions
4. **Firewall**: Port 5432 must be open for Vercel to connect to PostgreSQL
5. **Backups**: Setup automated backups for both database and files

---

## Environment Variables Summary

| Variable     | Value                       | Description         |
| ------------ | --------------------------- | ------------------- |
| PORT         | 4000                        | Upload service port |
| NODE_ENV     | production                  | Environment         |
| UPLOADS_ROOT | /var/www/KairooStorageFiles | File storage path   |
| DB_HOST      | localhost                   | Database host       |
| DB_PORT      | 5432                        | Database port       |
| DB_NAME      | kairoo_storage              | Database name       |
| DB_USER      | postgres                    | Database user       |
| DB_PASSWORD  | your_password               | Database password   |
| PUBLIC_URL   | https://uploads.kairoo.me   | Public URL          |

---

## Next Steps

After upload-service is running:

1. Deploy kairoo-storage to Vercel
2. Configure Vercel environment variables to point to Oracle database
3. Test uploads from your applications
4. Setup monitoring (UptimeRobot, etc.)
5. Configure automated backups

---

## Support

For issues:

- Check logs: `pm2 logs kairoo-upload-service`
- Check nginx: `sudo tail -f /var/log/nginx/error.log`
- Check PostgreSQL: `sudo tail -f /var/log/postgresql/postgresql-*-main.log`
