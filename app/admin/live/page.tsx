"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "../../../lib/supabase/client";

/* =========================================================
   GÉNESIS LIVE OPS
   MATCH CONTROL SYSTEM
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

type StatField =
    | "shots"
    | "shots_on_target"
    | "corners"
    | "fouls"
    | "offsides"
    | "yellow_cards"
    | "red_cards"
    | "saves"
    | "possession";

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

type RespuestaLive = {
    ok: boolean;

    error?: string;

    match?: LiveMatch | null;

    events?: LiveEvent[];

    stats?: LiveStat[];

    lineups?: LiveLineup[];

    administrador?: {
        id: string;
        correo: string;
    };
};

type LiveAction =
    | "start_first_half"
    | "pause"
    | "resume"
    | "halftime"
    | "start_second_half"
    | "finish"
    | "home_goal"
    | "away_goal"
    | "home_goal_remove"
    | "away_goal_remove";

type EventoRapido = {
    type: EventType;
    label: string;
    shortLabel: string;
    description: string;
};

type StatConfig = {
    field: StatField;
    label: string;
    short: string;
    step: number;
};

/* =========================================================
   CONFIG
========================================================= */

const MATCH_SLUG =
    "genesis-vs-olancho-2026-09-19";

const eventosRapidos: EventoRapido[] = [
    {
        type: "goal",
        label: "Gol",
        shortLabel: "GOL",
        description: "Registrar anotación",
    },
    {
        type: "yellow_card",
        label: "Amarilla",
        shortLabel: "TA",
        description: "Tarjeta amarilla",
    },
    {
        type: "red_card",
        label: "Roja",
        shortLabel: "TR",
        description: "Tarjeta roja",
    },
    {
        type: "substitution",
        label: "Cambio",
        shortLabel: "SUB",
        description: "Sustitución",
    },
    {
        type: "save",
        label: "Atajada",
        shortLabel: "GK",
        description: "Intervención del portero",
    },
    {
        type: "chance",
        label: "Ocasión",
        shortLabel: "OC",
        description: "Oportunidad importante",
    },
];

const statsConfig: StatConfig[] = [
    {
        field: "shots",
        label: "Tiros",
        short: "SH",
        step: 1,
    },
    {
        field: "shots_on_target",
        label: "A puerta",
        short: "SOT",
        step: 1,
    },
    {
        field: "corners",
        label: "Córners",
        short: "CK",
        step: 1,
    },
    {
        field: "fouls",
        label: "Faltas",
        short: "FL",
        step: 1,
    },
    {
        field: "offsides",
        label: "Offsides",
        short: "OFF",
        step: 1,
    },
    {
        field: "yellow_cards",
        label: "Amarillas",
        short: "YC",
        step: 1,
    },
    {
        field: "red_cards",
        label: "Rojas",
        short: "RC",
        step: 1,
    },
    {
        field: "saves",
        label: "Atajadas",
        short: "SV",
        step: 1,
    },
];

/* =========================================================
   HELPERS
========================================================= */

function formatTwoDigits(
    value: number
) {
    return String(
        value
    ).padStart(
        2,
        "0"
    );
}

function formatClock(
    totalSeconds: number
) {
    const safe =
        Math.max(
            0,
            Math.floor(
                totalSeconds
            )
        );

    return `${formatTwoDigits(
        Math.floor(
            safe / 60
        )
    )}:${formatTwoDigits(
        safe % 60
    )}`;
}

function statusLabel(
    status: MatchStatus
) {
    if (
        status ===
        "first_half"
    ) {
        return "1ER TIEMPO";
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
        return "2DO TIEMPO";
    }

    if (
        status ===
        "paused"
    ) {
        return "PAUSADO";
    }

    if (
        status ===
        "finished"
    ) {
        return "FINAL";
    }

    return "PREVIA";
}

function statusAccent(
    status: MatchStatus
) {
    if (
        status ===
            "first_half" ||
        status ===
            "second_half"
    ) {
        return "bg-emerald-400";
    }

    if (
        status ===
        "paused"
    ) {
        return "bg-amber-300";
    }

    if (
        status ===
        "finished"
    ) {
        return "bg-white/30";
    }

    return "bg-cyan-300";
}

function eventLabel(
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
            return "Evento";
    }
}

function eventCode(
    type: EventType
) {
    switch (type) {
        case "goal":
            return "GO";

        case "yellow_card":
            return "TA";

        case "red_card":
            return "TR";

        case "substitution":
            return "SU";

        case "save":
            return "GK";

        case "chance":
            return "OC";

        case "halftime":
            return "HT";

        case "fulltime":
            return "FT";

        default:
            return "EV";
    }
}

