import Link from "next/link";
import { marketingNav } from "@/config/navigation";

export function MarketingNavbar() {
  return (
    <div className="floating-nav left-0 right-0 top-5 flex justify-center px-4">
      <nav
        className="flex h-[54px] w-full max-w-[760px] items-center justify-between rounded-full pl-5 pr-2"
        style={{
          background: "rgba(18,20,30,.6)",
          border: "1px solid rgba(255,255,255,.09)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          boxShadow: "0 8px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.06)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-[8px] text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg,#1d4ed8,#7c3aed)" }}
          >
            F
          </div>
          <span className="font-display text-[15px] font-bold tracking-tight text-text">Flowlytics</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-[13px] font-medium text-text-mid transition-colors hover:bg-white/[0.06] hover:text-text"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/sign-in"
          className="flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.04]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Get Started <span className="text-[10px]">→</span>
        </Link>
      </nav>
    </div>
  );
}