import Image from "next/image";
import Link from "next/link";

export default function GabrielAraujoPage() {
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
                Primer equipo
              </p>
            </div>
          </Link>

          <Link
            href="/equipo"
            className="rounded-full border border-white/15 px-4 py-3 text-[7px] font-black uppercase tracking-[0.15em] text-white/70 transition hover:bg-white hover:text-[#06142d] sm:px-6 sm:text-[8px]"
          >
            ← Volver al equipo
          </Link>
        </div>
      </header>

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#041126] via-[#08285f] to-[#0b5db5]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(39,209,255,0.12),transparent_32%)]" />

        <div className="absolute -right-32 top-20 h-[500px] w-[500px] rounded-full border border-white/[0.05]" />

        <div className="relative mx-auto grid min-h-[720px] max-w-[1600px] lg:grid-cols-[0.9fr_1.1fr]">
          {/* INFORMACIÓN */}

          <div className="relative z-10 flex items-end px-4 pb-14 pt-16 sm:px-8 sm:pb-20 lg:px-12 lg:py-24">
            <div className="w-full">
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-cyan-300" />

                <p className="text-[7px] font-black uppercase tracking-[0.3em] text-cyan-300 sm:text-[9px]">
                  Defensa · Génesis FC
                </p>
              </div>

              <div className="relative mt-8">
                <span className="pointer-events-none absolute -left-2 -top-24 text-[10rem] font-black leading-none tracking-[-0.08em] text-white/[0.035] sm:text-[14rem]">
                  04
                </span>

                <h1 className="relative text-[4rem] font-black uppercase leading-[0.8] tracking-[-0.065em] sm:text-[6rem] lg:text-[7.5rem]">
                  Gabriel
                  <br />
                  Araujo
                  <span className="text-cyan-300">.</span>
                </h1>
              </div>

              <p className="mt-8 max-w-[500px] border-l border-cyan-300/40 pl-5 text-[11px] leading-6 text-white/50 sm:text-sm sm:leading-7">
                Defensa brasileño del primer equipo de Génesis FC durante
                la temporada 2026/27.
              </p>

              <div className="mt-10 grid max-w-[600px] grid-cols-3 gap-3">
                <div className="rounded-[20px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm sm:p-5">
                  <p className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                    04
                  </p>

                  <p className="mt-2 text-[6px] font-black uppercase tracking-[0.18em] text-white/30">
                    Plantilla
                  </p>
                </div>

                <div className="rounded-[20px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm sm:p-5">
                  <p className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                    DEF
                  </p>

                  <p className="mt-2 text-[6px] font-black uppercase tracking-[0.18em] text-white/30">
                    Posición
                  </p>
                </div>

                <div className="rounded-[20px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm sm:p-5">
                  <p className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                    BRA
                  </p>

                  <p className="mt-2 text-[6px] font-black uppercase tracking-[0.18em] text-white/30">
                    País
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FOTO */}

          <div className="relative min-h-[560px] overflow-hidden lg:min-h-[720px]">
            <Image
              src="/araujo.jpg"
              alt="Gabriel Araujo - Génesis FC"
              fill
              priority
              unoptimized
              sizes="(max-width: 1023px) 100vw, 55vw"
              className="object-cover object-top"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#020817]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#08285f] lg:via-transparent lg:to-transparent" />

            <div className="absolute bottom-6 right-6 rounded-full border border-white/15 bg-[#020817]/70 px-5 py-3 backdrop-blur-md">
              <p className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-300">
                Temporada 2026/27
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INFORMACIÓN PERSONAL */}

      <section className="bg-[#f3f3f1] px-4 py-14 text-[#06142d] sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1300px]">
          <div className="border-b border-black/10 pb-7">
            <p className="text-[7px] font-black uppercase tracking-[0.27em] text-[#168cab]">
              Conoce al jugador
            </p>

            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
              Gabriel Araujo
              <span className="text-[#168cab]">.</span>
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-black/[0.06] bg-white p-6 sm:p-8">
              <p className="text-[7px] font-black uppercase tracking-[0.2em] text-black/30">
                Fecha de nacimiento
              </p>

              <p className="mt-4 text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
                29 ENE 1992
              </p>
            </div>

            <div className="rounded-[24px] border border-black/[0.06] bg-white p-6 sm:p-8">
              <p className="text-[7px] font-black uppercase tracking-[0.2em] text-black/30">
                Edad
              </p>

              <p className="mt-4 text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
                34 años
              </p>
            </div>

            <div className="rounded-[24px] border border-black/[0.06] bg-white p-6 sm:p-8">
              <p className="text-[7px] font-black uppercase tracking-[0.2em] text-black/30">
                País
              </p>

              <p className="mt-4 text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
                Brasil
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS */}

      <section className="bg-white px-4 py-14 text-[#06142d] sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1300px]">
          <div className="flex flex-col gap-4 border-b border-black/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[7px] font-black uppercase tracking-[0.27em] text-[#168cab]">
                Rendimiento
              </p>

              <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
                Estadísticas
                <span className="text-[#168cab]">.</span>
              </h2>
            </div>

            <p className="text-[7px] font-black uppercase tracking-[0.18em] text-black/30">
              Temporada 2026/27
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[26px] bg-[#06142d] p-7 text-white sm:p-8">
              <p className="text-[4rem] font-black leading-none tracking-[-0.06em] text-cyan-300">
                5
              </p>

              <p className="mt-5 text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
                Partidos jugados
              </p>
            </div>

            <div className="rounded-[26px] bg-[#06142d] p-7 text-white sm:p-8">
              <p className="text-[4rem] font-black leading-none tracking-[-0.06em] text-cyan-300">
                1
              </p>

              <p className="mt-5 text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
                Gol
              </p>
            </div>

            <div className="rounded-[26px] bg-[#06142d] p-7 text-white sm:p-8">
              <p className="text-[4rem] font-black leading-none tracking-[-0.06em] text-cyan-300">
                0
              </p>

              <p className="mt-5 text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
                Tarjetas amarillas
              </p>
            </div>

            <div className="rounded-[26px] bg-[#06142d] p-7 text-white sm:p-8">
              <p className="text-[4rem] font-black leading-none tracking-[-0.06em] text-cyan-300">
                0
              </p>

              <p className="mt-5 text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
                Tarjetas rojas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ÚLTIMO PARTIDO */}

      <section className="bg-[#f3f3f1] px-4 py-14 text-[#06142d] sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1300px]">
          <p className="text-[7px] font-black uppercase tracking-[0.27em] text-[#168cab]">
            Último partido
          </p>

          <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
            Jornada reciente
            <span className="text-[#168cab]">.</span>
          </h2>

          <div className="mt-8 overflow-hidden rounded-[28px] bg-[#06142d] text-white">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
              <div>
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-300">
                  Liga Nacional · 06 SEP 2026
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
                    <Image
                      src="/juti.png"
                      alt="Juticalpa"
                      fill
                      quality={100}
                      sizes="64px"
                      className="object-contain"
                    />
                  </div>

                  <div>
                    <p className="text-[7px] font-black uppercase tracking-[0.17em] text-white/30">
                      Rival
                    </p>

                    <p className="mt-1 text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
                      Juticalpa
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <p className="text-[3.5rem] font-black leading-none tracking-[-0.06em] text-cyan-300 sm:text-[5rem]">
                  83
                </p>

                <p className="mt-3 text-[7px] font-black uppercase tracking-[0.2em] text-white/35">
                  Minutos jugados
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 bg-white/[0.03] px-6 py-4 sm:px-8 lg:px-10">
              <p className="text-[7px] font-black uppercase tracking-[0.16em] text-white/30">
                Juticalpa 0–3 Génesis FC
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="bg-[#06142d] px-4 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[7px] font-black uppercase tracking-[0.25em] text-cyan-300">
              Primer equipo
            </p>

            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em]">
              Los Caninos
              <span className="text-cyan-300">.</span>
            </h2>
          </div>

          <Link
            href="/equipo"
            className="inline-flex w-fit rounded-full bg-cyan-300 px-7 py-4 text-[8px] font-black uppercase tracking-[0.16em] text-[#06142d] transition hover:bg-white"
          >
            Ver plantilla completa →
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