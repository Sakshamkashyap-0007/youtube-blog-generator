export default function URLInput({ error, loading, onChange, onConvert, value }) {
  function handleSubmit(event) {
    event.preventDefault();
    onConvert();
  }

  return (
    <form className="url-card" onSubmit={handleSubmit}>
      <div>
        <p className="card-kicker">Start here</p>
        <label htmlFor="youtube-url">Paste your YouTube video URL</label>
      </div>
      <div className="input-row">
        <input
          id="youtube-url"
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          type="url"
          value={value}
        />
        <button disabled={loading} type="submit">
          {loading ? "Working..." : "Generate Blog"}
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
}
