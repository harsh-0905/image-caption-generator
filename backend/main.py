from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import base64
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Image Caption Generator API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

STYLE_PROMPTS = {
    "basic": "Describe this image in one clear, concise sentence.",
    "funny": "Write a witty, humorous caption for this image. Make it clever and light-hearted.",
    "professional": "Write a formal, professional caption suitable for a business presentation or report.",
    "instagram": "Write an engaging Instagram caption with relevant emojis and 3-5 hashtags. Make it trendy and relatable.",
}


class CaptionResponse(BaseModel):
    basic: str
    funny: Optional[str] = None
    professional: Optional[str] = None
    instagram: Optional[str] = None


async def generate_caption(image_base64: str, media_type: str, style: str) -> str:
    """Call OpenAI Vision API to generate a caption."""
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    prompt = STYLE_PROMPTS.get(style, STYLE_PROMPTS["basic"])

    payload = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{media_type};base64,{image_base64}",
                            "detail": "low",
                        },
                    },
                    {"type": "text", "text": prompt},
                ],
            }
        ],
        "max_tokens": 200,
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json",
            },
            json=payload,
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"OpenAI API error: {response.text}",
            )

        data = response.json()
        return data["choices"][0]["message"]["content"].strip()


@app.get("/")
async def root():
    return {"message": "Image Caption Generator API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "api_key_set": bool(OPENAI_API_KEY)}


@app.post("/caption", response_model=CaptionResponse)
async def generate_captions(
    file: UploadFile = File(...),
    styles: str = "basic,funny,professional,instagram",
):
    """
    Upload an image and receive AI-generated captions in multiple styles.
    
    - **file**: Image file (JPEG, PNG, GIF, WEBP) — max 10MB
    - **styles**: Comma-separated list of caption styles: basic, funny, professional, instagram
    """
    # Validate file type
    allowed_types = {"image/jpeg", "image/png", "image/gif", "image/webp"}
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Allowed: JPEG, PNG, GIF, WEBP",
        )

    # Read and validate file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")

    # Encode to base64
    image_base64 = base64.b64encode(contents).decode("utf-8")
    media_type = file.content_type

    # Parse requested styles
    requested_styles = [s.strip() for s in styles.split(",") if s.strip() in STYLE_PROMPTS]
    if not requested_styles:
        requested_styles = ["basic"]

    
     # Generate captions sequentially
    results = {}
    for style in requested_styles:
        results[style] = await generate_caption(image_base64, media_type, style)

    return CaptionResponse(
        basic=results.get("basic", ""),
        funny=results.get("funny"),
        professional=results.get("professional"),
        instagram=results.get("instagram"),
    )
