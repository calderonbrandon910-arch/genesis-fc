import type { MetadataRoute } from "next";

/* =========================================================
   ROBOTS.TXT — GÉNESIS FC
========================================================= */

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    "https://www.genesisfc.app";

  return {
    rules: [
      {
        userAgent: "*",

        allow: "/",

        disallow: [
          "/admin/",
          "/api/",
          "/tienda/carrito",
          "/tienda/checkout",
          "/tienda/seguimiento",
        ],
      },
    ],

    sitemap:
      `${baseUrl}/sitemap.xml`,

    host:
      baseUrl,
  };
}