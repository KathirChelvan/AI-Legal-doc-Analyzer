from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from parser import extract_text_from_file
from llm_handler import analyze_legal_document
import logging

app = FastAPI(title="Legal Document Analyzer API")

# CRITICAL: Use your EXACT Vercel URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
          # Replace with your exact URL
        "https://ai-legal-doc-analyzer-7zjk1hbah-kathirchelvans-projects.vercel.app",
        "https://ai-legal-doc-analyzer.vercel.app"# Add your real URL here
        "http://localhost:3000",  # Keep for local development
        "https://localhost:3000"   # Keep for local HTTPS development
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # Add OPTIONS for preflight
    allow_headers=["*"],
)

# Add explicit OPTIONS handler for preflight requests
@app.options("/analyze")
async def options_analyze():
    return {"message": "OK"}

@app.get("/")
async def root():
    return {"message": "Legal Document Analyzer API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

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
        analysis = "This is a test summary. Your document was processed successfully."

        print("LLM returned:", analysis)
        
        return {
            "filename": file.filename,
            "text_length": len(text),
            "analysis": analysis
        }
    
    except Exception as e:
        logging.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