function obtenerStat(
    stat: LiveStat | null,
    field: StatField
) {
    if (!stat) {
        return field ===
            "possession"
            ? 50
            : 0;
    }

    if (
        field ===
        "possession"
    ) {
        return (
            stat.possession ??
            50
        );
    }

    return stat[field];
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function GenesisLiveOpsPage() {
    const router =
        useRouter();

    const [
        usuario,
        setUsuario,
    ] =
        useState<User | null>(
            null
        );

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
        useState<LiveEvent[]>(
            []
        );

    const [
        stats,
        setStats,
    ] =
        useState<LiveStat[]>(
            []
        );

    const [
        lineups,
        setLineups,
    ] =
        useState<
            LiveLineup[]
        >([]);

    const [
        cargando,
        setCargando,
    ] =
        useState(true);

    const [
        guardando,
        setGuardando,
    ] =
        useState(false);

    const [
        cerrandoSesion,
        setCerrandoSesion,
    ] =
        useState(false);

    const [
        error,
        setError,
    ] =
        useState("");

    const [
        mensajeSistema,
        setMensajeSistema,
    ] =
        useState("");

    const [
        clockTick,
        setClockTick,
    ] =
        useState(
            Date.now()
        );

    const [
        modalEvento,
        setModalEvento,
    ] =
        useState<EventType | null>(
            null
        );

    const [
        equipoEvento,
        setEquipoEvento,
    ] =
        useState<
            "home" | "away"
        >(
            "home"
        );

    const [
        jugadorEvento,
        setJugadorEvento,
    ] =
        useState("");

    const [
        jugadorSale,
        setJugadorSale,
    ] =
        useState("");

    const [
        jugadorEntra,
        setJugadorEntra,
    ] =
        useState("");

    const [
        detalleEvento,
        setDetalleEvento,
    ] =
        useState("");

    const [
        nuevoJugadorTeam,
        setNuevoJugadorTeam,
    ] =
        useState<
            "home" | "away"
        >(
            "away"
        );

    const [
        nuevoJugadorNombre,
        setNuevoJugadorNombre,
    ] =
        useState("");

    const [
        nuevoJugadorDorsal,
        setNuevoJugadorDorsal,
    ] =
        useState("");

    const [
        nuevoJugadorPosicion,
        setNuevoJugadorPosicion,
    ] =
        useState("");

    /* =======================================================
       SINCRONIZAR RESPUESTA
    ======================================================= */

    const aplicarRespuesta =
        useCallback(
            (
                data: RespuestaLive
            ) => {
                if (
                    data.match
                ) {
                    setMatch(
                        data.match
                    );
                }

                if (
                    data.events
                ) {
                    setEvents(
                        data.events
                    );
                }

                if (
                    data.stats
                ) {
                    setStats(
                        data.stats
                    );
                }

                if (
                    data.lineups
                ) {
                    setLineups(
                        data.lineups
                    );
                }
            },
            []
        );

    /* =======================================================
       CARGAR
    ======================================================= */

    const cargarLive =
        useCallback(
            async (
                accessToken:
                    string,
                silencioso =
                    false
            ) => {
                try {
                    if (
                        !silencioso
                    ) {
                        setCargando(
                            true
                        );
                    }

                    const response =
                        await fetch(
                            `/api/admin/live?slug=${encodeURIComponent(
                                MATCH_SLUG
                            )}`,
                            {
                                headers:
                                    {
                                        Authorization:
                                            `Bearer ${accessToken}`,
                                    },

                                cache:
                                    "no-store",
                            }
                        );

                    const data =
                        (await response.json()) as RespuestaLive;

                    if (
                        response.status ===
                        401
                    ) {
                        await supabase.auth.signOut();

                        router.replace(
                            "/admin/login"
                        );

                        return;
                    }

                    if (
                        !response.ok ||
                        !data.ok
                    ) {
                        setError(
                            data.error ||
                                "No se pudo cargar Live Ops."
                        );

                        return;
                    }

                    aplicarRespuesta(
                        data
                    );

                    setError("");
                } catch {
                    setError(
                        "No se pudo conectar con Génesis Live Ops."
                    );
                } finally {
                    if (
                        !silencioso
                    ) {
                        setCargando(
                            false
                        );
                    }
                }
            },
            [
                aplicarRespuesta,
                router,
            ]
        );

    useEffect(() => {
        let activo =
            true;

        async function iniciar() {
            const {
                data: {
                    session,
                },
            } =
                await supabase.auth.getSession();

            if (
                !session
            ) {
                router.replace(
                    "/admin/login"
                );

                return;
            }

            if (
                !activo
            ) {
                return;
            }

            setUsuario(
                session.user
            );

            await cargarLive(
                session.access_token
            );
        }

        iniciar();

        return () => {
            activo =
                false;
        };
    }, [
        cargarLive,
        router,
    ]);

    /* =======================================================
       REALTIME
    ======================================================= */

    useEffect(() => {
        if (!usuario) {
            return;
        }

        async function refrescar() {
            const {
                data: {
                    session,
                },
            } =
                await supabase.auth.getSession();

            if (!session) {
                return;
            }

            await cargarLive(
                session.access_token,
                true
            );
        }

        const channel =
            supabase
                .channel(
                    "genesis-live-ops-control"
                )
                .on(
                    "postgres_changes",
                    {
                        event:
                            "*",
                        schema:
                            "public",
                        table:
                            "live_matches",
                    },
                    refrescar
                )
                .on(
                    "postgres_changes",
                    {
                        event:
                            "*",
                        schema:
                            "public",
                        table:
                            "live_match_events",
                    },
                    refrescar
                )
                .on(
                    "postgres_changes",
                    {
                        event:
                            "*",
                        schema:
                            "public",
                        table:
                            "live_match_stats",
                    },
                    refrescar
                )
                .on(
                    "postgres_changes",
                    {
                        event:
                            "*",
                        schema:
                            "public",
                        table:
                            "live_match_lineups",
                    },
                    refrescar
                )
                .subscribe();

        return () => {
            supabase.removeChannel(
                channel
            );
        };
    }, [
        cargarLive,
        usuario,
    ]);

    /* =======================================================
       RELOJ
    ======================================================= */

    useEffect(() => {
        const timer =
            window.setInterval(
                () => {
                    setClockTick(
                        Date.now()
                    );
                },
                250
            );

        return () =>
            window.clearInterval(
                timer
            );
    }, []);

    const elapsedSeconds =
        useMemo(() => {
            if (!match) {
                return 0;
            }

            const base =
                match.elapsed_seconds;

            const startedAt =
                match.period_started_at;

            if (
                !startedAt ||
                (match.status !==
                    "first_half" &&
                    match.status !==
                        "second_half")
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
                    clockTick -
                        inicio
                ) /
                    1000
            );
        }, [
            clockTick,
            match,
        ]);

    const reloj =
        formatClock(
            elapsedSeconds
        );

    const minutoActual =
        Math.floor(
            elapsedSeconds /
                60
        );

    /* =======================================================
       POST GENÉRICO
    ======================================================= */

    const ejecutarPost =
        useCallback(
            async (
                body: Record<
                    string,
                    unknown
                >,
                mensaje?: string
            ) => {
                if (
                    guardando
                ) {
                    return false;
                }

                setGuardando(
                    true
                );

                setError("");

                try {
                    const {
                        data: {
                            session,
                        },
                    } =
                        await supabase.auth.getSession();

                    if (
                        !session
                    ) {
                        router.replace(
                            "/admin/login"
                        );

                        return false;
                    }

                    const response =
                        await fetch(
                            "/api/admin/live",
                            {
                                method:
                                    "POST",

                                headers:
                                    {
                                        "Content-Type":
                                            "application/json",

                                        Authorization:
                                            `Bearer ${session.access_token}`,
                                    },

                                body: JSON.stringify(
                                    body
                                ),
                            }
                        );

                    const data =
                        (await response.json()) as RespuestaLive;

                    if (
                        !response.ok ||
                        !data.ok
                    ) {
                        setError(
                            data.error ||
                                "No se pudo completar la operación."
                        );

                        return false;
                    }

                    aplicarRespuesta(
                        data
                    );

                    if (
                        mensaje
                    ) {
                        setMensajeSistema(
                            mensaje
                        );
                    }

                    return true;
                } catch {
                    setError(
                        "No se pudo sincronizar la operación."
                    );

                    return false;
                } finally {
                    setGuardando(
                        false
                    );
                }
            },
            [
                aplicarRespuesta,
                guardando,
                router,
            ]
        );

    /* =======================================================
       PARTIDO
    ======================================================= */

    async function ejecutarAccion(
        action: LiveAction
    ) {
        if (!match) {
            return;
        }

        await ejecutarPost(
            {
                action,

                matchId:
                    match.id,
            },
            "Acción sincronizada."
        );
    }

    /* =======================================================
       TIEMPO AÑADIDO
    ======================================================= */

    async function actualizarTiempoAnadido(
        period: 1 | 2,
        delta: number
    ) {
        if (!match) {
            return;
        }

        const actual =
            period === 1
                ? match.added_time_first_half
                : match.added_time_second_half;

        const siguiente =
            Math.max(
                0,
                Math.min(
                    30,
                    actual +
                        delta
                )
            );

        if (
            siguiente ===
            actual
        ) {
            return;
        }

        await ejecutarPost(
            {
                action:
                    "update_added_time",

                matchId:
                    match.id,

                addedTime: {
                    period,
                    delta,
                },
            },
            `Tiempo añadido del ${
                period === 1
                    ? "primer"
                    : "segundo"
            } tiempo: +${siguiente} min.`
        );
    }

    /* =======================================================
       STATS
    ======================================================= */

    async function actualizarStat(
        team: string,
        field: StatField,
        delta: number
    ) {
        if (!match) {
            return;
        }

        await ejecutarPost({
            action:
                "update_stat",

            matchId:
                match.id,

            stat: {
                team,
                field,
                delta,
            },
        });
    }

    /* =======================================================
       LINEUPS
    ======================================================= */

    async function cargarPlantelGenesis() {
        if (!match) {
            return;
        }

        await ejecutarPost(
            {
                action:
                    "seed_genesis_roster",

                matchId:
                    match.id,
            },
            "Plantel de Génesis cargado."
        );
    }

    async function cambiarTitular(
        jugador: LiveLineup
    ) {
        if (!match) {
            return;
        }

        await ejecutarPost({
            action:
                "update_lineup_player",

            matchId:
                match.id,

            lineup: {
                id:
                    jugador.id,

                isStarter:
                    !jugador.is_starter,

                isCaptain:
                    jugador.is_starter
                        ? false
                        : jugador.is_captain,
            },
        });
    }

    async function cambiarCapitan(
        jugador: LiveLineup
    ) {
        if (
            !match ||
            !jugador.is_starter
        ) {
            return;
        }

        await ejecutarPost({
            action:
                "update_lineup_player",

            matchId:
                match.id,

            lineup: {
                id:
                    jugador.id,

                isStarter:
                    true,

                isCaptain:
                    !jugador.is_captain,
            },
        });
    }

    async function agregarJugador() {
        if (
            !match ||
            !nuevoJugadorNombre.trim()
        ) {
            return;
        }

        const team =
            nuevoJugadorTeam ===
            "home"
                ? match.home_team
                : match.away_team;

        const ok =
            await ejecutarPost({
                action:
                    "add_lineup_player",

                matchId:
                    match.id,

                lineup: {
                    team,

                    playerName:
                        nuevoJugadorNombre.trim(),

                    shirtNumber:
                        nuevoJugadorDorsal.trim()
                            ? Number(
                                  nuevoJugadorDorsal
                              )
                            : null,

                    position:
                        nuevoJugadorPosicion.trim() ||
                        null,
                },
            });

        if (ok) {
            setNuevoJugadorNombre(
                ""
            );

            setNuevoJugadorDorsal(
                ""
            );

            setNuevoJugadorPosicion(
                ""
            );
        }
    }

    async function eliminarJugador(
        jugador: LiveLineup
    ) {
        if (!match) {
            return;
        }

        const confirmar =
            window.confirm(
                `¿Eliminar a ${jugador.player_name} del plantel de este partido?`
            );

        if (
            !confirmar
        ) {
            return;
        }

        await ejecutarPost({
            action:
                "delete_lineup_player",

            matchId:
                match.id,

            lineup: {
                id:
                    jugador.id,
            },
        });
    }

    /* =======================================================
       EVENTOS
    ======================================================= */

    async function guardarEvento() {
        if (
            !match ||
            !modalEvento
        ) {
            return;
        }

        const team =
            equipoEvento ===
            "home"
                ? match.home_team
                : match.away_team;

        const ok =
            await ejecutarPost(
                {
                    action:
                        "add_event",

                    matchId:
                        match.id,

                    event: {
                        eventType:
                            modalEvento,

                        team,

                        playerName:
                            jugadorEvento ||
                            null,

                        playerOut:
                            jugadorSale ||
                            null,

                        playerIn:
                            jugadorEntra ||
                            null,

                        description:
                            detalleEvento.trim() ||
                            null,

                        minute:
                            minutoActual,

                        second:
                            Math.floor(
                                elapsedSeconds
                            ) %
                            60,

                        period:
                            match.current_period ||
                            1,
                    },
                },
                `${eventLabel(
                    modalEvento
                )} publicado.`
            );

        if (ok) {
            setModalEvento(
                null
            );

            setJugadorEvento(
                ""
            );

            setJugadorSale(
                ""
            );

            setJugadorEntra(
                ""
            );

            setDetalleEvento(
                ""
            );
        }
    }

    /* =======================================================
       DERIVADOS
    ======================================================= */

    const homeStats =
        useMemo(
            () =>
                match
                    ? stats.find(
                          (
                              item
                          ) =>
                              item.team ===
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
                              item
                          ) =>
                              item.team ===
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

    const jugadoresEvento =
        useMemo(() => {
            if (!match) {
                return [];
            }

            const team =
                equipoEvento ===
                "home"
                    ? match.home_team
                    : match.away_team;

            return lineups.filter(
                (
                    jugador
                ) =>
                    jugador.team ===
                    team
            );
        }, [
            equipoEvento,
            lineups,
            match,
        ]);

    const titularesEvento =
        jugadoresEvento.filter(
            (
                jugador
            ) =>
                jugador.is_starter
        );

    const suplentesEvento =
        jugadoresEvento.filter(
            (
                jugador
            ) =>
                !jugador.is_starter
        );

    const homeTitulares =
        homeLineup.filter(
            (
                jugador
            ) =>
                jugador.is_starter
        ).length;

    const awayTitulares =
        awayLineup.filter(
            (
                jugador
            ) =>
                jugador.is_starter
        ).length;

    /* =======================================================
       LOGOUT
    ======================================================= */

    async function cerrarSesion() {
        setCerrandoSesion(
            true
        );

        await supabase.auth.signOut();

        router.replace(
            "/admin/login"
        );

        setCerrandoSesion(
            false
        );
    }

    /* =======================================================
       LOADING
    ======================================================= */

    if (cargando) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#020817] text-white">
                <div className="text-center">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-300">
                        Génesis Live Ops
                    </p>

                    <h1 className="mt-4 text-2xl font-black uppercase">
                        Match Control System
                    </h1>

                    <p className="mt-3 text-xs uppercase tracking-[0.15em] text-white/30">
                        Inicializando...
                    </p>
                </div>
            </main>
        );
    }

    if (!match) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#020817] px-6 text-white">
                <div className="text-center">
                    <p className="text-cyan-300">
                        GÉNESIS LIVE OPS
                    </p>

                    <h1 className="mt-4 text-4xl font-black uppercase">
                        Partido no disponible
                    </h1>

                    <p className="mt-4 text-white/40">
                        {error}
                    </p>
                </div>
            </main>
        );
    }

    /* =======================================================
       UI
    ======================================================= */

    return (
        <main className="min-h-screen bg-[#020817] text-white">
            {/* =================================================
                HEADER
            ================================================= */}

            <header className="border-b border-white/10 bg-[#040d1f]">
                <div className="mx-auto flex max-w-[1800px] flex-col gap-4 px-4 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12">
                            <Image
                                src="/genesis.jpg"
                                alt="Génesis FC"
                                fill
                                priority
                                sizes="48px"
                                className="object-contain"
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`h-2 w-2 rounded-full ${statusAccent(
                                        match.status
                                    )}`}
                                />

                                <p className="text-[7px] font-black uppercase tracking-[0.28em] text-cyan-300">
                                    Génesis Live Ops
                                </p>
                            </div>

                            <h1 className="mt-1 text-xl font-black uppercase">
                                Match Control System
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-3 text-[7px] font-black uppercase tracking-[0.18em] text-emerald-300">
                            ● Online
                        </div>

                        <Link
                            href="/partidos/genesis-vs-olancho"
                            target="_blank"
                            className="rounded-full border border-white/10 px-5 py-3 text-[7px] font-black uppercase tracking-[0.18em] text-white/50"
                        >
                            Vista pública ↗
                        </Link>

                        <button
                            type="button"
                            onClick={
                                cerrarSesion
                            }
                            disabled={
                                cerrandoSesion
                            }
                            className="rounded-full bg-white px-5 py-3 text-[7px] font-black uppercase text-[#06142d]"
                        >
                            {cerrandoSesion
                                ? "Saliendo..."
                                : "Salir"}
                        </button>
                    </div>
                </div>
            </header>

            {(error ||
                mensajeSistema) && (
                <div className="mx-auto max-w-[1800px] px-4 pt-5 sm:px-8">
                    {error && (
                        <div className="border border-red-400/20 bg-red-500/[0.08] p-4 text-xs text-red-200">
                            {
                                error
                            }
                        </div>
                    )}

                    {mensajeSistema &&
                        !error && (
                            <div className="border border-emerald-400/20 bg-emerald-400/[0.07] p-4 text-xs text-white/60">
                                {
                                    mensajeSistema
                                }
                            </div>
                        )}
                </div>
            )}

            <section className="mx-auto grid max-w-[1800px] gap-5 px-4 py-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_420px]">
                <div className="space-y-5">
                    {/* =================================================
                        SCOREBOARD
                    ================================================= */}

                    <section className="rounded-[30px] border border-white/10 bg-[#06142d] p-6">
                        <div className="flex items-center justify-between border-b border-white/10 pb-5">
                            <div>
                                <p className="text-[7px] font-black uppercase tracking-[0.25em] text-cyan-300">
                                    {
                                        match.competition
                                    }{" "}
                                    · Jornada{" "}
                                    {
                                        match.matchday
                                    }
                                </p>

                                <p className="mt-2 text-[8px] uppercase text-white/25">
                                    {
                                        match.stadium
                                    }{" "}
                                    ·{" "}
                                    {
                                        match.city
                                    }
                                </p>
                            </div>

                            <p className="text-[8px] font-black uppercase tracking-[0.18em]">
                                {statusLabel(
                                    match.status
                                )}
                            </p>
                        </div>

                        <div className="mt-7 grid grid-cols-[1fr_120px_1fr] items-center sm:grid-cols-[1fr_250px_1fr]">
                            <div className="text-center">
                                <div className="relative mx-auto h-24 w-24 sm:h-36 sm:w-36">
                                    <Image
                                        src={
                                            match.home_logo ||
                                            "/genesis.jpg"
                                        }
                                        alt={
                                            match.home_team
                                        }
                                        fill
                                        sizes="144px"
                                        className="object-contain"
                                    />
                                </div>

                                <h2 className="mt-4 font-black uppercase sm:text-2xl">
                                    {
                                        match.home_team
                                    }
                                </h2>

                                <div className="mt-4 flex justify-center gap-2">
                                    <button
                                        type="button"
                                        disabled={
                                            guardando
                                        }
                                        onClick={() =>
                                            ejecutarAccion(
                                                "home_goal_remove"
                                            )
                                        }
                                        className="h-9 w-9 rounded-full border border-white/10 disabled:opacity-30"
                                    >
                                        −
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            guardando
                                        }
                                        onClick={() =>
                                            ejecutarAccion(
                                                "home_goal"
                                            )
                                        }
                                        className="h-9 w-9 rounded-full bg-cyan-300 font-black text-[#06142d] disabled:opacity-30"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="flex justify-center gap-3 text-5xl font-black sm:text-8xl">
                                    <span>
                                        {
                                            match.home_score
                                        }
                                    </span>

                                    <span className="text-white/15">
                                        :
                                    </span>

                                    <span className="text-cyan-300">
                                        {
                                            match.away_score
                                        }
                                    </span>
                                </div>

                                <div className="mt-5 rounded-[18px] border border-white/10 bg-black/20 p-4">
                                    <p className="font-mono text-3xl font-black sm:text-5xl">
                                        {
                                            reloj
                                        }
                                    </p>

                                    <p className="mt-2 text-[6px] font-black uppercase tracking-[0.2em] text-white/20">
                                        Live Ops Clock
                                    </p>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="relative mx-auto h-24 w-24 sm:h-36 sm:w-36">
                                    <Image
                                        src={
                                            match.away_logo ||
                                            "/olancho.png"
                                        }
                                        alt={
                                            match.away_team
                                        }
                                        fill
                                        sizes="144px"
                                        className="object-contain"
                                    />
                                </div>

                                <h2 className="mt-4 font-black uppercase sm:text-2xl">
                                    {
                                        match.away_team
                                    }
                                </h2>

                                <div className="mt-4 flex justify-center gap-2">
                                    <button
                                        type="button"
                                        disabled={
                                            guardando
                                        }
                                        onClick={() =>
                                            ejecutarAccion(
                                                "away_goal_remove"
                                            )
                                        }
                                        className="h-9 w-9 rounded-full border border-white/10 disabled:opacity-30"
                                    >
                                        −
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            guardando
                                        }
                                        onClick={() =>
                                            ejecutarAccion(
                                                "away_goal"
                                            )
                                        }
                                        className="h-9 w-9 rounded-full border border-white/10 disabled:opacity-30"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =================================================
                        MATCH CONTROL
                    ================================================= */}

                    <section className="rounded-[30px] border border-white/10 bg-white/[0.035] p-6">
                        <p className="text-[7px] font-black uppercase tracking-[0.28em] text-cyan-300">
                            Match Operations
                        </p>

                        <h2 className="mt-2 text-3xl font-black uppercase">
                            Control del partido
                        </h2>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            {match.status ===
                                "pre_match" && (
                                <button
                                    type="button"
                                    disabled={
                                        guardando
                                    }
                                    onClick={() =>
                                        ejecutarAccion(
                                            "start_first_half"
                                        )
                                    }
                                    className="min-h-24 rounded-[22px] bg-emerald-400 p-5 text-left font-black uppercase text-[#032116] disabled:opacity-30"
                                >
                                    Iniciar 1T
                                </button>
                            )}

                            {(match.status ===
                                "first_half" ||
                                match.status ===
                                    "second_half") && (
                                <button
                                    type="button"
                                    disabled={
                                        guardando
                                    }
                                    onClick={() =>
                                        ejecutarAccion(
                                            "pause"
                                        )
                                    }
                                    className="min-h-24 rounded-[22px] border border-amber-300/20 bg-amber-300/[0.08] p-5 text-left font-black uppercase text-amber-200 disabled:opacity-30"
                                >
                                    Pausar
                                </button>
                            )}

                            {match.status ===
                                "paused" && (
                                <button
                                    type="button"
                                    disabled={
                                        guardando
                                    }
                                    onClick={() =>
                                        ejecutarAccion(
                                            "resume"
                                        )
                                    }
                                    className="min-h-24 rounded-[22px] bg-emerald-400 p-5 text-left font-black uppercase text-[#032116] disabled:opacity-30"
                                >
                                    Reanudar
                                </button>
                            )}

                            {match.current_period ===
                                1 &&
                                (match.status ===
                                    "first_half" ||
                                    match.status ===
                                        "paused") && (
                                    <button
                                        type="button"
                                        disabled={
                                            guardando
                                        }
                                        onClick={() =>
                                            ejecutarAccion(
                                                "halftime"
                                            )
                                        }
                                        className="min-h-24 rounded-[22px] border border-white/10 p-5 text-left font-black uppercase disabled:opacity-30"
                                    >
                                        Descanso
                                    </button>
                                )}

                            {match.status ===
                                "halftime" && (
                                <button
                                    type="button"
                                    disabled={
                                        guardando
                                    }
                                    onClick={() =>
                                        ejecutarAccion(
                                            "start_second_half"
                                        )
                                    }
                                    className="min-h-24 rounded-[22px] bg-cyan-300 p-5 text-left font-black uppercase text-[#06142d] disabled:opacity-30"
                                >
                                    Iniciar 2T
                                </button>
                            )}

                            {match.status !==
                                "pre_match" &&
                                match.status !==
                                    "finished" && (
                                    <button
                                        type="button"
                                        disabled={
                                            guardando
                                        }
                                        onClick={() => {
                                            if (
                                                window.confirm(
                                                    "¿Finalizar oficialmente el partido?"
                                                )
                                            ) {
                                                ejecutarAccion(
                                                    "finish"
                                                );
                                            }
                                        }}
                                        className="min-h-24 rounded-[22px] border border-red-400/20 bg-red-500/[0.08] p-5 text-left font-black uppercase text-red-300 disabled:opacity-30"
                                    >
                                        Finalizar
                                    </button>
                                )}
                        </div>
                    </section>

                    {/* =================================================
                        TIEMPO AÑADIDO
                    ================================================= */}

                    <section className="overflow-hidden rounded-[30px] border border-amber-300/15 bg-[#06142d]">
                        <div className="border-b border-white/10 p-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-[7px] font-black uppercase tracking-[0.28em] text-amber-300">
                                        Referee Time
                                    </p>

                                    <h2 className="mt-2 text-3xl font-black uppercase">
                                        Tiempo añadido
                                    </h2>
                                </div>

                                <p className="max-w-[420px] text-[8px] leading-5 text-white/30">
                                    Registra los minutos anunciados por el cuarto árbitro.
                                    El reloj seguirá corriendo hasta que marques descanso o final.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-px bg-white/10 sm:grid-cols-2">
                            {/* 1ER TIEMPO */}

                            <div
                                className={`bg-[#06142d] p-6 ${
                                    match.current_period ===
                                        1 &&
                                    match.status !==
                                        "pre_match" &&
                                    match.status !==
                                        "finished"
                                        ? "ring-1 ring-inset ring-amber-300/20"
                                        : ""
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/30">
                                            Primer tiempo
                                        </p>

                                        <div className="mt-3 flex items-end gap-2">
                                            <p className="text-5xl font-black tracking-[-0.06em] text-amber-300">
                                                +
                                                {
                                                    match.added_time_first_half
                                                }
                                            </p>

                                            <p className="pb-1 text-[8px] font-black uppercase tracking-[0.15em] text-white/30">
                                                min
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-full border border-white/10 px-3 py-2">
                                        <p className="text-[6px] font-black uppercase tracking-[0.15em] text-white/30">
                                            45&apos;+
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        disabled={
                                            guardando ||
                                            match.added_time_first_half <=
                                                0
                                        }
                                        onClick={() =>
                                            actualizarTiempoAnadido(
                                                1,
                                                -1
                                            )
                                        }
                                        className="min-h-14 rounded-[16px] border border-white/10 bg-white/[0.03] text-xl font-black transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-20"
                                    >
                                        −
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            guardando ||
                                            match.added_time_first_half >=
                                                30
                                        }
                                        onClick={() =>
                                            actualizarTiempoAnadido(
                                                1,
                                                1
                                            )
                                        }
                                        className="min-h-14 rounded-[16px] bg-amber-300 text-xl font-black text-[#261d00] transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* 2DO TIEMPO */}

                            <div
                                className={`bg-[#06142d] p-6 ${
                                    match.current_period ===
                                        2 &&
                                    match.status !==
                                        "finished"
                                        ? "ring-1 ring-inset ring-amber-300/20"
                                        : ""
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/30">
                                            Segundo tiempo
                                        </p>

                                        <div className="mt-3 flex items-end gap-2">
                                            <p className="text-5xl font-black tracking-[-0.06em] text-amber-300">
                                                +
                                                {
                                                    match.added_time_second_half
                                                }
                                            </p>

                                            <p className="pb-1 text-[8px] font-black uppercase tracking-[0.15em] text-white/30">
                                                min
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-full border border-white/10 px-3 py-2">
                                        <p className="text-[6px] font-black uppercase tracking-[0.15em] text-white/30">
                                            90&apos;+
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        disabled={
                                            guardando ||
                                            match.added_time_second_half <=
                                                0
                                        }
                                        onClick={() =>
                                            actualizarTiempoAnadido(
                                                2,
                                                -1
                                            )
                                        }
                                        className="min-h-14 rounded-[16px] border border-white/10 bg-white/[0.03] text-xl font-black transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-20"
                                    >
                                        −
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            guardando ||
                                            match.added_time_second_half >=
                                                30
                                        }
                                        onClick={() =>
                                            actualizarTiempoAnadido(
                                                2,
                                                1
                                            )
                                        }
                                        className="min-h-14 rounded-[16px] bg-amber-300 text-xl font-black text-[#261d00] transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/10 px-6 py-4">
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                <p className="text-[6px] font-black uppercase tracking-[0.16em] text-white/20">
                                    1T · 45+
                                    {
                                        match.added_time_first_half
                                    }
                                    &apos;
                                </p>

                                <p className="text-[6px] font-black uppercase tracking-[0.16em] text-white/20">
                                    2T · 90+
                                    {
                                        match.added_time_second_half
                                    }
                                    &apos;
                                </p>

                                <p className="text-[6px] font-black uppercase tracking-[0.16em] text-amber-300/60">
                                    Control manual · no detiene el reloj
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* =================================================
                        LINEUPS CONTROL
                    ================================================= */}

                    <section className="rounded-[30px] border border-cyan-300/20 bg-[#06142d] p-6">
                        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-[7px] font-black uppercase tracking-[0.28em] text-cyan-300">
                                    Team Operations
                                </p>

                                <h2 className="mt-2 text-3xl font-black uppercase">
                                    Lineups Control
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    cargarPlantelGenesis
                                }
                                disabled={
                                    guardando
                                }
                                className="rounded-full bg-cyan-300 px-6 py-4 text-[7px] font-black uppercase tracking-[0.16em] text-[#06142d] disabled:opacity-30"
                            >
                                Cargar plantel Génesis
                            </button>
                        </div>

                        <div className="mt-6 grid gap-6 xl:grid-cols-2">
                            {[
                                {
                                    team:
                                        match.home_team,

                                    logo:
                                        match.home_logo ||
                                        "/genesis.jpg",

                                    players:
                                        homeLineup,

                                    starters:
                                        homeTitulares,
                                },

                                {
                                    team:
                                        match.away_team,

                                    logo:
                                        match.away_logo ||
                                        "/olancho.png",

                                    players:
                                        awayLineup,

                                    starters:
                                        awayTitulares,
                                },
                            ].map(
                                (
                                    bloque
                                ) => (
                                    <article
                                        key={
                                            bloque.team
                                        }
                                        className="overflow-hidden rounded-[24px] border border-white/10 bg-black/10"
                                    >
                                        <div className="flex items-center justify-between border-b border-white/10 p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-12 w-12">
                                                    <Image
                                                        src={
                                                            bloque.logo
                                                        }
                                                        alt={
                                                            bloque.team
                                                        }
                                                        fill
                                                        sizes="48px"
                                                        className="object-contain"
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-[6px] font-black uppercase tracking-[0.18em] text-white/30">
                                                        Plantel del partido
                                                    </p>

                                                    <p className="mt-1 text-sm font-black uppercase">
                                                        {
                                                            bloque.team
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="rounded-full border border-white/10 px-4 py-2">
                                                <p
                                                    className={`text-[7px] font-black uppercase ${
                                                        bloque.starters ===
                                                        11
                                                            ? "text-emerald-300"
                                                            : bloque.starters >
                                                                11
                                                              ? "text-red-300"
                                                              : "text-cyan-300"
                                                    }`}
                                                >
                                                    XI{" "}
                                                    {
                                                        bloque.starters
                                                    }
                                                    /11
                                                </p>
                                            </div>
                                        </div>

                                        {bloque.players.length ===
                                        0 ? (
                                            <div className="p-8 text-center text-xs text-white/30">
                                                Todavía no hay jugadores cargados.
                                            </div>
                                        ) : (
                                            <div className="max-h-[520px] overflow-y-auto p-3">
                                                {bloque.players.map(
                                                    (
                                                        jugador
                                                    ) => (
                                                        <div
                                                            key={
                                                                jugador.id
                                                            }
                                                            className={`mb-2 rounded-[18px] border p-4 ${
                                                                jugador.is_starter
                                                                    ? "border-cyan-300/20 bg-cyan-300/[0.06]"
                                                                    : "border-white/[0.07] bg-white/[0.02]"
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div className="flex min-w-0 items-center gap-3">
                                                                    <div
                                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[9px] font-black ${
                                                                            jugador.is_starter
                                                                                ? "bg-cyan-300 text-[#06142d]"
                                                                                : "border border-white/10 text-white/50"
                                                                        }`}
                                                                    >
                                                                        {jugador.shirt_number ??
                                                                            "—"}
                                                                    </div>

                                                                    <div className="min-w-0">
                                                                        <p className="truncate text-xs font-black uppercase">
                                                                            {
                                                                                jugador.player_name
                                                                            }
                                                                        </p>

                                                                        <p className="mt-1 text-[6px] font-black uppercase tracking-[0.14em] text-white/25">
                                                                            {jugador.position ||
                                                                                "Sin posición"}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {jugador.is_captain && (
                                                                    <span className="rounded-full bg-amber-300 px-3 py-2 text-[6px] font-black uppercase text-[#241900]">
                                                                        Capitán
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="mt-4 grid grid-cols-3 gap-2">
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        guardando
                                                                    }
                                                                    onClick={() =>
                                                                        cambiarTitular(
                                                                            jugador
                                                                        )
                                                                    }
                                                                    className={`rounded-[12px] px-3 py-3 text-[6px] font-black uppercase tracking-[0.12em] ${
                                                                        jugador.is_starter
                                                                            ? "bg-cyan-300 text-[#06142d]"
                                                                            : "border border-white/10 text-white/40"
                                                                    } disabled:opacity-30`}
                                                                >
                                                                    {jugador.is_starter
                                                                        ? "Titular"
                                                                        : "Suplente"}
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        guardando ||
                                                                        !jugador.is_starter
                                                                    }
                                                                    onClick={() =>
                                                                        cambiarCapitan(
                                                                            jugador
                                                                        )
                                                                    }
                                                                    className={`rounded-[12px] px-3 py-3 text-[6px] font-black uppercase ${
                                                                        jugador.is_captain
                                                                            ? "bg-amber-300 text-[#241900]"
                                                                            : "border border-white/10 text-white/40 disabled:opacity-20"
                                                                    }`}
                                                                >
                                                                    Capitán
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        guardando
                                                                    }
                                                                    onClick={() =>
                                                                        eliminarJugador(
                                                                            jugador
                                                                        )
                                                                    }
                                                                    className="rounded-[12px] border border-red-400/10 px-3 py-3 text-[6px] font-black uppercase text-red-300/60 disabled:opacity-30"
                                                                >
                                                                    Quitar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </article>
                                )
                            )}
                        </div>

                        {/* AGREGAR JUGADOR */}

                        <div className="mt-6 rounded-[22px] border border-white/10 bg-white/[0.025] p-5">
                            <p className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-300">
                                Agregar jugador manualmente
                            </p>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                                <select
                                    value={
                                        nuevoJugadorTeam
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNuevoJugadorTeam(
                                            event.target.value as
                                                | "home"
                                                | "away"
                                        )
                                    }
                                    className="rounded-[14px] border border-white/10 bg-[#020817] px-4 py-3 text-xs"
                                >
                                    <option value="home">
                                        {
                                            match.home_team
                                        }
                                    </option>

                                    <option value="away">
                                        {
                                            match.away_team
                                        }
                                    </option>
                                </select>

                                <input
                                    value={
                                        nuevoJugadorNombre
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNuevoJugadorNombre(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Nombre"
                                    className="rounded-[14px] border border-white/10 bg-black/20 px-4 py-3 text-xs outline-none"
                                />

                                <input
                                    value={
                                        nuevoJugadorDorsal
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNuevoJugadorDorsal(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Dorsal"
                                    type="number"
                                    min="0"
                                    className="rounded-[14px] border border-white/10 bg-black/20 px-4 py-3 text-xs outline-none"
                                />

                                <input
                                    value={
                                        nuevoJugadorPosicion
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNuevoJugadorPosicion(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Posición"
                                    className="rounded-[14px] border border-white/10 bg-black/20 px-4 py-3 text-xs outline-none"
                                />

                                <button
                                    type="button"
                                    disabled={
                                        guardando ||
                                        !nuevoJugadorNombre.trim()
                                    }
                                    onClick={
                                        agregarJugador
                                    }
                                    className="rounded-[14px] bg-white px-4 py-3 text-[7px] font-black uppercase text-[#06142d] disabled:opacity-30"
                                >
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* =================================================
                        EVENTOS
                    ================================================= */}

                    <section className="rounded-[30px] border border-white/10 bg-white/[0.035] p-6">
                        <p className="text-[7px] font-black uppercase tracking-[0.28em] text-cyan-300">
                            Live Events
                        </p>

                        <h2 className="mt-2 text-3xl font-black uppercase">
                            Acción rápida
                        </h2>

                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {eventosRapidos.map(
                                (
                                    evento
                                ) => (
                                    <button
                                        key={
                                            evento.type
                                        }
                                        type="button"
                                        disabled={
                                            match.status ===
                                                "pre_match" ||
                                            match.status ===
                                                "finished" ||
                                            guardando
                                        }
                                        onClick={() => {
                                            setModalEvento(
                                                evento.type
                                            );

                                            setEquipoEvento(
                                                "home"
                                            );

                                            setJugadorEvento(
                                                ""
                                            );

                                            setJugadorSale(
                                                ""
                                            );

                                            setJugadorEntra(
                                                ""
                                            );

                                            setDetalleEvento(
                                                ""
                                            );
                                        }}
                                        className="min-h-28 rounded-[22px] border border-white/10 bg-[#06142d] p-5 text-left disabled:opacity-20"
                                    >
                                        <p className="text-[7px] font-black text-cyan-300">
                                            {
                                                evento.shortLabel
                                            }
                                        </p>

                                        <p className="mt-4 font-black uppercase">
                                            {
                                                evento.label
                                            }
                                        </p>

                                        <p className="mt-1 text-[7px] uppercase text-white/25">
                                            {
                                                evento.description
                                            }
                                        </p>
                                    </button>
                                )
                            )}
                        </div>
                    </section>

                    {/* =================================================
                        STATS
                    ================================================= */}

                    <section className="rounded-[30px] border border-white/10 bg-[#06142d] p-6">
                        <p className="text-[7px] font-black uppercase tracking-[0.28em] text-cyan-300">
                            Match Data Control
                        </p>

                        <h2 className="mt-2 text-3xl font-black uppercase">
                            Estadísticas
                        </h2>

                        <div className="mt-6 rounded-[20px] border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                            <p className="text-center text-[7px] font-black uppercase text-cyan-300">
                                Posesión
                            </p>

                            <div className="mt-4 grid grid-cols-[1fr_60px_1fr] items-center">
                                <div className="flex justify-center gap-2">
                                    <button
                                        type="button"
                                        disabled={
                                            guardando
                                        }
                                        onClick={() =>
                                            actualizarStat(
                                                match.home_team,
                                                "possession",
                                                -5
                                            )
                                        }
                                        className="h-9 w-9 rounded-full border border-white/10 disabled:opacity-30"
                                    >
                                        −
                                    </button>

                                    <span className="min-w-[50px] text-center text-xl font-black text-cyan-300">
                                        {obtenerStat(
                                            homeStats,
                                            "possession"
                                        )}
                                        %
                                    </span>

                                    <button
                                        type="button"
                                        disabled={
                                            guardando
                                        }
                                        onClick={() =>
                                            actualizarStat(
                                                match.home_team,
                                                "possession",
                                                5
                                            )
                                        }
                                        className="h-9 w-9 rounded-full bg-cyan-300 font-black text-[#06142d] disabled:opacity-30"
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="text-center text-[6px] text-white/25">
                                    POS
                                </p>

                                <div className="flex justify-center gap-2">
                                    <button
                                        type="button"
                                        disabled={
                                            guardando
                                        }
                                        onClick={() =>
                                            actualizarStat(
                                                match.away_team,
                                                "possession",
                                                -5
                                            )
                                        }
                                        className="h-9 w-9 rounded-full border border-white/10 disabled:opacity-30"
                                    >
                                        −
                                    </button>

                                    <span className="min-w-[50px] text-center text-xl font-black">
                                        {obtenerStat(
                                            awayStats,
                                            "possession"
                                        )}
                                        %
                                    </span>

                                    <button
                                        type="button"
                                        disabled={
                                            guardando
                                        }
                                        onClick={() =>
                                            actualizarStat(
                                                match.away_team,
                                                "possession",
                                                5
                                            )
                                        }
                                        className="h-9 w-9 rounded-full border border-white/10 disabled:opacity-30"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            {statsConfig.map(
                                (
                                    config
                                ) => (
                                    <div
                                        key={
                                            config.field
                                        }
                                        className="grid grid-cols-[1fr_100px_1fr] items-center rounded-[16px] border border-white/[0.06] p-3"
                                    >
                                        <div className="flex justify-center gap-2">
                                            <button
                                                type="button"
                                                disabled={
                                                    guardando
                                                }
                                                onClick={() =>
                                                    actualizarStat(
                                                        match.home_team,
                                                        config.field,
                                                        -config.step
                                                    )
                                                }
                                                className="h-8 w-8 rounded-full border border-white/10 disabled:opacity-30"
                                            >
                                                −
                                            </button>

                                            <span className="min-w-[28px] text-center font-black text-cyan-300">
                                                {obtenerStat(
                                                    homeStats,
                                                    config.field
                                                )}
                                            </span>

                                            <button
                                                type="button"
                                                disabled={
                                                    guardando
                                                }
                                                onClick={() =>
                                                    actualizarStat(
                                                        match.home_team,
                                                        config.field,
                                                        config.step
                                                    )
                                                }
                                                className="h-8 w-8 rounded-full bg-cyan-300 text-[#06142d] disabled:opacity-30"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <p className="text-center text-[7px] font-black uppercase text-white/40">
                                            {
                                                config.label
                                            }
                                        </p>

                                        <div className="flex justify-center gap-2">
                                            <button
                                                type="button"
                                                disabled={
                                                    guardando
                                                }
                                                onClick={() =>
                                                    actualizarStat(
                                                        match.away_team,
                                                        config.field,
                                                        -config.step
                                                    )
                                                }
                                                className="h-8 w-8 rounded-full border border-white/10 disabled:opacity-30"
                                            >
                                                −
                                            </button>

                                            <span className="min-w-[28px] text-center font-black">
                                                {obtenerStat(
                                                    awayStats,
                                                    config.field
                                                )}
                                            </span>

                                            <button
                                                type="button"
                                                disabled={
                                                    guardando
                                                }
                                                onClick={() =>
                                                    actualizarStat(
                                                        match.away_team,
                                                        config.field,
                                                        config.step
                                                    )
                                                }
                                                className="h-8 w-8 rounded-full border border-white/10 disabled:opacity-30"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </section>
                </div>

                {/* =================================================
                    TIMELINE
                ================================================= */}

                <aside className="lg:sticky lg:top-5 lg:h-[calc(100vh-40px)]">
                    <section className="flex h-full min-h-[650px] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#06142d]">
                        <div className="border-b border-white/10 p-6">
                            <p className="text-[7px] font-black uppercase tracking-[0.28em] text-cyan-300">
                                Live Feed
                            </p>

                            <div className="mt-2 flex items-center justify-between">
                                <h2 className="text-2xl font-black uppercase">
                                    Timeline
                                </h2>

                                <p className="font-mono text-2xl font-black">
                                    {
                                        reloj
                                    }
                                </p>
                            </div>

                            {(match.added_time_first_half >
                                0 ||
                                match.added_time_second_half >
                                    0) && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {match.added_time_first_half >
                                        0 && (
                                        <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-3 py-2 text-[6px] font-black uppercase tracking-[0.13em] text-amber-300">
                                            1T +
                                            {
                                                match.added_time_first_half
                                            }{" "}
                                            min
                                        </span>
                                    )}

                                    {match.added_time_second_half >
                                        0 && (
                                        <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-3 py-2 text-[6px] font-black uppercase tracking-[0.13em] text-amber-300">
                                            2T +
                                            {
                                                match.added_time_second_half
                                            }{" "}
                                            min
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {events.length ===
                            0 ? (
                                <div className="flex min-h-[400px] items-center justify-center text-center text-xs text-white/25">
                                    Sin eventos
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {events.map(
                                        (
                                            evento
                                        ) => (
                                            <article
                                                key={
                                                    evento.id
                                                }
                                                className="grid grid-cols-[46px_1fr] gap-3 rounded-[16px] border border-white/[0.07] bg-white/[0.025] p-4"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[7px] font-black text-cyan-300">
                                                    {eventCode(
                                                        evento.event_type
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="text-[7px] text-white/25">
                                                        {
                                                            evento.minute
                                                        }
                                                        &apos;{" "}
                                                        {formatTwoDigits(
                                                            evento.second
                                                        )}
                                                        &quot;
                                                    </p>

                                                    <p className="mt-1 text-xs font-black uppercase">
                                                        {evento.title ||
                                                            eventLabel(
                                                                evento.event_type
                                                            )}
                                                    </p>

                                                    {evento.player_name && (
                                                        <p className="mt-1 text-[10px] text-cyan-300">
                                                            {
                                                                evento.player_name
                                                            }
                                                        </p>
                                                    )}

                                                    {evento.player_out &&
                                                        evento.player_in && (
                                                            <p className="mt-2 text-[9px] text-white/40">
                                                                Sale{" "}
                                                                {
                                                                    evento.player_out
                                                                }{" "}
                                                                · Entra{" "}
                                                                {
                                                                    evento.player_in
                                                                }
                                                            </p>
                                                        )}

                                                    {evento.description && (
                                                        <p className="mt-2 text-[9px] leading-5 text-white/30">
                                                            {
                                                                evento.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </article>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </section>
                </aside>
            </section>

            {/* =================================================
                MODAL EVENTO
            ================================================= */}

            {modalEvento && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-3 backdrop-blur-md sm:items-center">
                    <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-[30px] border border-white/10 bg-[#06142d]">
                        <div className="flex items-center justify-between border-b border-white/10 p-6">
                            <div>
                                <p className="text-[7px] font-black uppercase tracking-[0.22em] text-cyan-300">
                                    Nuevo evento
                                </p>

                                <h3 className="mt-1 text-2xl font-black uppercase">
                                    {eventLabel(
                                        modalEvento
                                    )}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setModalEvento(
                                        null
                                    )
                                }
                                className="h-10 w-10 rounded-full border border-white/10"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-6 p-6">
                            {/* EQUIPO */}

                            <div>
                                <p className="text-[7px] font-black uppercase text-white/30">
                                    Equipo
                                </p>

                                <div className="mt-3 grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEquipoEvento(
                                                "home"
                                            );

                                            setJugadorEvento(
                                                ""
                                            );

                                            setJugadorSale(
                                                ""
                                            );

                                            setJugadorEntra(
                                                ""
                                            );
                                        }}
                                        className={`rounded-[16px] border p-4 text-xs font-black uppercase ${
                                            equipoEvento ===
                                            "home"
                                                ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-300"
                                                : "border-white/10"
                                        }`}
                                    >
                                        {
                                            match.home_team
                                        }
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEquipoEvento(
                                                "away"
                                            );

                                            setJugadorEvento(
                                                ""
                                            );

                                            setJugadorSale(
                                                ""
                                            );

                                            setJugadorEntra(
                                                ""
                                            );
                                        }}
                                        className={`rounded-[16px] border p-4 text-xs font-black uppercase ${
                                            equipoEvento ===
                                            "away"
                                                ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-300"
                                                : "border-white/10"
                                        }`}
                                    >
                                        {
                                            match.away_team
                                        }
                                    </button>
                                </div>
                            </div>

                            {/* EVENTOS NORMALES */}

                            {modalEvento !==
                                "substitution" && (
                                <div>
                                    <p className="text-[7px] font-black uppercase text-white/30">
                                        Seleccionar jugador
                                    </p>

                                    {jugadoresEvento.length ===
                                    0 ? (
                                        <p className="mt-3 rounded-[16px] border border-white/10 p-5 text-xs text-white/30">
                                            No hay jugadores cargados para este equipo.
                                        </p>
                                    ) : (
                                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                            {[
                                                ...titularesEvento,
                                                ...suplentesEvento,
                                            ].map(
                                                (
                                                    jugador
                                                ) => (
                                                    <button
                                                        key={
                                                            jugador.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setJugadorEvento(
                                                                jugador.player_name
                                                            )
                                                        }
                                                        className={`flex items-center gap-3 rounded-[16px] border p-3 text-left ${
                                                            jugadorEvento ===
                                                            jugador.player_name
                                                                ? "border-cyan-300/40 bg-cyan-300/10"
                                                                : "border-white/[0.07]"
                                                        }`}
                                                    >
                                                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[8px] font-black text-cyan-300">
                                                            {jugador.shirt_number ??
                                                                "—"}
                                                        </span>

                                                        <div>
                                                            <p className="text-[9px] font-black uppercase">
                                                                {
                                                                    jugador.player_name
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-[6px] uppercase text-white/25">
                                                                {jugador.is_starter
                                                                    ? "Titular"
                                                                    : "Suplente"}
                                                                {jugador.is_captain
                                                                    ? " · C"
                                                                    : ""}
                                                            </p>
                                                        </div>
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* CAMBIO */}

                            {modalEvento ===
                                "substitution" && (
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <p className="text-[7px] font-black uppercase text-red-300">
                                            Jugador que sale
                                        </p>

                                        <div className="mt-3 space-y-2">
                                            {titularesEvento.map(
                                                (
                                                    jugador
                                                ) => (
                                                    <button
                                                        key={
                                                            jugador.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setJugadorSale(
                                                                jugador.player_name
                                                            )
                                                        }
                                                        className={`w-full rounded-[14px] border p-3 text-left text-[9px] font-black uppercase ${
                                                            jugadorSale ===
                                                            jugador.player_name
                                                                ? "border-red-300/40 bg-red-500/10"
                                                                : "border-white/10"
                                                        }`}
                                                    >
                                                        #
                                                        {jugador.shirt_number ??
                                                            "—"}{" "}
                                                        {
                                                            jugador.player_name
                                                        }
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[7px] font-black uppercase text-emerald-300">
                                            Jugador que entra
                                        </p>

                                        <div className="mt-3 space-y-2">
                                            {suplentesEvento.map(
                                                (
                                                    jugador
                                                ) => (
                                                    <button
                                                        key={
                                                            jugador.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setJugadorEntra(
                                                                jugador.player_name
                                                            )
                                                        }
                                                        className={`w-full rounded-[14px] border p-3 text-left text-[9px] font-black uppercase ${
                                                            jugadorEntra ===
                                                            jugador.player_name
                                                                ? "border-emerald-300/40 bg-emerald-500/10"
                                                                : "border-white/10"
                                                        }`}
                                                    >
                                                        #
                                                        {jugador.shirt_number ??
                                                            "—"}{" "}
                                                        {
                                                            jugador.player_name
                                                        }
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <textarea
                                value={
                                    detalleEvento
                                }
                                onChange={(
                                    event
                                ) =>
                                    setDetalleEvento(
                                        event.target.value
                                    )
                                }
                                placeholder="Detalle opcional"
                                rows={3}
                                className="w-full resize-none rounded-[16px] border border-white/10 bg-black/20 p-4 text-sm outline-none"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-[16px] border border-white/10 p-4">
                                    <p className="text-[6px] uppercase text-white/25">
                                        Minuto
                                    </p>

                                    <p className="mt-2 font-mono text-2xl font-black text-cyan-300">
                                        {
                                            minutoActual
                                        }
                                        &apos;
                                    </p>
                                </div>

                                <div className="rounded-[16px] border border-white/10 p-4">
                                    <p className="text-[6px] uppercase text-white/25">
                                        Reloj
                                    </p>

                                    <p className="mt-2 font-mono text-2xl font-black">
                                        {
                                            reloj
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 border-t border-white/10 p-5">
                            <button
                                type="button"
                                onClick={() =>
                                    setModalEvento(
                                        null
                                    )
                                }
                                className="rounded-[16px] border border-white/10 p-4 text-[7px] font-black uppercase"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={
                                    guardarEvento
                                }
                                disabled={
                                    guardando ||
                                    (modalEvento ===
                                        "substitution"
                                        ? !jugadorSale ||
                                          !jugadorEntra
                                        : jugadoresEvento.length >
                                              0 &&
                                          !jugadorEvento)
                                }
                                className="rounded-[16px] bg-cyan-300 p-4 text-[7px] font-black uppercase text-[#06142d] disabled:opacity-30"
                            >
                                {guardando
                                    ? "Publicando..."
                                    : "Publicar evento"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}