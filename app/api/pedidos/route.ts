import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "../../../lib/supabase/server";
import { obtenerTarifaEnvio } from "../../../lib/tienda/envios";

type MetodoEntrega = "envio" | "recoger";

type MetodoPago =
    | "tarjeta"
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
    metodoEntrega: MetodoEntrega;
    ciudad: string;
    direccion: string;
    puntoRetiro: string;
    notas: string;
    latitud?: number | null;
    longitud?: number | null;
};

type PedidoEntrada = {
    cliente: ClienteEntrada;
    productos: ProductoEntrada[];
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
    costo_envio: number | null;
    total: number;
    moneda: string;
    creado_en: string;
    reutilizado: boolean;
};

const PRODUCTOS = {
    "jersey-blanco": {
        nombre: "Jersey Blanco",
        precio: 1300,
    },
    "jersey-azul": {
        nombre: "Jersey Azul",
        precio: 1300,
    },
    "jersey-visitante": {
        nombre: "Jersey Visitante",
        precio: 1300,
    },
} as const;

const TALLAS_VALIDAS = [
    "S",
    "M",
    "L",
    "XL",
    "2XL",
];

const PUNTOS_RETIRO_VALIDOS = [
    "K9 Store - La Paz",
    "Suutuk - Tegucigalpa",
];

const METODOS_PAGO_VALIDOS: MetodoPago[] = [
    "tarjeta",
    "transferencia",
    "contraentrega",
];

function textoValido(
    valor: unknown,
    minimo = 1,
    maximo = 300
) {
    return (
        typeof valor === "string" &&
        valor.trim().length >= minimo &&
        valor.trim().length <= maximo
    );
}

