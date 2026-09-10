import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Primer Equipo",

  description:
    "Conoce la plantilla de Génesis FC para la temporada 2026/27. Porteros, defensas, mediocampistas, delanteros y perfiles de los jugadores que representan a La Paz.",

  alternates: {
    canonical: "/equipo",
  },

  openGraph: {
    type: "website",
    locale: "es_HN",
    url: "/equipo",
    siteName: "Génesis FC",
    title: "Primer Equipo | Génesis FC",
    description:
      "Conoce a los jugadores que representan a Génesis FC y defienden el orgullo de La Paz en cada partido.",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Primer Equipo de Génesis FC",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Primer Equipo | Génesis FC",
    description:
      "Conoce la plantilla y los jugadores de Génesis FC para la temporada 2026/27.",
    images: ["/opengraph-image.jpg"],
  },
};

export default function EquipoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}