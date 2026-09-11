import re


def clean_text(text):
    # Remove extra spaces and tabs
    text = re.sub(r"[ \t]+", " ", text)

    # Remove extra blank lines
    text = re.sub(r"\n+", "\n", text)

    # Remove spaces at the beginning and end
    text = text.strip()

    return text