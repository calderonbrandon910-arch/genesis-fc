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

   El seguimiento es público, por lo que limitamos
   intentos para dificultar búsquedas automatizadas
   de números de pedido.
========================================================= */

const RATE_LIMIT_MAXIMO = 20;

const RATE_LIMIT_VENTANA_MS =
    10 * 60 * 1000;

/* =========================================================
   RATE LIMIT POR IP
========================================================= */

const globalRateLimit =
    globalThis as typeof globalThis & {
        genesisSeguimientoRateLimit?: Map<
            string,
            RegistroRateLimit
        >;
    };

const rateLimitStore =
    globalRateLimit
        .genesisSeguimientoRateLimit ??
    new Map<
        string,
        RegistroRateLimit
    >();

globalRateLimit.genesisSeguimientoRateLimit =
    rateLimitStore;

/* =========================================================
   RESPUESTA JSON
========================================================= */

function respuestaJson(
    body: Record<string, unknown>,
    status = 200,
    headers?: Record<string, string>
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
   VALIDAR NÚMERO DE PEDIDO
========================================================= */

function numeroPedidoValido(
    valor: string
) {
    return (
        valor.length >= 5 &&
        valor.length <= 80 &&
        /^[A-Z0-9_-]+$/.test(
            valor
        )
    );
}

/* =========================================================
   GET
   CONSULTAR SEGUIMIENTO
========================================================= */

export async function GET(
    request: NextRequest
) {
    try {
        /* =================================================
           1. RATE LIMIT
        ================================================= */

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
                        "Se han realizado demasiadas consultas. Espera unos minutos e inténtalo nuevamente.",
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

        /* =================================================
           2. NÚMERO DE PEDIDO
        ================================================= */

        const {
            searchParams,
        } =
            new URL(
                request.url
            );

        const numeroPedido =
            searchParams
                .get(
                    "numeroPedido"
                )
                ?.trim()
                .toUpperCase() ??
            "";

        if (
            !numeroPedido ||
            !numeroPedidoValido(
                numeroPedido
            )
        ) {
            return respuestaJson(
                {
                    ok: false,

                    error:
                        "Número de pedido inválido.",
                },
                400,
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
        }

        /* =================================================
           3. CONSULTAR SUPABASE

           Solo seleccionamos los datos necesarios para
           seguimiento. No exponemos nombre, teléfono,
           correo, dirección exacta ni notas.
        ================================================= */

        const {
            data: pedido,
            error,
        } =
            await supabaseAdmin
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

            return respuestaJson(
                {
                    ok: false,

                    error:
                        "No se pudo consultar el pedido.",
                },
                500
            );
        }

        /* =================================================
           4. PEDIDO NO ENCONTRADO

           Mantenemos una respuesta pública sencilla.
        ================================================= */

        if (!pedido) {
            return respuestaJson(
                {
                    ok: false,

                    error:
                        "No encontramos un pedido con ese número.",
                },
                404,
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
        }

        /* =================================================
           5. RESPUESTA
        ================================================= */

        return respuestaJson(
            {
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
            "Error inesperado en seguimiento:",
            error
        );

        return respuestaJson(
            {
                ok: false,

                error:
                    "Ocurrió un error inesperado al consultar el pedido.",
            },
            500
        );
    }
}