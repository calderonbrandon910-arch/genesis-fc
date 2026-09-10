"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/* =========================================================
   TIPOS
========================================================= */

type Partido = {
  jornada: number;
  fecha: string;
  hora: string;
  local: string;
  visitante: string;
  logoLocal: string;
  logoVisitante: string;
  estadio: string;
  ciudad: string;
};

type Equipo = {
  posicion: number;
  nombre: string;
  logo: string;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
};

/* =========================================================
   PARTIDOS
========================================================= */

const partidos: Partido[] = [
  {
    jornada: 7,
    fecha: "12 SEP 2026",
    hora: "7:00 PM",
    local: "Motagua",
    visitante: "Génesis FC",
    logoLocal: "/motagua.png",
    logoVisitante: "/genesis.jpg",
    estadio: "Estadio Carlos Miranda",
    ciudad: "Comayagua, Honduras",
  },
  {
    jornada: 8,
    fecha: "19 SEP 2026",
    hora: "3:00 PM",
    local: "Génesis FC",
    visitante: "Olancho FC",
    logoLocal: "/genesis.jpg",
    logoVisitante: "/olancho.png",
    estadio: "Estadio Roberto Suazo Córdova",
    ciudad: "La Paz, Honduras",
  },
  {
    jornada: 9,
    fecha: "10 OCT 2026",
    hora: "3:00 PM",
    local: "Génesis FC",
    visitante: "Olimpia",
    logoLocal: "/genesis.jpg",
    logoVisitante: "/olimpia.png",
    estadio: "Estadio Roberto Suazo Córdova",
    ciudad: "La Paz, Honduras",
  },
  {
    jornada: 10,
    fecha: "POR CONFIRMAR",
    hora: "POR CONFIRMAR",
    local: "Génesis FC",
    visitante: "Estrella Roja",
    logoLocal: "/genesis.jpg",
    logoVisitante: "/estrella-roja.jpg",
    estadio: "Estadio Roberto Suazo Córdova",
    ciudad: "La Paz, Honduras",
  },
  {
    jornada: 11,
    fecha: "POR CONFIRMAR",
    hora: "POR CONFIRMAR",
    local: "UPN",
    visitante: "Génesis FC",
    logoLocal: "/upn.png",
    logoVisitante: "/genesis.jpg",
    estadio: "Por confirmar",
    ciudad: "Honduras",
  },
  {
    jornada: 12,
    fecha: "POR CONFIRMAR",
    hora: "POR CONFIRMAR",
    local: "CD Choloma",
    visitante: "Génesis FC",
    logoLocal: "/choloma.png",
    logoVisitante: "/genesis.jpg",
    estadio: "Por confirmar",
    ciudad: "Honduras",
  },
  {
    jornada: 13,
    fecha: "POR CONFIRMAR",
    hora: "POR CONFIRMAR",
    local: "Génesis FC",
    visitante: "Real España",
    logoLocal: "/genesis.jpg",
    logoVisitante: "/real-espana.jpg",
    estadio: "Estadio Roberto Suazo Córdova",
    ciudad: "La Paz, Honduras",
  },
  {
    jornada: 14,
    fecha: "POR CONFIRMAR",
    hora: "POR CONFIRMAR",
    local: "Platense",
    visitante: "Génesis FC",
    logoLocal: "/platense.jpg",
    logoVisitante: "/genesis.jpg",
    estadio: "Por confirmar",
    ciudad: "Honduras",
  },
  {
    jornada: 15,
    fecha: "POR CONFIRMAR",
    hora: "POR CONFIRMAR",
    local: "Génesis FC",
    visitante: "Atlético Independiente",
    logoLocal: "/genesis.jpg",
    logoVisitante: "/independiente.png",
    estadio: "Estadio Roberto Suazo Córdova",
    ciudad: "La Paz, Honduras",
  },
  {
    jornada: 16,
    fecha: "POR CONFIRMAR",
    hora: "POR CONFIRMAR",
    local: "Marathón",
    visitante: "Génesis FC",
    logoLocal: "/marathon.png",
    logoVisitante: "/genesis.jpg",
    estadio: "Por confirmar",
    ciudad: "Honduras",
  },
];

/* =========================================================
   TABLA DE POSICIONES
========================================================= */

