export async function generateBlogPost(title, transcript) {
  const response = await fetch("/api/generate-blog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      transcript,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.markdown;

  if (!text) {
    throw new Error("Gemini returned an empty response. Please try again.");
  }

  return text;
}
