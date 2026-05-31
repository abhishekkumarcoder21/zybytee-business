import type { User } from "@supabase/supabase-js";
import { BUSINESSES, type Business } from "@/data/businesses";
import { getSupabaseClient, isSupabaseConfigured } from "./client";

export type BusinessRow = {
  id: string;
  owner_id: string;
  business_name: string;
  slug: string;
  logo_url: string | null;
  founder_name: string;
  business_email: string | null;
  industry: string;
  category: string;
  description: string;
  website: string;
  country: string;
  state: string | null;
  city: string;
  company_size: string;
  created_at: string;
  updated_at: string;
  business_challenges?: { challenge_name: string }[] | null;
  social_links?:
    | {
        linkedin: string | null;
        instagram: string | null;
        x: string | null;
        youtube: string | null;
        facebook: string | null;
      }
    | {
        linkedin: string | null;
        instagram: string | null;
        x: string | null;
        youtube: string | null;
        facebook: string | null;
      }[]
    | null;
};

const GRADIENTS: [string, string][] = [
  ["#67E8F9", "#3B82F6"],
  ["#A78BFA", "#EC4899"],
  ["#5EEAD4", "#0EA5E9"],
  ["#60A5FA", "#7C3AED"],
  ["#FCD34D", "#F97316"],
  ["#7DD3FC", "#6366F1"],
];

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickGradient(seed: string): [string, string] {
  const idx = hashString(seed) % GRADIENTS.length;
  return GRADIENTS[idx];
}

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function mapBusiness(row: BusinessRow): Business {
  const socialRaw = row.social_links as BusinessRow["social_links"] | BusinessRow["social_links"][] | null;
  const social = Array.isArray(socialRaw) ? socialRaw[0] ?? null : socialRaw;
  return {
    id: row.id,
    slug: row.slug,
    name: row.business_name,
    initials: initialsFromName(row.business_name),
    industry: row.industry,
    category: row.category,
    country: row.country,
    city: row.city,
    state: row.state ?? undefined,
    size: row.company_size as Business["size"],
    founded: new Date(row.created_at).getFullYear(),
    website: row.website,
    founder: row.founder_name,
    founderTitle: "Founder",
    description: row.description,
    challenges: row.business_challenges?.map((c) => c.challenge_name) ?? [],
    social: social ?? {},
    gradient: pickGradient(row.slug),
    logoUrl: row.logo_url,
  };
}

export async function fetchBusinesses() {
  if (!isSupabaseConfigured()) return BUSINESSES;
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("businesses")
    .select(
      "id, owner_id, business_name, slug, logo_url, founder_name, business_email, industry, category, description, website, country, state, city, company_size, created_at, updated_at, business_challenges(challenge_name), social_links(linkedin, instagram, x, youtube, facebook)",
    )
    .order("created_at", { ascending: false });
  if (error || !data) return BUSINESSES;
  return data.map(mapBusiness);
}

export async function fetchBusinessBySlug(slug: string) {
  if (!isSupabaseConfigured()) return BUSINESSES.find((b) => b.slug === slug) ?? null;
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("businesses")
    .select(
      "id, owner_id, business_name, slug, logo_url, founder_name, business_email, industry, category, description, website, country, state, city, company_size, created_at, updated_at, business_challenges(challenge_name), social_links(linkedin, instagram, x, youtube, facebook)",
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return mapBusiness(data as BusinessRow);
}

export async function fetchMyBusiness(userId: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("businesses")
    .select(
      "id, owner_id, business_name, slug, logo_url, founder_name, business_email, industry, category, description, website, country, state, city, company_size, created_at, updated_at, business_challenges(challenge_name), social_links(linkedin, instagram, x, youtube, facebook)",
    )
    .eq("owner_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return mapBusiness(data as BusinessRow);
}

export function toSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function uploadLogo(file: File, businessId: string) {
  const supabase = getSupabaseClient();
  const ext = file.name.split(".").pop() || "png";
  const path = `businesses/${businessId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("business-logos").upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("business-logos").getPublicUrl(path);
  return data.publicUrl;
}

export async function createBusinessProfile(user: User, payload: {
  businessName: string;
  founderName: string;
  email: string;
  website: string;
  industry: string;
  category: string;
  description: string;
  country: string;
  state: string;
  city: string;
  size: string;
  challenges: string[];
  linkedin: string;
  instagram: string;
  x: string;
  youtube: string;
  facebook: string;
  logoFile?: File | null;
}) {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseClient();
  const slug = toSlug(payload.businessName);

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .insert({
      owner_id: user.id,
      business_name: payload.businessName,
      slug,
      founder_name: payload.founderName,
      business_email: payload.email,
      industry: payload.industry,
      category: payload.category,
      description: payload.description,
      website: payload.website || null,
      country: payload.country,
      state: payload.state || null,
      city: payload.city,
      company_size: payload.size,
    })
    .select("id")
    .single();

  if (businessError) throw businessError;
  const businessId = business.id as string;

  if (payload.logoFile) {
    const logoUrl = await uploadLogo(payload.logoFile, businessId);
    await supabase.from("businesses").update({ logo_url: logoUrl }).eq("id", businessId);
  }

  if (payload.challenges.length) {
    await supabase.from("business_challenges").insert(
      payload.challenges.map((c) => ({ business_id: businessId, challenge_name: c })),
    );
  }

  await supabase.from("social_links").insert({
    business_id: businessId,
    linkedin: payload.linkedin || null,
    instagram: payload.instagram || null,
    x: payload.x || null,
    youtube: payload.youtube || null,
    facebook: payload.facebook || null,
  });

  return businessId;
}

export async function deleteBusiness(businessId: string) {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseClient();
  await supabase.from("businesses").delete().eq("id", businessId);
}
