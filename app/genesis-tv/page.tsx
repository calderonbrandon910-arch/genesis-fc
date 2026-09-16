"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

/* =========================================================
   GÉNESIS FC
   GÉNESIS TV · 1.7
========================================================= */

type Plataforma =
    | "YouTube"
    | "Facebook"
    | "Instagram"
    | "TikTok";

type Categoria =
    | "Todos"
    | "Primer Equipo"
    | "Matchday"
    | "Entrevistas"
    | "Entrenamientos"
    | "Detrás de cámaras"
    | "Academia"
    | "Historia"
    | "Shorts";

type VideoGenesis = {
    id: string;
    titulo: string;
    descripcion: string;
    categoria: Exclude<Categoria, "Todos">;
    plataforma: Plataforma;
    fecha: string;
    imagen: string;
    enlace: string;
    embedUrl: string;
    formato: "horizontal" | "vertical";
    imagenExterna?: boolean;
    destacado?: boolean;
};

/* =========================================================
   CONTENIDO REAL
========================================================= */

const videos: VideoGenesis[] = [
    {
        id: "entrevista-edwin",
        titulo: "Entrevista con Edwin",
        descripcion:
            "Una conversación con Edwin sobre el equipo, su presente y el trabajo dentro de Génesis FC.",
        categoria: "Entrevistas",
        plataforma: "YouTube",
        fecha: "GÉNESIS TV",
        imagen:
            "https://img.youtube.com/vi/IGDKrrDefTE/maxresdefault.jpg",
        enlace:
            "https://www.youtube.com/watch?v=IGDKrrDefTE",
        embedUrl:
            "https://www.youtube.com/embed/IGDKrrDefTE?autoplay=1&rel=0",
        formato: "horizontal",
        imagenExterna: true,
        destacado: true,
    },
    {
        id: "entrevista-mira",
        titulo: "Entrevista a Mira",
        descripcion:
            "El profe Mira habla sobre el equipo, el trabajo diario y los próximos desafíos de Génesis FC.",
        categoria: "Entrevistas",
        plataforma: "TikTok",
        fecha: "GÉNESIS TV",
        imagen: "/mira-genesis-tv.png",
        enlace:
            "https://www.tiktok.com/@genesis_la_paz/video/7684321445463330049",
        embedUrl:
            "https://www.tiktok.com/player/v1/7684321445463330049?autoplay=0&controls=1&play_button=1&volume_control=1&muted=0&music_info=0&description=0",
        formato: "vertical",
    },
];

/* =========================================================
   FILTROS
========================================================= */

const categorias: Categoria[] = [
    "Todos",
    "Primer Equipo",
    "Matchday",
    "Entrevistas",
    "Entrenamientos",
    "Detrás de cámaras",
    "Academia",
    "Historia",
    "Shorts",
];

const plataformas: Plataforma[] = [
    "YouTube",
    "Facebook",
    "Instagram",
    "TikTok",
];

/* =========================================================
   HELPERS
========================================================= */

function etiquetaPlataforma(
    plataforma: Plataforma
) {
    switch (plataforma) {
        case "YouTube":
            return "YT";

        case "Facebook":
            return "FB";

        case "Instagram":
            return "IG";

        case "TikTok":
            return "TT";

        default:
            return "TV";
    }
}

function VideoImage({
    video,
    sizes,
}: {
    video: VideoGenesis;
    sizes: string;
}) {
    if (video.imagenExterna) {
        return (
            <img
                src={video.imagen}
                alt={video.titulo}
                className={`absolute inset-0 h-full w-full object-cover ${
                    video.id === "entrevista-edwin"
                        ? "object-[50%_42%]"
                        : "object-center"
                }`}
            />
        );
    }

    return (
        <Image
            src={video.imagen}
            alt={video.titulo}
            fill
            quality={100}
            sizes={sizes}
            className="object-cover object-center"
        />
    );
}

/* =========================================================
   PAGE
========================================================= */

