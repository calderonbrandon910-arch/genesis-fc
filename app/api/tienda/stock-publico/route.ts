import { NextResponse } from "next/server";

import { supabaseAdmin } from "../../../../lib/supabase/server";

type StockRow = {
    producto_id: string;
    talla: string;
    stock: number | null;
    actualizado_en: string;
};

export async function GET() {
    try {
        const {
            data,
            error,
        } = await supabaseAdmin
            .from("tienda_stock")
            .select(
                "producto_id, talla, stock, actualizado_en"
            )
            .order("producto_id", {
                ascending: true,
            })
            .order("talla", {
                ascending: true,
            });

        if (error) {
            console.error(
                "Error leyendo stock público:",
                error
            );

            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "No se pudo consultar la disponibilidad.",
                },
                {
                    status: 500,
                }
            );
        }

        const stock =
            ((data ?? []) as StockRow[]).map(
                (item) => ({
                    productoId:
                        item.producto_id,
                    talla:
                        item.talla,
                    stock:
                        Math.max(
                            0,
                            item.stock ?? 0
                        ),
                    disponible:
                        (item.stock ?? 0) > 0,
                })
            );

        return NextResponse.json(
            {
                ok: true,
                stock,
            },
            {
                status: 200,
                headers: {
                    "Cache-Control":
                        "no-store, no-cache, must-revalidate",
                },
            }
        );
    } catch (error) {
        console.error(
            "Error inesperado GET stock público:",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                error:
                    "Ocurrió un error al consultar la disponibilidad.",
            },
            {
                status: 500,
            }
        );
    }
}