export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Flowlytics. All rights reserved.
      </div>
    </footer>
  );
}