"use client";

import Image from "next/image";
import Link from "next/link";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

/* =========================================================
   GÉNESIS FC
   MATCH CENTER
   GÉNESIS FC vs OLANCHO FC
   CONECTADO A GÉNESIS LIVE OPS
========================================================= */

const MATCH_SLUG =
    "genesis-vs-olancho-2026-09-19";

const PUBLIC_MATCH_URL =
    "https://genesisfc.app/partidos/genesis-vs-olancho";

/* =========================================================
   TIPOS
========================================================= */

type MatchStatus =
    | "pre_match"
    | "first_half"
    | "halftime"
    | "second_half"
    | "paused"
    | "finished";

type EventType =
    | "goal"
    | "yellow_card"
    | "red_card"
    | "substitution"
    | "save"
    | "chance"
    | "penalty"
    | "own_goal"
    | "var"
    | "injury"
    | "kickoff"
    | "halftime"
    | "second_half"
    | "fulltime"
    | "note";

type LiveMatch = {
    id: string;
    slug: string;

    competition: string;
    season: string;
    matchday: number | null;

    home_team: string;
    away_team: string;

    home_logo: string | null;
    away_logo: string | null;

    stadium: string | null;
    city: string | null;

    scheduled_at: string;

    status: MatchStatus;

    home_score: number;
    away_score: number;

    current_period: number;

    period_started_at: string | null;
    paused_at: string | null;

    elapsed_seconds: number;

    added_time_first_half: number;
    added_time_second_half: number;

    is_live: boolean;

    server_elapsed_seconds?: number;
    server_time?: string;

    created_at: string;
    updated_at: string;
};

type LiveEvent = {
    id: string;
    match_id: string;

    minute: number;
    second: number;

    period: number;

    event_type: EventType;

    team: string | null;

    player_name: string | null;
    player_out: string | null;
    player_in: string | null;

    title: string | null;
    description: string | null;

    created_at: string;
};

type LiveStat = {
    id: string;
    match_id: string;

    team: string;

    shots: number;
    shots_on_target: number;
    corners: number;
    fouls: number;
    offsides: number;
    yellow_cards: number;
    red_cards: number;
    saves: number;

    possession: number | null;

    updated_at: string;
};

type LiveLineup = {
    id: string;
    match_id: string;

    team: string;

    player_name: string;

    shirt_number: number | null;

    position: string | null;

    is_starter: boolean;
    is_captain: boolean;

    sort_order: number;

    created_at: string;
};

type LiveResponse = {
    ok: boolean;

    error?: string;

    match?: LiveMatch;

    events?: LiveEvent[];

    stats?: LiveStat[];

    lineups?: LiveLineup[];
};

type Countdown = {
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

type PredictionChoice =
    | "home"
    | "draw"
    | "away";

type PredictionSummary = {
    total: number;
    home: number;
    draw: number;
    away: number;
    percentages: {
        home: number;
        draw: number;
        away: number;
    };
};

type PredictionApiResponse = {
    ok: boolean;
    error?: string;
    already_voted?: boolean;
    prediction?: PredictionChoice;
    total?: number;
    home?: number;
    draw?: number;
    away?: number;
    percentages?: {
        home: number;
        draw: number;
        away: number;
    };
};

type ReactionChoice =
    | "fire"
    | "heart"
    | "goal"
    | "clap";

type ReactionSummary = {
    fire: number;
    heart: number;
    goal: number;
    clap: number;
    total: number;
};

type ReactionApiResponse = {
    ok: boolean;
    error?: string;
    rate_limited?: boolean;
    reaction?: ReactionChoice;
    fire?: number;
    heart?: number;
    goal?: number;
    clap?: number;
    total?: number;
};

type MvpRankingItem = {
    player_id: string;
    votes: number;
};

type MvpApiResponse = {
    ok: boolean;
    error?: string;
    already_voted?: boolean;
    player_id?: string;
    total?: number;
    ranking?: MvpRankingItem[];
};

/* =========================================================
   FORMA RECIENTE GÉNESIS
========================================================= */

const resultadosGenesis: Resultado[] = [
    {
        fecha: "12 SEP",
        local: "Motagua",
        logoLocal: "/motagua.png",
        golesLocal: 1,

        visitante: "Génesis FC",
        logoVisitante: "/genesis.jpg",
        golesVisitante: 0,

        estado: "D",
    },
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
];

/* =========================================================
   FORMA RECIENTE OLANCHO FC
========================================================= */

const resultadosOlancho: Resultado[] = [
    {
        fecha: "12 SEP",
        local: "Olancho FC",
        logoLocal: "/olancho.png",
        golesLocal: 1,

        visitante: "Real España",
        logoVisitante: "/real-espana.jpg",
        golesVisitante: 1,

        estado: "E",
    },
    {
        fecha: "04 SEP",
        local: "CD Choloma",
        logoLocal: "/choloma.png",
        golesLocal: 0,

        visitante: "Olancho FC",
        logoVisitante: "/olancho.png",
        golesVisitante: 0,

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

        estado: "D",
    },
    {
        fecha: "23 AGO",
        local: "Olancho FC",
        logoLocal: "/olancho.png",
        golesLocal: 1,

        visitante: "Olimpia",
        logoVisitante: "/olimpia.png",
        golesVisitante: 1,

        estado: "E",
    },
];

/* =========================================================
   HELPERS
========================================================= */

function dos(
    value: number
) {
    return String(
        value
    ).padStart(
        2,
        "0"
    );
}

async function obtenerVoterHash(
    matchSlug: string
) {
    const storageKey =
        "genesisfc-anonymous-voter-id";

    let voterId =
        window.localStorage.getItem(
            storageKey
        );

    if (!voterId) {
        voterId =
            typeof crypto.randomUUID ===
            "function"
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()
                      .toString(36)
                      .slice(2)}`;

        window.localStorage.setItem(
            storageKey,
            voterId
        );
    }

    const source =
        `${matchSlug}:${voterId}`;

    if (
        crypto.subtle &&
        typeof TextEncoder !==
            "undefined"
    ) {
        const bytes =
            new TextEncoder().encode(
                source
            );

        const digest =
            await crypto.subtle.digest(
                "SHA-256",
                bytes
            );

        return Array.from(
            new Uint8Array(
                digest
            )
        )
            .map((byte) =>
                byte
                    .toString(16)
                    .padStart(
                        2,
                        "0"
                    )
            )
            .join("");
    }

    return source;
}

function formatClock(
    totalSeconds: number
) {
    const segundos =
        Math.max(
            0,
            Math.floor(
                totalSeconds
            )
        );

    const minutos =
        Math.floor(
            segundos / 60
        );

    return `${dos(
        minutos
    )}:${dos(
        segundos % 60
    )}`;
}

/* =========================================================
   MINUTO FUTBOLÍSTICO
========================================================= */

function minutoFutbolistico(
    totalSeconds: number,
    period: number
) {
    const segundos =
        Math.max(
            0,
            Math.floor(
                totalSeconds
            )
        );

    const minuto =
        Math.floor(
            segundos / 60
        );

    /*
     * 1T
     *
     * 44:59 -> 44'
     * 45:00 -> 45+1'
     * 46:00 -> 45+2'
     */

    if (
        period === 1 &&
        minuto >= 45
    ) {
        const agregado =
            minuto - 44;

        return `45+${agregado}'`;
    }

    /*
     * 2T
     *
     * 89:59 -> 89'
     * 90:00 -> 90+1'
     * 91:00 -> 90+2'
     */

    if (
        period === 2 &&
        minuto >= 90
    ) {
        const agregado =
            minuto - 89;

        return `90+${agregado}'`;
    }

    return `${minuto}'`;
}

/* =========================================================
   MINUTO PARA EVENTOS
========================================================= */

function minutoEvento(
    minute: number,
    period: number
) {
    if (
        period === 1 &&
        minute >= 45
    ) {
        return `45+${Math.max(
            1,
            minute - 44
        )}'`;
    }

    if (
        period === 2 &&
        minute >= 90
    ) {
        return `90+${Math.max(
            1,
            minute - 89
        )}'`;
    }

    return `${minute}'`;
}

function statusLabel(
    status: MatchStatus
) {
    if (
        status ===
        "first_half"
    ) {
        return "EN VIVO · 1T";
    }

    if (
        status ===
        "halftime"
    ) {
        return "DESCANSO";
    }

    if (
        status ===
        "second_half"
    ) {
        return "EN VIVO · 2T";
    }

    if (
        status ===
        "paused"
    ) {
        return "PARTIDO PAUSADO";
    }

    if (
        status ===
        "finished"
    ) {
        return "FINAL";
    }

    return "PREVIA";
}

function statusStyles(
    status: MatchStatus
) {
    if (
        status ===
            "first_half" ||
        status ===
            "second_half"
    ) {
        return "border-red-400/30 bg-red-500/15 text-red-300";
    }

    if (
        status ===
            "halftime" ||
        status ===
            "paused"
    ) {
        return "border-amber-300/30 bg-amber-300/10 text-amber-200";
    }

    if (
        status ===
        "finished"
    ) {
        return "border-white/15 bg-white/[0.06] text-white/70";
    }

    return "border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-300";
}

function eventName(
    type: EventType
) {
    switch (type) {
        case "goal":
            return "Gol";

        case "yellow_card":
            return "Tarjeta amarilla";

        case "red_card":
            return "Tarjeta roja";

        case "substitution":
            return "Cambio";

        case "save":
            return "Atajada";

        case "chance":
            return "Ocasión";

        case "penalty":
            return "Penal";

        case "own_goal":
            return "Autogol";

        case "var":
            return "VAR";

        case "injury":
            return "Lesión";

        case "kickoff":
            return "Inicio";

        case "halftime":
            return "Descanso";

        case "second_half":
            return "Segundo tiempo";

        case "fulltime":
            return "Final";

        default:
            return "Actualización";
    }
}

function eventIcon(
    type: EventType
) {
    switch (type) {
        case "goal":
            return "⚽";

        case "yellow_card":
            return "🟨";

        case "red_card":
            return "🟥";

        case "substitution":
            return "↔";

        case "save":
            return "GK";

        case "chance":
            return "◎";

        case "penalty":
            return "P";

        case "own_goal":
            return "AG";

        case "var":
            return "VAR";

        case "injury":
            return "+";

        case "kickoff":
            return "▶";

        case "halftime":
            return "HT";

        case "second_half":
            return "2T";

        case "fulltime":
            return "FT";

        default:
            return "•";
    }
}

function eventStyle(
    type: EventType
) {
    if (
        type ===
        "goal"
    ) {
        return {
            wrapper:
                "border-emerald-500/15 bg-emerald-500/[0.045]",

            icon:
                "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",

            label:
                "text-emerald-700",
        };
    }

    if (
        type ===
        "yellow_card"
    ) {
        return {
            wrapper:
                "border-amber-400/20 bg-amber-400/[0.06]",

            icon:
                "border-amber-400/30 bg-amber-400/10",

            label:
                "text-amber-700",
        };
    }

    if (
        type ===
        "red_card"
    ) {
        return {
            wrapper:
                "border-red-500/20 bg-red-500/[0.05]",

            icon:
                "border-red-500/25 bg-red-500/10",

            label:
                "text-red-700",
        };
    }

    if (
        type ===
        "save"
    ) {
        return {
            wrapper:
                "border-cyan-500/15 bg-cyan-500/[0.04]",

            icon:
                "border-cyan-500/20 bg-cyan-500/10 text-[#168cab]",

            label:
                "text-[#168cab]",
        };
    }

    return {
        wrapper:
            "border-black/[0.06] bg-white",

        icon:
            "border-black/10 bg-black/[0.03] text-[#168cab]",

        label:
            "text-[#168cab]",
    };
}

/* =========================================================
   LOGO
========================================================= */

