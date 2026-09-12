import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://www.genesisfc.app"
  ),

  title: {
    default:
      "Génesis FC | Sitio Oficial",

    template:
      "%s | Génesis FC",
  },

  description:
    "Sitio oficial de Génesis FC de La Paz, Honduras. Noticias, partidos, calendario, clasificación, plantilla, historia y Tienda Oficial de Los Caninos.",

  applicationName:
    "Génesis FC",

  category:
    "sports",

  keywords: [
    "Génesis FC",
    "Genesis FC",
    "Génesis de La Paz",
    "Los Caninos",
    "Génesis FC Honduras",
    "Génesis FC La Paz",
    "fútbol Honduras",
    "Liga Nacional de Honduras",
    "La Paz Honduras",
    "fútbol hondureño",
    "calendario Génesis FC",
    "plantilla Génesis FC",
    "Tienda Génesis FC",
  ],

  authors: [
    {
      name: "Génesis FC",
    },
  ],

  creator:
    "Génesis FC",

  publisher:
    "Génesis FC",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",

    locale: "es_HN",

    url:
      "https://www.genesisfc.app",

    siteName:
      "Génesis FC",

    title:
      "Génesis FC | Sitio Oficial",

    description:
      "Sitio oficial de Génesis FC de La Paz, Honduras. Noticias, partidos, calendario, clasificación, plantilla, historia y Tienda Oficial.",

    images: [
      {
        url:
          "/opengraph-image.jpg",

        width: 1200,

        height: 630,

        alt:
          "Génesis FC - Sitio Oficial",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Génesis FC | Sitio Oficial",

    description:
      "Sitio oficial de Génesis FC de La Paz, Honduras. Noticias, partidos, calendario, clasificación, plantilla, historia y Tienda Oficial.",

    images: [
      "/opengraph-image.jpg",
    ],
  },

  robots: {
    index: true,

    follow: true,

    googleBot: {
      index: true,

      follow: true,

      "max-image-preview":
        "large",

      "max-snippet": -1,

      "max-video-preview":
        -1,
    },
  },

  referrer:
    "origin-when-cross-origin",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-HN">
      <body>
        {children}
      </body>
    </html>
  );
}