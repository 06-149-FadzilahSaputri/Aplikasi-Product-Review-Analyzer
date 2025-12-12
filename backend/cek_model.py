import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print(" Error: API Key tidak ditemukan di file .env!")
else:
    genai.configure(api_key=api_key)
    print(f" Sedang mengecek model untuk API Key: {api_key[:5]}... (Tunggu sebentar)\n")
    
    try:
        print(" DAFTAR MODEL YANG TERSEDIA:")
        found = False
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
                found = True
        
        if not found:
            print(" Tidak ada model text yang ditemukan. Coba buat API Key baru.")
            
    except Exception as e:
        print(f" Terjadi Error: {e}")
        print("\n Kemungkinan API Key salah atau belum aktif.")