function emailValido(valor: unknown) {
    if (typeof valor !== "string") {
        return false;
    }

    const correo = valor.trim();

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

function telefonoValido(valor: unknown) {
    if (typeof valor !== "string") {
        return false;
    }

    return /^[0-9+\-()\s]{7,25}$/.test(
        valor.trim()
    );
}

function coordenadaValida(
    valor: unknown,
    minimo: number,
    maximo: number
) {
    return (
        typeof valor === "number" &&
        Number.isFinite(valor) &&
        valor >= minimo &&
        valor <= maximo
    );
}

function crearNumeroPedido() {
    const ahora = new Date();

    const anio = String(
        ahora.getUTCFullYear()
    );

    const mes = String(
        ahora.getUTCMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        ahora.getUTCDate()
    ).padStart(2, "0");

    const codigo = randomUUID()
        .replace(/-/g, "")
        .slice(0, 8)
        .toUpperCase();

    return `GFC-${anio}${mes}${dia}-${codigo}`;
}

function crearIdempotencyKey() {
    return `gfc_${randomUUID()}`;
}

function esPedidoAtomicoValido(
    valor: unknown
): valor is PedidoAtomicoRespuesta {
    if (
        !valor ||
        typeof valor !== "object"
    ) {
        return false;
    }

    const pedido =
        valor as Partial<PedidoAtomicoRespuesta>;

    return (
        typeof pedido.id === "string" &&
        typeof pedido.numero_pedido ===
            "string" &&
        typeof pedido.estado === "string" &&
        typeof pedido.estado_pago ===
            "string" &&
        typeof pedido.total_articulos ===
            "number" &&
        typeof pedido.subtotal === "number" &&
        (
            pedido.costo_envio === null ||
            typeof pedido.costo_envio ===
                "number"
        ) &&
        typeof pedido.total === "number" &&
        typeof pedido.moneda === "string" &&
        typeof pedido.creado_en === "string"
    );
}

export async function POST(
    request: NextRequest
) {
    try {
        const body =
            (await request.json()) as PedidoEntrada;

        if (
            !body ||
            typeof body !== "object"
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

        const cliente = body.cliente;
        const productos = body.productos;

        const metodoPago =
            body.metodoPago ?? null;

        const idempotencyKey =
            typeof body.idempotencyKey ===
                "string" &&
            body.idempotencyKey.trim().length >=
                10 &&
            body.idempotencyKey.trim().length <=
                200
                ? body.idempotencyKey.trim()
                : crearIdempotencyKey();

        /* =====================================================
           CLIENTE
        ===================================================== */

        if (
            !cliente ||
            typeof cliente !== "object"
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

        /* =====================================================
           ENTREGA + COORDENADAS
        ===================================================== */

        let latitud: number | null = null;
        let longitud: number | null = null;

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
                cliente.latitud !== null;

            const tieneLongitud =
                cliente.longitud !==
                    undefined &&
                cliente.longitud !== null;

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

        /* =====================================================
           MÉTODO DE PAGO
        ===================================================== */

        if (
            metodoPago !== null &&
            !METODOS_PAGO_VALIDOS.includes(
                metodoPago
            )
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "El método de pago no es válido.",
                },
                {
                    status: 400,
                }
            );
        }

        /* =====================================================
           PRODUCTOS
        ===================================================== */

        if (
            !Array.isArray(productos) ||
            productos.length === 0
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

        if (productos.length > 20) {
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

        let subtotalPedido = 0;
        let totalArticulos = 0;

        const productosProcesados: {
            producto_id: string;
            nombre_producto: string;
            talla: string;
            cantidad: number;
            precio_unitario: number;
            subtotal: number;
        }[] = [];

        for (const producto of productos) {
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

            if (
                !Object.prototype.hasOwnProperty.call(
                    PRODUCTOS,
                    producto.id
                )
            ) {
                return NextResponse.json(
                    {
                        ok: false,
                        error:
                            `Producto inválido: ${producto.id}`,
                    },
                    {
                        status: 400,
                    }
                );
            }

            if (
                !TALLAS_VALIDAS.includes(
                    producto.talla
                )
            ) {
                return NextResponse.json(
                    {
                        ok: false,
                        error:
                            `Talla inválida: ${producto.talla}`,
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
                producto.cantidad < 1 ||
                producto.cantidad > 10
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

            const productoOficial =
                PRODUCTOS[
                    producto.id as keyof typeof PRODUCTOS
                ];

            const subtotal =
                productoOficial.precio *
                producto.cantidad;

            subtotalPedido += subtotal;

            totalArticulos +=
                producto.cantidad;

            productosProcesados.push({
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
            });
        }

        /* =====================================================
           ENVÍO
        ===================================================== */

        let costoEnvio:
            | number
            | null = null;

        let envioDisponible = false;

        if (
            cliente.metodoEntrega ===
            "recoger"
        ) {
            costoEnvio = 0;
            envioDisponible = true;
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

        const totalPedido =
            subtotalPedido +
            (costoEnvio ?? 0);

        const numeroPedido =
            crearNumeroPedido();

        /* =====================================================
           SUPABASE RPC
        ===================================================== */

        const {
            data,
            error,
        } = await supabaseAdmin.rpc(
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

        /* =====================================================
           NORMALIZAR RESPUESTA DE LA RPC

           Las funciones RETURNS TABLE de PostgreSQL
           normalmente llegan desde Supabase como array.

           Ejemplo:
           [
               {
                   id: "...",
                   total: 1300
               }
           ]

           Nuestro frontend necesita solamente el objeto.
        ===================================================== */

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

        /* =====================================================
           RESPUESTA AL FRONTEND
        ===================================================== */

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

export async function GET() {
    return NextResponse.json(
        {
            ok: true,

            servicio:
                "API de pedidos Génesis FC",

            estado:
                "activo",

            almacenamiento:
                "Supabase PostgreSQL",

            modoCreacion:
                "atómico + idempotente",

            respuestaRpc:
                "normalizada",

            envio:
                "calculado por servidor",

            ubicacion:
                "preparada para coordenadas",

            configuracion: {
                supabaseUrl:
                    process.env.SUPABASE_URL
                        ? "configurada"
                        : "faltante",

                supabaseSecret:
                    process.env
                        .SUPABASE_SECRET_KEY
                        ? "configurada"
                        : "faltante",
            },
        },
        {
            status: 200,
        }
    );
}