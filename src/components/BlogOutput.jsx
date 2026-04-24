export default function BlogOutput({ html, markdown, stats }) {
  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
  }

  function downloadMarkdown() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "youtube-blog-post.md";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="output-card">
      <div className="output-header">
        <div>
          <p className="eyebrow">Generated blog post</p>
          <h2>{stats.words} words</h2>
          <p>{stats.minutes} min read</p>
        </div>
        <div className="action-row">
          <button onClick={copyMarkdown} type="button">
            Copy
          </button>
          <button onClick={downloadMarkdown} type="button">
            Download
          </button>
        </div>
      </div>
      <article className="blog-preview" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
