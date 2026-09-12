import "server-only";

import { randomUUID } from "crypto";
import {
    NextRequest,
    NextResponse,
} from "next/server";

import { supabaseAdmin } from "../../../lib/supabase/server";
import { obtenerTarifaEnvio } from "../../../lib/tienda/envios";

import {
    productosTienda,
    puntosVenta,
} from "../../../lib/datos-tienda";

/* =========================================================
   TIPOS
========================================================= */

type MetodoEntrega =
    | "envio"
    | "recoger";

type MetodoPago =
    | "transferencia"
    | "contraentrega";

type ProductoEntrada = {
    id: string;
    talla: string;
    cantidad: number;
};

type ClienteEntrada = {
    nombre: string;
    telefono: string;
    correo: string;

    metodoEntrega:
        MetodoEntrega;

    ciudad: string;
    direccion: string;
    puntoRetiro: string;
    notas: string;

    latitud?: number | null;
    longitud?: number | null;
};

type PedidoEntrada = {
    cliente: ClienteEntrada;

    productos:
        ProductoEntrada[];

    metodoPago?: MetodoPago;

    idempotencyKey?: string;
};

type PedidoAtomicoRespuesta = {
    id: string;

    numero_pedido: string;

    estado: string;

    estado_pago: string;

    total_articulos: number;

    subtotal: number;

    costo_envio:
        | number
        | null;

    total: number;

    moneda: string;

    creado_en: string;

    reutilizado: boolean;
};

type RegistroRateLimit = {
    cantidad: number;
    reinicio: number;
};

/* =========================================================
   CONFIGURACIÓN DE SEGURIDAD
========================================================= */

/*
   Este límite aplica únicamente a la creación
   de pedidos.

   Un visitante puede intentar crear como máximo
   5 pedidos dentro de una ventana de 10 minutos
   desde la misma IP.

   IMPORTANTE:
   Esta es una primera barrera por instancia.
   Más adelante podremos migrarla a un sistema
   distribuido si fuese necesario.
*/

const RATE_LIMIT_MAXIMO = 5;

const RATE_LIMIT_VENTANA_MS =
    10 * 60 * 1000;

/* =========================================================
   ALMACÉN DE RATE LIMIT
========================================================= */

const globalRateLimit =
    globalThis as typeof globalThis & {
        genesisPedidosRateLimit?: Map<
            string,
            RegistroRateLimit
        >;
    };

const rateLimitStore =
    globalRateLimit
        .genesisPedidosRateLimit ??
    new Map<
        string,
        RegistroRateLimit
    >();

globalRateLimit.genesisPedidosRateLimit =
    rateLimitStore;

/* =========================================================
   PRODUCTOS OFICIALES

   La API ya NO mantiene una segunda lista manual
   de productos o precios.

   La fuente oficial es:
   lib/datos-tienda.ts
========================================================= */

const PRODUCTOS =
    Object.fromEntries(
        productosTienda.map(
            (producto) => [
                producto.id,
                {
                    nombre:
                        producto.nombre,

                    precio:
                        producto.precio,

                    tallas:
                        producto.tallas,
                },
            ]
        )
    ) as Record<
        string,
        {
            nombre: string;
            precio: number;
            tallas: string[];
        }
    >;

/* =========================================================
   PUNTOS DE RETIRO OFICIALES
========================================================= */

const PUNTOS_RETIRO_VALIDOS =
    puntosVenta
        .filter(
            (punto) =>
                punto.tipo ===
                "Físico"
        )
        .map(
            (punto) =>
                `${punto.nombre} - ${punto.ciudad}`
        );

/* =========================================================
   MÉTODOS DE PAGO PERMITIDOS

   TARJETA NO ESTÁ HABILITADA ACTUALMENTE.

   Aunque alguien intente saltarse el frontend,
   la API rechazará "tarjeta".
========================================================= */

const METODOS_PAGO_VALIDOS:
    MetodoPago[] = [
        "transferencia",
        "contraentrega",
    ];

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
   VALIDAR TEXTO
========================================================= */

