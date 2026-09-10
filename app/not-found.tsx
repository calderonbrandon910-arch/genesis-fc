import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#020817] text-white">
      {/* FONDO */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#020817] via-[#061b3d] to-[#0a4f9d]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(39,209,255,0.16),transparent_32%)]" />

      <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full border border-white/[0.05]" />

      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full border border-cyan-300/[0.07]" />

      {/* CONTENIDO */}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-5 py-8 sm:px-8 lg:px-12">
        {/* HEADER */}

        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-12 w-12 sm:h-14 sm:w-14">
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

              <p className="mt-1 text-[6px] font-black uppercase tracking-[0.24em] text-cyan-300">
                Sitio oficial
              </p>
            </div>
          </Link>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-[7px] font-black uppercase tracking-[0.18em] text-white/40 backdrop-blur-md sm:px-5">
            Error 404
          </span>
        </header>

        {/* CENTRO */}

        <section className="flex flex-1 items-center py-14 sm:py-20">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_0.7fr] lg:gap-20">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-cyan-300" />

                <p className="text-[7px] font-black uppercase tracking-[0.3em] text-cyan-300 sm:text-[9px]">
                  Página no encontrada
                </p>
              </div>

              <div className="relative mt-7">
                <p className="pointer-events-none absolute -left-2 -top-14 text-[10rem] font-black leading-none tracking-[-0.1em] text-white/[0.035] sm:-top-24 sm:text-[17rem] lg:text-[22rem]">
                  404
                </p>

                <h1 className="relative max-w-[850px] text-[4rem] font-black uppercase leading-[0.82] tracking-[-0.07em] sm:text-[6.5rem] lg:text-[8.5rem]">
                  Fuera
                  <br />
                  de juego
                  <span className="text-cyan-300">.</span>
                </h1>
              </div>

              <p className="mt-8 max-w-[600px] border-l border-cyan-300/40 pl-5 text-[12px] leading-6 text-white/55 sm:text-base sm:leading-8">
                La página que buscas no existe, cambió de dirección o ya no
                está disponible. Regresa al inicio y continúa siguiendo toda
                la actualidad de Los Caninos.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex rounded-full bg-cyan-300 px-7 py-4 text-[8px] font-black uppercase tracking-[0.16em] text-[#06142d] transition hover:bg-white"
                >
                  Volver al inicio →
                </Link>

                <Link
                  href="/calendario"
                  className="inline-flex rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-[8px] font-black uppercase tracking-[0.16em] text-white/70 transition hover:bg-white hover:text-[#06142d]"
                >
                  Ver calendario
                </Link>
              </div>
            </div>

            {/* ESCUDO */}

            <div className="relative mx-auto flex w-full max-w-[420px] items-center justify-center lg:max-w-[500px]">
              <div className="absolute h-[330px] w-[330px] rounded-full border border-cyan-300/[0.08] sm:h-[420px] sm:w-[420px]" />

              <div className="absolute h-[250px] w-[250px] rounded-full border border-white/[0.06] sm:h-[330px] sm:w-[330px]" />

              <div className="relative flex aspect-square w-[240px] items-center justify-center rounded-full border border-white/10 bg-white/[0.04] shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-md sm:w-[320px]">
                <div className="relative h-[170px] w-[170px] sm:h-[230px] sm:w-[230px]">
                  <Image
                    src="/genesis.jpg"
                    alt="Escudo de Génesis FC"
                    fill
                    priority
                    quality={100}
                    sizes="230px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}

        <footer className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[6px] font-black uppercase tracking-[0.16em] text-white/20">
            © 2026 Génesis FC. Todos los derechos reservados.
          </p>

          <p className="text-[6px] font-black uppercase tracking-[0.16em] text-white/20">
            La Paz · Honduras
          </p>
        </footer>
      </div>
    </main>
  );
}