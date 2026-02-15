import os
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from youtube_transcript_api import (
    YouTubeTranscriptApi,
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
)
from dotenv import load_dotenv
import google.generativeai as genai


# ========================
# Load Environment
# ========================
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in .env file")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")


# ========================
# App Init
# ========================
app = FastAPI(title="YouTube Blog Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ========================
# Request / Response Models
# ========================
class GenerateRequest(BaseModel):
    videoId: str
    title: Optional[str] = "Video Content"


class GenerateResponse(BaseModel):
    blog: str


# ========================
# Transcript Logic
# ========================
def get_transcript(video_id: str) -> str:
    try:
        # New API style (1.x)
        transcript_list = YouTubeTranscriptApi().list(video_id)

        # Try English first
        for transcript in transcript_list:
            if transcript.language_code.startswith("en"):
                data = transcript.fetch()
                return " ".join([item.text for item in data])

        # Fallback: first available transcript
        for transcript in transcript_list:
            data = transcript.fetch()
            return " ".join([item.text for item in data])

        raise HTTPException(
            status_code=400,
            detail="No transcript available for this video"
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Transcript fetch failed: {str(e)}"
        )


# ========================
# Gemini Logic
# ========================
def generate_blog(transcript: str, title: str) -> str:
    prompt = f"""
Convert this transcript into an SEO blog post.

TITLE: {title}

TRANSCRIPT:
{transcript[:8000]}
"""

    try:
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        print("Gemini ERROR:", str(e))  # 👈 IMPORTANT
        raise HTTPException(
            status_code=500,
            detail=f"Gemini error: {str(e)}"
        )


# ========================
# Routes
# ========================
@app.get("/health")
def health_check():
    return {"status": "API is running"}


@app.post("/generate", response_model=GenerateResponse)
async def generate_blog_post(request: GenerateRequest):
    transcript = get_transcript(request.videoId)
    blog = generate_blog(transcript, request.title)

    return GenerateResponse(blog=blog)
