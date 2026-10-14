import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://restockb2b.uz";

  // Static routes
  const routes = [
    { route: "", priority: 1.0, changeFrequency: "daily" as const },
    { route: "/katalog", priority: 0.95, changeFrequency: "daily" as const },
    { route: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { route: "/delivery", priority: 0.7, changeFrequency: "monthly" as const },
    { route: "/yordam", priority: 0.7, changeFrequency: "monthly" as const },
    { route: "/privacy", priority: 0.5, changeFrequency: "yearly" as const },
  ].map((item) => ({
    url: `${baseUrl}${item.route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  // Fetch dynamic categories and products
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Fetch categories
    const { data: categories } = await supabase.from("categories").select("id");
    let dynamicRoutes: any[] = [];

    if (categories) {
      dynamicRoutes = categories.map((cat) => ({
        url: `${baseUrl}/katalog?category=${cat.id}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }

    // Fetch products
    const { data: products } = await supabase.from("products").select("id, updated_at");
    if (products) {
      const productRoutes = products.map((prod) => ({
        url: `${baseUrl}/mahsulot/${prod.id}`,
        lastModified: prod.updated_at ? new Date(prod.updated_at).toISOString() : new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }));
      dynamicRoutes = [...dynamicRoutes, ...productRoutes];
    }

    return [...routes, ...dynamicRoutes];
  } catch (e) {
    console.error("Error generating dynamic sitemap:", e);
  }

  return routes;
}
