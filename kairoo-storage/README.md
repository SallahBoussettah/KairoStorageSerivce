# Kairoo Storage Service

A serverless full-stack file storage service built with Next.js, PostgreSQL, and Drizzle ORM.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 18+ installed and running
- Database `kairoo_storage` created

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables (already configured in `.env.local`):

```env
DATABASE_URL=postgresql://postgres:SATOSANb6@localhost:5432/kairoo_storage
UPLOADS_ROOT=../KairooStorageFiles
STORAGE_BACKEND_URL=http://localhost:4000
ADMIN_EMAIL=boussettah.dev@gmail.com
ADMIN_JWT_SECRET=kairoo_super_secret_jwt_key_2025_change_in_production
```

3. Push database schema:

```bash
npm run db:push
```

4. Seed admin user:

```bash
npm run seed
```

This creates an admin account:

- **Email:** boussettah.dev@gmail.com
- **Password:** admin123

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
kairoo-storage/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/                # Admin login
│   ├── dashboard/            # Dashboard (projects)
│   └── api/v1/               # API routes
│       ├── login/            # POST /api/v1/login
│       └── projects/         # GET/POST /api/v1/projects
├── lib/
│   ├── db/
│   │   ├── index.ts          # Database connection
│   │   └── schema.ts         # Drizzle schema
│   ├── auth.ts               # JWT & password utilities
│   └── file-utils.ts         # File handling utilities
├── scripts/
│   ├── seed.ts               # Database seeding
│   └── test-db.ts            # Database connection test
└── drizzle.config.ts         # Drizzle configuration
```

## 🗄️ Database Schema

### Tables

**admins**

- id (serial, primary key)
- email (varchar, unique)
- password_hash (text)
- created_at (timestamp)

**projects**

- id (serial, primary key)
- name (varchar, unique)
- api_key (text, unique)
- created_at (timestamp)
- updated_at (timestamp)

**files**

- id (serial, primary key)
- project_id (integer, foreign key)
- filename (varchar)
- original_name (varchar)
- mime_type (varchar)
- size (integer)
- type (varchar) - 'image', 'video', 'document'
- path (text)
- url (text)
- uploaded_at (timestamp)

## 🔌 API Endpoints

### Authentication

**POST /api/v1/login**

```json
{
  "email": "boussettah.dev@gmail.com",
  "password": "admin123"
}
```

Response:

```json
{
  "success": true,
  "token": "jwt_token_here",
  "admin": {
    "id": 1,
    "email": "boussettah.dev@gmail.com"
  }
}
```

### Projects

**GET /api/v1/projects**

- Headers: `Authorization: Bearer <token>`
- Returns list of all projects

**POST /api/v1/projects**

- Headers: `Authorization: Bearer <token>`
- Body: `{ "name": "project-name" }`
- Creates new project and generates API key

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run Biome linter
npm run format       # Format code with Biome
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
npm run seed         # Seed admin user
```

## 📝 Next Steps

1. ✅ Database setup complete
2. ✅ Admin authentication working
3. ✅ Project management working
4. ✅ Landing page created
5. ✅ Dashboard created

### To Do:

- [ ] File upload API endpoint
- [ ] File listing API endpoint
- [ ] File streaming for videos
- [ ] File deletion endpoint
- [ ] Documentation page with API playground
- [ ] File browser in dashboard

## 🔐 Security Notes

- Change the default admin password after first login
- Update `ADMIN_JWT_SECRET` in production
- Never commit `.env.local` to version control
- API keys are generated securely with random strings

## 📚 Documentation

See the `docs/` folder for detailed guides:

- `local-development-guide.md` - Complete Windows development setup
- `oracle-production-guide.md` - Production deployment guide
- `PROJECT-OVERVIEW.md` - Project architecture and roadmap

## 🐛 Troubleshooting

### Database Connection Issues

Run the test script:

```bash
npx tsx scripts/test-db.ts
```

This will verify:

- PostgreSQL is running
- Database exists
- Credentials are correct
- Tables are created

### Common Issues

1. **"password authentication failed"**

   - Check PostgreSQL password in `.env.local`
   - Verify PostgreSQL is running

2. **"database does not exist"**

   - Create database: `CREATE DATABASE kairoo_storage;`

3. **Port 3000 already in use**
   - Kill the process or use a different port: `npm run dev -- -p 3001`

## 📧 Contact

Admin: boussettah.dev@gmail.com
