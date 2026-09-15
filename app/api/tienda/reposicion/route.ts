import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "../../../../lib/supabase/server";

const PRODUCTOS_VALIDOS = [
    "jersey-blanco",
    "jersey-azul",
    "jersey-visitante",
] as const;

const TALLAS_VALIDAS = [
    "S",
    "M",
    "L",
    "XL",
    "2XL",
] as const;

function emailValido(
    valor: unknown
) {
    if (
        typeof valor !== "string"
    ) {
        return false;
    }

    const correo =
        valor.trim().toLowerCase();

    return (
        correo.length >= 5 &&
        correo.length <= 254 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            correo
        )
    );
}

export async function POST(
    request: NextRequest
) {
    try {
        const body =
            (await request.json()) as {
                productoId?: string;
                talla?: string;
                correo?: string;
            };

        const productoId =
            body.productoId?.trim();

        const talla =
            body.talla?.trim();

        const correo =
            body.correo
                ?.trim()
                .toLowerCase();

        if (
            !productoId ||
            !PRODUCTOS_VALIDOS.includes(
                productoId as
                    (typeof PRODUCTOS_VALIDOS)[number]
            ) ||
            !talla ||
            !TALLAS_VALIDAS.includes(
                talla as
                    (typeof TALLAS_VALIDAS)[number]
            ) ||
            !emailValido(correo)
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "Los datos enviados no son válidos.",
                },
                {
                    status: 400,
                }
            );
        }

        const {
            data: stockActual,
            error: stockError,
        } = await supabaseAdmin
            .from("tienda_stock")
            .select("stock")
            .eq(
                "producto_id",
                productoId
            )
            .eq(
                "talla",
                talla
            )
            .single();

        if (stockError) {
            console.error(
                "Error comprobando stock para reposición:",
                stockError
            );

            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "No se pudo comprobar la disponibilidad.",
                },
                {
                    status: 500,
                }
            );
        }

        if (
            stockActual.stock ===
                null ||
            stockActual.stock > 0
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "Esta talla ya está disponible.",
                },
                {
                    status: 409,
                }
            );
        }

        const {
            error: insertError,
        } = await supabaseAdmin
            .from(
                "tienda_reposicion_avisos"
            )
            .insert({
                producto_id:
                    productoId,
                talla,
                correo,
                activo: true,
            });

        if (insertError) {
            if (
                insertError.code ===
                "23505"
            ) {
                return NextResponse.json(
                    {
                        ok: true,
                        yaRegistrado:
                            true,
                        mensaje:
                            "Ya estás registrado para recibir este aviso.",
                    }
                );
            }

            console.error(
                "Error creando aviso de reposición:",
                insertError
            );

            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "No se pudo registrar el aviso.",
                },
                {
                    status: 500,
                }
            );
        }

        return NextResponse.json({
            ok: true,
            yaRegistrado: false,
            mensaje:
                "Te avisaremos cuando esta talla vuelva a estar disponible.",
        });
    } catch (error) {
        console.error(
            "Error inesperado en reposición:",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                error:
                    "Ocurrió un error inesperado.",
            },
            {
                status: 500,
            }
        );
    }
}
