"use client";

import Image from "next/image";
import Link from "next/link";
import {
    FormEvent,
    useMemo,
    useRef,
    useState,
} from "react";

type SearchCategory =
    | "Todo"
    | "Partidos"
    | "Noticias"
    | "Equipo"
    | "Club"
    | "Tienda";

type SearchItem = {
    id: string;
    title: string;
    description: string;
    href: string;
    category: Exclude<
        SearchCategory,
        "Todo"
    >;
    keywords: string[];
    eyebrow: string;
};

const SEARCH_ITEMS: SearchItem[] = [
    {
        id: "inicio",
        title: "Inicio",
        description:
            "Portada oficial de Génesis FC.",
        href: "/",
        category: "Club",
        keywords: [
            "inicio",
            "home",
            "genesis",
            "génesis",
            "club",
            "la paz",
        ],
        eyebrow: "Sitio oficial",
    },
    {
        id: "calendario",
        title: "Calendario y clasificación",
        description:
            "Próximos partidos, resultados y tabla de posiciones.",
        href: "/calendario",
        category: "Partidos",
        keywords: [
            "calendario",
            "partidos",
            "resultados",
            "tabla",
            "clasificacion",
            "clasificación",
            "liga",
            "jornada",
            "proximo",
            "próximo",
        ],
        eyebrow: "Competición",
    },
    {
        id: "match-center",
        title: "Génesis FC vs Olancho FC",
        description:
            "Match Center oficial con previa, Live Ops, pronóstico, reacciones, MVP y entradas.",
        href: "/partidos/genesis-vs-olancho",
        category: "Partidos",
        keywords: [
            "genesis",
            "génesis",
            "olancho",
            "match center",
            "live",
            "live ops",
            "pronostico",
            "pronóstico",
            "reacciones",
            "mvp",
            "entradas",
            "19 septiembre",
        ],
        eyebrow: "Match Center",
    },
    {
        id: "equipo",
        title: "Primer equipo",
        description:
            "Plantel y contenido del primer equipo de Génesis FC.",
        href: "/equipo",
        category: "Equipo",
        keywords: [
            "equipo",
            "plantel",
            "jugadores",
            "primer equipo",
            "futbolistas",
            "fútbol",
        ],
        eyebrow: "Plantel",
    },
    {
        id: "noticias",
        title: "Noticias",
        description:
            "Toda la actualidad y novedades oficiales de Génesis FC.",
        href: "/noticias",
        category: "Noticias",
        keywords: [
            "noticias",
            "actualidad",
            "novedades",
            "comunicados",
            "prensa",
        ],
        eyebrow: "Actualidad",
    },
    {
        id: "historia",
        title: "Nuestra historia",
        description:
            "Conoce la identidad, historia y recorrido de Génesis FC.",
        href: "/historia",
        category: "Club",
        keywords: [
            "historia",
            "club",
            "identidad",
            "la paz",
            "origen",
            "genesis",
            "génesis",
        ],
        eyebrow: "Club",
    },
    {
        id: "tienda",
        title: "Tienda Oficial",
        description:
            "Jerseys oficiales y productos disponibles de Génesis FC.",
        href: "/tienda",
        category: "Tienda",
        keywords: [
            "tienda",
            "jersey",
            "camiseta",
            "comprar",
            "productos",
            "k9 store",
            "oficial",
        ],
        eyebrow: "K9 Store",
    },
    {
        id: "seguimiento",
        title: "Seguir mi pedido",
        description:
            "Consulta el estado de una compra realizada en la Tienda Oficial.",
        href: "/tienda/seguimiento",
        category: "Tienda",
        keywords: [
            "pedido",
            "seguimiento",
            "orden",
            "compra",
            "envio",
            "envío",
            "retiro",
            "tienda",
        ],
        eyebrow: "Pedidos",
    },
];

const CATEGORIES: SearchCategory[] = [
    "Todo",
    "Partidos",
    "Noticias",
    "Equipo",
    "Club",
    "Tienda",
];

function normalizeText(
    value: string
) {
    return value
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();
}

