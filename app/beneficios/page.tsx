"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

/* =========================================================
   GÉNESIS FC
   BENEFICIOS · 1.0
========================================================= */

type CategoriaBeneficio =
    | "Todos"
    | "Club"
    | "Tienda"
    | "Matchday"
    | "Experiencias"
    | "Aliados";

type Beneficio = {
    id: string;
    categoria: Exclude<CategoriaBeneficio, "Todos">;
    titulo: string;
    descripcion: string;
    etiqueta: string;
    estado: "disponible" | "proximamente";
    destacado?: boolean;
};

const categorias: CategoriaBeneficio[] = [
    "Todos",
    "Club",
    "Tienda",
    "Matchday",
    "Experiencias",
    "Aliados",
];

const beneficios: Beneficio[] = [
    {
        id: "experiencias-club",
        categoria: "Experiencias",
        titulo: "Experiencias Génesis",
        descripcion:
            "Activaciones especiales, visitas, dinámicas y experiencias oficiales alrededor del club.",
        etiqueta: "Experiencias",
        estado: "proximamente",
        destacado: true,
    },
    {
        id: "tienda-oficial",
        categoria: "Tienda",
        titulo: "Beneficios en tienda",
        descripcion:
            "Promociones especiales y oportunidades exclusivas dentro de la Tienda Oficial de Génesis FC.",
        etiqueta: "Tienda oficial",
        estado: "proximamente",
    },
    {
        id: "matchday",
        categoria: "Matchday",
        titulo: "Beneficios Matchday",
        descripcion:
            "Dinámicas y promociones especiales relacionadas con los partidos de Génesis FC.",
        etiqueta: "Día de partido",
        estado: "proximamente",
    },
    {
        id: "club",
        categoria: "Club",
        titulo: "Activaciones del club",
        descripcion:
            "Campañas especiales, sorteos y oportunidades desarrolladas directamente por Génesis FC.",
        etiqueta: "Génesis FC",
        estado: "proximamente",
    },
    {
        id: "aliados-locales",
        categoria: "Aliados",
        titulo: "Aliados de Génesis",
        descripcion:
            "Espacio preparado para beneficios ofrecidos por futuros negocios y marcas aliadas al club.",
        etiqueta: "Aliados",
        estado: "proximamente",
    },
];

/* =========================================================
   HELPERS
========================================================= */

function numeroBeneficio(index: number) {
    return String(index + 1).padStart(2, "0");
}

/* =========================================================
   PAGE
========================================================= */

