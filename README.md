# 🎥 YouTube to Blog Post Generator

Convert any YouTube video into a structured, SEO-optimized blog post using AI.

This project extracts a YouTube video transcript and uses **Google Gemini 2.5 Flash** to generate a clean, readable, and well-structured blog article with headings, formatting, word count, and dynamic reading time estimation.

---

## 🚀 Features

* ✅ Extracts transcript from YouTube videos
* ✅ Generates SEO-optimized blog posts using Gemini AI
* ✅ Converts markdown to structured HTML
* ✅ Displays:

  * Word count
  * Dynamic reading time (seconds / minutes / hours)
  * Character count
  * Heading count
* ✅ Copy blog as:

  * Plain Text
  * HTML
* ✅ FastAPI backend for secure AI API handling

---

## 🛠 Tech Stack

### Frontend

* HTML
* Tailwind CSS
* JavaScript

### Backend

* Python
* FastAPI

### AI Model

* Google Gemini 2.5 Flash

---

## 📦 Project Structure

```
.
├── main.py
├── index.html
├── index.js
├── style.css
├── requirements.txt
├── .env (not pushed to GitHub)
├── .gitignore
└── README.md
```

---

# ⚙️ Installation & Local Setup

Follow these steps properly. Do not skip them.

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/youtube-blog-generator.git
cd youtube-blog-generator
```

Replace `yourusername` with your actual GitHub username.

---

## 2️⃣ Create Virtual Environment

Create a virtual environment inside the project directory:

```bash
python -m venv venv
```

---

## 3️⃣ Activate Virtual Environment

### Windows:

```bash
venv\Scripts\activate
```

### Mac / Linux:

```bash
source venv/bin/activate
```

Once activated, you should see `(venv)` in your terminal.

---

## 4️⃣ Install Dependencies

If `requirements.txt` exists:

```bash
pip install -r requirements.txt
```

If you need to generate it:

```bash
pip freeze > requirements.txt
```

---

## 5️⃣ Create Environment Variables

Create a file named `.env` in the root directory.

Inside it, add:

```
GEMINI_API_KEY=your_api_key_here
```

⚠️ Important:

* Never push your `.env` file to GitHub
* Make sure `.env` is added inside `.gitignore`

---

# ▶️ Running the Application

## Start the Backend (FastAPI)

```bash
uvicorn main:app --reload
```

Backend will run at:

```
http://127.0.0.1:8000
```

---

## Run the Frontend

Simply open:

```
index.html
```

in your browser.

Make sure the backend is running before generating blog posts.

---

# 🔐 Environment Variables

| Variable       | Description                |
| -------------- | -------------------------- |
| GEMINI_API_KEY | Your Google Gemini API key |

---

# 🌍 Deployment

## Frontend Deployment Options

* Vercel
* Netlify

## Backend Deployment Options

* Render
* Railway
* Fly.io

When deploying backend:

* Set `GEMINI_API_KEY` inside environment variables in your hosting dashboard
* Never hardcode API keys in frontend

After deployment, update:

```javascript
const BACKEND_URL = "http://127.0.0.1:8000/generate";
```

To your deployed backend URL.

---

# ⚠️ Important Notes

* This project uses backend-based AI calls for security.
* Gemini API key should always remain private.
* Billing must be enabled in your Google Cloud project.
* GitHub Pages cannot host the backend.

---

# 📌 Future Improvements

* Multi-language blog generation
* Tone selection (formal, casual, technical)
* PDF export
* Authentication system
* Save generated blogs to database

---

# 👨‍💻 Author

Your Name
GitHub: [https://github.com/yourusername](https://github.com/yourusername)

---

If you are cloning this project, follow setup instructions carefully. If something breaks, it is almost always due to environment setup being skipped.
