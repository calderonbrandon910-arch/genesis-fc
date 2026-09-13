import Image from "next/image";
import Link from "next/link";

import {
  calcularDiferenciaGoles,
  calcularPuntos,
  configuracionFutbol,
  equipos,
  obtenerGenesis,
  partidos,
} from "../../lib/datos-futbol";

function mostrarDG(valor: number) {
  if (valor > 0) {
    return `+${valor}`;
  }

  return String(valor);
}

function obtenerRival(partido: (typeof partidos)[number]) {
  return partido.local === configuracionFutbol.club
    ? partido.visitante
    : partido.local;
}

function obtenerLogoRival(partido: (typeof partidos)[number]) {
  return partido.local === configuracionFutbol.club
    ? partido.logoVisitante
    : partido.logoLocal;
}

function esLocal(partido: (typeof partidos)[number]) {
  return partido.local === configuracionFutbol.club;
}

export default function CommandCenterPage() {
  const genesis = obtenerGenesis();

  if (!genesis) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020817] px-6 text-center text-white">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.28em] text-cyan-300">
            Génesis Command Center
          </p>

          <h1 className="mt-5 text-4xl font-black uppercase tracking-[-0.05em]">
            Datos no disponibles
          </h1>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-white px-7 py-4 text-[8px] font-black uppercase tracking-[0.15em] text-[#06142d]"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const puntosGenesis = calcularPuntos(genesis);
  const dgGenesis = calcularDiferenciaGoles(genesis);

  const tablaOrdenada = [...equipos].sort(
    (a, b) => a.posicion - b.posicion
  );

  const top6 = tablaOrdenada.slice(0, 6);

  const motagua = equipos.find(
    (equipo) => equipo.nombre === "Motagua"
  );

  const lider = tablaOrdenada[0];

  const puntosLider = lider
    ? calcularPuntos(lider)
    : puntosGenesis;

  const distanciaLider =
    puntosLider - puntosGenesis;

  const proximosPartidos = partidos.slice(0, 5);

  const proximoPartido =
    proximosPartidos[0] ?? null;

  const victorias = genesis.g;
  const empates = genesis.e;
  const derrotas = genesis.p;
  const total = genesis.pj || 1;

  const porcentajeVictorias = Math.round(
    (victorias / total) * 100
  );

  const porcentajePuntos = Math.round(
    (puntosGenesis / (total * 3)) * 100
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020817] text-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#020817]/95 backdrop-blur-2xl">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:h-[86px] sm:px-8 lg:px-12">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 sm:gap-4"
          >
            <div className="relative h-11 w-11 shrink-0 sm:h-14 sm:w-14">
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

            <div className="min-w-0">
              <p className="truncate text-sm font-black uppercase sm:text-lg">
                Génesis FC
              </p>

              <p className="mt-1 text-[6px] font-black uppercase tracking-[0.25em] text-cyan-300">
                Command Center
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/calendario"
              className="hidden rounded-full border border-white/15 px-5 py-3 text-[7px] font-black uppercase tracking-[0.15em] text-white/70 transition hover:bg-white hover:text-[#06142d] sm:inline-flex"
            >
              Calendario
            </Link>

            <Link
              href="/"
              className="rounded-full bg-white px-5 py-3 text-[7px] font-black uppercase tracking-[0.15em] text-[#06142d] transition hover:bg-cyan-300 sm:px-6 sm:text-[8px]"
            >
              ← Inicio
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO / STATUS BOARD
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-white/[0.08]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(21,153,189,0.24),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(20,113,213,0.22),transparent_28%)]" />

        <div className="absolute -left-[260px] top-[40px] h-[620px] w-[620px] rounded-full border border-white/[0.03]" />

        <div className="absolute -right-[280px] top-[20px] h-[720px] w-[720px] rounded-full border border-cyan-300/[0.05]" />

        <div className="relative mx-auto max-w-[1600px] px-4 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid gap-10 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-cyan-300" />

                <p className="text-[7px] font-black uppercase tracking-[0.3em] text-cyan-300 sm:text-[8px]">
                  Centro de operaciones · Temporada{" "}
                  {configuracionFutbol.temporada}
                </p>
              </div>

              <h1 className="mt-6 max-w-[980px] text-[3.6rem] font-black uppercase leading-[0.78] tracking-[-0.075em] sm:text-[6.5rem] lg:text-[8.5rem]">
                Génesis
                <br />
                Command
                <br />
                Center
                <span className="text-cyan-300">
                  .
                </span>
              </h1>

              <p className="mt-7 max-w-[720px] border-l border-cyan-300/40 pl-5 text-[12px] leading-6 text-white/55 sm:text-base sm:leading-8">
                Una vista central del presente deportivo de Génesis FC:
                posición, rendimiento, próximos desafíos y contexto de la
                Liga Nacional.
              </p>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[7px] font-black uppercase tracking-[0.22em] text-white/35">
                    Estado actual
                  </p>

                  <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
                    {genesis.posicion}.º lugar
                  </h2>
                </div>

                <div className="relative h-16 w-16 sm:h-20 sm:w-20">
                  <Image
                    src="/genesis.jpg"
                    alt="Escudo de Génesis FC"
                    fill
                    quality={100}
                    sizes="80px"
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-2">
                <div className="rounded-[18px] border border-white/10 bg-black/10 p-4 text-center">
                  <p className="text-2xl font-black text-cyan-300 sm:text-3xl">
                    {puntosGenesis}
                  </p>

                  <p className="mt-2 text-[6px] font-black uppercase tracking-[0.17em] text-white/30">
                    Puntos
                  </p>
                </div>

                <div className="rounded-[18px] border border-white/10 bg-black/10 p-4 text-center">
                  <p className="text-2xl font-black sm:text-3xl">
                    {genesis.pj}
                  </p>

                  <p className="mt-2 text-[6px] font-black uppercase tracking-[0.17em] text-white/30">
                    PJ
                  </p>
                </div>

                <div className="rounded-[18px] border border-white/10 bg-black/10 p-4 text-center">
                  <p className="text-2xl font-black sm:text-3xl">
                    {mostrarDG(dgGenesis)}
                  </p>

                  <p className="mt-2 text-[6px] font-black uppercase tracking-[0.17em] text-white/30">
                    DG
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-[7px] font-black uppercase tracking-[0.16em] text-white/30">
                  Última actualización ·{" "}
                  {configuracionFutbol.ultimaActualizacion}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          KPI BOARD
      ===================================================== */}

      <section className="bg-[#f3f3f1] px-4 py-12 text-[#06142d] sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[26px] bg-[#06142d] p-6 text-white sm:p-7">
              <p className="text-[7px] font-black uppercase tracking-[0.24em] text-cyan-300">
                Rendimiento
              </p>

              <p className="mt-4 text-5xl font-black tracking-[-0.06em]">
                {porcentajePuntos}%
              </p>

              <p className="mt-3 text-xs leading-6 text-white/40">
                De los puntos posibles obtenidos en la temporada.
              </p>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-300"
                  style={{
                    width: `${porcentajePuntos}%`,
                  }}
                />
              </div>
            </article>

            <article className="rounded-[26px] border border-black/[0.06] bg-white p-6 sm:p-7">
              <p className="text-[7px] font-black uppercase tracking-[0.24em] text-[#168cab]">
                Victorias
              </p>

              <p className="mt-4 text-5xl font-black tracking-[-0.06em]">
                {victorias}
              </p>

              <p className="mt-3 text-xs leading-6 text-black/40">
                {porcentajeVictorias}% de los partidos jugados terminaron en
                victoria.
              </p>
            </article>

            <article className="rounded-[26px] border border-black/[0.06] bg-white p-6 sm:p-7">
              <p className="text-[7px] font-black uppercase tracking-[0.24em] text-[#168cab]">
                Goles
              </p>

              <div className="mt-4 flex items-end gap-3">
                <p className="text-5xl font-black tracking-[-0.06em]">
                  {genesis.gf}
                </p>

                <span className="pb-1 text-[8px] font-black uppercase tracking-[0.16em] text-black/25">
                  GF
                </span>
              </div>

              <p className="mt-3 text-xs leading-6 text-black/40">
                {genesis.gc} goles recibidos · DG {mostrarDG(dgGenesis)}
              </p>
            </article>

            <article className="rounded-[26px] border border-black/[0.06] bg-[#dff6fb] p-6 sm:p-7">
              <p className="text-[7px] font-black uppercase tracking-[0.24em] text-[#137c99]">
                Distancia al líder
              </p>

              <p className="mt-4 text-5xl font-black tracking-[-0.06em]">
                {distanciaLider}
              </p>

              <p className="mt-3 text-xs leading-6 text-black/45">
                {distanciaLider === 1
                  ? "punto separa a Génesis del primer lugar."
                  : "puntos separan a Génesis del primer lugar."}
              </p>
            </article>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-black/[0.06] bg-white px-6 py-5">
              <p className="text-[7px] font-black uppercase tracking-[0.2em] text-black/30">
                Récord
              </p>

              <p className="mt-2 text-2xl font-black uppercase">
                {victorias}V · {empates}E · {derrotas}D
              </p>
            </div>

            <div className="rounded-[22px] border border-black/[0.06] bg-white px-6 py-5">
              <p className="text-[7px] font-black uppercase tracking-[0.2em] text-black/30">
                Competición
              </p>

              <p className="mt-2 text-2xl font-black uppercase">
                {configuracionFutbol.competicion}
              </p>
            </div>

            <div className="rounded-[22px] bg-[#168cab] px-6 py-5 text-white">
              <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/45">
                Base
              </p>

              <p className="mt-2 text-2xl font-black uppercase">
                La Paz
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRÓXIMO PARTIDO
      ===================================================== */}

      {proximoPartido && (
        <section className="bg-[#06142d] px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[7px] font-black uppercase tracking-[0.28em] text-cyan-300">
                  Próximo desafío
                </p>

                <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.055em] sm:text-6xl">
                  Matchday radar
                  <span className="text-cyan-300">
                    .
                  </span>
                </h2>
              </div>

              <Link
                href="/partidos/motagua-vs-genesis"
                className="inline-flex w-fit rounded-full bg-cyan-300 px-6 py-4 text-[8px] font-black uppercase tracking-[0.15em] text-[#06142d] transition hover:bg-white"
              >
                Abrir Match Center →
              </Link>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <article className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6 sm:p-9">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[7px] font-black uppercase tracking-[0.22em] text-white/35">
                      Jornada {proximoPartido.jornada}
                    </p>

                    <p className="mt-2 text-[8px] font-black uppercase tracking-[0.16em] text-cyan-300">
                      {proximoPartido.fecha} ·{" "}
                      {proximoPartido.hora}
                    </p>
                  </div>

                  <div className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2">
                    <p className="text-[6px] font-black uppercase tracking-[0.15em] text-cyan-300">
                      Próximo
                    </p>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-[1fr_64px_1fr] items-center gap-3 sm:grid-cols-[1fr_100px_1fr]">
                  <div className="text-center">
                    <div className="relative mx-auto h-24 w-24 sm:h-32 sm:w-32">
                      <Image
                        src={proximoPartido.logoLocal}
                        alt={proximoPartido.local}
                        fill
                        quality={100}
                        sizes="128px"
                        className="object-contain"
                      />
                    </div>

                    <p className="mt-4 text-sm font-black uppercase sm:text-xl">
                      {proximoPartido.local}
                    </p>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[8px] font-black text-white/50 sm:h-20 sm:w-20">
                      VS
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="relative mx-auto h-24 w-24 sm:h-32 sm:w-32">
                      <Image
                        src={proximoPartido.logoVisitante}
                        alt={proximoPartido.visitante}
                        fill
                        quality={100}
                        sizes="128px"
                        className="object-contain"
                      />
                    </div>

                    <p className="mt-4 text-sm font-black uppercase text-cyan-300 sm:text-xl">
                      {proximoPartido.visitante}
                    </p>
                  </div>
                </div>

                <div className="mt-9 border-t border-white/10 pt-6 text-center">
                  <p className="text-[8px] font-black uppercase tracking-[0.15em] text-white/35">
                    {proximoPartido.estadio} ·{" "}
                    {proximoPartido.ciudad}
                  </p>
                </div>
              </article>

              <aside className="rounded-[30px] bg-white p-6 text-[#06142d] sm:p-9">
                <p className="text-[7px] font-black uppercase tracking-[0.24em] text-[#168cab]">
                  Contexto directo
                </p>

                <h3 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] sm:text-4xl">
                  Génesis vs rival
                </h3>

                {motagua && (
                  <div className="mt-8 space-y-4">
                    {[
                      [
                        "Posición",
                        `${genesis.posicion}.º`,
                        `${motagua.posicion}.º`,
                      ],
                      [
                        "Puntos",
                        calcularPuntos(genesis),
                        calcularPuntos(motagua),
                      ],
                      [
                        "Goles a favor",
                        genesis.gf,
                        motagua.gf,
                      ],
                      [
                        "Goles en contra",
                        genesis.gc,
                        motagua.gc,
                      ],
                      [
                        "Diferencia",
                        mostrarDG(
                          calcularDiferenciaGoles(
                            genesis
                          )
                        ),
                        mostrarDG(
                          calcularDiferenciaGoles(
                            motagua
                          )
                        ),
                      ],
                    ].map(
                      ([label, genesisValor, rivalValor]) => (
                        <div
                          key={String(label)}
                          className="grid grid-cols-[1fr_80px_80px] items-center gap-3 border-b border-black/[0.06] pb-4 last:border-b-0"
                        >
                          <p className="text-[7px] font-black uppercase tracking-[0.15em] text-black/35">
                            {label}
                          </p>

                          <p className="text-center text-sm font-black text-[#168cab]">
                            {genesisValor}
                          </p>

                          <p className="text-center text-sm font-black">
                            {rivalValor}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}

                <div className="mt-7 grid grid-cols-2 gap-3">
                  <div className="rounded-[18px] bg-[#e9f6f9] p-4 text-center">
                    <p className="text-[6px] font-black uppercase tracking-[0.15em] text-[#168cab]">
                      Génesis
                    </p>

                    <p className="mt-2 text-lg font-black">
                      {puntosGenesis} pts
                    </p>
                  </div>

                  <div className="rounded-[18px] bg-[#f3f3f1] p-4 text-center">
                    <p className="text-[6px] font-black uppercase tracking-[0.15em] text-black/35">
                      Motagua
                    </p>

                    <p className="mt-2 text-lg font-black">
                      {motagua
                        ? calcularPuntos(
                            motagua
                          )
                        : "—"}{" "}
                      pts
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          TOP 6
      ===================================================== */}

      <section className="bg-[#f3f3f1] px-4 py-16 text-[#06142d] sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-6 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[7px] font-black uppercase tracking-[0.28em] text-[#168cab]">
                Liga Nacional
              </p>

              <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.055em] sm:text-6xl">
                Radar de tabla
                <span className="text-[#168cab]">
                  .
                </span>
              </h2>
            </div>

            <Link
              href="/calendario"
              className="inline-flex w-fit rounded-full bg-[#06142d] px-6 py-4 text-[8px] font-black uppercase tracking-[0.15em] text-white transition hover:bg-[#168cab]"
            >
              Tabla completa →
            </Link>
          </div>

          <div className="mt-8 overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_70px_rgba(6,20,45,0.05)]">
            {top6.map((equipo) => {
              const esGenesis =
                equipo.nombre ===
                configuracionFutbol.club;

              return (
                <div
                  key={equipo.nombre}
                  className={`grid grid-cols-[40px_minmax(0,1fr)_45px_45px_52px] items-center gap-2 border-b border-black/[0.06] px-4 py-4 last:border-b-0 sm:grid-cols-[56px_minmax(0,1fr)_70px_70px_80px] sm:px-7 sm:py-5 ${
                    esGenesis
                      ? "bg-[#e8f6f9]"
                      : ""
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[8px] font-black ${
                      esGenesis
                        ? "bg-[#168cab] text-white"
                        : "bg-[#06142d] text-white"
                    }`}
                  >
                    {equipo.posicion}
                  </div>

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0">
                      <Image
                        src={equipo.logo}
                        alt={equipo.nombre}
                        fill
                        quality={100}
                        sizes="36px"
                        className="object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`truncate text-[9px] font-black uppercase sm:text-xs ${
                          esGenesis
                            ? "text-[#137c99]"
                            : ""
                        }`}
                      >
                        {equipo.nombre}
                      </p>

                      {esGenesis && (
                        <p className="mt-1 text-[5px] font-black uppercase tracking-[0.15em] text-[#168cab]">
                          Los Caninos
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-[6px] font-black uppercase text-black/25">
                      PJ
                    </p>

                    <p className="mt-1 text-xs font-black">
                      {equipo.pj}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-[6px] font-black uppercase text-black/25">
                      DG
                    </p>

                    <p className="mt-1 text-xs font-black">
                      {mostrarDG(
                        calcularDiferenciaGoles(
                          equipo
                        )
                      )}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-[6px] font-black uppercase text-black/25">
                      PTS
                    </p>

                    <p className="mt-1 text-lg font-black">
                      {calcularPuntos(equipo)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          CALENDARIO OPERATIVO
      ===================================================== */}

      <section className="bg-[#071a3b] px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[7px] font-black uppercase tracking-[0.28em] text-cyan-300">
                Agenda
              </p>

              <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.055em] sm:text-6xl">
                Próximas misiones
                <span className="text-cyan-300">
                  .
                </span>
              </h2>
            </div>

            <p className="max-w-[450px] text-xs leading-6 text-white/35">
              Los próximos encuentros publicados en el calendario oficial del
              sitio.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {proximosPartidos.map(
              (partido, index) => (
                <article
                  key={`${partido.jornada}-${partido.local}-${partido.visitante}`}
                  className={`rounded-[26px] border p-5 sm:p-6 ${
                    index === 0
                      ? "border-cyan-300/25 bg-cyan-300/[0.07]"
                      : "border-white/10 bg-white/[0.035]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-[6px] font-black uppercase tracking-[0.2em] text-white/30">
                        Jornada {partido.jornada}
                      </p>

                      <p className="mt-2 text-[7px] font-black uppercase tracking-[0.16em] text-cyan-300">
                        {partido.fecha} ·{" "}
                        {partido.hora}
                      </p>
                    </div>

                    <div className="rounded-full border border-white/10 px-3 py-2">
                      <p className="text-[5px] font-black uppercase tracking-[0.12em] text-white/35">
                        {esLocal(partido)
                          ? "Local"
                          : "Visitante"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 flex items-center gap-4">
                    <div className="relative h-14 w-14 shrink-0">
                      <Image
                        src={obtenerLogoRival(
                          partido
                        )}
                        alt={obtenerRival(
                          partido
                        )}
                        fill
                        quality={100}
                        sizes="56px"
                        className="object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[6px] font-black uppercase tracking-[0.16em] text-white/30">
                        Rival
                      </p>

                      <h3 className="mt-1 truncate text-xl font-black uppercase sm:text-2xl">
                        {obtenerRival(
                          partido
                        )}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="text-[7px] font-black uppercase tracking-[0.14em] text-white/30">
                      {partido.estadio} ·{" "}
                      {partido.ciudad}
                    </p>
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          CIERRE
      ===================================================== */}

      <section className="bg-[#f3f3f1] px-4 py-14 text-[#06142d] sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 rounded-[30px] bg-white p-7 shadow-[0_20px_70px_rgba(6,20,45,0.06)] sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <p className="text-[7px] font-black uppercase tracking-[0.24em] text-[#168cab]">
              Génesis Command Center
            </p>

            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.055em] sm:text-5xl">
              Todo el presente.
              <br />
              Un solo lugar
              <span className="text-[#168cab]">
                .
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <Link
              href="/calendario"
              className="inline-flex justify-center rounded-full bg-[#06142d] px-7 py-4 text-[8px] font-black uppercase tracking-[0.15em] text-white transition hover:bg-[#168cab]"
            >
              Ver calendario →
            </Link>

            <Link
              href="/"
              className="inline-flex justify-center rounded-full border border-black/10 px-7 py-4 text-[8px] font-black uppercase tracking-[0.15em] transition hover:bg-black/[0.04]"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-[#020817] px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image
                src="/genesis.jpg"
                alt="Génesis FC"
                fill
                quality={100}
                sizes="40px"
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-xs font-black uppercase">
                Génesis FC
              </p>

              <p className="mt-1 text-[6px] font-black uppercase tracking-[0.16em] text-cyan-300/60">
                Command Center
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/"
              className="text-[6px] font-black uppercase tracking-[0.16em] text-white/30 transition hover:text-white"
            >
              Inicio
            </Link>

            <Link
              href="/calendario"
              className="text-[6px] font-black uppercase tracking-[0.16em] text-white/30 transition hover:text-white"
            >
              Calendario
            </Link>

            <Link
              href="/equipo"
              className="text-[6px] font-black uppercase tracking-[0.16em] text-white/30 transition hover:text-white"
            >
              Equipo
            </Link>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 pt-6 sm:flex-row sm:justify-between">
          <p className="text-[6px] font-black uppercase tracking-[0.14em] text-white/20">
            © 2026 Génesis FC. Todos los derechos reservados.
          </p>

          <p className="text-[6px] font-black uppercase tracking-[0.14em] text-white/20">
            La Paz · Honduras
          </p>
        </div>
      </footer>
    </main>
  );
}
