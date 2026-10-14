import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/profile",
          "/cart",
          "/checkout",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/profile",
          "/cart",
          "/checkout",
        ],
      },
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/profile",
          "/cart",
          "/checkout",
        ],
      },
    ],
    sitemap: "https://restockb2b.uz/sitemap.xml",
    host: "https://restockb2b.uz",
  };
}
