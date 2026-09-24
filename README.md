# Super Banana

## ⭐ About
- AI-assisted thumbnail generation using Cloudflare AI models
- Upload and reuse reference headshots
- Generate multiple thumbnails from a single prompt
- Track job progress and completion with SSE streaming
- API-first backend architecture for extensibility
- React + TypeScript frontend with Vite for a fast developer experience
- SQLite-backed persistence for job metadata

### :hammer_and_wrench: Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/React-white?logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-white?logo=vite&logoColor=9135FF" alt="vite" />
  <img src="https://img.shields.io/badge/Typescript-3178C6?logo=typescript&logoColor=white" alt="typescript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/ShadCN--UI-7F56D9" alt="ShadCN UI" />
  <img src="https://img.shields.io/badge/python-yellow?logo=python" alt="python" />
  <img src="https://img.shields.io/badge/FastAPI-blue?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/SQLite-003B57?logo=sqlite" alt="SQLite" />
  <img src="https://img.shields.io/badge/Gunicorn-499848?logo=gunicorn&logoColor=white" alt="gunicorn" />
</p>

### :evergreen_tree: Project structure Tree

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
└── .env.example
```

### :outbox_tray: Set up

### Prerequisites

Before starting, make sure you have:

- Python 3.11+
- Node.js 18+
- npm or bun
- Access to:
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

### :construction: API overview

The backend exposes a small set of REST endpoints for job creation and monitoring:

| Methods | Endpoints | Description |
|---------|-----------|-------------|
| POST | `/api/upload-headshot` | upload a reference image and receive an ImageKit URL |
| POST | `/api/jobs` | create a thumbnail generation job |
| GET | `/api/jobs/{job_id}` | fetch the current job state |
| GET | `/api/jobs/{job_id}/stream` | stream live job updates via SSE |

### :mailbox: Contact
Hi, I'm Abhinav! 👋  
Connect with me on [LinkedIn](https://www.linkedin.com/in/say-hi-to-abhinav/), [X](https://x.com/Abhinav_twts) and check out my other projects on [GitHub](https://github.com/AbhinavTheDev).
