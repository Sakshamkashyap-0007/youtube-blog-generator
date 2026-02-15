# YouTube to Blog Post Generator

## Overview
Convert any YouTube video into an SEO-optimized blog post using AI.

## Features
- Extracts YouTube transcript
- Generates structured blog using Gemini AI
- Shows reading time, word count
- Copy as text or HTML

## Tech Stack
Frontend: HTML, Tailwind CSS, JavaScript  
Backend: FastAPI  
AI: Google Gemini 2.5 Flash  

## Installation

1. Clone repo
2. Create virtual environment
3. Install dependencies
4. Add .env with GEMINI_API_KEY
5. Run uvicorn

## Run Backend
uvicorn main:app --reload

## Run Frontend
Open index.html in browser
