"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-gray-500">{error.message}</p>
        <button
          onClick={() => reset()}
          className="mt-4 rounded border px-4 py-2"
        >
          Try again
        </button>
      </div>
    </main>
  );
}