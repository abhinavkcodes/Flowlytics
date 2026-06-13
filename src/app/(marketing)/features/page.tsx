export default function FeaturesPage() {
  const features = [
    "GitHub Analytics Dashboard",
    "Repository Insights",
    "Pull Request Tracking",
    "Contribution Growth Reports",
    "Developer Productivity Metrics",
    "AI-Powered Recommendations",
    "Habit & Streak Monitoring",
    "Yearly Developer Wrapped",
  ];

  return (
    <main className="container mx-auto py-20">
      <h1 className="text-4xl font-bold">Features</h1>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature}
            className="rounded-lg border p-4"
          >
            {feature}
          </div>
        ))}
      </div>
    </main>
  );
}