const equipos: Equipo[] = [
  {
    posicion: 1,
    nombre: "Olimpia",
    logo: "/olimpia.png",
    pj: 6,
    g: 4,
    e: 2,
    p: 0,
    gf: 15,
    gc: 6,
  },
  {
    posicion: 2,
    nombre: "Marathón",
    logo: "/marathon.png",
    pj: 6,
    g: 4,
    e: 2,
    p: 0,
    gf: 11,
    gc: 3,
  },
  {
    posicion: 3,
    nombre: "Real España",
    logo: "/real-espana.jpg",
    pj: 6,
    g: 4,
    e: 2,
    p: 0,
    gf: 11,
    gc: 3,
  },
  {
    posicion: 4,
    nombre: "Génesis FC",
    logo: "/genesis.jpg",
    pj: 6,
    g: 3,
    e: 1,
    p: 2,
    gf: 10,
    gc: 5,
  },
  {
    posicion: 5,
    nombre: "Motagua",
    logo: "/motagua.png",
    pj: 6,
    g: 3,
    e: 1,
    p: 2,
    gf: 10,
    gc: 7,
  },
  {
    posicion: 6,
    nombre: "Olancho FC",
    logo: "/olancho.png",
    pj: 6,
    g: 2,
    e: 3,
    p: 1,
    gf: 5,
    gc: 4,
  },
  {
    posicion: 7,
    nombre: "Estrella Roja",
    logo: "/estrella-roja.jpg",
    pj: 6,
    g: 2,
    e: 2,
    p: 2,
    gf: 11,
    gc: 12,
  },
  {
    posicion: 8,
    nombre: "Atlético Independiente",
    logo: "/independiente.png",
    pj: 6,
    g: 1,
    e: 3,
    p: 2,
    gf: 5,
    gc: 6,
  },
  {
    posicion: 9,
    nombre: "CD Choloma",
    logo: "/choloma.png",
    pj: 6,
    g: 1,
    e: 1,
    p: 4,
    gf: 4,
    gc: 7,
  },
  {
    posicion: 10,
    nombre: "Platense",
    logo: "/platense.jpg",
    pj: 6,
    g: 1,
    e: 1,
    p: 4,
    gf: 4,
    gc: 14,
  },
  {
    posicion: 11,
    nombre: "Juticalpa",
    logo: "/juti.png",
    pj: 6,
    g: 1,
    e: 0,
    p: 5,
    gf: 4,
    gc: 15,
  },
  {
    posicion: 12,
    nombre: "UPN",
    logo: "/upn.png",
    pj: 6,
    g: 0,
    e: 2,
    p: 4,
    gf: 4,
    gc: 12,
  },
];

/* =========================================================
   FUNCIONES
========================================================= */

function diferenciaGoles(equipo: Equipo) {
  return equipo.gf - equipo.gc;
}

function puntos(equipo: Equipo) {
  return equipo.g * 3 + equipo.e;
}

function mostrarDG(valor: number) {
  if (valor > 0) {
    return `+${valor}`;
  }

  return String(valor);
}

/* =========================================================
   ESCUDO
========================================================= */

