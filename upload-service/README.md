# Kairoo Upload Service

Node.js/Express backend service for handling file uploads and storage on Oracle VPS.

## 🌐 Live URL

**Production**: [https://uploads.kairoo.me](https://uploads.kairoo.me)

## 📋 Overview

This is the backend upload service deployed on Oracle Cloud VPS that provides:

- 📤 **File Upload** - Handle multipart file uploads
- 📁 **File Storage** - Store files on VPS file system
- 🔐 **Authentication** - API key validation
- 🗄️ **Database** - Store file metadata
- 🌐 **File Serving** - Serve files via Nginx
- ❌ **File Deletion** - Remove files and records

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express
- **File Upload**: Multer
- **Database**: PostgreSQL (Drizzle ORM)
- **Process Manager**: PM2
- **Web Server**: Nginx
- **SSL**: Let's Encrypt (Certbot)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- PM2 (for production)
- Nginx (for production)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Test database connection
node test-db.js

# Start service
npm start
```

Runs on: `http://localhost:4000`

## 📁 Project Structure

```
upload-service/
├── index.js              # Main Express server
├── db.js                 # Database connection
├── schema.js             # Database schema
├── utils.js              # File utilities
├── test-db.js           # Database test script
├── setup.sh             # Production setup script
├── ecosystem.config.cjs  # PM2 configuration
├── nginx.conf           # Nginx configuration
├── .env.example         # Environment template
└── README.md            # This file
```

## 🔐 Environment Variables

### Development (.env)

```env
# Server
PORT=4000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kairoo_storage
DB_USER=postgres
DB_PASSWORD=your_password

# Or use connection string
DATABASE_URL=postgresql://user:pass@localhost:5432/kairoo_storage

# Storage
UPLOADS_ROOT=./uploads
PUBLIC_URL=http://localhost:4000

# Environment
NODE_ENV=development
```

### Production (.env)

```env
# Server
PORT=4000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/kairoo_storage

# Storage
UPLOADS_ROOT=/var/www/KairooStorageFiles
PUBLIC_URL=https://uploads.kairoo.me

# Environment
NODE_ENV=production
```

## 📡 API Endpoints

### Health Check

`GET /health`

```bash
curl https://uploads.kairoo.me/health
```

**Response:**

```json
{
  "status": "ok",
  "service": "kairoo-upload-service"
}
```

### Upload File

`POST /upload`

```bash
curl -X POST https://uploads.kairoo.me/upload \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@image.jpg"
```

**Response:**

```json
{
  "success": true,
  "file": {
    "id": 1,
    "filename": "image_1234567890_abc123.jpg",
    "originalName": "image.jpg",
    "type": "image",
    "size": 102400,
    "url": "https://uploads.kairoo.me/files/project/images/image_1234567890_abc123.jpg",
    "uploadedAt": "2025-10-21T03:00:00.000Z"
  }
}
```

### Serve Files

`GET /files/:projectName/:type/:filename`

```bash
curl https://uploads.kairoo.me/files/my-project/images/photo.jpg
```

Files are served directly by Nginx in production for optimal performance.

## 🔧 Development Commands

```bash
# Start service
npm start

# Start with auto-reload (nodemon)
npm run dev

# Test database connection
node test-db.js
```

## 🚀 Production Deployment

### Initial Setup

```bash
# Run setup script
chmod +x setup.sh
./setup.sh
```

This will:

- Install dependencies
- Set up PM2
- Configure Nginx
- Set up SSL with Let's Encrypt
- Create uploads directory
- Start the service

### PM2 Commands

```bash
# Start service
pm2 start ecosystem.config.cjs

# Stop service
pm2 stop kairoo-upload-service

# Restart service
pm2 restart kairoo-upload-service

# View logs
pm2 logs kairoo-upload-service

# Monitor
pm2 monit

# Status
pm2 status
```

### Update Service

```bash
cd /var/www/KairoStorageSerivce/upload-service
git pull
npm install
pm2 restart kairoo-upload-service
```

## 🗄️ Database Schema

### Projects Table

```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  max_file_size INTEGER DEFAULT 52428800,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Files Table

```sql
CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100),
  size INTEGER,
  type VARCHAR(50),
  path TEXT,
  url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

## 📊 File Organization

Files are organized by project and type:

```
/var/www/KairooStorageFiles/
├── project-name-1/
│   ├── images/
│   │   ├── photo_123.jpg
│   │   └── logo_456.png
│   ├── videos/
│   │   └── clip_789.mp4
│   └── documents/
│       └── doc_012.pdf
└── project-name-2/
    └── images/
        └── banner_345.jpg
```

## 🔍 File Type Detection

Files are automatically categorized:

- **Images**: JPG, PNG, GIF, WebP, SVG
- **Videos**: MP4, WebM, MOV, AVI
- **Documents**: PDF, DOC, TXT, MD, and others

## 🔐 Security

- API key authentication for all uploads
- Project isolation (files separated by project)
- File size limits per project
- CORS enabled for cross-origin requests
- SSL/TLS encryption via Nginx

## 📈 Limits

- **Max File Size**: 200MB (configurable per project)
- **Max Request Size**: 200MB
- **Concurrent Uploads**: Unlimited (handled by Express)

## 🆘 Troubleshooting

### Service Not Starting

```bash
# Check logs
pm2 logs kairoo-upload-service

# Check port
sudo netstat -tulpn | grep 4000

# Restart
pm2 restart kairoo-upload-service
```

### Database Connection Issues

```bash
# Test connection
node test-db.js

# Check PostgreSQL
sudo systemctl status postgresql

# Check credentials in .env
cat .env
```

### File Upload Fails

```bash
# Check uploads directory permissions
ls -la /var/www/KairooStorageFiles/

# Fix permissions
sudo chown -R www-data:www-data /var/www/KairooStorageFiles/
sudo chmod -R 755 /var/www/KairooStorageFiles/
```

### Files Not Accessible

```bash
# Check Nginx
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## 📊 Monitoring

### Health Check

```bash
curl https://uploads.kairoo.me/health
```

### PM2 Monitoring

```bash
pm2 monit
```

### Logs

```bash
# Service logs
pm2 logs kairoo-upload-service --lines 100

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

## 🔗 Related

- **Dashboard**: `../kairoo-storage/`
- **Production API**: `../docs/PRODUCTION-API.md`
- **Quick Reference**: `../docs/QUICK-REFERENCE.md`
- **Production Setup**: `../docs/PRODUCTION-SETUP.md`

## 📧 Support

**Email**: boussettah.dev@gmail.com

---

**Running on Oracle Cloud VPS with PM2 and Nginx**
