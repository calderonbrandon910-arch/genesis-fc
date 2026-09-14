import {
    NextRequest,
    NextResponse,
} from "next/server";

import {
    createClient,
} from "@supabase/supabase-js";

/* =========================================================
   CONFIG
========================================================= */

const supabaseUrl =
    process.env
        .NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey =
    process.env
        .SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
    throw new Error(
        "Falta NEXT_PUBLIC_SUPABASE_URL."
    );
}

if (!serviceRoleKey) {
    throw new Error(
        "Falta SUPABASE_SERVICE_ROLE_KEY."
    );
}

const supabase =
    createClient(
        supabaseUrl,
        serviceRoleKey,
        {
            auth: {
                persistSession:
                    false,
                autoRefreshToken:
                    false,
            },
        }
    );

/* =========================================================
   TIPOS
========================================================= */

type Reaction =
    | "fire"
    | "heart"
    | "goal"
    | "clap";

type ReactionBody = {
    match_slug?: string;
    reaction?: Reaction;
    voter_hash?: string;
};

type ReactionCount = {
    fire: number;
    heart: number;
    goal: number;
    clap: number;
    total: number;
};

/* =========================================================
   CONFIG ANTI-SPAM
========================================================= */

const REACTION_WINDOW_SECONDS =
    10;

const MAX_REACTIONS_PER_WINDOW =
    5;

/* =========================================================
   HELPERS
========================================================= */

function esReactionValida(
    value: unknown
): value is Reaction {
    return (
        value === "fire" ||
        value === "heart" ||
        value === "goal" ||
        value === "clap"
    );
}

async function obtenerResumen(
    matchSlug: string
): Promise<ReactionCount> {
    const {
        data,
        error,
    } =
        await supabase
            .from(
                "match_reactions"
            )
            .select(
                "reaction"
            )
            .eq(
                "match_slug",
                matchSlug
            );

    if (error) {
        throw error;
    }

    const fire =
        data?.filter(
            (
                item
            ) =>
                item.reaction ===
                "fire"
        ).length ?? 0;

    const heart =
        data?.filter(
            (
                item
            ) =>
                item.reaction ===
                "heart"
        ).length ?? 0;

    const goal =
        data?.filter(
            (
                item
            ) =>
                item.reaction ===
                "goal"
        ).length ?? 0;

    const clap =
        data?.filter(
            (
                item
            ) =>
                item.reaction ===
                "clap"
        ).length ?? 0;

    return {
        fire,
        heart,
        goal,
        clap,
        total:
            fire +
            heart +
            goal +
            clap,
    };
}

async function puedeReaccionar(
    matchSlug: string,
    voterHash: string
) {
    const desde =
        new Date(
            Date.now() -
                REACTION_WINDOW_SECONDS *
                    1000
        ).toISOString();

    const {
        count,
        error,
    } =
        await supabase
            .from(
                "match_reactions"
            )
            .select(
                "id",
                {
                    count:
                        "exact",
                    head:
                        true,
                }
            )
            .eq(
                "match_slug",
                matchSlug
            )
            .eq(
                "voter_hash",
                voterHash
            )
            .gte(
                "created_at",
                desde
            );

    if (error) {
        throw error;
    }

    return (
        (count ?? 0) <
        MAX_REACTIONS_PER_WINDOW
    );
}

/* =========================================================
   GET
   RESUMEN PÚBLICO
========================================================= */

export async function GET(
    request: NextRequest
) {
    try {
        const {
            searchParams,
        } =
            new URL(
                request.url
            );

        const matchSlug =
            searchParams
                .get(
                    "match_slug"
                )
                ?.trim();

        if (!matchSlug) {
            return NextResponse.json(
                {
                    ok:
                        false,
                    error:
                        "match_slug es requerido.",
                },
                {
                    status:
                        400,
                }
            );
        }

        const summary =
            await obtenerResumen(
                matchSlug
            );

        return NextResponse.json(
            {
                ok:
                    true,
                match_slug:
                    matchSlug,
                ...summary,
            },
            {
                headers: {
                    "Cache-Control":
                        "no-store",
                },
            }
        );
    } catch (
        error
    ) {
        console.error(
            "GET /api/reactions",
            error
        );

        return NextResponse.json(
            {
                ok:
                    false,
                error:
                    "No se pudieron cargar las reacciones.",
            },
            {
                status:
                    500,
            }
        );
    }
}

/* =========================================================
   POST
   REGISTRAR REACCIÓN
========================================================= */

export async function POST(
    request: NextRequest
) {
    try {
        const body =
            (await request.json()) as ReactionBody;

        const matchSlug =
            body.match_slug?.trim();

        const reaction =
            body.reaction;

        const voterHash =
            body.voter_hash?.trim();

        if (
            !matchSlug ||
            !reaction ||
            !voterHash
        ) {
            return NextResponse.json(
                {
                    ok:
                        false,
                    error:
                        "Faltan datos de la reacción.",
                },
                {
                    status:
                        400,
                }
            );
        }

        if (
            !esReactionValida(
                reaction
            )
        ) {
            return NextResponse.json(
                {
                    ok:
                        false,
                    error:
                        "Reacción inválida.",
                },
                {
                    status:
                        400,
                }
            );
        }

        if (
            voterHash.length <
                8 ||
            voterHash.length >
                200
        ) {
            return NextResponse.json(
                {
                    ok:
                        false,
                    error:
                        "Identificador de reacción inválido.",
                },
                {
                    status:
                        400,
                }
            );
        }

        const permitido =
            await puedeReaccionar(
                matchSlug,
                voterHash
            );

        if (!permitido) {
            const summary =
                await obtenerResumen(
                    matchSlug
                );

            return NextResponse.json(
                {
                    ok:
                        false,
                    rate_limited:
                        true,
                    error:
                        "Has reaccionado muy rápido. Intenta nuevamente en unos segundos.",
                    ...summary,
                },
                {
                    status:
                        429,
                }
            );
        }

        const {
            error:
                insertError,
        } =
            await supabase
                .from(
                    "match_reactions"
                )
                .insert({
                    match_slug:
                        matchSlug,
                    reaction,
                    voter_hash:
                        voterHash,
                });

        if (
            insertError
        ) {
            throw insertError;
        }

        const summary =
            await obtenerResumen(
                matchSlug
            );

        return NextResponse.json(
            {
                ok:
                    true,
                reaction,
                ...summary,
            },
            {
                status:
                    201,
            }
        );
    } catch (
        error
    ) {
        console.error(
            "POST /api/reactions",
            error
        );

        return NextResponse.json(
            {
                ok:
                    false,
                error:
                    "No se pudo registrar la reacción.",
            },
            {
                status:
                    500,
            }
        );
    }
}