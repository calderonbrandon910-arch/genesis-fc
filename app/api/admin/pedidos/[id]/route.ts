import "server-only";

import {
    NextRequest,
    NextResponse,
} from "next/server";

import { supabaseAdmin } from "../../../../../lib/supabase/server";

/* =========================================================
   TIPOS
========================================================= */

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

type RegistroRateLimit = {
    cantidad: number;
    reinicio: number;
};

/* =========================================================
   RATE LIMIT
========================================================= */

const RATE_LIMIT_MAXIMO = 60;

const RATE_LIMIT_VENTANA_MS =
    60 * 1000;

const globalRateLimit =
    globalThis as typeof globalThis & {
        genesisAdminPedidoDetalleRateLimit?: Map<
            string,
            RegistroRateLimit
        >;
    };

const rateLimitStore =
    globalRateLimit
        .genesisAdminPedidoDetalleRateLimit ??
    new Map<
        string,
        RegistroRateLimit
    >();

globalRateLimit.genesisAdminPedidoDetalleRateLimit =
    rateLimitStore;

/* =========================================================
   CAMPOS DE PEDIDO
========================================================= */

const CAMPOS_PEDIDO = `
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
`;

/* =========================================================
   CAMPOS DE ITEMS
========================================================= */

const CAMPOS_ITEMS = `
    id,
    pedido_id,
    producto_id,
    nombre_producto,
    talla,
    cantidad,
    precio_unitario,
    subtotal,
    creado_en
`;

/* =========================================================
   RESPUESTA JSON SEGURA
========================================================= */

function respuestaJson(
    body: Record<
        string,
        unknown
    >,
    status = 200,
    headers?: Record<
        string,
        string
    >
) {
    return NextResponse.json(
        body,
        {
            status,

            headers: {
                "Cache-Control":
                    "no-store, no-cache, must-revalidate",

                Pragma:
                    "no-cache",

                ...headers,
            },
        }
    );
}

/* =========================================================
   IP
========================================================= */

function obtenerIp(
    request: NextRequest
) {
    const forwardedFor =
        request.headers.get(
            "x-forwarded-for"
        );

    if (forwardedFor) {
        const primeraIp =
            forwardedFor
                .split(",")[0]
                ?.trim();

        if (primeraIp) {
            return primeraIp;
        }
    }

    const realIp =
        request.headers.get(
            "x-real-ip"
        );

    if (realIp) {
        return realIp.trim();
    }

    return "ip-desconocida";
}

/* =========================================================
   LIMPIAR RATE LIMIT
========================================================= */

function limpiarRateLimit() {
    const ahora =
        Date.now();

    for (
        const [
            ip,
            registro,
        ] of rateLimitStore.entries()
    ) {
        if (
            ahora >=
            registro.reinicio
        ) {
            rateLimitStore.delete(
                ip
            );
        }
    }
}

/* =========================================================
   COMPROBAR RATE LIMIT
========================================================= */

function comprobarRateLimit(
    ip: string
) {
    const ahora =
        Date.now();

    limpiarRateLimit();

    const registro =
        rateLimitStore.get(ip);

    if (
        !registro ||
        ahora >=
            registro.reinicio
    ) {
        const nuevoRegistro:
            RegistroRateLimit = {
            cantidad: 1,

            reinicio:
                ahora +
                RATE_LIMIT_VENTANA_MS,
        };

        rateLimitStore.set(
            ip,
            nuevoRegistro
        );

        return {
            permitido: true,

            restante:
                RATE_LIMIT_MAXIMO -
                1,

            reinicio:
                nuevoRegistro.reinicio,
        };
    }

    if (
        registro.cantidad >=
        RATE_LIMIT_MAXIMO
    ) {
        return {
            permitido: false,

            restante: 0,

            reinicio:
                registro.reinicio,
        };
    }

    registro.cantidad += 1;

    rateLimitStore.set(
        ip,
        registro
    );

    return {
        permitido: true,

        restante:
            RATE_LIMIT_MAXIMO -
            registro.cantidad,

        reinicio:
            registro.reinicio,
    };
}

