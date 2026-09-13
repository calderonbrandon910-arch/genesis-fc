import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Motagua se impone 1-0 ante Génesis FC",
  description:
    "Motagua venció 1-0 a Génesis FC por la Jornada 7 de la Liga Nacional. Rodrigo de Oliveira marcó el único gol del encuentro.",
  alternates: {
    canonical: "/noticias/motagua-1-0-genesis",
  },
  openGraph: {
    type: "article",
    locale: "es_HN",
    url: "/noticias/motagua-1-0-genesis",
    siteName: "Génesis FC",
    title: "Motagua se impone 1-0 ante Génesis FC | Génesis FC",
    description:
      "Génesis FC cayó 1-0 ante Motagua en Comayagua. Rodrigo de Oliveira anotó el único gol del partido.",
    publishedTime: "2026-09-12T23:00:00-06:00",
    images: [
      {
        url: "/motaguavsgenesis2026.jpg",
        alt: "Motagua vs Génesis FC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Motagua 1-0 Génesis FC | Génesis FC",
    description:
      "Motagua se quedó con los tres puntos tras vencer 1-0 a Génesis FC.",
    images: ["/motaguavsgenesis2026.jpg"],
  },
};

export default function MotaguaUnoGenesisCeroPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
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

      <section className="relative min-h-[620px] overflow-hidden sm:min-h-[720px] lg:min-h-[820px]">
        <Image
          src="/motaguavsgenesis2026.jpg"
          alt="Motagua vs Génesis FC"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/50 to-[#020817]/10" />

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

            <h1 className="mt-6 max-w-[1050px] text-[3rem] font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-[5rem] lg:text-[6.5rem]">
              Motagua se impone 1-0 ante Génesis FC
              <span className="text-cyan-300">.</span>
            </h1>

            <p className="mt-7 max-w-[760px] border-l border-cyan-300/40 pl-5 text-[12px] leading-6 text-white/65 sm:text-base sm:leading-8">
              Rodrigo de Oliveira marcó el único gol del encuentro disputado en Comayagua.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f3f1] px-4 py-14 text-[#06142d] sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <article className="max-w-[820px]">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#168cab]" />
              <p className="text-[7px] font-black uppercase tracking-[0.28em] text-[#168cab]">
                Jornada 7 · Liga Nacional
              </p>
            </div>

            <div className="mt-8 space-y-7 text-[15px] leading-8 text-[#06142d]/75 sm:text-[17px] sm:leading-9">
              <p>
                Génesis FC cerró su compromiso ante Motagua con derrota 1-0. El conjunto azul se quedó con los tres puntos en un partido definido por un solo gol.
              </p>

              <p>
                Rodrigo de Oliveira fue el autor de la anotación que marcó la diferencia en el encuentro. Génesis buscó mantenerse dentro del partido y competir hasta el cierre, pero no logró encontrar el gol del empate.
              </p>

              <p>
                El resultado deja atrás la Jornada 7 y pone desde ahora la mirada del equipo en su siguiente compromiso de Liga Nacional.
              </p>
            </div>

            <div className="my-12 rounded-[28px] bg-[#06142d] p-7 text-white sm:p-10">
              <p className="text-[7px] font-black uppercase tracking-[0.25em] text-cyan-300">
                Resultado final
              </p>

              <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="text-center">
                  <div className="relative mx-auto h-20 w-20 sm:h-28 sm:w-28">
                    <Image
                      src="/motagua.png"
                      alt="Motagua"
                      fill
                      quality={100}
                      sizes="112px"
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-3 text-sm font-black uppercase sm:text-xl">Motagua</p>
                </div>

                <div className="flex items-center gap-3 text-4xl font-black sm:text-6xl">
                  <span>1</span>
                  <span className="text-white/20">–</span>
                  <span className="text-cyan-300">0</span>
                </div>

                <div className="text-center">
                  <div className="relative mx-auto h-20 w-20 sm:h-28 sm:w-28">
                    <Image
                      src="/genesis.jpg"
                      alt="Génesis FC"
                      fill
                      quality={100}
                      sizes="112px"
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-3 text-sm font-black uppercase sm:text-xl">Génesis FC</p>
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6 text-center">
                <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/35">
                  Gol · Rodrigo de Oliveira · Motagua
                </p>
              </div>
            </div>

            <div className="space-y-7 text-[15px] leading-8 text-[#06142d]/75 sm:text-[17px] sm:leading-9">
              <p>
                Génesis volverá a jugar el sábado 19 de septiembre a las 3:00 PM, cuando reciba a Olancho FC en el Estadio Roberto Suazo Córdova de La Paz.
              </p>
            </div>

            <Link
              href="/calendario"
              className="mt-10 inline-flex rounded-full bg-[#06142d] px-7 py-4 text-[8px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#168cab]"
            >
              Ver próximo partido →
            </Link>
          </article>

          <aside className="lg:pt-1">
            <div className="sticky top-6 space-y-5">
              <div className="rounded-[26px] border border-black/[0.06] bg-white p-6">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-black/30">Resultado</p>
                <p className="mt-3 text-3xl font-black uppercase">Motagua 1-0 Génesis</p>
              </div>

              <div className="rounded-[26px] bg-[#06142d] p-6 text-white">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-300">Siguiente partido</p>
                <p className="mt-4 text-2xl font-black uppercase leading-[1] tracking-[-0.04em]">
                  Génesis FC<br />vs Olancho FC
                </p>
                <p className="mt-4 text-[7px] font-black uppercase tracking-[0.16em] text-white/35">
                  19 SEP · 3:00 PM · LA PAZ
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className="bg-[#020817] px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[7px] font-black uppercase tracking-[0.16em] text-white/25">
            © 2026 Génesis FC. Todos los derechos reservados.
          </p>
          <Link href="/" className="text-[7px] font-black uppercase tracking-[0.16em] text-cyan-300">
            Volver al inicio →
          </Link>
        </div>
      </footer>
    </main>
  );
}
