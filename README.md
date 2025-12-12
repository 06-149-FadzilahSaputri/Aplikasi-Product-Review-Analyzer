# Product Review Analyzer

Aplikasi Fullstack untuk menganalisis sentimen dan poin utama dari ulasan produk menggunakan AI.

## Fitur
- **Sentiment Analysis:** Menggunakan Hugging Face Transformers (`distilbert`).
- **Key Points Extraction:** Menggunakan Google Gemini AI.
- **Database:** Menyimpan hasil analisis ke PostgreSQL.
- **UI Modern:** Dibangun dengan React + Vite (Tema Orange).

##  Stack
- **Frontend:** React, Vite, Axios, CSS Modules.
- **Backend:** Python, FastAPI, SQLAlchemy.
- **Database:** PostgreSQL.
- **AI:** Google Generative AI (Gemini), Hugging Face Pipeline.

## Cara Menjalankan Aplikasi

### 1. Persiapan Database
Pastikan PostgreSQL sudah berjalan.
1. Buka pgAdmin 4.
2. Buat database baru bernama `review_db`.

### 2. Setup Backend
```bash
cd backend
# Buat virtual environment (jika belum)
python -m venv venv

# Aktifkan virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary google-generativeai transformers torch

# Setup Environment Variables
# Buat file .env di dalam folder backend dan isi:
# DATABASE_URL=postgresql://postgres:passwordmu@127.0.0.1/review_db
# GEMINI_API_KEY=Kunci_API_Kamu_Disini

# Jalankan Server
uvicorn main:app --reload
```
### 3. Setup Frontend
Buka terminal baru.
```bash
cd frontend
# Install dependencies
npm install

# Jalankan Frontend
npm run dev
```
### 4. Akses Aplikasi
Buka browser dan akses: http://localhost:5173

## Tampilan
![alt text](<Screenshot 2025-12-12 234620.png>)
![alt text](<Screenshot 2025-12-12 234629.png>)
