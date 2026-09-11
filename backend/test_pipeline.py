from services.analysis_service import analyze_medicine


result = analyze_medicine("sample_image.jpg")


print("\n========== RAW OCR TEXT ==========")
print(result["raw_text"])


print("\n========== CLEANED TEXT ==========")
print(result["cleaned_text"])


print("\n========== MEDICINE INFORMATION ==========")
print(
    result["medicine_info"].model_dump_json(indent=4)
)


print("\n========== SIMPLE EXPLANATION ==========")
print(result["simple_explanation"])