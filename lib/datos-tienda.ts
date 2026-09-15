export type TipoProducto =
    | "Local"
    | "Alternativo"
    | "Visitante";

export type CategoriaProducto =
    | "Jerseys";

export type EstadoStock =
    | "disponible"
    | "pocas-unidades"
    | "agotado"
    | "sin-configurar";

export type StockPorTalla = Record<
    string,
    number | null
>;

export type ProductoTienda = {
    id: string;
    nombre: string;
    nombreCorto: string;
    precio: number;
    precioTexto: string;
    tipo: TipoProducto;
    categoria: CategoriaProducto;
    color: string;
    tallas: string[];
    coleccion: string;
    descripcion: string;
    imagen: string;
    enlace: string;
    personalizable: boolean;
    stockPorTalla: StockPorTalla;
};

export type PuntoVenta = {
    nombre: string;
    ciudad: string;
    tipo: "Físico" | "Online";
    enlace?: string;
};

/* =========================================================
   PRODUCTOS OFICIALES
========================================================= */

export const productosTienda: ProductoTienda[] = [
    {
        id: "jersey-blanco",
        nombre: "Jersey Blanco",
        nombreCorto: "Blanco",
        precio: 1300,
        precioTexto: "L 1,300",
        tipo: "Alternativo",
        categoria: "Jerseys",
        color: "Blanco / Azul",
        tallas: ["S", "M", "L", "XL", "2XL"],
        coleccion: "2026",
        descripcion:
            "Base blanca, líneas verticales azules y detalles contrastantes en cuello y mangas. Una versión elegante de la identidad de Génesis FC.",
        imagen: "/tienda-hero.jpg",
        enlace: "/tienda/jersey-blanco",
        personalizable: true,
        stockPorTalla: {
            S: null,
            M: null,
            L: null,
            XL: null,
            "2XL": null,
        },
    },
    {
        id: "jersey-azul",
        nombre: "Jersey Azul",
        nombreCorto: "Azul",
        precio: 1300,
        precioTexto: "L 1,300",
        tipo: "Local",
        categoria: "Jerseys",
        color: "Azul",
        tallas: ["S", "M", "L", "XL", "2XL"],
        coleccion: "2026",
        descripcion:
            "El uniforme local de Génesis FC. Azul como protagonista, detalles oficiales del club y una identidad creada para representar nuestros colores.",
        imagen: "/jersey-azul-principal.png",
        enlace: "/tienda/jersey-azul",
        personalizable: true,
        stockPorTalla: {
            S: null,
            M: null,
            L: null,
            XL: null,
            "2XL": null,
        },
    },
    {
        id: "jersey-visitante",
        nombre: "Jersey Visitante",
        nombreCorto: "Visitante",
        precio: 1300,
        precioTexto: "L 1,300",
        tipo: "Visitante",
        categoria: "Jerseys",
        color: "No especificado",
        tallas: ["S", "M", "L", "XL", "2XL"],
        coleccion: "2026",
        descripcion:
            "El uniforme visitante oficial de Génesis FC. Una propuesta diseñada para mantener nuestra identidad en cada cancha y en cada ciudad.",
        imagen: "/jersey-visitante-portada.png",
        enlace: "/tienda/jersey-visitante",
        personalizable: true,
        stockPorTalla: {
            S: null,
            M: null,
            L: null,
            XL: null,
            "2XL": null,
        },
    },
];

/* =========================================================
   PUNTOS DE VENTA
========================================================= */

export const puntosVenta: PuntoVenta[] = [
    {
        nombre: "K9 Store",
        ciudad: "La Paz",
        tipo: "Físico",
    },
    {
        nombre: "Suutuk",
        ciudad: "Tegucigalpa",
        tipo: "Físico",
    },
    {
        nombre: "Génesis FC Shop",
        ciudad: "Online",
        tipo: "Online",
        enlace: "/tienda",
    },
];

/* =========================================================
   COMPRA Y ENTREGA
========================================================= */

