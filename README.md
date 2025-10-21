# Kairoo Storage

Enterprise-grade file storage service with powerful APIs. Upload images, videos, and documents with blazing-fast performance and rock-solid security.

## 🌐 Live Services

- **Dashboard**: [https://app.kairoo.me](https://app.kairoo.me)
- **Upload API**: [https://uploads.kairoo.me](https://uploads.kairoo.me)
- **Documentation**: [https://app.kairoo.me/dashboard/docs](https://app.kairoo.me/dashboard/docs)

## ✨ Features

- 🚀 **Multi-Format Support** - Images, videos, and documents
- 🔐 **Enterprise Security** - API key authentication with project isolation
- ⚡ **Blazing Fast** - Optimized delivery with CDN integration
- 💻 **Developer First** - RESTful API with comprehensive documentation
- 🔒 **Private & Secure** - Encrypted data transfer and storage
- 📊 **Reliable** - 99.9% uptime SLA on enterprise infrastructure

## 🏗️ Architecture

### Hybrid Deployment

- **Frontend (Vercel)**: Next.js dashboard at `app.kairoo.me`
- **Backend (Oracle VPS)**: Node.js upload service at `uploads.kairoo.me`
- **Database**: PostgreSQL on Oracle VPS
- **Storage**: File system on Oracle VPS
- **Web Server**: Nginx with SSL

### Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express, Multer
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT + API Keys
- **Deployment**: Vercel + Oracle Cloud

## 📡 Quick Start

### Upload a File

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

### Delete a File

```bash
curl -X DELETE https://app.kairoo.me/api/v1/files/1 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Access Files

```
https://uploads.kairoo.me/files/project-name/images/filename.jpg
```

## 📚 Documentation

- **[Production API Reference](docs/PRODUCTION-API.md)** - Complete API documentation with examples
- **[Quick Reference](docs/QUICK-REFERENCE.md)** - Commands and URLs for quick access
- **[Improvements Roadmap](docs/IMPROVEMENTS-ROADMAP.md)** - Future enhancements and features

## 🚀 API Integration

### JavaScript/TypeScript

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);

const response = await fetch("https://uploads.kairoo.me/upload", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
  body: formData,
});

const { file } = await response.json();
console.log("File URL:", file.url);
```

### Python

```python
import requests

headers = {'Authorization': 'Bearer YOUR_API_KEY'}

with open('image.jpg', 'rb') as f:
    files = {'file': f}
    response = requests.post(
        'https://uploads.kairoo.me/upload',
        headers=headers,
        files=files
    )
    file_data = response.json()['file']
    print(f"File URL: {file_data['url']}")
```

## 🔐 Getting Access

Contact **boussettah.dev@gmail.com** to request API access.

## 📁 Project Structure

```
KairoStorageSerivce/
├── kairoo-storage/          # Next.js dashboard (Vercel)
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   └── lib/                 # Utilities and database
├── upload-service/          # Node.js upload API (Oracle VPS)
│   ├── index.js            # Express server
│   ├── db.js               # Database connection
│   └── utils.js            # File utilities
├── docs/                    # Documentation
│   ├── PRODUCTION-API.md   # API reference
│   ├── QUICK-REFERENCE.md  # Quick commands
│   └── IMPROVEMENTS-ROADMAP.md
└── README.md               # This file
```

## 🛠️ Development

### Dashboard (Next.js)

```bash
cd kairoo-storage
npm install
npm run dev
```

Visit: `http://localhost:3000`

### Upload Service (Node.js)

```bash
cd upload-service
npm install
npm start
```

Runs on: `http://localhost:4000`

## 🔧 Environment Variables

### Dashboard (.env.local)

```env
DATABASE_URL=postgresql://user:pass@host:5432/kairoo_storage
STORAGE_BACKEND_URL=https://uploads.kairoo.me
ADMIN_EMAIL=boussettah.dev@gmail.com
ADMIN_JWT_SECRET=your_secret_here
NODE_ENV=development
```

### Upload Service (.env)

```env
PORT=4000
UPLOADS_ROOT=/var/www/KairooStorageFiles
DATABASE_URL=postgresql://user:pass@host:5432/kairoo_storage
PUBLIC_URL=https://uploads.kairoo.me
NODE_ENV=production
```

## 📊 Monitoring

### Health Checks

```bash
# Upload service
curl https://uploads.kairoo.me/health

# Dashboard
curl https://app.kairoo.me
```

### Service Status (Oracle VPS)

```bash
ssh user@158.178.204.36
pm2 status
pm2 logs kairoo-upload-service
```

## 🔥 Supported File Types

### Images

JPG, PNG, GIF, WebP, SVG

### Videos

MP4, WebM, MOV, AVI

### Documents

PDF, DOC, TXT, MD

## 📈 Limits

- **Default Max File Size**: 50MB (configurable per project)
- **Storage**: Unlimited
- **Bandwidth**: Unlimited
- **API Rate Limit**: None (fair use policy)

## 🆘 Support

For issues, questions, or API access:

**Email**: boussettah.dev@gmail.com

## 📄 License

Proprietary - All rights reserved © 2025 Kairoo Storage

---

**Built with ❤️ by Salah Boussettah**
