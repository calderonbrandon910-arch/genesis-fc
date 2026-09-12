import "server-only";

import {
    NextRequest,
    NextResponse,
} from "next/server";

import { supabaseAdmin } from "../../../../lib/supabase/server";

/* =========================================================
   TIPOS
========================================================= */

type RegistroRateLimit = {
    cantidad: number;
    reinicio: number;
};

/* =========================================================
   CONFIGURACIÓN DE SEGURIDAD
========================================================= */

const RATE_LIMIT_MAXIMO = 60;

const RATE_LIMIT_VENTANA_MS =
    60 * 1000;

/*
    60 solicitudes por minuto por IP.

    Es suficiente para el panel administrativo
    y ayuda a frenar abuso automatizado.

    Esta protección funciona por instancia.
    Más adelante podemos migrarla a un rate limit
    distribuido si fuese necesario.
*/

/* =========================================================
   ALMACÉN DE RATE LIMIT
========================================================= */

const globalRateLimit =
    globalThis as typeof globalThis & {
        genesisAdminPedidosRateLimit?: Map<
            string,
            RegistroRateLimit
        >;
    };

const rateLimitStore =
    globalRateLimit
        .genesisAdminPedidosRateLimit ??
    new Map<
        string,
        RegistroRateLimit
    >();

globalRateLimit.genesisAdminPedidosRateLimit =
    rateLimitStore;

/* =========================================================
   OBTENER IP
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
   OBTENER BEARER TOKEN
========================================================= */

function obtenerBearerToken(
    request: NextRequest
) {
    const authorization =
        request.headers.get(
            "authorization"
        );

    if (!authorization) {
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
   ADMINISTRADORES PERMITIDOS
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
   RESPUESTA SIN CACHÉ
========================================================= */

function respuestaJson(
    body: Record<
        string,
        unknown
    >,
    status: number,
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
   GET
========================================================= */

export async function GET(
    request: NextRequest
) {
    try {
        /* =====================================================
           1. RATE LIMIT
        ===================================================== */

        const ip =
            obtenerIp(request);

        const limite =
            comprobarRateLimit(ip);

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

        if (
            !limite.permitido
        ) {
            return respuestaJson(
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
            );
        }

        /* =====================================================
           2. TOKEN
        ===================================================== */

        const token =
            obtenerBearerToken(
                request
            );

        if (!token) {
            return respuestaJson(
                {
                    ok: false,

                    error:
                        "Acceso no autorizado.",
                },
                401
            );
        }

        /* =====================================================
           3. VALIDAR USUARIO CON SUPABASE AUTH
        ===================================================== */

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
            return respuestaJson(
                {
                    ok: false,

                    error:
                        "Acceso no autorizado.",
                },
                401
            );
        }

        const correo =
            usuarioData.user.email
                ?.trim()
                .toLowerCase() ??
            "";

        /* =====================================================
           4. ADMIN_EMAILS
        ===================================================== */

        const administradoresPermitidos =
            obtenerAdministradoresPermitidos();

        if (
            administradoresPermitidos.length ===
            0
        ) {
            console.error(
                "ADMIN_EMAILS no está configurado."
            );

            return respuestaJson(
                {
                    ok: false,

                    error:
                        "El servicio administrativo no está disponible.",
                },
                503
            );
        }

        if (
            !correo ||
            !administradoresPermitidos.includes(
                correo
            )
        ) {
            console.warn(
                "Intento de acceso administrativo sin permisos:",
                usuarioData.user.id
            );

            return respuestaJson(
                {
                    ok: false,

                    error:
                        "Acceso no autorizado.",
                },
                403
            );
        }

        /* =====================================================
           5. LEER PEDIDOS
        ===================================================== */

        const {
            data: pedidos,
            error: pedidosError,
        } =
            await supabaseAdmin
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

            return respuestaJson(
                {
                    ok: false,

                    error:
                        "No se pudieron cargar los pedidos.",
                },
                500
            );
        }

        /* =====================================================
           6. RESUMEN
        ===================================================== */

        const lista =
            pedidos ?? [];

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

        /* =====================================================
           7. RESPUESTA
        ===================================================== */

        return respuestaJson(
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
            200,
            {
                "X-RateLimit-Limit":
                    String(
                        RATE_LIMIT_MAXIMO
                    ),

                "X-RateLimit-Remaining":
                    String(
                        limite.restante
                    ),
            }
        );
    } catch (error) {
        console.error(
            "Error general en API administrativa de pedidos:",
            error
        );

        return respuestaJson(
            {
                ok: false,

                error:
                    "No se pudo procesar la solicitud administrativa.",
            },
            500
        );
    }
}