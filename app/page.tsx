"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AsistenteGenesis from "./components/AsistenteGenesis";

/* =========================================================
   NOTICIAS
========================================================= */

const noticias = [
  {
    imagen: "/golmotagua.jpg",
    categoria: "PRIMER EQUIPO",
    fecha: "12 SEP 2026",
    titulo: "Motagua se impone 1-0 ante Génesis FC",
    enlace: "/noticias/motagua-1-0-genesis",
  },
  {
    imagen: "/tapadabalanta.png",
    categoria: "PRIMER EQUIPO",
    fecha: "12 SEP 2026",
    titulo: "La tapada de Balanta",
    enlace: "/noticias/la-tapada-de-balanta",
  },
  {
    imagen: "/motagua-genesis-portada-4.jpg",
    categoria: "PRIMER EQUIPO",
    fecha: "09 SEP 2026",
    titulo: "Partido intenso el fin de semana",
    enlace: "/noticias/genesis-prepara-proximo-desafio",
  },
];

/* =========================================================
   RESULTADOS
========================================================= */

const resultados = [
  {
    fecha: "12 SEP 2026",
    competicion: "Liga Nacional",
    local: "Motagua",
    logoLocal: "/motagua.png",
    golesLocal: 1,
    visitante: "Génesis FC",
    logoVisitante: "/genesis.jpg",
    golesVisitante: 0,
    resultadoGenesis: "Derrota",
  },
  {
    fecha: "06 SEP 2026",
    competicion: "Liga Nacional",
    local: "Juticalpa",
    logoLocal: "/juti.png",
    golesLocal: 0,
    visitante: "Génesis FC",
    logoVisitante: "/genesis.jpg",
    golesVisitante: 3,
    resultadoGenesis: "Victoria",
  },
  {
    fecha: "29 AGO 2026",
    competicion: "Liga Nacional",
    local: "Génesis FC",
    logoLocal: "/genesis.jpg",
    golesLocal: 1,
    visitante: "Marathón",
    logoVisitante: "/marathon.png",
    golesVisitante: 2,
    resultadoGenesis: "Derrota",
  },
  {
    fecha: "22 AGO 2026",
    competicion: "Liga Nacional",
    local: "Atlético Independiente",
    logoLocal: "/independiente.png",
    golesLocal: 1,
    visitante: "Génesis FC",
    logoVisitante: "/genesis.jpg",
    golesVisitante: 1,
    resultadoGenesis: "Empate",
  },
];

/* =========================================================
   JUGADORES DESTACADOS
========================================================= */

const jugadores = [
  {
    nombre: "Balanta",
    posicion: "Portero",
    imagen: "/balanta-2.jpg",
    numero: "01",
    enlace: "/equipo/balanta",
  },
  {
    nombre: "Araujo",
    posicion: "Defensa",
    imagen: "/araujo.jpg",
    numero: "02",
    enlace: "/equipo/gabriel-araujo",
  },
  {
    nombre: "Sander",
    posicion: "Mediocampista",
    imagen: "/sander.jpg",
    numero: "03",
    enlace: "/equipo/sander",
  },
  {
    nombre: "Guillén",
    posicion: "Mediocampista",
    imagen: "/guillen.jpg",
    numero: "04",
    enlace: "/equipo/cesar-guillen",
  },
];

/* =========================================================
   CONTADOR
========================================================= */

type TiempoRestante = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
};

function calcularTiempoRestante(): TiempoRestante {
  const fechaPartido = new Date(
    "2026-09-19T15:00:00-06:00"
  ).getTime();

  const diferencia = Math.max(
    fechaPartido - Date.now(),
    0
  );

  return {
    dias: Math.floor(
      diferencia / 86_400_000
    ),

    horas: Math.floor(
      (diferencia % 86_400_000) /
        3_600_000
    ),

    minutos: Math.floor(
      (diferencia % 3_600_000) /
        60_000
    ),

    segundos: Math.floor(
      (diferencia % 60_000) /
        1_000
    ),
  };
}

