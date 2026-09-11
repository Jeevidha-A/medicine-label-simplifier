from services.llm_service import extract_medicine_information


text = """
Amoxicillin Capsules IP
500 mg
B No:
A12345
Each capsule contains:
Amoxicillin Trihydrate IP
Mfg: Date: 042024
equivalent to Amoxicillin
500 mg
Exp: Date: 0372027
As directed by the Physician:
Store below 25*C in a
place:
out of reach of children:
Mfg: Lic: No:: 25/UA/2018
Dosage:
dry
Keep
"""


result = extract_medicine_information(text)

print("Validated AI Result:")
print(result.model_dump_json(indent=4))