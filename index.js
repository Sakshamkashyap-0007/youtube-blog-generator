let currentVideoId = null;

let currentBlogPost = {
    html: '',
    markdown: '',
    plainText: ''
};

const elements = {
    youtubeUrl: document.getElementById('youtubeUrl'),
    convertBtn: document.getElementById('convertBtn'),
    errorMessage: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),
    videoPreview: document.getElementById('videoPreview'),
    videoThumbnail: document.getElementById('videoThumbnail'),
    videoTitle: document.getElementById('videoTitle'),
    videoChannel: document.getElementById('videoChannel'),
    videoLink: document.getElementById('videoLink'),
    loadingState: document.getElementById('loadingState'),
    loadingMessage: document.getElementById('loadingMessage'),
    blogPostSection: document.getElementById('blogPostSection'),
    blogContent: document.getElementById('blogContent'),
    wordCount: document.getElementById('wordCount'),
    readingTime: document.getElementById('readingTime'),
    charCount: document.getElementById('charCount'),
    headingCount: document.getElementById('headingCount'),
    copyBtn: document.getElementById('copyBtn'),
    copyHtmlBtn: document.getElementById('copyHtmlBtn')
};

const BACKEND_URL = "http://127.0.0.1:8000/generate";


function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

function showError(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.classList.remove('hidden');
}

function hideError() {
    elements.errorMessage.classList.add('hidden');
}

async function showVideoPreview(videoId) {
    try {
        const response = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
        );

        const data = await response.json();

        elements.videoThumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        elements.videoTitle.textContent = data.title;
        elements.videoChannel.textContent = data.author_name;
        elements.videoLink.href = `https://www.youtube.com/watch?v=${videoId}`;

        elements.videoPreview.classList.remove('hidden');
    } catch {
        elements.videoThumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        elements.videoTitle.textContent = "Video Preview";
        elements.videoChannel.textContent = "YouTube";
        elements.videoLink.href = `https://www.youtube.com/watch?v=${videoId}`;
        elements.videoPreview.classList.remove('hidden');
    }
}

function markdownToHtml(markdown) {
    let html = markdown;

    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    html = html.split('\n\n').map(para => {
        para = para.trim();
        if (!para) return '';
        if (para.startsWith('<h')) return para;
        return '<p>' + para.replace(/\n/g, '<br>') + '</p>';
    }).join('\n');

    return html;
}

function updateStatistics(content) {
    const plain = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    const words = plain ? plain.split(' ').length : 0;
    const chars = plain.length;
    const headings = (content.match(/<h[1-3]>/g) || []).length;

    // Calculate reading time in seconds
    const totalSeconds = Math.ceil((words / 200) * 60);

    let readingTimeDisplay = "0 sec";

    if (totalSeconds < 60) {
        readingTimeDisplay = `${totalSeconds} sec`;
    } else if (totalSeconds < 3600) {
        const minutes = Math.floor(totalSeconds / 60);
        readingTimeDisplay = `${minutes} min`;
    } else {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        readingTimeDisplay = `${hours} hr ${minutes} min`;
    }

    elements.wordCount.textContent = words;
    elements.readingTime.textContent = readingTimeDisplay;
    elements.charCount.textContent = chars;
    elements.headingCount.textContent = headings;
}

function copyToClipboard(text, button) {
    if (!text) {
        showError("No content to copy");
        return;
    }

    // Modern clipboard API (works on HTTPS / localhost)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => showCopySuccess(button))
            .catch(() => fallbackCopy(text, button));
    } else {
        fallbackCopy(text, button);
    }
}

function fallbackCopy(text, button) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        document.execCommand("copy");
        showCopySuccess(button);
    } catch (err) {
        showError("Failed to copy to clipboard");
    }

    document.body.removeChild(textarea);
}

function showCopySuccess(button) {
    const originalHTML = button.innerHTML;

    button.innerHTML = "✓ Copied!";
    button.classList.add("copy-success");

    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove("copy-success");
    }, 2000);
}

async function convertVideo() {
    const url = elements.youtubeUrl.value.trim();

    if (!url) {
        showError("Please enter a YouTube URL");
        return;
    }

    const videoId = extractVideoId(url);

    if (!videoId) {
        showError("Invalid YouTube URL");
        return;
    }

    hideError();
    currentVideoId = videoId;

    await showVideoPreview(videoId);

    elements.loadingState.classList.remove('hidden');
    elements.blogPostSection.classList.add('hidden');
    elements.convertBtn.disabled = true;

    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                videoId: videoId,
                title: elements.videoTitle.textContent
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Backend error");
        }

        const data = await response.json();
        const blogPostMarkdown = data.blog;

        const blogPostHtml = markdownToHtml(blogPostMarkdown);

        currentBlogPost.markdown = blogPostMarkdown;
        currentBlogPost.html = blogPostHtml;
        currentBlogPost.plainText = blogPostHtml.replace(/<[^>]*>/g, '');

        elements.blogContent.innerHTML = blogPostHtml;
        updateStatistics(blogPostHtml);

        elements.loadingState.classList.add('hidden');
        elements.blogPostSection.classList.remove('hidden');

    } catch (error) {
        showError(error.message);
        elements.loadingState.classList.add('hidden');
    } finally {
        elements.convertBtn.disabled = false;
    }
}

elements.convertBtn.addEventListener('click', convertVideo);

elements.youtubeUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') convertVideo();
});

elements.copyBtn.addEventListener("click", () => {
    if (!currentBlogPost.plainText) {
        showError("No content to copy");
        return;
    }
    copyToClipboard(currentBlogPost.plainText, elements.copyBtn);
});

elements.copyHtmlBtn.addEventListener("click", () => {
    if (!currentBlogPost.html) {
        showError("No content to copy");
        return;
    }
    copyToClipboard(currentBlogPost.html, elements.copyHtmlBtn);
});
