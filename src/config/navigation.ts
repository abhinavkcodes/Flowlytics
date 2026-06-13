import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Zap,
  Brain,
  Package,
  GitPullRequest,
  Sparkles,
  TrendingUp,
  Gift,
  Settings,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export const dashboardNav: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "productivity", label: "Productivity", href: "/dashboard/productivity", icon: Zap },
  { id: "habits", label: "Habits", href: "/dashboard/habits", icon: Brain },
  { id: "repositories", label: "Repositories", href: "/dashboard/repositories", icon: Package },
  { id: "pull-requests", label: "Pull Requests", href: "/dashboard/pull-requests", icon: GitPullRequest },
  { id: "insights", label: "AI Insights", href: "/dashboard/insights", icon: Sparkles },
  { id: "growth", label: "Growth", href: "/dashboard/growth", icon: TrendingUp },
  { id: "wrapped", label: "Wrapped", href: "/dashboard/wrapped", icon: Gift },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const marketingNav = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];