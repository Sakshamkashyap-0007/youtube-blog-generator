export default function VideoPreview({ meta }) {
  return (
    <section className="preview-card">
      <img alt="" src={meta.thumbnail} />
      <div>
        <p className="card-kicker">Video found</p>
        <h2>{meta.title}</h2>
        <p>{meta.author}</p>
      </div>
    </section>
  );
}