function textoValido(
    valor: unknown,
    minimo = 1,
    maximo = 300
) {
    return (
        typeof valor ===
            "string" &&
        valor.trim().length >=
            minimo &&
        valor.trim().length <=
            maximo
    );
}

/* =========================================================
   VALIDAR EMAIL
========================================================= */

function emailValido(
    valor: unknown
) {
    if (
        typeof valor !==
        "string"
    ) {
        return false;
    }

    const correo =
        valor.trim();

    if (
        correo.length < 5 ||
        correo.length > 254
    ) {
        return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        correo
    );
}

/* =========================================================
   VALIDAR TELÉFONO
========================================================= */

function telefonoValido(
    valor: unknown
) {
    if (
        typeof valor !==
        "string"
    ) {
        return false;
    }

    return /^[0-9+\-()\s]{7,25}$/.test(
        valor.trim()
    );
}

/* =========================================================
   VALIDAR COORDENADAS
========================================================= */

function coordenadaValida(
    valor: unknown,
    minimo: number,
    maximo: number
) {
    return (
        typeof valor ===
            "number" &&
        Number.isFinite(valor) &&
        valor >= minimo &&
        valor <= maximo
    );
}

/* =========================================================
   CREAR NÚMERO DE PEDIDO
========================================================= */

function crearNumeroPedido() {
    const ahora =
        new Date();

    const anio =
        String(
            ahora.getUTCFullYear()
        );

    const mes =
        String(
            ahora.getUTCMonth() +
                1
        ).padStart(
            2,
            "0"
        );

    const dia =
        String(
            ahora.getUTCDate()
        ).padStart(
            2,
            "0"
        );

    const codigo =
        randomUUID()
            .replace(
                /-/g,
                ""
            )
            .slice(
                0,
                8
            )
            .toUpperCase();

    return `GFC-${anio}${mes}${dia}-${codigo}`;
}

/* =========================================================
   CREAR IDEMPOTENCY KEY
========================================================= */

function crearIdempotencyKey() {
    return `gfc_${randomUUID()}`;
}

/* =========================================================
   VALIDAR RESPUESTA DE SUPABASE
========================================================= */

function esPedidoAtomicoValido(
    valor: unknown
): valor is PedidoAtomicoRespuesta {
    if (
        !valor ||
        typeof valor !==
            "object"
    ) {
        return false;
    }

    const pedido =
        valor as Partial<PedidoAtomicoRespuesta>;

    return (
        typeof pedido.id ===
            "string" &&

        typeof pedido
            .numero_pedido ===
            "string" &&

        typeof pedido.estado ===
            "string" &&

        typeof pedido
            .estado_pago ===
            "string" &&

        typeof pedido
            .total_articulos ===
            "number" &&

        typeof pedido.subtotal ===
            "number" &&

        (
            pedido.costo_envio ===
                null ||

            typeof pedido
                .costo_envio ===
                "number"
        ) &&

        typeof pedido.total ===
            "number" &&

        typeof pedido.moneda ===
            "string" &&

        typeof pedido
            .creado_en ===
            "string"
    );
}

/* =========================================================
   POST
   CREAR PEDIDO
========================================================= */

