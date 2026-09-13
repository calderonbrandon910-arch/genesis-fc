import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "La tapada de Balanta | Génesis FC",
  description:
    "Balanta protagonizó una gran intervención bajo los tres palos durante el partido entre Motagua y Génesis FC.",
  alternates: {
    canonical: "/noticias/la-tapada-de-balanta",
  },
  openGraph: {
    type: "article",
    locale: "es_HN",
    url: "/noticias/la-tapada-de-balanta",
    siteName: "Génesis FC",
    title: "La tapada de Balanta | Génesis FC",
    description:
      "Revive una de las grandes intervenciones de Balanta durante el partido ante Motagua.",
    publishedTime: "2026-09-12T23:30:00-06:00",
    images: [
      {
        url: "/tapadabalanta.png",
        alt: "La tapada de Balanta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La tapada de Balanta | Génesis FC",
    description:
      "Revive una de las grandes intervenciones de Balanta ante Motagua.",
    images: ["/tapadabalanta.png"],
  },
};

export default function LaTapadaDeBalantaPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-white/10 bg-[#020817]">
        <div className="mx-auto flex h-[74px] max-w-[1500px] items-center justify-between px-4 sm:h-[86px] sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-11 w-11 sm:h-14 sm:w-14">
              <Image
                src="/genesis.jpg"
                alt="Génesis FC"
                fill
                priority
                quality={100}
                sizes="56px"
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-sm font-black uppercase sm:text-lg">
                Génesis FC
              </p>

              <p className="mt-1 text-[6px] font-black uppercase tracking-[0.25em] text-cyan-300">
                Noticias
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/15 px-4 py-3 text-[7px] font-black uppercase tracking-[0.15em] text-white/70 transition hover:bg-white hover:text-[#06142d] sm:px-6 sm:text-[8px]"
          >
            ← Inicio
          </Link>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative min-h-[620px] overflow-hidden sm:min-h-[720px] lg:min-h-[820px]">
        <Image
          src="/tapadabalanta.png"
          alt="La tapada de Balanta"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/45 to-[#020817]/10" />

        <div className="relative mx-auto flex min-h-[620px] max-w-[1500px] items-end px-4 pb-12 pt-24 sm:min-h-[720px] sm:px-8 sm:pb-16 lg:min-h-[820px] lg:px-12 lg:pb-20">
          <div className="max-w-[1050px]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[7px] font-black uppercase tracking-[0.22em] text-cyan-300 backdrop-blur-md">
                Primer equipo
              </span>

              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/45">
                12 SEP 2026
              </span>
            </div>

            <h1 className="mt-6 max-w-[1000px] text-[3.2rem] font-black uppercase leading-[0.85] tracking-[-0.06em] sm:text-[5.5rem] lg:text-[7rem]">
              La tapada
              <br />
              de Balanta
              <span className="text-cyan-300">.</span>
            </h1>

            <p className="mt-7 max-w-[760px] border-l border-cyan-300/40 pl-5 text-[12px] leading-6 text-white/65 sm:text-base sm:leading-8">
              Una intervención del guardameta de Génesis FC que destacó
              durante el encuentro frente a Motagua.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          ARTÍCULO
      ===================================================== */}

      <section className="bg-[#f3f3f1] px-4 py-14 text-[#06142d] sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <article className="max-w-[850px]">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#168cab]" />

              <p className="text-[7px] font-black uppercase tracking-[0.28em] text-[#168cab]">
                Motagua vs Génesis FC · Jornada 7
              </p>
            </div>

            <div className="mt-8 space-y-7 text-[15px] leading-8 text-[#06142d]/75 sm:text-[17px] sm:leading-9">
              <p>
                Balanta volvió a responder bajo los tres palos de Génesis FC
                durante el compromiso ante Motagua.
              </p>

              <p>
                El guardameta protagonizó una destacada intervención para
                evitar una oportunidad del conjunto rival, dejando una de las
                acciones defensivas del encuentro.
              </p>

              <p>
                La jugada reflejó la reacción y capacidad del portero para
                responder en un momento de peligro y mantener al equipo dentro
                del partido.
              </p>
            </div>

            {/* =================================================
                VIDEO
            ================================================= */}

            <div className="mt-12">
              <div className="mb-6">
                <p className="text-[7px] font-black uppercase tracking-[0.25em] text-[#168cab]">
                  Video
                </p>

                <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.04em] sm:text-5xl">
                  Revive la tapada
                  <span className="text-[#168cab]">.</span>
                </h2>
              </div>

              <div className="overflow-hidden rounded-[28px] bg-[#06142d] p-2 shadow-[0_25px_70px_rgba(6,20,45,0.15)] sm:p-3">
                <div className="relative aspect-video overflow-hidden rounded-[22px] bg-black">
                  <iframe
                    src="https://www.youtube.com/embed/Y-Goc93dSIo"
                    title="La tapada de Balanta ante Motagua"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>

              <a
                href="https://www.youtube.com/watch?v=Y-Goc93dSIo"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex rounded-full bg-[#06142d] px-7 py-4 text-[8px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#168cab]"
              >
                Ver en YouTube →
              </a>
            </div>

            {/* =================================================
                SIGUIENTE PARTIDO
            ================================================= */}

            <div className="mt-14 border-t border-black/10 pt-10">
              <p className="text-[7px] font-black uppercase tracking-[0.25em] text-[#168cab]">
                Lo que sigue
              </p>

              <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.04em] sm:text-5xl">
                Próximo desafío
                <span className="text-[#168cab]">.</span>
              </h2>

              <p className="mt-6 text-[15px] leading-8 text-[#06142d]/70 sm:text-[17px] sm:leading-9">
                Génesis FC volverá a la acción el sábado 19 de septiembre a
                las 3:00 PM frente a Olancho FC en el Estadio Roberto Suazo
                Córdova de La Paz.
              </p>

              <Link
                href="/calendario"
                className="mt-7 inline-flex rounded-full bg-[#06142d] px-7 py-4 text-[8px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#168cab]"
              >
                Ver calendario →
              </Link>
            </div>
          </article>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="lg:pt-1">
            <div className="sticky top-6 space-y-5">
              <div className="rounded-[26px] bg-[#06142d] p-6 text-white">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-300">
                  Protagonista
                </p>

                <div className="mt-5 flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10">
                    <Image
                      src="/balanta-2.jpg"
                      alt="Balanta"
                      fill
                      sizes="64px"
                      className="object-cover object-top"
                    />
                  </div>

                  <div>
                    <p className="text-xl font-black uppercase">
                      Balanta
                    </p>

                    <p className="mt-1 text-[7px] font-black uppercase tracking-[0.16em] text-white/35">
                      Portero · Génesis FC
                    </p>
                  </div>
                </div>

                <Link
                  href="/equipo/balanta"
                  className="mt-6 inline-flex text-[7px] font-black uppercase tracking-[0.16em] text-cyan-300"
                >
                  Ver perfil →
                </Link>
              </div>

              <div className="rounded-[26px] border border-black/[0.06] bg-white p-6">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-black/30">
                  Partido
                </p>

                <p className="mt-3 text-2xl font-black uppercase">
                  Motagua 1-0 Génesis
                </p>

                <p className="mt-3 text-[7px] font-black uppercase tracking-[0.16em] text-black/35">
                  Jornada 7 · Liga Nacional
                </p>

                <Link
                  href="/noticias/motagua-1-0-genesis"
                  className="mt-6 inline-flex text-[7px] font-black uppercase tracking-[0.16em] text-[#168cab]"
                >
                  Leer crónica →
                </Link>
              </div>

              <div className="rounded-[26px] bg-[#168cab] p-6 text-white">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/60">
                  Siguiente partido
                </p>

                <p className="mt-4 text-2xl font-black uppercase leading-none tracking-[-0.04em]">
                  Génesis FC
                  <br />
                  vs Olancho FC
                </p>

                <p className="mt-4 text-[7px] font-black uppercase tracking-[0.16em] text-white/60">
                  19 SEP · 3:00 PM · LA PAZ
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-[#020817] px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[7px] font-black uppercase tracking-[0.16em] text-white/25">
            © 2026 Génesis FC. Todos los derechos reservados.
          </p>

          <Link
            href="/"
            className="text-[7px] font-black uppercase tracking-[0.16em] text-cyan-300"
          >
            Volver al inicio →
          </Link>
        </div>
      </footer>
    </main>
  );
}