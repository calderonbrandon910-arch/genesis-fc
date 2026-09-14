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

type MvpVoteBody = {
    match_slug?: string;
    player_id?: string;
    voter_hash?: string;
};

type MvpVoteRow = {
    player_id: string;
};

/* =========================================================
   HELPERS
========================================================= */

async function obtenerResumen(
    matchSlug: string
) {
    const {
        data,
        error,
    } =
        await supabase
            .from(
                "match_mvp_votes"
            )
            .select(
                "player_id"
            )
            .eq(
                "match_slug",
                matchSlug
            );

    if (error) {
        throw error;
    }

    const votes =
        (data ?? []) as MvpVoteRow[];

    const counts =
        new Map<
            string,
            number
        >();

    for (
        const vote of votes
    ) {
        counts.set(
            vote.player_id,
            (counts.get(
                vote.player_id
            ) ?? 0) + 1
        );
    }

    const ranking =
        Array.from(
            counts.entries()
        )
            .map(
                ([
                    player_id,
                    votes,
                ]) => ({
                    player_id,
                    votes,
                })
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    b.votes -
                    a.votes
            );

    return {
        total:
            votes.length,
        ranking,
    };
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
            "GET /api/mvp",
            error
        );

        return NextResponse.json(
            {
                ok:
                    false,
                error:
                    "No se pudo cargar la votación MVP.",
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
   REGISTRAR VOTO
========================================================= */

export async function POST(
    request: NextRequest
) {
    try {
        const body =
            (await request.json()) as MvpVoteBody;

        const matchSlug =
            body.match_slug?.trim();

        const playerId =
            body.player_id?.trim();

        const voterHash =
            body.voter_hash?.trim();

        if (
            !matchSlug ||
            !playerId ||
            !voterHash
        ) {
            return NextResponse.json(
                {
                    ok:
                        false,
                    error:
                        "Faltan datos del voto MVP.",
                },
                {
                    status:
                        400,
                }
            );
        }

        if (
            playerId.length <
                1 ||
            playerId.length >
                200
        ) {
            return NextResponse.json(
                {
                    ok:
                        false,
                    error:
                        "Jugador inválido.",
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
                        "Identificador de voto inválido.",
                },
                {
                    status:
                        400,
                }
            );
        }

        const {
            data:
                existingVote,
            error:
                existingError,
        } =
            await supabase
                .from(
                    "match_mvp_votes"
                )
                .select(
                    "id, player_id"
                )
                .eq(
                    "match_slug",
                    matchSlug
                )
                .eq(
                    "voter_hash",
                    voterHash
                )
                .maybeSingle();

        if (
            existingError
        ) {
            throw existingError;
        }

        if (
            existingVote
        ) {
            const summary =
                await obtenerResumen(
                    matchSlug
                );

            return NextResponse.json(
                {
                    ok:
                        true,
                    already_voted:
                        true,
                    player_id:
                        existingVote.player_id,
                    ...summary,
                }
            );
        }

        const {
            error:
                insertError,
        } =
            await supabase
                .from(
                    "match_mvp_votes"
                )
                .insert({
                    match_slug:
                        matchSlug,
                    player_id:
                        playerId,
                    voter_hash:
                        voterHash,
                });

        if (
            insertError
        ) {
            if (
                insertError.code ===
                "23505"
            ) {
                const summary =
                    await obtenerResumen(
                        matchSlug
                    );

                return NextResponse.json(
                    {
                        ok:
                            true,
                        already_voted:
                            true,
                        ...summary,
                    }
                );
            }

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
                already_voted:
                    false,
                player_id:
                    playerId,
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
            "POST /api/mvp",
            error
        );

        return NextResponse.json(
            {
                ok:
                    false,
                error:
                    "No se pudo registrar el voto MVP.",
            },
            {
                status:
                    500,
            }
        );
    }
}