/* =========================================================
   APLICAR RATE LIMIT
========================================================= */

function aplicarRateLimit(
    request: NextRequest
) {
    const ip =
        obtenerIp(request);

    const limite =
        comprobarRateLimit(ip);

    if (
        limite.permitido
    ) {
        return {
            limite,
            error: null,
        };
    }

    const segundosRestantes =
        Math.max(
            1,
            Math.ceil(
                (
                    limite.reinicio -
                    Date.now()
                ) /
                    1000
            )
        );

    return {
        limite,

        error:
            respuestaJson(
                {
                    ok: false,

                    error:
                        "Demasiadas solicitudes. Inténtalo nuevamente en unos segundos.",
                },
                429,
                {
                    "Retry-After":
                        String(
                            segundosRestantes
                        ),

                    "X-RateLimit-Limit":
                        String(
                            RATE_LIMIT_MAXIMO
                        ),

                    "X-RateLimit-Remaining":
                        "0",
                }
            ),
    };
}

/* =========================================================
   ADMINISTRADORES
========================================================= */

function obtenerAdministradoresPermitidos() {
    const valor =
        process.env.ADMIN_EMAILS ??
        "";

    return valor
        .split(",")
        .map(
            (correo) =>
                correo
                    .trim()
                    .toLowerCase()
        )
        .filter(Boolean);
}

/* =========================================================
   OBTENER BEARER TOKEN
========================================================= */

function obtenerBearerToken(
    request: NextRequest
) {
    const authorization =
        request.headers.get(
            "authorization"
        );

    if (
        !authorization
    ) {
        return null;
    }

    const [
        tipo,
        token,
    ] =
        authorization.split(" ");

    if (
        tipo?.toLowerCase() !==
            "bearer" ||
        !token
    ) {
        return null;
    }

    const tokenLimpio =
        token.trim();

    if (
        tokenLimpio.length <
            20 ||
        tokenLimpio.length >
            5000
    ) {
        return null;
    }

    return tokenLimpio;
}

/* =========================================================
   AUTENTICACIÓN ADMINISTRATIVA
========================================================= */

async function obtenerUsuarioAutenticado(
    request: NextRequest
) {
    const token =
        obtenerBearerToken(
            request
        );

    if (!token) {
        return {
            usuario: null,

            error:
                respuestaJson(
                    {
                        ok: false,

                        error:
                            "Acceso no autorizado.",
                    },
                    401
                ),
        };
    }

    const {
        data: {
            user,
        },
        error,
    } =
        await supabaseAdmin.auth.getUser(
            token
        );

    if (
        error ||
        !user
    ) {
        return {
            usuario: null,

            error:
                respuestaJson(
                    {
                        ok: false,

                        error:
                            "Acceso no autorizado.",
                    },
                    401
                ),
        };
    }

    const correo =
        user.email
            ?.trim()
            .toLowerCase() ??
        "";

    const administradoresPermitidos =
        obtenerAdministradoresPermitidos();

    if (
        administradoresPermitidos.length ===
        0
    ) {
        console.error(
            "ADMIN_EMAILS no está configurado."
        );

        return {
            usuario: null,

            error:
                respuestaJson(
                    {
                        ok: false,

                        error:
                            "El servicio administrativo no está disponible.",
                    },
                    503
                ),
        };
    }

    if (
        !correo ||
        !administradoresPermitidos.includes(
            correo
        )
    ) {
        console.warn(
            "Intento de acceso administrativo sin permisos:",
            user.id
        );

        return {
            usuario: null,

            error:
                respuestaJson(
                    {
                        ok: false,

                        error:
                            "Acceso no autorizado.",
                    },
                    403
                ),
        };
    }

    return {
        usuario: user,
        error: null,
    };
}

/* =========================================================
   VALIDAR ID
========================================================= */

