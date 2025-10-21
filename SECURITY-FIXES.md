# Security Fixes - Removed Hardcoded Credentials

## ✅ Fixed Files

### Upload Service

- ✅ `upload-service/db.js` - Now uses environment variables with validation
- ✅ `upload-service/.env` - Contains actual credentials (gitignored)
- ✅ `upload-service/.env.example` - Template without real credentials
- ✅ `upload-service/.env.production.example` - Production template

### Next.js (Kairoo Storage)

- ✅ `kairoo-storage/drizzle.config.ts` - Now uses DATABASE_URL from .env.local
- ✅ `kairoo-storage/scripts/seed.ts` - Now uses DATABASE_URL from .env.local
- ✅ `kairoo-storage/scripts/test-db.ts` - Now uses DATABASE_URL from .env.local
- ✅ `kairoo-storage/scripts/add-max-file-size.ts` - Now uses DATABASE_URL from .env.local
- ✅ `kairoo-storage/lib/db/index.ts` - Already using DATABASE_URL ✓

---

## Environment Variables Required

### Upload Service (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kairoo_storage
DB_USER=postgres
DB_PASSWORD=your_actual_password  # REQUIRED!
```

### Next.js (.env.local)

```env
DATABASE_URL=postgresql://postgres:your_actual_password@localhost:5432/kairoo_storage
```

---

## Security Improvements

1. **No hardcoded credentials** - All credentials now come from environment files
2. **Validation** - Upload service validates DB_PASSWORD is set before starting
3. **Clear error messages** - Tells you exactly what's missing
4. **Example files** - Templates provided without real credentials
5. **Gitignored** - .env files are in .gitignore

---

## Testing

### Upload Service

```bash
cd upload-service
node index.js

# Should see:
# ✅ Database connected successfully
```

### Next.js

```bash
cd kairoo-storage
npm run dev

# Should connect to database successfully
```

---

## For Production

### Upload Service (Oracle VPS)

Create `/var/www/KairoStorageSerivce/upload-service/.env`:

```env
PORT=4000
NODE_ENV=production
UPLOADS_ROOT=/var/www/KairooStorageFiles
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kairoo_storage
DB_USER=postgres
DB_PASSWORD=your_production_password
PUBLIC_URL=https://uploads.kairoo.me
```

### Next.js (Vercel)

Set environment variable in Vercel dashboard:

```env
DATABASE_URL=postgresql://postgres:your_production_password@158.178.204.36:5432/kairoo_storage
```

---

## Important Notes

1. **Never commit .env files** - They contain real credentials
2. **Use strong passwords** - Especially in production
3. **Different passwords** - Use different passwords for dev and production
4. **Backup credentials** - Store production credentials securely (password manager)
5. **Rotate regularly** - Change passwords periodically

---

## Checklist Before Deployment

- [ ] All .env files created with real credentials
- [ ] No hardcoded credentials in code
- [ ] .env files are in .gitignore
- [ ] Production passwords are strong and unique
- [ ] Credentials backed up securely
- [ ] Test connections work with env vars

---

## All Secure! 🔒

No more hardcoded credentials in the codebase!
