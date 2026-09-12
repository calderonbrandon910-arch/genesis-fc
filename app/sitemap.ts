import type { MetadataRoute } from "next";

import { jugadores } from "../lib/datos-plantel";

import {
  noticiasOrdenadas,
} from "../lib/datos-noticias";

import {
  productosTienda,
} from "../lib/datos-tienda";

/* =========================================================
   CONFIGURACIÓN
========================================================= */

const BASE_URL =
  "https://www.genesisfc.app";

/* =========================================================
   SITEMAP
========================================================= */

export default function sitemap(): MetadataRoute.Sitemap {
  /* =======================================================
     PÁGINAS PRINCIPALES
  ======================================================= */

  const paginasPrincipales:
    MetadataRoute.Sitemap = [
    {
      url: BASE_URL,

      lastModified:
        new Date(),

      changeFrequency:
        "daily",

      priority: 1,
    },

    {
      url:
        `${BASE_URL}/equipo`,

      lastModified:
        new Date(),

      changeFrequency:
        "weekly",

      priority: 0.9,
    },

    {
      url:
        `${BASE_URL}/calendario`,

      lastModified:
        new Date(),

      changeFrequency:
        "weekly",

      priority: 0.9,
    },

    {
      url:
        `${BASE_URL}/historia`,

      lastModified:
        new Date(),

      changeFrequency:
        "monthly",

      priority: 0.8,
    },

    {
      url:
        `${BASE_URL}/tienda`,

      lastModified:
        new Date(),

      changeFrequency:
        "weekly",

      priority: 0.9,
    },

    {
      url:
        `${BASE_URL}/partidos/motagua-vs-genesis`,

      lastModified:
        new Date(),

      changeFrequency:
        "daily",

      priority: 0.85,
    },
  ];

  /* =======================================================
     PERFILES DEL PRIMER EQUIPO
  ======================================================= */

  const perfiles:
    MetadataRoute.Sitemap =
    jugadores.map(
      (jugador) => ({
        url:
          `${BASE_URL}${jugador.enlace}`,

        lastModified:
          new Date(),

        changeFrequency:
          "monthly" as const,

        priority:
          0.7,
      })
    );

  /* =======================================================
     NOTICIAS

     Se generan automáticamente desde datos-noticias.ts
  ======================================================= */

  const noticias:
    MetadataRoute.Sitemap =
    noticiasOrdenadas.map(
      (noticia) => ({
        url:
          `${BASE_URL}${noticia.enlace}`,

        lastModified:
          new Date(
            noticia.fechaISO
          ),

        changeFrequency:
          "monthly" as const,

        priority:
          0.8,
      })
    );

  /* =======================================================
     PRODUCTOS DE LA TIENDA

     No incluimos:
     - carrito
     - checkout
     - seguimiento
     - admin

     porque son páginas funcionales, no contenido
     destinado a posicionamiento.
  ======================================================= */

  const productos:
    MetadataRoute.Sitemap =
    productosTienda.map(
      (producto) => ({
        url:
          `${BASE_URL}${producto.enlace}`,

        lastModified:
          new Date(),

        changeFrequency:
          "weekly" as const,

        priority:
          0.8,
      })
    );

  /* =======================================================
     RESULTADO
  ======================================================= */

  return [
    ...paginasPrincipales,
    ...perfiles,
    ...noticias,
    ...productos,
  ];
}