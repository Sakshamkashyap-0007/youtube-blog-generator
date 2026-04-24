import { useRef, useState } from "react";
import "./App.css";

import BlogOutput from "./components/BlogOutput";
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
  [STEPS.FETCHING_TRANSCRIPT]: "Checking for transcript...",
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
    <div className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">YouTube to Blog</p>
          <h1>Turn a YouTube video into a ready-to-edit blog post.</h1>
        </div>
        <a className="github-link" href="https://github.com/Sakshamkashyap-0007/youtube-blog-generator">
          GitHub
        </a>
      </header>

      <main className="main-content">
        <section className="hero-panel">
          <div className="hero-copy">
            <h2>Generate long-form Markdown from any public YouTube video title.</h2>
            <p>
              Paste a video link, confirm the preview, and let Gemini draft a structured
              SEO-friendly article you can copy or save.
            </p>
          </div>
          <URLInput
            error={error}
            loading={isLoading}
            onChange={setUrl}
            onConvert={handleConvert}
            value={url}
          />
        </section>

        {videoMeta && <VideoPreview meta={videoMeta} />}
        {isLoading && <LoadingCard message={STEP_MESSAGES[step]} />}

        {step === STEPS.DONE && blogHtml && (
          <div ref={outputRef}>
            <BlogOutput html={blogHtml} markdown={blogMarkdown} stats={blogStats} />
          </div>
        )}
      </main>
    </div>
  );
}
