import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Motagua vs Génesis FC | Jornada 7",

  description:
    "Toda la previa de Motagua vs Génesis FC por la Jornada 7 de la Liga Nacional. Sábado 12 de septiembre de 2026 a las 7:00 PM en el Estadio Carlos Miranda de Comayagua.",

  alternates: {
    canonical: "/partidos/motagua-vs-genesis",
  },

  openGraph: {
    type: "website",
    locale: "es_HN",
    url: "/partidos/motagua-vs-genesis",
    siteName: "Génesis FC",
    title: "Motagua vs Génesis FC | Jornada 7",
    description:
      "Génesis FC enfrenta a Motagua este 12 de septiembre a las 7:00 PM en el Estadio Carlos Miranda de Comayagua.",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Motagua vs Génesis FC - Jornada 7",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Motagua vs Génesis FC | Jornada 7",
    description:
      "Toda la previa del partido entre Motagua y Génesis FC en el Estadio Carlos Miranda de Comayagua.",
    images: ["/opengraph-image.jpg"],
  },
};

export default function MotaguaVsGenesisLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}