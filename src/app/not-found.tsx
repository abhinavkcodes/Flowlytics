import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--bg)] px-6 text-center">
      <p className="font-display text-7xl font-black tracking-tight text-[var(--text)]">404</p>
      <div>
        <h1 className="font-display text-xl font-bold text-[var(--text)]">Page not found</h1>
        <p className="mt-2 font-mono text-sm text-[var(--text-mid)]">
          We couldn&apos;t find that page.
        </p>
      </div>
      <Link href="/" className="btn-primary">
        Back to home
      </Link>
    </div>
  );
}