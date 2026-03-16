# Tuner 🤖

**Tuner** is an AI-powered robot task management and fine-tuning platform. It provides a unified interface for recording, classifying, and discovering robot tasks using multimodal AI — combining text, image, and video inputs to help teams build, organize, and scale robot learning datasets.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)

---

## Overview

Tuner bridges the gap between human intent and robot execution. Users can:

- **Describe** robot tasks in natural language via an AI chat interface
- **Upload** images and videos demonstrating a robot task
- **Search** a marketplace of pre-defined robot task templates using semantic similarity
- **Fine-tune** robot behaviors by providing labeled multimodal examples

Under the hood, Tuner processes inputs through the [Groq API](https://groq.com/) for multimodal AI inference and stores task embeddings in a [Neo4j](https://neo4j.com/) vector database for fast similarity retrieval.

---

## Features

### 🧠 AI Chat Interface
- Conversational assistant for robot task queries and instructions
- Dark-themed, responsive UI
- Persistent message history within a session

### 📷 Multimodal Input Support
- **Image upload** — attach photos for visual task context
- **Video recording / upload** — capture demonstrations of robot tasks
- **Webcam integration** — record directly from the browser via `react-webcam`
- **Audio input** — voice-based task descriptions

### 🔍 Semantic Task Search
- Neo4j-powered vector similarity search
- Finds the most relevant existing tasks given a new description or demonstration
- Confidence scoring and task classification

### 🛒 Task Marketplace
- Browse a curated library of robot task templates
- Filter by **robot type** (robotic arms, mobile robots) or **category** (sorting, manipulation, cleaning, retail, agriculture, logistics, and more)
- Full-text search across task titles and descriptions

### ✋ Hand / Gesture Tracking
- Real-time hand detection and tracking via a video stream from the backend
- Useful for gesture-based robot teaching workflows

---

## Architecture

```
Browser (React)
    │
    ├── AI Chat (TunerChatv2.jsx)
    │       └── Multimodal uploads → POST /api/v1/process
    │
    ├── Task Marketplace (Marketplace.jsx)
    │       └── Static catalog + GET /api/v1/marketplace/{task_id}
    │
    └── Hand Tracker (HandTracker.jsx)
            └── Video stream ← GET /video_feed

FastAPI Backend (Python)
    │
    ├── Instructor (instructor.py)
    │       ├── text_processor.py
    │       ├── image_processor.py
    │       └── video_processor.py
    │
    ├── Groq API Client (groq_client.py)
    │       └── Multimodal AI inference (text / vision)
    │
    └── Neo4j Client (neo4j_client.py)
            └── Vector embeddings, similarity search, task storage
```

---

## Project Structure

```
tuner/
├── src/                          # React frontend source
│   ├── main.jsx                  # Application entry point
│   ├── App.jsx                   # Root component (chat ↔ marketplace toggle)
│   ├── TunerChatv2.jsx           # Main AI chat interface
│   ├── TunerChat.jsx             # Alternative chat view
│   ├── TunerApp.jsx              # App shell view
│   ├── Appstore.jsx              # App store view
│   ├── components/
│   │   ├── Markeplace.jsx        # Task Marketplace UI
│   │   └── HandTracker.jsx       # Video stream / hand tracking display
│   └── assets/
│       └── marketplacedata.js    # Static task catalog data
│
├── Backend/                      # Python FastAPI backend
│   ├── main.py                   # Server entry point
│   ├── helpers.py                # Shared utility functions
│   ├── requirements.txt          # Python dependencies
│   ├── api/
│   │   ├── routes.py             # REST API endpoints
│   │   └── groq_client.py        # Groq API integration
│   ├── config/
│   │   └── settings.py           # App configuration & env var loading
│   ├── database/
│   │   ├── neo4j_client.py       # Neo4j vector DB client
│   │   └── schema.py             # Database schema definitions
│   ├── multimodal/
│   │   ├── text_processor.py     # Text extraction & analysis
│   │   ├── image_processor.py    # Image recognition & processing
│   │   └── video_processor.py    # Video frame extraction & analysis
│   └── Instructor/
│       ├── instructor.py         # Main task processing orchestrator
│       └── task_classifier.py    # Task type classification
│
├── index.html                    # HTML entry point
├── vite.config.js                # Vite build configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── package.json                  # Frontend dependencies & scripts
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 and **npm** ≥ 9
- **Python** ≥ 3.10
- A running **Neo4j** instance (local or AuraDB) with the vector index plugin enabled
- A **Groq API key** (sign up at [console.groq.com](https://console.groq.com/))

### Environment Variables

Create a `.env` file in the project root (next to `package.json`):

```env
# Neo4j database
NEO4J_URI=bolt://localhost:7687
DATABASE_USER=neo4j
DATABASE_PASSWORD=your_password

# Groq AI
GROQ_API_KEY=your_groq_api_key
```

### Frontend Setup

```bash
# Install dependencies
npm install

# Start the development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview

# Lint the source files
npm run lint
```

### Backend Setup

```bash
cd Backend

# (Recommended) Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server (http://localhost:8000)
python main.py
```

The backend exposes:
- **REST API** at `http://localhost:8000`
- **Video stream** at `http://localhost:8000/video_feed`
- **Interactive API docs** at `http://localhost:8000/docs`

---

## Usage

1. **Start the backend** — `python Backend/main.py`
2. **Start the frontend** — `npm run dev`
3. Open `http://localhost:5173` in your browser
4. Use the **chat interface** to describe a robot task or upload media
5. Switch to the **Marketplace** to browse and filter existing task templates

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/process` | Process a multimodal task request (text, image, or video) |
| `POST` | `/api/v1/tasks` | Create and store a new robot task |
| `GET`  | `/api/v1/marketplace/{task_id}` | Retrieve details for a specific marketplace task |
| `GET`  | `/api/v1/health` | Backend health check |
| `GET`  | `/video_feed` | MJPEG video stream for hand/gesture tracking |

Full interactive documentation is available at `http://localhost:8000/docs` when the backend is running.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | [React 19](https://react.dev/) |
| Build tool | [Vite 6](https://vitejs.dev/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Webcam | [react-webcam](https://github.com/mozmorris/react-webcam) |
| Backend framework | [FastAPI](https://fastapi.tiangolo.com/) |
| ASGI server | [Uvicorn](https://www.uvicorn.org/) |
| Vector database | [Neo4j](https://neo4j.com/) |
| AI inference | [Groq API](https://groq.com/) |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature`
5. Open a Pull Request against `main`

Please follow the existing code style and run `npm run lint` before submitting.

