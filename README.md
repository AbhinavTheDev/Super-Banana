# Super Banana

features
- [ ] youtube thumbnail generation

## backend supported route

- `/upload-headshot` - upload reference image in imagekit and use it
- `/jobs` - create job of image generation
- `/jobs/{job_id}` - Get the Job
- `/jobs/{job_id}/stream` - SSE of job

## frontend support
- [x] api helpers
- [x] core skeleton of ui
- [ ] backend integration
- [ ] UI refinements
- [ ] testing and evaluating generation 

## Tech Stack

Backend
- FastAPI
- SQLModel
- SQLite

Frontend
- Vite (React + TS)