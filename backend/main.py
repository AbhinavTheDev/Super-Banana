import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from database import create_tables
from routes import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield



app = FastAPI(
    title="Youtube Thumbnail Generator API",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)