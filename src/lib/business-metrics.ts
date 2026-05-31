import type { Business } from "@/data/businesses";

export function getProfileCompletion(b: Business) {
  let score = 0;
  if (b.logoUrl) score += 10;
  if (b.description) score += 10;
  if (b.website) score += 10;
  if (b.country && b.city) score += 10;
  const socials = b.social ?? {};
  const socialCount = Object.values(socials).filter(Boolean).length;
  if (socialCount > 0) score += 20;
  return Math.min(score, 100);
}

export function getAiReadinessScore(b: Business) {
  let score = 0;
  if (b.website) score += 20;
  const socials = b.social ?? {};
  if (Object.values(socials).some(Boolean)) score += 15;
  if (b.size === "11-50" || b.size === "51-200" || b.size === "200+") score += 20;
  const challenges = b.challenges ?? [];
  if (challenges.includes("AI Adoption")) score += 25;
  if (challenges.includes("Automation")) score += 20;
  return Math.min(score, 100);
}
