from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import io
import pytesseract
from pdf2image import convert_from_path
from typing import List, Dict, Any
import logging

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def extract_tables_from_pdf(pdf_file: bytes) -> Dict[str, Any]:
    tables = []
    additional_text = []
    print("Extracting tables from PDF")
    try:
        with pdfplumber.open(io.BytesIO(pdf_file)) as pdf:
            for page_num, page in enumerate(pdf.pages, 1):
                # Extract tables
                page_tables = page.extract_tables()
                
                for table in page_tables:
                    if not table:
                        continue
                        
                    # Process headers (first row)
                    headers = [str(cell).strip() if cell else "" for cell in table[0]]
                    
                    # Process data rows
                    rows = []
                    for row in table[1:]:
                        processed_row = [str(cell).strip() if cell else "" for cell in row]
                        if any(processed_row):  # Only add non-empty rows
                            rows.append(processed_row)
                    
                    tables.append({
                        "headers": headers,
                        "rows": rows,
                        "pageNumber": page_num
                    })
                
                # Extract text that's not in tables
                text = page.extract_text()
                if text:
                    # Basic filtering to remove table content
                    text_blocks = [block.strip() for block in text.split('\n') if block.strip()]
                    additional_text.extend(text_blocks)
        
        return {
            "tables": tables,
            "additionalText": additional_text
        }
        
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process PDF file")


def extract_text_with_ocr(pdf_file: bytes) -> str:
    try:
        # Convert PDF to images
        images = convert_from_path(io.BytesIO(pdf_file))
        
        # OCR processing for each page image
        extracted_text = []
        for img in images:
            text = pytesseract.image_to_string(img, lang='heb')  # Specify Hebrew language
            print(text)
            extracted_text.append(text)
        
        return "\n".join(extracted_text)
    
    except Exception as e:
        logger.error(f"Error with OCR processing: {str(e)}")
        raise HTTPException(status_code=500, detail="OCR failed to extract text")


@app.get("/")
async def read_root():
    return {"message": "Hello World"}


@app.post("/extract-tables")
async def extract_tables(file: UploadFile):
    if not file.filename.endswith('.PDF'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        contents = await file.read()
        
        # First, try extracting text and tables using pdfplumber
        result = extract_tables_from_pdf(contents)

        # If no tables found or additional text is empty, try OCR
        if not result["tables"] and not result["additionalText"]:
            result["additionalText"] = extract_text_with_ocr(contents)
        
        return result
    except Exception as e:
        logger.error(f"Error processing upload: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process PDF file")
