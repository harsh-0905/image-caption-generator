# ⬡ CaptionAI — AI Image Caption Generator

> Drop an image. Get captions that slap.

A full-stack web app that generates AI-powered captions for any image — in **4 styles**: Basic, Funny, Professional, and Instagram-ready (with hashtags). Built with **FastAPI + React (Vite)** and powered by **OpenAI GPT-4o Vision**.

---

## ✨ Features

- 🖼️ Drag-and-drop or click-to-upload image UI
- 🤖 GPT-4o Vision generates contextually accurate captions
- 🎭 4 caption styles: Basic · Funny · Professional · Instagram
- 📋 One-click copy-to-clipboard for each caption
- ⚡ Loading skeletons + full error handling
- 🌑 Sleek dark UI with animated background

---

## 📁 Project Structure

```
image-caption-generator/
├── backend/
│   ├── main.py              # FastAPI app — all routes & logic
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment variable template
│   └── render.yaml          # Render deployment config
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json          # Vercel deployment config
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx          # Root component + layout
│       ├── App.module.css
│       ├── index.css        # Design tokens + global styles
│       ├── components/
│       │   ├── ImageUploader.jsx   # Drag-and-drop upload + preview
│       │   ├── ImageUploader.module.css
│       │   ├── StyleSelector.jsx   # Caption style toggle chips
│       │   ├── StyleSelector.module.css
│       │   ├── CaptionCard.jsx     # Individual caption + copy button
│       │   └── CaptionCard.module.css
│       ├── hooks/
│       │   └── useCaptions.js      # API call state management
│       └── utils/
│           └── api.js              # Fetch helpers for backend API
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start (Local)

### Prerequisites

- Python 3.10+
- Node.js 18+
- An [OpenAI API key](https://platform.openai.com/api-keys)

---

### 1. Clone the repo

```bash
git clone https://github.com/your-username/image-caption-generator.git
cd image-caption-generator
```

---

### 2. Backend setup

```bash
cd backend

# Create & activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# → Open .env and set your OPENAI_API_KEY

# Run the server
uvicorn main:app --reload --port 8000
```

Backend will be live at: `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

---

### 3. Frontend setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# → VITE_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

Frontend will be live at: `http://localhost:5173`

---

## 🌐 API Reference

### `POST /caption`

Upload an image and receive AI-generated captions.

**Request** — `multipart/form-data`

| Field    | Type   | Required | Description                                      |
|----------|--------|----------|--------------------------------------------------|
| `file`   | File   | ✅       | Image file (JPEG, PNG, GIF, WEBP) — max 10MB    |
| `styles` | string | ❌       | Comma-separated styles (default: all four)       |

Valid styles: `basic`, `funny`, `professional`, `instagram`

**Response**

```json
{
  "basic": "A golden retriever sits on a sunny beach.",
  "funny": "This dog just quit his day job. No regrets.",
  "professional": "A canine subject positioned in a coastal outdoor environment.",
  "instagram": "Living my best life 🐾☀️ #GoldenRetriever #BeachDog #DogsOfInstagram"
}
```

**Example with curl**

```bash
curl -X POST http://localhost:8000/caption \
  -F "file=@photo.jpg" \
  -F "styles=basic,instagram"
```

---

### `GET /health`

Returns API status and whether the OpenAI key is configured.

```json
{ "status": "healthy", "api_key_set": true }
```

---

## ☁️ Deployment

### Backend → Render

1. Push your repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo, set **Root Directory** to `backend`
4. Render auto-detects `render.yaml` — or manually set:
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable: `OPENAI_API_KEY = sk-your-key`
6. Deploy — copy the public URL (e.g. `https://caption-api.onrender.com`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo, set **Root Directory** to `frontend`
3. Add environment variable:
   - `VITE_API_URL` = your Render backend URL
4. Deploy — Vercel auto-builds with Vite

> ⚠️ **CORS**: For production, update the `allow_origins` list in `backend/main.py` to your Vercel frontend URL.

---

## 🔧 Configuration

| Variable        | Location  | Description                          |
|-----------------|-----------|--------------------------------------|
| `OPENAI_API_KEY`| backend   | Required. Your OpenAI secret key     |
| `VITE_API_URL`  | frontend  | Backend URL (local or Render)        |
| `PORT`          | backend   | Server port (default: 8000)          |

---

## 🛠️ Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React 18, Vite, CSS Modules   |
| Backend   | Python, FastAPI, Uvicorn      |
| AI        | OpenAI GPT-4o Vision API      |
| Deploy    | Vercel (FE) + Render (BE)     |

---

## 📄 License

MIT — free to use, modify, and ship.
