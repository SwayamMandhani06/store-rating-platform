export default function StarRating({ value = 0, onChange, interactive = false, size = 'text-lg' }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className={`inline-flex gap-0.5 ${size}`}>
      {stars.map((n) => (
        <span
          key={n}
          onClick={() => interactive && onChange && onChange(n)}
          className={
            n <= Math.round(value)
              ? 'text-amber-400'
              : 'text-slate-300'
          }
          style={interactive ? { cursor: 'pointer' } : undefined}
        >
          ★
        </span>
      ))}
    </span>
  );
}
