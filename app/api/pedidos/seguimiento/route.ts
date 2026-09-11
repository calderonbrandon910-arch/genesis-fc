import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "../../../../lib/supabase/server";

function numeroPedidoValido(valor: string) {
    return (
        valor.length >= 5 &&
        valor.length <= 80 &&
        /^[A-Z0-9_-]+$/.test(valor)
    );
}

export async function GET(
    request: NextRequest
) {
    try {
        const { searchParams } =
            new URL(request.url);

        const numeroPedido =
            searchParams
                .get("numeroPedido")
                ?.trim()
                .toUpperCase() ?? "";

        if (
            !numeroPedido ||
            !numeroPedidoValido(numeroPedido)
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Número de pedido inválido.",
                },
                {
                    status: 400,
                }
            );
        }

        const {
            data: pedido,
            error,
        } = await supabaseAdmin
            .from("pedidos")
            .select(
                `
                numero_pedido,
                estado,
                metodo_entrega,
                ciudad,
                punto_retiro,
                total,
                moneda,
                creado_en
                `
            )
            .eq(
                "numero_pedido",
                numeroPedido
            )
            .maybeSingle();

        if (error) {
            console.error(
                "Error consultando seguimiento:",
                error
            );

            return NextResponse.json(
                {
                    ok: false,
                    error: "No se pudo consultar el pedido.",
                },
                {
                    status: 500,
                }
            );
        }

        if (!pedido) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "No encontramos un pedido con ese número.",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json({
            ok: true,

            pedido: {
                numeroPedido:
                    pedido.numero_pedido,

                estado:
                    pedido.estado,

                metodoEntrega:
                    pedido.metodo_entrega,

                ciudad:
                    pedido.ciudad,

                puntoRetiro:
                    pedido.punto_retiro,

                total:
                    pedido.total,

                moneda:
                    pedido.moneda,

                creadoEn:
                    pedido.creado_en,
            },
        });
    } catch (error) {
        console.error(
            "Error inesperado en seguimiento:",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                error: "Ocurrió un error inesperado al consultar el pedido.",
            },
            {
                status: 500,
            }
        );
    }
}