"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  jugadores,
  type PosicionJugador,
} from "../../lib/datos-plantel";

type Posicion =
  | "Todos"
  | PosicionJugador;

/* =========================================================
   FILTROS
========================================================= */

const filtros: Posicion[] = [
  "Todos",
  "Portero",
  "Defensa",
  "Mediocampista",
  "Delantero",
];

/* =========================================================
   PÁGINA
========================================================= */

export default function EquipoPage() {
  const [filtro, setFiltro] =
    useState<Posicion>("Todos");

  const jugadoresFiltrados =
    useMemo(() => {
      if (filtro === "Todos") {
        return jugadores;
      }

      return jugadores.filter(
        (jugador) =>
          jugador.posicion === filtro
      );
    }, [filtro]);

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-white/10 bg-[#020817]">
        <div className="mx-auto flex h-[74px] max-w-[1600px] items-center justify-between px-4 sm:h-[86px] sm:px-8 lg:px-12">
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
                Primer equipo
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

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#041126] via-[#08285f] to-[#0c63bf]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(39,209,255,0.16),transparent_35%)]" />

        <div className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full border border-white/[0.05]" />

        <div className="absolute -right-10 top-10 h-[360px] w-[360px] rounded-full border border-cyan-300/[0.08]" />

        <div className="relative mx-auto max-w-[1600px] px-4 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="max-w-[1000px]">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-cyan-300" />

              <p className="text-[7px] font-black uppercase tracking-[0.3em] text-cyan-300 sm:text-[9px]">
                Temporada 2026/27
              </p>
            </div>

            <h1 className="mt-6 text-[4rem] font-black uppercase leading-[0.78] tracking-[-0.07em] sm:text-[6.5rem] lg:text-[9rem]">
              Los
              <br />
              Caninos
              <span className="text-cyan-300">
                .
              </span>
            </h1>

            <p className="mt-8 max-w-[620px] border-l border-cyan-300/40 pl-5 text-[12px] leading-6 text-white/55 sm:text-base sm:leading-8">
              Conoce a los jugadores que representan a Génesis FC y
              defienden el orgullo de La Paz en cada partido.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FILTROS
      ===================================================== */}

      <section className="border-b border-white/10 bg-[#06142d] px-4 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filtros.map((item) => {
              const activo =
                filtro === item;

              const texto =
                item === "Todos"
                  ? "Todos"
                  : item === "Portero"
                    ? "Porteros"
                    : item === "Defensa"
                      ? "Defensas"
                      : item ===
                          "Mediocampista"
                        ? "Mediocampistas"
                        : "Delanteros";

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setFiltro(item)
                  }
                  className={`shrink-0 rounded-full px-5 py-3 text-[7px] font-black uppercase tracking-[0.16em] transition sm:px-6 sm:text-[8px] ${
                    activo
                      ? "bg-cyan-300 text-[#06142d]"
                      : "border border-white/10 bg-white/[0.04] text-white/45 hover:text-white"
                  }`}
                >
                  {texto}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          PLANTILLA
      ===================================================== */}

      <section className="bg-[#f3f3f1] px-4 py-14 text-[#06142d] sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-4 border-b border-black/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[7px] font-black uppercase tracking-[0.27em] text-[#168cab]">
                Primer equipo
              </p>

              <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
                Plantilla
                <span className="text-[#168cab]">
                  .
                </span>
              </h2>
            </div>

            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-black/30">
              {jugadoresFiltrados.length}{" "}
              {jugadoresFiltrados.length ===
              1
                ? "jugador"
                : "jugadores"}
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {jugadoresFiltrados.map(
              (jugador) => (
                <Link
                  key={
                    jugador.nombre
                  }
                  href={
                    jugador.enlace
                  }
                  className="group overflow-hidden rounded-[26px] border border-black/[0.06] bg-white shadow-[0_20px_60px_rgba(6,20,45,0.07)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(6,20,45,0.12)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#07152f]">
                    <Image
                      src={
                        jugador.imagen
                      }
                      alt={`${jugador.nombre} - ${jugador.posicion}`}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent" />

                    <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-[#020817]/65 px-4 py-2 backdrop-blur-md">
                      <p className="text-[7px] font-black uppercase tracking-[0.18em] text-cyan-300">
                        {
                          jugador.posicion
                        }
                      </p>
                    </div>

                    <span className="pointer-events-none absolute -bottom-3 right-3 text-[7rem] font-black leading-none tracking-[-0.08em] text-white/[0.10]">
                      {
                        jugador.numero
                      }
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <p className="text-[6px] font-black uppercase tracking-[0.22em] text-cyan-300">
                        Génesis FC
                      </p>

                      <h3 className="mt-2 text-[2.2rem] font-black uppercase leading-[0.9] tracking-[-0.05em] text-white">
                        {
                          jugador.nombre
                        }
                        <span className="text-cyan-300">
                          .
                        </span>
                      </h3>
                    </div>
                  </div>

                  <div className="bg-white p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[6px] font-black uppercase tracking-[0.18em] text-black/30">
                          Perfil del jugador
                        </p>

                        <p className="mt-2 text-[8px] font-black uppercase tracking-[0.14em] text-[#168cab]">
                          Ver jugador
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#06142d] text-sm font-black text-white transition group-hover:bg-cyan-300 group-hover:text-[#06142d]">
                        →
                      </div>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="bg-[#06142d] px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[7px] font-black uppercase tracking-[0.27em] text-cyan-300">
              Génesis FC
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
              Una camiseta
              <br />
              una identidad
              <span className="text-cyan-300">
                .
              </span>
            </h2>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit rounded-full bg-cyan-300 px-7 py-4 text-[8px] font-black uppercase tracking-[0.16em] text-[#06142d] transition hover:bg-white"
          >
            Volver al inicio →
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-[#020817] px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
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
              href="/calendario"
              className="text-[6px] font-black uppercase tracking-[0.15em] text-white/30 transition hover:text-white"
            >
              Calendario
            </Link>

            <Link
              href="/partidos/motagua-vs-genesis"
              className="text-[6px] font-black uppercase tracking-[0.15em] text-white/30 transition hover:text-white"
            >
              Próximo partido
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