function Escudo({
  src,
  alt,
  grande = false,
}: {
  src: string;
  alt: string;
  grande?: boolean;
}) {
  return (
    <div
      className={`relative shrink-0 ${
        grande
          ? "h-20 w-20 sm:h-24 sm:w-24"
          : "h-10 w-10 sm:h-12 sm:w-12"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        quality={100}
        sizes={grande ? "96px" : "48px"}
        className="object-contain"
      />
    </div>
  );
}

/* =========================================================
   PÁGINA
========================================================= */

export default function CalendarioPage() {
  const [seccion, setSeccion] = useState<
    "partidos" | "clasificacion"
  >("partidos");

  const genesis = equipos.find(
    (equipo) => equipo.nombre === "Génesis FC"
  )!;

  return (
    <main className="min-h-screen bg-[#f3f3f1] text-[#06142d]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-white/10 bg-[#020817] text-white">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:h-[86px] sm:px-8 lg:px-12">
          <Link
            href="/"
            className="flex items-center gap-3 sm:gap-4"
          >
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
                La Paz · Honduras
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/15 px-4 py-3 text-[7px] font-black uppercase tracking-[0.15em] transition hover:bg-white hover:text-[#06142d] sm:px-6 sm:text-[8px]"
          >
            ← Volver
          </Link>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#061a3d] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(17,133,220,0.40),transparent_38%)]" />

        <div className="absolute -right-20 -top-24 h-[400px] w-[400px] rounded-full border border-white/[0.05] sm:h-[600px] sm:w-[600px]" />

        <div className="absolute -right-10 -top-12 h-[280px] w-[280px] rounded-full border border-cyan-300/[0.08] sm:h-[450px] sm:w-[450px]" />

        <div className="relative mx-auto max-w-[1600px] px-4 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20 lg:px-12 lg:pb-20 lg:pt-24">
          <div className="max-w-[1000px]">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-cyan-300" />

              <p className="text-[7px] font-black uppercase tracking-[0.3em] text-cyan-300 sm:text-[9px]">
                Temporada 2026/27
              </p>
            </div>

            <h1 className="mt-6 text-[3.7rem] font-black uppercase leading-[0.78] tracking-[-0.07em] sm:text-[6rem] lg:text-[8.5rem]">
              Competición
              <span className="text-cyan-300">.</span>
            </h1>

            <p className="mt-7 max-w-[620px] text-[11px] leading-6 text-white/50 sm:text-sm sm:leading-7">
              Calendario, próximos partidos y clasificación de
              Génesis FC en Liga Nacional.
            </p>
          </div>

          {/* PESTAÑAS */}

          <div className="mt-10 inline-flex w-full rounded-[18px] border border-white/10 bg-[#020817]/45 p-1.5 backdrop-blur-md sm:w-auto sm:rounded-full">
            <button
              type="button"
              onClick={() => setSeccion("partidos")}
              className={`flex-1 rounded-[14px] px-6 py-4 text-[8px] font-black uppercase tracking-[0.18em] transition sm:flex-none sm:rounded-full sm:px-9 ${
                seccion === "partidos"
                  ? "bg-white text-[#06142d]"
                  : "text-white/40 hover:text-white"
              }`}
            >
              Partidos
            </button>

            <button
              type="button"
              onClick={() => setSeccion("clasificacion")}
              className={`flex-1 rounded-[14px] px-6 py-4 text-[8px] font-black uppercase tracking-[0.18em] transition sm:flex-none sm:rounded-full sm:px-9 ${
                seccion === "clasificacion"
                  ? "bg-cyan-300 text-[#06142d]"
                  : "text-white/40 hover:text-white"
              }`}
            >
              Clasificación
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          PARTIDOS
      ===================================================== */}

      {seccion === "partidos" && (
        <section className="px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-[1300px]">
            <div className="flex flex-col gap-4 border-b border-black/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[7px] font-black uppercase tracking-[0.25em] text-[#168cab] sm:text-[8px]">
                  Liga Nacional
                </p>

                <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
                  Próximos partidos
                  <span className="text-[#168cab]">.</span>
                </h2>
              </div>

              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-black/30">
                Jornadas 7 — 16
              </p>
            </div>

            <div className="mt-7 space-y-4">
              {partidos.map((partido, index) => (
                <article
                  key={partido.jornada}
                  className={`overflow-hidden rounded-[24px] border bg-white shadow-[0_18px_60px_rgba(6,20,45,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(6,20,45,0.09)] sm:rounded-[28px] ${
                    index === 0
                      ? "border-[#168cab]/30"
                      : "border-black/[0.06]"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4 sm:px-7">
                    <div className="flex items-center gap-3">
                      {index === 0 && (
                        <span className="h-2 w-2 animate-pulse rounded-full bg-[#168cab]" />
                      )}

                      <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#168cab]">
                        Jornada {partido.jornada}
                      </p>
                    </div>

                    {index === 0 && (
                      <span className="rounded-full bg-[#e7f5f8] px-3 py-1.5 text-[6px] font-black uppercase tracking-[0.15em] text-[#147f9b]">
                        Próximo
                      </span>
                    )}
                  </div>

                  <div className="grid items-center gap-6 px-5 py-7 sm:px-7 md:grid-cols-[190px_1fr_210px] md:gap-8">

                    {/* FECHA */}

                    <div className="text-center md:text-left">
                      <p className="text-[7px] font-black uppercase tracking-[0.18em] text-black/30">
                        {partido.fecha}
                      </p>

                      <p className="mt-2 text-xl font-black uppercase tracking-[-0.03em]">
                        {partido.hora}
                      </p>
                    </div>

                    {/* EQUIPOS */}

                    <div className="grid grid-cols-[1fr_40px_1fr] items-center gap-2 sm:grid-cols-[1fr_60px_1fr]">
                      <div className="flex min-w-0 flex-col items-center">
                        <Escudo
                          src={partido.logoLocal}
                          alt={partido.local}
                          grande
                        />

                        <p className="mt-3 max-w-[150px] text-center text-[10px] font-black uppercase leading-tight sm:text-sm">
                          {partido.local}
                        </p>

                        <p className="mt-1 text-[6px] font-black uppercase tracking-[0.16em] text-black/25">
                          Local
                        </p>
                      </div>

                      <div className="flex justify-center">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#06142d] text-[7px] font-black text-white sm:h-11 sm:w-11">
                          VS
                        </span>
                      </div>

                      <div className="flex min-w-0 flex-col items-center">
                        <Escudo
                          src={partido.logoVisitante}
                          alt={partido.visitante}
                          grande
                        />

                        <p className="mt-3 max-w-[150px] text-center text-[10px] font-black uppercase leading-tight sm:text-sm">
                          {partido.visitante}
                        </p>

                        <p className="mt-1 text-[6px] font-black uppercase tracking-[0.16em] text-black/25">
                          Visitante
                        </p>
                      </div>
                    </div>

                    {/* ESTADIO */}

                    <div className="border-t border-black/[0.06] pt-5 text-center md:border-l md:border-t-0 md:pl-7 md:pt-0 md:text-left">
                      <p className="text-[6px] font-black uppercase tracking-[0.2em] text-[#168cab]">
                        Estadio
                      </p>

                      <p className="mt-2 text-[10px] font-bold leading-5">
                        {partido.estadio}
                      </p>

                      <p className="mt-1 text-[8px] text-black/35">
                        {partido.ciudad}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          CLASIFICACIÓN
      ===================================================== */}

      {seccion === "clasificacion" && (
        <section className="px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-[1400px]">

            {/* CABECERA */}

            <div className="flex flex-col gap-5 border-b border-black/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[7px] font-black uppercase tracking-[0.25em] text-[#168cab] sm:text-[8px]">
                  Liga Nacional
                </p>

                <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
                  Clasificación
                  <span className="text-[#168cab]">.</span>
                </h2>
              </div>

              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-black/30">
                Después de 6 partidos
              </p>
            </div>

            {/* TARJETA GÉNESIS */}

            <div className="relative mt-8 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#041126] via-[#09285e] to-[#0871c9] p-6 text-white shadow-[0_25px_80px_rgba(6,20,45,0.18)] sm:p-8 lg:p-10">
              <div className="absolute -right-16 -top-20 h-[300px] w-[300px] rounded-full border border-white/10" />

              <div className="absolute -right-5 -top-10 h-[210px] w-[210px] rounded-full border border-cyan-300/10" />

              <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
                    <Image
                      src="/genesis.jpg"
                      alt="Génesis FC"
                      fill
                      quality={100}
                      sizes="96px"
                      className="object-contain"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-cyan-300" />

                      <p className="text-[7px] font-black uppercase tracking-[0.22em] text-cyan-300">
                        Nuestro equipo
                      </p>
                    </div>

                    <h3 className="mt-3 text-3xl font-black uppercase tracking-[-0.04em] sm:text-5xl">
                      Génesis FC
                    </h3>

                    <p className="mt-2 text-[8px] font-black uppercase tracking-[0.16em] text-white/35">
                      Temporada 2026/27
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="min-w-[85px] rounded-[18px] border border-white/10 bg-white/[0.07] px-4 py-4 text-center backdrop-blur-md sm:min-w-[105px]">
                    <p className="text-3xl font-black sm:text-4xl">
                      4º
                    </p>

                    <p className="mt-2 text-[6px] font-black uppercase tracking-[0.16em] text-white/35">
                      Posición
                    </p>
                  </div>

                  <div className="min-w-[85px] rounded-[18px] border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-4 text-center sm:min-w-[105px]">
                    <p className="text-3xl font-black text-cyan-300 sm:text-4xl">
                      {puntos(genesis)}
                    </p>

                    <p className="mt-2 text-[6px] font-black uppercase tracking-[0.16em] text-white/35">
                      Puntos
                    </p>
                  </div>

                  <div className="min-w-[85px] rounded-[18px] border border-white/10 bg-white/[0.07] px-4 py-4 text-center sm:min-w-[105px]">
                    <p className="text-3xl font-black sm:text-4xl">
                      {mostrarDG(
                        diferenciaGoles(genesis)
                      )}
                    </p>

                    <p className="mt-2 text-[6px] font-black uppercase tracking-[0.16em] text-white/35">
                      DG
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative mt-7 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                <span className="rounded-full bg-white/[0.07] px-4 py-2 text-[7px] font-black uppercase tracking-[0.14em] text-white/55">
                  6 PJ
                </span>

                <span className="rounded-full bg-white/[0.07] px-4 py-2 text-[7px] font-black uppercase tracking-[0.14em] text-white/55">
                  3 Victorias
                </span>

                <span className="rounded-full bg-white/[0.07] px-4 py-2 text-[7px] font-black uppercase tracking-[0.14em] text-white/55">
                  1 Empate
                </span>

                <span className="rounded-full bg-white/[0.07] px-4 py-2 text-[7px] font-black uppercase tracking-[0.14em] text-white/55">
                  2 Derrotas
                </span>

                <span className="rounded-full bg-white/[0.07] px-4 py-2 text-[7px] font-black uppercase tracking-[0.14em] text-white/55">
                  10 GF
                </span>

                <span className="rounded-full bg-white/[0.07] px-4 py-2 text-[7px] font-black uppercase tracking-[0.14em] text-white/55">
                  5 GC
                </span>
              </div>
            </div>

            {/* =================================================
                TABLA DESKTOP / TABLET
            ================================================= */}

            <div className="mt-7 hidden overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_70px_rgba(6,20,45,0.06)] md:block">
              <div className="grid grid-cols-[70px_minmax(220px,1fr)_repeat(8,70px)_85px] items-center bg-[#06142d] px-5 py-5 text-white">
                <p className="text-center text-[7px] font-black uppercase tracking-[0.16em] text-white/35">
                  Pos
                </p>

                <p className="text-[7px] font-black uppercase tracking-[0.16em] text-white/35">
                  Club
                </p>

                {[
                  "PJ",
                  "G",
                  "E",
                  "P",
                  "GF",
                  "GC",
                  "DG",
                  "PTS",
                ].map((titulo) => (
                  <p
                    key={titulo}
                    className="text-center text-[7px] font-black uppercase tracking-[0.12em] text-white/35"
                  >
                    {titulo}
                  </p>
                ))}
              </div>

              {equipos.map((equipo) => {
                const esGenesis =
                  equipo.nombre === "Génesis FC";

                const dg =
                  diferenciaGoles(equipo);

                return (
                  <div
                    key={equipo.nombre}
                    className={`relative grid min-h-[78px] grid-cols-[70px_minmax(220px,1fr)_repeat(8,70px)_85px] items-center border-b border-black/[0.055] px-5 transition last:border-b-0 ${
                      esGenesis
                        ? "bg-[#08275a] text-white"
                        : "hover:bg-[#f7f8f8]"
                    }`}
                  >
                    {esGenesis && (
                      <div className="absolute inset-y-0 left-0 w-1 bg-cyan-300" />
                    )}

                    <div className="flex justify-center">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${
                          equipo.posicion <= 4
                            ? esGenesis
                              ? "bg-cyan-300 text-[#06142d]"
                              : "bg-[#e5f4f7] text-[#147f9b]"
                            : esGenesis
                              ? "bg-white/10"
                              : "bg-black/[0.04]"
                        }`}
                      >
                        {equipo.posicion}
                      </span>
                    </div>

                    <div className="flex min-w-0 items-center gap-4">
                      <Escudo
                        src={equipo.logo}
                        alt={equipo.nombre}
                      />

                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-black uppercase sm:text-sm">
                          {equipo.nombre}
                        </p>

                        {esGenesis && (
                          <p className="mt-1 text-[6px] font-black uppercase tracking-[0.2em] text-cyan-300">
                            GFC · Nuestro equipo
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-center text-xs font-bold">
                      {equipo.pj}
                    </p>

                    <p className="text-center text-xs font-bold">
                      {equipo.g}
                    </p>

                    <p className="text-center text-xs font-bold">
                      {equipo.e}
                    </p>

                    <p className="text-center text-xs font-bold">
                      {equipo.p}
                    </p>

                    <p className="text-center text-xs font-bold">
                      {equipo.gf}
                    </p>

                    <p className="text-center text-xs font-bold">
                      {equipo.gc}
                    </p>

                    <p
                      className={`text-center text-xs font-black ${
                        esGenesis
                          ? "text-cyan-300"
                          : dg > 0
                            ? "text-[#168cab]"
                            : dg < 0
                              ? "text-red-500"
                              : ""
                      }`}
                    >
                      {mostrarDG(dg)}
                    </p>

                    <p
                      className={`text-center text-base font-black ${
                        esGenesis
                          ? "text-cyan-300"
                          : ""
                      }`}
                    >
                      {puntos(equipo)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* =================================================
                CLASIFICACIÓN MÓVIL
            ================================================= */}

            <div className="mt-6 overflow-hidden rounded-[24px] border border-black/[0.06] bg-white shadow-[0_18px_60px_rgba(6,20,45,0.05)] md:hidden">
              <div className="grid grid-cols-[42px_1fr_38px_46px_46px] items-center bg-[#06142d] px-3 py-4 text-white">
                <p className="text-center text-[6px] font-black uppercase text-white/35">
                  #
                </p>

                <p className="text-[6px] font-black uppercase tracking-[0.13em] text-white/35">
                  Club
                </p>

                <p className="text-center text-[6px] font-black uppercase text-white/35">
                  PJ
                </p>

                <p className="text-center text-[6px] font-black uppercase text-white/35">
                  DG
                </p>

                <p className="text-center text-[6px] font-black uppercase text-white/35">
                  PTS
                </p>
              </div>

              {equipos.map((equipo) => {
                const esGenesis =
                  equipo.nombre === "Génesis FC";

                const dg =
                  diferenciaGoles(equipo);

                return (
                  <div
                    key={equipo.nombre}
                    className={`relative grid min-h-[68px] grid-cols-[42px_1fr_38px_46px_46px] items-center border-b border-black/[0.055] px-3 last:border-b-0 ${
                      esGenesis
                        ? "bg-[#08275a] text-white"
                        : ""
                    }`}
                  >
                    {esGenesis && (
                      <div className="absolute inset-y-0 left-0 w-[3px] bg-cyan-300" />
                    )}

                    <p
                      className={`text-center text-[11px] font-black ${
                        esGenesis
                          ? "text-cyan-300"
                          : "text-black/40"
                      }`}
                    >
                      {equipo.posicion}
                    </p>

                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="relative h-8 w-8 shrink-0">
                        <Image
                          src={equipo.logo}
                          alt={equipo.nombre}
                          fill
                          quality={100}
                          sizes="32px"
                          className="object-contain"
                        />
                      </div>

                      <p className="truncate text-[8px] font-black uppercase">
                        {equipo.nombre}
                      </p>
                    </div>

                    <p className="text-center text-[9px] font-bold">
                      {equipo.pj}
                    </p>

                    <p
                      className={`text-center text-[9px] font-black ${
                        esGenesis
                          ? "text-cyan-300"
                          : dg > 0
                            ? "text-[#168cab]"
                            : dg < 0
                              ? "text-red-500"
                              : ""
                      }`}
                    >
                      {mostrarDG(dg)}
                    </p>

                    <p
                      className={`text-center text-[11px] font-black ${
                        esGenesis
                          ? "text-cyan-300"
                          : ""
                      }`}
                    >
                      {puntos(equipo)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* LEYENDA */}

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[18px] border border-black/[0.06] bg-white px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#168cab]" />

                <p className="text-[6px] font-black uppercase tracking-[0.14em] text-black/35">
                  Primeras posiciones
                </p>
              </div>

              <p className="text-[6px] font-black uppercase tracking-[0.14em] text-black/25">
                PJ · Partidos jugados
              </p>

              <p className="text-[6px] font-black uppercase tracking-[0.14em] text-black/25">
                G · Ganados
              </p>

              <p className="text-[6px] font-black uppercase tracking-[0.14em] text-black/25">
                E · Empatados
              </p>

              <p className="text-[6px] font-black uppercase tracking-[0.14em] text-black/25">
                P · Perdidos
              </p>

              <p className="text-[6px] font-black uppercase tracking-[0.14em] text-black/25">
                DG · Diferencia de gol
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="mt-10 bg-[#020817] px-4 py-10 text-white sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
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

              <p className="mt-1 text-[6px] font-black uppercase tracking-[0.2em] text-cyan-300">
                La Paz · Honduras
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="text-[7px] font-black uppercase tracking-[0.16em] text-white/40 transition hover:text-white"
          >
            Volver al inicio →
          </Link>
        </div>

        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 pt-6 sm:flex-row sm:justify-between">
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