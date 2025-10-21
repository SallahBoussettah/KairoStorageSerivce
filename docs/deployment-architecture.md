# Deployment Architecture Explained

## Current Setup (Development)

```
┌─────────────────────────────────────┐
│   Next.js (localhost:3000)          │
│   ├── Dashboard UI                  │
│   ├── API Routes (/api/v1/*)        │
│   └── File Storage (../KairooStorageFiles) │
└─────────────────────────────────────┘
```

**Everything runs in one Next.js app:**

- Upload API: `POST /api/v1/upload`
- File serving: `GET /api/v1/files/[projectName]/[type]/[filename]`
- Files stored locally in `../KairooStorageFiles/`

---

## Production Option 1: Full Serverless (Vercel Only)

```
┌─────────────────────────────────────┐
│   Vercel (app.kairoo.me)            │
│   ├── Dashboard UI                  │
│   ├── API Routes                    │
│   └── External Storage (S3/R2)      │
└─────────────────────────────────────┘
```

**Limitations:**

- ❌ Vercel has ephemeral storage (files deleted on redeploy)
- ❌ Need external storage like AWS S3 or Cloudflare R2
- ❌ Additional costs for storage service

---

## Production Option 2: Hybrid (Recommended)

```
┌─────────────────────────────────────┐
│   Vercel (app.kairoo.me)            │
│   ├── Dashboard UI                  │
│   └── Read-only API Routes          │
└──────────────┬──────────────────────┘
               │
               │ API calls for uploads
               ↓
┌─────────────────────────────────────┐
│   Oracle VPS (uploads.kairoo.me)    │
│   ├── Upload Service (port 4000)    │
│   ├── Nginx (serves files)          │
│   ├── PostgreSQL                    │
│   └── File Storage (/var/www/...)   │
└─────────────────────────────────────┘
```

**How it works:**

1. **User visits dashboard** → Vercel serves UI
2. **User uploads file** → Frontend sends to `https://uploads.kairoo.me/upload`
3. **Oracle VPS** receives upload, saves to disk, writes to DB
4. **File URL** → `https://uploads.kairoo.me/files/project/images/file.png`
5. **Nginx** serves files directly from disk

**Benefits:**

- ✅ Persistent file storage on Oracle
- ✅ No external storage costs
- ✅ Fast file serving via Nginx
- ✅ Scalable dashboard on Vercel

---

## What You Need to Do for Production

### Step 1: Create Upload Service on Oracle

Create a separate Node.js/Express app on your Oracle VPS:

\`\`\`javascript
// upload-service/index.js
const express = require('express');
const multer = require('multer');
const app = express();

app.post('/upload', upload.single('file'), async (req, res) => {
// Save file to /var/www/KairooStorageFiles/
// Write metadata to PostgreSQL
// Return file URL
});

app.listen(4000);
\`\`\`

### Step 2: Configure Nginx on Oracle

\`\`\`nginx
server {
server_name uploads.kairoo.me;

# Serve files directly

location /files/ {
alias /var/www/KairooStorageFiles/;
add_header Access-Control-Allow-Origin \*;
}

# Proxy uploads to Node service

location /upload {
proxy_pass http://127.0.0.1:4000;
}
}
\`\`\`

### Step 3: Deploy Next.js to Vercel

Environment variables on Vercel:
\`\`\`env
DATABASE_URL=postgresql://user:pass@158.178.204.36:5432/kairoo_storage
STORAGE_BACKEND_URL=https://uploads.kairoo.me
\`\`\`

### Step 4: Update Frontend Upload Logic

Instead of calling `/api/v1/upload`, call `https://uploads.kairoo.me/upload` directly from the frontend.

---

## Current State (What We Just Fixed)

For **local development**, files now work because:

1. Upload saves to `../KairooStorageFiles/`
2. URL generated: `http://localhost:3000/api/v1/files/project/images/file.png`
3. New API route serves files from disk

**This works locally but won't work on Vercel** because:

- Vercel is serverless (no persistent disk)
- Files uploaded in one request won't exist in the next

---

## Recommendation

**For production, use Option 2 (Hybrid):**

1. Keep your Oracle VPS for file storage
2. Create a simple upload service on Oracle (port 4000)
3. Deploy Next.js dashboard to Vercel
4. Frontend uploads directly to Oracle
5. Nginx serves files from Oracle

This gives you the best of both worlds: fast global dashboard + reliable file storage.
