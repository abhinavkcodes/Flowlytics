import { MarketingNavbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingNavbar />
      <div className="relative min-h-screen overflow-hidden bg-bg grid-bg">
        <main className="relative z-10">{children}</main>
        <Footer />
      </div>
    </>
  );
}