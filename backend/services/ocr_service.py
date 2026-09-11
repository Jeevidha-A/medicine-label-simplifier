import base64
import os

from dotenv import load_dotenv
from groq import Groq


load_dotenv()


GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY not found in backend/.env")


client = Groq(api_key=GROQ_API_KEY)

OCR_MODEL = "qwen/qwen3.6-27b"


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(
            image_file.read()
        ).decode("utf-8")


def get_mime_type(image_path):
    extension = os.path.splitext(image_path)[1].lower()

    if extension in [".jpg", ".jpeg"]:
        return "image/jpeg"

    if extension == ".png":
        return "image/png"

    if extension == ".webp":
        return "image/webp"

    raise ValueError(
        "Unsupported image format. Use JPG, JPEG, PNG, or WEBP."
    )


def extract_text(image_path):
    base64_image = encode_image(image_path)
    mime_type = get_mime_type(image_path)

    prompt = """
Read the medicine or supplement label in this image.

Extract all clearly readable text from the label.

Preserve:
- product name
- strength
- ingredients
- directions
- warnings
- storage instructions
- batch number
- manufacturing date
- expiry date
- manufacturer
- other clearly visible label text

Do not guess unreadable text.

Return plain text only.
Do not summarize.
Do not interpret the medicine.
Do not give medical advice.
"""

    response = client.chat.completions.create(
        model=OCR_MODEL,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt,
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": (
                                f"data:{mime_type};base64,"
                                f"{base64_image}"
                            )
                        },
                    },
                ],
            }
        ],
        temperature=0,
        max_completion_tokens=4096,
    )

    result = response.choices[0].message.content

    if not result:
        raise RuntimeError(
            "Vision model returned no text."
        )

    return result