import os
import re
import flask
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import PyPDF2
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def clean_text(text):
    """
    Clean text to remove illegal characters for Excel
    """
    if not isinstance(text, str):
        return text
    
    # Remove control characters
    text = re.sub(r'[\x00-\x1F\x7F-\x9F]', '', text)
    
    # Replace problematic Unicode characters
    text = text.encode('ascii', 'ignore').decode('ascii')
    
    # Remove any remaining non-printable characters
    text = ''.join(char for char in text if char.isprintable())
    
    return text.strip()

def clean_dataframe(df):
    """
    Clean all string columns in the DataFrame
    """
    for column in df.select_dtypes(include=['object']).columns:
        df[column] = df[column].apply(clean_text)
    return df

def extract_pdf_table(pdf_path):
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)

            # Initialize list to store all rows
            all_rows = []
            row_number = 1

            # Process each page
            for page_num, page in enumerate(pdf_reader.pages):
                text = page.extract_text()
                lines = text.split('\n')

                # Process each line
                for line in lines:
                    # Skip empty lines
                    if not line.strip():
                        continue

                    # Look for lines containing product codes
                    if any(code in line for code in ['GT-', 'KK-', 'XR-', 'TG-', 'XW-']):
                        # Split line into parts
                        parts = line.split()

                        # Get product code
                        product_code = next((part for part in parts if any(code in part for code in ['GT-', 'KK-', 'XR-', 'TG-', 'XW-'])), '')

                        # Get barcode (13 digits)
                        barcode = next((part for part in parts if len(part) >= 12 and part.isdigit()), '')

                        # Get Hebrew description
                        code_pos = line.find(product_code)
                        desc_start = line.find(barcode) + len(barcode)
                        desc_end = len(line)

                        # Look for the end of description
                        for match in re.finditer(r'[0-9\(\)]', line[desc_start:]):
                            desc_end = desc_start + match.start() + 115
                            print(f"Match: {match.start()}, Desc End: {desc_end}")
                            break

                        hebrew_desc = line[desc_start:desc_end].strip()

                        # Get bracket info (location)
                        location = ''
                        bracket_match = re.search(r'\((.*?)\)', line)
                        if bracket_match:
                            location = bracket_match.group(1)

                        # Get all numbers with decimals
                        all_numbers = [float(p) for p in parts if re.match(r'^\d+\.\d{2}$', p)]

                        # Get the price (usually the largest non-1.00 number)
                        non_qty_numbers = [n for n in all_numbers if n != 1.00]
                        price = max(non_qty_numbers) if non_qty_numbers else 0.00

                        # Get quantity (usually 1.00)
                        quantity = next((p for p in parts if p == '1.00'), '1.00')

                        if product_code and barcode:
                            row_data = {
                                'No.': row_number,
                                'Product_Code': clean_text(product_code),
                                'Item_Description': clean_text(hebrew_desc),
                                'Location': clean_text(location),
                                'Barcode': clean_text(barcode),
                                'Quantity': clean_text(quantity),
                                'Price': f"{price:.2f}"
                            }
                            all_rows.append(row_data)
                            row_number += 1

            if not all_rows:
                return None

            # Create DataFrame and clean it
            df = pd.DataFrame(all_rows)
            df = clean_dataframe(df)
            return df

    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return None

@app.route('/extract-pdf', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        # Save the uploaded file
        file_path = os.path.join('uploads', file.filename)
        os.makedirs('uploads', exist_ok=True)
        file.save(file_path)
        
        # Extract data
        df = extract_pdf_table(file_path)
        
        if df is None:
            return jsonify({'error': 'Could not extract data from PDF'}), 500
        
        # Save to Excel
        excel_path = os.path.join('uploads', 'extracted_table.xlsx')
        df.to_excel(excel_path, index=False)
        
        # Return data as JSON and Excel file path
        return jsonify({
            'data': df.to_dict(orient='records'),
            'excel_path': excel_path
        })

@app.route('/download-excel', methods=['GET'])
def download_excel():
    excel_path = request.args.get('path')
    if not excel_path or not os.path.exists(excel_path):
        return jsonify({'error': 'File not found'}), 404
    
    return send_file(excel_path, as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)