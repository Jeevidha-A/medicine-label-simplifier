import json
import os

from dotenv import load_dotenv
from groq import Groq

from schemas import MedicineInfo


load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY not found in backend/.env")


client = Groq(api_key=GROQ_API_KEY)

MODEL = "openai/gpt-oss-20b"


SYSTEM_PROMPT = """
You extract information from medicine and supplement labels.

Return ONLY one valid JSON object.

The JSON must have exactly these keys:

medicine_name
strength
form
ingredients
uses
directions
storage
warnings

Use this exact structure:

{
  "medicine_name": "",
  "strength": "",
  "form": "",
  "ingredients": [],
  "uses": [],
  "directions": [],
  "storage": "",
  "warnings": []
}

Rules:
USES:
- Only classify text as a use when it explicitly describes what the
  medicine/product is used for, such as "for relief of pain".
- Do NOT classify "As directed by the Physician" as a use.
- If no clear use is present, return [].

DIRECTIONS:
- Only classify text as a direction when it gives an actual action,
  amount, frequency, or method of use.
- A heading such as "Dosage" by itself is NOT a direction.
- "As directed by the Physician" may be preserved as label instruction
  only if it is clearly part of a directions section; otherwise return [].
- If the actual dosage/direction is incomplete or unclear because of OCR,
  return [].
- Never invent a missing dosage or direction.

STORAGE:
- Extract storage only when the storage instruction is reasonably clear.
- If the OCR text is fragmented or incomplete, return "" instead of guessing.
- Do not move "out of reach of children" into storage unless it is clearly
  part of the storage instruction.

WARNINGS:
- Preserve clearly identifiable safety warnings.
- Do not create a warning from unrelated OCR fragments.
- If the warning is incomplete or unclear, preserve only the clearly readable
  part or return [].

GENERAL OCR RULE:
- OCR text may be incomplete, out of order, or fragmented.
- When the meaning of a field is uncertain, prefer an empty string or empty
  list over making an assumption.

"""


def extract_medicine_information(text):
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": (
                    "Extract the information from this OCR text.\n\n"
                    + text
                ),
            },
        ],
        temperature=0,
        reasoning_effort="low",
        response_format={"type": "json_object"},
    )

    raw_result = response.choices[0].message.content

    print("\n========== GROQ RAW RESPONSE ==========")
    print(raw_result)
    print("=======================================\n")

    if not raw_result:
        raise RuntimeError("Groq returned an empty response.")

    try:
        data = json.loads(raw_result)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            f"Groq returned invalid JSON: {exc}"
        ) from exc

    return MedicineInfo.model_validate(data)


def generate_simple_explanation(medicine_info):
    prompt = f"""
Explain the following medicine or supplement label information
in simple language.

Use ONLY the information below.

Do not:
- diagnose
- prescribe
- recommend a personalized dosage
- invent uses
- invent side effects
- invent warnings
- invent ingredients
- invent medical information

Do not change numbers.

If directions are present, clearly label them as
"Directions mentioned on the label" rather than giving
personalized medical advice.

Information:

{medicine_info.model_dump_json(indent=2)}
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0,
        reasoning_effort="low",
    )

    result = response.choices[0].message.content

    if not result:
        raise RuntimeError(
            "Groq returned an empty explanation."
        )

    return result