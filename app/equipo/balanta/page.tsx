import Image from "next/image";
import Link from "next/link";

export default function BalantaPage() {
  return (
    <main className="min-h-screen bg-[#06142d] text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-white/10 bg-[#020817]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-12 w-12">
              <Image
                src="/genesis.jpg"
                alt="Génesis FC"
                fill
                quality={100}
                sizes="48px"
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-sm font-black uppercase sm:text-base">
                Génesis FC
              </p>

              <p className="mt-1 text-[7px] font-black uppercase tracking-[0.25em] text-cyan-300">
                Primer equipo
              </p>
            </div>
          </Link>

          <Link
            href="/#equipo"
            className="rounded-full border border-white/15 px-5 py-3 text-[8px] font-black uppercase tracking-[0.15em] text-white/70 transition hover:bg-white hover:text-[#031229]"
          >
            Volver al equipo
          </Link>
        </div>
      </header>

      {/* =====================================================
          HERO DEL JUGADOR
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-r from-[#041126] via-[#0a2d68] to-[#0e5dbd]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.08]">
          <div className="absolute -left-20 top-20 text-[24rem] font-black leading-none text-white">
            01
          </div>
        </div>

        <div className="relative mx-auto grid min-h-[760px] max-w-[1500px] items-end gap-10 px-5 pt-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">

          {/* DATOS PRINCIPALES */}

          <div className="relative z-10 pb-14 lg:pb-20">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-cyan-300" />

              <p className="text-[8px] font-black uppercase tracking-[0.35em] text-cyan-300">
                Portero
              </p>
            </div>

            <p className="mt-6 text-[7rem] font-black leading-none tracking-[-0.08em] text-white/10 sm:text-[10rem]">
              01
            </p>

            <h1 className="-mt-8 text-[4rem] font-black uppercase leading-[0.82] tracking-[-0.07em] sm:text-[6rem] lg:text-[7.5rem]">
              Balanta
              <span className="text-cyan-300">.</span>
            </h1>

            <p className="mt-8 max-w-[520px] text-sm leading-7 text-white/55 sm:text-base">
              Guardameta de Génesis FC. Seguridad, reflejos y presencia bajo
              los tres palos para defender el arco del equipo de La Paz.
            </p>

            <div className="mt-10 grid max-w-[520px] grid-cols-3 gap-3">
              <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-3xl font-black">
                  01
                </p>

                <p className="mt-2 text-[7px] font-black uppercase tracking-[0.18em] text-white/35">
                  Número
                </p>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-3xl font-black">
                  POR
                </p>

                <p className="mt-2 text-[7px] font-black uppercase tracking-[0.18em] text-white/35">
                  Posición
                </p>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-3xl font-black">
                  GFC
                </p>

                <p className="mt-2 text-[7px] font-black uppercase tracking-[0.18em] text-white/35">
                  Club
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              FOTO DE BALANTA
              AHORA USA balanta.jpg
          ================================================= */}

          <div className="relative min-h-[520px] overflow-hidden lg:min-h-[720px]">
            <Image
              src="/balanta.jpg"
              alt="Balanta - Génesis FC"
              fill
              priority
              unoptimized
              sizes="(max-width: 1023px) 100vw, 55vw"
              className="object-cover object-top"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06142d] via-transparent to-transparent" />

            <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#0a2d68]/55 via-transparent to-transparent lg:block" />
          </div>
        </div>
      </section>

      {/* =====================================================
          INFORMACIÓN PERSONAL
      ===================================================== */}

      <section className="bg-[#020817] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-[1300px]">
          <div className="grid gap-px overflow-hidden rounded-[28px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-[#06142d] p-6 sm:p-8">
              <p className="text-[7px] font-black uppercase tracking-[0.24em] text-cyan-300">
                Fecha de nacimiento
              </p>

              <p className="mt-4 text-xl font-black uppercase sm:text-2xl">
                11 ABR 1998
              </p>
            </div>

            <div className="bg-[#06142d] p-6 sm:p-8">
              <p className="text-[7px] font-black uppercase tracking-[0.24em] text-cyan-300">
                Edad
              </p>

              <p className="mt-4 text-xl font-black uppercase sm:text-2xl">
                28 años
              </p>
            </div>

            <div className="bg-[#06142d] p-6 sm:p-8">
              <p className="text-[7px] font-black uppercase tracking-[0.24em] text-cyan-300">
                Lugar de nacimiento
              </p>

              <p className="mt-4 text-xl font-black uppercase sm:text-2xl">
                Jamundí, Colombia
              </p>
            </div>

            <div className="bg-[#06142d] p-6 sm:p-8">
              <p className="text-[7px] font-black uppercase tracking-[0.24em] text-cyan-300">
                Altura
              </p>

              <p className="mt-4 text-xl font-black uppercase sm:text-2xl">
                1,88 m
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ESTADÍSTICAS 2026/2027
      ===================================================== */}

      <section className="bg-[#f3f3f2] px-5 py-16 text-[#06142d] sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1300px]">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#168cab]" />

            <p className="text-[8px] font-black uppercase tracking-[0.35em] text-[#168cab]">
              Temporada 2026/2027
            </p>
          </div>

          <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
            Estadísticas
            <span className="text-[#168cab]">.</span>
          </h2>

          <p className="mt-5 max-w-[600px] text-sm leading-7 text-black/45">
            Rendimiento de Balanta con Génesis FC durante la temporada
            2026/2027.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">

            {/* PARTIDOS */}

            <div className="group relative overflow-hidden rounded-[24px] bg-white p-7 shadow-[0_20px_50px_rgba(7,20,45,0.06)] transition duration-300 hover:-translate-y-1 sm:p-9">
              <div className="pointer-events-none absolute -right-2 -top-4 text-[7rem] font-black leading-none text-[#06142d]/[0.035] sm:text-[9rem]">
                5
              </div>

              <div className="relative">
                <p className="text-[7px] font-black uppercase tracking-[0.25em] text-[#168cab]">
                  Apariciones
                </p>

                <p className="mt-5 text-6xl font-black tracking-[-0.06em] sm:text-7xl">
                  5
                </p>

                <div className="mt-5 h-px w-full bg-black/[0.07]" />

                <p className="mt-5 text-[8px] font-black uppercase tracking-[0.2em] text-black/35">
                  Partidos jugados
                </p>
              </div>
            </div>

            {/* PORTERÍAS IMBATIDAS */}

            <div className="group relative overflow-hidden rounded-[24px] bg-[#06142d] p-7 text-white shadow-[0_20px_50px_rgba(7,20,45,0.10)] transition duration-300 hover:-translate-y-1 sm:p-9">
              <div className="pointer-events-none absolute -right-2 -top-4 text-[7rem] font-black leading-none text-white/[0.04] sm:text-[9rem]">
                3
              </div>

              <div className="relative">
                <p className="text-[7px] font-black uppercase tracking-[0.25em] text-cyan-300">
                  Rendimiento defensivo
                </p>

                <p className="mt-5 text-6xl font-black tracking-[-0.06em] text-cyan-300 sm:text-7xl">
                  3
                </p>

                <div className="mt-5 h-px w-full bg-white/10" />

                <p className="mt-5 text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
                  Porterías imbatidas
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[24px] border border-[#06142d]/10 bg-[#e9e9e6] px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[7px] font-black uppercase tracking-[0.25em] text-black/35">
                  Temporada actual
                </p>

                <p className="mt-2 text-sm font-black uppercase sm:text-base">
                  3 porterías imbatidas en 5 partidos
                </p>
              </div>

              <p className="text-4xl font-black tracking-[-0.05em] text-[#168cab]">
                60%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PERFIL
      ===================================================== */}

      <section className="bg-[#06142d] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.7fr_1.3fr]">

          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.35em] text-cyan-300">
              Perfil
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-5xl">
              Bajo los
              <br />
              tres palos
              <span className="text-cyan-300">.</span>
            </h2>
          </div>

          <div className="space-y-6 text-sm leading-8 text-white/55 sm:text-base">
            <p>
              Nacido el 11 de abril de 1998 en Jamundí, Colombia, Balanta
              defiende el arco de Génesis FC.
            </p>

            <p>
              Con 1,88 metros de altura, aporta presencia, alcance y seguridad
              en el área, además de capacidad de reacción en situaciones de
              máxima exigencia.
            </p>

            <p>
              Durante la temporada 2026/2027 ha disputado 5 partidos y ha
              conseguido mantener su portería imbatida en 3 de ellos.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          NAVEGACIÓN
      ===================================================== */}

      <section className="border-t border-white/10 bg-[#020817] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/#equipo"
            className="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-300 transition hover:text-white"
          >
            ← Volver a jugadores
          </Link>

          <Link
            href="/"
            className="text-[9px] font-black uppercase tracking-[0.16em] text-white/50 transition hover:text-white"
          >
            Ir al inicio →
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/10 bg-[#020817] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1300px] flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-12 w-12">
              <Image
                src="/genesis.jpg"
                alt="Génesis FC"
                fill
                quality={100}
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
          </Link>

          <p className="text-[7px] font-black uppercase tracking-[0.18em] text-white/20">
            © 2026 Génesis FC. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </main>
  );
}