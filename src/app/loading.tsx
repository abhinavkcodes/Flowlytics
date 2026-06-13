export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
      <div className="flex flex-col items-center gap-4">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          style={{ animation: "spinSlow 1s linear infinite" }}
        >
          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.12)" strokeWidth="3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="font-mono text-xs tracking-widest text-[var(--text-dim)]">LOADING</p>
      </div>
    </div>
  );
}