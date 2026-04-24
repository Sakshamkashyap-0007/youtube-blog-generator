const MODEL = "gemini-2.5-flash";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return response.status(500).json({
      error: "GEMINI_API_KEY is not configured in Vercel.",
    });
  }

  const { title, transcript } = request.body || {};

  if (!title || typeof title !== "string") {
    return response.status(400).json({ error: "Video title is required." });
  }

  const transcriptSection =
    transcript && typeof transcript === "string"
      ? `VIDEO TRANSCRIPT:\n${transcript.slice(0, 10000)}`
      : "Note: Transcript unavailable. Generate a comprehensive, detailed blog post based on the video title alone.";

  const prompt = `You are an expert content writer and SEO specialist.

Convert the following YouTube video into a comprehensive, engaging, SEO-optimized blog post.

VIDEO TITLE: ${title}

${transcriptSection}

REQUIREMENTS:
- Write a full blog post of at least 700 words
- Use proper Markdown: # for main title, ## for sections, ### for subsections
- Include an engaging introduction
- Organize into clear logical sections with descriptive headings
- Use **bold** for key concepts
- End with a conclusion and key takeaways
- Write in a clear, authoritative, engaging tone
- Do not include preamble like "Here is the blog post:"; start directly with the # title

Return only the Markdown blog post, nothing else.`;

  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2048,
        },
      }),
    },
  );

  const data = await geminiResponse.json().catch(() => ({}));

  if (!geminiResponse.ok) {
    return response.status(geminiResponse.status).json({
      error: data.error?.message || "Gemini API request failed.",
    });
  }

  const markdown = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!markdown) {
    return response.status(502).json({
      error: "Gemini returned an empty response.",
    });
  }

  return response.status(200).json({ markdown });
}
