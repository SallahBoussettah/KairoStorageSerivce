# Kairoo Upload Service

This is the file upload service that runs on Oracle VPS (port 4000).

## Installation on Oracle VPS

### 1. Prerequisites

```bash
# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx (if not already installed)
sudo apt-get install nginx

# Install PostgreSQL client (if not already installed)
sudo apt-get install postgresql-client
```

### 2. Setup Upload Directory

```bash
# Create uploads directory
sudo mkdir -p /var/www/KairooStorageFiles
sudo chown -R $USER:$USER /var/www/KairooStorageFiles
sudo chmod -R 755 /var/www/KairooStorageFiles
```

### 3. Deploy Upload Service

```bash
# Navigate to your project directory
cd /var/www/KairoStorageSerivce

# Copy upload-service folder to Oracle
# (Use git, scp, or rsync)

cd upload-service

# Install dependencies
npm install

# Create .env file
cp .env.example .env
nano .env
```

Edit `.env`:

```env
PORT=4000
UPLOADS_ROOT=/var/www/KairooStorageFiles
DATABASE_URL=postgresql://postgres:your_password@127.0.0.1:5432/kairoo_storage
PUBLIC_URL=https://uploads.kairoo.me
NODE_ENV=production
```

### 4. Start Service with PM2

```bash
# Create logs directory
mkdir -p logs

# Start the service
pm2 start ecosystem.config.cjs

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions from the command output
```

### 5. Configure Nginx

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

### 6. Setup SSL with Certbot

```bash
# Install Certbot (if not already installed)
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d uploads.kairoo.me

# Certbot will automatically update your nginx config
```

### 7. Verify Installation

```bash
# Check if service is running
pm2 status

# Check logs
pm2 logs kairoo-upload-service

# Test health endpoint
curl http://localhost:4000/health

# Test from outside
curl https://uploads.kairoo.me/health
```

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

# View service info
pm2 info kairoo-upload-service
```

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

## Troubleshooting

### Service won't start

```bash
# Check logs
pm2 logs kairoo-upload-service --lines 100

# Check if port 4000 is available
sudo netstat -tulpn | grep 4000

# Check database connection
psql $DATABASE_URL -c "SELECT 1"
```

### Files not accessible

```bash
# Check directory permissions
ls -la /var/www/KairooStorageFiles

# Fix permissions if needed
sudo chown -R www-data:www-data /var/www/KairooStorageFiles
sudo chmod -R 755 /var/www/KairooStorageFiles
```

### Nginx errors

```bash
# Check nginx error log
sudo tail -f /var/log/nginx/error.log

# Test nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## Security Notes

- The service only accepts requests with valid API keys
- CORS is configured to allow all origins (adjust if needed)
- File size limits are enforced per project
- SSL/TLS is required in production (handled by Certbot)

## Monitoring

Consider setting up monitoring with:

- UptimeRobot (https://uptimerobot.com)
- PM2 Plus (https://pm2.io)
- Custom health check scripts
