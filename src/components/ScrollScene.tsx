export function ScrollScene({ dim = 0 }: { dim?: number }) {
  return (
    <div className="star-scene pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="golden-haze golden-haze-left" />
      <div className="golden-haze golden-haze-right" />
      <div className="star-field star-field-far" />
      <div className="star-field star-field-mid" />
      <div className="star-field star-field-near" />
      <div className="star-sheen" />
      <div className="absolute inset-0 bg-ink" style={{ opacity: dim }} />
    </div>
  );
}
