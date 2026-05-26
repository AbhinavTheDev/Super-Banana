import os
import logging
import asyncio
import json

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlmodel import Session, select

from database import get_session
from models import Job, Thumbnail

from services.generator import process_job, STYLE_ORDER
from services.imagekit_service import upload_file, get_variants

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api")

# request response schemas

class CreateJobRequest(BaseModel):
    prompt: str
    num_thumbnails: int
    headshot_url: str


class CreateJobResponse(BaseModel):
    job_id: str


class ThumbnailResponse(BaseModel):
    id: int
    style_name: str
    status: str
    imagekit_url: str | None = None
    error_message: str | None = None
    variants: dict | None = None


class JobResponse(BaseModel):
    id: int
    prompt: str
    num_thumbnails: int
    headshot_url: str
    status: str
    thumbnails: list[ThumbnailResponse]


@router.post("/upload-headshot")
async def upload_headshot(file: UploadFile = File(...)):
    contents = await file.read()
    url = upload_file(
        file_bytes=contents,
        file_name=file.filename or "headshot.png",
        folder="headshots",
        content_type=file.content_type or "image/png",
    )
    return {"url": url}


@router.post("/jobs", response_model=CreateJobResponse)
async def create_job(
    request: CreateJobRequest, session: Session = Depends(get_session)
):
    if request.num_thumbnails < 1 or request.num_thumbnails > 3:
        raise HTTPException(
            status_code=400, detail="num_thumbnails must be between 1 and 3"
        )

    job = Job(
        prompt=request.prompt,
        num_thumbnails=request.num_thumbnails,
        headshot_url=request.headshot_url,
    )
    session.add(job)

    styles = STYLE_ORDER[: request.num_thumbnails]

    for style in styles:
        thumb = Thumbnail(job_id=job.id, style_name=style)
        session.add(thumb)

    session.commit()

    # Fire and forget style generation
    asyncio.create_task(process_job(job.id))

    return CreateJobResponse(job_id=job.id)


@router.get("/jobs/{job_id}", response_model=JobResponse)
def get_job(job_id: str, session: Session = Depends(get_session)):
    job = session(Job, job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    thumbnails = session.exec(select(Thumbnail).where(Thumbnail.job_id == job_id)).all()

    thumb_response = []
    for t in thumbnails:
        variants = get_variants(t.imagekit_url) if t.imagekit_url else None
        thumb_response.append(
            ThumbnailResponse(
                id=t.id,
                style_name=t.style_name,
                status=t.status,
                imagekit_url=t.imagekit_url,
                error_message=t.error_message,
                variants=variants,
            )
        )

    return JobResponse(
        id=job.id,
        prompt=job.prompt,
        num_thumbnails=job.num_thumbnails,
        headshot_url=job.headshot_url,
        status=job.status,
        thumbnails=thumb_response,
    )


@router.get("/jobs/{job_id}/stream")
async def stream_job(job_id: str):
    async def event_generator():
        from database import engine

        sent_thumbnails = set()

        while True:
            with Session as session:
                job = session.get(Job, job_id)
                if not job:
                    yield f"event: error\ndata: {json.dumps({'error': 'Job not found'})}"
                    return
                thumbnails = session.exec(
                    select(Thumbnail).where(Thumbnail.job_id == job_id)
                ).all()

                for t in thumbnails:
                    if t.id in sent_thumbnails:
                        continue
                    if t.status == "uploaded":
                        variants = get_variants(t.imagekit_url)
                        data = json.dumps(
                            {
                                "thumbnail_id": t.id,
                                "style_name": t.style_name,
                                "imagekit_url": t.imagekit_url,
                                "variants": variants,
                            }
                        )
                        yield f"event: thumbnail_ready\n data: {data}"
                        sent_thumbnails.add(t.id)

                    elif t.status == "failed":
                        data = json.dumps(
                            {
                                "thumbnail_id": t.id,
                                "style_name": t.style_name,
                                "error": t.error_message
                            }
                        )
                        yield f"event: thumbnail_failed\n data: {data}"
                        sent_thumbnails.add(t.id)
                
                all_done = all(t.status in {"uploaded", "failed"} for t in thumbnails)
                if all_done and len(sent_thumbnails) == len(thumbnails):
                    data = json.dumps({"job_id": job_id, "status": job.status})
                    yield f"event: job_completed\n data: {data}"
                    return
                
            await asyncio.sleep(1.5)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
