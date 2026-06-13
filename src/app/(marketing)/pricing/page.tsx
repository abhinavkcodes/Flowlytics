export default function PricingPage() {
  return (
    <main className="container mx-auto py-20">
      <h1 className="text-4xl font-bold">Pricing</h1>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="text-2xl font-semibold">Free</h2>
          <p className="mt-2 text-muted-foreground">
            Perfect for individual developers.
          </p>

          <ul className="mt-4 space-y-2">
            <li>✓ GitHub Analytics</li>
            <li>✓ Repository Insights</li>
            <li>✓ Contribution Tracking</li>
          </ul>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-2xl font-semibold">Pro</h2>
          <p className="mt-2 text-muted-foreground">
            Advanced analytics and AI insights.
          </p>

          <ul className="mt-4 space-y-2">
            <li>✓ Everything in Free</li>
            <li>✓ AI Recommendations</li>
            <li>✓ Advanced Reports</li>
            <li>✓ Developer Wrapped</li>
          </ul>
        </div>
      </div>
    </main>
  );
}