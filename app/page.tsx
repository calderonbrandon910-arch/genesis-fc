"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/* =========================================================
   NOTICIAS
========================================================= */

const noticias = [
  {
    imagen: "/motagua-genesis-portada-4.jpg",
    categoria: "PRIMER EQUIPO",
    fecha: "09 SEP 2026",
    titulo: "Partido intenso el fin de semana",
    enlace: "/noticias/genesis-prepara-proximo-desafio",
  },
  {
    imagen: "/noticia-2.jpg",
    categoria: "PRIMER EQUIPO",
    fecha: "08 SEP 2026",
    titulo: "El equipo continúa trabajando de cara al próximo compromiso",
    enlace: "/noticias/el-equipo-continua-trabajando",
  },
  {
    imagen: "/noticia-3.jpg",
    categoria: "CLUB",
    fecha: "08 SEP 2026",
    titulo: "Toda la actualidad y novedades de Génesis FC",
    enlace: null,
  },
];

/* =========================================================
   RESULTADOS
========================================================= */

const resultados = [
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
  {
    fecha: "15 AGO 2026",
    competicion: "Liga Nacional",
    local: "Génesis FC",
    logoLocal: "/genesis.jpg",
    golesLocal: 3,
    visitante: "Platense",
    logoVisitante: "/platense.jpg",
    golesVisitante: 0,
    resultadoGenesis: "Victoria",
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
    "2026-09-12T19:00:00-06:00"
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
          aria-label="Hoy juega Génesis FC contra Motagua a las 7 de la noche"
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
            Motagua vs Génesis FC ·
            7:00 PM
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
      aria-label={`Faltan ${tiempo.dias} días, ${tiempo.horas} horas y ${tiempo.minutos} minutos para Motagua contra Génesis FC`}
    >
      <div className="mb-6 text-center">
        <p className="text-[8px] font-black uppercase tracking-[0.32em] text-cyan-300 sm:text-[9px]">
          Cuenta regresiva
        </p>

        <p className="mt-3 text-[7px] font-black uppercase tracking-[0.16em] text-white/30 sm:text-[8px]">
          Falta para Motagua vs
          Génesis FC
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
          12 SEP 2026 · 7:00 PM ·
          HONDURAS
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   HOME
========================================================= */

export default function Home() {
  const [menuOpen, setMenuOpen] =
    useState(false);

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
                href="/equipo"
                onClick={() =>
                  setMenuOpen(false)
                }
                className={`mt-5 rounded-full border border-cyan-300/30 bg-cyan-300/[0.08] py-4 text-center text-[9px] font-black uppercase tracking-[0.15em] text-cyan-300 ${focusDark}`}
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
            unoptimized
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
            Orgullo de La Paz. Una
            ciudad, un escudo, una
            identidad.
          </p>

          <div className="mt-7 flex flex-col gap-2.5">
            <a
              href="#partidos"
              className={`rounded-full bg-white px-6 py-3.5 text-center text-[7px] font-black uppercase tracking-[0.13em] text-[#020817] ${focusDark}`}
            >
              Próximo partido →
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
          unoptimized
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
              Orgullo de La Paz. Una
              ciudad, un escudo, una
              identidad.
            </p>

            <div className="mt-10 flex gap-3">
              <a
                href="#partidos"
                className={`rounded-full bg-white px-8 py-4 text-center text-[9px] font-black uppercase tracking-[0.17em] text-[#020817] ${focusDark}`}
              >
                Próximo partido →
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
          <div className="border-b border-black/10 pb-7">
            <p className="text-[7px] font-black uppercase tracking-[0.26em] text-[#0d72d6] sm:text-[9px]">
              Actualidad del club
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
          </div>

          {/* NOTICIA PRINCIPAL */}

          <article className="mt-8 overflow-hidden rounded-[26px] bg-[#06142d] text-white lg:rounded-[34px]">
            <div className="lg:hidden">
              <div className="relative aspect-[16/11] min-h-[320px] sm:min-h-[480px]">
                <Image
                  src={noticias[0].imagen}
                  alt={noticias[0].titulo}
                  fill
                  unoptimized
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

                  <h3 className="mt-5 text-[2.3rem] font-black uppercase leading-[0.92] tracking-[-0.055em]">
                    Partido intenso
                    <br />
                    el fin de semana
                  </h3>

                  <Link
                    href={
                      noticias[0].enlace!
                    }
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
                href={
                  noticias[0].enlace!
                }
                aria-label={`Abrir noticia: ${noticias[0].titulo}`}
                className={`group relative min-h-[620px] overflow-hidden ${focusDark}`}
              >
                <Image
                  src={noticias[0].imagen}
                  alt={noticias[0].titulo}
                  fill
                  unoptimized
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

                  <h3 className="mt-6 text-[3.15rem] font-black uppercase leading-[0.92] tracking-[-0.055em] xl:text-[3.7rem]">
                    Partido intenso
                    <br />
                    el fin de semana
                  </h3>

                  <p className="mt-6 max-w-[460px] text-sm leading-7 text-white/45">
                    Génesis FC visita a
                    Motagua en un duelo que
                    promete intensidad,
                    historia y mucho en
                    juego.
                  </p>
                </div>

                <Link
                  href={
                    noticias[0].enlace!
                  }
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
            <p className="text-[8px] font-black uppercase tracking-[0.28em] text-cyan-300">
              Liga Nacional · Jornada 7
            </p>

            <h2
              id="titulo-proximo-partido"
              className="mt-4 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl"
            >
              Próximo desafío
            </h2>

            <p className="mt-3 text-[10px] text-white/45 sm:text-sm">
              Sábado 12 de septiembre ·
              7:00 PM
            </p>
          </div>

          <CuentaRegresiva />

          <Link
            href="/partidos/motagua-vs-genesis"
            aria-label="Abrir centro del partido Motagua contra Génesis FC"
            className={`group mx-auto mt-14 block max-w-[1100px] rounded-[30px] border border-white/10 bg-white/[0.035] px-4 py-8 transition duration-300 hover:border-cyan-300/30 hover:bg-white/[0.055] sm:px-8 sm:py-10 ${focusDark}`}
          >
            <div className="grid grid-cols-[1fr_48px_1fr] items-center gap-2 sm:grid-cols-[1fr_120px_1fr]">
              <div className="text-center">
                <div className="relative mx-auto h-24 w-24 transition duration-500 group-hover:scale-[1.03] sm:h-48 sm:w-48 lg:h-56 lg:w-56">
                  <Image
                    src="/motagua.png"
                    alt="Escudo de Motagua"
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
                  Motagua
                </h3>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-[8px] font-black transition duration-300 group-hover:border-cyan-300/40 group-hover:bg-cyan-300 group-hover:text-[#06142d] sm:h-20 sm:w-20"
                >
                  VS
                </div>

                <p className="mt-4 hidden text-[6px] font-black uppercase tracking-[0.18em] text-cyan-300 sm:block">
                  Ver partido
                </p>
              </div>

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

                <p className="mt-5 text-[7px] font-black uppercase text-cyan-300">
                  Visitante
                </p>

                <h3 className="mt-2 text-base font-black uppercase sm:text-3xl">
                  Génesis FC
                </h3>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6 text-center">
              <p className="text-[9px] text-white/35 sm:text-xs">
                Estadio Carlos Miranda ·
                Comayagua, Honduras
              </p>

              <div className="mt-5 inline-flex items-center gap-3 rounded-full bg-cyan-300 px-6 py-3 text-[7px] font-black uppercase tracking-[0.15em] text-[#06142d] transition group-hover:bg-white sm:text-[8px]">
                Centro del partido
                <span aria-hidden="true">
                  →
                </span>
              </div>
            </div>
          </Link>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/partidos/motagua-vs-genesis"
              className={`inline-flex w-full items-center justify-center rounded-full bg-cyan-300 px-7 py-4 text-[8px] font-black uppercase tracking-[0.15em] text-[#05142f] transition duration-300 hover:bg-white sm:w-auto ${focusDark}`}
            >
              Centro del partido →
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
                aria-label="Últimos cuatro resultados: victoria, derrota, empate y victoria"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-[9px] font-black text-emerald-300">
                  V
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/15 text-[9px] font-black text-red-300">
                  D
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[9px] font-black text-white/70">
                  E
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-[9px] font-black text-emerald-300">
                  V
                </span>
              </div>

              <p className="mt-4 text-[8px] font-black uppercase tracking-[0.15em] text-cyan-300">
                2 victorias · 1 empate ·
                1 derrota
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
                          {
                            partido.competicion
                          }
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
                            src={
                              partido.logoLocal
                            }
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
                            {
                              partido.golesLocal
                            }
                          </span>

                          <span
                            aria-hidden="true"
                            className="text-lg font-black text-black/15"
                          >
                            –
                          </span>

                          <span className="text-4xl font-black tracking-[-0.08em] sm:text-5xl">
                            {
                              partido.golesVisitante
                            }
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
                            {
                              partido.resultadoGenesis
                            }
                          </p>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="relative mx-auto h-16 w-16 sm:h-20 sm:w-20">
                          <Image
                            src={
                              partido.logoVisitante
                            }
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
                          {
                            partido.visitante
                          }
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
                7
              </p>

              <p className="mt-2 text-[7px] font-black uppercase tracking-[0.2em] text-white/35">
                Goles a favor
              </p>
            </div>

            <div className="rounded-[22px] bg-white p-6">
              <p className="text-4xl font-black">
                3
              </p>

              <p className="mt-2 text-[7px] font-black uppercase tracking-[0.2em] text-black/35">
                Goles en contra
              </p>
            </div>

            <div className="rounded-[22px] bg-white p-6">
              <p className="text-4xl font-black">
                +4
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
          CLUB
      ===================================================== */}

      <section
        id="club"
        aria-labelledby="titulo-club"
        className="bg-[#f4f3ef] px-4 py-16 text-[#06142d] sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16"
      >
        <div className="mx-auto grid max-w-[1550px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.28em] text-[#168cab]">
              Nuestra identidad
            </p>

            <h2
              id="titulo-club"
              className="mt-5 text-[3.1rem] font-black uppercase leading-[0.8] tracking-[-0.07em] sm:text-[5rem] lg:text-[7.8rem]"
            >
              Más que
              <br />
              fútbol
              <span className="text-[#168cab]">
                .
              </span>
            </h2>

            <p className="mt-6 max-w-[620px] text-[12px] leading-6 text-black/50 sm:text-base sm:leading-8">
              Génesis FC representa
              pasión, identidad y
              orgullo. Un club que
              compite llevando consigo
              el nombre de La Paz y el
              sentimiento de toda una
              afición.
            </p>

            {/* Todavía no existe una página de historia.
                Se conserva visualmente sin crear un enlace falso. */}

            <span
              aria-disabled="true"
              className="mt-8 inline-flex cursor-default rounded-full bg-[#06142d] px-7 py-4 text-[8px] font-black uppercase tracking-[0.13em] text-white"
            >
              Nuestra historia · Próximamente
            </span>
          </div>

          <div className="relative overflow-hidden rounded-[34px] bg-[#061a3d] p-7 text-white sm:p-12 lg:min-h-[580px]">
            <div className="relative h-28 w-28 sm:h-40 sm:w-40">
              <Image
                src="/genesis.jpg"
                alt="Escudo de Génesis FC"
                fill
                quality={100}
                sizes="160px"
                className="object-contain"
              />
            </div>

            <p className="mt-8 text-[8px] font-black uppercase tracking-[0.3em] text-cyan-300">
              Génesis FC
            </p>

            <h3 className="mt-5 text-[2.7rem] font-black uppercase leading-[0.88] tracking-[-0.05em] sm:text-[5.2rem]">
              Orgullo
              <br />
              de La Paz
            </h3>
          </div>
        </div>
      </section>

      {/* =====================================================
          EQUIPO
      ===================================================== */}

      <section
        id="equipo"
        aria-labelledby="titulo-equipo"
        className="relative overflow-hidden bg-gradient-to-r from-[#041126] via-[#09265b] to-[#0c52a0] px-4 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.28em] text-cyan-300">
                Primer equipo
              </p>

              <h2
                id="titulo-equipo"
                className="mt-4 text-[3rem] font-black uppercase leading-[0.86] tracking-[-0.06em] sm:text-[5.5rem]"
              >
                Los nuestros
                <span className="text-cyan-300">
                  .
                </span>
              </h2>
            </div>

            <Link
              href="/equipo"
              className={`hidden rounded-full border border-white/15 bg-white/[0.05] px-6 py-4 text-[8px] font-black uppercase tracking-[0.15em] text-white transition hover:bg-white hover:text-[#06142d] sm:inline-flex ${focusDark}`}
            >
              Ver plantilla completa →
            </Link>
          </div>

          <div
            className="mt-9 flex snap-x gap-4 overflow-x-auto pb-5 sm:gap-5"
            aria-label="Jugadores destacados del primer equipo"
          >
            {jugadores.map(
              (jugador) => (
                <Link
                  key={jugador.nombre}
                  href={jugador.enlace}
                  aria-label={`Ver perfil de ${jugador.nombre}, ${jugador.posicion}`}
                  className={`group min-w-[245px] snap-start overflow-hidden rounded-[24px] border border-white/10 bg-[#041126] transition hover:-translate-y-1 hover:border-cyan-300/30 sm:min-w-[340px] lg:min-w-[370px] ${focusDark}`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={jugador.imagen}
                      alt={`${jugador.nombre}, jugador de Génesis FC`}
                      fill
                      unoptimized
                      sizes="(max-width:640px) 245px,370px"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#041126] via-transparent to-transparent"
                    />

                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 right-4 text-[74px] font-black leading-none text-white/[0.12] sm:text-[100px]"
                    >
                      {jugador.numero}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <p className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-300">
                      {jugador.posicion}
                    </p>

                    <h3 className="mt-2 text-2xl font-black uppercase sm:text-4xl">
                      {jugador.nombre}
                    </h3>

                    <p className="mt-4 text-[7px] font-black uppercase tracking-[0.16em] text-white/40">
                      Ver perfil →
                    </p>
                  </div>
                </Link>
              )
            )}
          </div>

          <div className="mt-7 flex justify-center sm:mt-9">
            <Link
              href="/equipo"
              className={`inline-flex w-full items-center justify-center gap-3 rounded-full bg-cyan-300 px-8 py-4 text-[8px] font-black uppercase tracking-[0.16em] text-[#06142d] transition hover:bg-white sm:w-auto sm:text-[9px] ${focusDark}`}
            >
              Ver plantilla completa
              <span aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          TIENDA
      ===================================================== */}

      <section
        aria-labelledby="titulo-tienda"
        className="bg-[#f3f3f2] px-4 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16"
      >
        <div className="mx-auto max-w-[1550px]">
          <div className="grid overflow-hidden rounded-[34px] bg-[#0757bb] text-white lg:grid-cols-[0.85fr_1.15fr]">
            <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
              <p className="text-[8px] font-black uppercase tracking-[0.28em] text-cyan-200">
                Tienda oficial
              </p>

              <h2
                id="titulo-tienda"
                className="mt-5 text-[3rem] font-black uppercase leading-[0.82] tracking-[-0.06em] sm:text-[5.5rem]"
              >
                Lleva
                <br />
                el escudo
                <br />
                contigo
                <span className="text-cyan-200">
                  .
                </span>
              </h2>

              <p className="mt-6 max-w-[450px] text-[12px] leading-6 text-white/60 sm:text-base">
                La camiseta oficial de
                Génesis FC. Nuestra
                identidad, nuestros
                colores y nuestra ciudad.
              </p>

              {/* La tienda todavía no tiene una ruta propia. */}

              <span
                aria-disabled="true"
                className="mt-8 w-fit cursor-default rounded-full bg-white px-7 py-4 text-[8px] font-black uppercase text-[#05142f]"
              >
                Colección · Próximamente
              </span>
            </div>

            <div className="relative min-h-[420px] sm:min-h-[680px]">
              <Image
                src="/tienda-camiseta.png"
                alt="Camiseta oficial de Génesis FC"
                fill
                unoptimized
                sizes="(max-width:1023px) 100vw,60vw"
                className="object-cover object-top"
              />
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
                Orgullo de La Paz.
                Pasión, identidad y
                fútbol hondureño.
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
                  href="/equipo"
                  className={`text-xs text-white/55 ${focusDark}`}
                >
                  Plantilla completa
                </Link>

                <Link
                  href="/partidos/motagua-vs-genesis"
                  className={`text-xs text-white/55 ${focusDark}`}
                >
                  Centro del partido
                </Link>
              </nav>
            </div>

            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.26em] text-cyan-300">
                Síguenos
              </p>

              <p className="mt-5 text-xs leading-6 text-white/40">
                Sigue toda la actualidad
                de Génesis FC.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {[
                  "Facebook",
                  "Instagram",
                  "TikTok",
                ].map(
                  (red) => (
                    <span
                      key={red}
                      aria-disabled="true"
                      className="cursor-default rounded-full border border-white/15 px-4 py-2.5 text-[7px] font-black uppercase text-white/50"
                    >
                      {red}
                    </span>
                  )
                )}
              </div>

              <p className="mt-3 text-[6px] font-black uppercase tracking-[0.14em] text-white/20">
                Enlaces oficiales próximamente
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3 pt-6 sm:flex-row">
            <p className="text-[7px] font-black uppercase tracking-[0.16em] text-white/20">
              © 2026 Génesis FC. Todos
              los derechos reservados.
            </p>

            <p className="text-[7px] font-black uppercase tracking-[0.16em] text-white/20">
              La Paz · Honduras
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}