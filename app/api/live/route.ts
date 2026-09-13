import {
    NextRequest,
    NextResponse,
} from "next/server";

import { supabaseAdmin } from "../../../lib/supabase/server";

/* =========================================================
   GÉNESIS FC
   PUBLIC LIVE MATCH API
   READ ONLY
========================================================= */

export const dynamic =
    "force-dynamic";

export const revalidate = 0;

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

/* =========================================================
   HELPERS
========================================================= */

function normalizarSegundos(
    value: unknown
) {
    if (
        typeof value !==
            "number" ||
        !Number.isFinite(
            value
        )
    ) {
        return 0;
    }

    return Math.max(
        0,
        Math.floor(
            value
        )
    );
}

/* =========================================================
   RELOJ DEL SERVIDOR
========================================================= */

function calcularSegundosActuales(
    match: LiveMatch
) {
    const base =
        normalizarSegundos(
            match.elapsed_seconds
        );

    const corriendo =
        match.status ===
            "first_half" ||
        match.status ===
            "second_half";

    if (
        !corriendo ||
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

    const delta =
        Math.max(
            0,
            Date.now() -
                inicio
        ) / 1000;

    return Math.floor(
        base +
            delta
    );
}

/* =========================================================
   GET
========================================================= */

export async function GET(
    request: NextRequest
) {
    try {
        const slug =
            request.nextUrl
                .searchParams
                .get(
                    "slug"
                )
                ?.trim();

        if (!slug) {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "Falta el partido solicitado.",
                },
                {
                    status: 400,

                    headers: {
                        "Cache-Control":
                            "no-store, max-age=0",
                    },
                }
            );
        }

        /* =================================================
           PARTIDO
        ================================================= */

        const {
            data:
                matchData,
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
                "Public Live API match:",
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

                    headers: {
                        "Cache-Control":
                            "no-store, max-age=0",
                    },
                }
            );
        }

        if (!matchData) {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "El partido no existe.",
                },
                {
                    status: 404,

                    headers: {
                        "Cache-Control":
                            "no-store, max-age=0",
                    },
                }
            );
        }

        const match =
            matchData as LiveMatch;

        /* =================================================
           EVENTOS + STATS + LINEUPS
        ================================================= */

        const [
            eventsResult,
            statsResult,
            lineupsResult,
        ] =
            await Promise.all([
                supabaseAdmin
                    .from(
                        "live_match_events"
                    )
                    .select("*")
                    .eq(
                        "match_id",
                        match.id
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
                        match.id
                    ),

                supabaseAdmin
                    .from(
                        "live_match_lineups"
                    )
                    .select("*")
                    .eq(
                        "match_id",
                        match.id
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
            eventsResult.error
        ) {
            console.error(
                "Public Live API events:",
                eventsResult.error
            );

            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "No se pudieron cargar los eventos.",
                },
                {
                    status: 500,

                    headers: {
                        "Cache-Control":
                            "no-store, max-age=0",
                    },
                }
            );
        }

        if (
            statsResult.error
        ) {
            console.error(
                "Public Live API stats:",
                statsResult.error
            );

            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "No se pudieron cargar las estadísticas.",
                },
                {
                    status: 500,

                    headers: {
                        "Cache-Control":
                            "no-store, max-age=0",
                    },
                }
            );
        }

        if (
            lineupsResult.error
        ) {
            console.error(
                "Public Live API lineups:",
                lineupsResult.error
            );

            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "No se pudieron cargar las alineaciones.",
                },
                {
                    status: 500,

                    headers: {
                        "Cache-Control":
                            "no-store, max-age=0",
                    },
                }
            );
        }

        /* =================================================
           RESPUESTA PÚBLICA
        ================================================= */

        return NextResponse.json(
            {
                ok: true,

                match: {
                    ...match,

                    server_elapsed_seconds:
                        calcularSegundosActuales(
                            match
                        ),

                    server_time:
                        new Date().toISOString(),
                },

                events:
                    eventsResult.data ??
                    [],

                stats:
                    statsResult.data ??
                    [],

                lineups:
                    lineupsResult.data ??
                    [],
            },
            {
                status: 200,

                headers: {
                    "Cache-Control":
                        "no-store, max-age=0",

                    "CDN-Cache-Control":
                        "no-store",

                    "Vercel-CDN-Cache-Control":
                        "no-store",
                },
            }
        );
    } catch (error) {
        console.error(
            "Public Live API error:",
            error
        );

        return NextResponse.json(
            {
                ok: false,

                error:
                    "No fue posible cargar el Match Center.",
            },
            {
                status: 500,

                headers: {
                    "Cache-Control":
                        "no-store, max-age=0",
                },
            }
        );
    }
}