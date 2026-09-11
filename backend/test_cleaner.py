from services.text_cleaner import clean_text


raw_text = """
Amoxicillin Capsules IP


500 mg

B No:
A12345

Each capsule contains:
Amoxicillin Trihydrate IP
"""


cleaned_text = clean_text(raw_text)

print("Cleaned Text:")
print(cleaned_text)