export async function POST(
    request: NextRequest
) {
    try {
        /* =================================================
           RATE LIMIT
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
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "Se han realizado demasiados intentos de pedido. Espera unos minutos e inténtalo nuevamente.",
                },
                {
                    status: 429,

                    headers: {
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
                    },
                }
            );
        }

        /* =================================================
           VALIDAR TAMAÑO DE LA SOLICITUD
        ================================================= */

        const contentLength =
            request.headers.get(
                "content-length"
            );

        if (contentLength) {
            const bytes =
                Number(
                    contentLength
                );

            if (
                Number.isFinite(
                    bytes
                ) &&
                bytes > 50_000
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "La solicitud es demasiado grande.",
                    },
                    {
                        status: 413,
                    }
                );
            }
        }

        /* =================================================
           LEER JSON
        ================================================= */

        let body:
            PedidoEntrada;

        try {
            body =
                (await request.json()) as PedidoEntrada;
        } catch {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "La solicitud no contiene información válida.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            !body ||
            typeof body !==
                "object"
        ) {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "La información del pedido no es válida.",
                },
                {
                    status: 400,
                }
            );
        }

        const cliente =
            body.cliente;

        const productos =
            body.productos;

        const metodoPago =
            body.metodoPago ??
            null;

        /* =================================================
           IDEMPOTENCIA
        ================================================= */

        const idempotencyKey =
            typeof body
                .idempotencyKey ===
                "string" &&

            body.idempotencyKey
                .trim().length >=
                10 &&

            body.idempotencyKey
                .trim().length <=
                200

                ? body.idempotencyKey.trim()

                : crearIdempotencyKey();

        /* =================================================
           CLIENTE
        ================================================= */

        if (
            !cliente ||
            typeof cliente !==
                "object"
        ) {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "Faltan los datos del cliente.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            !textoValido(
                cliente.nombre,
                2,
                100
            )
        ) {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "El nombre del cliente no es válido.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            !telefonoValido(
                cliente.telefono
            )
        ) {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "El número de teléfono no es válido.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            !emailValido(
                cliente.correo
            )
        ) {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "El correo electrónico no es válido.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            cliente.metodoEntrega !==
                "envio" &&

            cliente.metodoEntrega !==
                "recoger"
        ) {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "El método de entrega no es válido.",
                },
                {
                    status: 400,
                }
            );
        }

        /* =================================================
           ENTREGA + COORDENADAS
        ================================================= */

        let latitud:
            | number
            | null = null;

        let longitud:
            | number
            | null = null;

        if (
            cliente.metodoEntrega ===
            "envio"
        ) {
            if (
                !textoValido(
                    cliente.ciudad,
                    2,
                    100
                )
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "La ciudad de entrega no es válida.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            if (
                !textoValido(
                    cliente.direccion,
                    5,
                    500
                )
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "La dirección de entrega no es válida.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const tarifa =
                obtenerTarifaEnvio(
                    cliente.ciudad.trim()
                );

            if (!tarifa) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "La ciudad seleccionada no está configurada para envíos.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const tieneLatitud =
                cliente.latitud !==
                    undefined &&
                cliente.latitud !==
                    null;

            const tieneLongitud =
                cliente.longitud !==
                    undefined &&
                cliente.longitud !==
                    null;

            if (
                tieneLatitud !==
                tieneLongitud
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "La ubicación de entrega está incompleta.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            if (
                tieneLatitud &&
                tieneLongitud
            ) {
                if (
                    !coordenadaValida(
                        cliente.latitud,
                        -90,
                        90
                    ) ||

                    !coordenadaValida(
                        cliente.longitud,
                        -180,
                        180
                    )
                ) {
                    return NextResponse.json(
                        {
                            ok: false,

                            error:
                                "Las coordenadas de entrega no son válidas.",
                        },
                        {
                            status: 400,
                        }
                    );
                }

                latitud =
                    cliente.latitud as number;

                longitud =
                    cliente.longitud as number;
            }
        }

        /* =================================================
           RETIRO
        ================================================= */

        if (
            cliente.metodoEntrega ===
            "recoger"
        ) {
            if (
                !PUNTOS_RETIRO_VALIDOS.includes(
                    cliente.puntoRetiro
                )
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "El punto de retiro seleccionado no es válido.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            latitud = null;
            longitud = null;
        }

        /* =================================================
           NOTAS
        ================================================= */

        if (
            cliente.notas &&
            !textoValido(
                cliente.notas,
                0,
                500
            )
        ) {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "Las notas del pedido son demasiado largas.",
                },
                {
                    status: 400,
                }
            );
        }

        /* =================================================
           MÉTODO DE PAGO
        ================================================= */

        if (
            metodoPago !==
                null &&

            !METODOS_PAGO_VALIDOS.includes(
                metodoPago
            )
        ) {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "El método de pago no es válido o no está disponible.",
                },
                {
                    status: 400,
                }
            );
        }

        /* =================================================
           PRODUCTOS
        ================================================= */

        if (
            !Array.isArray(
                productos
            ) ||

            productos.length ===
                0
        ) {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "El pedido no contiene productos.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            productos.length >
            20
        ) {
            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "El pedido contiene demasiados productos.",
                },
                {
                    status: 400,
                }
            );
        }

        let subtotalPedido =
            0;

        let totalArticulos =
            0;

        const productosProcesados: {
            producto_id: string;

            nombre_producto:
                string;

            talla: string;

            cantidad: number;

            precio_unitario:
                number;

            subtotal: number;
        }[] = [];

        for (
            const producto of
                productos
        ) {
            if (
                !producto ||
                typeof producto !==
                    "object"
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "Existe un producto inválido en el pedido.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const productoOficial =
                PRODUCTOS[
                    producto.id
                ];

            if (
                !productoOficial
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "Uno de los productos seleccionados no es válido.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            /* =============================================
               TALLA VALIDADA POR PRODUCTO

               Ya no usamos una lista global duplicada.
               Cada producto usa las tallas publicadas
               en lib/datos-tienda.ts.
            ============================================= */

            if (
                typeof producto.talla !==
                    "string" ||

                !productoOficial.tallas.includes(
                    producto.talla
                )
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "La talla seleccionada no es válida para uno de los productos.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            if (
                !Number.isInteger(
                    producto.cantidad
                ) ||

                producto.cantidad <
                    1 ||

                producto.cantidad >
                    10
            ) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "La cantidad de uno de los productos no es válida.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            /* =============================================
               PRECIO CALCULADO POR EL SERVIDOR

               Nunca confiamos en precios enviados
               por el navegador.
            ============================================= */

            const subtotal =
                productoOficial.precio *
                producto.cantidad;

            subtotalPedido +=
                subtotal;

            totalArticulos +=
                producto.cantidad;

            productosProcesados.push(
                {
                    producto_id:
                        producto.id,

                    nombre_producto:
                        productoOficial.nombre,

                    talla:
                        producto.talla,

                    cantidad:
                        producto.cantidad,

                    precio_unitario:
                        productoOficial.precio,

                    subtotal,
                }
            );
        }

        /* =================================================
           ENVÍO
        ================================================= */

        let costoEnvio:
            | number
            | null = null;

        let envioDisponible =
            false;

        if (
            cliente.metodoEntrega ===
            "recoger"
        ) {
            costoEnvio = 0;

            envioDisponible =
                true;
        }

        if (
            cliente.metodoEntrega ===
            "envio"
        ) {
            const tarifa =
                obtenerTarifaEnvio(
                    cliente.ciudad.trim()
                );

            if (!tarifa) {
                return NextResponse.json(
                    {
                        ok: false,

                        error:
                            "No existe una tarifa configurada para esta ciudad.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            envioDisponible =
                tarifa.disponible;

            costoEnvio =
                tarifa.disponible
                    ? tarifa.costo
                    : null;
        }

        /* =================================================
           TOTAL FINAL

           Se calcula únicamente en servidor.
        ================================================= */

        const totalPedido =
            subtotalPedido +
            (
                costoEnvio ??
                0
            );

        const numeroPedido =
            crearNumeroPedido();

        /* =================================================
           SUPABASE
           CREACIÓN ATÓMICA + IDEMPOTENTE
        ================================================= */

        const {
            data,
            error,
        } =
            await supabaseAdmin.rpc(
                "crear_pedido_atomico",
                {
                    p_idempotency_key:
                        idempotencyKey,

                    p_numero_pedido:
                        numeroPedido,

                    p_estado:
                        "pendiente",

                    p_estado_pago:
                        "pendiente",

                    p_metodo_pago:
                        metodoPago,

                    p_nombre_cliente:
                        cliente.nombre.trim(),

                    p_telefono:
                        cliente.telefono.trim(),

                    p_correo:
                        cliente.correo
                            .trim()
                            .toLowerCase(),

                    p_metodo_entrega:
                        cliente.metodoEntrega,

                    p_ciudad:
                        cliente.metodoEntrega ===
                        "envio"
                            ? cliente.ciudad.trim()
                            : null,

                    p_direccion:
                        cliente.metodoEntrega ===
                        "envio"
                            ? cliente.direccion.trim()
                            : null,

                    p_punto_retiro:
                        cliente.metodoEntrega ===
                        "recoger"
                            ? cliente.puntoRetiro
                            : null,

                    p_notas:
                        cliente.notas?.trim() ||
                        null,

                    p_latitud:
                        latitud,

                    p_longitud:
                        longitud,

                    p_total_articulos:
                        totalArticulos,

                    p_subtotal:
                        subtotalPedido,

                    p_costo_envio:
                        costoEnvio,

                    p_total:
                        totalPedido,

                    p_moneda:
                        "HNL",

                    p_items:
                        productosProcesados,
                }
            );

        /* =================================================
           ERROR SUPABASE
        ================================================= */

        if (error) {
            console.error(
                "Error creando pedido en Supabase:",
                error
            );

            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "No se pudo crear el pedido.",
                },
                {
                    status: 500,
                }
            );
        }

        /* =================================================
           NORMALIZAR RESPUESTA RPC
        ================================================= */

        const pedidoCrudo =
            Array.isArray(data)
                ? data[0]
                : data;

        if (
            !esPedidoAtomicoValido(
                pedidoCrudo
            )
        ) {
            console.error(
                "Respuesta inesperada de crear_pedido_atomico:",
                data
            );

            return NextResponse.json(
                {
                    ok: false,

                    error:
                        "El servidor recibió una respuesta inválida al crear el pedido.",
                },
                {
                    status: 500,
                }
            );
        }

        const pedido =
            pedidoCrudo;

        console.log(
            pedido.reutilizado
                ? "Pedido existente reutilizado:"
                : "Pedido nuevo creado:",
            pedido.numero_pedido
        );

        /* =================================================
           RESPUESTA AL FRONTEND
        ================================================= */

        return NextResponse.json(
            {
                ok: true,

                mensaje:
                    pedido.reutilizado
                        ? "Pedido recuperado correctamente."
                        : "Pedido guardado correctamente.",

                reutilizado:
                    pedido.reutilizado,

                idempotencyKey,

                envio: {
                    metodo:
                        cliente.metodoEntrega,

                    ciudad:
                        cliente.metodoEntrega ===
                        "envio"
                            ? cliente.ciudad.trim()
                            : null,

                    disponible:
                        envioDisponible,

                    costo:
                        pedido.costo_envio,

                    pendiente:
                        cliente.metodoEntrega ===
                            "envio" &&
                        !envioDisponible,

                    ubicacion: {
                        latitud,
                        longitud,
                    },
                },

                pedido: {
                    id:
                        pedido.id,

                    numeroPedido:
                        pedido.numero_pedido,

                    estado:
                        pedido.estado,

                    estadoPago:
                        pedido.estado_pago,

                    totalArticulos:
                        pedido.total_articulos,

                    subtotal:
                        pedido.subtotal,

                    envio:
                        pedido.costo_envio,

                    total:
                        pedido.total,

                    moneda:
                        pedido.moneda,

                    creadoEn:
                        pedido.creado_en,
                },
            },
            {
                status: 201,

                headers: {
                    "X-RateLimit-Limit":
                        String(
                            RATE_LIMIT_MAXIMO
                        ),

                    "X-RateLimit-Remaining":
                        String(
                            limite.restante
                        ),
                },
            }
        );
    } catch (error) {
        console.error(
            "Error general creando pedido:",
            error
        );

        return NextResponse.json(
            {
                ok: false,

                error:
                    "No se pudo procesar el pedido.",
            },
            {
                status: 500,
            }
        );
    }
}

/* =========================================================
   GET
   HEALTH CHECK PÚBLICO

   No exponemos:
   - variables de entorno
   - estado de secretos
   - configuración interna de Supabase
========================================================= */

export async function GET() {
    return NextResponse.json(
        {
            ok: true,

            servicio:
                "API de pedidos Génesis FC",

            estado:
                "activo",
        },
        {
            status: 200,

            headers: {
                "Cache-Control":
                    "no-store",
            },
        }
    );
}