function CuentaRegresiva() {
  const [montado, setMontado] =
    useState(false);

  const [tiempo, setTiempo] =
    useState<TiempoRestante>({
      dias: 0,
      horas: 0,
      minutos: 0,
      segundos: 0,
    });

  useEffect(() => {
    setMontado(true);

    const actualizar = () => {
      setTiempo(
        calcularTiempoRestante()
      );
    };

    actualizar();

    const intervalo =
      window.setInterval(
        actualizar,
        1000
      );

    return () => {
      window.clearInterval(
        intervalo
      );
    };
  }, []);

  if (!montado) {
    return (
      <div
        className="mx-auto mt-10 max-w-[800px]"
        aria-label="Cargando cuenta regresiva del próximo partido"
      >
        <div className="flex min-h-[120px] items-center justify-center">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-2 w-2 animate-pulse rounded-full bg-cyan-300"
            />

            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
              Activando reloj...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const terminado =
    tiempo.dias === 0 &&
    tiempo.horas === 0 &&
    tiempo.minutos === 0 &&
    tiempo.segundos === 0;

  if (terminado) {
    return (
      <div className="mx-auto mt-10 max-w-[760px]">
        <div
          className="rounded-[28px] border border-cyan-300/30 bg-cyan-300/[0.08] px-6 py-10 text-center"
          aria-label="Hoy juega Génesis FC contra Olancho FC a las 3 de la tarde"
        >
          <span
            aria-hidden="true"
            className="inline-block h-3 w-3 animate-pulse rounded-full bg-cyan-300"
          />

          <p className="mt-5 text-[8px] font-black uppercase tracking-[0.35em] text-cyan-300">
            Matchday
          </p>

          <h3 className="mt-4 text-3xl font-black uppercase sm:text-5xl">
            ¡Hoy juega Génesis!
          </h3>

          <p className="mt-4 text-xs text-white/40">
            Génesis FC vs Olancho FC · 3:00 PM
          </p>
        </div>
      </div>
    );
  }

  const bloques = [
    {
      nombre: "DÍAS",
      valor: tiempo.dias,
    },
    {
      nombre: "HORAS",
      valor: tiempo.horas,
    },
    {
      nombre: "MIN",
      valor: tiempo.minutos,
    },
    {
      nombre: "SEG",
      valor: tiempo.segundos,
    },
  ];

  return (
    <div
      className="mx-auto mt-10 max-w-[820px]"
      role="timer"
      aria-live="off"
      aria-label={`Faltan ${tiempo.dias} días, ${tiempo.horas} horas y ${tiempo.minutos} minutos para Génesis FC contra Olancho FC`}
    >
      <div className="mb-6 text-center">
        <p className="text-[8px] font-black uppercase tracking-[0.32em] text-cyan-300 sm:text-[9px]">
          Cuenta regresiva
        </p>

        <p className="mt-3 text-[7px] font-black uppercase tracking-[0.16em] text-white/30 sm:text-[8px]">
          Falta para Génesis FC vs Olancho FC
        </p>
      </div>

      <div
        className="grid grid-cols-4 gap-2 sm:gap-4"
        aria-hidden="true"
      >
        {bloques.map(
          (bloque, index) => (
            <div
              key={bloque.nombre}
              className={`relative overflow-hidden rounded-[18px] border px-1 py-5 text-center sm:rounded-[26px] sm:px-3 sm:py-8 ${
                index === 3
                  ? "border-cyan-300/30 bg-cyan-300/[0.08]"
                  : "border-white/10 bg-white/[0.055]"
              }`}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

              <p
                className={`text-2xl font-black tabular-nums sm:text-5xl lg:text-6xl ${
                  index === 3
                    ? "text-cyan-300"
                    : "text-white"
                }`}
              >
                {String(
                  bloque.valor
                ).padStart(
                  2,
                  "0"
                )}
              </p>

              <p className="mt-2 text-[5px] font-black uppercase tracking-[0.18em] text-cyan-300 sm:text-[8px]">
                {bloque.nombre}
              </p>
            </div>
          )
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300"
        />

        <p className="text-center text-[7px] font-black uppercase tracking-[0.17em] text-white/40 sm:text-[8px]">
          19 SEP 2026 · 3:00 PM · HONDURAS
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   HOME 2.0 · ESTADO DEL PARTIDO
========================================================= */

type HomeMatchStatus =
  | "pre_match"
  | "first_half"
  | "halftime"
  | "second_half"
  | "paused"
  | "finished";

type HomeLiveMatch = {
  slug: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  status: HomeMatchStatus;
  is_live: boolean;
  scheduled_at: string;
};

type HomeLiveResponse = {
  ok: boolean;
  match?: HomeLiveMatch;
};

const HOME_MATCH_SLUG =
  "genesis-vs-olancho-2026-09-19";

function etiquetaEstadoPartido(
  status?: HomeMatchStatus
) {
  switch (status) {
    case "first_half":
      return "1T";
    case "halftime":
      return "MEDIO TIEMPO";
    case "second_half":
      return "2T";
    case "paused":
      return "PAUSADO";
    case "finished":
      return "FINAL";
    default:
      return "PRÓXIMO PARTIDO";
  }
}

/* =========================================================
   HOME
========================================================= */

export default function Home() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [liveMatch, setLiveMatch] =
    useState<HomeLiveMatch | null>(
      null
    );

  useEffect(() => {
    let activo = true;

    async function cargarEstadoPartido() {
      try {
        const response = await fetch(
          `/api/live?slug=${encodeURIComponent(
            HOME_MATCH_SLUG
          )}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const data =
          (await response.json()) as HomeLiveResponse;

        if (
          activo &&
          data.ok &&
          data.match
        ) {
          setLiveMatch(data.match);
        }
      } catch {
        // El Home conserva su contenido estático si Live Ops no responde.
      }
    }

    cargarEstadoPartido();

    const poll = window.setInterval(
      cargarEstadoPartido,
      5000
    );

    return () => {
      activo = false;
      window.clearInterval(poll);
    };
  }, []);

  const partidoEnVivo =
    liveMatch?.status ===
      "first_half" ||
    liveMatch?.status ===
      "halftime" ||
    liveMatch?.status ===
      "second_half" ||
    liveMatch?.status ===
      "paused";

  const partidoFinalizado =
    liveMatch?.status ===
    "finished";

  const mostrarCuentaRegresiva =
    !partidoEnVivo &&
    !partidoFinalizado;

  const estadoPartido =
    etiquetaEstadoPartido(
      liveMatch?.status
    );

  const marcadorHome =
    liveMatch
      ? `${liveMatch.home_score} - ${liveMatch.away_score}`
      : "0 - 0";

  const focusDark =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020817]";

  const focusLight =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168cab] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020817] text-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#020817]/95 backdrop-blur-2xl">
        <div className="mx-auto flex h-[70px] max-w-[1700px] items-center justify-between px-4 sm:h-[82px] sm:px-8 lg:px-12 xl:px-16">
          <Link
            href="/"
            aria-label="Ir al inicio de Génesis FC"
            className={`flex min-w-0 items-center gap-3 sm:gap-4 ${focusDark}`}
          >
            <div className="relative h-11 w-11 shrink-0 sm:h-16 sm:w-16">
              <Image
                src="/genesis.jpg"
                alt="Génesis FC"
                fill
                priority
                quality={100}
                sizes="64px"
                className="object-contain"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[14px] font-black uppercase tracking-[-0.03em] sm:text-xl">
                Génesis FC
              </p>

              <p className="mt-1 text-[6px] font-black uppercase tracking-[0.22em] text-cyan-300 sm:text-[7px] sm:tracking-[0.36em]">
                La Paz · Honduras
              </p>
            </div>
          </Link>

          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-8 lg:flex xl:gap-10"
          >
            {[
              ["Inicio", "#inicio"],
              ["Noticias", "#noticias"],
              ["Partidos", "#partidos"],
              ["Resultados", "#resultados"],
              ["Club", "#club"],
              ["Equipo", "#equipo"],
            ].map(
              ([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className={`text-[9px] font-black uppercase tracking-[0.18em] text-white/45 transition hover:text-white ${focusDark}`}
                >
                  {label}
                </a>
              )
            )}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/buscar"
              aria-label="Buscar en Génesis FC"
              className={`flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/15 text-lg text-white/65 transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.08] hover:text-cyan-300 ${focusDark}`}
            >
              <span aria-hidden="true">⌕</span>
            </Link>

            <Link
              href="/calendario"
              className={`rounded-full border border-white/15 px-7 py-4 text-[9px] font-black uppercase tracking-[0.16em] transition hover:bg-white hover:text-[#020817] ${focusDark}`}
            >
              Calendario
            </Link>

            <a
              href="#partidos"
              className={`rounded-full bg-white px-7 py-4 text-[9px] font-black uppercase tracking-[0.16em] text-[#020817] ${focusDark}`}
            >
              Próximo partido
            </a>
          </div>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label={
              menuOpen
                ? "Cerrar menú de navegación"
                : "Abrir menú de navegación"
            }
            onClick={() =>
              setMenuOpen(
                !menuOpen
              )
            }
            className={`shrink-0 rounded-full border border-white/15 px-4 py-2.5 text-[7px] font-black uppercase tracking-[0.13em] lg:hidden ${focusDark}`}
          >
            {menuOpen
              ? "Cerrar"
              : "Menú"}
          </button>
        </div>

        {menuOpen && (
          <div
            id="menu-movil"
            className="border-t border-white/10 bg-[#020817] lg:hidden"
          >
            <nav
              aria-label="Navegación móvil"
              className="flex flex-col px-5 py-5"
            >
              {[
                ["Inicio", "#inicio"],
                ["Noticias", "#noticias"],
                ["Partidos", "#partidos"],
                ["Resultados", "#resultados"],
                ["Club", "#club"],
                ["Equipo", "#equipo"],
              ].map(
                ([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className={`border-b border-white/[0.07] py-4 text-[10px] font-black uppercase tracking-[0.13em] ${focusDark}`}
                  >
                    {label}
                  </a>
                )
              )}

              <Link
                href="/buscar"
                onClick={() =>
                  setMenuOpen(false)
                }
                className={`mt-5 flex items-center justify-center gap-3 rounded-full border border-cyan-300/30 bg-cyan-300/[0.08] py-4 text-center text-[9px] font-black uppercase tracking-[0.15em] text-cyan-300 ${focusDark}`}
              >
                <span aria-hidden="true" className="text-sm">⌕</span>
                Buscar en Génesis
              </Link>

              <Link
                href="/equipo"
                onClick={() =>
                  setMenuOpen(false)
                }
                className={`mt-2 rounded-full border border-white/12 py-4 text-center text-[9px] font-black uppercase tracking-[0.15em] text-white/70 ${focusDark}`}
              >
                Ver plantilla
              </Link>

              <Link
                href="/calendario"
                onClick={() =>
                  setMenuOpen(false)
                }
                className={`mt-2 rounded-full bg-white py-4 text-center text-[10px] font-black uppercase text-[#020817] ${focusDark}`}
              >
                Ver calendario
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* =====================================================
          HERO MÓVIL
      ===================================================== */}

      <section
        id="inicio"
        className="bg-[#020817] pt-[70px] sm:hidden"
      >
        <div className="relative w-full bg-[#07152f]">
          <Image
            src="/hero-genesis.jpg"
            alt="Jugadores de Génesis FC"
            width={2400}
            height={1350}
            priority
            sizes="100vw"
            className="h-auto w-full object-contain"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#020817] to-transparent"
          />
        </div>

        <div className="relative px-5 pb-12 pt-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-7 bg-cyan-300"
            />

            <p className="text-[6px] font-black uppercase tracking-[0.25em] text-cyan-300">
              Club Deportivo Génesis FC
            </p>
          </div>

          <h1 className="mt-5 text-[3.65rem] font-black uppercase leading-[0.78] tracking-[-0.07em] min-[390px]:text-[4rem]">
            Somos
            <br />
            Génesis
            <span className="text-cyan-300">
              .
            </span>
          </h1>

          <p className="mt-6 max-w-[350px] border-l border-cyan-300/50 pl-4 text-[11px] font-medium leading-5 text-white/65">
            Orgullo de La Paz. Una ciudad, un escudo, una identidad.
          </p>

          <Link
            href="/partidos/genesis-vs-olancho"
            className={`mt-6 block rounded-[20px] border px-4 py-4 transition ${
              partidoEnVivo
                ? "border-emerald-300/35 bg-emerald-300/[0.10]"
                : partidoFinalizado
                  ? "border-cyan-300/25 bg-cyan-300/[0.07]"
                  : "border-white/10 bg-white/[0.04]"
            } ${focusDark}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 rounded-full ${
                      partidoEnVivo
                        ? "animate-pulse bg-emerald-300"
                        : "bg-cyan-300"
                    }`}
                  />

                  <p
                    className={`text-[6px] font-black uppercase tracking-[0.19em] ${
                      partidoEnVivo
                        ? "text-emerald-300"
                        : "text-cyan-300"
                    }`}
                  >
                    {estadoPartido}
                  </p>
                </div>

                <p className="mt-2 text-[11px] font-black uppercase">
                  Génesis FC vs Olancho FC
                </p>

                <p className="mt-1 text-[7px] font-bold uppercase tracking-[0.12em] text-white/35">
                  {partidoEnVivo ||
                  partidoFinalizado
                    ? `Marcador ${marcadorHome}`
                    : "19 SEP 2026 · 3:00 PM"}
                </p>
              </div>

              <span className="text-lg text-cyan-300">
                →
              </span>
            </div>
          </Link>

          <div className="mt-7 flex flex-col gap-2.5">
            <a
              href="#partidos"
              className={`rounded-full bg-white px-6 py-3.5 text-center text-[7px] font-black uppercase tracking-[0.13em] text-[#020817] ${focusDark}`}
            >
              {partidoEnVivo
                ? "Seguir en vivo →"
                : partidoFinalizado
                  ? "Ver resultado →"
                  : "Próximo partido →"}
            </a>

            <Link
              href="/equipo"
              className={`rounded-full border border-cyan-300/25 bg-cyan-300/[0.07] px-6 py-3.5 text-center text-[7px] font-black uppercase tracking-[0.13em] text-cyan-300 ${focusDark}`}
            >
              Ver plantilla →
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          HERO PC
      ===================================================== */}

      <section className="relative hidden min-h-[100svh] overflow-hidden sm:block">
        <Image
          src="/hero-genesis.jpg"
          alt="Jugadores de Génesis FC"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center] lg:object-[65%_center]"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#010716]/98 via-[#032356]/78 to-[#046fd0]/15"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#020817]/95 via-transparent to-[#020817]/45"
        />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1700px] items-end px-8 pb-20 pt-32 lg:items-center lg:px-12 xl:px-16">
          <div className="max-w-[950px]">
            <div className="mb-7 flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-px w-10 bg-cyan-300"
              />

              <p className="text-[9px] font-black uppercase tracking-[0.38em] text-cyan-300">
                Club Deportivo Génesis FC
              </p>
            </div>

            <h1 className="text-[5.5rem] font-black uppercase leading-[0.76] tracking-[-0.08em] lg:text-[clamp(6rem,9vw,10rem)] lg:leading-[0.74]">
              Somos
              <br />
              Génesis
              <span className="text-cyan-300">
                .
              </span>
            </h1>

            <p className="mt-9 max-w-[620px] border-l border-cyan-300/50 pl-5 text-base font-medium leading-7 text-white/70 lg:text-lg">
              Orgullo de La Paz. Una ciudad, un escudo, una identidad.
            </p>

            <Link
              href="/partidos/genesis-vs-olancho"
              className={`mt-8 inline-flex min-w-[420px] items-center justify-between gap-8 rounded-[22px] border px-6 py-5 backdrop-blur-xl transition ${
                partidoEnVivo
                  ? "border-emerald-300/35 bg-emerald-300/[0.10]"
                  : partidoFinalizado
                    ? "border-cyan-300/25 bg-cyan-300/[0.07]"
                    : "border-white/10 bg-white/[0.05]"
              } ${focusDark}`}
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 rounded-full ${
                      partidoEnVivo
                        ? "animate-pulse bg-emerald-300"
                        : "bg-cyan-300"
                    }`}
                  />

                  <p
                    className={`text-[7px] font-black uppercase tracking-[0.22em] ${
                      partidoEnVivo
                        ? "text-emerald-300"
                        : "text-cyan-300"
                    }`}
                  >
                    {estadoPartido}
                  </p>
                </div>

                <p className="mt-2 text-sm font-black uppercase">
                  Génesis FC vs Olancho FC
                </p>

                <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-white/35">
                  {partidoEnVivo ||
                  partidoFinalizado
                    ? `Marcador ${marcadorHome}`
                    : "19 SEP 2026 · 3:00 PM · LA PAZ"}
                </p>
              </div>

              <span className="text-xl text-cyan-300">
                →
              </span>
            </Link>

            <div className="mt-10 flex gap-3">
              <a
                href="#partidos"
                className={`rounded-full bg-white px-8 py-4 text-center text-[9px] font-black uppercase tracking-[0.17em] text-[#020817] ${focusDark}`}
              >
                {partidoEnVivo
                  ? "Seguir en vivo →"
                  : partidoFinalizado
                    ? "Ver resultado →"
                    : "Próximo partido →"}
              </a>

              <Link
                href="/equipo"
                className={`rounded-full border border-white/20 bg-white/[0.05] px-8 py-4 text-center text-[9px] font-black uppercase tracking-[0.17em] ${focusDark}`}
              >
                Primer equipo →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          NOTICIAS
      ===================================================== */}

      <section
        id="noticias"
        aria-labelledby="titulo-noticias"
        className="bg-[#f3f3f2] px-4 py-14 text-[#06142d] sm:px-8 sm:py-20 lg:px-12 lg:py-28 xl:px-16"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-6 border-b border-black/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[7px] font-black uppercase tracking-[0.26em] text-[#0d72d6] sm:text-[9px]">
                Génesis Newsroom
              </p>

              <h2
                id="titulo-noticias"
                className="mt-3 text-[2.9rem] font-black uppercase leading-[0.85] tracking-[-0.06em] sm:text-[4.5rem] lg:text-[6.6rem]"
              >
                Lo último
                <span className="text-[#1699bd]">
                  .
                </span>
              </h2>

              <p className="mt-4 max-w-[620px] text-xs font-medium leading-6 text-[#06142d]/50 sm:text-sm">
                Noticias, resultados e historias del club en un solo lugar.
              </p>
            </div>

            <Link
              href="/noticias"
              className={`w-fit rounded-full border border-[#06142d]/15 px-5 py-3 text-[7px] font-black uppercase tracking-[0.15em] transition hover:border-[#168cab] hover:bg-[#168cab] hover:text-white sm:text-[8px] ${focusLight}`}
            >
              Ver todas las noticias →
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#06142d] px-4 py-2 text-[6px] font-black uppercase tracking-[0.16em] text-white sm:text-[7px]">
              En portada
            </span>

            {noticias.map((noticia) => (
              <Link
                key={`portada-${noticia.titulo}`}
                href={noticia.enlace}
                className={`rounded-full border border-black/10 bg-white px-4 py-2 text-[6px] font-black uppercase tracking-[0.12em] text-[#06142d]/60 transition hover:border-[#168cab]/40 hover:text-[#168cab] sm:text-[7px] ${focusLight}`}
              >
                {noticia.titulo}
              </Link>
            ))}
          </div>

          {/* NOTICIA PRINCIPAL */}

          <article className="mt-8 overflow-hidden rounded-[26px] bg-[#06142d] text-white lg:rounded-[34px]">
            <div className="lg:hidden">
              <div className="relative aspect-[16/11] min-h-[320px] sm:min-h-[480px]">
                <Image
                  src={noticias[0].imagen}
                  alt={noticias[0].titulo}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#020817]/90 via-[#020817]/10 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-300">
                    {noticias[0].categoria} ·{" "}
                    {noticias[0].fecha}
                  </p>

                  <div className="mt-5">
                    <h3 className="text-[2.15rem] font-black uppercase leading-[0.9] tracking-[-0.055em]">
                      Motagua
                    </h3>

                    <div className="my-3 flex items-center gap-3">
                      <span className="text-[2.8rem] font-black leading-none tracking-[-0.08em] text-white">
                        1
                      </span>

                      <span className="h-px w-8 bg-cyan-300/70" />

                      <span className="text-[2.8rem] font-black leading-none tracking-[-0.08em] text-cyan-300">
                        0
                      </span>
                    </div>

                    <h3 className="text-[2.15rem] font-black uppercase leading-[0.9] tracking-[-0.055em]">
                      Génesis FC
                    </h3>
                  </div>

                  <Link
                    href={noticias[0].enlace!}
                    aria-label={`Leer noticia: ${noticias[0].titulo}`}
                    className={`mt-6 inline-flex rounded-full bg-white px-5 py-3 text-[8px] font-black uppercase tracking-[0.15em] text-[#06142d] ${focusDark}`}
                  >
                    Leer artículo →
                  </Link>
                </div>
              </div>
            </div>

            <div className="hidden lg:grid lg:grid-cols-[1.18fr_0.82fr]">
              <Link
                href={noticias[0].enlace!}
                aria-label={`Abrir noticia: ${noticias[0].titulo}`}
                className={`group relative min-h-[620px] overflow-hidden ${focusDark}`}
              >
                <Image
                  src={noticias[0].imagen}
                  alt={noticias[0].titulo}
                  fill
                  sizes="60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#020817]/65 via-transparent to-transparent"
                />

                <div className="absolute bottom-10 left-10">
                  <div className="rounded-full border border-white/20 bg-[#020817]/70 px-5 py-3 backdrop-blur-md">
                    <p className="text-[8px] font-black uppercase tracking-[0.15em]">
                      Abrir artículo →
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex flex-col justify-between p-10 xl:p-12">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-cyan-300">
                    {noticias[0].categoria} ·{" "}
                    {noticias[0].fecha}
                  </p>

                  <div className="mt-6">
                    <h3 className="text-[3rem] font-black uppercase leading-[0.88] tracking-[-0.055em] xl:text-[3.55rem]">
                      Motagua
                    </h3>

                    <div className="my-4 flex items-center gap-4">
                      <span className="text-[4.7rem] font-black leading-none tracking-[-0.09em] text-white xl:text-[5.3rem]">
                        1
                      </span>

                      <span className="h-px w-12 bg-cyan-300/70 xl:w-16" />

                      <span className="text-[4.7rem] font-black leading-none tracking-[-0.09em] text-cyan-300 xl:text-[5.3rem]">
                        0
                      </span>
                    </div>

                    <h3 className="text-[3rem] font-black uppercase leading-[0.88] tracking-[-0.055em] xl:text-[3.55rem]">
                      Génesis FC
                    </h3>
                  </div>

                  <p className="mt-6 max-w-[460px] text-sm leading-7 text-white/45">
                    Motagua se quedó con los tres puntos tras imponerse 1-0.
                    Rodrigo de Oliveira marcó el único gol del encuentro.
                  </p>
                </div>

                <Link
                  href={noticias[0].enlace!}
                  aria-label={`Leer noticia: ${noticias[0].titulo}`}
                  className={`mt-10 w-fit rounded-full bg-white px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.15em] text-[#06142d] transition hover:bg-cyan-300 ${focusDark}`}
                >
                  Leer artículo →
                </Link>
              </div>
            </div>
          </article>

          {/* NOTICIAS SECUNDARIAS */}

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {noticias
              .slice(1)
              .map((noticia) => {
                const contenido = (
                  <>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={noticia.imagen}
                        alt={noticia.titulo}
                        fill
                        quality={100}
                        sizes="(max-width:767px) 100vw,50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    </div>

                    <div className="p-6 sm:p-7">
                      <p className="text-[7px] font-black uppercase tracking-[0.18em] text-[#1471d5]">
                        {noticia.categoria} ·{" "}
                        {noticia.fecha}
                      </p>

                      <h3 className="mt-4 text-xl font-black uppercase sm:text-3xl">
                        {noticia.titulo}
                      </h3>

                      <span className="mt-5 inline-block text-[8px] font-black uppercase">
                        {noticia.enlace
                          ? "Leer más →"
                          : "Próximamente"}
                      </span>
                    </div>
                  </>
                );

                return (
                  <article
                    key={noticia.titulo}
                    className="overflow-hidden rounded-[24px] bg-white shadow-[0_20px_50px_rgba(7,20,45,0.06)]"
                  >
                    {noticia.enlace ? (
                      <Link
                        href={noticia.enlace}
                        aria-label={`Leer noticia: ${noticia.titulo}`}
                        className={`group block ${focusLight}`}
                      >
                        {contenido}
                      </Link>
                    ) : (
                      <div
                        className="group block"
                        aria-label={`${noticia.titulo}. Próximamente`}
                      >
                        {contenido}
                      </div>
                    )}
                  </article>
                );
              })}
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-[24px] border border-black/10 bg-white/55 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <p className="text-[6px] font-black uppercase tracking-[0.2em] text-[#168cab] sm:text-[7px]">
                Archivo oficial
              </p>
              <p className="mt-1 text-xs font-bold text-[#06142d]/55 sm:text-sm">
                Explora todas las noticias publicadas por Génesis FC.
              </p>
            </div>

            <Link
              href="/noticias"
              className={`w-fit text-[7px] font-black uppercase tracking-[0.15em] text-[#06142d] transition hover:text-[#168cab] sm:text-[8px] ${focusLight}`}
            >
              Ir al centro de noticias →
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOME 2.0 · ACTUALIDAD DEPORTIVA
      ===================================================== */}

      <section className="bg-[#eef0ef] px-4 py-14 text-[#06142d] sm:px-8 sm:py-20 lg:px-12 lg:py-24 xl:px-16">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-6 border-b border-black/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[7px] font-black uppercase tracking-[0.28em] text-[#168cab] sm:text-[8px]">
                Ahora en Génesis
              </p>

              <h2 className="mt-3 text-[2.8rem] font-black uppercase leading-[0.84] tracking-[-0.06em] sm:text-[4.8rem] lg:text-[6rem]">
                Actualidad
                <span className="text-[#168cab]">.</span>
              </h2>
            </div>

            <Link
              href="/calendario"
              className={`w-fit rounded-full border border-black/10 bg-white px-6 py-3.5 text-[7px] font-black uppercase tracking-[0.15em] transition hover:border-[#168cab]/30 hover:bg-[#06142d] hover:text-white ${focusLight}`}
            >
              Calendario y tabla →
            </Link>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
            <Link
              href="/partidos/genesis-vs-olancho"
              className={`group relative overflow-hidden rounded-[28px] bg-[#06142d] p-6 text-white shadow-[0_20px_60px_rgba(6,20,45,0.08)] transition hover:-translate-y-1 sm:p-8 ${focusLight}`}
            >
              <div className="absolute right-[-70px] top-[-70px] h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />

              <div className="relative flex h-full min-h-[290px] flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full ${
                          partidoEnVivo
                            ? "animate-pulse bg-emerald-300"
                            : "bg-cyan-300"
                        }`}
                      />

                      <p
                        className={`text-[7px] font-black uppercase tracking-[0.2em] ${
                          partidoEnVivo
                            ? "text-emerald-300"
                            : "text-cyan-300"
                        }`}
                      >
                        {estadoPartido}
                      </p>
                    </div>

                    <p className="mt-4 text-[7px] font-black uppercase tracking-[0.18em] text-white/30">
                      Liga Nacional · Jornada 8
                    </p>
                  </div>

                  <span className="text-xl text-cyan-300 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <div className="mt-10">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div>
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

                      <p className="mt-3 text-xs font-black uppercase sm:text-sm">
                        Génesis FC
                      </p>
                    </div>

                    <div className="text-center">
                      {partidoEnVivo || partidoFinalizado ? (
                        <>
                          <p className="text-[6px] font-black uppercase tracking-[0.18em] text-white/30">
                            {estadoPartido}
                          </p>
                          <p className="mt-2 text-4xl font-black tabular-nums tracking-[-0.06em] text-cyan-300 sm:text-5xl">
                            {marcadorHome}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-2xl font-black text-white/20">VS</p>
                          <p className="mt-2 text-[6px] font-black uppercase tracking-[0.14em] text-white/30">
                            19 SEP · 3:00 PM
                          </p>
                        </>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="relative ml-auto h-16 w-16 sm:h-20 sm:w-20">
                        <Image
                          src="/olancho.png"
                          alt="Escudo de Olancho FC"
                          fill
                          quality={100}
                          sizes="80px"
                          className="object-contain"
                        />
                      </div>

                      <p className="mt-3 text-xs font-black uppercase sm:text-sm">
                        Olancho FC
                      </p>
                    </div>
                  </div>

                  <p className="mt-6 text-[8px] font-bold uppercase tracking-[0.12em] text-white/35">
                    Estadio Roberto Suazo Córdova · La Paz
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/noticias/motagua-1-0-genesis"
              className={`group rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(6,20,45,0.05)] transition hover:-translate-y-1 sm:p-8 ${focusLight}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#168cab]">
                  Último resultado
                </p>

                <span className="text-sm text-black/25 transition group-hover:translate-x-1 group-hover:text-[#168cab]">
                  →
                </span>
              </div>

              <p className="mt-8 text-[7px] font-black uppercase tracking-[0.16em] text-black/25">
                12 SEP 2026 · Liga Nacional
              </p>

              <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div>
                  <p className="text-lg font-black uppercase">Motagua</p>
                  <p className="mt-2 text-[7px] font-black uppercase tracking-[0.14em] text-black/30">Local</p>
                </div>

                <div className="flex items-center whitespace-nowrap text-5xl font-black leading-none tracking-[-0.08em]">
                  <span>1</span>
                  <span className="mx-2 text-black/15">–</span>
                  <span className="text-[#168cab]">0</span>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black uppercase">Génesis</p>
                  <p className="mt-2 text-[7px] font-black uppercase tracking-[0.14em] text-black/30">Visitante</p>
                </div>
              </div>

              <div className="mt-8 rounded-[18px] bg-red-50 px-4 py-3">
                <p className="text-[7px] font-black uppercase tracking-[0.16em] text-red-700">
                  Derrota · 1-0
                </p>
              </div>
            </Link>

            <Link
              href="/calendario"
              className={`group rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(6,20,45,0.05)] transition hover:-translate-y-1 sm:p-8 ${focusLight}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#168cab]">
                  Forma reciente
                </p>

                <span className="text-sm text-black/25 transition group-hover:translate-x-1 group-hover:text-[#168cab]">
                  →
                </span>
              </div>

              <p className="mt-8 text-4xl font-black uppercase tracking-[-0.05em]">
                Últimos 4
              </p>

              <div className="mt-7 flex gap-2.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-[9px] font-black text-red-700">D</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-[9px] font-black text-emerald-700">V</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-[9px] font-black text-red-700">D</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f2f5] text-[9px] font-black text-[#137c99]">E</span>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-2 border-t border-black/[0.06] pt-6">
                <div>
                  <p className="text-2xl font-black">1</p>
                  <p className="mt-1 text-[6px] font-black uppercase tracking-[0.12em] text-black/30">Victoria</p>
                </div>

                <div>
                  <p className="text-2xl font-black">1</p>
                  <p className="mt-1 text-[6px] font-black uppercase tracking-[0.12em] text-black/30">Empate</p>
                </div>

                <div>
                  <p className="text-2xl font-black">2</p>
                  <p className="mt-1 text-[6px] font-black uppercase tracking-[0.12em] text-black/30">Derrotas</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRÓXIMO PARTIDO
      ===================================================== */}

      <section
        id="partidos"
        aria-labelledby="titulo-proximo-partido"
        className="relative overflow-hidden bg-[#061a3d]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(18,105,220,0.35),transparent_48%)]"
        />

        <div className="relative mx-auto max-w-[1500px] px-4 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="text-center">
            <p
              className={`text-[8px] font-black uppercase tracking-[0.28em] ${
                partidoEnVivo
                  ? "text-emerald-300"
                  : "text-cyan-300"
              }`}
            >
              {partidoEnVivo
                ? `EN VIVO · ${estadoPartido}`
                : partidoFinalizado
                  ? "FINAL · LIGA NACIONAL · JORNADA 8"
                  : "Liga Nacional · Jornada 8"}
            </p>

            <h2
              id="titulo-proximo-partido"
              className="mt-4 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl"
            >
              {partidoEnVivo
                ? "Partido en vivo"
                : partidoFinalizado
                  ? "Resultado final"
                  : "Próximo desafío"}
            </h2>

            <p className="mt-3 text-[10px] text-white/45 sm:text-sm">
              Sábado 19 de septiembre · 3:00 PM
            </p>
          </div>

          {mostrarCuentaRegresiva ? (
            <CuentaRegresiva />
          ) : (
            <div className="mx-auto mt-10 max-w-[760px] rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-8 text-center">
              <p
                className={`text-[7px] font-black uppercase tracking-[0.24em] ${
                  partidoEnVivo
                    ? "text-emerald-300"
                    : "text-cyan-300"
                }`}
              >
                {estadoPartido}
              </p>

              <p className="mt-3 text-5xl font-black tabular-nums tracking-[-0.07em] sm:text-7xl">
                {marcadorHome}
              </p>

              <p className="mt-3 text-[8px] font-black uppercase tracking-[0.16em] text-white/30">
                Génesis FC · Olancho FC
              </p>
            </div>
          )}

          <Link
            href="/partidos/genesis-vs-olancho"
            aria-label="Ver próximo partido Génesis FC contra Olancho FC"
            className={`group mx-auto mt-14 block max-w-[1100px] rounded-[30px] border border-white/10 bg-white/[0.035] px-4 py-8 transition duration-300 hover:border-cyan-300/30 hover:bg-white/[0.055] sm:px-8 sm:py-10 ${focusDark}`}
          >
            <div className="grid grid-cols-[1fr_48px_1fr] items-center gap-2 sm:grid-cols-[1fr_120px_1fr]">
              <div className="text-center">
                <div className="relative mx-auto h-24 w-24 transition duration-500 group-hover:scale-[1.03] sm:h-48 sm:w-48 lg:h-56 lg:w-56">
                  <Image
                    src="/genesis.jpg"
                    alt="Escudo de Génesis FC"
                    fill
                    quality={100}
                    sizes="224px"
                    className="object-contain"
                  />
                </div>

                <p className="mt-5 text-[7px] font-black uppercase text-white/30">
                  Local
                </p>

                <h3 className="mt-2 text-base font-black uppercase sm:text-3xl">
                  Génesis FC
                </h3>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-[8px] font-black transition duration-300 group-hover:border-cyan-300/40 group-hover:bg-cyan-300 group-hover:text-[#06142d] sm:h-20 sm:w-20"
                >
                  {partidoEnVivo
                    ? estadoPartido
                    : partidoFinalizado
                      ? "FT"
                      : "VS"}
                </div>

                <p
                  className={`mt-4 hidden text-[6px] font-black uppercase tracking-[0.18em] sm:block ${
                    partidoEnVivo
                      ? "text-emerald-300"
                      : "text-cyan-300"
                  }`}
                >
                  {partidoEnVivo
                    ? marcadorHome
                    : partidoFinalizado
                      ? marcadorHome
                      : "Ver partido"}
                </p>
              </div>

              <div className="text-center">
                <div className="relative mx-auto h-24 w-24 transition duration-500 group-hover:scale-[1.03] sm:h-48 sm:w-48 lg:h-56 lg:w-56">
                  <Image
                    src="/olancho.png"
                    alt="Escudo de Olancho FC"
                    fill
                    quality={100}
                    sizes="224px"
                    className="object-contain"
                  />
                </div>

                <p className="mt-5 text-[7px] font-black uppercase text-cyan-300">
                  Visitante
                </p>

                <h3 className="mt-2 text-base font-black uppercase sm:text-3xl">
                  Olancho FC
                </h3>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6 text-center">
              <p className="text-[9px] text-white/35 sm:text-xs">
                Estadio Roberto Suazo Córdova · La Paz, Honduras
              </p>

              <div className="mt-5 inline-flex items-center gap-3 rounded-full bg-cyan-300 px-6 py-3 text-[7px] font-black uppercase tracking-[0.15em] text-[#06142d] transition group-hover:bg-white sm:text-[8px]">
                {partidoEnVivo
                  ? "En vivo ahora"
                  : partidoFinalizado
                    ? "Resultado final"
                    : "Siguiente partido"}
                <span aria-hidden="true">
                  →
                </span>
              </div>
            </div>
          </Link>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/partidos/genesis-vs-olancho"
              className={`inline-flex w-full items-center justify-center rounded-full bg-cyan-300 px-7 py-4 text-[8px] font-black uppercase tracking-[0.15em] text-[#05142f] transition duration-300 hover:bg-white sm:w-auto ${focusDark}`}
            >
              {partidoEnVivo
                ? "Seguir partido en vivo →"
                : partidoFinalizado
                  ? "Ver resumen del partido →"
                  : "Ver siguiente partido →"}
            </Link>

            <Link
              href="/calendario"
              className={`inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.05] px-7 py-4 text-[8px] font-black uppercase tracking-[0.15em] text-white transition duration-300 hover:bg-white hover:text-[#05142f] sm:w-auto ${focusDark}`}
            >
              Ver calendario completo →
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          RESULTADOS
      ===================================================== */}

      <section
        id="resultados"
        aria-labelledby="titulo-resultados"
        className="bg-[#f4f4f1] px-4 py-16 text-[#06142d] sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-8 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#168cab]">
                Temporada 2026/2027
              </p>

              <h2
                id="titulo-resultados"
                className="mt-4 text-[3rem] font-black uppercase leading-[0.85] tracking-[-0.06em] sm:text-[5rem] lg:text-[6.5rem]"
              >
                Resultados
                <span className="text-[#168cab]">
                  .
                </span>
              </h2>
            </div>

            <div className="rounded-[22px] bg-[#06142d] px-6 py-5 text-white sm:px-8">
              <p className="text-[7px] font-black uppercase tracking-[0.22em] text-white/35">
                Últimos 4 partidos
              </p>

              <div
                className="mt-4 flex items-center gap-3"
                aria-label="Últimos cuatro resultados: derrota, victoria, derrota y empate"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/15 text-[9px] font-black text-red-300">
                  D
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-[9px] font-black text-emerald-300">
                  V
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/15 text-[9px] font-black text-red-300">
                  D
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[9px] font-black text-white/70">
                  E
                </span>
              </div>

              <p className="mt-4 text-[8px] font-black uppercase tracking-[0.15em] text-cyan-300">
                1 victoria · 1 empate · 2 derrotas
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {resultados.map(
              (partido) => {
                const victoria =
                  partido.resultadoGenesis ===
                  "Victoria";

                const derrota =
                  partido.resultadoGenesis ===
                  "Derrota";

                return (
                  <article
                    key={`${partido.fecha}-${partido.local}`}
                    aria-label={`${partido.fecha}: ${partido.local} ${partido.golesLocal}, ${partido.visitante} ${partido.golesVisitante}. ${partido.resultadoGenesis} de Génesis FC.`}
                    className="group overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_60px_rgba(6,20,45,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(6,20,45,0.10)]"
                  >
                    <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4 sm:px-7">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={`h-2 w-2 rounded-full ${
                            victoria
                              ? "bg-emerald-500"
                              : derrota
                                ? "bg-red-500"
                                : "bg-[#168cab]"
                          }`}
                        />

                        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-black/40">
                          {partido.competicion}
                        </p>
                      </div>

                      <p className="text-[7px] font-black uppercase tracking-[0.17em] text-black/30">
                        {partido.fecha}
                      </p>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-8 sm:gap-6 sm:px-7 sm:py-10">
                      <div className="text-center">
                        <div className="relative mx-auto h-16 w-16 sm:h-20 sm:w-20">
                          <Image
                            src={partido.logoLocal}
                            alt={`Escudo de ${partido.local}`}
                            fill
                            quality={100}
                            sizes="80px"
                            className="object-contain"
                          />
                        </div>

                        <p className="mt-3 text-[6px] font-black uppercase tracking-[0.18em] text-black/25">
                          Local
                        </p>

                        <h3 className="mx-auto mt-2 max-w-[150px] text-[10px] font-black uppercase leading-tight sm:text-sm">
                          {partido.local}
                        </h3>
                      </div>

                      <div className="text-center">
                        <p className="text-[6px] font-black uppercase tracking-[0.22em] text-black/25">
                          Final
                        </p>

                        <div className="mt-3 flex items-center gap-3">
                          <span className="text-4xl font-black tracking-[-0.08em] sm:text-5xl">
                            {partido.golesLocal}
                          </span>

                          <span
                            aria-hidden="true"
                            className="text-lg font-black text-black/15"
                          >
                            –
                          </span>

                          <span className="text-4xl font-black tracking-[-0.08em] sm:text-5xl">
                            {partido.golesVisitante}
                          </span>
                        </div>

                        <div
                          className={`mx-auto mt-4 w-fit rounded-full px-3 py-1.5 ${
                            victoria
                              ? "bg-emerald-50"
                              : derrota
                                ? "bg-red-50"
                                : "bg-[#e8f2f5]"
                          }`}
                        >
                          <p
                            className={`text-[6px] font-black uppercase tracking-[0.16em] ${
                              victoria
                                ? "text-emerald-700"
                                : derrota
                                  ? "text-red-700"
                                  : "text-[#137c99]"
                            }`}
                          >
                            {partido.resultadoGenesis}
                          </p>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="relative mx-auto h-16 w-16 sm:h-20 sm:w-20">
                          <Image
                            src={partido.logoVisitante}
                            alt={`Escudo de ${partido.visitante}`}
                            fill
                            quality={100}
                            sizes="80px"
                            className="object-contain"
                          />
                        </div>

                        <p className="mt-3 text-[6px] font-black uppercase tracking-[0.18em] text-black/25">
                          Visitante
                        </p>

                        <h3 className="mx-auto mt-2 max-w-[150px] text-[10px] font-black uppercase leading-tight sm:text-sm">
                          {partido.visitante}
                        </h3>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] bg-[#06142d] p-6 text-white">
              <p className="text-4xl font-black text-cyan-300">
                4
              </p>

              <p className="mt-2 text-[7px] font-black uppercase tracking-[0.2em] text-white/35">
                Goles a favor
              </p>
            </div>

            <div className="rounded-[22px] bg-white p-6">
              <p className="text-4xl font-black">
                4
              </p>

              <p className="mt-2 text-[7px] font-black uppercase tracking-[0.2em] text-black/35">
                Goles en contra
              </p>
            </div>

            <div className="rounded-[22px] bg-white p-6">
              <p className="text-4xl font-black">
                0
              </p>

              <p className="mt-2 text-[7px] font-black uppercase tracking-[0.2em] text-black/35">
                Diferencia de gol
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/calendario"
              className={`inline-flex rounded-full bg-[#06142d] px-8 py-4 text-[8px] font-black uppercase tracking-[0.15em] text-white transition hover:bg-[#168cab] ${focusLight}`}
            >
              Ver todos los partidos →
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOME 2.0 · CLUB & TEAM GATEWAY
      ===================================================== */}

      <section
        id="club"
        aria-labelledby="titulo-club"
        className="bg-[#f4f3ef] px-4 py-16 text-[#06142d] sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16"
      >
        <div className="mx-auto max-w-[1550px]">
          <div className="flex flex-col gap-6 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[7px] font-black uppercase tracking-[0.28em] text-[#168cab] sm:text-[8px]">
                Identidad · Historia · Primer equipo
              </p>

              <h2
                id="titulo-club"
                className="mt-3 text-[2.9rem] font-black uppercase leading-[0.84] tracking-[-0.06em] sm:text-[4.8rem] lg:text-[6rem]"
              >
                Somos
                <span className="text-[#168cab]"> Génesis.</span>
              </h2>
            </div>

            <p className="max-w-[520px] text-xs leading-6 text-black/45 sm:text-sm">
              Conoce de dónde venimos, quiénes representan hoy al club y todo lo que construye la identidad de Génesis FC.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <Link
              href="/historia"
              className={`group relative overflow-hidden rounded-[34px] bg-[#061a3d] p-7 text-white transition duration-300 hover:-translate-y-1 sm:p-10 lg:min-h-[560px] ${focusDark}`}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(22,140,171,0.28),transparent_34%)]"
              />

              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <div className="relative h-28 w-28 sm:h-36 sm:w-36">
                    <Image
                      src="/genesis.jpg"
                      alt="Escudo de Génesis FC"
                      fill
                      quality={100}
                      sizes="144px"
                      className="object-contain"
                    />
                  </div>

                  <p className="mt-8 text-[7px] font-black uppercase tracking-[0.3em] text-cyan-300">
                    Nuestra identidad
                  </p>

                  <h3 className="mt-4 text-[2.8rem] font-black uppercase leading-[0.86] tracking-[-0.055em] sm:text-[4.8rem]">
                    Orgullo
                    <br />
                    de La Paz
                    <span className="text-cyan-300">.</span>
                  </h3>

                  <p className="mt-6 max-w-[560px] text-xs leading-6 text-white/48 sm:text-sm sm:leading-7">
                    Génesis FC representa pasión, identidad y orgullo. Un club que compite llevando consigo el nombre de La Paz y el sentimiento de toda una afición.
                  </p>
                </div>

                <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                  <p className="text-[7px] font-black uppercase tracking-[0.17em] text-white/60">
                    Conocer nuestra historia
                  </p>

                  <span className="text-xl text-cyan-300 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>

            <div className="grid gap-5">
              <Link
                href="/equipo"
                className={`group rounded-[30px] border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(6,20,45,0.05)] transition duration-300 hover:-translate-y-1 sm:p-8 ${focusLight}`}
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[7px] font-black uppercase tracking-[0.22em] text-[#168cab]">
                      Primer equipo
                    </p>

                    <h3 className="mt-4 text-3xl font-black uppercase tracking-[-0.045em] sm:text-4xl">
                      Los nuestros
                      <span className="text-[#168cab]">.</span>
                    </h3>

                    <p className="mt-4 max-w-[430px] text-xs leading-6 text-black/45">
                      Plantel, posiciones y perfiles de los futbolistas que representan a Génesis FC.
                    </p>
                  </div>

                  <span className="text-xl text-black/20 transition group-hover:translate-x-1 group-hover:text-[#168cab]">
                    →
                  </span>
                </div>

                <div className="mt-7 grid grid-cols-4 gap-2">
                  {jugadores.map((jugador) => (
                    <div
                      key={`gateway-${jugador.nombre}`}
                      className="overflow-hidden rounded-[16px] bg-[#06142d]"
                    >
                      <div className="relative aspect-[4/5]">
                        <Image
                          src={jugador.imagen}
                          alt={jugador.nombre}
                          fill
                          sizes="120px"
                          className="object-cover object-top"
                        />
                      </div>

                      <p className="truncate px-2 py-2 text-center text-[6px] font-black uppercase tracking-[0.1em] text-white/70">
                        {jugador.nombre}
                      </p>
                    </div>
                  ))}
                </div>
              </Link>

              <div className="grid gap-5 sm:grid-cols-2">
                <Link
                  href="/buscar"
                  className={`group rounded-[26px] border border-black/[0.06] bg-[#eaf4f6] p-6 transition hover:-translate-y-1 ${focusLight}`}
                >
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#168cab]">
                    Explorar
                  </p>

                  <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.04em]">
                    Buscar en Génesis
                  </h3>

                  <p className="mt-3 text-[9px] leading-5 text-black/40">
                    Encuentra partidos, noticias, historia, equipo y tienda.
                  </p>

                  <p className="mt-5 text-[7px] font-black uppercase tracking-[0.14em] text-[#06142d]">
                    Abrir buscador →
                  </p>
                </Link>

                <Link
                  href="/calendario"
                  className={`group rounded-[26px] border border-black/[0.06] bg-[#06142d] p-6 text-white transition hover:-translate-y-1 ${focusDark}`}
                >
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-300">
                    Competición
                  </p>

                  <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.04em]">
                    Calendario
                  </h3>

                  <p className="mt-3 text-[9px] leading-5 text-white/40">
                    Próximos partidos, resultados y clasificación.
                  </p>

                  <p className="mt-5 text-[7px] font-black uppercase tracking-[0.14em] text-white">
                    Ver temporada →
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOME 2.0 · COMMERCE GATEWAY
      ===================================================== */}

      <section
        aria-labelledby="titulo-tienda"
        className="bg-[#f3f3f2] px-4 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16"
      >
        <div className="mx-auto max-w-[1550px]">
          <div className="mb-8 flex flex-col gap-5 border-b border-black/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[7px] font-black uppercase tracking-[0.27em] text-[#168cab] sm:text-[8px]">
                K9 Store · Tienda Oficial
              </p>

              <h2
                id="titulo-tienda"
                className="mt-3 text-[2.8rem] font-black uppercase leading-[0.84] tracking-[-0.06em] text-[#06142d] sm:text-[4.8rem] lg:text-[6rem]"
              >
                Commerce
                <span className="text-[#168cab]">.</span>
              </h2>
            </div>

            <Link
              href="/tienda"
              className={`w-fit rounded-full border border-[#06142d]/15 px-5 py-3 text-[7px] font-black uppercase tracking-[0.15em] text-[#06142d] transition hover:border-[#168cab] hover:bg-[#168cab] hover:text-white sm:text-[8px] ${focusLight}`}
            >
              Ver tienda completa →
            </Link>
          </div>

          <div className="grid overflow-hidden rounded-[34px] bg-[#0757bb] text-white lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[6px] font-black uppercase tracking-[0.16em] text-cyan-200">
                  Producto oficial
                </span>

                <span className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[6px] font-black uppercase tracking-[0.16em] text-white/60">
                  K9 Store
                </span>
              </div>

              <h3 className="mt-6 text-[3rem] font-black uppercase leading-[0.82] tracking-[-0.06em] sm:text-[5.5rem]">
                Lleva
                <br />
                el escudo
                <br />
                contigo
                <span className="text-cyan-200">.</span>
              </h3>

              <p className="mt-6 max-w-[470px] text-[12px] leading-6 text-white/65 sm:text-base">
                La camiseta oficial de Génesis FC. Nuestra identidad, nuestros
                colores y nuestra ciudad.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/tienda"
                  aria-label="Abrir Tienda Oficial de Génesis FC"
                  className={`inline-flex items-center justify-center rounded-full bg-white px-6 py-4 text-[8px] font-black uppercase tracking-[0.13em] text-[#05142f] transition hover:bg-cyan-200 ${focusLight}`}
                >
                  Comprar ahora →
                </Link>

                <Link
                  href="/tienda/seguimiento"
                  aria-label="Seguir pedido de la Tienda Oficial"
                  className={`inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.05] px-6 py-4 text-[8px] font-black uppercase tracking-[0.13em] text-white transition hover:bg-white hover:text-[#05142f] ${focusDark}`}
                >
                  Seguir mi pedido →
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-6">
                {[
                  ["Stock", "Control"],
                  ["Entrega", "Estimación"],
                  ["Favoritos", "Próximamente"],
                ].map(([titulo, detalle]) => (
                  <div
                    key={titulo}
                    className="rounded-[16px] border border-white/10 bg-white/[0.04] px-3 py-3"
                  >
                    <p className="text-[6px] font-black uppercase tracking-[0.14em] text-cyan-200">
                      {titulo}
                    </p>

                    <p className="mt-1 text-[6px] font-black uppercase tracking-[0.11em] text-white/35">
                      {detalle}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[460px] sm:min-h-[720px]">
              <Image
                src="/tienda-camiseta.png"
                alt="Camiseta oficial de Génesis FC"
                fill
                sizes="(max-width:1023px) 100vw,60vw"
                className="object-cover object-top"
              />

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#041126]/55 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0757bb]/20 lg:via-transparent lg:to-transparent"
              />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
                <div className="ml-auto max-w-[360px] rounded-[24px] border border-white/15 bg-[#020817]/80 p-5 backdrop-blur-xl sm:p-6">
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-300">
                    Comercio oficial
                  </p>

                  <p className="mt-3 text-xl font-black uppercase sm:text-2xl">
                    K9 Store
                  </p>

                  <p className="mt-2 text-[9px] leading-5 text-white/45">
                    Compra, seguimiento y futuras funciones de Commerce Center
                    desde el ecosistema digital de Génesis FC.
                  </p>

                  <Link
                    href="/tienda"
                    className={`mt-5 inline-flex text-[7px] font-black uppercase tracking-[0.15em] text-white transition hover:text-cyan-300 ${focusDark}`}
                  >
                    Entrar al Commerce Center →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOME 2.0 · ENTRADAS
      ===================================================== */}

      <section className="bg-[#06142d] px-4 py-16 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
        <div className="mx-auto max-w-[1550px]">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[7px] font-black uppercase tracking-[0.28em] text-cyan-300 sm:text-[8px]">
                Boletería oficial
              </p>

              <h2 className="mt-3 text-[2.9rem] font-black uppercase leading-[0.84] tracking-[-0.06em] sm:text-[4.8rem] lg:text-[6rem]">
                Entradas
                <span className="text-cyan-300">.</span>
              </h2>

              <p className="mt-4 max-w-[620px] text-xs leading-6 text-white/50 sm:text-sm">
                Precios oficiales para Génesis FC vs Olancho FC. Compra tus entradas en K9 Store, tienda oficial del equipo.
              </p>
            </div>

            <Link
              href="/partidos/genesis-vs-olancho"
              className={`w-fit rounded-full border border-white/15 px-5 py-3 text-[7px] font-black uppercase tracking-[0.15em] text-white/70 transition hover:border-cyan-300/40 hover:bg-cyan-300 hover:text-[#06142d] sm:text-[8px] ${focusDark}`}
            >
              Ver Match Center →
            </Link>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-300">
                    Génesis FC vs Olancho FC
                  </p>

                  <p className="mt-2 text-[8px] font-black uppercase tracking-[0.14em] text-white/35">
                    19 SEP 2026 · 3:00 PM · La Paz
                  </p>
                </div>

                <div className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-4 py-2">
                  <p className="text-[6px] font-black uppercase tracking-[0.15em] text-emerald-300">
                    Venta oficial
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  ["Silla", "L 300"],
                  ["Sombra", "L 150"],
                  ["Preferencia Norte", "L 150"],
                  ["Preferencia Sur", "L 150"],
                  ["Sol", "L 100"],
                ].map(([sector, precio]) => (
                  <div
                    key={sector}
                    className="rounded-[20px] border border-white/10 bg-[#020817]/45 px-4 py-5 text-center"
                  >
                    <p className="min-h-[30px] text-[6px] font-black uppercase leading-4 tracking-[0.14em] text-white/40">
                      {sector}
                    </p>

                    <p className="mt-3 text-2xl font-black tracking-[-0.04em] text-cyan-300">
                      {precio}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
                <div className="flex-1 rounded-[20px] border border-white/10 bg-white/[0.035] px-5 py-5">
                  <p className="text-[6px] font-black uppercase tracking-[0.2em] text-cyan-300">
                    Punto de venta
                  </p>

                  <p className="mt-2 text-xl font-black uppercase">
                    K9 Store
                  </p>

                  <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-white/30">
                    Tienda oficial de Génesis FC
                  </p>
                </div>

                <Link
                  href="/partidos/genesis-vs-olancho"
                  className={`inline-flex items-center justify-center rounded-[20px] bg-cyan-300 px-6 py-5 text-[8px] font-black uppercase tracking-[0.14em] text-[#06142d] transition hover:bg-white ${focusDark}`}
                >
                  Ver información completa →
                </Link>
              </div>
            </div>

            <div className="grid gap-5">
              <div className="rounded-[30px] border border-cyan-300/15 bg-cyan-300/[0.06] p-6 sm:p-8">
                <p className="text-[7px] font-black uppercase tracking-[0.22em] text-cyan-300">
                  Matchday
                </p>

                <h3 className="mt-4 text-3xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-4xl">
                  Todo listo
                  <br />
                  para La Paz
                  <span className="text-cyan-300">.</span>
                </h3>

                <p className="mt-5 text-xs leading-6 text-white/45">
                  Consulta previa, entradas, pronóstico, reacciones y toda la experiencia del partido desde el Match Center oficial.
                </p>

                <Link
                  href="/partidos/genesis-vs-olancho"
                  className={`mt-6 inline-flex text-[7px] font-black uppercase tracking-[0.16em] text-white transition hover:text-cyan-300 ${focusDark}`}
                >
                  Entrar al Match Center →
                </Link>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] px-6 py-5">
                <p className="text-[6px] font-black uppercase tracking-[0.18em] text-white/30">
                  Compra presencial
                </p>

                <p className="mt-2 text-sm font-black uppercase">
                  K9 Store · punto oficial
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOME 2.0 · GENESIS ECOSYSTEM PREVIEW
      ===================================================== */}

      <section
        aria-labelledby="titulo-ecosistema"
        className="bg-white px-4 py-16 text-[#06142d] sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16"
      >
        <div className="mx-auto max-w-[1550px]">
          <div className="grid gap-8 border-b border-black/10 pb-9 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <p className="text-[7px] font-black uppercase tracking-[0.28em] text-[#168cab] sm:text-[8px]">
                El club sigue creciendo
              </p>

              <h2
                id="titulo-ecosistema"
                className="mt-3 text-[2.9rem] font-black uppercase leading-[0.82] tracking-[-0.065em] sm:text-[5rem] lg:text-[6.4rem]"
              >
                Ecosistema
                <br />
                <span className="text-[#168cab]">Génesis.</span>
              </h2>
            </div>

            <p className="max-w-[580px] text-xs leading-6 text-black/45 sm:text-sm sm:leading-7">
              Nuevas experiencias oficiales se están preparando para conectar al club con su afición dentro y fuera del estadio.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                numero: "01",
                titulo: "Génesis TV",
                texto: "Contenido audiovisual, historias y producción oficial del club.",
                etiqueta: "En desarrollo",
              },
              {
                numero: "02",
                titulo: "Fan Zone",
                texto: "Un nuevo espacio digital pensado para vivir Génesis como aficionado.",
                etiqueta: "En desarrollo",
              },
              {
                numero: "03",
                titulo: "Academia",
                texto: "El futuro del club y su desarrollo deportivo tendrán su propio espacio.",
                etiqueta: "En desarrollo",
              },
              {
                numero: "04",
                titulo: "Beneficios",
                texto: "Experiencias y ventajas para acercar todavía más al aficionado con Génesis FC.",
                etiqueta: "En desarrollo",
              },
            ].map((item, index) => (
              <article
                key={item.titulo}
                className={`group relative min-h-[300px] overflow-hidden rounded-[28px] border p-6 sm:min-h-[340px] sm:p-7 ${
                  index === 0
                    ? "border-[#168cab]/20 bg-[#06142d] text-white"
                    : "border-black/[0.06] bg-[#f4f3ef]"
                }`}
              >
                <div
                  aria-hidden="true"
                  className={`absolute -right-10 -top-12 h-40 w-40 rounded-full blur-3xl ${
                    index === 0 ? "bg-[#168cab]/25" : "bg-[#168cab]/10"
                  }`}
                />

                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <p
                      className={`text-[7px] font-black uppercase tracking-[0.22em] ${
                        index === 0 ? "text-cyan-300" : "text-[#168cab]"
                      }`}
                    >
                      {item.numero}
                    </p>

                    <span
                      className={`rounded-full border px-3 py-2 text-[6px] font-black uppercase tracking-[0.14em] ${
                        index === 0
                          ? "border-white/10 bg-white/[0.05] text-white/50"
                          : "border-black/[0.06] bg-white/60 text-black/35"
                      }`}
                    >
                      {item.etiqueta}
                    </span>
                  </div>

                  <div className="mt-16">
                    <h3 className="text-3xl font-black uppercase leading-[0.9] tracking-[-0.045em] sm:text-[2.25rem]">
                      {item.titulo}
                      <span className={index === 0 ? "text-cyan-300" : "text-[#168cab]"}>
                        .
                      </span>
                    </h3>

                    <p
                      className={`mt-5 text-[10px] leading-5 sm:text-xs sm:leading-6 ${
                        index === 0 ? "text-white/45" : "text-black/42"
                      }`}
                    >
                      {item.texto}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] bg-[#eaf4f6] p-6 sm:p-8">
              <p className="text-[7px] font-black uppercase tracking-[0.22em] text-[#168cab]">
                Próxima generación digital
              </p>

              <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
                    Más cerca del club.
                  </h3>
                  <p className="mt-3 max-w-[650px] text-[10px] leading-5 text-black/42 sm:text-xs sm:leading-6">
                    Estos espacios formarán parte de la evolución del sitio oficial. Los iremos activando conforme completemos cada experiencia.
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-[#06142d] px-5 py-3 text-[7px] font-black uppercase tracking-[0.14em] text-white">
                  Home 2.0
                </span>
              </div>
            </div>

            <div className="rounded-[28px] bg-[#168cab] p-6 text-white sm:p-8">
              <p className="text-[7px] font-black uppercase tracking-[0.22em] text-white/60">
                Ya disponible
              </p>
              <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
                Vive el partido.
              </h3>
              <p className="mt-3 text-[10px] leading-5 text-white/60 sm:text-xs sm:leading-6">
                Match Center, pronóstico, reacciones, MVP, entradas y toda la experiencia actual.
              </p>
              <Link
                href="/partidos/genesis-vs-olancho"
                className={`mt-6 inline-flex rounded-full bg-white px-5 py-3 text-[7px] font-black uppercase tracking-[0.14em] text-[#06142d] transition hover:bg-[#06142d] hover:text-white ${focusDark}`}
              >
                Abrir Match Center →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-[#020817] px-4 py-12 sm:px-8 lg:px-12 lg:py-20 xl:px-16">
        <div className="mx-auto max-w-[1550px]">
          <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-3">
            <div>
              <div className="relative h-16 w-16">
                <Image
                  src="/genesis.jpg"
                  alt="Escudo de Génesis FC"
                  fill
                  quality={100}
                  sizes="64px"
                  className="object-contain"
                />
              </div>

              <h2 className="mt-5 text-2xl font-black uppercase">
                Génesis FC
              </h2>

              <p className="mt-3 text-[10px] leading-5 text-white/40">
                Orgullo de La Paz. Pasión, identidad y fútbol hondureño.
              </p>
            </div>

            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.26em] text-cyan-300">
                Navegación
              </p>

              <nav
                aria-label="Navegación del pie de página"
                className="mt-5 flex flex-col gap-3"
              >
                <a
                  href="#inicio"
                  className={`text-xs text-white/55 ${focusDark}`}
                >
                  Inicio
                </a>

                <a
                  href="#noticias"
                  className={`text-xs text-white/55 ${focusDark}`}
                >
                  Noticias
                </a>

                <a
                  href="#resultados"
                  className={`text-xs text-white/55 ${focusDark}`}
                >
                  Resultados
                </a>

                <Link
                  href="/calendario"
                  className={`text-xs text-white/55 ${focusDark}`}
                >
                  Calendario
                </Link>

                <Link
                  href="/buscar"
                  className={`text-xs text-white/55 ${focusDark}`}
                >
                  Buscar
                </Link>

                <Link
                  href="/equipo"
                  className={`text-xs text-white/55 ${focusDark}`}
                >
                  Plantilla completa
                </Link>

                <Link
                  href="/partidos/motagua-vs-genesis"
                  className={`text-xs text-white/55 ${focusDark}`}
                >
                  Siguiente partido
                </Link>
              </nav>
            </div>

            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.26em] text-cyan-300">
                Síguenos
              </p>

              <p className="mt-5 text-xs leading-6 text-white/40">
                Sigue toda la actualidad de Génesis FC.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <a
                  href="https://www.facebook.com/profile.php?id=100094686128397"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Seguir a Génesis FC en Facebook"
                  className={`rounded-full border border-white/15 px-4 py-2.5 text-[7px] font-black uppercase text-white/50 transition hover:border-cyan-300/40 hover:text-cyan-300 ${focusDark}`}
                >
                  Facebook
                </a>

                <a
                  href="https://www.instagram.com/genesisfc_hnd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Seguir a Génesis FC en Instagram"
                  className={`rounded-full border border-white/15 px-4 py-2.5 text-[7px] font-black uppercase text-white/50 transition hover:border-cyan-300/40 hover:text-cyan-300 ${focusDark}`}
                >
                  Instagram
                </a>

                <a
                  href="https://www.tiktok.com/@genesis_la_paz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Seguir a Génesis FC en TikTok"
                  className={`rounded-full border border-white/15 px-4 py-2.5 text-[7px] font-black uppercase text-white/50 transition hover:border-cyan-300/40 hover:text-cyan-300 ${focusDark}`}
                >
                  TikTok
                </a>
              </div>

              <p className="mt-3 text-[6px] font-black uppercase tracking-[0.14em] text-cyan-300/50">
                Redes sociales oficiales
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3 pt-6 sm:flex-row">
            <p className="text-[7px] font-black uppercase tracking-[0.16em] text-white/20">
              © 2026 Génesis FC. Todos los derechos reservados.
            </p>

            <p className="text-[7px] font-black uppercase tracking-[0.16em] text-white/20">
              La Paz · Honduras
            </p>
          </div>
        </div>
      </footer>

      <AsistenteGenesis />
    </main>
  );
}
