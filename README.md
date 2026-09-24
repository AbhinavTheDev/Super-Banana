# Super Banana

<div align="center">

  <img src="https://img.shields.io/badge/Project-Super%20Banana-7c3aed?style=for-the-badge" alt="Super Banana" />
  <img src="https://img.shields.io/badge/Stack-FastAPI%20%7C%20React%20%7C%20Vite-00C7B7?style=for-the-badge&logo=fastapi" alt="Stack" />
  <img src="https://img.shields.io/badge/Frontend-TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Backend-Python-3776AB?style=for-the-badge&logo=python" alt="Python" />
  <img src="https://img.shields.io/badge/Status-Active-22c55e?style=for-the-badge" alt="Status" />

</div>

Edit like Magic.

Super Banana is an AI-powered YouTube thumbnail generation app that helps creators generate polished, stylized thumbnails from a prompt and a reference headshot. The project combines a Python FastAPI backend with a modern React + Vite frontend to deliver a streamlined thumbnail generation workflow.

## Why this project?

Creating eye-catching thumbnails is time-consuming and often requires design iterations. Super Banana aims to simplify that process by giving creators:

- A fast image upload flow for reference headshots
- AI-driven thumbnail generation from prompts and visual styles
- Multiple generated variations per job
- Job tracking with streaming status updates
- A modern frontend experience for quick iteration

## Features

- AI-assisted thumbnail generation using OpenAI and Cloudflare AI models
- Upload and reuse reference headshots
- Generate multiple thumbnails from a single prompt
- Track job progress and completion with SSE streaming
- API-first backend architecture for extensibility
- React + TypeScript frontend with Vite for a fast developer experience
- SQLite-backed persistence for job metadata

## Tech stack

### Backend
- FastAPI
- SQLModel
- SQLite
- Python-dotenv
- OpenAI SDK
- ImageKit integration
- Uvicorn

### Frontend
- React
- TypeScript
- Vite
- Wouter
- Radix UI / shadcn-inspired component stack
- Tailwind CSS

## Project structure

```text
Super-Banana/
├── backend/
│   ├── services/
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   ├── routes.py
│   └── super-banana.db
├── frontend/
│   ├── public/
│   ├── src/
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
├── README.md
├── .gitignore
└── .env.example (create as needed)
```

## API overview

The backend exposes a small set of REST endpoints for job creation and monitoring:

- `POST /api/upload-headshot` — upload a reference image and receive an ImageKit URL
- `POST /api/jobs` — create a thumbnail generation job
- `GET /api/jobs/{job_id}` — fetch the current job state
- `GET /api/jobs/{job_id}/stream` — stream live job updates via SSE

## Setup guide

### Prerequisites

Before starting, make sure you have:

- Python 3.11+
- Node.js 18+
- npm or bun
- Access to:
  - OpenAI API key
  - ImageKit credentials
  - Cloudflare Worker AI token

### 1) Clone the repository

```bash
git clone https://github.com/AbhinavTheDev/Super-Banana.git
cd Super-Banana
```

### 2) Configure the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory with the variables required by `config.py`:

```env
OPENAI_API_KEY=your_openai_api_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_instance
CF_ACCOUNT_ID=your_cloudflare_account_id
CF_WORKER_AI_API_TOKEN=your_cloudflare_worker_ai_token
CF_MODEL=@cf/black-forest-labs/flux-2-klein-9b
```

Then start the API:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API should be available at:

- http://localhost:8000
- Swagger docs: http://localhost:8000/docs

### 3) Configure and run the frontend

From the project root:

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

Then open:

- http://localhost:5173

## Development notes

- Backend startup initializes the SQLite database automatically through the app lifespan hook.
- The frontend is configured for local Vite development and talks to the backend API for generation jobs.
- Some features are still under active iteration; this project is best viewed as a working prototype with room for UX and workflow improvements.

## Roadmap

- [x] Backend route scaffolding
- [x] Core API for upload and job creation
- [x] Job streaming and status updates
- [x] Frontend skeleton and UI scaffolding
- [ ] End-to-end backend integration
- [ ] UI refinements and polish
- [ ] Testing and generation evaluation

## Contact

- GitHub: https://github.com/AbhinavTheDev
- Repository: https://github.com/AbhinavTheDev/Super-Banana
- Issues: https://github.com/AbhinavTheDev/Super-Banana/issues

If you want to contribute or ask a question, feel free to open an issue in the repository.

## License

This project does not currently declare a license in the repository. If you plan to reuse or distribute it, confirm the licensing terms before publishing or sharing externally.
