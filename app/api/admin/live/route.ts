import {
    NextRequest,
    NextResponse,
} from "next/server";

import { supabaseAdmin } from "../../../../lib/supabase/server";

import {
    plantelGenesis,
} from "../../../../lib/datos-match-center";

/* =========================================================
   GÉNESIS LIVE OPS
   MATCH CONTROL SYSTEM
   ADMIN API
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

type EventoEntrada = {
    eventType?: EventType;

    team?: string | null;

    playerName?: string | null;
    playerOut?: string | null;
    playerIn?: string | null;

    title?: string | null;
    description?: string | null;

    minute?: number;
    second?: number;
    period?: number;
};

type StatEntrada = {
    team?: string;
    field?: StatField;
    delta?: number;
};

type AddedTimeEntrada = {
    period?: 1 | 2;
    delta?: number;
};

type LineupEntrada = {
    id?: string;

    team?: string;

    playerName?: string;

    shirtNumber?: number | null;

    position?: string | null;

    isStarter?: boolean;

    isCaptain?: boolean;

    sortOrder?: number;
};

type CuerpoPost = {
    action?: string;

    matchId?: string;

    event?: EventoEntrada;

    stat?: StatEntrada;

    addedTime?: AddedTimeEntrada;

    lineup?: LineupEntrada;
};

/* =========================================================
   ADMINISTRADORES
========================================================= */

function obtenerAdministradoresPermitidos() {
    const valor =
        process.env.ADMIN_EMAILS ?? "";

    return valor
        .split(",")
        .map((correo) =>
            correo
                .trim()
                .toLowerCase()
        )
        .filter(Boolean);
}

/* =========================================================
   AUTENTICACIÓN
========================================================= */

async function obtenerUsuarioAutenticado(
    request: NextRequest
) {
    const authorization =
        request.headers.get(
            "authorization"
        );

    if (
        !authorization ||
        !authorization.startsWith(
            "Bearer "
        )
    ) {
        return {
            usuario: null,

            error:
                NextResponse.json(
                    {
                        ok: false,

                        error:
                            "Sesión administrativa no encontrada.",
                    },
                    {
                        status: 401,
                    }
                ),
        };
    }

    const token =
        authorization
            .replace(
                "Bearer ",
                ""
            )
            .trim();

    if (!token) {
        return {
            usuario: null,

            error:
                NextResponse.json(
                    {
                        ok: false,

                        error:
                            "Token de sesión inválido.",
                    },
                    {
                        status: 401,
                    }
                ),
        };
    }

    const {
        data: {
            user,
        },
        error,
    } =
        await supabaseAdmin.auth.getUser(
            token
        );

    if (
        error ||
        !user
    ) {
        return {
            usuario: null,

            error:
                NextResponse.json(
                    {
                        ok: false,

                        error:
                            "La sesión administrativa expiró o no es válida.",
                    },
                    {
                        status: 401,
                    }
                ),
        };
    }

    const correo =
        user.email
            ?.trim()
            .toLowerCase() ??
        "";

    const permitidos =
        obtenerAdministradoresPermitidos();

    if (
        permitidos.length ===
        0
    ) {
        return {
            usuario: null,

            error:
                NextResponse.json(
                    {
                        ok: false,

                        error:
                            "El acceso administrativo todavía no está configurado.",
                    },
                    {
                        status: 500,
                    }
                ),
        };
    }

    if (
        !correo ||
        !permitidos.includes(
            correo
        )
    ) {
        return {
            usuario: null,

            error:
                NextResponse.json(
                    {
                        ok: false,

                        error:
                            "Este usuario no tiene permisos administrativos.",
                    },
                    {
                        status: 403,
                    }
                ),
        };
    }

    return {
        usuario: user,
        error: null,
    };
}

/* =========================================================
   HELPERS
========================================================= */

function ahoraIso() {
    return new Date().toISOString();
}

function normalizarEntero(
    valor: unknown,
    fallback = 0
) {
    if (
        typeof valor !==
            "number" ||
        !Number.isFinite(
            valor
        )
    ) {
        return fallback;
    }

    return Math.max(
        0,
        Math.floor(
            valor
        )
    );
}

function clamp(
    valor: number,
    min: number,
    max: number
) {
    return Math.min(
        max,
        Math.max(
            min,
            valor
        )
    );
}

function esStatField(
    valor: unknown
): valor is StatField {
    return (
        valor === "shots" ||
        valor ===
            "shots_on_target" ||
        valor === "corners" ||
        valor === "fouls" ||
        valor === "offsides" ||
        valor ===
            "yellow_cards" ||
        valor === "red_cards" ||
        valor === "saves" ||
        valor === "possession"
    );
}

/* =========================================================
   CRONÓMETRO
========================================================= */

function obtenerSegundosActuales(
    match: LiveMatch
) {
    const base =
        normalizarEntero(
            match.elapsed_seconds
        );

    const corre =
        match.status ===
            "first_half" ||
        match.status ===
            "second_half";

    if (
        !corre ||
        !match.period_started_at
    ) {
        return base;
    }

    const inicio =
        new Date(
            match.period_started_at
        ).getTime();

    if (
        Number.isNaN(
            inicio
        )
    ) {
        return base;
    }

    const transcurrido =
        Math.max(
            0,
            Date.now() -
                inicio
        ) / 1000;

    return Math.floor(
        base +
            transcurrido
    );
}

