import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "El equipo continúa trabajando de cara al próximo compromiso",

  description:
    "Génesis FC continúa su preparación para enfrentar a Motagua por la Jornada 7 de la Liga Nacional en el Estadio Carlos Miranda de Comayagua.",

  alternates: {
    canonical:
      "/noticias/el-equipo-continua-trabajando",
  },

  openGraph: {
    type: "article",
    locale: "es_HN",
    url: "/noticias/el-equipo-continua-trabajando",
    siteName: "Génesis FC",
    title:
      "El equipo continúa trabajando de cara al próximo compromiso | Génesis FC",
    description:
      "Génesis FC prepara su próximo desafío de Liga Nacional con la mirada puesta en el partido ante Motagua en Comayagua.",
    publishedTime:
      "2026-09-08T00:00:00-06:00",
    images: [
      {
        url: "/noticia-2.jpg",
        alt: "Génesis FC continúa trabajando de cara al próximo compromiso",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "El equipo continúa trabajando de cara al próximo compromiso | Génesis FC",
    description:
      "Génesis FC continúa su preparación para enfrentar a Motagua por la Jornada 7 de la Liga Nacional.",
    images: ["/noticia-2.jpg"],
  },
};

export default function ElEquipoContinuaTrabajandoPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      {/* HEADER */}

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

      {/* HERO DE LA NOTICIA */}

      <section className="relative min-h-[620px] overflow-hidden sm:min-h-[720px] lg:min-h-[820px]">
        <Image
          src="/noticia-2.jpg"
          alt="Génesis FC continúa trabajando de cara al próximo compromiso"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/45 to-[#020817]/10" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(39,209,255,0.10),transparent_30%)]" />

        <div className="relative mx-auto flex min-h-[620px] max-w-[1500px] items-end px-4 pb-12 pt-24 sm:min-h-[720px] sm:px-8 sm:pb-16 lg:min-h-[820px] lg:px-12 lg:pb-20">
          <div className="max-w-[1050px]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[7px] font-black uppercase tracking-[0.22em] text-cyan-300 backdrop-blur-md">
                Primer equipo
              </span>

              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/45">
                08 SEP 2026
              </span>
            </div>

            <h1 className="mt-6 max-w-[1000px] text-[3rem] font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-[5rem] lg:text-[6.5rem]">
              El equipo continúa trabajando de cara al próximo compromiso
              <span className="text-cyan-300">.</span>
            </h1>

            <p className="mt-7 max-w-[760px] border-l border-cyan-300/40 pl-5 text-[12px] leading-6 text-white/65 sm:text-base sm:leading-8">
              Génesis FC prepara su próximo desafío de Liga Nacional con la
              mirada puesta en el partido ante Motagua en Comayagua.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}

      <section className="bg-[#f3f3f1] px-4 py-14 text-[#06142d] sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          {/* ARTÍCULO */}

          <article className="max-w-[820px]">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#168cab]" />

              <p className="text-[7px] font-black uppercase tracking-[0.28em] text-[#168cab]">
                Actualidad del primer equipo
              </p>
            </div>

            <div className="mt-8 space-y-7 text-[15px] leading-8 text-[#06142d]/75 sm:text-[17px] sm:leading-9">
              <p>
                Génesis FC continúa con su preparación de cara al próximo
                desafío por la Liga Nacional, cuando visite a Motagua este
                sábado 12 de septiembre en el Estadio Carlos Miranda de
                Comayagua.
              </p>

              <p>
                Después de la victoria 0–3 conseguida como visitante frente a
                Juticalpa, el conjunto paceño afronta una nueva semana de
                trabajo con la mirada puesta en uno de los compromisos más
                exigentes de la jornada.
              </p>

              <p>
                Los Caninos buscan aprovechar estos días para llegar de la
                mejor manera posible al encuentro. El trabajo previo al partido
                se centra en mantener el ritmo competitivo del equipo, reforzar
                conceptos colectivos y preparar los distintos escenarios que
                pueden presentarse ante Motagua.
              </p>

              <p>
                El próximo encuentro supone además una oportunidad para Génesis
                de darle continuidad al buen resultado conseguido en Juticalpa.
                El equipo llega con la intención de competir nuevamente lejos de
                La Paz y sumar puntos importantes en la lucha por mantenerse
                entre los primeros lugares de la clasificación.
              </p>

              <p>
                Motagua, por su parte, representará una prueba diferente. Jugar
                en Comayagua obligará a Génesis a mantener concentración,
                orden y personalidad durante todo el encuentro.
              </p>
            </div>

            {/* FRASE DESTACADA */}

            <div className="my-12 rounded-[28px] bg-[#06142d] p-7 text-white sm:p-10">
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-cyan-300" />

                <p className="text-[7px] font-black uppercase tracking-[0.25em] text-cyan-300">
                  Objetivo
                </p>
              </div>

              <p className="mt-5 text-3xl font-black uppercase leading-[1] tracking-[-0.04em] sm:text-5xl">
                La preparación continúa.
                <br />
                El objetivo está puesto en Comayagua
                <span className="text-cyan-300">.</span>
              </p>
            </div>

            {/* IMAGEN ENTRENAMIENTO */}

            <figure className="my-12 overflow-hidden rounded-[30px] bg-[#06142d]">
              <div className="relative aspect-[16/10] sm:aspect-[16/9]">
                <Image
                  src="/enteno.jpg"
                  alt="Entrenamiento de Génesis FC previo al partido contra Motagua"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 820px"
                  className="object-cover object-center"
                />
              </div>

              <figcaption className="border-t border-white/10 px-5 py-4 text-[7px] font-black uppercase tracking-[0.17em] text-white/35 sm:px-7">
                El primer equipo continúa preparando el compromiso ante Motagua.
              </figcaption>
            </figure>

            <div className="space-y-7 text-[15px] leading-8 text-[#06142d]/75 sm:text-[17px] sm:leading-9">
              <p>
                Con todavía varios días antes del partido, el plantel seguirá
                trabajando de cara a una jornada que promete intensidad entre
                dos equipos que llegan separados por una distancia mínima en la
                tabla.
              </p>

              <p>
                Génesis ocupa actualmente la cuarta posición con 10 puntos,
                mientras Motagua se encuentra inmediatamente detrás, también
                con 10 unidades. Por ello, el resultado tendrá importancia
                directa para ambos clubes en la clasificación.
              </p>

              <p>
                El encuentro corresponde a la Jornada 7 de la Liga Nacional y
                se disputará el sábado 12 de septiembre a las 7:00 PM en el
                Estadio Carlos Miranda de Comayagua.
              </p>
            </div>

            {/* FICHA DEL PARTIDO */}

            <div className="mt-12 overflow-hidden rounded-[30px] bg-[#06142d] text-white">
              <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                <p className="text-[7px] font-black uppercase tracking-[0.22em] text-cyan-300">
                  Próximo partido
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[7px] font-black uppercase tracking-[0.18em] text-white/35">
                      Liga Nacional · Jornada 7
                    </p>

                    <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.04em] sm:text-5xl">
                      Motagua
                      <span className="mx-3 text-cyan-300">vs</span>
                      Génesis FC
                    </h2>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-lg font-black uppercase">
                      12 SEP 2026
                    </p>

                    <p className="mt-1 text-[8px] font-black uppercase tracking-[0.15em] text-cyan-300">
                      7:00 PM
                    </p>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-[7px] font-black uppercase tracking-[0.16em] text-white/35">
                    Estadio Carlos Miranda · Comayagua
                  </p>
                </div>

                <Link
                  href="/partidos/motagua-vs-genesis"
                  className="mt-7 inline-flex rounded-full bg-cyan-300 px-6 py-4 text-[8px] font-black uppercase tracking-[0.16em] text-[#06142d] transition hover:bg-white"
                >
                  Ir al Match Center →
                </Link>
              </div>
            </div>
          </article>

          {/* SIDEBAR */}

          <aside className="lg:pt-1">
            <div className="sticky top-6 space-y-5">
              <div className="rounded-[26px] border border-black/[0.06] bg-white p-6">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-black/30">
                  Publicado
                </p>

                <p className="mt-3 text-2xl font-black uppercase tracking-[-0.04em]">
                  08 SEP 2026
                </p>
              </div>

              <div className="rounded-[26px] border border-black/[0.06] bg-white p-6">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-black/30">
                  Categoría
                </p>

                <p className="mt-3 text-2xl font-black uppercase tracking-[-0.04em]">
                  Primer equipo
                </p>
              </div>

              <div className="rounded-[26px] bg-[#06142d] p-6 text-white">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-300">
                  Próximo desafío
                </p>

                <p className="mt-4 text-2xl font-black uppercase leading-[1] tracking-[-0.04em]">
                  Motagua
                  <br />
                  vs Génesis
                </p>

                <p className="mt-4 text-[7px] font-black uppercase tracking-[0.16em] text-white/35">
                  12 SEP · 7:00 PM
                </p>
              </div>

              <Link
                href="/"
                className="flex items-center justify-between rounded-[26px] border border-black/[0.06] bg-white p-6 transition hover:-translate-y-1"
              >
                <div>
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-black/30">
                    Navegación
                  </p>

                  <p className="mt-2 text-sm font-black uppercase tracking-[-0.02em] text-[#168cab]">
                    Volver al inicio
                  </p>
                </div>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#06142d] text-white">
                  →
                </span>
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* CIERRE */}

      <section className="bg-[#06142d] px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[7px] font-black uppercase tracking-[0.25em] text-cyan-300">
              Génesis FC
            </p>

            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
              La preparación
              <br />
              continúa
              <span className="text-cyan-300">.</span>
            </h2>
          </div>

          <Link
            href="/partidos/motagua-vs-genesis"
            className="inline-flex w-fit rounded-full bg-cyan-300 px-7 py-4 text-[8px] font-black uppercase tracking-[0.16em] text-[#06142d] transition hover:bg-white"
          >
            Ver próximo partido →
          </Link>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="bg-[#020817] px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-11 w-11">
              <Image
                src="/genesis.jpg"
                alt="Génesis FC"
                fill
                quality={100}
                sizes="44px"
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-sm font-black uppercase">
                Génesis FC
              </p>

              <p className="mt-1 text-[6px] font-black uppercase tracking-[0.2em] text-white/25">
                La Paz · Honduras
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/"
              className="text-[6px] font-black uppercase tracking-[0.15em] text-white/30 transition hover:text-white"
            >
              Inicio
            </Link>

            <Link
              href="/equipo"
              className="text-[6px] font-black uppercase tracking-[0.15em] text-white/30 transition hover:text-white"
            >
              Equipo
            </Link>

            <Link
              href="/calendario"
              className="text-[6px] font-black uppercase tracking-[0.15em] text-white/30 transition hover:text-white"
            >
              Calendario
            </Link>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1300px] flex-col gap-2 pt-6 sm:flex-row sm:justify-between">
          <p className="text-[6px] font-black uppercase tracking-[0.14em] text-white/20">
            © 2026 Génesis FC. Todos los derechos reservados.
          </p>

          <p className="text-[6px] font-black uppercase tracking-[0.14em] text-white/20">
            Temporada 2026/27
          </p>
        </div>
      </footer>
    </main>
  );
}