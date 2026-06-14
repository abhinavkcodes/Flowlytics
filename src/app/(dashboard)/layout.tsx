import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const NAV = [
  { icon: "◈", label: "Dashboard", href: "/dashboard" },
  { icon: "⚡", label: "Productivity", href: "/dashboard/productivity" },
  { icon: "🧠", label: "Habits", href: "/dashboard/habits" },
  { icon: "📦", label: "Repositories", href: "/dashboard/repositories" },
  { icon: "🔀", label: "Pull Requests", href: "/dashboard/pull-requests" },
  { icon: "✦", label: "AI Insights", href: "/dashboard/insights" },
  { icon: "📈", label: "Growth", href: "/dashboard/growth" },
  { icon: "🎁", label: "Wrapped", href: "/dashboard/wrapped" },
  { icon: "⚙", label: "Settings", href: "/dashboard/settings" },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  return (
    <div className="flex min-h-screen bg-[#03050a]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col"
        style={{ background: "#080d18", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 px-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg,#1d4ed8,#7c3aed)" }}>F</div>
          <span className="text-sm font-bold text-white">Flowlytics</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-item"
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User */}
        {session.user && (
          <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
              {session.user.image && (
               <Image src={session.user.image} alt="" width={28} height={28} className="rounded-full" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-white">{session.user.name}</p>
                <p className="truncate text-[10px] text-[#3d4a63]">{session.user.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1 min-h-screen">
        {children}
      </main>
    </div>
  );
}