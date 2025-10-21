# Kairoo Storage Test App

A simple HTML test application to verify your Kairoo Storage API integration.

## 🚀 Quick Start

1. **Make sure Kairoo Storage is running:**

   ```bash
   cd kairoo-storage
   npm run dev
   ```

   Server should be running on `http://localhost:3000`

2. **Get your API key:**

   - Open `http://localhost:3000/login`
   - Login with: `boussettah.dev@gmail.com` / `admin123`
   - Create a project in the dashboard
   - Copy the API key

3. **Open the test app:**

   - Simply open `index.html` in your browser
   - Or use a local server:

     ```bash
     # Using Python
     python -m http.server 8080

     # Using Node.js
     npx serve
     ```

4. **Test the upload:**
   - Paste your API key
   - Select an image file
   - Click "Upload File"
   - See the uploaded file appear below!

## ✨ Features

- ✅ Upload files to Kairoo Storage
- ✅ Display uploaded images
- ✅ Show file information (name, type, size)
- ✅ Track upload statistics
- ✅ View files in new tab
- ✅ Save API key in localStorage
- ✅ Beautiful dark theme UI

## 📝 What This Tests

1. **API Authentication** - Verifies your API key works
2. **File Upload** - Tests the upload endpoint
3. **File Storage** - Confirms files are saved
4. **File URLs** - Checks if file URLs are accessible
5. **Response Format** - Validates API response structure

## 🐛 Troubleshooting

### "Upload failed" error

- Check if Kairoo Storage server is running
- Verify your API key is correct
- Check browser console for detailed errors

### "CORS error"

- This is expected if opening HTML directly
- Use a local server instead (see Quick Start #3)

### Image not displaying

- File might not be accessible yet
- Check if file was saved in `../KairooStorageFiles/`
- Verify the URL in the response

### "Invalid API key"

- Make sure you copied the full API key
- Check if the project still exists in dashboard
- Try creating a new project

## 🎯 Expected Behavior

**Successful Upload:**

1. Click "Upload File"
2. Button shows "Uploading..." with spinner
3. Success message appears
4. File card appears in "Uploaded Files" section
5. Image displays (if it's an image file)
6. Stats update (file count and total size)

**Failed Upload:**

1. Error message appears in red
2. Button returns to normal state
3. Check the error message for details

## 📊 Test Scenarios

### Test 1: Image Upload

- Upload a JPG/PNG image
- Verify image displays correctly
- Click "View File" to open in new tab

### Test 2: Different File Types

- Upload a video file (MP4)
- Upload a document (PDF)
- Verify correct icons display

### Test 3: Multiple Uploads

- Upload several files
- Check stats update correctly
- Verify all files appear in grid

### Test 4: Invalid API Key

- Use wrong API key
- Should show "Invalid API key" error

### Test 5: Large File

- Upload a large file (>5MB)
- Check upload completes successfully

## 🔗 Integration Example

This test app demonstrates how to integrate Kairoo Storage in your own applications:

```javascript
// Upload a file
const formData = new FormData();
formData.append("file", fileInput.files[0]);

const response = await fetch("http://localhost:3000/api/v1/upload", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
  body: formData,
});

const data = await response.json();
console.log("File URL:", data.file.url);
```

## 📚 Next Steps

Once this test works:

1. ✅ Your API is working correctly
2. ✅ You can integrate it into real applications
3. ✅ Ready to deploy to production

## 💡 Tips

- Save your API key - it's stored in localStorage
- Test with different file types
- Check the browser console for detailed logs
- Use the dashboard to verify files are saved

## 🎉 Success Criteria

✅ File uploads without errors  
✅ Success message appears  
✅ File appears in the grid  
✅ Image displays correctly  
✅ "View File" link works  
✅ Stats update properly

If all these work, your Kairoo Storage API is ready to use! 🚀