export default function GenesisTVPage() {
    const [
        categoriaActiva,
        setCategoriaActiva,
    ] =
        useState<Categoria>("Todos");

    const [
        plataformaActiva,
        setPlataformaActiva,
    ] =
        useState<
            Plataforma | "Todas"
        >("Todas");

    const [
        videoActivo,
        setVideoActivo,
    ] =
        useState<VideoGenesis | null>(
            null
        );

    const destacado =
        videos.find(
            (video) =>
                video.destacado
        ) ?? videos[0];

    const videosFiltrados =
        useMemo(() => {
            return videos.filter(
                (video) => {
                    const categoriaOK =
                        categoriaActiva ===
                            "Todos" ||
                        video.categoria ===
                            categoriaActiva;

                    const plataformaOK =
                        plataformaActiva ===
                            "Todas" ||
                        video.plataforma ===
                            plataformaActiva;

                    return (
                        categoriaOK &&
                        plataformaOK
                    );
                }
            );
        }, [
            categoriaActiva,
            plataformaActiva,
        ]);

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
                                Génesis TV
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
                            href="#videos"
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

            <section className="relative overflow-hidden bg-[#020817]">
                <div className="absolute inset-0">
                    <Image
                        src="/genesis.jpg"
                        alt="Escudo de Génesis FC"
                        fill
                        priority
                        quality={100}
                        sizes="100vw"
                        className="object-contain object-[72%_center] opacity-[0.28] sm:object-[78%_center] sm:opacity-[0.34] lg:scale-[1.08]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-[#020817]/78 to-[#020817]/40" />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/20 to-[#020817]/55" />
                </div>

                <div className="relative mx-auto flex min-h-[620px] max-w-[1600px] items-end px-4 pb-14 pt-24 sm:min-h-[720px] sm:px-8 sm:pb-20 lg:min-h-[780px] lg:items-center lg:px-12 xl:px-16">
                    <div className="max-w-[760px]">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-9 bg-cyan-300" />

                            <p className="text-[7px] font-black uppercase tracking-[0.32em] text-cyan-300 sm:text-[8px]">
                                Contenido oficial
                            </p>
                        </div>

                        <h1 className="mt-6 text-[3.9rem] font-black uppercase leading-[0.78] tracking-[-0.075em] sm:text-[6rem] lg:text-[7.4rem]">
                            Génesis
                            <br />

                            <span className="text-cyan-300">
                                TV.
                            </span>
                        </h1>

                        <p className="mt-7 max-w-[650px] text-sm leading-7 text-white/60 sm:text-base">
                            Entrevistas, historias, protagonistas y contenido audiovisual oficial de Génesis FC.
                        </p>

                        <div className="mt-9 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setVideoActivo(
                                        destacado
                                    )
                                }
                                className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-[8px] font-black uppercase tracking-[0.16em] text-[#020817] transition hover:bg-cyan-300"
                            >
                                Ver destacado
                                <span>▶</span>
                            </button>

                            <a
                                href="#videos"
                                className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.05] px-7 py-4 text-[8px] font-black uppercase tracking-[0.16em] text-white transition hover:border-cyan-300/40 hover:text-cyan-300"
                            >
                                Explorar
                                <span>↓</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================
                PLATAFORMAS
            ================================================= */}

            <section className="border-y border-white/[0.08] bg-[#06142d]">
                <div className="mx-auto grid max-w-[1600px] grid-cols-2 sm:grid-cols-4">
                    {plataformas.map(
                        (plataforma) => (
                            <button
                                key={
                                    plataforma
                                }
                                type="button"
                                onClick={() =>
                                    setPlataformaActiva(
                                        plataformaActiva ===
                                            plataforma
                                            ? "Todas"
                                            : plataforma
                                    )
                                }
                                className={`border-white/[0.07] px-5 py-6 text-center transition sm:border-l first:border-l-0 ${
                                    plataformaActiva ===
                                    plataforma
                                        ? "bg-cyan-300 text-[#06142d]"
                                        : "text-white hover:bg-white/[0.04]"
                                }`}
                            >
                                <p className="text-[7px] font-black uppercase tracking-[0.22em] opacity-50">
                                    {etiquetaPlataforma(
                                        plataforma
                                    )}
                                </p>

                                <p className="mt-2 text-sm font-black uppercase">
                                    {
                                        plataforma
                                    }
                                </p>
                            </button>
                        )
                    )}
                </div>
            </section>

            {/* =================================================
                DESTACADO
            ================================================= */}

            <section className="bg-[#f3f3f1] px-4 py-16 text-[#06142d] sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
                <div className="mx-auto max-w-[1550px]">
                    <div className="mb-8 border-b border-black/10 pb-7">
                        <p className="text-[7px] font-black uppercase tracking-[0.27em] text-[#168cab]">
                            Selección Génesis TV
                        </p>

                        <h2 className="mt-3 text-[3rem] font-black uppercase leading-[0.84] tracking-[-0.06em] sm:text-[5rem] lg:text-[6rem]">
                            Destacado
                            <span className="text-[#168cab]">
                                .
                            </span>
                        </h2>
                    </div>

                    <article className="overflow-hidden rounded-[34px] bg-[#06142d] text-white lg:grid lg:grid-cols-[1.15fr_0.85fr]">
                        <button
                            type="button"
                            onClick={() =>
                                setVideoActivo(
                                    destacado
                                )
                            }
                            className="group relative aspect-video min-h-[330px] overflow-hidden bg-[#06142d] bg-cover bg-center text-left lg:min-h-[620px] lg:aspect-auto lg:self-stretch"
                            style={{
                                backgroundImage: `url(${destacado.imagen})`,
                                backgroundPosition: destacado.id === "entrevista-edwin" ? "50% 42%" : "center",
                            }}
                        >

                            <div className="absolute inset-0 bg-gradient-to-t from-[#020817]/60 via-transparent to-transparent" />

                            <div className="absolute left-5 top-5 flex gap-2 sm:left-8 sm:top-8">
                                <span className="rounded-full bg-white px-4 py-2 text-[6px] font-black uppercase tracking-[0.15em] text-[#06142d]">
                                    {
                                        destacado.plataforma
                                    }
                                </span>

                                <span className="rounded-full border border-white/20 bg-[#020817]/70 px-4 py-2 text-[6px] font-black uppercase tracking-[0.15em] backdrop-blur-xl">
                                    {
                                        destacado.categoria
                                    }
                                </span>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-[#020817]/75 text-2xl backdrop-blur-xl transition duration-300 group-hover:scale-110 group-hover:bg-cyan-300 group-hover:text-[#020817]">
                                    ▶
                                </div>
                            </div>
                        </button>

                        <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
                            <div>
                                <p className="text-[7px] font-black uppercase tracking-[0.22em] text-cyan-300">
                                    {
                                        destacado.plataforma
                                    }{" "}
                                    ·{" "}
                                    {
                                        destacado.fecha
                                    }
                                </p>

                                <h3 className="mt-6 text-[2.7rem] font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-[4rem]">
                                    {
                                        destacado.titulo
                                    }
                                    <span className="text-cyan-300">
                                        .
                                    </span>
                                </h3>

                                <p className="mt-6 max-w-[520px] text-sm leading-7 text-white/45">
                                    {
                                        destacado.descripcion
                                    }
                                </p>
                            </div>

                            <div className="mt-12 border-t border-white/10 pt-7">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setVideoActivo(
                                            destacado
                                        )
                                    }
                                    className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-[8px] font-black uppercase tracking-[0.15em] text-[#06142d] transition hover:bg-cyan-300"
                                >
                                    Reproducir aquí
                                    <span>▶</span>
                                </button>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            {/* =================================================
                BIBLIOTECA
            ================================================= */}

            <section
                id="videos"
                className="bg-white px-4 py-16 text-[#06142d] sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16"
            >
                <div className="mx-auto max-w-[1550px]">
                    <div className="flex flex-col gap-7 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-[7px] font-black uppercase tracking-[0.27em] text-[#168cab]">
                                Biblioteca audiovisual
                            </p>

                            <h2 className="mt-3 text-[3rem] font-black uppercase leading-[0.84] tracking-[-0.06em] sm:text-[5rem]">
                                Videos
                                <span className="text-[#168cab]">
                                    .
                                </span>
                            </h2>
                        </div>

                        <p className="max-w-[480px] text-xs leading-6 text-black/45 sm:text-sm">
                            Contenido oficial de
                            Génesis FC publicado en
                            nuestras plataformas.
                        </p>
                    </div>

                    {/* CATEGORÍAS */}

                    <div className="mt-7 flex gap-2 overflow-x-auto pb-3">
                        {categorias.map(
                            (categoria) => (
                                <button
                                    key={
                                        categoria
                                    }
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
                                            : "border border-black/10 bg-[#f5f5f3] text-black/45 hover:border-[#168cab]/30 hover:text-[#168cab]"
                                    }`}
                                >
                                    {
                                        categoria
                                    }
                                </button>
                            )
                        )}
                    </div>

                    {/* VIDEOS */}

                    {videosFiltrados.length >
                    0 ? (
                        <div className="mt-8 grid gap-6 md:grid-cols-2">
                            {videosFiltrados.map(
                                (
                                    video
                                ) => (
                                    <button
                                        key={
                                            video.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            setVideoActivo(
                                                video
                                            )
                                        }
                                        className="group overflow-hidden rounded-[28px] border border-black/[0.07] bg-[#f7f7f5] text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(6,20,45,0.10)]"
                                    >
                                        <div className="relative aspect-video overflow-hidden bg-[#06142d]">
                                            <VideoImage
                                                video={
                                                    video
                                                }
                                                sizes="(max-width:767px) 100vw,50vw"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-[#020817]/60 via-transparent to-transparent" />

                                            <div className="absolute left-4 top-4">
                                                <span className="rounded-full bg-white px-4 py-2 text-[6px] font-black uppercase tracking-[0.14em] text-[#06142d] shadow-lg">
                                                    {
                                                        video.plataforma
                                                    }
                                                </span>
                                            </div>

                                            {video.id !==
                                                "entrevista-mira" && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-[#020817]/75 text-lg text-white backdrop-blur-xl transition duration-300 group-hover:scale-110 group-hover:bg-cyan-300 group-hover:text-[#06142d]">
                                                        ▶
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 sm:p-7">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-[6px] font-black uppercase tracking-[0.18em] text-[#168cab]">
                                                    {
                                                        video.categoria
                                                    }
                                                </p>

                                                <p className="text-[6px] font-black uppercase tracking-[0.13em] text-black/25">
                                                    {
                                                        etiquetaPlataforma(
                                                            video.plataforma
                                                        )
                                                    }
                                                </p>
                                            </div>

                                            <h3 className="mt-4 text-2xl font-black uppercase leading-[0.93] tracking-[-0.04em] sm:text-3xl">
                                                {
                                                    video.titulo
                                                }
                                            </h3>

                                            <p className="mt-4 text-[10px] leading-5 text-black/42 sm:text-xs sm:leading-6">
                                                {
                                                    video.descripcion
                                                }
                                            </p>

                                            <div className="mt-6 flex items-center justify-between border-t border-black/[0.06] pt-5">
                                                <p className="text-[7px] font-black uppercase tracking-[0.14em] text-[#06142d]">
                                                    Reproducir
                                                    aquí
                                                    ▶
                                                </p>

                                                <p className="text-[6px] font-black uppercase tracking-[0.13em] text-[#168cab]">
                                                    Oficial
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                )
                            )}
                        </div>
                    ) : (
                        <div className="mt-8 rounded-[28px] bg-[#f7f7f5] px-6 py-16 text-center">
                            <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#168cab]">
                                Génesis TV
                            </p>

                            <h3 className="mt-4 text-2xl font-black uppercase">
                                No hay videos con
                                este filtro
                            </h3>

                            <button
                                type="button"
                                onClick={() => {
                                    setCategoriaActiva(
                                        "Todos"
                                    );

                                    setPlataformaActiva(
                                        "Todas"
                                    );
                                }}
                                className="mt-7 rounded-full bg-[#06142d] px-6 py-4 text-[7px] font-black uppercase tracking-[0.14em] text-white"
                            >
                                Mostrar todo
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* =================================================
                REPRODUCTOR GÉNESIS TV
            ================================================= */}

            {videoActivo && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/95 px-4 py-6 backdrop-blur-xl sm:px-8"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Reproduciendo ${videoActivo.titulo}`}
                    onClick={() =>
                        setVideoActivo(null)
                    }
                >
                    <div
                        className={`relative w-full overflow-hidden rounded-[26px] border border-white/10 bg-[#020817] shadow-[0_30px_120px_rgba(0,0,0,0.55)] ${
                            videoActivo.formato ===
                            "vertical"
                                ? "max-w-[460px]"
                                : "max-w-[1180px]"
                        }`}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="border-b border-white/10 px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between gap-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setVideoActivo(
                                            null
                                        )
                                    }
                                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-[7px] font-black uppercase tracking-[0.14em] text-white/70 transition hover:border-cyan-300/40 hover:text-cyan-300"
                                >
                                    <span aria-hidden="true">←</span>
                                    Volver a Génesis TV
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setVideoActivo(
                                            null
                                        )
                                    }
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-sm font-black text-white/70 transition hover:border-cyan-300/40 hover:text-cyan-300"
                                    aria-label="Cerrar reproductor"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="mt-4 min-w-0">
                                <p className="text-[6px] font-black uppercase tracking-[0.2em] text-cyan-300">
                                    {videoActivo.plataforma}
                                    {" · "}
                                    Génesis TV
                                </p>

                                <h3 className="mt-1 truncate text-sm font-black uppercase sm:text-base">
                                    {videoActivo.titulo}
                                </h3>
                            </div>
                        </div>

                        <div
                            className={`relative w-full bg-black ${
                                videoActivo.formato ===
                                "vertical"
                                    ? "aspect-[9/16]"
                                    : "aspect-video"
                            }`}
                        >
                            <iframe
                                key={videoActivo.id}
                                src={
                                    videoActivo.embedUrl
                                }
                                title={
                                    videoActivo.titulo
                                }
                                className="absolute inset-0 h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                                allowFullScreen
                            />
                        </div>

                        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="max-w-[720px] text-[10px] leading-5 text-white/45 sm:text-xs sm:leading-6">
                                {videoActivo.descripcion}
                            </p>

                            <a
                                href={
                                    videoActivo.enlace
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex shrink-0 items-center justify-center rounded-full border border-white/15 px-5 py-3 text-[7px] font-black uppercase tracking-[0.14em] text-white/70 transition hover:border-cyan-300/40 hover:text-cyan-300"
                            >
                                Abrir en {videoActivo.plataforma}
                                {" ↗"}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* =================================================
                REDES
            ================================================= */}

            <section className="bg-[#06142d] px-4 py-16 sm:px-8 sm:py-20 lg:px-12 xl:px-16">
                <div className="mx-auto max-w-[1550px] rounded-[30px] border border-white/10 bg-white/[0.04] p-7 sm:p-10">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-[7px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                Génesis FC
                            </p>

                            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.045em] sm:text-4xl">
                                Síguenos en
                                nuestras redes
                                <span className="text-cyan-300">
                                    .
                                </span>
                            </h2>

                            <p className="mt-4 max-w-[560px] text-xs leading-6 text-white/40">
                                Nuevos videos,
                                entrevistas y contenido
                                del club se publicarán
                                también dentro de
                                Génesis TV.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <a
                                href="https://www.youtube.com/@genesis_futbolclub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-white px-5 py-3 text-[7px] font-black uppercase tracking-[0.14em] text-[#06142d]"
                            >
                                YouTube
                            </a>

                            <a
                                href="https://www.instagram.com/genesisfc_hnd/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-white/15 px-5 py-3 text-[7px] font-black uppercase tracking-[0.14em] text-white"
                            >
                                Instagram
                            </a>

                            <a
                                href="https://www.tiktok.com/@genesis_la_paz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-white/15 px-5 py-3 text-[7px] font-black uppercase tracking-[0.14em] text-white"
                            >
                                TikTok
                            </a>

                            <a
                                href="https://www.facebook.com/profile.php?id=100094686128397"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-white/15 px-5 py-3 text-[7px] font-black uppercase tracking-[0.14em] text-white"
                            >
                                Facebook
                            </a>
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
                            Génesis TV
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

                        <a
                            href="#videos"
                            className="rounded-full bg-white px-5 py-3 text-[7px] font-black uppercase tracking-[0.14em] text-[#020817]"
                        >
                            Videos
                        </a>
                    </div>
                </div>
            </footer>
        </main>
    );
}