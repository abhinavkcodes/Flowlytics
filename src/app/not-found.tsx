"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Flowlytics Error]", error.message, error.digest);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center"
      style={{ background: "#03050a" }}>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
        style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)" }}>
        ⚠️
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
        <p className="mt-2 text-sm" style={{ color: "#8892aa", fontFamily: "monospace" }}>
          {error.message || "An unexpected error occurred."}
        </p>
      </div>
      <button
        onClick={reset}
        className="rounded-xl px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
      >
        Try again
      </button>
    </div>
  );
}