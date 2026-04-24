import { useRef, useState } from "react";
import "./App.css";

import BlogOutput from "./components/BlogOutput";
import Header from "./components/Header";
import Hero from "./components/Hero";
import LoadingCard from "./components/LoadingCard";
import URLInput from "./components/URLInput";
import VideoPreview from "./components/VideoPreview";
import { generateBlogPost } from "./lib/gemini";
import { getStats, markdownToHtml } from "./lib/markdown";
import { extractVideoId, fetchTranscript, fetchVideoMeta } from "./lib/youtube";

const STEPS = {
  IDLE: "idle",
  FETCHING_META: "fetching_meta",
  FETCHING_TRANSCRIPT: "fetching_transcript",
  GENERATING: "generating",
  DONE: "done",
};

const STEP_MESSAGES = {
  [STEPS.FETCHING_META]: "Fetching video info...",
  [STEPS.FETCHING_TRANSCRIPT]: "Fetching video transcript...",
  [STEPS.GENERATING]: "Generating blog post with Gemini AI...",
};

export default function App() {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState(STEPS.IDLE);
  const [error, setError] = useState("");
  const [videoMeta, setVideoMeta] = useState(null);
  const [blogHtml, setBlogHtml] = useState("");
  const [blogMarkdown, setBlogMarkdown] = useState("");
  const [blogStats, setBlogStats] = useState(null);
  const outputRef = useRef(null);

  const isLoading = step !== STEPS.IDLE && step !== STEPS.DONE;

  async function handleConvert() {
    setError("");
    setBlogHtml("");
    setBlogMarkdown("");
    setBlogStats(null);
    setVideoMeta(null);

    if (!url.trim()) {
      setError("Please enter a YouTube URL.");
      return;
    }

    const videoId = extractVideoId(url);

    if (!videoId) {
      setError("Invalid YouTube URL. Please check and try again.");
      return;
    }

    try {
      setStep(STEPS.FETCHING_META);
      const meta = await fetchVideoMeta(videoId);
      setVideoMeta(meta);

      setStep(STEPS.FETCHING_TRANSCRIPT);
      const transcript = await fetchTranscript(videoId);

      setStep(STEPS.GENERATING);
      const markdown = await generateBlogPost(meta.title, transcript);
      const html = markdownToHtml(markdown);
      const stats = getStats(html);

      setBlogMarkdown(markdown);
      setBlogHtml(html);
      setBlogStats(stats);
      setStep(STEPS.DONE);

      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setStep(STEPS.IDLE);
    }
  }

  return (
    <div className="app-wrapper">
      <Header />
      <main className="main-content">
        <div className="container">
          <Hero />

          <div className="cards-stack">
          <URLInput
            error={error}
            loading={isLoading}
            onChange={setUrl}
            onConvert={handleConvert}
            value={url}
          />

            {videoMeta && <VideoPreview meta={videoMeta} />}
            {isLoading && <LoadingCard message={STEP_MESSAGES[step]} />}

            {step === STEPS.DONE && blogHtml && (
              <div ref={outputRef}>
                <BlogOutput html={blogHtml} markdown={blogMarkdown} stats={blogStats} />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Built with React + Vite | Gemini AI | Vercel ready</p>
      </footer>
    </div>
  );
}
