export type TipoProducto =
  | "Local"
  | "Alternativo"
  | "Visitante";

export type ProductoTienda = {
  id: string;
  nombre: string;
  nombreCorto: string;
  precio: number;
  precioTexto: string;
  tipo: TipoProducto;
  color: string;
  tallas: string[];
  coleccion: string;
  descripcion: string;
  imagen: string;
  enlace: string;
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
    color: "Blanco / Azul",
    tallas: ["S", "M", "L", "XL", "2XL"],
    coleccion: "2026",
    descripcion:
      "Base blanca, líneas verticales azules y detalles contrastantes en cuello y mangas. Una versión elegante de la identidad de Génesis FC.",
    imagen: "/tienda-hero.jpg",
    enlace: "/tienda/jersey-blanco",
  },

  {
    id: "jersey-azul",
    nombre: "Jersey Azul",
    nombreCorto: "Azul",
    precio: 1300,
    precioTexto: "L 1,300",
    tipo: "Local",
    color: "Azul",
    tallas: ["S", "M", "L", "XL", "2XL"],
    coleccion: "2026",
    descripcion:
      "El uniforme local de Génesis FC. Azul como protagonista, detalles oficiales del club y una identidad creada para representar nuestros colores.",
    imagen: "/jersey-azul-principal.png",
    enlace: "/tienda/jersey-azul",
  },

  {
    id: "jersey-visitante",
    nombre: "Jersey Visitante",
    nombreCorto: "Visitante",
    precio: 1300,
    precioTexto: "L 1,300",
    tipo: "Visitante",
    color: "No especificado",
    tallas: ["S", "M", "L", "XL", "2XL"],
    coleccion: "2026",
    descripcion:
      "El uniforme visitante oficial de Génesis FC. Una propuesta diseñada para mantener nuestra identidad en cada cancha y en cada ciudad.",
    imagen: "/jersey-visitante-portada.png",
    enlace: "/tienda/jersey-visitante",
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
    (producto) => producto.tipo === tipo
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

/* =========================================================
   RESUMEN
========================================================= */

export const resumenTienda = {
  totalProductos: productosTienda.length,

  coleccion: "2026",

  precioMinimo: Math.min(
    ...productosTienda.map(
      (producto) => producto.precio
    )
  ),

  precioMaximo: Math.max(
    ...productosTienda.map(
      (producto) => producto.precio
    )
  ),

  tallasDisponibles: [
    "S",
    "M",
    "L",
    "XL",
    "2XL",
  ],

  puntosFisicos: puntosVenta.filter(
    (punto) => punto.tipo === "Físico"
  ).length,

  compraOnline: true,
};