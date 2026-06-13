"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled application error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--bg)] px-6 text-center">
      <div className="text-4xl">⚠️</div>
      <div>
        <h1 className="font-display text-2xl font-extrabold text-[var(--text)]">
          Something went wrong
        </h1>
        <p className="mt-2 font-mono text-sm text-[var(--text-mid)]">
          {error.message || "An unexpected error occurred."}
        </p>
      </div>
      <button onClick={reset} className="btn-primary">
        Try again
      </button>
    </div>
  );
}