export const informacionCompra = {
    moneda: "Lempiras",
    simboloMoneda: "L",
    carrito: "/tienda/carrito",
    seguimiento: "/tienda/seguimiento",
    entrega: {
        envioDisponible: true,
        retiroDisponible: true,
    },
    metodosPago: [
        "Transferencia bancaria",
        "Pago al recibir",
    ],
    tarjetaDisponible: false,
    transferencia: {
        banco: "Banco Atlántida",
        numeroCuenta: "2010091276",
        titular: "Club Deportivo Génesis FC",
    },
};

/* =========================================================
   FUNCIONES
========================================================= */

export function obtenerProductoPorId(
    id: string
) {
    return productosTienda.find(
        (producto) => producto.id === id
    );
}

export function obtenerProductoPorNombre(
    nombre: string
) {
    const buscado = nombre
        .trim()
        .toLowerCase();

    return productosTienda.find(
        (producto) =>
            producto.nombre
                .toLowerCase()
                .includes(buscado) ||
            producto.nombreCorto
                .toLowerCase()
                .includes(buscado) ||
            buscado.includes(
                producto.nombre.toLowerCase()
            )
    );
}

export function obtenerProductosPorTipo(
    tipo: TipoProducto
) {
    return productosTienda.filter(
        (producto) =>
            producto.tipo === tipo
    );
}

export function obtenerProductosPorCategoria(
    categoria: CategoriaProducto
) {
    return productosTienda.filter(
        (producto) =>
            producto.categoria === categoria
    );
}

export function productoTieneTalla(
    productoId: string,
    talla: string
) {
    const producto =
        obtenerProductoPorId(productoId);

    if (!producto) {
        return false;
    }

    return producto.tallas.includes(
        talla.toUpperCase()
    );
}

export function obtenerStockTalla(
    productoId: string,
    talla: string
) {
    const producto =
        obtenerProductoPorId(productoId);

    if (!producto) {
        return null;
    }

    const tallaNormalizada =
        talla.toUpperCase();

    if (
        !producto.tallas.includes(
            tallaNormalizada
        )
    ) {
        return null;
    }

    return (
        producto.stockPorTalla[
            tallaNormalizada
        ] ?? null
    );
}

export function obtenerStockTotalProducto(
    productoId: string
) {
    const producto =
        obtenerProductoPorId(productoId);

    if (!producto) {
        return null;
    }

    const valores =
        producto.tallas.map(
            (talla) =>
                producto.stockPorTalla[
                    talla
                ]
        );

    if (
        valores.some(
            (valor) => valor === null
        )
    ) {
        return null;
    }

    return valores.reduce<number>(
        (total, valor) =>
            total + (valor ?? 0),
        0
    );
}

export function obtenerEstadoStock(
    productoId: string,
    talla?: string
): EstadoStock {
    const stock =
        talla
            ? obtenerStockTalla(
                  productoId,
                  talla
              )
            : obtenerStockTotalProducto(
                  productoId
              );

    if (stock === null) {
        return "sin-configurar";
    }

    if (stock <= 0) {
        return "agotado";
    }

    if (stock <= 3) {
        return "pocas-unidades";
    }

    return "disponible";
}

export function productoDisponible(
    productoId: string,
    talla?: string
) {
    const estado =
        obtenerEstadoStock(
            productoId,
            talla
        );

    return (
        estado === "disponible" ||
        estado === "pocas-unidades"
    );
}

export function productoPermiteAvisoReposicion(
    productoId: string,
    talla?: string
) {
    return (
        obtenerEstadoStock(
            productoId,
            talla
        ) === "agotado"
    );
}

/* =========================================================
   RESUMEN
========================================================= */

export const resumenTienda = {
    totalProductos:
        productosTienda.length,
    coleccion: "2026",
    precioMinimo: Math.min(
        ...productosTienda.map(
            (producto) =>
                producto.precio
        )
    ),
    precioMaximo: Math.max(
        ...productosTienda.map(
            (producto) =>
                producto.precio
        )
    ),
    tallasDisponibles: [
        "S",
        "M",
        "L",
        "XL",
        "2XL",
    ],
    categoriasDisponibles: [
        "Jerseys",
    ] as CategoriaProducto[],
    puntosFisicos:
        puntosVenta.filter(
            (punto) =>
                punto.tipo === "Físico"
        ).length,
    compraOnline: true,
};
