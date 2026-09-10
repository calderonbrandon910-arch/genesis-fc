import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partido intenso el fin de semana",

  description:
    "Génesis FC se prepara para enfrentar a Motagua este 12 de septiembre de 2026 en el Estadio Carlos Miranda de Comayagua.",

  alternates: {
    canonical:
      "/noticias/genesis-prepara-proximo-desafio",
  },

  openGraph: {
    type: "article",
    locale: "es_HN",
    url: "/noticias/genesis-prepara-proximo-desafio",
    siteName: "Génesis FC",
    title:
      "Partido intenso el fin de semana | Génesis FC",
    description:
      "Génesis FC visita a Motagua en un duelo que promete intensidad, historia y mucho en juego.",
    publishedTime:
      "2026-09-09T00:00:00-06:00",
    images: [
      {
        url: "/motagua-genesis-portada-3.jpg",
        alt: "Motagua vs Génesis FC",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Partido intenso el fin de semana | Génesis FC",
    description:
      "Génesis FC se prepara para enfrentar a Motagua en el Estadio Carlos Miranda de Comayagua.",
    images: [
      "/motagua-genesis-portada-3.jpg",
    ],
  },
};

export default function NoticiaMotaguaPage() {
  return (
    <main className="min-h-screen bg-[#f4f4f1] text-[#07162e]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-white/10 bg-[#031229] text-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="relative h-12 w-12">
              <Image
                src="/genesis.jpg"
                alt="Génesis FC"
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-sm font-black uppercase sm:text-base">
                Génesis FC
              </p>

              <p className="mt-1 text-[7px] font-black uppercase tracking-[0.25em] text-cyan-300">
                Sitio oficial
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/15 px-5 py-3 text-[8px] font-black uppercase tracking-[0.15em] text-white/70 transition hover:bg-white hover:text-[#031229]"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* =====================================================
          CABECERA DEL ARTÍCULO
      ===================================================== */}

      <section className="bg-[#04142f] text-white">
        <div className="mx-auto max-w-[1400px] px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:px-12 lg:pb-20">
          <div className="max-w-[1050px]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[8px] font-black uppercase tracking-[0.28em] text-cyan-300">
                Primer equipo
              </span>

              <span className="h-px w-8 bg-white/20" />

              <span className="text-[8px] font-black uppercase tracking-[0.18em] text-white/35">
                09 SEP 2026
              </span>
            </div>

            <h1 className="mt-6 text-[clamp(3rem,7vw,7rem)] font-black uppercase leading-[0.86] tracking-[-0.07em]">
              Partido intenso
              <br />
              el fin de semana
              <span className="text-cyan-300">
                .
              </span>
            </h1>

            <p className="mt-7 max-w-[750px] text-sm leading-7 text-white/55 sm:text-base">
              Génesis FC visita a Motagua en un
              duelo que promete intensidad,
              historia y mucho en juego.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOTO DE PORTADA
          public/motagua-genesis-portada-3.jpg
      ===================================================== */}

      <section className="bg-[#04142f] px-5 pb-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[26px] bg-[#0b1c3d] sm:rounded-[34px]">
            <Image
              src="/motagua-genesis-portada-3.jpg"
              alt="Motagua vs Génesis FC"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#020817]/35 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* =====================================================
          ARTÍCULO
      ===================================================== */}

      <article className="bg-[#f4f4f1]">
        <div className="mx-auto max-w-[900px] px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
          {/* INTRODUCCIÓN */}

          <p className="text-lg font-bold leading-8 text-[#07162e] sm:text-xl sm:leading-9">
            Motagua y Génesis se enfrentan una
            vez más en un duelo que promete
            emociones fuertes. Los
            enfrentamientos entre ambos equipos
            han sido intensos en los últimos
            torneos, con partidos disputados y
            muchos goles.
          </p>

          <div className="my-10 h-px w-full bg-black/10" />

          {/* PRIMERA PARTE */}

          <div className="space-y-7 text-[15px] leading-8 text-black/65 sm:text-base sm:leading-8">
            <p>
              Motagua y Génesis se enfrentan una
              vez más. Los duelos entre ambos
              clubes siempre han sido muy
              intensos y con muchos goles. Este
              fin de semana volverán a
              encontrarse en un partido que
              promete emociones desde el primer
              minuto.
            </p>

            <p>
              Motagua llegará al partido después
              de jugar ante Alianza de El
              Salvador, mientras que Génesis
              contará con más descanso al no
              tener actividad internacional
              durante la semana.
            </p>

            <p>
              Los caninos llegan inspirados
              después de vencer como visitantes
              a Juticalpa el domingo pasado, un
              resultado importante que aumenta
              la confianza del equipo de La Paz
              antes de trasladarse a Comayagua.
            </p>

            <p>
              Ambos equipos van a querer los
              tres puntos. Si Génesis gana,
              aumentará su ventaja sobre Motagua
              sumando tres puntos fundamentales.
              Por su parte, Motagua buscará
              recuperarse después del tropiezo
              ante Independiente.
            </p>
          </div>

          {/* FRASE DESTACADA */}

          <blockquote className="my-14 border-l-4 border-cyan-500 pl-6 sm:pl-8">
            <p className="text-2xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-[#07162e] sm:text-3xl">
              “Ambos equipos van a querer los
              tres puntos.”
            </p>
          </blockquote>

          {/* =====================================================
              SEGUNDA FOTO
              public/motagua-genesis-2.jpg
          ===================================================== */}

          <div className="relative my-14 aspect-[16/10] overflow-hidden rounded-[24px] bg-[#dfe3e8] sm:rounded-[30px]">
            <Image
              src="/motagua-genesis-2.jpg"
              alt="Último enfrentamiento entre Motagua y Génesis FC"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* SEGUNDA PARTE */}

          <div className="space-y-7 text-[15px] leading-8 text-black/65 sm:text-base sm:leading-8">
            <h2 className="text-3xl font-black uppercase leading-[0.95] tracking-[-0.05em] text-[#07162e] sm:text-4xl">
              Un antecedente de alta tensión
              <span className="text-[#1590b8]">
                .
              </span>
            </h2>

            <p>
              La última vez que Motagua jugó
              ante Génesis fue en un partido con
              el cuchillo entre los dientes
              durante las triangulares, cuando
              ambos equipos disputaban la
              posibilidad de avanzar a la final
              del Torneo Clausura 2025-2026.
            </p>

            <p>
              Aquella vez, Motagua se impuso 2-1
              con goles de Cacho y Clever
              Portillo. Por parte de los caninos,
              Carlos Arzú puso el tanto para la
              visita.
            </p>

            <p>
              Fue un enfrentamiento de máxima
              intensidad. Cada balón dividido,
              cada llegada y cada oportunidad se
              disputó al límite, en uno de esos
              partidos en los que ninguno de los
              dos equipos estaba dispuesto a
              regalar absolutamente nada.
            </p>

            <p>
              Ahora el equipo de La Paz vuelve a
              encontrarse con Motagua, esta vez
              en Comayagua, con hambre de
              revancha y con la intención de
              escribir una historia diferente.
              Los caninos van a por todas.
            </p>
          </div>

          {/* =====================================================
              INFORMACIÓN DEL PARTIDO
          ===================================================== */}

          <div className="mt-16 overflow-hidden rounded-[28px] bg-[#061a3d] text-white">
            <div className="border-b border-white/10 px-6 py-5 sm:px-8">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-300">
                Próximo partido
              </p>
            </div>

            <div className="grid grid-cols-[1fr_52px_1fr] items-center gap-3 px-5 py-8 sm:grid-cols-[1fr_80px_1fr] sm:px-8 sm:py-10">
              {/* MOTAGUA */}

              <div className="flex flex-col items-center text-center">
                <div className="relative h-20 w-20 sm:h-28 sm:w-28">
                  <Image
                    src="/motagua.png"
                    alt="Motagua"
                    fill
                    sizes="112px"
                    className="object-contain"
                  />
                </div>

                <p className="mt-3 text-[7px] font-black uppercase tracking-[0.2em] text-white/30">
                  Local
                </p>

                <h3 className="mt-2 text-lg font-black uppercase sm:text-2xl">
                  Motagua
                </h3>
              </div>

              {/* VS */}

              <div className="flex justify-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-[8px] font-black sm:h-14 sm:w-14">
                  VS
                </div>
              </div>

              {/* GÉNESIS */}

              <div className="flex flex-col items-center text-center">
                <div className="relative h-20 w-20 sm:h-28 sm:w-28">
                  <Image
                    src="/genesis.jpg"
                    alt="Génesis FC"
                    fill
                    sizes="112px"
                    className="object-contain"
                  />
                </div>

                <p className="mt-3 text-[7px] font-black uppercase tracking-[0.2em] text-cyan-300">
                  Visitante
                </p>

                <h3 className="mt-2 text-lg font-black uppercase sm:text-2xl">
                  Génesis FC
                </h3>
              </div>
            </div>

            {/* DATOS DEL PARTIDO */}

            <div className="grid gap-5 border-t border-white/10 bg-white/[0.03] px-6 py-6 sm:grid-cols-3 sm:px-8">
              <div>
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/30">
                  Fecha
                </p>

                <p className="mt-2 text-[10px] font-black uppercase">
                  12 SEP 2026
                </p>
              </div>

              <div>
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/30">
                  Hora
                </p>

                <p className="mt-2 text-[10px] font-black uppercase">
                  7:00 PM
                </p>
              </div>

              <div>
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/30">
                  Estadio
                </p>

                <p className="mt-2 text-[10px] font-black uppercase">
                  Carlos Miranda · Comayagua
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              NAVEGACIÓN
          ===================================================== */}

          <div className="mt-14 flex flex-col gap-4 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="text-[9px] font-black uppercase tracking-[0.16em] text-[#1471d5]"
            >
              ← Volver al inicio
            </Link>

            <Link
              href="/calendario"
              className="text-[9px] font-black uppercase tracking-[0.16em] text-[#07162e]"
            >
              Ver calendario →
            </Link>
          </div>
        </div>
      </article>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-[#020817] text-white">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12">
              <Image
                src="/genesis.jpg"
                alt="Génesis FC"
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-sm font-black uppercase">
                Génesis FC
              </p>

              <p className="mt-1 text-[7px] font-black uppercase tracking-[0.22em] text-white/30">
                La Paz · Honduras
              </p>
            </div>
          </div>

          <p className="text-[7px] font-black uppercase tracking-[0.18em] text-white/20">
            © 2026 Génesis FC. Todos los
            derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}