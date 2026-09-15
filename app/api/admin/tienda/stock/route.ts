import {
    NextRequest,
    NextResponse,
} from "next/server";

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

type AvisoReposicion = {
    id: string;
    producto_id: string;
    talla: string;
    correo: string;
    activo: boolean;
    creado_en: string;
    notificado_en: string | null;
};

const PRODUCTOS: Record<
    ProductoId,
    {
        nombre: string;
        href: string;
    }
> = {
    "jersey-blanco": {
        nombre: "Jersey Blanco",
        href: "/tienda/jersey-blanco",
    },

    "jersey-azul": {
        nombre: "Jersey Azul",
        href: "/tienda/jersey-azul",
    },

    "jersey-visitante": {
        nombre: "Jersey Visitante",
        href: "/tienda/jersey-visitante",
    },
};

function obtenerAdministradoresPermitidos() {
    const valor =
        process.env.ADMIN_EMAILS ?? "";

    return valor
        .split(",")
        .map((correo) =>
            correo
                .trim()
                .toLowerCase()
        )
        .filter(Boolean);
}

async function obtenerUsuarioAutenticado(
    request: NextRequest
) {
    const authorization =
        request.headers.get(
            "authorization"
        );

    if (
        !authorization ||
        !authorization.startsWith(
            "Bearer "
        )
    ) {
        return {
            usuario: null,
            error: NextResponse.json(
                {
                    ok: false,
                    error:
                        "Sesión administrativa no encontrada.",
                },
                {
                    status: 401,
                }
            ),
        };
    }

    const token = authorization
        .replace(
            "Bearer ",
            ""
        )
        .trim();

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
            error: NextResponse.json(
                {
                    ok: false,
                    error:
                        "La sesión administrativa expiró o no es válida.",
                },
                {
                    status: 401,
                }
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
        return {
            usuario: null,
            error: NextResponse.json(
                {
                    ok: false,
                    error:
                        "El acceso administrativo todavía no está configurado.",
                },
                {
                    status: 500,
                }
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
                {
                    status: 403,
                }
            ),
        };
    }

    return {
        usuario: user,
        error: null,
    };
}

function obtenerUrlBase() {
    const configurada =
        process.env.NEXT_PUBLIC_SITE_URL
            ?.trim()
            .replace(
                /\/+$/,
                ""
            );

    if (configurada) {
        return configurada;
    }

    return "https://www.genesisfc.app";
}

