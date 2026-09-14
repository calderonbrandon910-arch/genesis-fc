import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

/* =========================================================
   CONFIG
========================================================= */

const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

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

const supabase = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    }
);

/* =========================================================
   TIPOS
========================================================= */

type Prediction =
    | "home"
    | "draw"
    | "away";

type PredictionBody = {
    match_slug?: string;
    prediction?: Prediction;
    voter_hash?: string;
};

/* =========================================================
   HELPERS
========================================================= */

function esPredictionValida(
    value: unknown
): value is Prediction {
    return (
        value === "home" ||
        value === "draw" ||
        value === "away"
    );
}

async function obtenerResumen(
    matchSlug: string
) {
    const {
        data,
        error,
    } = await supabase
        .from("match_predictions")
        .select("prediction")
        .eq(
            "match_slug",
            matchSlug
        );

    if (error) {
        throw error;
    }

    const home =
        data?.filter(
            (
                item
            ) =>
                item.prediction ===
                "home"
        ).length ?? 0;

    const draw =
        data?.filter(
            (
                item
            ) =>
                item.prediction ===
                "draw"
        ).length ?? 0;

    const away =
        data?.filter(
            (
                item
            ) =>
                item.prediction ===
                "away"
        ).length ?? 0;

    const total =
        home +
        draw +
        away;

    const porcentaje = (
        value: number
    ) => {
        if (total === 0) {
            return 0;
        }

        return Math.round(
            (value / total) *
                100
        );
    };

    return {
        total,
        home,
        draw,
        away,
        percentages: {
            home: porcentaje(
                home
            ),
            draw: porcentaje(
                draw
            ),
            away: porcentaje(
                away
            ),
        },
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
        } = new URL(
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
                    ok: false,
                    error:
                        "match_slug es requerido.",
                },
                {
                    status: 400,
                }
            );
        }

        const summary =
            await obtenerResumen(
                matchSlug
            );

        return NextResponse.json(
            {
                ok: true,
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
            "GET /api/predictions",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                error:
                    "No se pudo cargar el pronóstico.",
            },
            {
                status: 500,
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
            (await request.json()) as PredictionBody;

        const matchSlug =
            body.match_slug?.trim();

        const prediction =
            body.prediction;

        const voterHash =
            body.voter_hash?.trim();

        if (
            !matchSlug ||
            !prediction ||
            !voterHash
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "Faltan datos del voto.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            !esPredictionValida(
                prediction
            )
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "Pronóstico inválido.",
                },
                {
                    status: 400,
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
                    ok: false,
                    error:
                        "Identificador de voto inválido.",
                },
                {
                    status: 400,
                }
            );
        }

        const {
            data: existingVote,
            error: existingError,
        } =
            await supabase
                .from(
                    "match_predictions"
                )
                .select(
                    "id, prediction"
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
                    ok: true,
                    already_voted:
                        true,
                    prediction:
                        existingVote.prediction,
                    ...summary,
                }
            );
        }

        const {
            error: insertError,
        } =
            await supabase
                .from(
                    "match_predictions"
                )
                .insert({
                    match_slug:
                        matchSlug,
                    prediction,
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
                        ok: true,
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
                ok: true,
                already_voted:
                    false,
                prediction,
                ...summary,
            },
            {
                status: 201,
            }
        );
    } catch (
        error
    ) {
        console.error(
            "POST /api/predictions",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                error:
                    "No se pudo registrar el pronóstico.",
            },
            {
                status: 500,
            }
        );
    }
}