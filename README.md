# Medicine Label Simplifier

Medicine Label Simplifier is an AI-based web application that helps users understand medicine label information in a simple and easy-to-read way.

## Problem Statement

Medicine labels contain important information such as dosage, usage, warnings, precautions, and side effects. Some of this information can be difficult to understand because of medical terms and detailed instructions.

This project uses AI to simplify the given medicine information and present it in a clear and understandable format.

## Objectives

- To make medicine information easier to understand.
- To simplify complex medical terms and instructions.
- To provide a simple and user-friendly interface.
- To use AI for processing medicine information.
- To display important information in a readable format.

## System Architecture

```text
                         ┌──────────────┐
                         │     USER     │
                         └──────┬───────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │   REACT FRONTEND    │
                    │      + VITE         │
                    └──────────┬──────────┘
                               │
                               │ API Request
                               ▼
                    ┌─────────────────────┐
                    │       BACKEND       │
                    │       PYTHON        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      AI / LLM       │
                    │     PROCESSING      │
                    └──────────┬──────────┘
                               │
                               │ Simplified Result
                               ▼
                    ┌─────────────────────┐
                    │       BACKEND       │
                    │      RESPONSE       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   REACT FRONTEND    │
                    │   DISPLAY RESULT    │
                    └──────────┬──────────┘
                               │
                               ▼
                         ┌──────────────┐
                         │     USER     │
                         └──────────────┘
```

### Architecture Explanation

1. The user provides medicine information through the frontend.
2. The React frontend collects the user input.
3. The frontend sends the information to the Python backend.
4. The backend processes the request and sends the information to the AI/LLM.
5. The AI processes the medicine information and simplifies it.
6. The backend sends the simplified result back to the frontend.
7. The frontend displays the result to the user.

## Framework and Technologies

```text
┌─────────────────────────────────────────────┐
│          MEDICINE LABEL SIMPLIFIER          │
├─────────────────────────────────────────────┤
│                                             │
│ Frontend                                    │
│ React.js + Vite                             │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│ Backend                                     │
│ Python + API                                │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│ AI / LLM                                    │
│ AI API for Information Processing           │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│ Web Technologies                            │
│ JavaScript + HTML + CSS                     │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│ Deployment                                  │
│ Vercel                                      │
│                                             │
└─────────────────────────────────────────────┘
```

### Technologies Used

- React.js
- Vite
- JavaScript
- HTML
- CSS
- Python
- AI / LLM API
- Git
- GitHub
- Vercel

## How the Application Works

1. The user enters the medicine information.
2. The frontend collects the input.
3. The input is sent to the backend through an API request.
4. The backend processes the request.
5. The AI model analyzes and simplifies the medicine information.
6. The simplified result is sent back to the frontend.
7. The result is displayed to the user.

## Features

- Simple and user-friendly interface
- AI-based medicine information simplification
- Easy-to-read results
- Frontend and backend integration
- Medicine information processing
- Responsive web application
- Online deployment

## Debugging

During development, different parts of the application were tested and debugged.

### Frontend Debugging

The browser Developer Tools were used to check:

- JavaScript errors
- React errors
- API errors
- Network errors
- UI issues

The **Console** and **Network** tabs were mainly used for debugging.

### Backend Debugging

The backend was checked for:

- API request errors
- Response errors
- Processing errors
- Connection problems

### AI Debugging

The AI processing was tested to make sure:

- The input was sent correctly.
- The AI request was completed.
- A valid response was received.
- The response was displayed correctly.

### Testing

The backend contains test files for different parts of the application:

```text
backend/
│
├── test_cleaner.py
├── test_explanation.py
├── test_llm.py
├── test_ocr.py
└── test_pipeline.py
```

These tests are used to check the cleaning, explanation, LLM, OCR, and processing pipeline parts of the application.

## Installation

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the Project

```bash
cd medicine-label-simplifier
```

### 3. Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install the required packages:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

### 4. Backend Setup

Open another terminal and go to the backend folder:

```bash
cd backend
```

Create a virtual environment if required:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install the required packages:

```bash
pip install -r requirements.txt
```

Run the backend using the command configured in the project.

## Environment Variables

The project uses environment variables for API keys and other configuration values.

Create a `.env` file and add the required values.

Example:

```env
API_KEY=your_api_key_here
```

Do not upload your actual API key to GitHub.

Make sure the `.env` file is included in `.gitignore`.

## Project Structure

```text
medicine-label-simplifier/
│
├── backend/
│   ├── test_cleaner.py
│   ├── test_explanation.py
│   ├── test_llm.py
│   ├── test_ocr.py
│   └── test_pipeline.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── History.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Deployment

The application is deployed using Vercel.

## Live Demo

https://medicine-label-simplifier.vercel.app

## Future Improvements

- Medicine label image upload
- OCR-based text extraction
- Support for multiple languages
- Voice-based explanation
- Improved medicine information processing
- Better categorization of warnings and precautions

## Disclaimer

This project is developed for educational and informational purposes.

The information provided by the application should not be considered a substitute for professional medical advice, diagnosis, or treatment.

Users should consult a qualified doctor or pharmacist before making decisions related to medicines.

## Author

**Jeevidha A**

MCA | AI/ML Fresher