function crearHtmlReposicion(
    productoId: ProductoId,
    talla: Talla
) {
    const producto =
        PRODUCTOS[productoId];

    const urlProducto =
        `${obtenerUrlBase()}${producto.href}`;

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />
    <title>Tu talla volvió a estar disponible</title>
</head>

<body
    style="
        margin:0;
        padding:0;
        background:#f4f5f7;
        font-family:Arial,Helvetica,sans-serif;
        color:#0b1f43;
    "
>
    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
            width:100%;
            background:#f4f5f7;
            padding:32px 16px;
        "
    >
        <tr>
            <td align="center">
                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        max-width:620px;
                        background:#ffffff;
                    "
                >
                    <tr>
                        <td
                            style="
                                background:#071d49;
                                padding:38px 32px;
                                text-align:center;
                            "
                        >
                            <p
                                style="
                                    margin:0;
                                    color:#5cc8ff;
                                    font-size:11px;
                                    font-weight:800;
                                    letter-spacing:3px;
                                    text-transform:uppercase;
                                "
                            >
                                Génesis FC Shop
                            </p>

                            <h1
                                style="
                                    margin:16px 0 0;
                                    color:#ffffff;
                                    font-size:34px;
                                    line-height:1;
                                    text-transform:uppercase;
                                "
                            >
                                Tu talla volvió.
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td
                            style="
                                padding:38px 34px;
                            "
                        >
                            <p
                                style="
                                    margin:0;
                                    font-size:16px;
                                    line-height:1.7;
                                    color:#40506d;
                                "
                            >
                                Tenemos buenas noticias.
                                El
                                <strong>
                                    ${producto.nombre}
                                </strong>
                                en talla
                                <strong>
                                    ${talla}
                                </strong>
                                vuelve a estar disponible
                                en la Tienda Oficial de
                                Génesis FC.
                            </p>

                            <div
                                style="
                                    margin:30px 0;
                                    padding:22px;
                                    background:#f3f8fc;
                                    border-left:4px solid #158bd2;
                                "
                            >
                                <p
                                    style="
                                        margin:0;
                                        color:#158bd2;
                                        font-size:11px;
                                        font-weight:800;
                                        letter-spacing:2px;
                                        text-transform:uppercase;
                                    "
                                >
                                    Disponible ahora
                                </p>

                                <p
                                    style="
                                        margin:10px 0 0;
                                        font-size:20px;
                                        font-weight:800;
                                    "
                                >
                                    ${producto.nombre}
                                    · Talla ${talla}
                                </p>
                            </div>

                            <p
                                style="
                                    margin:0;
                                    font-size:14px;
                                    line-height:1.7;
                                    color:#68758b;
                                "
                            >
                                La disponibilidad puede
                                cambiar según las compras
                                realizadas después de este
                                aviso.
                            </p>

                            <div
                                style="
                                    margin-top:32px;
                                    text-align:center;
                                "
                            >
                                <a
                                    href="${urlProducto}"
                                    style="
                                        display:inline-block;
                                        background:#158bd2;
                                        color:#ffffff;
                                        padding:16px 28px;
                                        text-decoration:none;
                                        font-size:12px;
                                        font-weight:800;
                                        letter-spacing:1.5px;
                                        text-transform:uppercase;
                                    "
                                >
                                    Ver producto
                                </a>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td
                            style="
                                background:#071d49;
                                padding:24px 32px;
                                text-align:center;
                            "
                        >
                            <p
                                style="
                                    margin:0;
                                    color:#ffffff;
                                    font-size:12px;
                                    font-weight:700;
                                "
                            >
                                Génesis FC
                            </p>

                            <p
                                style="
                                    margin:7px 0 0;
                                    color:#ffffff;
                                    opacity:0.45;
                                    font-size:11px;
                                "
                            >
                                La Paz · Honduras
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

async function enviarCorreoReposicion(
    correo: string,
    productoId: ProductoId,
    talla: Talla
) {
    const apiKey =
        process.env.RESEND_API_KEY?.trim();

    const from =
        process.env.RESEND_FROM_EMAIL?.trim();

    if (
        !apiKey ||
        !from
    ) {
        console.error(
            "Resend no está configurado. Faltan RESEND_API_KEY o RESEND_FROM_EMAIL."
        );

        return {
            ok: false,
            error:
                "Servicio de correo no configurado.",
        };
    }

    const producto =
        PRODUCTOS[productoId];

    try {
        const response =
            await fetch(
                "https://api.resend.com/emails",
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${apiKey}`,

                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        from,

                        to: [
                            correo,
                        ],

                        subject:
                            `${producto.nombre} talla ${talla} volvió a estar disponible`,

                        html:
                            crearHtmlReposicion(
                                productoId,
                                talla
                            ),
                    }),
                }
            );

        const data =
            await response
                .json()
                .catch(
                    () => null
                );

        if (!response.ok) {
            console.error(
                "Resend rechazó el correo de reposición:",
                {
                    correo,
                    productoId,
                    talla,
                    status:
                        response.status,
                    data,
                }
            );

            return {
                ok: false,
                error:
                    "Resend rechazó el correo.",
            };
        }

        return {
            ok: true,
            id:
                typeof data?.id ===
                "string"
                    ? data.id
                    : null,
        };
    } catch (error) {
        console.error(
            "Error enviando correo de reposición:",
            {
                correo,
                productoId,
                talla,
                error,
            }
        );

        return {
            ok: false,
            error:
                "No se pudo conectar con Resend.",
        };
    }
}

async function procesarAvisosReposicion(
    productoId: ProductoId,
    talla: Talla
) {
    const {
        data,
        error,
    } =
        await supabaseAdmin
            .from(
                "tienda_reposicion_avisos"
            )
            .select(
                "id, producto_id, talla, correo, activo, creado_en, notificado_en"
            )
            .eq(
                "producto_id",
                productoId
            )
            .eq(
                "talla",
                talla
            )
            .eq(
                "activo",
                true
            )
            .is(
                "notificado_en",
                null
            );

    if (error) {
        console.error(
            "Error buscando avisos de reposición:",
            error
        );

        return {
            encontrados: 0,
            enviados: 0,
            fallidos: 0,
        };
    }

    const avisos =
        (data ??
            []) as AvisoReposicion[];

    if (
        avisos.length ===
        0
    ) {
        return {
            encontrados: 0,
            enviados: 0,
            fallidos: 0,
        };
    }

    let enviados = 0;
    let fallidos = 0;

    for (
        const aviso of avisos
    ) {
        const resultado =
            await enviarCorreoReposicion(
                aviso.correo,
                productoId,
                talla
            );

        if (!resultado.ok) {
            fallidos += 1;

            continue;
        }

        const {
            error:
                updateError,
        } =
            await supabaseAdmin
                .from(
                    "tienda_reposicion_avisos"
                )
                .update({
                    activo:
                        false,
                    notificado_en:
                        new Date()
                            .toISOString(),
                })
                .eq(
                    "id",
                    aviso.id
                )
                .eq(
                    "activo",
                    true
                );

        if (updateError) {
            console.error(
                "El correo fue enviado, pero no se pudo marcar el aviso como notificado:",
                {
                    avisoId:
                        aviso.id,
                    correo:
                        aviso.correo,
                    updateError,
                }
            );

            fallidos += 1;

            continue;
        }

        enviados += 1;
    }

    return {
        encontrados:
            avisos.length,

        enviados,

        fallidos,
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

        if (
            autenticacion.error
        ) {
            return autenticacion.error;
        }

        const {
            data,
            error,
        } =
            await supabaseAdmin
                .from(
                    "tienda_stock"
                )
                .select(
                    "producto_id, talla, stock, actualizado_en"
                )
                .order(
                    "producto_id",
                    {
                        ascending:
                            true,
                    }
                );

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
                {
                    status: 500,
                }
            );
        }

        return NextResponse.json({
            ok: true,

            administrador: {
                id:
                    autenticacion
                        .usuario
                        ?.id ??
                    "",

                correo:
                    autenticacion
                        .usuario
                        ?.email ??
                    "",
            },

            stock:
                (data ??
                    []) as StockRow[],
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
            {
                status: 500,
            }
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

        if (
            autenticacion.error
        ) {
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
            typeof stock !==
                "number" ||
            !Number.isInteger(
                stock
            ) ||
            stock < 0 ||
            stock > 9999
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "Los datos de inventario no son válidos.",
                },
                {
                    status: 400,
                }
            );
        }

        const productoIdSeguro =
            productoId as ProductoId;

        const tallaSegura =
            talla as Talla;

        /*
        ============================================================
        LEER STOCK ANTERIOR
        ============================================================
        */

        const {
            data:
                stockAnteriorData,
            error:
                stockAnteriorError,
        } =
            await supabaseAdmin
                .from(
                    "tienda_stock"
                )
                .select(
                    "producto_id, talla, stock, actualizado_en"
                )
                .eq(
                    "producto_id",
                    productoIdSeguro
                )
                .eq(
                    "talla",
                    tallaSegura
                )
                .single();

        if (
            stockAnteriorError ||
            !stockAnteriorData
        ) {
            console.error(
                "Error leyendo stock anterior:",
                stockAnteriorError
            );

            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "No se pudo comprobar el inventario anterior.",
                },
                {
                    status: 500,
                }
            );
        }

        const stockAnterior =
            stockAnteriorData.stock;

        /*
        ============================================================
        ACTUALIZAR STOCK
        ============================================================
        */

        const {
            data,
            error,
        } =
            await supabaseAdmin
                .from(
                    "tienda_stock"
                )
                .update({
                    stock,
                })
                .eq(
                    "producto_id",
                    productoIdSeguro
                )
                .eq(
                    "talla",
                    tallaSegura
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
                {
                    status: 500,
                }
            );
        }

        /*
        ============================================================
        DETECTAR REPOSICIÓN
        ============================================================

        Solo enviamos avisos cuando:

        stock anterior = 0
        stock nuevo > 0

        Cambios como:
        10 -> 8
        5 -> 10
        1 -> 5

        NO disparan correos.
        ============================================================
        */

        const huboReposicion =
            stockAnterior === 0 &&
            stock > 0;

        let reposicion = {
            detectada:
                huboReposicion,

            avisosEncontrados:
                0,

            correosEnviados:
                0,

            correosFallidos:
                0,
        };

        if (huboReposicion) {
            const resultado =
                await procesarAvisosReposicion(
                    productoIdSeguro,
                    tallaSegura
                );

            reposicion = {
                detectada:
                    true,

                avisosEncontrados:
                    resultado.encontrados,

                correosEnviados:
                    resultado.enviados,

                correosFallidos:
                    resultado.fallidos,
            };

        }

        /*
        ============================================================
        RESPUESTA
        ============================================================
        */

        return NextResponse.json({
            ok: true,

            stock:
                data as StockRow,

            reposicion,

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
            {
                status: 500,
            }
        );
    }
}