export default function CallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center"
      style={{ background: "#03050a" }}>
      <div className="flex flex-col items-center gap-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
          style={{ animation: "spin 1s linear infinite" }}>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.08)" strokeWidth="3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="text-sm" style={{ color: "#8892aa" }}>Signing you in...</p>
      </div>
    </div>
  );
}