function Logo({
    src,
    alt,
    large = false,
}: {
    src: string;
    alt: string;
    large?: boolean;
}) {
    return (
        <div
            className={`relative shrink-0 ${
                large
                    ? "h-24 w-24 sm:h-36 sm:w-36 lg:h-44 lg:w-44"
                    : "h-10 w-10"
            }`}
        >
            <Image
                src={src}
                alt={alt}
                fill
                quality={100}
                sizes={
                    large
                        ? "176px"
                        : "40px"
                }
                className="object-contain"
            />
        </div>
    );
}

/* =========================================================
   ESTADO DE FORMA
========================================================= */

function EstadoForma({
    estado,
}: {
    estado:
        | "V"
        | "E"
        | "D";
}) {
    const styles =
        estado ===
        "V"
            ? "bg-emerald-500 text-white"
            : estado ===
                "D"
              ? "bg-red-500 text-white"
              : "bg-[#168cab] text-white";

    return (
        <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-[8px] font-black ${styles}`}
        >
            {estado}
        </span>
    );
}

/* =========================================================
   FORMA GÉNESIS
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
        <article className="w-full overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_70px_rgba(6,20,45,0.06)]">
            {/* CABECERA */}
            <div className="border-b border-black/[0.07] px-4 py-6 sm:flex sm:items-center sm:justify-between sm:gap-5 sm:p-8">
                {/* MÓVIL: todo perfectamente centrado */}
                <div className="flex flex-col items-center text-center sm:hidden">
                    <div className="relative h-14 w-14">
                        <Image
                            src={logo}
                            alt={equipo}
                            fill
                            quality={100}
                            sizes="56px"
                            className="object-contain"
                        />
                    </div>

                    <p className="mt-3 text-[7px] font-black uppercase tracking-[0.25em] text-[#168cab]">
                        {subtitulo}
                    </p>

                    <h3 className="mt-2 text-xl font-black uppercase tracking-[-0.04em]">
                        {equipo}
                    </h3>

                    <div className="mt-5 flex w-full flex-col items-center justify-center">
                        <p className="mb-3 text-center text-[6px] font-black uppercase tracking-[0.18em] text-black/25">
                            Últimos 4
                        </p>

                        <div className="flex items-center justify-center gap-2">
                            {resultados.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <EstadoForma
                                        key={`${item.fecha}-${index}`}
                                        estado={item.estado}
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* TABLET / PC */}
                <div className="hidden items-center gap-4 sm:flex">
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

                    <div className="min-w-0 text-left">
                        <p className="text-[7px] font-black uppercase tracking-[0.25em] text-[#168cab]">
                            {subtitulo}
                        </p>

                        <h3 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em]">
                            {equipo}
                        </h3>
                    </div>
                </div>

                <div className="hidden flex-col items-start sm:flex">
                    <p className="mb-3 text-left text-[6px] font-black uppercase tracking-[0.18em] text-black/25">
                        Últimos 4
                    </p>

                    <div className="flex gap-2">
                        {resultados.map(
                            (
                                item,
                                index
                            ) => (
                                <EstadoForma
                                    key={`${item.fecha}-${index}`}
                                    estado={item.estado}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* PARTIDOS */}
            {resultados.map(
                (
                    resultado
                ) => (
                    <div
                        key={`${resultado.fecha}-${resultado.local}-${resultado.visitante}`}
                        className="border-b border-black/[0.06] px-4 py-5 last:border-b-0 sm:px-6 sm:py-6"
                    >
                        <p className="mb-4 text-center text-[6px] font-black uppercase tracking-[0.14em] text-black/30 sm:mb-5 sm:text-left">
                            {resultado.fecha}
                        </p>

                        {/* MÓVIL */}
                        <div className="grid w-full grid-cols-3 items-center sm:hidden">
                            <div className="flex min-w-0 flex-col items-center justify-center text-center">
                                <div className="relative h-11 w-11">
                                    <Image
                                        src={resultado.logoLocal}
                                        alt={resultado.local}
                                        fill
                                        quality={100}
                                        sizes="44px"
                                        className="object-contain"
                                    />
                                </div>

                                <p className="mt-2 max-w-[92px] break-words text-[6px] font-black uppercase leading-[1.15]">
                                    {resultado.local}
                                </p>
                            </div>

                            <div className="mx-auto flex h-12 w-[64px] items-center justify-center gap-1 rounded-[13px] bg-[#06142d] text-white">
                                <span className="text-lg font-black tabular-nums">
                                    {resultado.golesLocal}
                                </span>

                                <span className="text-white/25">
                                    —
                                </span>

                                <span className="text-lg font-black tabular-nums">
                                    {resultado.golesVisitante}
                                </span>
                            </div>

                            <div className="flex min-w-0 flex-col items-center justify-center text-center">
                                <div className="relative h-11 w-11">
                                    <Image
                                        src={resultado.logoVisitante}
                                        alt={resultado.visitante}
                                        fill
                                        quality={100}
                                        sizes="44px"
                                        className="object-contain"
                                    />
                                </div>

                                <p className="mt-2 max-w-[92px] break-words text-[6px] font-black uppercase leading-[1.15]">
                                    {resultado.visitante}
                                </p>
                            </div>
                        </div>

                        {/* TABLET / PC */}
                        <div className="hidden w-full grid-cols-[minmax(0,1fr)_78px_minmax(0,1fr)] items-center gap-4 sm:grid">
                            <div className="flex min-w-0 items-center justify-end gap-3 text-right">
                                <p className="min-w-0 break-words text-[10px] font-black uppercase leading-tight">
                                    {resultado.local}
                                </p>

                                <div className="relative h-10 w-10 shrink-0">
                                    <Image
                                        src={resultado.logoLocal}
                                        alt={resultado.local}
                                        fill
                                        quality={100}
                                        sizes="40px"
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-1 rounded-[11px] bg-[#06142d] px-2 py-2 text-white">
                                <span className="text-base font-black tabular-nums">
                                    {resultado.golesLocal}
                                </span>

                                <span className="text-white/25">
                                    —
                                </span>

                                <span className="text-base font-black tabular-nums">
                                    {resultado.golesVisitante}
                                </span>
                            </div>

                            <div className="flex min-w-0 items-center justify-start gap-3 text-left">
                                <div className="relative h-10 w-10 shrink-0">
                                    <Image
                                        src={resultado.logoVisitante}
                                        alt={resultado.visitante}
                                        fill
                                        quality={100}
                                        sizes="40px"
                                        className="object-contain"
                                    />
                                </div>

                                <p className="min-w-0 break-words text-[10px] font-black uppercase leading-tight">
                                    {resultado.visitante}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            )}
        </article>
    );
}

/* =========================================================
   ESTADÍSTICA
========================================================= */

function StatRow({
    name,
    home,
    away,
}: {
    name: string;

    home:
        | number
        | null;

    away:
        | number
        | null;
}) {
    const disponible =
        home !== null &&
        away !== null;

    const total =
        disponible
            ? home + away
            : 0;

    const porcentaje =
        disponible &&
        total > 0
            ? (home / total) *
              100
            : 50;

    return (
        <div className="border-b border-black/[0.06] py-5 last:border-b-0">
            <div className="grid grid-cols-[60px_1fr_60px] items-center gap-4">
                <p className="text-left text-sm font-black">
                    {home ?? "—"}
                </p>

                <p className="text-center text-[7px] font-black uppercase tracking-[0.2em] text-black/35">
                    {name}
                </p>

                <p className="text-right text-sm font-black">
                    {away ?? "—"}
                </p>
            </div>

            {disponible && (
                <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-[#168cab]">
                    <div
                        className="bg-[#06142d]"
                        style={{
                            width:
                                `${porcentaje}%`,
                        }}
                    />

                    <div className="flex-1" />
                </div>
            )}
        </div>
    );
}

/* =========================================================
   JUGADOR
========================================================= */

function LineupPlayer({
    player,
    compact = false,
}: {
    player: LiveLineup;
    compact?: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-3 border-b border-black/[0.05] last:border-b-0 ${
                compact
                    ? "py-2.5"
                    : "py-3"
            }`}
        >
            <div
                className={`flex shrink-0 items-center justify-center rounded-full bg-[#06142d] font-black text-white ${
                    compact
                        ? "h-8 w-8 text-[7px]"
                        : "h-9 w-9 text-[8px]"
                }`}
            >
                {player.shirt_number ??
                    "—"}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p
                        className={`truncate font-black uppercase ${
                            compact
                                ? "text-[9px]"
                                : "text-[10px]"
                        }`}
                    >
                        {
                            player.player_name
                        }
                    </p>

                    {player.is_captain && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-300 px-1 text-[6px] font-black text-[#2b2000]">
                            C
                        </span>
                    )}
                </div>

                <p className="mt-1 text-[6px] font-black uppercase tracking-[0.13em] text-black/30">
                    {player.position ||
                        "Sin posición"}
                </p>
            </div>
        </div>
    );
}

/* =========================================================
   PLANTEL CONVOCADO
========================================================= */

function TeamRosterPending({
    team,
    logo,
    players,
}: {
    team: string;
    logo: string;
    players: LiveLineup[];
}) {
    return (
        <article className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_60px_rgba(6,20,45,0.05)]">
            <div className="border-b border-black/[0.06] bg-[#06142d] p-6 text-white">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14">
                            <Image
                                src={
                                    logo
                                }
                                alt={
                                    team
                                }
                                fill
                                quality={
                                    100
                                }
                                sizes="56px"
                                className="object-contain"
                            />
                        </div>

                        <div>
                            <p className="text-[6px] font-black uppercase tracking-[0.2em] text-cyan-300">
                                Plantel convocado
                            </p>

                            <h3 className="mt-1 text-xl font-black uppercase">
                                {
                                    team
                                }
                            </h3>
                        </div>
                    </div>

                    <div className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-2">
                        <p className="text-[6px] font-black uppercase tracking-[0.16em] text-cyan-300">
                            XI por confirmar
                        </p>
                    </div>
                </div>

                <p className="mt-5 max-w-[520px] text-[10px] leading-5 text-white/40">
                    El plantel está registrado para el Match Center. La alineación titular se publicará cuando sea confirmada oficialmente.
                </p>
            </div>

            {players.length >
            0 ? (
                <div className="p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#168cab]">
                            Jugadores disponibles
                        </p>

                        <p className="text-[7px] font-black uppercase tracking-[0.15em] text-black/25">
                            {
                                players.length
                            }{" "}
                            jugadores
                        </p>
                    </div>

                    <div className="grid gap-x-6 sm:grid-cols-2">
                        {players.map(
                            (
                                player
                            ) => (
                                <LineupPlayer
                                    key={
                                        player.id
                                    }
                                    player={
                                        player
                                    }
                                    compact
                                />
                            )
                        )}
                    </div>
                </div>
            ) : (
                <div className="p-8 text-center">
                    <p className="text-xs font-bold text-black/30">
                        Plantel pendiente de publicación.
                    </p>
                </div>
            )}
        </article>
    );
}

/* =========================================================
   ALINEACIÓN OFICIAL
========================================================= */