/* =========================================================
   PARTIDO
========================================================= */

async function obtenerPartidoPorId(
    id: string
) {
    const {
        data,
        error,
    } =
        await supabaseAdmin
            .from(
                "live_matches"
            )
            .select("*")
            .eq(
                "id",
                id
            )
            .maybeSingle();

    if (error) {
        throw error;
    }

    return data as
        | LiveMatch
        | null;
}

/* =========================================================
   ESTADO COMPLETO
========================================================= */

async function cargarEstadoCompleto(
    matchId: string
) {
    const [
        matchResult,
        eventsResult,
        statsResult,
        lineupsResult,
    ] =
        await Promise.all([
            supabaseAdmin
                .from(
                    "live_matches"
                )
                .select("*")
                .eq(
                    "id",
                    matchId
                )
                .maybeSingle(),

            supabaseAdmin
                .from(
                    "live_match_events"
                )
                .select("*")
                .eq(
                    "match_id",
                    matchId
                )
                .order(
                    "created_at",
                    {
                        ascending:
                            false,
                    }
                ),

            supabaseAdmin
                .from(
                    "live_match_stats"
                )
                .select("*")
                .eq(
                    "match_id",
                    matchId
                ),

            supabaseAdmin
                .from(
                    "live_match_lineups"
                )
                .select("*")
                .eq(
                    "match_id",
                    matchId
                )
                .order(
                    "team",
                    {
                        ascending:
                            true,
                    }
                )
                .order(
                    "is_starter",
                    {
                        ascending:
                            false,
                    }
                )
                .order(
                    "sort_order",
                    {
                        ascending:
                            true,
                    }
                )
                .order(
                    "shirt_number",
                    {
                        ascending:
                            true,
                    }
                ),
        ]);

    if (
        matchResult.error
    ) {
        throw matchResult.error;
    }

    if (
        eventsResult.error
    ) {
        throw eventsResult.error;
    }

    if (
        statsResult.error
    ) {
        throw statsResult.error;
    }

    if (
        lineupsResult.error
    ) {
        throw lineupsResult.error;
    }

    return {
        match:
            matchResult.data,

        events:
            eventsResult.data ??
            [],

        stats:
            statsResult.data ??
            [],

        lineups:
            lineupsResult.data ??
            [],
    };
}

/* =========================================================
   AUDITORÍA
========================================================= */

async function registrarAuditoria({
    matchId,
    actionType,
    userId,
    userEmail,
    payload,
}: {
    matchId: string;

    actionType: string;

    userId: string;

    userEmail: string;

    payload?: Record<
        string,
        unknown
    >;
}) {
    const {
        error,
    } =
        await supabaseAdmin
            .from(
                "live_match_audit"
            )
            .insert({
                match_id:
                    matchId,

                action_type:
                    actionType,

                payload: {
                    operator_id:
                        userId,

                    operator_email:
                        userEmail,

                    ...(payload ??
                        {}),
                },
            });

    if (error) {
        console.error(
            "Live Ops audit error:",
            error
        );
    }
}

/* =========================================================
   EVENTO DE SISTEMA
========================================================= */

async function insertarEventoSistema({
    match,
    eventType,
    title,
}: {
    match: LiveMatch;

    eventType: EventType;

    title: string;
}) {
    const segundos =
        obtenerSegundosActuales(
            match
        );

    const {
        error,
    } =
        await supabaseAdmin
            .from(
                "live_match_events"
            )
            .insert({
                match_id:
                    match.id,

                minute:
                    Math.floor(
                        segundos /
                            60
                    ),

                second:
                    segundos %
                    60,

                period:
                    Math.max(
                        1,
                        match.current_period ||
                            1
                    ),

                event_type:
                    eventType,

                team: null,

                player_name:
                    null,

                player_out:
                    null,

                player_in:
                    null,

                title,

                description:
                    null,
            });

    if (error) {
        console.error(
            "Error creando evento de sistema:",
            error
        );
    }
}

/* =========================================================
   STAT AUTOMÁTICA
========================================================= */

async function incrementarStat({
    matchId,
    team,
    campo,
}: {
    matchId: string;

    team: string;

    campo:
        | "yellow_cards"
        | "red_cards"
        | "saves";
}) {
    const {
        data,
        error,
    } =
        await supabaseAdmin
            .from(
                "live_match_stats"
            )
            .select("*")
            .eq(
                "match_id",
                matchId
            )
            .eq(
                "team",
                team
            )
            .maybeSingle();

    if (
        error ||
        !data
    ) {
        if (error) {
            console.error(
                error
            );
        }

        return;
    }

    const actual =
        normalizarEntero(
            data[campo]
        );

    const {
        error:
            updateError,
    } =
        await supabaseAdmin
            .from(
                "live_match_stats"
            )
            .update({
                [campo]:
                    actual + 1,
            })
            .eq(
                "id",
                data.id
            );

    if (
        updateError
    ) {
        console.error(
            updateError
        );
    }
}

/* =========================================================
   CAMBIO DE JUGADORES EN CANCHA
========================================================= */

