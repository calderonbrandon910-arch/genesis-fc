"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/* =========================================================
   TIPOS
========================================================= */

type Tiempo = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
};

type Resultado = {
  fecha: string;
  local: string;
  logoLocal: string;
  golesLocal: number;
  visitante: string;
  logoVisitante: string;
  golesVisitante: number;
  estado: "V" | "E" | "D";
};

/* =========================================================
   ÚLTIMOS PARTIDOS DE GÉNESIS
========================================================= */

const resultadosGenesis: Resultado[] = [
  {
    fecha: "06 SEP",
    local: "Juticalpa",
    logoLocal: "/juti.png",
    golesLocal: 0,
    visitante: "Génesis FC",
    logoVisitante: "/genesis.jpg",
    golesVisitante: 3,
    estado: "V",
  },
  {
    fecha: "29 AGO",
    local: "Génesis FC",
    logoLocal: "/genesis.jpg",
    golesLocal: 1,
    visitante: "Marathón",
    logoVisitante: "/marathon.png",
    golesVisitante: 2,
    estado: "D",
  },
  {
    fecha: "22 AGO",
    local: "Atlético Independiente",
    logoLocal: "/independiente.png",
    golesLocal: 1,
    visitante: "Génesis FC",
    logoVisitante: "/genesis.jpg",
    golesVisitante: 1,
    estado: "E",
  },
  {
    fecha: "15 AGO",
    local: "Génesis FC",
    logoLocal: "/genesis.jpg",
    golesLocal: 3,
    visitante: "Platense",
    logoVisitante: "/platense.jpg",
    golesVisitante: 0,
    estado: "V",
  },
];

/* =========================================================
   ÚLTIMOS PARTIDOS DE MOTAGUA
========================================================= */

const resultadosMotagua: Resultado[] = [
  {
    fecha: "05 SEP",
    local: "Atlético Independiente",
    logoLocal: "/independiente.png",
    golesLocal: 1,
    visitante: "Motagua",
    logoVisitante: "/motagua.png",
    golesVisitante: 1,
    estado: "E",
  },
  {
    fecha: "29 AGO",
    local: "Motagua",
    logoLocal: "/motagua.png",
    golesLocal: 2,
    visitante: "Olancho FC",
    logoVisitante: "/olancho.png",
    golesVisitante: 1,
    estado: "V",
  },
  {
    fecha: "25 AGO",
    local: "Municipal",
    logoLocal: "/municipal.jpg",
    golesLocal: 1,
    visitante: "Motagua",
    logoVisitante: "/motagua.png",
    golesVisitante: 1,
    estado: "E",
  },
  {
    fecha: "21 AGO",
    local: "Motagua",
    logoLocal: "/motagua.png",
    golesLocal: 4,
    visitante: "UPN",
    logoVisitante: "/upn.png",
    golesVisitante: 1,
    estado: "V",
  },
];

/* =========================================================
   LOGO
========================================================= */

function Logo({
  src,
  alt,
  size = "normal",
}: {
  src: string;
  alt: string;
  size?: "normal" | "large";
}) {
  return (
    <div
      className={`relative shrink-0 ${
        size === "large"
          ? "h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40"
          : "h-9 w-9 sm:h-10 sm:w-10"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        quality={100}
        sizes={
          size === "large"
            ? "160px"
            : "40px"
        }
        className="object-contain"
      />
    </div>
  );
}

/* =========================================================
   ESTADO V / E / D
========================================================= */

function Estado({
  estado,
}: {
  estado: "V" | "E" | "D";
}) {
  const estilos =
    estado === "V"
      ? "bg-emerald-500 text-white"
      : estado === "D"
        ? "bg-red-500 text-white"
        : "bg-[#168cab] text-white";

  return (
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[8px] font-black ${estilos}`}
    >
      {estado}
    </span>
  );
}

/* =========================================================
   LISTA DE FORMA
========================================================= */

