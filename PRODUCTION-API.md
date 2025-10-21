# Production API Reference

## 🌐 Base URLs

| Service            | URL                         | Purpose                       |
| ------------------ | --------------------------- | ----------------------------- |
| **Dashboard**      | `https://app.kairoo.me`     | Management UI & API proxy     |
| **Upload Service** | `https://uploads.kairoo.me` | Direct file uploads & storage |

---

## 📡 API Endpoints

### 1. Upload File

**Endpoint:** `POST https://uploads.kairoo.me/upload`

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
    "url": "https://uploads.kairoo.me/files/project-name/images/image_1234567890_abc123.jpg",
    "uploadedAt": "2025-10-21T03:00:00.000Z"
  }
}
```

---

### 2. List Files

**Endpoint:** `GET https://app.kairoo.me/api/v1/files`

```bash
# List all files
curl https://app.kairoo.me/api/v1/files \
  -H "Authorization: Bearer YOUR_API_KEY"

# Filter by type
curl "https://app.kairoo.me/api/v1/files?type=image" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Query Parameters:**

- `type` (optional): `image`, `video`, or `document`

**Response:**

```json
{
  "success": true,
  "count": 2,
  "files": [
    {
      "id": 1,
      "filename": "image_1234567890_abc123.jpg",
      "originalName": "image.jpg",
      "type": "image",
      "size": 102400,
      "url": "https://uploads.kairoo.me/files/project-name/images/image_1234567890_abc123.jpg",
      "uploadedAt": "2025-10-21T03:00:00.000Z"
    }
  ]
}
```

---

### 3. Delete File

**Endpoint:** `DELETE https://app.kairoo.me/api/v1/files/:id`

```bash
curl -X DELETE https://app.kairoo.me/api/v1/files/1 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**

```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

### 4. Access Files (Public URLs)

**Direct Access:** `https://uploads.kairoo.me/files/{project-name}/{type}s/{filename}`

**Examples:**

```
https://uploads.kairoo.me/files/my-project/images/photo_123.jpg
https://uploads.kairoo.me/files/my-project/videos/clip_456.mp4
https://uploads.kairoo.me/files/my-project/documents/doc_789.pdf
```

---

## 🔐 Authentication

All API requests require an API key in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

Get your API key from the dashboard at `https://app.kairoo.me/dashboard`

---

## 📊 Response Codes

| Code  | Meaning                    |
| ----- | -------------------------- |
| `200` | Success                    |
| `401` | Invalid or missing API key |
| `404` | File not found             |
| `413` | File too large             |
| `500` | Server error               |

---

## 🚀 Quick Integration Examples

### JavaScript/TypeScript

```javascript
// Upload file
const formData = new FormData();
formData.append("file", fileInput.files[0]);

const uploadResponse = await fetch("https://uploads.kairoo.me/upload", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
  body: formData,
});

const { file } = await uploadResponse.json();
console.log("File URL:", file.url);

// List files
const listResponse = await fetch("https://app.kairoo.me/api/v1/files", {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
});

const { files } = await listResponse.json();

// Delete file
await fetch(`https://app.kairoo.me/api/v1/files/${fileId}`, {
  method: "DELETE",
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
});
```

### Python

```python
import requests

API_KEY = 'YOUR_API_KEY'
headers = {'Authorization': f'Bearer {API_KEY}'}

# Upload file
with open('image.jpg', 'rb') as f:
    files = {'file': f}
    response = requests.post(
        'https://uploads.kairoo.me/upload',
        headers=headers,
        files=files
    )
    file_data = response.json()['file']
    print(f"File URL: {file_data['url']}")

# List files
response = requests.get(
    'https://app.kairoo.me/api/v1/files',
    headers=headers
)
files = response.json()['files']

# Delete file
requests.delete(
    f'https://app.kairoo.me/api/v1/files/{file_id}',
    headers=headers
)
```

### cURL

```bash
# Upload
curl -X POST https://uploads.kairoo.me/upload \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@image.jpg"

# List
curl https://app.kairoo.me/api/v1/files \
  -H "Authorization: Bearer YOUR_API_KEY"

# Delete
curl -X DELETE https://app.kairoo.me/api/v1/files/1 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## 🔍 Health Check

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

---

## 📝 Notes

- **Upload**: Goes directly to Oracle VPS (`uploads.kairoo.me`) for optimal performance
- **List/Delete**: Goes through Vercel dashboard (`app.kairoo.me`) which proxies to Oracle VPS
- **File Access**: Direct from Oracle VPS via Nginx (`uploads.kairoo.me/files/...`)
- **Max File Size**: Configurable per project (default: 50MB)
- **Supported Formats**: Images (JPG, PNG, GIF, WebP, SVG), Videos (MP4, WebM, MOV, AVI), Documents (PDF, DOC, TXT, MD)

---

## 🆘 Support

For API access or issues, contact: **boussettah.dev@gmail.com**
