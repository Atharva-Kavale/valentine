# Backend API Documentation

This document describes the backend API endpoints expected by the Valentine's Love Box application.

## Base URL Configuration

The API base URL is configured in environment files:

- **Development**: `src/environments/environment.ts` → `http://localhost:3000/api`
- **Production**: `src/environments/environment.prod.ts` → Update with your production API URL

## API Endpoints

### 1. Gallery Images

#### Get All Gallery Images
```
GET /api/gallery/images
```

**Response:**
```json
[
  {
    "id": 1,
    "url": "https://your-cdn.com/image1.jpg",
    "alt": "Optional alt text"
  },
  {
    "id": 2,
    "url": "https://your-cdn.com/image2.jpg",
    "alt": "Optional alt text"
  }
]
```

**Response Type:**
```typescript
// Defined in src/app/model/gallery-image.ts
interface GalleryImage {
  id: number;
  url: string;
  alt?: string;
}
```

---

### 2. Reasons (Love Notes)

#### Get All Reasons
```
GET /api/reasons
```

**Response:**
```json
[
  {
    "id": 1,
    "text": "Your beautiful smile 😍",
    "imageUrl": "https://your-cdn.com/reason1.jpg"
  },
  {
    "id": 2,
    "text": "Your caring nature ❤️",
    "imageUrl": "https://your-cdn.com/reason2.jpg"
  }
]
```

**Response Type:**
```typescript
// Defined in src/app/model/reason-with-image.ts
interface ReasonWithImage {
  id: number;
  text: string;
  imageUrl: string;
}
```

#### Get Single Reason by ID
```
GET /api/reasons/:id
```

**Parameters:**
- `id` (number) - The reason ID

**Response:**
```json
{
  "id": 1,
  "text": "Your beautiful smile 😍",
  "imageUrl": "https://your-cdn.com/reason1.jpg"
}
```

**Response Type:**
```typescript
// Defined in src/app/model/reason-with-image.ts
interface ReasonWithImage {
  id: number;
  text: string;
  imageUrl: string;
}
```

---

## Error Handling

The frontend automatically falls back to placeholder data if:
- The backend is unavailable
- API requests fail
- Network errors occur

**Error Response Format (Optional but Recommended):**
```json
{
  "error": "Error message",
  "statusCode": 404,
  "message": "Resource not found"
}
```

---

## CORS Configuration

Make sure your backend allows requests from your frontend domain:

**For Express.js:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:4200', 'https://your-production-domain.com'],
  credentials: true
}));
```

---

## Sample Backend Implementation (Node.js/Express)

```javascript
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Gallery endpoint
app.get('/api/gallery/images', (req, res) => {
  const images = [
    { id: 1, url: 'https://example.com/img1.jpg', alt: 'Photo 1' },
    { id: 2, url: 'https://example.com/img2.jpg', alt: 'Photo 2' },
    // Add more images...
  ];
  res.json(images);
});

// Reasons endpoints
app.get('/api/reasons', (req, res) => {
  const reasons = [
    { id: 1, text: 'Your smile', imageUrl: 'https://example.com/reason1.jpg' },
    { id: 2, text: 'Your kindness', imageUrl: 'https://example.com/reason2.jpg' },
    // Add more reasons...
  ];
  res.json(reasons);
});

app.get('/api/reasons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const reason = reasons.find(r => r.id === id);

  if (!reason) {
    return res.status(404).json({ error: 'Reason not found' });
  }

  res.json(reason);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

---

## Frontend Usage

### Gallery Service

```typescript
import { GalleryService } from './service/gallery.service';

constructor(private galleryService: GalleryService) {}

// Fetch images from backend
this.galleryService.fetchImagesFromBackend().subscribe({
  next: (images) => {
    console.log('Gallery images loaded:', images);
  },
  error: (error) => {
    console.error('Failed to load images:', error);
    // Automatically falls back to placeholders
  }
});
```

### Reason Service

```typescript
import { ReasonService } from './service/reason.service';

constructor(private reasonService: ReasonService) {}

// Fetch all reasons
this.reasonService.fetchReasonsFromBackend().subscribe({
  next: (reasons) => {
    console.log('Reasons loaded:', reasons);
  },
  error: (error) => {
    console.error('Failed to load reasons:', error);
    // Automatically falls back to fallback reasons
  }
});

// Fetch single reason
this.reasonService.fetchReasonById(1).subscribe({
  next: (reason) => {
    console.log('Reason loaded:', reason);
  }
});
```

---

## Testing

### Test with Mock Backend

You can use tools like:
- **json-server** - Quick mock REST API
- **Postman Mock Server** - Create mock endpoints
- **MSW (Mock Service Worker)** - Mock API in development

### Example with json-server

1. Install json-server:
```bash
npm install -g json-server
```

2. Create `db.json`:
```json
{
  "gallery": {
    "images": [
      { "id": 1, "url": "https://picsum.photos/400/300?random=1", "alt": "Photo 1" },
      { "id": 2, "url": "https://picsum.photos/400/300?random=2", "alt": "Photo 2" }
    ]
  },
  "reasons": [
    { "id": 1, "text": "Your smile", "imageUrl": "https://picsum.photos/400/300?random=10" },
    { "id": 2, "text": "Your kindness", "imageUrl": "https://picsum.photos/400/300?random=11" }
  ]
}
```

3. Run mock server:
```bash
json-server --watch db.json --port 3000
```

---

## Deployment Checklist

- [ ] Update production API URL in `environment.prod.ts`
- [ ] Configure CORS on backend server
- [ ] Test all endpoints with production domain
- [ ] Ensure HTTPS is enabled for production API
- [ ] Set up proper error logging
- [ ] Implement rate limiting (optional)
- [ ] Add authentication if needed (optional)
