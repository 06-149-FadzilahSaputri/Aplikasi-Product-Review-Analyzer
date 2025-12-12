import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from transformers import pipeline
from datetime import datetime
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL belum ada di file .env!")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)
    model_gemini = genai.GenerativeModel('gemini-flash-latest')
else:
    print("WARNING: GEMINI_API_KEY belum di-set di .env")

print("Loading Sentiment Model... (Ini akan memakan waktu di awal)")
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
print("Model Loaded!")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, index=True)
    review_text = Column(Text)
    sentiment = Column(String)
    key_points = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ReviewRequest(BaseModel):
    product_name: str
    review_text: str

class ReviewResponse(BaseModel):
    id: int
    product_name: str
    review_text: str
    sentiment: str
    key_points: str
    created_at: datetime

    class Config:
        from_attributes = True


@app.post("/api/analyze-review", response_model=ReviewResponse)
async def analyze_review(request: ReviewRequest, db: Session = Depends(get_db)):
    try:
        sentiment_result = sentiment_analyzer(request.review_text)[0]
        sentiment_label = sentiment_result['label']

        key_points_text = "Key points not available (API Key missing)."
        if GEMINI_KEY:
            try:
                prompt = f"Extract 3 main key points from this review as bullet points: '{request.review_text}'"
                gemini_response = model_gemini.generate_content(prompt)
                key_points_text = gemini_response.text
            except Exception as e:
                key_points_text = f"Gemini Error: {str(e)}"

        new_review = Review(
            product_name=request.product_name,
            review_text=request.review_text,
            sentiment=sentiment_label,
            key_points=key_points_text
        )
        db.add(new_review)
        db.commit()
        db.refresh(new_review)

        return new_review

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/reviews", response_model=list[ReviewResponse])
def get_reviews(db: Session = Depends(get_db)):
    return db.query(Review).order_by(Review.created_at.desc()).all()

@app.get("/")
def read_root():
    return {"message": "Backend Product Review Analyzer is Running!"}