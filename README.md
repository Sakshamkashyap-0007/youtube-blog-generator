# YouTube Blog Generator

React + Vite app that generates an SEO-friendly Markdown blog post from a YouTube video title using Gemini.

## Local Setup

```bash
npm install
npm run build
```

For local API testing, use Vercel Dev so `/api/generate-blog` is available:

```bash
npx vercel dev
```

Create `.env.local` or configure Vercel with:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

## Deploy On Vercel

1. Import this GitHub repository into Vercel.
2. Keep the default Vite settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add the `GEMINI_API_KEY` environment variable in Project Settings.
4. Deploy.

The Gemini key is used only inside the Vercel serverless API route, not in browser code.
