import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://upackb2b.uz";

  // Static routes
  const routes = [
    "",
    "/katalog",
    "/favorites",
    "/cart",
    "/about",
    "/delivery",
    "/privacy",
    "/yordam",
    "/login",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Fetch dynamic categories
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: categories } = await supabase.from("categories").select("id");

    if (categories) {
      const categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/katalog?category=${cat.id}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
      return [...routes, ...categoryRoutes];
    }
  } catch (e) {
    console.error("Error generating dynamic sitemap:", e);
  }

  return routes;
}
