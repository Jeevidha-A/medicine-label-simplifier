from services.llm_service import (
    extract_medicine_information,
    generate_simple_explanation,
)


text = """
Amoxicillin Capsules IP
500 mg
Each capsule contains:
Amoxicillin Trihydrate IP
Store below 25*C in a dry place
Keep out of reach of children
"""


medicine_info = extract_medicine_information(text)

print("Structured Information:")
print(medicine_info.model_dump_json(indent=4))

print("\nSimple Explanation:")
explanation = generate_simple_explanation(medicine_info)

print(explanation)