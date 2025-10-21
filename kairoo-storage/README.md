# Kairoo Storage Dashboard

Next.js 15 dashboard and management interface for Kairoo Storage service.

## 🌐 Live URL

**Production**: [https://app.kairoo.me](https://app.kairoo.me)

## 📋 Overview

This is the frontend dashboard deployed on Vercel that provides:

- 🎨 **Landing Page** - Marketing and feature showcase
- 📊 **Dashboard** - Project management and analytics
- 📁 **File Browser** - View and manage uploaded files
- 📚 **Documentation** - Interactive API documentation
- 🎮 **API Playground** - Test endpoints directly in browser
- ⚙️ **Settings** - Project configuration and API keys

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Shadcn/ui
- **Animations**: Framer Motion
- **Database**: PostgreSQL (via Drizzle ORM)
- **Authentication**: JWT
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

Visit: `http://localhost:3000`

## 📁 Project Structure

```
kairoo-storage/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Landing page
│   ├── login/               # Admin login
│   ├── dashboard/           # Main dashboard
│   │   ├── page.tsx        # Projects overview
│   │   ├── docs/           # API documentation
│   │   ├── files/          # File browser
│   │   └── settings/       # Settings page
│   ├── api/                 # API routes
│   │   └── v1/             # API endpoints
│   │       ├── upload/     # Upload proxy
│   │       ├── files/      # List/delete files
│   │       └── serve/      # Serve files (dev only)
│   └── globals.css         # Global styles
├── components/              # React components
│   └── ui/                 # Shadcn UI components
├── lib/                     # Utilities
│   ├── db/                 # Database
│   │   ├── index.ts       # Drizzle client
│   │   └── schema.ts      # Database schema
│   ├── file-utils.ts      # File handling
│   └── auth.ts            # Authentication
├── public/                  # Static assets
└── middleware.ts           # CORS middleware
```

## 🔐 Environment Variables

### Development (.env.local)

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/kairoo_storage

# Storage Backend (local for dev)
STORAGE_BACKEND_URL=http://localhost:4000

# Admin Authentication
ADMIN_EMAIL=boussettah.dev@gmail.com
ADMIN_JWT_SECRET=your_secret_here

# Environment
NODE_ENV=development
```

### Production (.env.production)

```env
# Database (Oracle VPS)
DATABASE_URL=postgresql://user:pass@158.178.204.36:5432/kairoo_storage

# Storage Backend (Oracle VPS)
STORAGE_BACKEND_URL=https://uploads.kairoo.me

# Admin Authentication
ADMIN_EMAIL=boussettah.dev@gmail.com
ADMIN_JWT_SECRET=your_production_secret

# Environment
NODE_ENV=production
```

## 📡 API Routes

### Upload (Proxy)

`POST /api/v1/upload`

Proxies upload requests to the upload-service on Oracle VPS in production.

### List Files

`GET /api/v1/files?type=image`

Lists files for the authenticated project.

### Delete File

`DELETE /api/v1/files/:id`

Deletes a file and its database record.

### Serve Files (Dev Only)

`GET /api/v1/serve/:projectName/:type/:filename`

Serves files locally during development.

## 🎨 Features

### Landing Page

- Hero section with animations
- Feature showcase
- File type support
- CTA sections

### Dashboard

- Project cards with stats
- Usage analytics
- Quick actions
- Recent files

### File Browser

- Grid/list view
- Filter by type (images, videos, documents)
- Search functionality
- Delete files
- Copy URLs

### API Documentation

- Interactive playground
- Code examples (cURL, JavaScript, Python)
- Request/response samples
- Authentication guide

### Settings

- Update project details
- Regenerate API keys
- Configure file size limits
- Manage allowed file types

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format

# Database commands
npm run db:push      # Push schema changes
npm run db:studio    # Open Drizzle Studio
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

```bash
# Or use Vercel CLI
vercel --prod
```

### Environment Variables on Vercel

Add these in Vercel dashboard:

- `DATABASE_URL`
- `STORAGE_BACKEND_URL`
- `ADMIN_EMAIL`
- `ADMIN_JWT_SECRET`
- `NODE_ENV=production`

## 🔍 Key Components

### Authentication

- JWT-based admin authentication
- API key validation for projects
- Protected routes with middleware

### File Management

- Upload proxy to Oracle VPS
- File listing with filters
- Delete with cleanup
- URL generation

### Database Schema

- `projects` - Project configurations
- `files` - File metadata and URLs

## 📊 Performance

- Server-side rendering (SSR)
- Static generation where possible
- Image optimization
- Code splitting
- Edge caching

## 🆘 Troubleshooting

### Database Connection Issues

```bash
# Test connection
npm run db:studio
```

### Upload Service Connection

Check `STORAGE_BACKEND_URL` is correct and service is running.

### Build Errors

```bash
# Clear cache
rm -rf .next
npm run build
```

## 📝 Notes

- In **development**: Files are stored locally and served via `/api/v1/serve`
- In **production**: Uploads are proxied to Oracle VPS, files served from `uploads.kairoo.me`
- Database is shared between dashboard and upload-service
- CORS is configured in middleware for API routes

## 🔗 Related

- **Upload Service**: `../upload-service/`
- **Production API**: `../docs/PRODUCTION-API.md`
- **Quick Reference**: `../docs/QUICK-REFERENCE.md`

## 📧 Support

**Email**: boussettah.dev@gmail.com

---

**Built with Next.js 15 and deployed on Vercel**
