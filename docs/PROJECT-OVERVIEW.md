# Kairoo Storage Service - Project Overview

## 🎯 Project Vision

Build a **serverless full-stack file storage service** that runs on Vercel (frontend + API) with Oracle VPS handling file uploads and storage. This service will provide a complete API for managing images, videos, and documents with a dashboard for project management.

---

## 📋 Development Phases

### Phase 1: Local Windows Development ✅ (Current Phase)

**Goal:** Build and test all APIs locally until fully functional

**Environment:**

- Windows development machine
- Local PostgreSQL database
- Local file storage at `D:/FullStackProjects/KairoStorageSerivce/KairooStorageFiles/`
- Next.js dev server on `localhost:3000`
- Upload service on `localhost:4000`

**Deliverables:**

- ✅ Working authentication (admin login)
- ✅ Project management (create, list, rotate API keys)
- ✅ File upload API (images, videos, documents)
- ✅ File retrieval & streaming
- ✅ Dashboard UI with project cards
- ✅ Documentation page with API playground
- ✅ Landing page

**Reference:** See `local-development-guide.md`

---

### Phase 2: Production Deployment 🚀 (Next Phase)

**Goal:** Deploy to production infrastructure

**Architecture:**

```
┌─────────────────┐         ┌──────────────────┐
│  Vercel         │         │  Oracle VPS      │
│  (Serverless)   │────────▶│  158.178.204.36  │
│                 │         │                  │
│  - Dashboard    │         │  - Upload API    │
│  - API Routes   │         │  - File Storage  │
│  - Docs Page    │         │  - PostgreSQL    │
└─────────────────┘         └──────────────────┘
     ▲                              ▲
     │                              │
     └──────── Cloudflare ──────────┘
         (DNS + SSL + CDN)
```

**Components:**

1. **Vercel** (`app.kairoo.me`)

   - Next.js dashboard & frontend
   - Serverless API routes
   - Auto-deploy from GitHub

2. **Oracle VPS** (`uploads.kairoo.me`)

   - Upload service (Node.js on port 4000)
   - File storage at `/var/www/KairoStorageSerivce/KairooStorageFiles/`
   - PostgreSQL database
   - Nginx reverse proxy

3. **Cloudflare**
   - DNS management
   - SSL/TLS termination
   - DDoS protection

**Reference:** See `oracle-production-guide.md`

---

## 🏗️ Technology Stack

### Frontend & API

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Authentication:** JWT tokens
- **API:** RESTful endpoints

### Backend

- **Database:** PostgreSQL + Drizzle ORM
- **File Upload:** Multipart form handling
- **Storage:** File system (local → Oracle VPS)
- **Process Manager:** PM2 (production)

### Infrastructure

- **Hosting:** Vercel (serverless) + Oracle VPS
- **Web Server:** Nginx (reverse proxy)
- **SSL:** Certbot (Let's Encrypt)
- **DNS:** Cloudflare

---

## 📁 Project Structure

```
KairoStorageSerivce/
├── docs/                          ← Documentation folder
│   ├── PROJECT-OVERVIEW.md        ← This file
│   ├── local-development-guide.md ← Windows dev setup
│   └── oracle-production-guide.md ← Production deployment
│
├── KairooStorage/                 ← Main Next.js project
│   ├── app/                       ← Next.js App Router
│   │   ├── page.tsx              ← Landing page
│   │   ├── login/                ← Admin login
│   │   ├── dashboard/            ← Main dashboard
│   │   │   ├── page.tsx          ← Projects overview
│   │   │   ├── docs/             ← API documentation + playground
│   │   │   ├── files/            ← File browser
│   │   │   └── users/            ← User management
│   │   └── api/                  ← API routes
│   │       └── v1/
│   │           ├── login/
│   │           ├── projects/
│   │           ├── upload/
│   │           └── files/
│   ├── components/               ← React components
│   ├── lib/                      ← Utilities & DB
│   │   ├── db.ts                ← Drizzle setup
│   │   └── auth.ts              ← JWT helpers
│   ├── drizzle/                 ← Database migrations
│   └── public/                  ← Static assets
│
└── KairooStorageFiles/           ← File storage (outside repo)
    ├── images/
    ├── videos/
    └── documents/
```

---

## 🔑 Key Features

### For Admins (You)

- Secure login with email + password
- Create projects and generate API keys
- View all uploaded files across projects
- Rotate API keys for security
- Invite collaborators (future)

### For API Consumers (Your Apps)

- Upload files via REST API
- List files by project/type
- Stream video content
- Delete files programmatically
- Direct public URL access to files

### Documentation & Testing

- Interactive API playground in dashboard
- Complete integration examples
- Test endpoints without leaving the dashboard

---

## 🔐 Security Model

1. **Admin Access:** Email + password → JWT token
2. **API Access:** Project-specific API keys (Bearer token)
3. **File Access:**
   - Private: Requires API key
   - Public: Direct URL (configurable per project)

---

## 🚀 Development Workflow

### Current Phase (Local Development)

1. ✅ Set up PostgreSQL locally
2. ✅ Create Next.js project structure
3. ✅ Build authentication system
4. ✅ Implement project management
5. ✅ Build file upload API
6. ✅ Create dashboard UI
7. ✅ Build documentation page with playground
8. ✅ Test all endpoints locally

### Next Phase (Production)

1. Set up Oracle VPS (Nginx, PostgreSQL, PM2)
2. Configure Cloudflare DNS
3. Deploy upload service to Oracle
4. Deploy Next.js app to Vercel
5. Test end-to-end flow
6. Monitor and optimize

---

## 📚 Learning Resources

### Technologies to Master

- **Tailwind CSS v4:** Use MCP server to understand new syntax and setup
- **Next.js App Router:** Server components, API routes, streaming
- **Drizzle ORM:** Type-safe database queries
- **Vercel Deployment:** Serverless functions, environment variables
- **Oracle VPS:** Linux server management, Nginx configuration

### MCP Servers for Learning

Use Context7 MCP to fetch documentation for:

- Tailwind CSS v4 syntax and configuration
- Next.js 14+ App Router patterns
- Drizzle ORM best practices
- Vercel deployment strategies

---

## 📞 Contact & Access

**Admin Email:** boussettah.dev@gmail.com

To request API access, users should contact the admin email. Projects are created manually for security.

---

## 🎯 Success Criteria

### Phase 1 Complete When:

- ✅ All API endpoints working locally
- ✅ Dashboard fully functional
- ✅ Documentation page with working playground
- ✅ Can upload, list, view, and delete files
- ✅ Video streaming works

### Phase 2 Complete When:

- ✅ Production deployment successful
- ✅ HTTPS working on both domains
- ✅ Files accessible via public URLs
- ✅ Dashboard deployed and accessible
- ✅ Database migrations automated
- ✅ Monitoring in place

---

## 📝 Notes

- Keep local and production guides in sync
- Document any deviations from the plan
- Back up database and files regularly in production
- Use environment variables for all secrets
- Never commit `.env` files to Git

---

**Last Updated:** October 21, 2025
