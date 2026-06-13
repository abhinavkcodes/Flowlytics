/**
 * Centralized weights & thresholds used across analytics scoring engines.
 * Keeping these in one place lets product tune scoring without touching logic.
 */

export const consistencyConfig = {
  // Max streak (days) considered for normalizing the score to 0-100
  maxStreakForFullScore: 60,
  // Minimum active days per week to avoid penalty
  minActiveDaysPerWeek: 3,
};

export const healthScoreConfig = {
  weights: {
    commitFrequency: 0.3,
    recency: 0.2,
    starsGrowth: 0.15,
    issueResponsiveness: 0.15,
    documentation: 0.1,
    testCoverage: 0.1,
  },
  recencyDecayDays: 90, // repos untouched > this get penalized
};

export const prQualityConfig = {
  weights: {
    mergeRate: 0.35,
    avgCycleTimeHours: 0.25,
    reviewDepth: 0.2,
    prSizeHealth: 0.2,
  },
  idealCycleTimeHours: 48,
  idealPrSizeLines: 300,
};

export const growthConfig = {
  categories: {
    frontend: ["TypeScript", "JavaScript", "CSS", "HTML", "Vue", "Svelte"],
    backend: ["Go", "Rust", "Python", "Java", "Ruby", "C#", "Elixir"],
    devops: ["Dockerfile", "HCL", "Shell", "YAML"],
  },
  lookbackMonths: 12,
};