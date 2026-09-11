from services.ocr_service import extract_text
from services.text_cleaner import clean_text
from services.llm_service import (
    extract_medicine_information,
    generate_simple_explanation,
)


def analyze_medicine(image_path):
    # Step 1: Extract text from the image using OCR
    text = extract_text(image_path)

    # Step 2: Clean the OCR text
    cleaned = clean_text(text)

    # Step 3: Extract structured medicine information using the LLM
    medicine_info = extract_medicine_information(cleaned)

    # Step 4: Generate a simple explanation
    explanation = generate_simple_explanation(medicine_info)

    # Step 5: Return the complete result
    return {
        "raw_text": text,
        "cleaned_text": cleaned,
        "medicine_info": medicine_info,
        "simple_explanation": explanation,
    }