async function aplicarCambioAlineacion({
    matchId,
    team,
    playerOut,
    playerIn,
}: {
    matchId: string;
    team: string;
    playerOut: string;
    playerIn: string;
}) {
    if (
        playerOut.trim().toLowerCase() ===
        playerIn.trim().toLowerCase()
    ) {
        throw new Error(
            "El jugador que entra no puede ser el mismo que sale."
        );
    }

    const [
        salienteResult,
        entranteResult,
    ] =
        await Promise.all([
            supabaseAdmin
                .from(
                    "live_match_lineups"
                )
                .select("*")
                .eq(
                    "match_id",
                    matchId
                )
                .eq(
                    "team",
                    team
                )
                .eq(
                    "player_name",
                    playerOut
                )
                .maybeSingle(),

            supabaseAdmin
                .from(
                    "live_match_lineups"
                )
                .select("*")
                .eq(
                    "match_id",
                    matchId
                )
                .eq(
                    "team",
                    team
                )
                .eq(
                    "player_name",
                    playerIn
                )
                .maybeSingle(),
        ]);

    if (
        salienteResult.error
    ) {
        throw salienteResult.error;
    }

    if (
        entranteResult.error
    ) {
        throw entranteResult.error;
    }

    if (
        !salienteResult.data
    ) {
        throw new Error(
            "No se encontró al jugador que sale."
        );
    }

    if (
        !entranteResult.data
    ) {
        throw new Error(
            "No se encontró al jugador que entra."
        );
    }

    if (
        !salienteResult.data
            .is_starter
    ) {
        throw new Error(
            "El jugador seleccionado para salir no está actualmente en cancha."
        );
    }

    if (
        entranteResult.data
            .is_starter
    ) {
        throw new Error(
            "El jugador seleccionado para entrar ya está en cancha."
        );
    }

    const [
        salidaUpdate,
        entradaUpdate,
    ] =
        await Promise.all([
            supabaseAdmin
                .from(
                    "live_match_lineups"
                )
                .update({
                    is_starter:
                        false,

                    is_captain:
                        false,
                })
                .eq(
                    "id",
                    salienteResult
                        .data.id
                ),

            supabaseAdmin
                .from(
                    "live_match_lineups"
                )
                .update({
                    is_starter:
                        true,
                })
                .eq(
                    "id",
                    entranteResult
                        .data.id
                ),
        ]);

    if (
        salidaUpdate.error
    ) {
        throw salidaUpdate.error;
    }

    if (
        entradaUpdate.error
    ) {
        throw entradaUpdate.error;
    }

    return {
        saliente:
            salienteResult.data,

        entrante:
            entranteResult.data,
    };
}

/* =========================================================
   GET
========================================================= */

export async function GET(
    request: NextRequest
) {
    try {
        const autenticacion =
            await obtenerUsuarioAutenticado(
                request
            );

        if (
            autenticacion.error
        ) {
            return autenticacion.error;
        }

        const slug =
            request.nextUrl
                .searchParams
                .get(
                    "slug"
                );

        if (!slug) {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "Falta el slug del partido.",
                },
                {
                    status: 400,
                }
            );
        }

        const {
            data: match,
            error:
                matchError,
        } =
            await supabaseAdmin
                .from(
                    "live_matches"
                )
                .select("*")
                .eq(
                    "slug",
                    slug
                )
                .maybeSingle();

        if (
            matchError
        ) {
            console.error(
                matchError
            );

            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "No se pudo cargar el partido.",
                },
                {
                    status: 500,
                }
            );
        }

        if (!match) {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "El partido solicitado no existe.",
                },
                {
                    status: 404,
                }
            );
        }

        const estado =
            await cargarEstadoCompleto(
                match.id
            );

        return NextResponse.json({
            ok: true,

            administrador: {
                id:
                    autenticacion
                        .usuario
                        ?.id ??
                    "",

                correo:
                    autenticacion
                        .usuario
                        ?.email ??
                    "",
            },

            ...estado,
        });
    } catch (error) {
        console.error(
            "Live Ops GET error:",
            error
        );

        return NextResponse.json(
            {
                ok: false,

                error:
                    "Ocurrió un error inesperado cargando Génesis Live Ops.",
            },
            {
                status: 500,
            }
        );
    }
}

/* =========================================================
   POST
========================================================= */

