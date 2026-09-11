import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "../../../../../lib/supabase/server";

type ContextoRuta = {
    params: Promise<{
        id: string;
    }>;
};

const ESTADOS_VALIDOS = [
    "pendiente",
    "confirmado",
    "entregado",
] as const;

type EstadoPedido =
    (typeof ESTADOS_VALIDOS)[number];

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
                    error: "Sesión administrativa no encontrada.",
                },
                {
                    status: 401,
                }
            ),
        };
    }

    const token = authorization
        .replace("Bearer ", "")
        .trim();

    if (!token) {
        return {
            usuario: null,
            error: NextResponse.json(
                {
                    ok: false,
                    error: "Token de sesión inválido.",
                },
                {
                    status: 401,
                }
            ),
        };
    }

    const {
        data: { user },
        error,
    } = await supabaseAdmin.auth.getUser(token);

    if (
        error ||
        !user
    ) {
        return {
            usuario: null,
            error: NextResponse.json(
                {
                    ok: false,
                    error: "La sesión administrativa expiró o no es válida.",
                },
                {
                    status: 401,
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
   GET
   OBTENER DETALLE DE UN PEDIDO
========================================================= */

export async function GET(
    request: NextRequest,
    contexto: ContextoRuta
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

        const { id } =
            await contexto.params;

        if (!id) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Falta el ID del pedido.",
                },
                {
                    status: 400,
                }
            );
        }

        const {
            data: pedido,
            error: errorPedido,
        } = await supabaseAdmin
            .from("pedidos")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (errorPedido) {
            console.error(
                "Error obteniendo pedido:",
                errorPedido
            );

            return NextResponse.json(
                {
                    ok: false,
                    error: "No se pudo cargar el pedido.",
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
                    error: "El pedido no existe.",
                },
                {
                    status: 404,
                }
            );
        }

        const {
            data: items,
            error: errorItems,
        } = await supabaseAdmin
            .from("pedido_items")
            .select("*")
            .eq("pedido_id", id)
            .order("creado_en", {
                ascending: true,
            });

        if (errorItems) {
            console.error(
                "Error obteniendo productos del pedido:",
                errorItems
            );

            return NextResponse.json(
                {
                    ok: false,
                    error: "No se pudieron cargar los productos del pedido.",
                },
                {
                    status: 500,
                }
            );
        }

        return NextResponse.json({
            ok: true,

            administrador: {
                id:
                    autenticacion.usuario?.id ??
                    "",
                correo:
                    autenticacion.usuario?.email ??
                    "",
            },

            pedido,

            items: items ?? [],
        });
    } catch (error) {
        console.error(
            "Error inesperado cargando pedido:",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                error: "Ocurrió un error inesperado al cargar el pedido.",
            },
            {
                status: 500,
            }
        );
    }
}

/* =========================================================
   PATCH
   CAMBIAR ESTADO DEL PEDIDO
========================================================= */

export async function PATCH(
    request: NextRequest,
    contexto: ContextoRuta
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

        const { id } =
            await contexto.params;

        if (!id) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Falta el ID del pedido.",
                },
                {
                    status: 400,
                }
            );
        }

        let body: {
            estado?: string;
        };

        try {
            body =
                (await request.json()) as {
                    estado?: string;
                };
        } catch {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Los datos enviados no son válidos.",
                },
                {
                    status: 400,
                }
            );
        }

        const estadoSolicitado =
            body.estado
                ?.trim()
                .toLowerCase();

        if (
            !estadoSolicitado ||
            !ESTADOS_VALIDOS.includes(
                estadoSolicitado as EstadoPedido
            )
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Estado de pedido inválido.",
                },
                {
                    status: 400,
                }
            );
        }

        const {
            data: pedidoActual,
            error: errorBusqueda,
        } = await supabaseAdmin
            .from("pedidos")
            .select(
                "id, numero_pedido, estado"
            )
            .eq("id", id)
            .maybeSingle();

        if (errorBusqueda) {
            console.error(
                "Error buscando pedido:",
                errorBusqueda
            );

            return NextResponse.json(
                {
                    ok: false,
                    error: "No se pudo verificar el pedido.",
                },
                {
                    status: 500,
                }
            );
        }

        if (!pedidoActual) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "El pedido no existe.",
                },
                {
                    status: 404,
                }
            );
        }

        if (
            pedidoActual.estado ===
            estadoSolicitado
        ) {
            return NextResponse.json({
                ok: true,
                mensaje:
                    "El pedido ya tiene ese estado.",
                pedido: pedidoActual,
            });
        }

        const {
            data: pedidoActualizado,
            error: errorActualizacion,
        } = await supabaseAdmin
            .from("pedidos")
            .update({
                estado:
                    estadoSolicitado,
            })
            .eq("id", id)
            .select("*")
            .single();

        if (
            errorActualizacion ||
            !pedidoActualizado
        ) {
            console.error(
                "Error actualizando pedido:",
                errorActualizacion
            );

            return NextResponse.json(
                {
                    ok: false,
                    error: "No se pudo actualizar el estado del pedido.",
                },
                {
                    status: 500,
                }
            );
        }

        return NextResponse.json({
            ok: true,

            mensaje:
                "Estado actualizado correctamente.",

            pedido:
                pedidoActualizado,
        });
    } catch (error) {
        console.error(
            "Error inesperado actualizando pedido:",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                error: "Ocurrió un error inesperado al actualizar el pedido.",
            },
            {
                status: 500,
            }
        );
    }
}