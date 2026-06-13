export const dashboardConfig = {
  defaultDateRange: 365, // days
  heatmapWeeks: 53,
  charts: {
    monthlyTrend: { months: 12 },
    hourlyActivity: { hours: 24 },
    weeklyActivity: { days: 7 },
  },
  pagination: {
    repositoriesPerPage: 10,
    pullRequestsPerPage: 15,
    insightsPerPage: 6,
  },
};