function idPedidoValido(
    id: unknown
) {
    if (
        typeof id !==
        "string"
    ) {
        return false;
    }

    const valor =
        id.trim();

    if (
        valor.length < 1 ||
        valor.length > 100
    ) {
        return false;
    }

    return /^[a-zA-Z0-9_-]+$/.test(
        valor
    );
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
        /* =================================================
           RATE LIMIT
        ================================================= */

        const proteccion =
            aplicarRateLimit(
                request
            );

        if (
            proteccion.error
        ) {
            return proteccion.error;
        }

        /* =================================================
           AUTENTICACIÓN
        ================================================= */

        const autenticacion =
            await obtenerUsuarioAutenticado(
                request
            );

        if (
            autenticacion.error
        ) {
            return autenticacion.error;
        }

        /* =================================================
           ID
        ================================================= */

        const {
            id,
        } =
            await contexto.params;

        if (
            !idPedidoValido(
                id
            )
        ) {
            return respuestaJson(
                {
                    ok: false,

                    error:
                        "El identificador del pedido no es válido.",
                },
                400
            );
        }

        const idLimpio =
            id.trim();

        /* =================================================
           PEDIDO
        ================================================= */

        const {
            data: pedido,
            error: errorPedido,
        } =
            await supabaseAdmin
                .from("pedidos")
                .select(
                    CAMPOS_PEDIDO
                )
                .eq(
                    "id",
                    idLimpio
                )
                .maybeSingle();

        if (
            errorPedido
        ) {
            console.error(
                "Error obteniendo pedido:",
                errorPedido
            );

            return respuestaJson(
                {
                    ok: false,

                    error:
                        "No se pudo cargar el pedido.",
                },
                500
            );
        }

        if (
            !pedido
        ) {
            return respuestaJson(
                {
                    ok: false,

                    error:
                        "El pedido no existe.",
                },
                404
            );
        }

        /* =================================================
           ITEMS
        ================================================= */

        const {
            data: items,
            error: errorItems,
        } =
            await supabaseAdmin
                .from(
                    "pedido_items"
                )
                .select(
                    CAMPOS_ITEMS
                )
                .eq(
                    "pedido_id",
                    idLimpio
                )
                .order(
                    "creado_en",
                    {
                        ascending: true,
                    }
                );

        if (
            errorItems
        ) {
            console.error(
                "Error obteniendo productos del pedido:",
                errorItems
            );

            return respuestaJson(
                {
                    ok: false,

                    error:
                        "No se pudieron cargar los productos del pedido.",
                },
                500
            );
        }

        /* =================================================
           RESPUESTA
        ================================================= */

        return respuestaJson(
            {
                ok: true,

                administrador: {
                    id:
                        autenticacion.usuario?.id ??
                        "",

                    correo:
                        autenticacion.usuario
                            ?.email ??
                        "",
                },

                pedido,

                items:
                    items ??
                    [],
            },
            200,
            {
                "X-RateLimit-Limit":
                    String(
                        RATE_LIMIT_MAXIMO
                    ),

                "X-RateLimit-Remaining":
                    String(
                        proteccion
                            .limite
                            .restante
                    ),
            }
        );
    } catch (error) {
        console.error(
            "Error inesperado cargando pedido:",
            error
        );

        return respuestaJson(
            {
                ok: false,

                error:
                    "Ocurrió un error inesperado al cargar el pedido.",
            },
            500
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
        /* =================================================
           RATE LIMIT
        ================================================= */

        const proteccion =
            aplicarRateLimit(
                request
            );

        if (
            proteccion.error
        ) {
            return proteccion.error;
        }

        /* =================================================
           AUTENTICACIÓN
        ================================================= */

        const autenticacion =
            await obtenerUsuarioAutenticado(
                request
            );

        if (
            autenticacion.error
        ) {
            return autenticacion.error;
        }

        /* =================================================
           ID
        ================================================= */

        const {
            id,
        } =
            await contexto.params;

        if (
            !idPedidoValido(
                id
            )
        ) {
            return respuestaJson(
                {
                    ok: false,

                    error:
                        "El identificador del pedido no es válido.",
                },
                400
            );
        }

        const idLimpio =
            id.trim();

        /* =================================================
           BODY
        ================================================= */

        const contentLength =
            request.headers.get(
                "content-length"
            );

        if (
            contentLength
        ) {
            const bytes =
                Number(
                    contentLength
                );

            if (
                Number.isFinite(
                    bytes
                ) &&
                bytes > 10_000
            ) {
                return respuestaJson(
                    {
                        ok: false,

                        error:
                            "La solicitud es demasiado grande.",
                    },
                    413
                );
            }
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
            return respuestaJson(
                {
                    ok: false,

                    error:
                        "Los datos enviados no son válidos.",
                },
                400
            );
        }

        /* =================================================
           ESTADO
        ================================================= */

        const estadoSolicitado =
            typeof body.estado ===
                "string"
                ? body.estado
                      .trim()
                      .toLowerCase()
                : "";

        if (
            !estadoSolicitado ||
            !ESTADOS_VALIDOS.includes(
                estadoSolicitado as EstadoPedido
            )
        ) {
            return respuestaJson(
                {
                    ok: false,

                    error:
                        "Estado de pedido inválido.",
                },
                400
            );
        }

        /* =================================================
           PEDIDO ACTUAL
        ================================================= */

        const {
            data: pedidoActual,
            error: errorBusqueda,
        } =
            await supabaseAdmin
                .from("pedidos")
                .select(
                    "id, numero_pedido, estado"
                )
                .eq(
                    "id",
                    idLimpio
                )
                .maybeSingle();

        if (
            errorBusqueda
        ) {
            console.error(
                "Error buscando pedido:",
                errorBusqueda
            );

            return respuestaJson(
                {
                    ok: false,

                    error:
                        "No se pudo verificar el pedido.",
                },
                500
            );
        }

        if (
            !pedidoActual
        ) {
            return respuestaJson(
                {
                    ok: false,

                    error:
                        "El pedido no existe.",
                },
                404
            );
        }

        /* =================================================
           YA TIENE ESE ESTADO
        ================================================= */

        if (
            pedidoActual.estado ===
            estadoSolicitado
        ) {
            return respuestaJson(
                {
                    ok: true,

                    mensaje:
                        "El pedido ya tiene ese estado.",

                    pedido:
                        pedidoActual,
                },
                200,
                {
                    "X-RateLimit-Limit":
                        String(
                            RATE_LIMIT_MAXIMO
                        ),

                    "X-RateLimit-Remaining":
                        String(
                            proteccion
                                .limite
                                .restante
                        ),
                }
            );
        }

        /* =================================================
           ACTUALIZAR
        ================================================= */

        const {
            data: pedidoActualizado,
            error: errorActualizacion,
        } =
            await supabaseAdmin
                .from("pedidos")
                .update({
                    estado:
                        estadoSolicitado,
                })
                .eq(
                    "id",
                    idLimpio
                )
                .select(
                    CAMPOS_PEDIDO
                )
                .single();

        if (
            errorActualizacion ||
            !pedidoActualizado
        ) {
            console.error(
                "Error actualizando pedido:",
                errorActualizacion
            );

            return respuestaJson(
                {
                    ok: false,

                    error:
                        "No se pudo actualizar el estado del pedido.",
                },
                500
            );
        }

        /* =================================================
           RESPUESTA
        ================================================= */

        return respuestaJson(
            {
                ok: true,

                mensaje:
                    "Estado actualizado correctamente.",

                pedido:
                    pedidoActualizado,
            },
            200,
            {
                "X-RateLimit-Limit":
                    String(
                        RATE_LIMIT_MAXIMO
                    ),

                "X-RateLimit-Remaining":
                    String(
                        proteccion
                            .limite
                            .restante
                    ),
            }
        );
    } catch (error) {
        console.error(
            "Error inesperado actualizando pedido:",
            error
        );

        return respuestaJson(
            {
                ok: false,

                error:
                    "Ocurrió un error inesperado al actualizar el pedido.",
            },
            500
        );
    }
}