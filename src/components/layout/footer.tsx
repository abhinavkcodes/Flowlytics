export function Footer() {
  return (
    <footer
      className="mt-auto px-6 py-8 text-center text-sm"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        color: "#3d4a63",
      }}
    >
      © {new Date().getFullYear()} Flowlytics. All rights reserved.
    </footer>
  );
}