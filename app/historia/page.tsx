import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  historia2025,
  historia2026,
  type MomentoHistoria,
} from "../../lib/datos-historia";

/* =========================================================
   METADATA
========================================================= */

export const metadata: Metadata = {
  title: "Nuestra Historia",

  description:
    "Conoce la nueva etapa de Génesis FC en La Paz, desde mayo de 2025 hasta la actualidad.",

  alternates: {
    canonical: "/historia",
  },

  openGraph: {
    title: "Nuestra Historia | Génesis FC",

    description:
      "La historia de la nueva etapa de Génesis FC en La Paz, desde mayo de 2025 hasta la actualidad.",

    url: "https://www.genesisfc.app/historia",

    siteName: "Génesis FC",

    type: "website",

    locale: "es_HN",

    images: [
      {
        url: "/opengraph-image.jpg",

        width: 1200,

        height: 630,

        alt: "Nuestra Historia | Génesis FC",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Nuestra Historia | Génesis FC",

    description:
      "Desde mayo de 2025, Génesis FC escribe una nueva etapa desde La Paz.",

    images: ["/opengraph-image.jpg"],
  },
};

/* =========================================================
   CAPÍTULO
========================================================= */

function Capitulo({
  momento,
  invertido = false,
}: {
  momento: MomentoHistoria;
  invertido?: boolean;
}) {
  return (
    <article
      id={momento.id}
      className="scroll-mt-28 border-t border-black/[0.08] py-12 sm:py-16 lg:py-24"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
        {/* =================================================
            IMAGEN
        ================================================= */}

        <div
          className={`lg:col-span-7 ${
            invertido
              ? "lg:order-2"
              : "lg:order-1"
          }`}
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-[#06142d] sm:aspect-[16/9]">
            <Image
              src={momento.imagen}
              alt={momento.alt}
              fill
              sizes="(max-width:1024px) 100vw,60vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#020817]/45 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 p-5 sm:p-7">
              <p className="text-[7px] font-black uppercase tracking-[0.24em] text-white/75">
                Archivo Génesis FC
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            CONTENIDO
        ================================================= */}

        <div
          className={`flex h-full flex-col lg:col-span-5 ${
            invertido
              ? "lg:order-1"
              : "lg:order-2"
          }`}
        >
          <div className="flex items-center justify-between border-b border-black/10 pb-5">
            <p className="text-[8px] font-black uppercase tracking-[0.26em] text-[#168cab]">
              {momento.fecha}
            </p>

            <p className="text-[8px] font-black tracking-[0.14em] text-black/20">
              {momento.numero}
            </p>
          </div>

          <div className="flex flex-1 flex-col justify-center py-7 lg:py-10">
            <p className="text-[7px] font-black uppercase tracking-[0.22em] text-black/35">
              {momento.subtitulo}
            </p>

            <h3 className="mt-4 text-[2.55rem] font-black uppercase leading-[0.88] tracking-[-0.055em] text-[#06142d] sm:text-[3.8rem] lg:text-[4.5rem]">
              {momento.titulo}

              <span className="text-[#168cab]">
                .
              </span>
            </h3>

            <div className="mt-7 space-y-5">
              {momento.texto.map(
                (parrafo) => (
                  <p
                    key={parrafo}
                    className="text-[13px] leading-7 text-black/55 sm:text-[15px] sm:leading-8"
                  >
                    {parrafo}
                  </p>
                )
              )}
            </div>

            <blockquote className="mt-8 border-l-2 border-[#168cab] pl-5">
              <p className="text-sm font-black leading-6 text-[#06142d] sm:text-base sm:leading-7">
                {momento.frase}
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   PÁGINA
========================================================= */

export default function HistoriaPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#06142d]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#020817]/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-[1700px] items-center justify-between px-4 sm:h-[82px] sm:px-8 lg:px-12 xl:px-16">
          <Link
            href="/"
            aria-label="Ir al inicio de Génesis FC"
            className="flex items-center gap-3 sm:gap-4"
          >
            <div className="relative h-11 w-11 sm:h-14 sm:w-14">
              <Image
                src="/genesis.jpg"
                alt="Escudo de Génesis FC"
                fill
                priority
                sizes="56px"
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-[-0.02em] sm:text-lg">
                Génesis FC
              </p>

              <p className="mt-1 text-[6px] font-black uppercase tracking-[0.25em] text-cyan-300">
                Sitio oficial
              </p>
            </div>
          </Link>

          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-8 lg:flex"
          >
            <Link
              href="/"
              className="text-[8px] font-black uppercase tracking-[0.18em] text-white/45 transition hover:text-white"
            >
              Inicio
            </Link>

            <Link
              href="/equipo"
              className="text-[8px] font-black uppercase tracking-[0.18em] text-white/45 transition hover:text-white"
            >
              Equipo
            </Link>

            <Link
              href="/calendario"
              className="text-[8px] font-black uppercase tracking-[0.18em] text-white/45 transition hover:text-white"
            >
              Calendario
            </Link>

            <span className="text-[8px] font-black uppercase tracking-[0.18em] text-cyan-300">
              Historia
            </span>
          </nav>

          <Link
            href="/"
            className="rounded-full border border-white/15 px-4 py-3 text-[7px] font-black uppercase tracking-[0.14em] transition hover:bg-white hover:text-[#06142d] sm:px-6"
          >
            ← Inicio
          </Link>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative min-h-[88svh] overflow-hidden bg-[#020817] pt-[70px] text-white sm:min-h-screen sm:pt-[82px]">
        <Image
          src="/hero-genesis.jpg"
          alt="Génesis FC"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center]"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-[#020817]/88 to-[#031936]/25" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-[#020817]/45" />

        <div className="relative mx-auto flex min-h-[calc(88svh-70px)] max-w-[1700px] items-end px-5 pb-14 sm:min-h-[calc(100vh-82px)] sm:px-8 sm:pb-20 lg:px-12 xl:px-16">
          <div className="w-full">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-cyan-300" />

              <p className="text-[7px] font-black uppercase tracking-[0.32em] text-cyan-300 sm:text-[9px]">
                La Paz · Honduras
              </p>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-white/35">
                  Mayo 2025 — Presente
                </p>

                <h1 className="mt-4 text-[4rem] font-black uppercase leading-[0.76] tracking-[-0.075em] sm:text-[6.5rem] lg:text-[8rem] xl:text-[9.5rem]">
                  Nuestra
                  <br />
                  historia
                  <span className="text-cyan-300">
                    .
                  </span>
                </h1>
              </div>

              <div className="border-t border-white/20 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                <p className="text-sm leading-7 text-white/55">
                  Una etapa joven, construida partido a partido desde La Paz.
                  Esta es la historia que comenzó en 2025 y que todavía estamos
                  viviendo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section
        id="origen"
        className="scroll-mt-28 bg-[#f4f4f1] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36 xl:px-16"
      >
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#168cab]">
                Desde mayo de 2025
              </p>

              <div className="mt-7 h-px w-14 bg-[#168cab]" />
            </div>

            <div className="lg:col-span-8">
              <h2 className="max-w-[1000px] text-[2.7rem] font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-[4rem] lg:text-[5.5rem]">
                Una historia corta en años.
                <br />
                Intensa en momentos
                <span className="text-[#168cab]">
                  .
                </span>
              </h2>

              <div className="mt-9 grid gap-7 text-sm leading-7 text-black/55 md:grid-cols-2 sm:text-base sm:leading-8">
                <p>
                  Esta página cuenta la etapa que comienza en mayo de 2025,
                  cuando Génesis inició un nuevo capítulo ligado a La Paz.
                </p>

                <p>
                  Desde entonces, el club ha vivido primeras veces, cambios,
                  triunfos, eliminaciones y partidos que poco a poco han
                  construido una identidad propia.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden border border-black/10 bg-black/10 sm:grid-cols-3">
            <div className="bg-white p-7 sm:p-9">
              <p className="text-[7px] font-black uppercase tracking-[0.22em] text-black/30">
                Inicio de la etapa
              </p>

              <p className="mt-4 text-4xl font-black tracking-[-0.05em]">
                MAY 2025
              </p>
            </div>

            <div className="bg-white p-7 sm:p-9">
              <p className="text-[7px] font-black uppercase tracking-[0.22em] text-black/30">
                Nueva casa
              </p>

              <p className="mt-4 text-4xl font-black uppercase tracking-[-0.05em]">
                La Paz
              </p>
            </div>

            <div className="bg-[#06142d] p-7 text-white sm:p-9">
              <p className="text-[7px] font-black uppercase tracking-[0.22em] text-cyan-300">
                Estado
              </p>

              <p className="mt-4 text-4xl font-black uppercase tracking-[-0.05em]">
                En marcha
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          2025
      ===================================================== */}

      <section
        id="temporada-2025"
        className="bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36 xl:px-16"
      >
        <div className="mx-auto max-w-[1500px]">
          <header className="flex flex-col gap-8 border-b border-black/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#168cab]">
                Primera temporada
              </p>

              <h2 className="mt-4 text-[4.2rem] font-black leading-[0.78] tracking-[-0.075em] sm:text-[7rem] lg:text-[9rem]">
                2025
                <span className="text-[#168cab]">
                  .
                </span>
              </h2>
            </div>

            <p className="max-w-[430px] text-sm leading-7 text-black/45">
              El año en que comenzó la nueva etapa, llegaron los primeros
              partidos y La Paz comenzó a formar parte de la historia del club.
            </p>
          </header>

          <div>
            {historia2025.map(
              (momento, index) => (
                <Capitulo
                  key={momento.id}
                  momento={momento}
                  invertido={
                    index % 2 !== 0
                  }
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          2026
      ===================================================== */}

      <section
        id="temporada-2026"
        className="bg-[#f4f4f1] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36 xl:px-16"
      >
        <div className="mx-auto max-w-[1500px]">
          <header className="flex flex-col gap-8 border-b border-black/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#168cab]">
                El siguiente paso
              </p>

              <h2 className="mt-4 text-[4.2rem] font-black leading-[0.78] tracking-[-0.075em] sm:text-[7rem] lg:text-[9rem]">
                2026
                <span className="text-[#168cab]">
                  .
                </span>
              </h2>
            </div>

            <p className="max-w-[430px] text-sm leading-7 text-black/45">
              Un equipo más competitivo, una fase decisiva y una primera final
              que estuvo muy cerca.
            </p>
          </header>

          <div>
            {historia2026.map(
              (momento, index) => (
                <Capitulo
                  key={momento.id}
                  momento={momento}
                  invertido={
                    index % 2 === 0
                  }
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          PRESENTE
      ===================================================== */}

      <section
        id="presente"
        className="relative overflow-hidden bg-[#0757bb] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12 lg:py-40 xl:px-16"
      >
        <div
          aria-hidden="true"
          className="absolute -right-20 top-1/2 -translate-y-1/2 text-[18rem] font-black leading-none tracking-[-0.1em] text-white/[0.06] sm:text-[28rem] lg:text-[40rem]"
        >
          26
        </div>

        <div className="relative mx-auto max-w-[1500px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:items-end">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.32em] text-cyan-200">
                Septiembre 2026 · Presente
              </p>

              <h2 className="mt-6 text-[4rem] font-black uppercase leading-[0.77] tracking-[-0.07em] sm:text-[6.5rem] lg:text-[8.5rem]">
                La historia
                <br />
                sigue
                <span className="text-cyan-200">
                  .
                </span>
              </h2>
            </div>

            <div className="border-t border-white/25 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                Una nueva temporada está en marcha. El equipo continúa
                compitiendo, cambiando y escribiendo capítulos que todavía no
                pertenecen al pasado.
              </p>

              <p className="mt-6 text-xl font-black uppercase leading-tight">
                Lo demás todavía no es historia.
                <br />
                Lo estamos viviendo.
              </p>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/equipo"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-[8px] font-black uppercase tracking-[0.16em] text-[#06142d] transition hover:bg-cyan-200"
            >
              Conoce al equipo →
            </Link>

            <Link
              href="/calendario"
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-8 py-4 text-[8px] font-black uppercase tracking-[0.16em] transition hover:bg-white hover:text-[#06142d]"
            >
              Temporada actual →
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          CIERRE
      ===================================================== */}

      <section className="bg-[#020817] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[1100px] text-center">
          <div className="relative mx-auto h-24 w-24 sm:h-32 sm:w-32">
            <Image
              src="/genesis.jpg"
              alt="Escudo de Génesis FC"
              fill
              sizes="128px"
              className="object-contain"
            />
          </div>

          <p className="mt-8 text-[8px] font-black uppercase tracking-[0.3em] text-cyan-300">
            Génesis FC · La Paz · Honduras
          </p>

          <h2 className="mt-7 text-[3.5rem] font-black uppercase leading-[0.82] tracking-[-0.065em] sm:text-[5.5rem] lg:text-[7rem]">
            Esto apenas
            <br />
            comienza
            <span className="text-cyan-300">
              .
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-[600px] text-sm leading-7 text-white/40">
            Los próximos partidos todavía no forman parte de esta página.
            Primero hay que vivirlos.
          </p>

          <Link
            href="/"
            className="mt-10 inline-flex rounded-full bg-white px-8 py-4 text-[8px] font-black uppercase tracking-[0.16em] text-[#06142d] transition hover:bg-cyan-300"
          >
            Volver al inicio →
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/[0.08] bg-[#020817] px-5 py-8 text-white sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto flex max-w-[1550px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[7px] font-black uppercase tracking-[0.16em] text-white/20">
            © 2026 Génesis FC. Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/"
              className="text-[7px] font-black uppercase tracking-[0.15em] text-white/30 transition hover:text-white"
            >
              Inicio
            </Link>

            <Link
              href="/equipo"
              className="text-[7px] font-black uppercase tracking-[0.15em] text-white/30 transition hover:text-white"
            >
              Equipo
            </Link>

            <Link
              href="/calendario"
              className="text-[7px] font-black uppercase tracking-[0.15em] text-white/30 transition hover:text-white"
            >
              Calendario
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}