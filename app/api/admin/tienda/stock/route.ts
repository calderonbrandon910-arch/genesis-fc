import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "../../../../../lib/supabase/server";

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

type ProductoId =
    (typeof PRODUCTOS_VALIDOS)[number];

type Talla =
    (typeof TALLAS_VALIDAS)[number];

type StockRow = {
    producto_id: string;
    talla: string;
    stock: number | null;
    actualizado_en: string;
};

function obtenerAdministradoresPermitidos() {
    const valor =
        process.env.ADMIN_EMAILS ?? "";

    return valor
        .split(",")
        .map((correo) =>
            correo.trim().toLowerCase()
        )
        .filter(Boolean);
}

async function obtenerUsuarioAutenticado(
    request: NextRequest
) {
    const authorization =
        request.headers.get("authorization");

    if (
        !authorization ||
        !authorization.startsWith("Bearer ")
    ) {
        return {
            usuario: null,
            error: NextResponse.json(
                {
                    ok: false,
                    error:
                        "Sesión administrativa no encontrada.",
                },
                { status: 401 }
            ),
        };
    }

    const token = authorization
        .replace("Bearer ", "")
        .trim();

    const {
        data: { user },
        error,
    } = await supabaseAdmin.auth.getUser(
        token
    );

    if (error || !user) {
        return {
            usuario: null,
            error: NextResponse.json(
                {
                    ok: false,
                    error:
                        "La sesión administrativa expiró o no es válida.",
                },
                { status: 401 }
            ),
        };
    }

    const correo =
        user.email
            ?.trim()
            .toLowerCase() ?? "";

    const administradoresPermitidos =
        obtenerAdministradoresPermitidos();

    if (
        administradoresPermitidos.length ===
        0
    ) {
        return {
            usuario: null,
            error: NextResponse.json(
                {
                    ok: false,
                    error:
                        "El acceso administrativo todavía no está configurado.",
                },
                { status: 500 }
            ),
        };
    }

    if (
        !correo ||
        !administradoresPermitidos.includes(
            correo
        )
    ) {
        return {
            usuario: null,
            error: NextResponse.json(
                {
                    ok: false,
                    error:
                        "Este usuario no tiene permisos administrativos.",
                },
                { status: 403 }
            ),
        };
    }

    return {
        usuario: user,
        error: null,
    };
}

export async function GET(
    request: NextRequest
) {
    try {
        const autenticacion =
            await obtenerUsuarioAutenticado(
                request
            );

        if (autenticacion.error) {
            return autenticacion.error;
        }

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
                "Error leyendo stock admin:",
                error
            );

            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "No se pudo cargar el inventario.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            ok: true,
            administrador: {
                id:
                    autenticacion.usuario?.id ??
                    "",
                correo:
                    autenticacion.usuario
                        ?.email ?? "",
            },
            stock:
                (data ?? []) as StockRow[],
        });
    } catch (error) {
        console.error(
            "Error inesperado GET admin stock:",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                error:
                    "Ocurrió un error inesperado.",
            },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest
) {
    try {
        const autenticacion =
            await obtenerUsuarioAutenticado(
                request
            );

        if (autenticacion.error) {
            return autenticacion.error;
        }

        const body =
            (await request.json()) as {
                productoId?: string;
                talla?: string;
                stock?: number;
            };

        const productoId =
            body.productoId;
        const talla =
            body.talla;
        const stock =
            body.stock;

        if (
            !PRODUCTOS_VALIDOS.includes(
                productoId as ProductoId
            ) ||
            !TALLAS_VALIDAS.includes(
                talla as Talla
            ) ||
            typeof stock !== "number" ||
            !Number.isInteger(stock) ||
            stock < 0 ||
            stock > 9999
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "Los datos de inventario no son válidos.",
                },
                { status: 400 }
            );
        }

        const {
            data,
            error,
        } = await supabaseAdmin
            .from("tienda_stock")
            .update({
                stock,
            })
            .eq(
                "producto_id",
                productoId
            )
            .eq(
                "talla",
                talla
            )
            .select(
                "producto_id, talla, stock, actualizado_en"
            )
            .single();

        if (error) {
            console.error(
                "Error actualizando stock:",
                error
            );

            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "No se pudo actualizar el inventario.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            ok: true,
            stock:
                data as StockRow,
        });
    } catch (error) {
        console.error(
            "Error inesperado PUT admin stock:",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                error:
                    "Ocurrió un error inesperado.",
            },
            { status: 500 }
        );
    }
}