function FormaEquipo({
  equipo,
  subtitulo,
  logo,
  resultados,
}: {
  equipo: string;
  subtitulo: string;
  logo: string;
  resultados: Resultado[];
}) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_70px_rgba(6,20,45,0.06)]">
      {/* CABECERA */}

      <div className="flex flex-col gap-5 border-b border-black/[0.07] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0">
            <Image
              src={logo}
              alt={equipo}
              fill
              quality={100}
              sizes="64px"
              className="object-contain"
            />
          </div>

          <div>
            <p className="text-[7px] font-black uppercase tracking-[0.25em] text-[#168cab]">
              {subtitulo}
            </p>

            <h3 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
              {equipo}
            </h3>
          </div>
        </div>

        <div>
          <p className="mb-3 text-[6px] font-black uppercase tracking-[0.18em] text-black/25">
            Últimos 4
          </p>

          <div className="flex gap-2">
            {resultados.map(
              (resultado, index) => (
                <Estado
                  key={`${resultado.fecha}-${index}`}
                  estado={
                    resultado.estado
                  }
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* PARTIDOS */}

      <div>
        {resultados.map(
          (resultado) => (
            <div
              key={`${resultado.fecha}-${resultado.local}-${resultado.visitante}`}
              className="grid grid-cols-[48px_minmax(0,1fr)_48px_minmax(0,1fr)_30px] items-center gap-2 border-b border-black/[0.06] px-3 py-5 last:border-b-0 sm:grid-cols-[70px_minmax(0,1fr)_70px_minmax(0,1fr)_36px] sm:gap-4 sm:px-6"
            >
              {/* FECHA */}

              <p className="text-[6px] font-black uppercase tracking-[0.12em] text-black/30 sm:text-[7px]">
                {resultado.fecha}
              </p>

              {/* LOCAL */}

              <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
                <p className="truncate text-right text-[7px] font-black uppercase sm:text-[10px]">
                  {resultado.local}
                </p>

                <Logo
                  src={
                    resultado.logoLocal
                  }
                  alt={resultado.local}
                />
              </div>

              {/* MARCADOR */}

              <div className="flex items-center justify-center gap-1 rounded-[10px] bg-[#06142d] px-1 py-2 text-white sm:rounded-[12px]">
                <span className="text-sm font-black sm:text-base">
                  {
                    resultado.golesLocal
                  }
                </span>

                <span className="text-[6px] text-white/30">
                  —
                </span>

                <span className="text-sm font-black sm:text-base">
                  {
                    resultado.golesVisitante
                  }
                </span>
              </div>

              {/* VISITANTE */}

              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <Logo
                  src={
                    resultado.logoVisitante
                  }
                  alt={
                    resultado.visitante
                  }
                />

                <p className="truncate text-[7px] font-black uppercase sm:text-[10px]">
                  {
                    resultado.visitante
                  }
                </p>
              </div>

              {/* ESTADO */}

              <Estado
                estado={
                  resultado.estado
                }
              />
            </div>
          )
        )}
      </div>
    </article>
  );
}

/* =========================================================
   PÁGINA
========================================================= */