export default function BuscarPage() {
    const [query, setQuery] = useState("");
    const [category, setCategory] =
        useState<SearchCategory>("Todo");
    const inputRef =
        useRef<HTMLInputElement | null>(null);

    const normalizedQuery = useMemo(
        () => normalizeText(query),
        [query]
    );

    const results = useMemo(() => {
        return SEARCH_ITEMS.filter(
            (item) => {
                const categoryMatch =
                    category === "Todo" ||
                    item.category === category;

                if (!categoryMatch) {
                    return false;
                }

                if (!normalizedQuery) {
                    return true;
                }

                const searchable = normalizeText(
                    [
                        item.title,
                        item.description,
                        item.category,
                        item.eyebrow,
                        ...item.keywords,
                    ].join(" ")
                );

                return normalizedQuery
                    .split(/\s+/)
                    .every((term) =>
                        searchable.includes(term)
                    );
            }
        );
    }, [category, normalizedQuery]);

    function submitSearch(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        inputRef.current?.focus();
    }

    return (
        <main className="min-h-screen bg-[#f3f3f1] text-[#06142d]">
            <header className="border-b border-white/10 bg-[#020817] text-white">
                <div className="mx-auto flex h-[74px] max-w-[1500px] items-center justify-between px-4 sm:h-[86px] sm:px-8 lg:px-12">
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
                                Búsqueda
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

            <section className="relative overflow-hidden bg-[#020817] px-4 pb-16 pt-14 text-white sm:px-8 sm:pb-24 sm:pt-20 lg:px-12">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(22,140,171,0.26),transparent_48%)]" />

                <div className="relative mx-auto max-w-[1200px]">
                    <div className="max-w-[800px]">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-cyan-300" />
                            <p className="text-[7px] font-black uppercase tracking-[0.27em] text-cyan-300">
                                Todo Génesis en un lugar
                            </p>
                        </div>

                        <h1 className="mt-6 text-5xl font-black uppercase leading-[0.88] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
                            Busca
                            <br />
                            en Génesis
                            <span className="text-cyan-300">
                                .
                            </span>
                        </h1>

                        <p className="mt-6 max-w-[650px] text-sm leading-7 text-white/45 sm:text-base">
                            Encuentra partidos, noticias, equipo, historia, tienda y servicios del sitio oficial.
                        </p>
                    </div>

                    <form
                        onSubmit={submitSearch}
                        className="mt-10 max-w-[880px]"
                    >
                        <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.06] p-2 backdrop-blur-xl sm:p-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-cyan-300 text-lg text-[#06142d] sm:h-14 sm:w-14">
                                ⌕
                            </div>

                            <input
                                ref={inputRef}
                                type="search"
                                value={query}
                                onChange={(event) =>
                                    setQuery(
                                        event.target.value
                                    )
                                }
                                autoFocus
                                autoComplete="off"
                                placeholder="Buscar en genesisfc.app..."
                                className="min-w-0 flex-1 bg-transparent px-1 py-4 text-sm font-bold text-white outline-none placeholder:text-white/25 sm:text-base"
                            />

                            {query && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuery("")
                                    }
                                    className="hidden rounded-full border border-white/10 px-4 py-3 text-[7px] font-black uppercase tracking-[0.14em] text-white/50 transition hover:bg-white hover:text-[#06142d] sm:block"
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {CATEGORIES.map((item) => {
                            const active =
                                category === item;

                            return (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() =>
                                        setCategory(item)
                                    }
                                    className={`rounded-full border px-4 py-2.5 text-[6px] font-black uppercase tracking-[0.16em] transition sm:px-5 sm:text-[7px] ${
                                        active
                                            ? "border-cyan-300 bg-cyan-300 text-[#06142d]"
                                            : "border-white/10 bg-white/[0.04] text-white/45 hover:border-white/25 hover:text-white"
                                    }`}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
                <div className="mx-auto max-w-[1200px]">
                    <div className="flex flex-col gap-4 border-b border-black/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[7px] font-black uppercase tracking-[0.24em] text-[#168cab]">
                                Resultados
                            </p>

                            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
                                {normalizedQuery
                                    ? `“${query.trim()}”`
                                    : "Explorar"}
                                <span className="text-[#168cab]">
                                    .
                                </span>
                            </h2>
                        </div>

                        <p className="text-[7px] font-black uppercase tracking-[0.16em] text-black/30">
                            {results.length}{" "}
                            {results.length === 1
                                ? "resultado"
                                : "resultados"}
                        </p>
                    </div>

                    {results.length > 0 ? (
                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            {results.map((result) => (
                                <Link
                                    key={result.id}
                                    href={result.href}
                                    className="group rounded-[26px] border border-black/[0.06] bg-white p-5 shadow-[0_14px_50px_rgba(6,20,45,0.045)] transition duration-300 hover:-translate-y-1 hover:border-[#168cab]/25 hover:shadow-[0_22px_70px_rgba(6,20,45,0.08)] sm:p-7"
                                >
                                    <div className="flex items-start justify-between gap-5">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-[#168cab]/10 px-3 py-1.5 text-[6px] font-black uppercase tracking-[0.16em] text-[#168cab]">
                                                    {result.category}
                                                </span>
                                                <span className="text-[6px] font-black uppercase tracking-[0.14em] text-black/25">
                                                    {result.eyebrow}
                                                </span>
                                            </div>

                                            <h3 className="mt-5 text-xl font-black uppercase tracking-[-0.035em] sm:text-2xl">
                                                {result.title}
                                            </h3>

                                            <p className="mt-3 max-w-[460px] text-xs leading-6 text-black/45">
                                                {result.description}
                                            </p>
                                        </div>

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/[0.07] bg-[#f7f7f5] text-sm transition group-hover:border-[#168cab]/20 group-hover:bg-[#168cab] group-hover:text-white">
                                            →
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-8 rounded-[28px] border border-black/[0.06] bg-white px-6 py-14 text-center shadow-[0_18px_60px_rgba(6,20,45,0.04)]">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#06142d] text-xl text-white">
                                ⌕
                            </div>

                            <h3 className="mt-5 text-xl font-black uppercase">
                                Sin resultados
                            </h3>

                            <p className="mx-auto mt-3 max-w-[430px] text-xs leading-6 text-black/40">
                                Prueba con términos como “partidos”, “Olancho”, “tienda”, “equipo”, “noticias” o “pedido”.
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setQuery("");
                                    setCategory("Todo");
                                    inputRef.current?.focus();
                                }}
                                className="mt-6 rounded-full bg-[#168cab] px-6 py-3.5 text-[7px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#06142d]"
                            >
                                Ver todo
                            </button>
                        </div>
                    )}
                </div>
            </section>

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

                        <div>
                            <p className="text-xs font-black uppercase">
                                Génesis FC
                            </p>
                            <p className="mt-1 text-[6px] font-black uppercase tracking-[0.18em] text-cyan-300/70">
                                La Paz · Honduras
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-5">
                        <Link
                            href="/calendario"
                            className="text-[6px] font-black uppercase tracking-[0.16em] text-white/30 transition hover:text-white"
                        >
                            Partidos
                        </Link>
                        <Link
                            href="/noticias"
                            className="text-[6px] font-black uppercase tracking-[0.16em] text-white/30 transition hover:text-white"
                        >
                            Noticias
                        </Link>
                        <Link
                            href="/tienda"
                            className="text-[6px] font-black uppercase tracking-[0.16em] text-white/30 transition hover:text-white"
                        >
                            Tienda
                        </Link>
                    </div>
                </div>

                <div className="mx-auto flex max-w-[1200px] flex-col gap-2 pt-6 sm:flex-row sm:justify-between">
                    <p className="text-[6px] font-black uppercase tracking-[0.14em] text-white/20">
                        © 2026 Génesis FC. Todos los derechos reservados.
                    </p>
                    <p className="text-[6px] font-black uppercase tracking-[0.14em] text-white/20">
                        Buscador oficial
                    </p>
                </div>
            </footer>
        </main>
    );
}
