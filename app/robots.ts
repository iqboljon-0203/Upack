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
    sitemap: "https://restock.uz/sitemap.xml",
    host: "https://restock.uz",
  };
}
