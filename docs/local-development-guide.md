# Windows Development Guide

### 1. Purpose

This document covers everything needed to **develop Kairoo Storage locally on Windows** until your APIs are fully working — including uploads (images / videos / docs) and read endpoints.
It also defines the **Dashboard + Documentation Page + API Playground** structure for when you start building the frontend.

---

## 2. Local Folder Layout

```
D:/FullStackProjects/KairoStorageSerivce/
 ┣ KairooStorage/              ← project repository (Next.js + API)
 ┗ KairooStorageFiles/         ← local uploads (outside repo)
     ┣ images/
     ┣ videos/
     ┗ documents/
```

---

## 3. Local Environment Setup

1. Install **PostgreSQL** locally → DB name `kairoo_storage`.
2. Install dependencies

   ```bash
   npm install
   ```

3. Environment file `.env.local`

   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/kairoo_storage
   UPLOADS_ROOT=../KairooStorageFiles
   STORAGE_BACKEND_URL=http://localhost:4000
   ADMIN_EMAIL=boussettah.dev@gmail.com
   ADMIN_JWT_SECRET=<strong-secret>
   ```

4. Run Drizzle migrations automatically at server boot.

---

## 4. API Modules (Local Development)

| Group            | Endpoint                                | Description                                     |
| ---------------- | --------------------------------------- | ----------------------------------------------- |
| **Auth (Admin)** | `POST /api/v1/login`                    | Login using admin email + password              |
| **Projects**     | `POST /api/v1/projects`                 | Create a new project + generate API key         |
|                  | `GET /api/v1/projects`                  | List projects                                   |
|                  | `PATCH /api/v1/projects/:id/rotate-key` | Regenerate API key                              |
| **Files**        | `POST /api/v1/upload`                   | Upload file (multipart)                         |
|                  | `GET /api/v1/files`                     | List files by type/project                      |
|                  | `GET /api/v1/files/:id`                 | Get file metadata                               |
|                  | `GET /api/v1/files/:id/stream`          | Stream video content                            |
|                  | `DELETE /api/v1/files/:id`              | Delete file + record                            |
|                  | `POST /api/v1/upload/url`               | Upload from remote URL                          |
| **Docs Page**    | `/dashboard/docs`                       | Full integration documentation + API Playground |

---

## 5. Reading Files Inside Projects

Future client apps (registered projects) will use these endpoints:

| Action                   | HTTP Method | Example URL                                                   |
| ------------------------ | ----------- | ------------------------------------------------------------- |
| **Get File Metadata**    | GET         | `/api/v1/files?project=looprooms&type=image`                  |
| **Direct Public Access** | GET         | `https://uploads.kairoo.me/files/ProjectOne/images/photo.png` |
| **Stream Video**         | GET         | `/api/v1/files/:id/stream`                                    |
| **Delete**               | DELETE      | `/api/v1/files/:id` with Bearer key                           |

---

## 6. Frontend Structure

| Page               | Description                                                                                                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                | **Landing Page** – one scroll page describing Kairoo Storage, features, and contact CTA (“Email admin at [boussettah.dev@gmail.com](mailto:boussettah.dev@gmail.com) to request access”). |
| `/login`           | Admin login                                                                                                                                                                               |
| `/dashboard`       | Main interface: project cards + usage stats                                                                                                                                               |
| `/dashboard/docs`  | Developer documentation + API Playground                                                                                                                                                  |
| `/dashboard/users` | Invite or remove collaborators                                                                                                                                                            |
| `/dashboard/files` | Browse files per project                                                                                                                                                                  |

---

## 7. Docs Page Contents

### 📄 Sections

1. **Overview** – What Kairoo Storage is
2. **Getting API Access** – “Contact admin at [boussettah.dev@gmail.com](mailto:boussettah.dev@gmail.com)”
3. **Authentication** – API key in `Authorization: Bearer <KEY>`
4. **Upload Example**

   ```bash
   curl -X POST https://uploads.kairoo.me/upload \
        -H "Authorization: Bearer <API_KEY>" \
        -F "files=@image.png"
   ```

5. **List Files**

   ```bash
   curl https://uploads.kairoo.me/api/v1/files?project=myapp&type=image \
        -H "Authorization: Bearer <API_KEY>"
   ```

6. **Read File**

   ```html
   <img src="https://uploads.kairoo.me/files/myapp/images/image.png" />
   ```

7. **Delete File**

   ```bash
   curl -X DELETE https://uploads.kairoo.me/api/v1/files/45 \
        -H "Authorization: Bearer <API_KEY>"
   ```

8. **Playground** – simple UI to test each endpoint within dashboard.

---

## 8. Local Development Commands

```bash
npm run dev          # start Next.js app (Vercel mode)
npm run migrate      # optional manual Drizzle migration
npm run seed         # optional to create first admin
```

---

## 9. Testing Flow (Local)

1️⃣ Run Postgres locally
2️⃣ Create admin via seed script
3️⃣ Login at `http://localhost:3000/login`
4️⃣ Create a project → receive API key
5️⃣ Upload files to `../KairooStorageFiles`
6️⃣ List & view from Docs Playground

---
