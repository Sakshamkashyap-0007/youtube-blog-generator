const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

export function extractVideoId(input) {
  const value = input.trim();

  if (YOUTUBE_ID_PATTERN.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);

    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return YOUTUBE_ID_PATTERN.test(id) ? id : "";
    }

    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v") || url.pathname.split("/").pop();
      return YOUTUBE_ID_PATTERN.test(id) ? id : "";
    }
  } catch {
    return "";
  }

  return "";
}

export async function fetchVideoMeta(videoId) {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    videoUrl,
  )}&format=json`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error("Unable to fetch YouTube video details. Please check the URL.");
  }

  const data = await response.json();

  return {
    id: videoId,
    title: data.title || "Untitled YouTube video",
    author: data.author_name || "YouTube creator",
    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    url: videoUrl,
  };
}

export async function fetchTranscript() {
  return "";
}
