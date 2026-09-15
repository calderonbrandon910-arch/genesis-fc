import { supabaseAdmin } from "../../supabase/server";

import type {
    EstadoStock,
} from "../../datos-tienda";

export type InventarioProducto = {
    productoId: string;
    stockPorTalla: Record<
        string,
        number | null
    >;
    stockTotal: number | null;
    estado: EstadoStock;
    actualizadoEn: string | null;
};

type StockRow = {
    producto_id: string;
    talla: string;
    stock: number | null;
    actualizado_en: string;
};

function calcularEstadoStock(
    stockTotal: number | null
): EstadoStock {
    if (stockTotal === null) {
        return "sin-configurar";
    }

    if (stockTotal <= 0) {
        return "agotado";
    }

    if (stockTotal <= 3) {
        return "pocas-unidades";
    }

    return "disponible";
}

export async function obtenerInventarioTienda() {
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
        });

    if (error) {
        console.error(
            "Error leyendo inventario de tienda:",
            error
        );

        return {} as Record<
            string,
            InventarioProducto
        >;
    }

    const filas =
        (data ?? []) as StockRow[];

    const inventario: Record<
        string,
        InventarioProducto
    > = {};

    for (const fila of filas) {
        if (
            !inventario[
                fila.producto_id
            ]
        ) {
            inventario[
                fila.producto_id
            ] = {
                productoId:
                    fila.producto_id,
                stockPorTalla: {},
                stockTotal: 0,
                estado:
                    "sin-configurar",
                actualizadoEn:
                    fila.actualizado_en ??
                    null,
            };
        }

        const producto =
            inventario[
                fila.producto_id
            ];

        producto.stockPorTalla[
            fila.talla
        ] = fila.stock;

        if (
            producto.stockTotal ===
                null ||
            fila.stock === null
        ) {
            producto.stockTotal =
                null;
        } else {
            producto.stockTotal +=
                fila.stock;
        }

        if (
            fila.actualizado_en &&
            (
                !producto.actualizadoEn ||
                new Date(
                    fila.actualizado_en
                ).getTime() >
                new Date(
                    producto.actualizadoEn
                ).getTime()
            )
        ) {
            producto.actualizadoEn =
                fila.actualizado_en;
        }
    }

    for (
        const producto of
        Object.values(
            inventario
        )
    ) {
        producto.estado =
            calcularEstadoStock(
                producto.stockTotal
            );
    }

    return inventario;
}
