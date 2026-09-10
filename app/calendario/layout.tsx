import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendario y Clasificación",

  description:
    "Consulta el calendario, próximos partidos, resultados y clasificación de Génesis FC en la temporada 2026/27 de la Liga Nacional de Honduras.",

  alternates: {
    canonical: "/calendario",
  },

  openGraph: {
    type: "website",
    locale: "es_HN",
    url: "/calendario",
    siteName: "Génesis FC",
    title: "Calendario y Clasificación | Génesis FC",
    description:
      "Partidos, resultados y clasificación de Génesis FC durante la temporada 2026/27.",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Calendario y clasificación de Génesis FC",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Calendario y Clasificación | Génesis FC",
    description:
      "Consulta los próximos partidos, resultados y clasificación de Génesis FC.",
    images: ["/opengraph-image.jpg"],
  },
};

export default function CalendarioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}