export default function MotaguaVsGenesisPage() {
  const [tiempo, setTiempo] =
    useState<Tiempo>({
      dias: 0,
      horas: 0,
      minutos: 0,
      segundos: 0,
    });

  const [montado, setMontado] =
    useState(false);

  const [terminado, setTerminado] =
    useState(false);

  useEffect(() => {
    setMontado(true);

    const objetivo = new Date(
      "2026-09-12T19:00:00-06:00"
    ).getTime();

    function actualizar() {
      const diferencia =
        objetivo - Date.now();

      if (diferencia <= 0) {
        setTiempo({
          dias: 0,
          horas: 0,
          minutos: 0,
          segundos: 0,
        });

        setTerminado(true);

        return;
      }

      setTerminado(false);

      setTiempo({
        dias: Math.floor(
          diferencia /
            (1000 *
              60 *
              60 *
              24)
        ),

        horas: Math.floor(
          (diferencia /
            (1000 *
              60 *
              60)) %
            24
        ),

        minutos: Math.floor(
          (diferencia /
            (1000 * 60)) %
            60
        ),

        segundos: Math.floor(
          (diferencia / 1000) %
            60
        ),
      });
    }

    actualizar();

    const intervalo =
      window.setInterval(
        actualizar,
        1000
      );

    return () =>
      window.clearInterval(
        intervalo
      );
  }, []);

  return (
    <main className="min-h-screen bg-[#f3f3f1] text-[#06142d]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[#020817]/80 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:h-[86px] sm:px-8 lg:px-12">

          <Link
            href="/"
            className="flex items-center gap-3"
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
            href="/calendario"
            className="rounded-full border border-white/15 px-4 py-3 text-[7px] font-black uppercase tracking-[0.15em] transition hover:bg-white hover:text-[#06142d] sm:px-6 sm:text-[8px]"
          >
            ← Calendario
          </Link>

        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#020817] px-4 pb-14 pt-[118px] text-white sm:px-8 sm:pb-20 sm:pt-[150px] lg:px-12 lg:pb-24">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(20,125,213,0.28),transparent_42%)]" />

        <div className="absolute -left-[220px] top-[80px] h-[520px] w-[520px] rounded-full border border-white/[0.035]" />

        <div className="absolute -right-[250px] top-[20px] h-[650px] w-[650px] rounded-full border border-cyan-300/[0.05]" />

        <div className="relative mx-auto max-w-[1400px]">

          <div className="text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />

              <p className="text-[7px] font-black uppercase tracking-[0.22em] text-white/55 sm:text-[8px]">
                Liga Nacional ·
                Jornada 7
              </p>
            </div>

            <p className="mt-5 text-[8px] font-black uppercase tracking-[0.22em] text-cyan-300">
              Sábado · 12 Sep
              2026 · 7:00 PM
            </p>
          </div>

          {/* EQUIPOS */}

          <div className="mx-auto mt-10 grid max-w-[1000px] grid-cols-[1fr_70px_1fr] items-center gap-2 sm:mt-14 sm:grid-cols-[1fr_130px_1fr] sm:gap-5">

            <div className="flex min-w-0 flex-col items-center">
              <Logo
                src="/motagua.png"
                alt="Motagua"
                size="large"
              />

              <h1 className="mt-5 text-center text-xl font-black uppercase tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                Motagua
              </h1>

              <p className="mt-2 text-[6px] font-black uppercase tracking-[0.2em] text-white/30">
                Local
              </p>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl font-black italic tracking-[-0.08em] text-white/15 sm:text-5xl">
                VS
              </span>

              <div className="mt-4 h-10 w-px bg-gradient-to-b from-cyan-300/60 to-transparent sm:h-16" />
            </div>

            <div className="flex min-w-0 flex-col items-center">
              <Logo
                src="/genesis.jpg"
                alt="Génesis FC"
                size="large"
              />

              <h2 className="mt-5 text-center text-xl font-black uppercase tracking-[-0.04em] text-cyan-300 sm:text-4xl lg:text-5xl">
                Génesis FC
              </h2>

              <p className="mt-2 text-[6px] font-black uppercase tracking-[0.2em] text-white/30">
                Visitante
              </p>
            </div>

          </div>

          {/* CONTADOR */}

          <div className="mx-auto mt-12 max-w-[720px] border-t border-white/10 pt-8 sm:mt-16 sm:pt-10">

            <p className="text-center text-[7px] font-black uppercase tracking-[0.28em] text-white/30">
              {terminado
                ? "Matchday"
                : "Cuenta regresiva para el partido"}
            </p>

            {!montado ? (
              <p className="mt-7 text-center text-xs font-bold uppercase tracking-[0.2em] text-white/30">
                Activando reloj...
              </p>
            ) : (
              <div className="mt-7 grid grid-cols-4 gap-2 sm:gap-4">

                {[
                  [
                    "Días",
                    tiempo.dias,
                  ],
                  [
                    "Horas",
                    tiempo.horas,
                  ],
                  [
                    "Min",
                    tiempo.minutos,
                  ],
                  [
                    "Seg",
                    tiempo.segundos,
                  ],
                ].map(
                  ([label, value]) => (
                    <div
                      key={String(
                        label
                      )}
                      className="rounded-[18px] border border-white/10 bg-white/[0.045] px-2 py-5 text-center backdrop-blur-sm sm:rounded-[22px] sm:py-7"
                    >
                      <p className="text-2xl font-black tabular-nums tracking-[-0.05em] sm:text-4xl lg:text-5xl">
                        {String(
                          value
                        ).padStart(
                          2,
                          "0"
                        )}
                      </p>

                      <p className="mt-2 text-[5px] font-black uppercase tracking-[0.18em] text-white/25 sm:text-[6px]">
                        {label}
                      </p>
                    </div>
                  )
                )}

              </div>
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          DATOS DEL PARTIDO
      ===================================================== */}

      <section className="relative z-10 -mt-1 px-4 sm:px-8 lg:px-12">

        <div className="mx-auto grid max-w-[1200px] grid-cols-2 overflow-hidden rounded-[24px] border border-black/[0.06] bg-white shadow-[0_25px_80px_rgba(6,20,45,0.10)] sm:grid-cols-4 sm:rounded-[28px]">

          {[
            [
              "Fecha",
              "12 SEP 2026",
            ],
            [
              "Hora",
              "7:00 PM",
            ],
            [
              "Estadio",
              "Carlos Miranda",
            ],
            [
              "Ciudad",
              "Comayagua",
            ],
          ].map(
            (
              [titulo, valor],
              index
            ) => (
              <div
                key={titulo}
                className={`px-4 py-6 text-center sm:px-6 sm:py-8 ${
                  index !== 0
                    ? "border-l border-black/[0.06]"
                    : ""
                } ${
                  index >= 2
                    ? "border-t border-black/[0.06] sm:border-t-0"
                    : ""
                }`}
              >
                <p className="text-[6px] font-black uppercase tracking-[0.2em] text-[#168cab]">
                  {titulo}
                </p>

                <p className="mt-2 text-[10px] font-black uppercase sm:text-xs">
                  {valor}
                </p>
              </div>
            )
          )}

        </div>
      </section>

      {/* =====================================================
          PREVIA
      ===================================================== */}

      <section className="px-4 py-16 sm:px-8 sm:py-24 lg:px-12">

        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">

          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#168cab]" />

              <p className="text-[7px] font-black uppercase tracking-[0.25em] text-[#168cab]">
                La previa
              </p>
            </div>

            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.88] tracking-[-0.06em] sm:text-7xl">
              Todo listo
              <br />
              para el
              <br />
              desafío
              <span className="text-[#168cab]">
                .
              </span>
            </h2>
          </div>

          <div className="flex flex-col justify-center">

            <p className="text-base font-semibold leading-8 text-[#06142d]/70 sm:text-lg sm:leading-9">
              Génesis FC se desplaza
              hasta Comayagua para medirse
              ante Motagua en uno de los
              compromisos más atractivos de
              la jornada. Los caninos llegan
              después de una contundente
              victoria como visitantes ante
              Juticalpa.
            </p>

            <p className="mt-6 text-sm leading-7 text-black/45 sm:text-base sm:leading-8">
              Motagua también llega con una
              racha competitiva, por lo que
              el duelo promete intensidad
              desde el primer minuto en el
              Estadio Carlos Miranda.
            </p>

            <Link
              href="/noticias/genesis-prepara-proximo-desafio"
              className="mt-8 inline-flex w-fit items-center gap-4 rounded-full bg-[#06142d] px-7 py-4 text-[7px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#168cab]"
            >
              Leer previa completa
              <span>→</span>
            </Link>

          </div>
        </div>
      </section>

      {/* =====================================================
          FORMA RECIENTE DE AMBOS EQUIPOS
      ===================================================== */}

      <section className="bg-[#ececea] px-4 py-16 sm:px-8 sm:py-24 lg:px-12">

        <div className="mx-auto max-w-[1300px]">

          <div className="border-b border-black/10 pb-7">

            <p className="text-[7px] font-black uppercase tracking-[0.27em] text-[#168cab]">
              Antes del partido
            </p>

            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
              Forma reciente
              <span className="text-[#168cab]">
                .
              </span>
            </h2>

            <p className="mt-4 max-w-[550px] text-xs leading-6 text-black/40 sm:text-sm">
              Los últimos cuatro
              resultados de Motagua y
              Génesis FC antes del
              enfrentamiento.
            </p>

          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">

            <FormaEquipo
              equipo="Motagua"
              subtitulo="El rival"
              logo="/motagua.png"
              resultados={
                resultadosMotagua
              }
            />

            <FormaEquipo
              equipo="Génesis FC"
              subtitulo="Los caninos"
              logo="/genesis.jpg"
              resultados={
                resultadosGenesis
              }
            />

          </div>

          {/* COMPARACIÓN SIMPLE */}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">

            <div className="rounded-[24px] bg-[#06142d] p-6 text-white sm:p-7">

              <div className="flex items-center gap-4">

                <div className="relative h-12 w-12">
                  <Image
                    src="/motagua.png"
                    alt="Motagua"
                    fill
                    quality={100}
                    sizes="48px"
                    className="object-contain"
                  />
                </div>

                <div>
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/35">
                    Motagua
                  </p>

                  <p className="mt-1 text-xl font-black uppercase">
                    2V · 2E · 0D
                  </p>
                </div>

              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-[8px] font-black uppercase tracking-[0.14em] text-cyan-300">
                  8 goles a favor · 4
                  en contra
                </p>
              </div>

            </div>

            <div className="rounded-[24px] bg-white p-6 sm:p-7">

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
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-black/35">
                    Génesis FC
                  </p>

                  <p className="mt-1 text-xl font-black uppercase">
                    2V · 1E · 1D
                  </p>
                </div>

              </div>

              <div className="mt-6 border-t border-black/[0.07] pt-5">
                <p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#168cab]">
                  7 goles a favor · 3
                  en contra
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          CTA FINAL
      ===================================================== */}

      <section className="overflow-hidden bg-[#071a3b] px-4 py-16 text-white sm:px-8 sm:py-20 lg:px-12">

        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-[7px] font-black uppercase tracking-[0.25em] text-cyan-300">
              12 Septiembre 2026
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
              Vamos Génesis
              <span className="text-cyan-300">
                .
              </span>
            </h2>

            <p className="mt-4 max-w-[520px] text-xs leading-6 text-white/40">
              La próxima batalla se
              juega en Comayagua. Los
              caninos van a por todas.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit items-center gap-4 rounded-full bg-cyan-300 px-7 py-4 text-[7px] font-black uppercase tracking-[0.18em] text-[#06142d] transition hover:bg-white"
          >
            Volver al inicio
            <span>→</span>
          </Link>

        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-[#020817] px-4 py-9 text-white sm:px-8 lg:px-12">

        <div className="mx-auto flex max-w-[1200px] flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">

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

            <p className="text-xs font-black uppercase">
              Génesis FC
            </p>
          </div>

          <div className="flex gap-5">

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
              href="/noticias/genesis-prepara-proximo-desafio"
              className="text-[6px] font-black uppercase tracking-[0.16em] text-white/30 transition hover:text-white"
            >
              Previa
            </Link>

          </div>
        </div>

        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 pt-6 sm:flex-row sm:justify-between">

          <p className="text-[6px] font-black uppercase tracking-[0.14em] text-white/20">
            © 2026 Génesis FC. Todos
            los derechos reservados.
          </p>

          <p className="text-[6px] font-black uppercase tracking-[0.14em] text-white/20">
            La Paz · Honduras
          </p>

        </div>

      </footer>

    </main>
  );
}