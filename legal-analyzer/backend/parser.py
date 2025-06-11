import fitz  # PyMuPDF
from docx import Document
from io import BytesIO

def extract_text_from_file(file_bytes, filename):
    """Extract text from PDF, DOCX, or TXT files"""
    if filename.lower().endswith('.pdf'):
        return extract_text_from_pdf(file_bytes)
    elif filename.lower().endswith('.docx'):
        return extract_text_from_docx(file_bytes)
    elif filename.lower().endswith('.txt'):
        return file_bytes.decode('utf-8')
    else:
        raise ValueError("Unsupported file type")

def extract_text_from_pdf(file_bytes):
    """Extract text from PDF using PyMuPDF"""
    pdf = fitz.open(stream=BytesIO(file_bytes), filetype="pdf")
    text = ""
    for page_num in range(pdf.page_count):
        page = pdf[page_num]
        text += f"\n--- Page {page_num + 1} ---\n"
        text += page.get_text()
    pdf.close()
    return text

def extract_text_from_docx(file_bytes):
    """Extract text from DOCX files"""
    doc = Document(BytesIO(file_bytes))
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text