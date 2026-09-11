from services.ocr_service import extract_text


image_path = "sample_image.jpg"

text = extract_text(image_path)

print("Extracted Text:")
print(text)