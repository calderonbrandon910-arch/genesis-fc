import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "../../../../lib/supabase/server";

function obtenerBearerToken(request: NextRequest) {
    const authorization =
        request.headers.get("authorization");

    if (!authorization) {
        return null;
    }

    const [tipo, token] =
        authorization.split(" ");

    if (
        tipo?.toLowerCase() !== "bearer" ||
        !token
    ) {
        return null;
    }

    return token.trim();
}

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

export async function GET(
    request: NextRequest
) {
    try {
        /*
        ============================================================
        1. OBTENER TOKEN DE SUPABASE
        ============================================================
        */

        const token =
            obtenerBearerToken(request);

        if (!token) {
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "No se proporcionó una sesión administrativa válida.",
                },
                {
                    status: 401,
                }
            );
        }

        /*
        ============================================================
        2. VALIDAR USUARIO CON SUPABASE AUTH
        ============================================================
        */

        const {
            data: usuarioData,
            error: usuarioError,
        } =
            await supabaseAdmin.auth.getUser(
                token
            );

        if (
            usuarioError ||
            !usuarioData.user
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "La sesión administrativa no es válida o expiró.",
                },
                {
                    status: 401,
                }
            );
        }

        const correo =
            usuarioData.user.email
                ?.trim()
                .toLowerCase() ?? "";

        /*
        ============================================================
        3. COMPROBAR LISTA DE ADMINISTRADORES
        ============================================================
        */

        const administradoresPermitidos =
            obtenerAdministradoresPermitidos();

        if (
            administradoresPermitidos.length ===
            0
        ) {
            console.error(
                "ADMIN_EMAILS no está configurado."
            );

            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "El acceso administrativo todavía no está configurado.",
                },
                {
                    status: 500,
                }
            );
        }

        if (
            !correo ||
            !administradoresPermitidos.includes(
                correo
            )
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "Este usuario no tiene permisos administrativos.",
                },
                {
                    status: 403,
                }
            );
        }

        /*
        ============================================================
        4. LEER PEDIDOS DESDE SUPABASE

        La clave secreta nunca llega al navegador.
        Esta consulta ocurre únicamente en el servidor.
        ============================================================
        */

        const {
            data: pedidos,
            error: pedidosError,
        } = await supabaseAdmin
            .from("pedidos")
            .select(
                `
                id,
                numero_pedido,
                estado,
                estado_pago,
                metodo_pago,
                nombre_cliente,
                telefono,
                correo,
                metodo_entrega,
                ciudad,
                direccion,
                punto_retiro,
                notas,
                latitud,
                longitud,
                total_articulos,
                subtotal,
                costo_envio,
                total,
                moneda,
                creado_en
                `
            )
            .order(
                "creado_en",
                {
                    ascending: false,
                }
            )
            .limit(100);

        if (pedidosError) {
            console.error(
                "Error cargando pedidos administrativos:",
                pedidosError
            );

            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "No se pudieron cargar los pedidos.",
                },
                {
                    status: 500,
                }
            );
        }

        /*
        ============================================================
        5. RESUMEN PARA EL DASHBOARD
        ============================================================
        */

        const lista = pedidos ?? [];

        const totalPedidos =
            lista.length;

        const pendientes =
            lista.filter(
                (pedido) =>
                    pedido.estado ===
                    "pendiente"
            ).length;

        const confirmados =
            lista.filter(
                (pedido) =>
                    pedido.estado ===
                    "confirmado"
            ).length;

        const entregados =
            lista.filter(
                (pedido) =>
                    pedido.estado ===
                    "entregado"
            ).length;

        /*
        ============================================================
        6. RESPUESTA
        ============================================================
        */

        return NextResponse.json(
            {
                ok: true,

                administrador: {
                    id:
                        usuarioData.user.id,

                    correo,
                },

                resumen: {
                    total:
                        totalPedidos,

                    pendientes,

                    confirmados,

                    entregados,
                },

                pedidos:
                    lista,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "Error general en API administrativa de pedidos:",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                error:
                    "No se pudo procesar la solicitud administrativa.",
            },
            {
                status: 500,
            }
        );
    }
}