export async function POST(
    request: NextRequest
) {
    try {
        const autenticacion =
            await obtenerUsuarioAutenticado(
                request
            );

        if (
            autenticacion.error
        ) {
            return autenticacion.error;
        }

        const body =
            (await request.json()) as CuerpoPost;

        const action =
            body.action?.trim();

        const matchId =
            body.matchId?.trim();

        if (
            !action ||
            !matchId
        ) {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "Falta la acción o el partido.",
                },
                {
                    status: 400,
                }
            );
        }

        const match =
            await obtenerPartidoPorId(
                matchId
            );

        if (!match) {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "El partido no existe.",
                },
                {
                    status: 404,
                }
            );
        }

        const userId =
            autenticacion
                .usuario
                ?.id ??
            "";

        const userEmail =
            autenticacion
                .usuario
                ?.email ??
            "";

        const ahora =
            ahoraIso();

        /* =================================================
           INICIAR 1T
        ================================================= */

        if (
            action ===
            "start_first_half"
        ) {
            if (
                match.status !==
                "pre_match"
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "El primer tiempo solo puede iniciarse desde la previa.",
                    },
                    {
                        status: 409,
                    }
                );
            }

            const {
                error,
            } =
                await supabaseAdmin
                    .from(
                        "live_matches"
                    )
                    .update({
                        status:
                            "first_half",

                        current_period:
                            1,

                        period_started_at:
                            ahora,

                        paused_at:
                            null,

                        elapsed_seconds:
                            0,

                        is_live:
                            true,
                    })
                    .eq(
                        "id",
                        matchId
                    );

            if (error) {
                throw error;
            }

            const actualizado =
                await obtenerPartidoPorId(
                    matchId
                );

            if (actualizado) {
                await insertarEventoSistema({
                    match:
                        actualizado,

                    eventType:
                        "kickoff",

                    title:
                        "Comienza el partido",
                });
            }

            await registrarAuditoria({
                matchId,
                actionType:
                    action,
                userId,
                userEmail,
            });
        }

        /* =================================================
           PAUSA
        ================================================= */

        else if (
            action ===
            "pause"
        ) {
            if (
                match.status !==
                    "first_half" &&
                match.status !==
                    "second_half"
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "El reloj solo puede pausarse mientras el partido está corriendo.",
                    },
                    {
                        status: 409,
                    }
                );
            }

            const segundos =
                obtenerSegundosActuales(
                    match
                );

            const {
                error,
            } =
                await supabaseAdmin
                    .from(
                        "live_matches"
                    )
                    .update({
                        status:
                            "paused",

                        elapsed_seconds:
                            segundos,

                        period_started_at:
                            null,

                        paused_at:
                            ahora,

                        is_live:
                            true,
                    })
                    .eq(
                        "id",
                        matchId
                    );

            if (error) {
                throw error;
            }

            await registrarAuditoria({
                matchId,
                actionType:
                    action,
                userId,
                userEmail,

                payload: {
                    elapsed_seconds:
                        segundos,
                },
            });
        }

        /* =================================================
           REANUDAR
        ================================================= */

        else if (
            action ===
            "resume"
        ) {
            if (
                match.status !==
                "paused"
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "El partido no está pausado.",
                    },
                    {
                        status: 409,
                    }
                );
            }

            const nuevoStatus:
                MatchStatus =
                match.current_period ===
                2
                    ? "second_half"
                    : "first_half";

            const {
                error,
            } =
                await supabaseAdmin
                    .from(
                        "live_matches"
                    )
                    .update({
                        status:
                            nuevoStatus,

                        period_started_at:
                            ahora,

                        paused_at:
                            null,

                        is_live:
                            true,
                    })
                    .eq(
                        "id",
                        matchId
                    );

            if (error) {
                throw error;
            }

            await registrarAuditoria({
                matchId,
                actionType:
                    action,
                userId,
                userEmail,
            });
        }

        /* =================================================
           DESCANSO
        ================================================= */

        else if (
            action ===
            "halftime"
        ) {
            if (
                match.current_period !==
                1
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "El descanso solo puede marcarse durante el primer tiempo.",
                    },
                    {
                        status: 409,
                    }
                );
            }

            const segundos =
                obtenerSegundosActuales(
                    match
                );

            const {
                error,
            } =
                await supabaseAdmin
                    .from(
                        "live_matches"
                    )
                    .update({
                        status:
                            "halftime",

                        elapsed_seconds:
                            segundos,

                        period_started_at:
                            null,

                        paused_at:
                            null,

                        is_live:
                            true,
                    })
                    .eq(
                        "id",
                        matchId
                    );

            if (error) {
                throw error;
            }

            const actualizado =
                await obtenerPartidoPorId(
                    matchId
                );

            if (actualizado) {
                await insertarEventoSistema({
                    match:
                        actualizado,

                    eventType:
                        "halftime",

                    title:
                        "Final del primer tiempo",
                });
            }

            await registrarAuditoria({
                matchId,
                actionType:
                    action,
                userId,
                userEmail,

                payload: {
                    elapsed_seconds:
                        segundos,
                },
            });
        }

        /* =================================================
           INICIAR 2T
        ================================================= */

        else if (
            action ===
            "start_second_half"
        ) {
            if (
                match.status !==
                "halftime"
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "El segundo tiempo solo puede iniciarse desde el descanso.",
                    },
                    {
                        status: 409,
                    }
                );
            }

            const segundosBase =
                Math.max(
                    45 * 60,
                    normalizarEntero(
                        match.elapsed_seconds
                    )
                );

            const {
                error,
            } =
                await supabaseAdmin
                    .from(
                        "live_matches"
                    )
                    .update({
                        status:
                            "second_half",

                        current_period:
                            2,

                        elapsed_seconds:
                            segundosBase,

                        period_started_at:
                            ahora,

                        paused_at:
                            null,

                        is_live:
                            true,
                    })
                    .eq(
                        "id",
                        matchId
                    );

            if (error) {
                throw error;
            }

            const actualizado =
                await obtenerPartidoPorId(
                    matchId
                );

            if (actualizado) {
                await insertarEventoSistema({
                    match:
                        actualizado,

                    eventType:
                        "second_half",

                    title:
                        "Comienza el segundo tiempo",
                });
            }

            await registrarAuditoria({
                matchId,
                actionType:
                    action,
                userId,
                userEmail,

                payload: {
                    elapsed_seconds:
                        segundosBase,
                },
            });
        }

        /* =================================================
           FINAL
        ================================================= */

        else if (
            action ===
            "finish"
        ) {
            if (
                match.status ===
                "pre_match"
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "No se puede finalizar un partido que todavía no comenzó.",
                    },
                    {
                        status: 409,
                    }
                );
            }

            const segundos =
                obtenerSegundosActuales(
                    match
                );

            const {
                error,
            } =
                await supabaseAdmin
                    .from(
                        "live_matches"
                    )
                    .update({
                        status:
                            "finished",

                        elapsed_seconds:
                            segundos,

                        period_started_at:
                            null,

                        paused_at:
                            null,

                        is_live:
                            false,
                    })
                    .eq(
                        "id",
                        matchId
                    );

            if (error) {
                throw error;
            }

            const actualizado =
                await obtenerPartidoPorId(
                    matchId
                );

            if (actualizado) {
                await insertarEventoSistema({
                    match:
                        actualizado,

                    eventType:
                        "fulltime",

                    title:
                        "Final del partido",
                });
            }

            await registrarAuditoria({
                matchId,
                actionType:
                    action,
                userId,
                userEmail,

                payload: {
                    elapsed_seconds:
                        segundos,
                },
            });
        }

        /* =================================================
           MARCADOR
        ================================================= */

        else if (
            action ===
                "home_goal" ||
            action ===
                "away_goal" ||
            action ===
                "home_goal_remove" ||
            action ===
                "away_goal_remove"
        ) {
            let home =
                match.home_score;

            let away =
                match.away_score;

            if (
                action ===
                "home_goal"
            ) {
                home += 1;
            }

            if (
                action ===
                "away_goal"
            ) {
                away += 1;
            }

            if (
                action ===
                "home_goal_remove"
            ) {
                home =
                    Math.max(
                        0,
                        home - 1
                    );
            }

            if (
                action ===
                "away_goal_remove"
            ) {
                away =
                    Math.max(
                        0,
                        away - 1
                    );
            }

            const {
                error,
            } =
                await supabaseAdmin
                    .from(
                        "live_matches"
                    )
                    .update({
                        home_score:
                            home,

                        away_score:
                            away,
                    })
                    .eq(
                        "id",
                        matchId
                    );

            if (error) {
                throw error;
            }

            await registrarAuditoria({
                matchId,
                actionType:
                    action,
                userId,
                userEmail,

                payload: {
                    home_score:
                        home,

                    away_score:
                        away,
                },
            });
        }

        /* =================================================
           TIEMPO AÑADIDO
        ================================================= */

        else if (
            action ===
            "update_added_time"
        ) {
            const period =
                body.addedTime
                    ?.period;

            const delta =
                body.addedTime
                    ?.delta;

            if (
                period !== 1 &&
                period !== 2
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "El periodo del tiempo añadido debe ser 1 o 2.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            if (
                typeof delta !==
                    "number" ||
                !Number.isFinite(
                    delta
                )
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "El cambio de tiempo añadido no es válido.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const deltaEntero =
                Math.trunc(
                    delta
                );

            if (
                deltaEntero ===
                0
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "El tiempo añadido debe aumentar o disminuir al menos un minuto.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const campo =
                period === 1
                    ? "added_time_first_half"
                    : "added_time_second_half";

            const anterior =
                normalizarEntero(
                    period === 1
                        ? match.added_time_first_half
                        : match.added_time_second_half
                );

            /*
             * Máximo operativo de 30 minutos.
             * Es suficientemente amplio para fútbol real
             * y evita valores accidentales absurdos.
             */

            const nuevo =
                clamp(
                    anterior +
                        deltaEntero,
                    0,
                    30
                );

            const {
                error,
            } =
                await supabaseAdmin
                    .from(
                        "live_matches"
                    )
                    .update({
                        [campo]:
                            nuevo,
                    })
                    .eq(
                        "id",
                        matchId
                    );

            if (error) {
                throw error;
            }

            await registrarAuditoria({
                matchId,

                actionType:
                    "update_added_time",

                userId,
                userEmail,

                payload: {
                    period,

                    field:
                        campo,

                    previous:
                        anterior,

                    delta:
                        deltaEntero,

                    next:
                        nuevo,
                },
            });
        }

        /* =================================================
           UPDATE STAT
        ================================================= */

        else if (
            action ===
            "update_stat"
        ) {
            const stat =
                body.stat;

            const team =
                stat?.team?.trim();

            const field =
                stat?.field;

            const delta =
                stat?.delta;

            if (
                !team ||
                !esStatField(
                    field
                ) ||
                typeof delta !==
                    "number" ||
                !Number.isFinite(
                    delta
                )
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "Datos de estadística inválidos.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            if (
                team !==
                    match.home_team &&
                team !==
                    match.away_team
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "El equipo indicado no pertenece a este partido.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const {
                data:
                    statActual,
                error:
                    statError,
            } =
                await supabaseAdmin
                    .from(
                        "live_match_stats"
                    )
                    .select("*")
                    .eq(
                        "match_id",
                        matchId
                    )
                    .eq(
                        "team",
                        team
                    )
                    .maybeSingle();

            if (
                statError
            ) {
                throw statError;
            }

            if (
                !statActual
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "No existe el registro de estadísticas para este equipo.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            if (
                field ===
                "possession"
            ) {
                const rival =
                    team ===
                    match.home_team
                        ? match.away_team
                        : match.home_team;

                const {
                    data:
                        statRival,
                    error:
                        rivalError,
                } =
                    await supabaseAdmin
                        .from(
                            "live_match_stats"
                        )
                        .select("*")
                        .eq(
                            "match_id",
                            matchId
                        )
                        .eq(
                            "team",
                            rival
                        )
                        .maybeSingle();

                if (
                    rivalError
                ) {
                    throw rivalError;
                }

                if (
                    !statRival
                ) {
                    return NextResponse.json(
                        {
                            ok: false,

                            error:
                                "No existe el registro de estadísticas del rival.",
                        },
                        {
                            status: 404,
                        }
                    );
                }

                const anterior =
                    typeof statActual.possession ===
                    "number"
                        ? statActual.possession
                        : 50;

                const nuevo =
                    clamp(
                        anterior +
                            delta,
                        0,
                        100
                    );

                const nuevoRival =
                    100 -
                    nuevo;

                const [
                    principal,
                    contrario,
                ] =
                    await Promise.all([
                        supabaseAdmin
                            .from(
                                "live_match_stats"
                            )
                            .update({
                                possession:
                                    nuevo,
                            })
                            .eq(
                                "id",
                                statActual.id
                            ),

                        supabaseAdmin
                            .from(
                                "live_match_stats"
                            )
                            .update({
                                possession:
                                    nuevoRival,
                            })
                            .eq(
                                "id",
                                statRival.id
                            ),
                    ]);

                if (
                    principal.error
                ) {
                    throw principal.error;
                }

                if (
                    contrario.error
                ) {
                    throw contrario.error;
                }

                await registrarAuditoria({
                    matchId,
                    actionType:
                        "update_possession",
                    userId,
                    userEmail,

                    payload: {
                        team,
                        possession:
                            nuevo,

                        opponent:
                            rival,

                        opponent_possession:
                            nuevoRival,
                    },
                });
            } else {
                const anterior =
                    normalizarEntero(
                        statActual[
                            field
                        ]
                    );

                const nuevo =
                    Math.max(
                        0,
                        Math.floor(
                            anterior +
                                delta
                        )
                    );

                const {
                    error,
                } =
                    await supabaseAdmin
                        .from(
                            "live_match_stats"
                        )
                        .update({
                            [field]:
                                nuevo,
                        })
                        .eq(
                            "id",
                            statActual.id
                        );

                if (error) {
                    throw error;
                }

                await registrarAuditoria({
                    matchId,
                    actionType:
                        "update_stat",
                    userId,
                    userEmail,

                    payload: {
                        team,
                        field,
                        previous:
                            anterior,
                        next:
                            nuevo,
                    },
                });
            }
        }

        /* =================================================
           CARGAR PLANTEL GÉNESIS
        ================================================= */

        else if (
            action ===
            "seed_genesis_roster"
        ) {
            const team =
                match.home_team ===
                "Génesis FC"
                    ? match.home_team
                    : match.away_team ===
                        "Génesis FC"
                      ? match.away_team
                      : null;

            if (!team) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "Génesis FC no participa en este partido.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const {
                data:
                    existentes,
                error:
                    existentesError,
            } =
                await supabaseAdmin
                    .from(
                        "live_match_lineups"
                    )
                    .select(
                        "player_name"
                    )
                    .eq(
                        "match_id",
                        matchId
                    )
                    .eq(
                        "team",
                        team
                    );

            if (
                existentesError
            ) {
                throw existentesError;
            }

            const nombresExistentes =
                new Set(
                    (
                        existentes ??
                        []
                    ).map(
                        (
                            item
                        ) =>
                            String(
                                item.player_name
                            )
                                .trim()
                                .toLowerCase()
                    )
                );

            const nuevos =
                plantelGenesis
                    .filter(
                        (
                            jugador
                        ) =>
                            !nombresExistentes.has(
                                jugador.nombre
                                    .trim()
                                    .toLowerCase()
                            )
                    )
                    .map(
                        (
                            jugador,
                            index
                        ) => ({
                            match_id:
                                matchId,

                            team,

                            player_name:
                                jugador.nombre,

                            shirt_number:
                                jugador.dorsal,

                            position:
                                jugador.posicion,

                            is_starter:
                                false,

                            is_captain:
                                false,

                            sort_order:
                                index,
                        })
                    );

            if (
                nuevos.length >
                0
            ) {
                const {
                    error,
                } =
                    await supabaseAdmin
                        .from(
                            "live_match_lineups"
                        )
                        .insert(
                            nuevos
                        );

                if (error) {
                    throw error;
                }
            }

            await registrarAuditoria({
                matchId,
                actionType:
                    action,
                userId,
                userEmail,

                payload: {
                    team,

                    inserted:
                        nuevos.length,
                },
            });
        }

        /* =================================================
           AGREGAR JUGADOR
        ================================================= */

        else if (
            action ===
            "add_lineup_player"
        ) {
            const lineup =
                body.lineup;

            const team =
                lineup?.team?.trim();

            const playerName =
                lineup?.playerName?.trim();

            if (
                !team ||
                !playerName
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "Falta el equipo o el nombre del jugador.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            if (
                team !==
                    match.home_team &&
                team !==
                    match.away_team
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "El equipo no pertenece a este partido.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const dorsal =
                lineup?.shirtNumber ===
                    null ||
                lineup?.shirtNumber ===
                    undefined
                    ? null
                    : normalizarEntero(
                          lineup.shirtNumber
                      );

            const {
                data:
                    existente,
                error:
                    existenteError,
            } =
                await supabaseAdmin
                    .from(
                        "live_match_lineups"
                    )
                    .select(
                        "id"
                    )
                    .eq(
                        "match_id",
                        matchId
                    )
                    .eq(
                        "team",
                        team
                    )
                    .ilike(
                        "player_name",
                        playerName
                    )
                    .maybeSingle();

            if (
                existenteError
            ) {
                throw existenteError;
            }

            if (existente) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "Ese jugador ya está cargado en el plantel.",
                    },
                    {
                        status: 409,
                    }
                );
            }

            const {
                error,
            } =
                await supabaseAdmin
                    .from(
                        "live_match_lineups"
                    )
                    .insert({
                        match_id:
                            matchId,

                        team,

                        player_name:
                            playerName,

                        shirt_number:
                            dorsal,

                        position:
                            lineup?.position?.trim() ||
                            null,

                        is_starter:
                            Boolean(
                                lineup?.isStarter
                            ),

                        is_captain:
                            false,

                        sort_order:
                            normalizarEntero(
                                lineup?.sortOrder,
                                0
                            ),
                    });

            if (error) {
                throw error;
            }

            await registrarAuditoria({
                matchId,
                actionType:
                    action,
                userId,
                userEmail,

                payload: {
                    team,

                    player_name:
                        playerName,

                    shirt_number:
                        dorsal,
                },
            });
        }

        /* =================================================
           ACTUALIZAR JUGADOR
        ================================================= */

        else if (
            action ===
            "update_lineup_player"
        ) {
            const lineup =
                body.lineup;

            const id =
                lineup?.id?.trim();

            if (!id) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "Falta el jugador que se desea actualizar.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const {
                data:
                    jugador,
                error:
                    jugadorError,
            } =
                await supabaseAdmin
                    .from(
                        "live_match_lineups"
                    )
                    .select("*")
                    .eq(
                        "id",
                        id
                    )
                    .eq(
                        "match_id",
                        matchId
                    )
                    .maybeSingle();

            if (
                jugadorError
            ) {
                throw jugadorError;
            }

            if (!jugador) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "El jugador no pertenece a este partido.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            const isStarter =
                typeof lineup?.isStarter ===
                "boolean"
                    ? lineup.isStarter
                    : Boolean(
                          jugador.is_starter
                      );

            let isCaptain =
                typeof lineup?.isCaptain ===
                "boolean"
                    ? lineup.isCaptain
                    : Boolean(
                          jugador.is_captain
                      );

            if (
                isCaptain &&
                !isStarter
            ) {
                isCaptain =
                    false;
            }

            if (isCaptain) {
                const {
                    error:
                        captainError,
                } =
                    await supabaseAdmin
                        .from(
                            "live_match_lineups"
                        )
                        .update({
                            is_captain:
                                false,
                        })
                        .eq(
                            "match_id",
                            matchId
                        )
                        .eq(
                            "team",
                            jugador.team
                        );

                if (
                    captainError
                ) {
                    throw captainError;
                }
            }

            const updateData: Record<
                string,
                unknown
            > = {
                is_starter:
                    isStarter,

                is_captain:
                    isCaptain,
            };

            if (
                typeof lineup?.playerName ===
                    "string" &&
                lineup.playerName.trim()
            ) {
                updateData.player_name =
                    lineup.playerName.trim();
            }

            if (
                lineup?.shirtNumber !==
                undefined
            ) {
                updateData.shirt_number =
                    lineup.shirtNumber ===
                    null
                        ? null
                        : normalizarEntero(
                              lineup.shirtNumber
                          );
            }

            if (
                lineup?.position !==
                undefined
            ) {
                updateData.position =
                    lineup.position?.trim() ||
                    null;
            }

            if (
                typeof lineup?.sortOrder ===
                "number"
            ) {
                updateData.sort_order =
                    normalizarEntero(
                        lineup.sortOrder
                    );
            }

            const {
                error,
            } =
                await supabaseAdmin
                    .from(
                        "live_match_lineups"
                    )
                    .update(
                        updateData
                    )
                    .eq(
                        "id",
                        id
                    )
                    .eq(
                        "match_id",
                        matchId
                    );

            if (error) {
                throw error;
            }

            await registrarAuditoria({
                matchId,
                actionType:
                    action,
                userId,
                userEmail,

                payload: {
                    lineup_id:
                        id,

                    player_name:
                        jugador.player_name,

                    is_starter:
                        isStarter,

                    is_captain:
                        isCaptain,
                },
            });
        }

        /* =================================================
           ELIMINAR JUGADOR
        ================================================= */

        else if (
            action ===
            "delete_lineup_player"
        ) {
            const id =
                body.lineup?.id?.trim();

            if (!id) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "Falta el jugador que se desea eliminar.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const {
                data:
                    jugador,
                error:
                    jugadorError,
            } =
                await supabaseAdmin
                    .from(
                        "live_match_lineups"
                    )
                    .select("*")
                    .eq(
                        "id",
                        id
                    )
                    .eq(
                        "match_id",
                        matchId
                    )
                    .maybeSingle();

            if (
                jugadorError
            ) {
                throw jugadorError;
            }

            if (!jugador) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "El jugador no existe en este partido.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            const {
                error,
            } =
                await supabaseAdmin
                    .from(
                        "live_match_lineups"
                    )
                    .delete()
                    .eq(
                        "id",
                        id
                    )
                    .eq(
                        "match_id",
                        matchId
                    );

            if (error) {
                throw error;
            }

            await registrarAuditoria({
                matchId,
                actionType:
                    action,
                userId,
                userEmail,

                payload: {
                    player_name:
                        jugador.player_name,

                    team:
                        jugador.team,
                },
            });
        }

        /* =================================================
           NUEVO EVENTO
        ================================================= */

        else if (
            action ===
            "add_event"
        ) {
            const event =
                body.event;

            if (
                !event ||
                !event.eventType
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "Falta el tipo de evento.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            if (
                match.status ===
                    "pre_match" ||
                match.status ===
                    "finished"
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "No se pueden publicar eventos en el estado actual del partido.",
                    },
                    {
                        status: 409,
                    }
                );
            }

            const segundos =
                obtenerSegundosActuales(
                    match
                );

            const minuto =
                typeof event.minute ===
                "number"
                    ? normalizarEntero(
                          event.minute
                      )
                    : Math.floor(
                          segundos /
                              60
                      );

            const segundo =
                typeof event.second ===
                "number"
                    ? Math.min(
                          59,
                          normalizarEntero(
                              event.second
                          )
                      )
                    : segundos %
                      60;

            const team =
                event.team?.trim() ||
                null;

            if (
                team &&
                team !==
                    match.home_team &&
                team !==
                    match.away_team
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "El equipo del evento no pertenece a este partido.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const playerName =
                event.playerName
                    ?.trim() ||
                null;

            const playerOut =
                event.playerOut
                    ?.trim() ||
                null;

            const playerIn =
                event.playerIn
                    ?.trim() ||
                null;

            /* =============================================
               VALIDAR CAMBIO
            ============================================= */

            if (
                event.eventType ===
                "substitution"
            ) {
                if (
                    !team ||
                    !playerOut ||
                    !playerIn
                ) {
                    return NextResponse.json(
                        {
                            ok: false,

                            error:
                                "Para registrar un cambio debes seleccionar equipo, jugador que sale y jugador que entra.",
                        },
                        {
                            status: 400,
                        }
                    );
                }

                await aplicarCambioAlineacion({
                    matchId,
                    team,
                    playerOut,
                    playerIn,
                });
            }

            /* =============================================
               GOL
            ============================================= */

            if (
                event.eventType ===
                    "goal" &&
                team
            ) {
                if (
                    team ===
                    match.home_team
                ) {
                    const {
                        error,
                    } =
                        await supabaseAdmin
                            .from(
                                "live_matches"
                            )
                            .update({
                                home_score:
                                    match.home_score +
                                    1,
                            })
                            .eq(
                                "id",
                                matchId
                            );

                    if (error) {
                        throw error;
                    }
                } else {
                    const {
                        error,
                    } =
                        await supabaseAdmin
                            .from(
                                "live_matches"
                            )
                            .update({
                                away_score:
                                    match.away_score +
                                    1,
                            })
                            .eq(
                                "id",
                                matchId
                            );

                    if (error) {
                        throw error;
                    }
                }
            }

            /* =============================================
               GUARDAR EVENTO
            ============================================= */

            const {
                error,
            } =
                await supabaseAdmin
                    .from(
                        "live_match_events"
                    )
                    .insert({
                        match_id:
                            matchId,

                        minute:
                            minuto,

                        second:
                            segundo,

                        period:
                            event.period ===
                            2
                                ? 2
                                : 1,

                        event_type:
                            event.eventType,

                        team,

                        player_name:
                            playerName,

                        player_out:
                            playerOut,

                        player_in:
                            playerIn,

                        title:
                            event.title?.trim() ||
                            null,

                        description:
                            event.description?.trim() ||
                            null,
                    });

            if (error) {
                throw error;
            }

            /* =============================================
               STATS AUTOMÁTICAS
            ============================================= */

            if (team) {
                if (
                    event.eventType ===
                    "yellow_card"
                ) {
                    await incrementarStat({
                        matchId,
                        team,
                        campo:
                            "yellow_cards",
                    });
                }

                if (
                    event.eventType ===
                    "red_card"
                ) {
                    await incrementarStat({
                        matchId,
                        team,
                        campo:
                            "red_cards",
                    });
                }

                if (
                    event.eventType ===
                    "save"
                ) {
                    await incrementarStat({
                        matchId,
                        team,
                        campo:
                            "saves",
                    });
                }
            }

            await registrarAuditoria({
                matchId,
                actionType:
                    action,
                userId,
                userEmail,

                payload: {
                    event_type:
                        event.eventType,

                    team,

                    player_name:
                        playerName,

                    player_out:
                        playerOut,

                    player_in:
                        playerIn,

                    minute:
                        minuto,

                    second:
                        segundo,

                    lineup_updated:
                        event.eventType ===
                        "substitution",
                },
            });
        }

        /* =================================================
           ACCIÓN DESCONOCIDA
        ================================================= */

        else {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "Acción de Live Ops no reconocida.",
                },
                {
                    status: 400,
                }
            );
        }

        /* =================================================
           RESPUESTA SINCRONIZADA
        ================================================= */

        const estado =
            await cargarEstadoCompleto(
                matchId
            );

        return NextResponse.json({
            ok: true,

            administrador: {
                id:
                    userId,

                correo:
                    userEmail,
            },

            ...estado,
        });
    } catch (error) {
        console.error(
            "Live Ops POST error:",
            error
        );

        const mensaje =
            error instanceof Error &&
            error.message
                ? error.message
                : "Ocurrió un error inesperado procesando la operación de Live Ops.";

        return NextResponse.json(
            {
                ok: false,

                error:
                    mensaje,
            },
            {
                status: 500,
            }
        );
    }
}