export default function BeneficiosPage() {
    const [categoriaActiva, setCategoriaActiva] =
        useState<CategoriaBeneficio>("Todos");

    const beneficiosFiltrados = useMemo(() => {
        if (categoriaActiva === "Todos") {
            return beneficios;
        }

        return beneficios.filter(
            (beneficio) =>
                beneficio.categoria === categoriaActiva
        );
    }, [categoriaActiva]);

    return (
        <main className="min-h-screen overflow-x-hidden bg-[#020817] text-white">
            {/* =================================================
                HEADER
            ================================================= */}

            <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#020817]/95 backdrop-blur-2xl">
                <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:h-[84px] sm:px-8 lg:px-12 xl:px-16">
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

                            <p className="mt-1 text-[6px] font-black uppercase tracking-[0.28em] text-cyan-300">
                                Beneficios
                            </p>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="rounded-full border border-white/15 px-4 py-3 text-[7px] font-black uppercase tracking-[0.15em] text-white/65 transition hover:border-cyan-300/40 hover:text-cyan-300 sm:px-6"
                        >
                            Inicio
                        </Link>

                        <a
                            href="#beneficios"
                            className="hidden rounded-full bg-white px-6 py-3 text-[8px] font-black uppercase tracking-[0.15em] text-[#020817] sm:inline-flex"
                        >
                            Explorar
                        </a>
                    </div>
                </div>
            </header>

            {/* =================================================
                HERO
            ================================================= */}

            <section className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/genesis.jpg"
                        alt="Génesis FC"
                        fill
                        priority
                        quality={100}
                        sizes="100vw"
                        className="object-contain object-[75%_center] opacity-[0.22]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-[#020817]/88 to-[#020817]/45" />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-[#020817]/50" />
                </div>

                <div className="relative mx-auto flex min-h-[680px] max-w-[1600px] items-end px-4 pb-16 pt-24 sm:min-h-[760px] sm:px-8 sm:pb-20 lg:min-h-[820px] lg:items-center lg:px-12 xl:px-16">
                    <div className="max-w-[900px]">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-9 bg-cyan-300" />

                            <p className="text-[7px] font-black uppercase tracking-[0.32em] text-cyan-300 sm:text-[8px]">
                                Ecosistema Génesis
                            </p>
                        </div>

                        <h1 className="mt-6 text-[4.2rem] font-black uppercase leading-[0.77] tracking-[-0.075em] sm:text-[6.8rem] lg:text-[8.5rem]">
                            Beneficios
                            <span className="text-cyan-300">
                                .
                            </span>
                        </h1>

                        <p className="mt-8 max-w-[650px] text-sm leading-7 text-white/60 sm:text-base">
                            Más formas de vivir Génesis FC.
                            Experiencias, promociones,
                            activaciones y futuros beneficios
                            para nuestra afición.
                        </p>

                        <div className="mt-9 flex flex-wrap gap-3">
                            <a
                                href="#beneficios"
                                className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-[8px] font-black uppercase tracking-[0.16em] text-[#020817] transition hover:bg-cyan-300"
                            >
                                Explorar beneficios
                                <span>↓</span>
                            </a>

                            <Link
                                href="/tienda"
                                className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.05] px-7 py-4 text-[8px] font-black uppercase tracking-[0.16em] text-white transition hover:border-cyan-300/40 hover:text-cyan-300"
                            >
                                Tienda oficial
                                <span>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================
                INTRO
            ================================================= */}

            <section className="border-y border-white/[0.08] bg-[#06142d]">
                <div className="mx-auto grid max-w-[1600px] md:grid-cols-3">
                    <div className="border-white/[0.07] px-6 py-8 md:border-r lg:px-10">
                        <p className="text-[6px] font-black uppercase tracking-[0.24em] text-cyan-300">
                            01
                        </p>

                        <h2 className="mt-3 text-xl font-black uppercase">
                            Club
                        </h2>

                        <p className="mt-3 text-[10px] leading-5 text-white/40">
                            Activaciones creadas directamente
                            por Génesis FC.
                        </p>
                    </div>

                    <div className="border-t border-white/[0.07] px-6 py-8 md:border-r md:border-t-0 lg:px-10">
                        <p className="text-[6px] font-black uppercase tracking-[0.24em] text-cyan-300">
                            02
                        </p>

                        <h2 className="mt-3 text-xl font-black uppercase">
                            Experiencias
                        </h2>

                        <p className="mt-3 text-[10px] leading-5 text-white/40">
                            Una conexión más cercana entre
                            aficionados y club.
                        </p>
                    </div>

                    <div className="border-t border-white/[0.07] px-6 py-8 md:border-t-0 lg:px-10">
                        <p className="text-[6px] font-black uppercase tracking-[0.24em] text-cyan-300">
                            03
                        </p>

                        <h2 className="mt-3 text-xl font-black uppercase">
                            Aliados
                        </h2>

                        <p className="mt-3 text-[10px] leading-5 text-white/40">
                            Preparado para futuros convenios
                            y marcas asociadas.
                        </p>
                    </div>
                </div>
            </section>

            {/* =================================================
                BENEFICIOS
            ================================================= */}

            <section
                id="beneficios"
                className="bg-[#f4f4f1] px-4 py-16 text-[#06142d] sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16"
            >
                <div className="mx-auto max-w-[1550px]">
                    <div className="flex flex-col gap-7 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-[7px] font-black uppercase tracking-[0.27em] text-[#168cab]">
                                Descubre
                            </p>

                            <h2 className="mt-3 text-[3rem] font-black uppercase leading-[0.84] tracking-[-0.06em] sm:text-[5rem] lg:text-[6rem]">
                                Beneficios
                                <span className="text-[#168cab]">
                                    .
                                </span>
                            </h2>
                        </div>

                        <p className="max-w-[500px] text-xs leading-6 text-black/45 sm:text-sm">
                            Este espacio irá creciendo a
                            medida que Génesis FC active
                            nuevas experiencias, promociones
                            y alianzas.
                        </p>
                    </div>

                    {/* FILTROS */}

                    <div className="mt-7 flex gap-2 overflow-x-auto pb-3">
                        {categorias.map(
                            (categoria) => (
                                <button
                                    key={categoria}
                                    type="button"
                                    onClick={() =>
                                        setCategoriaActiva(
                                            categoria
                                        )
                                    }
                                    className={`shrink-0 rounded-full px-5 py-3 text-[7px] font-black uppercase tracking-[0.13em] transition ${
                                        categoriaActiva ===
                                        categoria
                                            ? "bg-[#06142d] text-white"
                                            : "border border-black/10 bg-white text-black/45 hover:border-[#168cab]/30 hover:text-[#168cab]"
                                    }`}
                                >
                                    {categoria}
                                </button>
                            )
                        )}
                    </div>

                    {/* GRID */}

                    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {beneficiosFiltrados.map(
                            (beneficio, index) => (
                                <article
                                    key={beneficio.id}
                                    className={`group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[28px] border transition duration-300 hover:-translate-y-1 ${
                                        beneficio.destacado
                                            ? "border-[#168cab]/20 bg-[#06142d] text-white shadow-[0_25px_80px_rgba(6,20,45,0.14)]"
                                            : "border-black/[0.06] bg-white shadow-[0_18px_60px_rgba(6,20,45,0.05)]"
                                    }`}
                                >
                                    <div className="p-7 sm:p-8">
                                        <div className="flex items-start justify-between gap-5">
                                            <p
                                                className={`text-[7px] font-black uppercase tracking-[0.22em] ${
                                                    beneficio.destacado
                                                        ? "text-cyan-300"
                                                        : "text-[#168cab]"
                                                }`}
                                            >
                                                {numeroBeneficio(
                                                    index
                                                )}
                                            </p>

                                            <span
                                                className={`rounded-full px-4 py-2 text-[6px] font-black uppercase tracking-[0.14em] ${
                                                    beneficio.estado ===
                                                    "disponible"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : beneficio.destacado
                                                          ? "border border-white/10 bg-white/[0.05] text-white/40"
                                                          : "bg-[#f1f1ee] text-black/30"
                                                }`}
                                            >
                                                {beneficio.estado ===
                                                "disponible"
                                                    ? "Disponible"
                                                    : "Próximamente"}
                                            </span>
                                        </div>

                                        <p
                                            className={`mt-12 text-[7px] font-black uppercase tracking-[0.2em] ${
                                                beneficio.destacado
                                                    ? "text-white/35"
                                                    : "text-black/30"
                                            }`}
                                        >
                                            {beneficio.etiqueta}
                                        </p>

                                        <h3 className="mt-4 text-3xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-4xl">
                                            {beneficio.titulo}
                                            <span className="text-cyan-300">
                                                .
                                            </span>
                                        </h3>

                                        <p
                                            className={`mt-5 max-w-[420px] text-xs leading-6 ${
                                                beneficio.destacado
                                                    ? "text-white/45"
                                                    : "text-black/42"
                                            }`}
                                        >
                                            {
                                                beneficio.descripcion
                                            }
                                        </p>
                                    </div>

                                    <div
                                        className={`border-t px-7 py-5 sm:px-8 ${
                                            beneficio.destacado
                                                ? "border-white/10"
                                                : "border-black/[0.06]"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p
                                                className={`text-[7px] font-black uppercase tracking-[0.15em] ${
                                                    beneficio.destacado
                                                        ? "text-white/30"
                                                        : "text-black/30"
                                                }`}
                                            >
                                                Génesis FC
                                            </p>

                                            <span
                                                className={`text-lg ${
                                                    beneficio.destacado
                                                        ? "text-cyan-300"
                                                        : "text-[#168cab]"
                                                }`}
                                            >
                                                →
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* =================================================
                CÓMO FUNCIONARÁ
            ================================================= */}

            <section className="bg-white px-4 py-16 text-[#06142d] sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
                <div className="mx-auto max-w-[1550px]">
                    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                        <div>
                            <p className="text-[7px] font-black uppercase tracking-[0.27em] text-[#168cab]">
                                Simple y directo
                            </p>

                            <h2 className="mt-3 text-[3rem] font-black uppercase leading-[0.84] tracking-[-0.06em] sm:text-[5rem]">
                                ¿Cómo
                                <br />
                                funciona
                                <span className="text-[#168cab]">
                                    ?
                                </span>
                            </h2>

                            <p className="mt-7 max-w-[500px] text-sm leading-7 text-black/45">
                                Cada beneficio tendrá sus
                                condiciones claramente
                                indicadas cuando sea activado.
                                Sin sistemas complicados ni
                                procesos innecesarios.
                            </p>
                        </div>

                        <div className="divide-y divide-black/[0.07] border-y border-black/[0.07]">
                            {[
                                {
                                    numero: "01",
                                    titulo: "Descubre",
                                    texto:
                                        "Consulta las promociones y experiencias disponibles.",
                                },
                                {
                                    numero: "02",
                                    titulo: "Revisa",
                                    texto:
                                        "Cada beneficio mostrará claramente sus condiciones y vigencia.",
                                },
                                {
                                    numero: "03",
                                    titulo: "Disfruta",
                                    texto:
                                        "Aprovecha las experiencias y oportunidades ofrecidas por Génesis FC.",
                                },
                            ].map(
                                (paso) => (
                                    <div
                                        key={paso.numero}
                                        className="grid gap-4 py-7 sm:grid-cols-[70px_1fr] sm:items-start"
                                    >
                                        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#168cab]">
                                            {
                                                paso.numero
                                            }
                                        </p>

                                        <div>
                                            <h3 className="text-2xl font-black uppercase tracking-[-0.04em]">
                                                {
                                                    paso.titulo
                                                }
                                            </h3>

                                            <p className="mt-3 max-w-[600px] text-xs leading-6 text-black/42">
                                                {
                                                    paso.texto
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================
                ALIADOS
            ================================================= */}

            <section className="bg-[#06142d] px-4 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
                <div className="mx-auto max-w-[1550px]">
                    <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.035] p-7 sm:p-10 lg:p-14">
                        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                            <div>
                                <p className="text-[7px] font-black uppercase tracking-[0.27em] text-cyan-300">
                                    Futuros aliados
                                </p>

                                <h2 className="mt-4 text-[3rem] font-black uppercase leading-[0.86] tracking-[-0.06em] sm:text-[5rem]">
                                    Crecemos
                                    <br />
                                    juntos
                                    <span className="text-cyan-300">
                                        .
                                    </span>
                                </h2>

                                <p className="mt-7 max-w-[650px] text-sm leading-7 text-white/45">
                                    Esta sección está preparada
                                    para integrar negocios,
                                    marcas y organizaciones que
                                    quieran ofrecer beneficios a
                                    la comunidad de Génesis FC.
                                </p>
                            </div>

                            <div className="rounded-[28px] border border-white/10 bg-[#020817] p-7 sm:p-9">
                                <p className="text-[7px] font-black uppercase tracking-[0.22em] text-cyan-300">
                                    Programa de aliados
                                </p>

                                <h3 className="mt-5 text-3xl font-black uppercase leading-[0.92] tracking-[-0.045em]">
                                    Próximamente
                                </h3>

                                <p className="mt-5 text-xs leading-6 text-white/40">
                                    Cuando el programa esté
                                    habilitado, aquí aparecerá
                                    la información oficial para
                                    participar.
                                </p>

                                <div className="mt-8 h-px bg-white/10" />

                                <p className="mt-6 text-[6px] font-black uppercase tracking-[0.18em] text-white/25">
                                    Génesis FC · La Paz
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="border-t border-white/[0.08] bg-[#020817] px-4 py-12 sm:px-8 lg:px-12 xl:px-16">
                <div className="mx-auto flex max-w-[1550px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="relative h-14 w-14">
                            <Image
                                src="/genesis.jpg"
                                alt="Génesis FC"
                                fill
                                quality={100}
                                sizes="56px"
                                className="object-contain"
                            />
                        </div>

                        <p className="mt-5 text-xl font-black uppercase">
                            Beneficios
                        </p>

                        <p className="mt-2 text-[7px] font-black uppercase tracking-[0.2em] text-cyan-300">
                            Génesis FC · La Paz
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/"
                            className="rounded-full border border-white/15 px-5 py-3 text-[7px] font-black uppercase tracking-[0.14em] text-white/60 transition hover:border-cyan-300/40 hover:text-cyan-300"
                        >
                            Inicio
                        </Link>

                        <Link
                            href="/tienda"
                            className="rounded-full bg-white px-5 py-3 text-[7px] font-black uppercase tracking-[0.14em] text-[#020817]"
                        >
                            Tienda
                        </Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}