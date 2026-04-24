export default function LoadingCard({ message }) {
  return (
    <section className="loading-card" aria-live="polite">
      <span className="spinner" />
      <p>{message}</p>
    </section>
  );
}