function TeamOfficialLineup({
    team,
    logo,
    players,
}: {
    team: string;
    logo: string;
    players: LiveLineup[];
}) {
    const starters =
        players.filter(
            (
                player
            ) =>
                player.is_starter
        );

    const substitutes =
        players.filter(
            (
                player
            ) =>
                !player.is_starter
        );

    return (
        <article className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_60px_rgba(6,20,45,0.05)]">
            <div className="border-b border-black/[0.06] p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14">
                            <Image
                                src={
                                    logo
                                }
                                alt={
                                    team
                                }
                                fill
                                quality={
                                    100
                                }
                                sizes="56px"
                                className="object-contain"
                            />
                        </div>

                        <div>
                            <p className="text-[6px] font-black uppercase tracking-[0.2em] text-emerald-600">
                                Alineación oficial
                            </p>

                            <h3 className="mt-1 text-lg font-black uppercase">
                                {
                                    team
                                }
                            </h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                        <p className="text-[7px] font-black uppercase text-emerald-700">
                            XI 11/11
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-0 sm:grid-cols-2">
                <div className="border-b border-black/[0.06] p-5 sm:border-b-0 sm:border-r">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#168cab]">
                            En cancha
                        </p>

                        <span className="text-[7px] font-black text-black/25">
                            11
                        </span>
                    </div>

                    {starters.map(
                        (
                            player
                        ) => (
                            <LineupPlayer
                                key={
                                    player.id
                                }
                                player={
                                    player
                                }
                            />
                        )
                    )}
                </div>

                <div className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-black/30">
                            Suplentes
                        </p>

                        <span className="text-[7px] font-black text-black/25">
                            {
                                substitutes.length
                            }
                        </span>
                    </div>

                    {substitutes.length >
                    0 ? (
                        substitutes.map(
                            (
                                player
                            ) => (
                                <LineupPlayer
                                    key={
                                        player.id
                                    }
                                    player={
                                        player
                                    }
                                />
                            )
                        )
                    ) : (
                        <p className="py-4 text-xs text-black/30">
                            Suplentes por confirmar.
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}

/* =========================================================
   BLOQUE INTELIGENTE DE EQUIPO
========================================================= */

function TeamSquad({
    team,
    logo,
    players,
}: {
    team: string;
    logo: string;
    players: LiveLineup[];
}) {
    const starters =
        players.filter(
            (
                player
            ) =>
                player.is_starter
        );

    const lineupConfirmed =
        starters.length ===
        11;

    if (
        lineupConfirmed
    ) {
        return (
            <TeamOfficialLineup
                team={
                    team
                }
                logo={
                    logo
                }
                players={
                    players
                }
            />
        );
    }

    return (
        <TeamRosterPending
            team={
                team
            }
            logo={
                logo
            }
            players={
                players
            }
        />
    );
}

/* =========================================================
   PÁGINA
========================================================= */

export default function GenesisVsOlanchoPage() {
    const [
        match,
        setMatch,
    ] =
        useState<LiveMatch | null>(
            null
        );

    const [
        events,
        setEvents,
    ] =
        useState<
            LiveEvent[]
        >([]);

    const [
        stats,
        setStats,
    ] =
        useState<
            LiveStat[]
        >([]);

    const [
        lineups,
        setLineups,
    ] =
        useState<
            LiveLineup[]
        >([]);

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    const [
        error,
        setError,
    ] =
        useState("");

    const [
        tick,
        setTick,
    ] =
        useState(
            Date.now()
        );

    const [
        countdown,
        setCountdown,
    ] =
        useState<Countdown>({
            dias: 0,
            horas: 0,
            minutos: 0,
            segundos: 0,
        });

    const [
        predictionSummary,
        setPredictionSummary,
    ] =
        useState<PredictionSummary>({
            total: 0,
            home: 0,
            draw: 0,
            away: 0,
            percentages: {
                home: 0,
                draw: 0,
                away: 0,
            },
        });

    const [
        predictionLoading,
        setPredictionLoading,
    ] =
        useState(true);

    const [
        predictionVoting,
        setPredictionVoting,
    ] =
        useState(false);

    const [
        myPrediction,
        setMyPrediction,
    ] =
        useState<PredictionChoice | null>(
            null
        );

    const [
        predictionError,
        setPredictionError,
    ] =
        useState("");

    const [
        linkCopied,
        setLinkCopied,
    ] =
        useState(false);

    const [
        reactionSummary,
        setReactionSummary,
    ] =
        useState<ReactionSummary>({
            fire: 0,
            heart: 0,
            goal: 0,
            clap: 0,
            total: 0,
        });

    const [
        reactionLoading,
        setReactionLoading,
    ] =
        useState(true);

    const [
        reactionSending,
        setReactionSending,
    ] =
        useState<ReactionChoice | null>(
            null
        );

    const [
        reactionError,
        setReactionError,
    ] =
        useState("");

    const [
        lastReaction,
        setLastReaction,
    ] =
        useState<ReactionChoice | null>(
            null
        );

    const [
        mvpRanking,
        setMvpRanking,
    ] =
        useState<MvpRankingItem[]>(
            []
        );

    const [
        mvpTotal,
        setMvpTotal,
    ] =
        useState(0);

    const [
        mvpLoading,
        setMvpLoading,
    ] =
        useState(false);

    const [
        mvpVoting,
        setMvpVoting,
    ] =
        useState(false);

    const [
        myMvp,
        setMyMvp,
    ] =
        useState<string | null>(
            null
        );

    const [
        mvpError,
        setMvpError,
    ] =
        useState("");

    /* =====================================================
       CARGAR LIVE OPS
    ===================================================== */

    const cargar =
        useCallback(
            async (
                silencioso =
                    false
            ) => {
                try {
                    if (
                        !silencioso
                    ) {
                        setLoading(
                            true
                        );
                    }

                    const response =
                        await fetch(
                            `/api/live?slug=${encodeURIComponent(
                                MATCH_SLUG
                            )}`,
                            {
                                cache:
                                    "no-store",
                            }
                        );

                    const data =
                        (await response.json()) as LiveResponse;

                    if (
                        !response.ok ||
                        !data.ok ||
                        !data.match
                    ) {
                        throw new Error(
                            data.error ||
                                "No se pudo cargar el partido."
                        );
                    }

                    setMatch(
                        data.match
                    );

                    setEvents(
                        data.events ??
                            []
                    );

                    setStats(
                        data.stats ??
                            []
                    );

                    setLineups(
                        data.lineups ??
                            []
                    );

                    setError("");
                } catch (
                    cause
                ) {
                    if (
                        !silencioso
                    ) {
                        setError(
                            cause instanceof
                                Error
                                ? cause.message
                                : "No se pudo cargar el Match Center."
                        );
                    }
                } finally {
                    if (
                        !silencioso
                    ) {
                        setLoading(
                            false
                        );
                    }
                }
            },
            []
        );

    useEffect(() => {
        cargar();

        const poll =
            window.setInterval(
                () => {
                    cargar(
                        true
                    );
                },
                2500
            );

        return () =>
            window.clearInterval(
                poll
            );
    }, [
        cargar,
    ]);

    /* =====================================================
       PRONÓSTICO DE LA AFICIÓN
    ===================================================== */

    const cargarPronostico =
        useCallback(
            async (
                silencioso =
                    false
            ) => {
                try {
                    if (
                        !silencioso
                    ) {
                        setPredictionLoading(
                            true
                        );
                    }

                    const response =
                        await fetch(
                            `/api/predictions?match_slug=${encodeURIComponent(
                                MATCH_SLUG
                            )}`,
                            {
                                cache:
                                    "no-store",
                            }
                        );

                    const data =
                        (await response.json()) as PredictionApiResponse;

                    if (
                        !response.ok ||
                        !data.ok ||
                        !data.percentages
                    ) {
                        throw new Error(
                            data.error ||
                                "No se pudo cargar el pronóstico."
                        );
                    }

                    setPredictionSummary({
                        total:
                            data.total ??
                            0,
                        home:
                            data.home ??
                            0,
                        draw:
                            data.draw ??
                            0,
                        away:
                            data.away ??
                            0,
                        percentages:
                            data.percentages,
                    });

                    setPredictionError("");
                } catch (
                    cause
                ) {
                    if (
                        !silencioso
                    ) {
                        setPredictionError(
                            cause instanceof
                                Error
                                ? cause.message
                                : "No se pudo cargar el pronóstico."
                        );
                    }
                } finally {
                    if (
                        !silencioso
                    ) {
                        setPredictionLoading(
                            false
                        );
                    }
                }
            },
            []
        );

    useEffect(() => {
        cargarPronostico();

        const saved =
            window.localStorage.getItem(
                `genesisfc-prediction:${MATCH_SLUG}`
            );

        if (
            saved === "home" ||
            saved === "draw" ||
            saved === "away"
        ) {
            setMyPrediction(
                saved
            );
        }

        const poll =
            window.setInterval(
                () => {
                    cargarPronostico(
                        true
                    );
                },
                15000
            );

        return () =>
            window.clearInterval(
                poll
            );
    }, [
        cargarPronostico,
    ]);

    async function votarPronostico(
        prediction: PredictionChoice
    ) {
        if (
            predictionVoting ||
            match?.status !==
                "pre_match"
        ) {
            return;
        }

        setPredictionVoting(
            true
        );
        setPredictionError("");

        try {
            const voterHash =
                await obtenerVoterHash(
                    MATCH_SLUG
                );

            const response =
                await fetch(
                    "/api/predictions",
                    {
                        method:
                            "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify(
                            {
                                match_slug:
                                    MATCH_SLUG,
                                prediction,
                                voter_hash:
                                    voterHash,
                            }
                        ),
                    }
                );

            const data =
                (await response.json()) as PredictionApiResponse;

            if (
                !response.ok ||
                !data.ok ||
                !data.percentages
            ) {
                throw new Error(
                    data.error ||
                        "No se pudo registrar tu pronóstico."
                );
            }

            const selected =
                data.prediction ??
                prediction;

            setMyPrediction(
                selected
            );

            window.localStorage.setItem(
                `genesisfc-prediction:${MATCH_SLUG}`,
                selected
            );

            setPredictionSummary({
                total:
                    data.total ??
                    0,
                home:
                    data.home ??
                    0,
                draw:
                    data.draw ??
                    0,
                away:
                    data.away ??
                    0,
                percentages:
                    data.percentages,
            });
        } catch (
            cause
        ) {
            setPredictionError(
                cause instanceof
                    Error
                    ? cause.message
                    : "No se pudo registrar tu pronóstico."
            );
        } finally {
            setPredictionVoting(
                false
            );
        }
    }

    /* =====================================================
       CRONÓMETRO VISUAL
    ===================================================== */

    useEffect(() => {
        const interval =
            window.setInterval(
                () => {
                    setTick(
                        Date.now()
                    );
                },
                250
            );

        return () =>
            window.clearInterval(
                interval
            );
    }, []);

    const segundosPartido =
        useMemo(() => {
            if (!match) {
                return 0;
            }

            const base =
                match.elapsed_seconds ??
                0;

            const corriendo =
                match.status ===
                    "first_half" ||
                match.status ===
                    "second_half";

            const startedAt =
                match.period_started_at;

            if (
                !corriendo ||
                !startedAt
            ) {
                return base;
            }

            const inicio =
                new Date(
                    startedAt
                ).getTime();

            if (
                Number.isNaN(
                    inicio
                )
            ) {
                return base;
            }

            return (
                base +
                Math.max(
                    0,
                    tick -
                        inicio
                ) /
                    1000
            );
        }, [
            match,
            tick,
        ]);

    const reloj =
        useMemo(
            () =>
                formatClock(
                    segundosPartido
                ),
            [
                segundosPartido,
            ]
        );

    const minutoVisual =
        useMemo(
            () =>
                minutoFutbolistico(
                    segundosPartido,
                    match?.current_period ??
                        1
                ),
            [
                match?.current_period,
                segundosPartido,
            ]
        );

    /* =====================================================
       TIEMPO AÑADIDO ACTUAL
    ===================================================== */

    const tiempoAnadidoActual =
        useMemo(() => {
            if (!match) {
                return 0;
            }

            if (
                match.current_period ===
                1
            ) {
                return (
                    match.added_time_first_half ??
                    0
                );
            }

            if (
                match.current_period ===
                2
            ) {
                return (
                    match.added_time_second_half ??
                    0
                );
            }

            return 0;
        }, [
            match,
        ]);

    const mostrarAvisoAgregado =
        Boolean(
            match &&
                tiempoAnadidoActual >
                    0 &&
                (
                    match.status ===
                        "first_half" ||
                    match.status ===
                        "second_half" ||
                    match.status ===
                        "paused"
                )
        );

    /* =====================================================
       COUNTDOWN
    ===================================================== */

    useEffect(() => {
        if (
            !match ||
            match.status !==
                "pre_match"
        ) {
            return;
        }

        const target =
            new Date(
                match.scheduled_at
            ).getTime();

        function actualizar() {
            const diff =
                target -
                Date.now();

            if (
                diff <= 0
            ) {
                setCountdown({
                    dias: 0,
                    horas: 0,
                    minutos: 0,
                    segundos: 0,
                });

                return;
            }

            setCountdown({
                dias:
                    Math.floor(
                        diff /
                            86400000
                    ),

                horas:
                    Math.floor(
                        (diff /
                            3600000) %
                            24
                    ),

                minutos:
                    Math.floor(
                        (diff /
                            60000) %
                            60
                    ),

                segundos:
                    Math.floor(
                        (diff /
                            1000) %
                            60
                    ),
            });
        }

        actualizar();

        const timer =
            window.setInterval(
                actualizar,
                1000
            );

        return () =>
            window.clearInterval(
                timer
            );
    }, [
        match,
    ]);

    /* =====================================================
       DERIVADOS
    ===================================================== */

    const homeStats =
        useMemo(
            () =>
                match
                    ? stats.find(
                          (
                              stat
                          ) =>
                              stat.team ===
                              match.home_team
                      ) ??
                      null
                    : null,
            [
                match,
                stats,
            ]
        );

    const awayStats =
        useMemo(
            () =>
                match
                    ? stats.find(
                          (
                              stat
                          ) =>
                              stat.team ===
                              match.away_team
                      ) ??
                      null
                    : null,
            [
                match,
                stats,
            ]
        );

    const homeLineup =
        useMemo(
            () =>
                match
                    ? lineups.filter(
                          (
                              player
                          ) =>
                              player.team ===
                              match.home_team
                      )
                    : [],
            [
                lineups,
                match,
            ]
        );

    const awayLineup =
        useMemo(
            () =>
                match
                    ? lineups.filter(
                          (
                              player
                          ) =>
                              player.team ===
                              match.away_team
                      )
                    : [],
            [
                lineups,
                match,
            ]
        );

    const homeConfirmed =
        homeLineup.filter(
            (
                player
            ) =>
                player.is_starter
        ).length === 11;

    const awayConfirmed =
        awayLineup.filter(
            (
                player
            ) =>
                player.is_starter
        ).length === 11;

    const live =
        match?.status ===
            "first_half" ||
        match?.status ===
            "second_half";

    const enPartido =
        match?.status !==
        "pre_match";

    const mvpCandidates =
        useMemo(() => {
            if (!match) {
                return [];
            }

            return lineups
                .filter(
                    (player) =>
                        Boolean(
                            player.id &&
                                player.player_name
                        )
                )
                .sort(
                    (a, b) => {
                        if (
                            a.team !==
                            b.team
                        ) {
                            if (
                                a.team ===
                                match.home_team
                            ) {
                                return -1;
                            }

                            if (
                                b.team ===
                                match.home_team
                            ) {
                                return 1;
                            }
                        }

                        if (
                            a.is_starter !==
                            b.is_starter
                        ) {
                            return a.is_starter
                                ? -1
                                : 1;
                        }

                        return (
                            a.sort_order -
                            b.sort_order
                        );
                    }
                );
        }, [
            lineups,
            match,
        ]);

    const mvpLeader =
        useMemo(() => {
            const leader =
                mvpRanking[0];

            if (!leader) {
                return null;
            }

            const player =
                mvpCandidates.find(
                    (candidate) =>
                        candidate.id ===
                        leader.player_id
                );

            if (!player) {
                return null;
            }

            return {
                player,
                votes:
                    leader.votes,
            };
        }, [
            mvpCandidates,
            mvpRanking,
        ]);

    /* =====================================================
       MVP DE LA AFICIÓN
    ===================================================== */

    const cargarMvp =
        useCallback(
            async (
                silencioso =
                    false
            ) => {
                try {
                    if (
                        !silencioso
                    ) {
                        setMvpLoading(
                            true
                        );
                    }

                    const response =
                        await fetch(
                            `/api/mvp?match_slug=${encodeURIComponent(
                                MATCH_SLUG
                            )}`,
                            {
                                cache:
                                    "no-store",
                            }
                        );

                    const data =
                        (await response.json()) as MvpApiResponse;

                    if (
                        !response.ok ||
                        !data.ok
                    ) {
                        throw new Error(
                            data.error ||
                                "No se pudo cargar la votación MVP."
                        );
                    }

                    setMvpRanking(
                        data.ranking ??
                            []
                    );
                    setMvpTotal(
                        data.total ??
                            0
                    );
                    setMvpError("");
                } catch (cause) {
                    if (
                        !silencioso
                    ) {
                        setMvpError(
                            cause instanceof
                                Error
                                ? cause.message
                                : "No se pudo cargar la votación MVP."
                        );
                    }
                } finally {
                    if (
                        !silencioso
                    ) {
                        setMvpLoading(
                            false
                        );
                    }
                }
            },
            []
        );

    useEffect(() => {
        const saved =
            window.localStorage.getItem(
                `genesisfc-mvp:${MATCH_SLUG}`
            );

        if (saved) {
            setMyMvp(saved);
        }

        if (
            match?.status !==
            "finished"
        ) {
            setMvpLoading(
                false
            );
            return;
        }

        cargarMvp();

        const poll =
            window.setInterval(
                () => {
                    cargarMvp(
                        true
                    );
                },
                15000
            );

        return () =>
            window.clearInterval(
                poll
            );
    }, [
        cargarMvp,
        match?.status,
    ]);

    async function votarMvp(
        playerId: string
    ) {
        if (
            mvpVoting ||
            match?.status !==
                "finished" ||
            myMvp
        ) {
            return;
        }

        setMvpVoting(true);
        setMvpError("");

        try {
            const voterHash =
                await obtenerVoterHash(
                    MATCH_SLUG
                );

            const response =
                await fetch(
                    "/api/mvp",
                    {
                        method:
                            "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify(
                            {
                                match_slug:
                                    MATCH_SLUG,
                                player_id:
                                    playerId,
                                voter_hash:
                                    voterHash,
                            }
                        ),
                    }
                );

            const data =
                (await response.json()) as MvpApiResponse;

            if (
                !response.ok ||
                !data.ok
            ) {
                throw new Error(
                    data.error ||
                        "No se pudo registrar tu voto MVP."
                );
            }

            const selected =
                data.player_id ??
                playerId;

            setMyMvp(selected);
            window.localStorage.setItem(
                `genesisfc-mvp:${MATCH_SLUG}`,
                selected
            );

            setMvpRanking(
                data.ranking ??
                    []
            );
            setMvpTotal(
                data.total ??
                    0
            );
        } catch (cause) {
            setMvpError(
                cause instanceof
                    Error
                    ? cause.message
                    : "No se pudo registrar tu voto MVP."
            );
        } finally {
            setMvpVoting(false);
        }
    }

    /* =====================================================
       REACCIONES DE LA AFICIÓN
    ===================================================== */

    const cargarReacciones =
        useCallback(
            async (
                silencioso =
                    false
            ) => {
                try {
                    if (
                        !silencioso
                    ) {
                        setReactionLoading(
                            true
                        );
                    }

                    const response =
                        await fetch(
                            `/api/reactions?match_slug=${encodeURIComponent(
                                MATCH_SLUG
                            )}`,
                            {
                                cache:
                                    "no-store",
                            }
                        );

                    const data =
                        (await response.json()) as ReactionApiResponse;

                    if (
                        !response.ok ||
                        !data.ok
                    ) {
                        throw new Error(
                            data.error ||
                                "No se pudieron cargar las reacciones."
                        );
                    }

                    setReactionSummary({
                        fire:
                            data.fire ??
                            0,
                        heart:
                            data.heart ??
                            0,
                        goal:
                            data.goal ??
                            0,
                        clap:
                            data.clap ??
                            0,
                        total:
                            data.total ??
                            0,
                    });

                    setReactionError(
                        ""
                    );
                } catch (
                    cause
                ) {
                    if (
                        !silencioso
                    ) {
                        setReactionError(
                            cause instanceof
                                Error
                                ? cause.message
                                : "No se pudieron cargar las reacciones."
                        );
                    }
                } finally {
                    if (
                        !silencioso
                    ) {
                        setReactionLoading(
                            false
                        );
                    }
                }
            },
            []
        );

    useEffect(() => {
        cargarReacciones();

        const poll =
            window.setInterval(
                () => {
                    cargarReacciones(
                        true
                    );
                },
                5000
            );

        return () =>
            window.clearInterval(
                poll
            );
    }, [
        cargarReacciones,
    ]);

    async function enviarReaccion(
        reaction: ReactionChoice
    ) {
        if (reactionSending) {
            return;
        }

        setReactionSending(
            reaction
        );
        setReactionError("");
        setLastReaction(
            reaction
        );

        try {
            const voterHash =
                await obtenerVoterHash(
                    MATCH_SLUG
                );

            const response =
                await fetch(
                    "/api/reactions",
                    {
                        method:
                            "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify(
                            {
                                match_slug:
                                    MATCH_SLUG,
                                reaction,
                                voter_hash:
                                    voterHash,
                            }
                        ),
                    }
                );

            const data =
                (await response.json()) as ReactionApiResponse;

            if (
                !response.ok ||
                !data.ok
            ) {
                if (
                    data.fire !==
                        undefined ||
                    data.total !==
                        undefined
                ) {
                    setReactionSummary({
                        fire:
                            data.fire ??
                            0,
                        heart:
                            data.heart ??
                            0,
                        goal:
                            data.goal ??
                            0,
                        clap:
                            data.clap ??
                            0,
                        total:
                            data.total ??
                            0,
                    });
                }

                throw new Error(
                    data.error ||
                        "No se pudo registrar la reacción."
                );
            }

            setReactionSummary({
                fire:
                    data.fire ??
                    0,
                heart:
                    data.heart ??
                    0,
                goal:
                    data.goal ??
                    0,
                clap:
                    data.clap ??
                    0,
                total:
                    data.total ??
                    0,
            });

            window.setTimeout(
                () => {
                    setLastReaction(
                        null
                    );
                },
                700
            );
        } catch (
            cause
        ) {
            setReactionError(
                cause instanceof
                    Error
                    ? cause.message
                    : "No se pudo registrar la reacción."
            );
        } finally {
            setReactionSending(
                null
            );
        }
    }

    /* =====================================================
       COMPARTIR PARTIDO
    ===================================================== */

    const shareText =
        useMemo(() => {
            if (!match) {
                return "Génesis FC vs Olancho FC · Match Center oficial de Génesis FC";
            }

            if (
                match.status ===
                "finished"
            ) {
                return `${match.home_team} ${match.home_score}-${match.away_score} ${match.away_team} · Final · Match Center oficial de Génesis FC`;
            }

            if (
                match.status !==
                "pre_match"
            ) {
                return `${match.home_team} ${match.home_score}-${match.away_score} ${match.away_team} · ${statusLabel(
                    match.status
                )} · Sigue el partido en el Match Center oficial de Génesis FC`;
            }

            return `${match.home_team} vs ${match.away_team} · Sábado 19 de septiembre · 3:00 PM · Sigue la previa y el partido en el Match Center oficial de Génesis FC`;
        }, [
            match,
        ]);

    function abrirCompartir(
        url: string
    ) {
        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    }

    async function compartirNativo() {
        try {
            if (
                typeof navigator.share ===
                "function"
            ) {
                await navigator.share({
                    title:
                        "Génesis FC vs Olancho FC",
                    text: shareText,
                    url: PUBLIC_MATCH_URL,
                });

                return;
            }

            await copiarEnlace();
        } catch (
            cause
        ) {
            if (
                cause instanceof
                    DOMException &&
                cause.name ===
                    "AbortError"
            ) {
                return;
            }

            console.error(
                "No se pudo compartir el partido.",
                cause
            );
        }
    }

    async function copiarEnlace() {
        try {
            await navigator.clipboard.writeText(
                PUBLIC_MATCH_URL
            );

            setLinkCopied(
                true
            );

            window.setTimeout(
                () => {
                    setLinkCopied(
                        false
                    );
                },
                2200
            );
        } catch (
            cause
        ) {
            console.error(
                "No se pudo copiar el enlace.",
                cause
            );
        }
    }

    /* =====================================================
       LOADING
    ===================================================== */

    if (
        loading &&
        !match
    ) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#020817] text-white">
                <div className="text-center">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-300">
                        Génesis FC
                    </p>

                    <h1 className="mt-4 text-2xl font-black uppercase">
                        Match Center
                    </h1>

                    <p className="mt-4 text-xs uppercase tracking-[0.15em] text-white/30">
                        Conectando con Live Ops...
                    </p>
                </div>
            </main>
        );
    }

    if (!match) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#020817] px-6 text-white">
                <div className="max-w-lg text-center">
                    <p className="text-[8px] font-black uppercase tracking-[0.28em] text-cyan-300">
                        Génesis Match Center
                    </p>

                    <h1 className="mt-5 text-4xl font-black uppercase">
                        Partido no disponible
                    </h1>

                    <p className="mt-4 text-sm text-white/40">
                        {error}
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f3f3f1] text-[#06142d]">
            {/* =================================================
                HEADER
            ================================================= */}

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
                                quality={
                                    100
                                }
                                sizes="56px"
                                className="object-contain"
                            />
                        </div>

                        <div>
                            <p className="text-sm font-black uppercase sm:text-lg">
                                Génesis FC
                            </p>

                            <p className="mt-1 text-[6px] font-black uppercase tracking-[0.25em] text-cyan-300">
                                Match Center
                            </p>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div
                            className={`hidden items-center gap-2 rounded-full border px-4 py-3 sm:flex ${statusStyles(
                                match.status
                            )}`}
                        >
                            {live && (
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                            )}

                            <span className="text-[7px] font-black uppercase tracking-[0.18em]">
                                {statusLabel(
                                    match.status
                                )}

                                {live
                                    ? ` · ${minutoVisual}`
                                    : ""}
                            </span>
                        </div>

                        <Link
                            href="/calendario"
                            className="rounded-full border border-white/15 px-4 py-3 text-[7px] font-black uppercase tracking-[0.15em] transition hover:bg-white hover:text-[#06142d] sm:px-6 sm:text-[8px]"
                        >
                            ← Calendario
                        </Link>
                    </div>
                </div>
            </header>

            {/* =================================================
                HERO
            ================================================= */}

            <section className="relative overflow-hidden bg-[#020817] px-4 pb-16 pt-[118px] text-white sm:px-8 sm:pb-24 sm:pt-[150px] lg:px-12">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(20,125,213,0.30),transparent_43%)]" />

                <div className="relative mx-auto max-w-[1400px]">
                    <div className="text-center">
                        <div
                            className={`inline-flex items-center gap-3 rounded-full border px-5 py-3 ${statusStyles(
                                match.status
                            )}`}
                        >
                            {live ? (
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                            ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                            )}

                            <p className="text-[7px] font-black uppercase tracking-[0.22em]">
                                {statusLabel(
                                    match.status
                                )}
                            </p>

                            <span className="opacity-30">
                                ·
                            </span>

                            <p className="text-[7px] font-black uppercase tracking-[0.22em] opacity-70">
                                {
                                    match.competition
                                }{" "}
                                · Jornada{" "}
                                {
                                    match.matchday
                                }
                            </p>
                        </div>

                        <p className="mt-5 text-[8px] font-black uppercase tracking-[0.22em] text-cyan-300">
                            Sábado 19 de septiembre · 3:00 PM
                        </p>
                    </div>

                    <div className="mx-auto mt-12 grid max-w-[1100px] grid-cols-[1fr_110px_1fr] items-center gap-2 sm:grid-cols-[1fr_260px_1fr]">
                        <div className="flex min-w-0 flex-col items-center">
                            <Logo
                                src={
                                    match.home_logo ||
                                    "/genesis.jpg"
                                }
                                alt={
                                    match.home_team
                                }
                                large
                            />

                            <h1 className="mt-5 text-center text-xl font-black uppercase tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                                {
                                    match.home_team
                                }
                            </h1>

                            <p className="mt-2 text-[6px] font-black uppercase tracking-[0.2em] text-cyan-300">
                                Local
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            {enPartido ? (
                                <>
                                    <div className="flex items-center gap-3 sm:gap-6">
                                        <span className="text-5xl font-black tabular-nums tracking-[-0.07em] sm:text-8xl">
                                            {
                                                match.home_score
                                            }
                                        </span>

                                        <span className="text-xl font-black text-white/20 sm:text-4xl">
                                            —
                                        </span>

                                        <span className="text-5xl font-black tabular-nums tracking-[-0.07em] text-cyan-300 sm:text-8xl">
                                            {
                                                match.away_score
                                            }
                                        </span>
                                    </div>

                                    <div className="mt-6 min-w-[170px] rounded-[20px] border border-white/10 bg-white/[0.045] px-6 py-4 text-center">
                                        <p className="text-4xl font-black tabular-nums tracking-[-0.05em] text-cyan-300 sm:text-5xl">
                                            {match.status ===
                                            "halftime"
                                                ? "HT"
                                                : match.status ===
                                                    "finished"
                                                  ? "FT"
                                                  : minutoVisual}
                                        </p>

                                        <p className="mt-3 font-mono text-[10px] font-black tabular-nums text-white/35">
                                            {
                                                reloj
                                            }
                                        </p>

                                        <p className="mt-2 text-[6px] font-black uppercase tracking-[0.2em] text-white/25">
                                            {match.status ===
                                            "finished"
                                                ? "Partido finalizado"
                                                : match.status ===
                                                    "halftime"
                                                  ? "Descanso"
                                                  : match.status ===
                                                      "paused"
                                                    ? "Reloj pausado"
                                                    : "Tiempo de juego"}
                                        </p>
                                    </div>

                                    {mostrarAvisoAgregado && (
                                        <div className="mt-3 rounded-full border border-amber-300/25 bg-amber-300/[0.09] px-4 py-2.5">
                                            <p className="text-[6px] font-black uppercase tracking-[0.15em] text-amber-200 sm:text-[7px]">
                                                +
                                                {
                                                    tiempoAnadidoActual
                                                }{" "}
                                                min de tiempo añadido
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <span className="text-3xl font-black italic tracking-[-0.08em] text-white/20 sm:text-6xl">
                                        VS
                                    </span>

                                    <div className="mt-4 h-12 w-px bg-gradient-to-b from-cyan-300/60 to-transparent" />
                                </>
                            )}
                        </div>

                        <div className="flex min-w-0 flex-col items-center">
                            <Logo
                                src={
                                    match.away_logo ||
                                    "/olancho.png"
                                }
                                alt={
                                    match.away_team
                                }
                                large
                            />

                            <h2 className="mt-5 text-center text-xl font-black uppercase tracking-[-0.04em] text-cyan-300 sm:text-4xl lg:text-5xl">
                                {
                                    match.away_team
                                }
                            </h2>

                            <p className="mt-2 text-[6px] font-black uppercase tracking-[0.2em] text-white/30">
                                Visitante
                            </p>
                        </div>
                    </div>

                    {match.status ===
                        "pre_match" && (
                        <div className="mx-auto mt-14 max-w-[720px] border-t border-white/10 pt-9">
                            <p className="text-center text-[7px] font-black uppercase tracking-[0.28em] text-white/30">
                                Cuenta regresiva para el partido
                            </p>

                            <div className="mt-7 grid grid-cols-4 gap-2 sm:gap-4">
                                {[
                                    [
                                        "Días",
                                        countdown.dias,
                                    ],
                                    [
                                        "Horas",
                                        countdown.horas,
                                    ],
                                    [
                                        "Min",
                                        countdown.minutos,
                                    ],
                                    [
                                        "Seg",
                                        countdown.segundos,
                                    ],
                                ].map(
                                    ([
                                        label,
                                        value,
                                    ]) => (
                                        <div
                                            key={String(
                                                label
                                            )}
                                            className="rounded-[18px] border border-white/10 bg-white/[0.045] px-2 py-5 text-center sm:rounded-[22px] sm:py-7"
                                        >
                                            <p className="text-2xl font-black tabular-nums tracking-[-0.05em] sm:text-4xl">
                                                {dos(
                                                    Number(
                                                        value
                                                    )
                                                )}
                                            </p>

                                            <p className="mt-2 text-[5px] font-black uppercase tracking-[0.18em] text-white/25">
                                                {
                                                    label
                                                }
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* =================================================
                DATOS
            ================================================= */}

            <section className="relative z-10 px-4 sm:px-8 lg:px-12">
                <div className="mx-auto grid max-w-[1200px] grid-cols-2 overflow-hidden rounded-[24px] border border-black/[0.06] bg-white shadow-[0_25px_80px_rgba(6,20,45,0.10)] sm:grid-cols-4">
                    {[
                        [
                            "Fecha",
                            "19 SEP 2026",
                        ],
                        [
                            "Hora",
                            "3:00 PM",
                        ],
                        [
                            "Estadio",
                            match.stadium ||
                                "Roberto Suazo Córdova",
                        ],
                        [
                            "Ciudad",
                            match.city ||
                                "La Paz, Honduras",
                        ],
                    ].map(
                        (
                            [
                                title,
                                value,
                            ],
                            index
                        ) => (
                            <div
                                key={
                                    title
                                }
                                className={`px-4 py-6 text-center sm:px-6 sm:py-8 ${
                                    index !==
                                    0
                                        ? "border-l border-black/[0.06]"
                                        : ""
                                } ${
                                    index >=
                                    2
                                        ? "border-t border-black/[0.06] sm:border-t-0"
                                        : ""
                                }`}
                            >
                                <p className="text-[6px] font-black uppercase tracking-[0.2em] text-[#168cab]">
                                    {
                                        title
                                    }
                                </p>

                                <p className="mt-2 text-[10px] font-black uppercase sm:text-xs">
                                    {
                                        value
                                    }
                                </p>
                            </div>
                        )
                    )}
                </div>
            </section>

            {/* =================================================
                PRONÓSTICO
            ================================================= */}

            <section className="px-4 pt-16 sm:px-8 sm:pt-24 lg:px-12">
                <div className="mx-auto max-w-[1200px]">
                    <div className="overflow-hidden rounded-[30px] border border-black/[0.06] bg-white shadow-[0_24px_80px_rgba(6,20,45,0.07)]">
                        <div className="bg-[#06142d] px-5 py-8 text-white sm:px-8 sm:py-10">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="h-px w-8 bg-cyan-300" />

                                        <p className="text-[7px] font-black uppercase tracking-[0.27em] text-cyan-300">
                                            La afición opina
                                        </p>
                                    </div>

                                    <h2 className="mt-4 text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
                                        Pronóstico
                                        <span className="text-cyan-300">
                                            .
                                        </span>
                                    </h2>

                                    <p className="mt-4 max-w-[600px] text-xs leading-6 text-white/45">
                                        {match.status ===
                                        "pre_match"
                                            ? "¿Cómo crees que terminará Génesis FC vs Olancho FC? Elige una opción antes del inicio."
                                            : "La votación cerró cuando comenzó el partido. Estos fueron los pronósticos de la afición."}
                                    </p>
                                </div>

                                <div className="w-fit rounded-full border border-white/10 bg-white/[0.05] px-5 py-3">
                                    <p className="text-[7px] font-black uppercase tracking-[0.18em] text-white/45">
                                        {predictionSummary.total}{" "}
                                        {predictionSummary.total ===
                                        1
                                            ? "voto"
                                            : "votos"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 sm:p-8">
                            {predictionLoading ? (
                                <div className="flex min-h-[180px] items-center justify-center text-center">
                                    <div>
                                        <span className="mx-auto block h-2 w-2 animate-pulse rounded-full bg-[#168cab]" />

                                        <p className="mt-4 text-[7px] font-black uppercase tracking-[0.18em] text-black/30">
                                            Cargando pronóstico...
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        {[
                                            {
                                                value:
                                                    "home" as PredictionChoice,
                                                label:
                                                    "Gana Génesis",
                                                team:
                                                    match.home_team,
                                                logo:
                                                    match.home_logo ||
                                                    "/genesis.jpg",
                                                percentage:
                                                    predictionSummary
                                                        .percentages
                                                        .home,
                                            },
                                            {
                                                value:
                                                    "draw" as PredictionChoice,
                                                label:
                                                    "Empate",
                                                team:
                                                    "Empate",
                                                logo:
                                                    null,
                                                percentage:
                                                    predictionSummary
                                                        .percentages
                                                        .draw,
                                            },
                                            {
                                                value:
                                                    "away" as PredictionChoice,
                                                label:
                                                    "Gana Olancho",
                                                team:
                                                    match.away_team,
                                                logo:
                                                    match.away_logo ||
                                                    "/olancho.png",
                                                percentage:
                                                    predictionSummary
                                                        .percentages
                                                        .away,
                                            },
                                        ].map(
                                            (
                                                option
                                            ) => {
                                                const selected =
                                                    myPrediction ===
                                                    option.value;

                                                const showResults =
                                                    Boolean(
                                                        myPrediction
                                                    ) ||
                                                    match.status !==
                                                        "pre_match";

                                                return (
                                                    <button
                                                        key={
                                                            option.value
                                                        }
                                                        type="button"
                                                        disabled={
                                                            predictionVoting ||
                                                            match.status !==
                                                                "pre_match"
                                                        }
                                                        onClick={() =>
                                                            votarPronostico(
                                                                option.value
                                                            )
                                                        }
                                                        className={`relative overflow-hidden rounded-[22px] border px-5 py-6 text-center transition ${
                                                            selected
                                                                ? "border-[#168cab] bg-[#eaf7fb] shadow-[0_14px_40px_rgba(22,140,171,0.12)]"
                                                                : "border-black/[0.07] bg-[#f7f7f5] hover:border-[#168cab]/30 hover:bg-[#f0f8fa]"
                                                        } ${
                                                            match.status !==
                                                                "pre_match"
                                                                ? "cursor-default"
                                                                : "cursor-pointer"
                                                        } disabled:opacity-80`}
                                                    >
                                                        {selected && (
                                                            <div className="absolute right-3 top-3 rounded-full bg-[#168cab] px-3 py-1.5">
                                                                <p className="text-[5px] font-black uppercase tracking-[0.14em] text-white">
                                                                    Tu voto
                                                                </p>
                                                            </div>
                                                        )}

                                                        {option.logo ? (
                                                            <div className="relative mx-auto h-14 w-14">
                                                                <Image
                                                                    src={
                                                                        option.logo
                                                                    }
                                                                    alt={
                                                                        option.team
                                                                    }
                                                                    fill
                                                                    quality={
                                                                        100
                                                                    }
                                                                    sizes="56px"
                                                                    className="object-contain"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#06142d] text-sm font-black text-white">
                                                                X
                                                            </div>
                                                        )}

                                                        <p className="mt-4 text-[7px] font-black uppercase tracking-[0.16em] text-[#168cab]">
                                                            {
                                                                option.label
                                                            }
                                                        </p>

                                                        <p className="mt-2 text-lg font-black uppercase">
                                                            {
                                                                option.team
                                                            }
                                                        </p>

                                                        {showResults && (
                                                            <>
                                                                <p className="mt-5 text-4xl font-black tabular-nums tracking-[-0.06em]">
                                                                    {
                                                                        option.percentage
                                                                    }
                                                                    %
                                                                </p>

                                                                <div className="mx-auto mt-4 h-1.5 max-w-[210px] overflow-hidden rounded-full bg-black/[0.06]">
                                                                    <div
                                                                        className="h-full rounded-full bg-[#168cab] transition-all duration-500"
                                                                        style={{
                                                                            width: `${option.percentage}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>

                                    {predictionError && (
                                        <div className="mt-5 rounded-[16px] border border-red-500/15 bg-red-500/[0.05] px-4 py-4 text-center">
                                            <p className="text-[8px] font-bold leading-5 text-red-600">
                                                {
                                                    predictionError
                                                }
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-6 text-center">
                                        <p className="text-[7px] font-black uppercase tracking-[0.14em] text-black/25">
                                            {match.status ===
                                            "pre_match"
                                                ? myPrediction
                                                    ? "Tu pronóstico quedó registrado."
                                                    : "Un voto por dispositivo · La votación cierra al iniciar el partido."
                                                : "Pronóstico cerrado"}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================
                COMPARTIR PARTIDO
            ================================================= */}

            <section className="px-4 pt-8 sm:px-8 sm:pt-10 lg:px-12">
                <div className="mx-auto max-w-[1200px]">
                    <div className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_65px_rgba(6,20,45,0.05)]">
                        <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]">
                            <div className="bg-[#071a3b] px-5 py-7 text-white sm:px-8 sm:py-8">
                                <div className="flex items-center gap-3">
                                    <span className="h-px w-8 bg-cyan-300" />

                                    <p className="text-[7px] font-black uppercase tracking-[0.25em] text-cyan-300">
                                        Comparte el Match Center
                                    </p>
                                </div>

                                <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] sm:text-4xl">
                                    Vive Génesis
                                    <span className="text-cyan-300">
                                        .
                                    </span>
                                </h2>

                                <p className="mt-4 max-w-[430px] text-xs leading-6 text-white/45">
                                    Envía el partido a otros aficionados y síganlo juntos desde el Match Center oficial.
                                </p>
                            </div>

                            <div className="p-5 sm:p-8">
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                                    <button
                                        type="button"
                                        onClick={
                                            compartirNativo
                                        }
                                        className="col-span-2 flex min-h-[92px] flex-col items-center justify-center rounded-[20px] bg-[#06142d] px-4 py-4 text-center text-white transition hover:bg-[#0b234d] sm:col-span-1"
                                    >
                                        <span className="text-xl">
                                            ↗
                                        </span>

                                        <span className="mt-2 text-[7px] font-black uppercase tracking-[0.14em]">
                                            Compartir
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            abrirCompartir(
                                                `https://wa.me/?text=${encodeURIComponent(
                                                    `${shareText} ${PUBLIC_MATCH_URL}`
                                                )}`
                                            )
                                        }
                                        className="flex min-h-[92px] flex-col items-center justify-center rounded-[20px] border border-black/[0.07] bg-[#f7f7f5] px-4 py-4 text-center transition hover:border-[#168cab]/30 hover:bg-[#eef8fa]"
                                    >
                                        <span className="text-base font-black text-emerald-600">
                                            WA
                                        </span>

                                        <span className="mt-2 text-[7px] font-black uppercase tracking-[0.14em]">
                                            WhatsApp
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            abrirCompartir(
                                                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                                    PUBLIC_MATCH_URL
                                                )}`
                                            )
                                        }
                                        className="flex min-h-[92px] flex-col items-center justify-center rounded-[20px] border border-black/[0.07] bg-[#f7f7f5] px-4 py-4 text-center transition hover:border-[#168cab]/30 hover:bg-[#eef8fa]"
                                    >
                                        <span className="text-base font-black text-[#1877f2]">
                                            f
                                        </span>

                                        <span className="mt-2 text-[7px] font-black uppercase tracking-[0.14em]">
                                            Facebook
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            abrirCompartir(
                                                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                                    shareText
                                                )}&url=${encodeURIComponent(
                                                    PUBLIC_MATCH_URL
                                                )}`
                                            )
                                        }
                                        className="flex min-h-[92px] flex-col items-center justify-center rounded-[20px] border border-black/[0.07] bg-[#f7f7f5] px-4 py-4 text-center transition hover:border-[#168cab]/30 hover:bg-[#eef8fa]"
                                    >
                                        <span className="text-base font-black">
                                            X
                                        </span>

                                        <span className="mt-2 text-[7px] font-black uppercase tracking-[0.14em]">
                                            X
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            copiarEnlace
                                        }
                                        className={`flex min-h-[92px] flex-col items-center justify-center rounded-[20px] border px-4 py-4 text-center transition ${
                                            linkCopied
                                                ? "border-emerald-500/25 bg-emerald-500/[0.07]"
                                                : "border-black/[0.07] bg-[#f7f7f5] hover:border-[#168cab]/30 hover:bg-[#eef8fa]"
                                        }`}
                                    >
                                        <span className="text-base font-black text-[#168cab]">
                                            {linkCopied
                                                ? "✓"
                                                : "⌁"}
                                        </span>

                                        <span className="mt-2 text-[7px] font-black uppercase tracking-[0.14em]">
                                            {linkCopied
                                                ? "Copiado"
                                                : "Copiar enlace"}
                                        </span>
                                    </button>
                                </div>

                                <p className="mt-5 text-center text-[6px] font-black uppercase tracking-[0.14em] text-black/25 sm:text-left">
                                    genesisfc.app · Match Center oficial
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================
                REACCIONES DE LA AFICIÓN
            ================================================= */}

            <section className="px-4 pt-8 sm:px-8 sm:pt-10 lg:px-12">
                <div className="mx-auto max-w-[1200px]">
                    <div className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_65px_rgba(6,20,45,0.05)]">
                        <div className="flex flex-col gap-5 border-b border-black/[0.06] bg-[#06142d] px-5 py-7 text-white sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-8">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="h-px w-8 bg-cyan-300" />

                                    <p className="text-[7px] font-black uppercase tracking-[0.25em] text-cyan-300">
                                        Fan Zone
                                    </p>
                                </div>

                                <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] sm:text-4xl">
                                    Reacciona
                                    <span className="text-cyan-300">
                                        .
                                    </span>
                                </h2>

                                <p className="mt-4 max-w-[520px] text-xs leading-6 text-white/45">
                                    Apoya a Génesis durante la previa y el partido. Puedes reaccionar varias veces; protegemos el sistema contra spam excesivo.
                                </p>
                            </div>

                            <div className="w-fit rounded-full border border-white/10 bg-white/[0.05] px-5 py-3">
                                <p className="text-[7px] font-black uppercase tracking-[0.18em] text-white/45">
                                    {reactionSummary.total}{" "}
                                    {reactionSummary.total ===
                                    1
                                        ? "reacción"
                                        : "reacciones"}
                                </p>
                            </div>
                        </div>

                        <div className="p-5 sm:p-8">
                            {reactionLoading ? (
                                <div className="flex min-h-[150px] items-center justify-center text-center">
                                    <div>
                                        <span className="mx-auto block h-2 w-2 animate-pulse rounded-full bg-[#168cab]" />

                                        <p className="mt-4 text-[7px] font-black uppercase tracking-[0.18em] text-black/30">
                                            Cargando reacciones...
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        {[
                                            {
                                                value:
                                                    "fire" as ReactionChoice,
                                                emoji:
                                                    "🔥",
                                                label:
                                                    "Fuego",
                                                count:
                                                    reactionSummary.fire,
                                            },
                                            {
                                                value:
                                                    "heart" as ReactionChoice,
                                                emoji:
                                                    "💚",
                                                label:
                                                    "Génesis",
                                                count:
                                                    reactionSummary.heart,
                                            },
                                            {
                                                value:
                                                    "goal" as ReactionChoice,
                                                emoji:
                                                    "⚽",
                                                label:
                                                    "Gol",
                                                count:
                                                    reactionSummary.goal,
                                            },
                                            {
                                                value:
                                                    "clap" as ReactionChoice,
                                                emoji:
                                                    "🙌",
                                                label:
                                                    "Vamos",
                                                count:
                                                    reactionSummary.clap,
                                            },
                                        ].map(
                                            (
                                                item
                                            ) => {
                                                const active =
                                                    lastReaction ===
                                                    item.value;

                                                const sending =
                                                    reactionSending ===
                                                    item.value;

                                                return (
                                                    <button
                                                        key={
                                                            item.value
                                                        }
                                                        type="button"
                                                        disabled={
                                                            reactionSending !==
                                                            null
                                                        }
                                                        onClick={() =>
                                                            enviarReaccion(
                                                                item.value
                                                            )
                                                        }
                                                        className={`group relative min-h-[132px] overflow-hidden rounded-[22px] border px-4 py-5 text-center transition active:scale-[0.97] ${
                                                            active
                                                                ? "border-[#168cab] bg-[#e9f7fb] shadow-[0_14px_38px_rgba(22,140,171,0.12)]"
                                                                : "border-black/[0.07] bg-[#f7f7f5] hover:border-[#168cab]/30 hover:bg-[#eef8fa]"
                                                        } disabled:cursor-wait disabled:opacity-75`}
                                                    >
                                                        <span
                                                            className={`block text-4xl transition duration-200 ${
                                                                active
                                                                    ? "scale-125"
                                                                    : "group-hover:scale-110"
                                                            }`}
                                                        >
                                                            {
                                                                item.emoji
                                                            }
                                                        </span>

                                                        <p className="mt-3 text-[7px] font-black uppercase tracking-[0.16em] text-[#168cab]">
                                                            {
                                                                item.label
                                                            }
                                                        </p>

                                                        <p className="mt-2 text-xl font-black tabular-nums">
                                                            {sending
                                                                ? "·"
                                                                : item.count}
                                                        </p>
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>

                                    {reactionError && (
                                        <div className="mt-5 rounded-[16px] border border-amber-500/20 bg-amber-500/[0.06] px-4 py-4 text-center">
                                            <p className="text-[8px] font-bold leading-5 text-amber-700">
                                                {
                                                    reactionError
                                                }
                                            </p>
                                        </div>
                                    )}

                                    <p className="mt-5 text-center text-[6px] font-black uppercase tracking-[0.14em] text-black/25">
                                        Máximo 5 reacciones cada 10 segundos por dispositivo
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================
                MVP DE LA AFICIÓN
            ================================================= */}

            <section className="px-4 pt-8 sm:px-8 sm:pt-10 lg:px-12">
                <div className="mx-auto max-w-[1200px]">
                    <div className="overflow-hidden rounded-[30px] border border-black/[0.06] bg-white shadow-[0_24px_80px_rgba(6,20,45,0.06)]">
                        <div className="bg-[#06142d] px-5 py-8 text-white sm:px-8 sm:py-10">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="h-px w-8 bg-cyan-300" />

                                        <p className="text-[7px] font-black uppercase tracking-[0.27em] text-cyan-300">
                                            La afición decide
                                        </p>
                                    </div>

                                    <h2 className="mt-4 text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
                                        MVP del partido
                                        <span className="text-cyan-300">
                                            .
                                        </span>
                                    </h2>

                                    <p className="mt-4 max-w-[620px] text-xs leading-6 text-white/45">
                                        {match.status ===
                                        "finished"
                                            ? "Elige al jugador más destacado del partido. Cada dispositivo puede registrar un solo voto."
                                            : "La votación abrirá automáticamente cuando finalice el partido."}
                                    </p>
                                </div>

                                <div className="w-fit rounded-full border border-white/10 bg-white/[0.05] px-5 py-3">
                                    <p className="text-[7px] font-black uppercase tracking-[0.18em] text-white/45">
                                        {match.status ===
                                        "finished"
                                            ? `${mvpTotal} ${
                                                  mvpTotal ===
                                                  1
                                                      ? "voto"
                                                      : "votos"
                                              }`
                                            : "Disponible al FT"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {match.status !==
                        "finished" ? (
                            <div className="flex min-h-[220px] items-center justify-center px-6 py-12 text-center">
                                <div className="max-w-[430px]">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#168cab]/20 bg-[#168cab]/5 text-2xl">
                                        ⭐
                                    </div>

                                    <h3 className="mt-5 text-xl font-black uppercase">
                                        Votación bloqueada
                                    </h3>

                                    <p className="mt-3 text-xs leading-6 text-black/40">
                                        Cuando Live Ops marque el encuentro como finalizado, podrás votar por el MVP de la afición.
                                    </p>
                                </div>
                            </div>
                        ) : mvpLoading ? (
                            <div className="flex min-h-[220px] items-center justify-center text-center">
                                <div>
                                    <span className="mx-auto block h-2 w-2 animate-pulse rounded-full bg-[#168cab]" />

                                    <p className="mt-4 text-[7px] font-black uppercase tracking-[0.18em] text-black/30">
                                        Cargando votación MVP...
                                    </p>
                                </div>
                            </div>
                        ) : mvpCandidates.length ===
                          0 ? (
                            <div className="flex min-h-[220px] items-center justify-center px-6 py-12 text-center">
                                <div className="max-w-[430px]">
                                    <h3 className="text-xl font-black uppercase">
                                        Jugadores no disponibles
                                    </h3>

                                    <p className="mt-3 text-xs leading-6 text-black/40">
                                        La votación se habilitará cuando los jugadores del partido estén disponibles en Live Ops.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-5 sm:p-8">
                                {mvpLeader &&
                                    mvpTotal >
                                        0 && (
                                        <div className="mb-7 rounded-[24px] border border-amber-400/20 bg-amber-300/[0.08] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
                                            <div>
                                                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-amber-700">
                                                    Liderando la votación
                                                </p>

                                                <h3 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em]">
                                                    ⭐ {mvpLeader.player.player_name}
                                                </h3>

                                                <p className="mt-2 text-[8px] font-black uppercase tracking-[0.14em] text-black/35">
                                                    {mvpLeader.player.team}
                                                </p>
                                            </div>

                                            <div className="mt-4 w-fit rounded-full bg-[#06142d] px-5 py-3 text-white sm:mt-0">
                                                <p className="text-[8px] font-black uppercase tracking-[0.14em]">
                                                    {mvpLeader.votes} {
                                                        mvpLeader.votes ===
                                                        1
                                                            ? "voto"
                                                            : "votos"
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                <div className="grid gap-6 lg:grid-cols-2">
                                    {[
                                        {
                                            team:
                                                match.home_team,
                                            players:
                                                mvpCandidates.filter(
                                                    (player) =>
                                                        player.team ===
                                                        match.home_team
                                                ),
                                            logo:
                                                match.home_logo ||
                                                "/genesis.jpg",
                                        },
                                        {
                                            team:
                                                match.away_team,
                                            players:
                                                mvpCandidates.filter(
                                                    (player) =>
                                                        player.team ===
                                                        match.away_team
                                                ),
                                            logo:
                                                match.away_logo ||
                                                "/olancho.png",
                                        },
                                    ].map(
                                        (group) => (
                                            <div
                                                key={
                                                    group.team
                                                }
                                                className="overflow-hidden rounded-[24px] border border-black/[0.07] bg-[#f8f8f6]"
                                            >
                                                <div className="flex items-center gap-3 border-b border-black/[0.06] px-5 py-4">
                                                    <div className="relative h-10 w-10 shrink-0">
                                                        <Image
                                                            src={
                                                                group.logo
                                                            }
                                                            alt={
                                                                group.team
                                                            }
                                                            fill
                                                            quality={
                                                                100
                                                            }
                                                            sizes="40px"
                                                            className="object-contain"
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="text-[6px] font-black uppercase tracking-[0.18em] text-[#168cab]">
                                                            Candidatos
                                                        </p>

                                                        <h3 className="mt-1 text-sm font-black uppercase">
                                                            {
                                                                group.team
                                                            }
                                                        </h3>
                                                    </div>
                                                </div>

                                                <div className="divide-y divide-black/[0.05]">
                                                    {group.players.map(
                                                        (player) => {
                                                            const selected =
                                                                myMvp ===
                                                                player.id;
                                                            const rankingItem =
                                                                mvpRanking.find(
                                                                    (item) =>
                                                                        item.player_id ===
                                                                        player.id
                                                                );
                                                            const votes =
                                                                rankingItem?.votes ??
                                                                0;
                                                            const percentage =
                                                                mvpTotal >
                                                                0
                                                                    ? Math.round(
                                                                          (votes /
                                                                              mvpTotal) *
                                                                              100
                                                                      )
                                                                    : 0;

                                                            return (
                                                                <button
                                                                    key={
                                                                        player.id
                                                                    }
                                                                    type="button"
                                                                    disabled={
                                                                        mvpVoting ||
                                                                        Boolean(
                                                                            myMvp
                                                                        )
                                                                    }
                                                                    onClick={() =>
                                                                        votarMvp(
                                                                            player.id
                                                                        )
                                                                    }
                                                                    className={`w-full px-4 py-4 text-left transition ${
                                                                        selected
                                                                            ? "bg-[#eaf7fb]"
                                                                            : myMvp
                                                                              ? "cursor-default"
                                                                              : "hover:bg-white"
                                                                    } disabled:opacity-100`}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[8px] font-black ${
                                                                            selected
                                                                                ? "bg-[#168cab] text-white"
                                                                                : "bg-[#06142d] text-white"
                                                                        }`}>
                                                                            {player.shirt_number ??
                                                                                "—"}
                                                                        </div>

                                                                        <div className="min-w-0 flex-1">
                                                                            <div className="flex items-center gap-2">
                                                                                <p className="truncate text-[10px] font-black uppercase">
                                                                                    {
                                                                                        player.player_name
                                                                                    }
                                                                                </p>

                                                                                {selected && (
                                                                                    <span className="rounded-full bg-[#168cab] px-2 py-1 text-[5px] font-black uppercase tracking-[0.1em] text-white">
                                                                                        Tu voto
                                                                                    </span>
                                                                                )}
                                                                            </div>

                                                                            <p className="mt-1 text-[6px] font-black uppercase tracking-[0.13em] text-black/30">
                                                                                {player.position ||
                                                                                    (player.is_starter
                                                                                        ? "Titular"
                                                                                        : "Suplente")}
                                                                            </p>
                                                                        </div>

                                                                        {myMvp && (
                                                                            <div className="shrink-0 text-right">
                                                                                <p className="text-sm font-black tabular-nums">
                                                                                    {
                                                                                        percentage
                                                                                    }
                                                                                    %
                                                                                </p>

                                                                                <p className="mt-1 text-[5px] font-black uppercase text-black/25">
                                                                                    {votes} {
                                                                                        votes ===
                                                                                        1
                                                                                            ? "voto"
                                                                                            : "votos"
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>

                                {mvpError && (
                                    <div className="mt-5 rounded-[16px] border border-red-500/15 bg-red-500/[0.05] px-4 py-4 text-center">
                                        <p className="text-[8px] font-bold leading-5 text-red-600">
                                            {
                                                mvpError
                                            }
                                        </p>
                                    </div>
                                )}

                                <p className="mt-6 text-center text-[7px] font-black uppercase tracking-[0.14em] text-black/25">
                                    {myMvp
                                        ? "Tu voto MVP quedó registrado."
                                        : "Selecciona un jugador · Un voto por dispositivo"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* =================================================
                ALINEACIONES
            ================================================= */}

            <section className="px-4 pb-4 pt-16 sm:px-8 sm:pt-24 lg:px-12">
                <div className="mx-auto max-w-[1300px]">
                    <div className="flex flex-col gap-4 border-b border-black/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[7px] font-black uppercase tracking-[0.27em] text-[#168cab]">
                                Matchday Squad
                            </p>

                            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
                                Alineaciones
                                <span className="text-[#168cab]">
                                    .
                                </span>
                            </h2>
                        </div>

                        <div className="max-w-[420px]">
                            <p className="text-xs leading-6 text-black/40">
                                {homeConfirmed &&
                                awayConfirmed
                                    ? "Los once iniciales de ambos equipos están confirmados en Génesis Live Ops."
                                    : "Los planteles ya están disponibles. El XI de cada equipo aparecerá como oficial únicamente cuando estén definidos los 11 titulares."}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-6 xl:grid-cols-2">
                        <TeamSquad
                            team={
                                match.home_team
                            }
                            logo={
                                match.home_logo ||
                                "/genesis.jpg"
                            }
                            players={
                                homeLineup
                            }
                        />

                        <TeamSquad
                            team={
                                match.away_team
                            }
                            logo={
                                match.away_logo ||
                                "/olancho.png"
                            }
                            players={
                                awayLineup
                            }
                        />
                    </div>
                </div>
            </section>

            {/* =================================================
                MATCH CENTER
            ================================================= */}

            <section className="px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
                <div className="mx-auto max-w-[1300px]">
                    <div className="flex flex-col gap-5 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[7px] font-black uppercase tracking-[0.27em] text-[#168cab]">
                                Génesis Live Ops
                            </p>

                            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
                                Partido
                                <span className="text-[#168cab]">
                                    {" "}
                                    Live.
                                </span>
                            </h2>
                        </div>

                        <div className="flex flex-col items-start gap-2 sm:items-end">
                            <div
                                className={`w-fit rounded-full border px-5 py-3 ${statusStyles(
                                    match.status
                                )}`}
                            >
                                <p className="text-[7px] font-black uppercase tracking-[0.2em]">
                                    {statusLabel(
                                        match.status
                                    )}

                                    {live
                                        ? ` · ${minutoVisual}`
                                        : ""}
                                </p>
                            </div>

                            {mostrarAvisoAgregado && (
                                <p className="text-[7px] font-black uppercase tracking-[0.16em] text-amber-600">
                                    +
                                    {
                                        tiempoAnadidoActual
                                    }{" "}
                                    min añadidos
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
                        {/* EVENTOS */}

                        <article className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_18px_60px_rgba(6,20,45,0.05)]">
                            <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] px-6 py-6 sm:px-8">
                                <div>
                                    <p className="text-[7px] font-black uppercase tracking-[0.22em] text-[#168cab]">
                                        Minuto a minuto
                                    </p>

                                    <h3 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em]">
                                        Eventos del partido
                                    </h3>
                                </div>

                                {live && (
                                    <div className="flex items-center gap-2 rounded-full border border-red-500/15 bg-red-500/[0.05] px-3 py-2">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />

                                        <span className="text-[6px] font-black uppercase tracking-[0.15em] text-red-600">
                                            Live ·{" "}
                                            {
                                                minutoVisual
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>

                            {events.length >
                            0 ? (
                                <div className="space-y-3 p-4 sm:p-6">
                                    {events.map(
                                        (
                                            event
                                        ) => {
                                            const style =
                                                eventStyle(
                                                    event.event_type
                                                );

                                            return (
                                                <div
                                                    key={
                                                        event.id
                                                    }
                                                    className={`grid grid-cols-[62px_1fr] gap-4 rounded-[20px] border p-4 sm:grid-cols-[72px_1fr] sm:p-5 ${style.wrapper}`}
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <div
                                                            className={`flex h-11 w-11 items-center justify-center rounded-full border text-[10px] font-black ${style.icon}`}
                                                        >
                                                            {eventIcon(
                                                                event.event_type
                                                            )}
                                                        </div>

                                                        <p className="mt-3 text-sm font-black tabular-nums text-[#168cab]">
                                                            {minutoEvento(
                                                                event.minute,
                                                                event.period
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span
                                                                className={`text-[7px] font-black uppercase tracking-[0.19em] ${style.label}`}
                                                            >
                                                                {eventName(
                                                                    event.event_type
                                                                )}
                                                            </span>

                                                            {event.team && (
                                                                <>
                                                                    <span className="text-black/20">
                                                                        ·
                                                                    </span>

                                                                    <span className="text-[7px] font-black uppercase tracking-[0.16em] text-black/35">
                                                                        {
                                                                            event.team
                                                                        }
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>

                                                        {event.player_name && (
                                                            <p className="mt-3 text-base font-black uppercase">
                                                                {
                                                                    event.player_name
                                                                }
                                                            </p>
                                                        )}

                                                        {event.event_type ===
                                                            "substitution" &&
                                                            event.player_out &&
                                                            event.player_in && (
                                                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                                                    <div className="rounded-[12px] bg-red-500/[0.05] px-3 py-3">
                                                                        <p className="text-[6px] font-black uppercase text-red-500">
                                                                            Sale
                                                                        </p>

                                                                        <p className="mt-1 text-[10px] font-black uppercase">
                                                                            {
                                                                                event.player_out
                                                                            }
                                                                        </p>
                                                                    </div>

                                                                    <div className="rounded-[12px] bg-emerald-500/[0.05] px-3 py-3">
                                                                        <p className="text-[6px] font-black uppercase text-emerald-600">
                                                                            Entra
                                                                        </p>

                                                                        <p className="mt-1 text-[10px] font-black uppercase">
                                                                            {
                                                                                event.player_in
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}

                                                        {event.description && (
                                                            <p className="mt-3 text-xs leading-6 text-black/50">
                                                                {
                                                                    event.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            ) : (
                                <div className="flex min-h-[320px] items-center justify-center px-6 py-12 text-center">
                                    <div className="max-w-[390px]">
                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#168cab]/20 bg-[#168cab]/5 text-xl">
                                            ⚽
                                        </div>

                                        <h4 className="mt-5 text-lg font-black uppercase">
                                            Sin eventos todavía
                                        </h4>

                                        <p className="mt-3 text-xs leading-6 text-black/40">
                                            Cuando Live Ops registre una incidencia aparecerá aquí automáticamente.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </article>

                        {/* ESTADÍSTICAS */}

                        <article className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white">
                            <div className="border-b border-black/[0.06] px-6 py-6 sm:px-8">
                                <p className="text-[7px] font-black uppercase tracking-[0.22em] text-[#168cab]">
                                    Datos
                                </p>

                                <h3 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em]">
                                    Estadísticas
                                </h3>
                            </div>

                            <div className="px-6 sm:px-8">
                                <StatRow
                                    name="Posesión"
                                    home={
                                        homeStats?.possession ??
                                        null
                                    }
                                    away={
                                        awayStats?.possession ??
                                        null
                                    }
                                />

                                <StatRow
                                    name="Tiros"
                                    home={
                                        homeStats?.shots ??
                                        0
                                    }
                                    away={
                                        awayStats?.shots ??
                                        0
                                    }
                                />

                                <StatRow
                                    name="A puerta"
                                    home={
                                        homeStats?.shots_on_target ??
                                        0
                                    }
                                    away={
                                        awayStats?.shots_on_target ??
                                        0
                                    }
                                />

                                <StatRow
                                    name="Córners"
                                    home={
                                        homeStats?.corners ??
                                        0
                                    }
                                    away={
                                        awayStats?.corners ??
                                        0
                                    }
                                />

                                <StatRow
                                    name="Faltas"
                                    home={
                                        homeStats?.fouls ??
                                        0
                                    }
                                    away={
                                        awayStats?.fouls ??
                                        0
                                    }
                                />

                                <StatRow
                                    name="Offsides"
                                    home={
                                        homeStats?.offsides ??
                                        0
                                    }
                                    away={
                                        awayStats?.offsides ??
                                        0
                                    }
                                />

                                <StatRow
                                    name="Amarillas"
                                    home={
                                        homeStats?.yellow_cards ??
                                        0
                                    }
                                    away={
                                        awayStats?.yellow_cards ??
                                        0
                                    }
                                />

                                <StatRow
                                    name="Rojas"
                                    home={
                                        homeStats?.red_cards ??
                                        0
                                    }
                                    away={
                                        awayStats?.red_cards ??
                                        0
                                    }
                                />

                                <StatRow
                                    name="Atajadas"
                                    home={
                                        homeStats?.saves ??
                                        0
                                    }
                                    away={
                                        awayStats?.saves ??
                                        0
                                    }
                                />
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* =================================================
                PREVIA
            ================================================= */}

            <section className="bg-[#06142d] px-4 py-16 text-white sm:px-8 sm:py-24 lg:px-12">
                <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-cyan-300" />

                            <p className="text-[7px] font-black uppercase tracking-[0.25em] text-cyan-300">
                                Jornada 8
                            </p>
                        </div>

                        <h2 className="mt-5 text-5xl font-black uppercase leading-[0.88] tracking-[-0.06em] sm:text-7xl">
                            La Paz
                            <br />
                            recibe al
                            <br />
                            Olancho
                            <span className="text-cyan-300">
                                .
                            </span>
                        </h2>
                    </div>

                    <div className="flex flex-col justify-center">
                        <p className="text-base font-semibold leading-8 text-white/70 sm:text-lg sm:leading-9">
                            Génesis FC vuelve a casa para recibir a Olancho FC en el Estadio Roberto Suazo Córdova.
                        </p>

                        <p className="mt-6 text-sm leading-7 text-white/35 sm:text-base sm:leading-8">
                            Desde este Match Center podrás seguir el marcador, cronómetro, alineaciones y principales incidencias registradas directamente desde Génesis Live Ops.
                        </p>
                    </div>
                </div>
            </section>

            {/* =================================================
                FORMA
            ================================================= */}

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

                        <p className="mt-4 max-w-[620px] text-xs leading-6 text-black/40">
                            Los cuatro resultados más recientes de cada equipo antes del duelo en La Paz.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-6 xl:grid-cols-2">
                        <FormaEquipo
                            equipo="Génesis FC"
                            subtitulo="Los caninos"
                            logo="/genesis.jpg"
                            resultados={resultadosGenesis}
                        />

                        <FormaEquipo
                            equipo="Olancho FC"
                            subtitulo="Los potros"
                            logo="/olancho.png"
                            resultados={resultadosOlancho}
                        />
                    </div>
                </div>
            </section>

            {/* =================================================
                CTA
            ================================================= */}

            <section className="bg-[#071a3b] px-4 py-16 text-white sm:px-8 sm:py-20 lg:px-12">
                <div className="mx-auto flex max-w-[1200px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[7px] font-black uppercase tracking-[0.25em] text-cyan-300">
                            Match Center oficial
                        </p>

                        <h2 className="mt-4 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
                            Vamos Génesis
                            <span className="text-cyan-300">
                                .
                            </span>
                        </h2>

                        <p className="mt-4 max-w-[520px] text-xs leading-6 text-white/40">
                            Actualización operada con Génesis Live Ops.
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex w-fit items-center gap-4 rounded-full bg-cyan-300 px-7 py-4 text-[7px] font-black uppercase tracking-[0.18em] text-[#06142d] transition hover:bg-white"
                    >
                        Volver al inicio
                        <span>
                            →
                        </span>
                    </Link>
                </div>
            </section>

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="bg-[#020817] px-4 py-9 text-white sm:px-8 lg:px-12">
                <div className="mx-auto flex max-w-[1200px] flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10">
                            <Image
                                src="/genesis.jpg"
                                alt="Génesis FC"
                                fill
                                quality={
                                    100
                                }
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
                    </div>
                </div>

                <div className="mx-auto flex max-w-[1200px] flex-col gap-2 pt-6 sm:flex-row sm:justify-between">
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