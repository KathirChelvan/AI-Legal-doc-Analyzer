from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from parser import extract_text_from_file
from llm_handler import analyze_legal_document
import logging

app = FastAPI(title="Legal Document Analyzer API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-legal-doc-analyzer.vercel.app",  # Remove trailing slash
        "http://localhost:3000",  # For local development
        "https://your-actual-frontend-domain.com"  # Add your real frontend URL
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Legal Document Analyzer API is running!"}

@app.post("/analyze")
async def analyze_document(file: UploadFile = File(...)):
    try:
        # Check file type
        if not file.filename.lower().endswith(('.pdf', '.docx', '.txt')):
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload PDF, DOCX, or TXT files.")
        
        # Read and extract text
        contents = await file.read()
        text = extract_text_from_file(contents, file.filename)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the file.")
        
        # Analyze with LLM
        analysis = analyze_legal_document(text)
        
        return {
            "filename": file.filename,
            "text_length": len(text),
            "analysis": analysis
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
