"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../CartProvider";

const tallas = ["S", "M", "L", "XL", "2XL"];

type StockPublicoItem = {
    productoId: string;
    talla: string;
    stock: number;
    disponible: boolean;
};

type StockPublicoRespuesta = {
    ok: boolean;
    stock?: StockPublicoItem[];
    error?: string;
};

export default function JerseyVisitantePage() {
    const [tallaSeleccionada, setTallaSeleccionada] = useState("M");
    const [cantidad, setCantidad] = useState(1);
    const [agregado, setAgregado] = useState(false);
    const [personalizar, setPersonalizar] = useState(false);
    const [nombrePersonalizado, setNombrePersonalizado] = useState("");
    const [numeroPersonalizado, setNumeroPersonalizado] = useState("");
    const [stockPorTalla, setStockPorTalla] = useState<Record<string, number>>({});
    const [cargandoStock, setCargandoStock] = useState(true);
    const [errorStock, setErrorStock] = useState("");

    const { addItem, totalItems } = useCart();

    const stockSeleccionado = stockPorTalla[tallaSeleccionada] ?? 0;
    const tallaAgotada = !cargandoStock && stockSeleccionado <= 0;
    const limiteCantidad = Math.min(stockSeleccionado, 10);

    useEffect(() => {
        let activo = true;

        const cargarStock = async () => {
            try {
                setCargandoStock(true);
                setErrorStock("");

                const respuesta = await fetch(
                    "/api/tienda/stock-publico",
                    {
                        method: "GET",
                        cache: "no-store",
                    }
                );

                const resultado =
                    (await respuesta.json()) as StockPublicoRespuesta;

                if (!respuesta.ok || !resultado.ok || !resultado.stock) {
                    throw new Error(
                        resultado.error ||
                            "No se pudo consultar la disponibilidad."
                    );
                }

                const stockVisitante = resultado.stock.filter(
                    (item) => item.productoId === "jersey-visitante"
                );

                const nuevoStock: Record<string, number> = {};

                tallas.forEach((talla) => {
                    nuevoStock[talla] = 0;
                });

                stockVisitante.forEach((item) => {
                    nuevoStock[item.talla] = Math.max(0, item.stock);
                });

                if (!activo) {
                    return;
                }

                setStockPorTalla(nuevoStock);
            } catch (error) {
                console.error(
                    "Error cargando stock del Jersey Visitante:",
                    error
                );

                if (activo) {
                    setErrorStock(
                        "No pudimos consultar el inventario en este momento."
                    );
                }
            } finally {
                if (activo) {
                    setCargandoStock(false);
                }
            }
        };

        void cargarStock();

        return () => {
            activo = false;
        };
    }, []);

    useEffect(() => {
        if (cargandoStock) {
            return;
        }

        const stockActual = stockPorTalla[tallaSeleccionada] ?? 0;

        if (stockActual <= 0) {
            setCantidad(1);
            return;
        }

        setCantidad((cantidadActual) =>
            Math.min(cantidadActual, Math.min(stockActual, 10))
        );
    }, [cargandoStock, stockPorTalla, tallaSeleccionada]);

    const seleccionarTalla = (talla: string) => {
        const stockTalla = stockPorTalla[talla] ?? 0;

        if (!cargandoStock && stockTalla <= 0) {
            return;
        }

        setTallaSeleccionada(talla);
        setCantidad(1);
    };

    const aumentarCantidad = () => {
        if (cargandoStock || errorStock || limiteCantidad <= 0) {
            return;
        }

        setCantidad((cantidadActual) =>
            Math.min(cantidadActual + 1, limiteCantidad)
        );
    };

    const disminuirCantidad = () => {
        setCantidad((cantidadActual) =>
            Math.max(cantidadActual - 1, 1)
        );
    };

    const agregarAlCarrito = () => {
        if (
            cargandoStock ||
            errorStock ||
            stockSeleccionado <= 0 ||
            cantidad > limiteCantidad
        ) {
            return;
        }

        addItem({
            id: "jersey-visitante",
            nombre: "Jersey Visitante",
            precio: 1300,
            talla: tallaSeleccionada,
            cantidad,
            imagen: "/jersey-visitante-modelo.png",
            href: "/tienda/jersey-visitante",
            nombrePersonalizado: personalizar
                ? nombrePersonalizado.trim().toUpperCase()
                : undefined,
            numeroPersonalizado: personalizar
                ? numeroPersonalizado.trim()
                : undefined,
        });

        setAgregado(true);

        window.setTimeout(() => {
            setAgregado(false);
        }, 1800);
    };

    return (
        <main className="min-h-screen bg-[#f7f7f5] text-[#0b1f43]">
            {/* CABECERA */}
            <section className="border-b border-[#0b1f43]/10 bg-white">
                <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-5 py-5 sm:px-8 lg:px-10">
                    <Link
                        href="/tienda"
                        className="group inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.24em] text-[#0b1f43]/55 transition hover:text-[#158bd2]"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">
                            ←
                        </span>
                        Volver a tienda
                    </Link>

                    <div className="flex items-center gap-5">
                        <Link
                            href="/tienda/carrito"
                            className="group inline-flex items-center gap-3 border border-[#0b1f43]/10 px-4 py-3 text-[8px] font-black uppercase tracking-[0.2em] transition hover:border-[#0b1f43]"
                        >
                            Carrito

                            <span className="flex h-6 min-w-6 items-center justify-center bg-[#0b1f43] px-1 text-[8px] text-white transition group-hover:bg-[#158bd2]">
                                {totalItems}
                            </span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <Image
                                src="/genesis.jpg"
                                alt="Escudo oficial de Génesis FC"
                                width={42}
                                height={42}
                                priority
                                className="h-9 w-9 rounded-full object-cover"
                            />

                            <div className="hidden sm:block">
                                <p className="text-[9px] font-black uppercase tracking-[0.24em]">
                                    Génesis FC
                                </p>

                                <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-[#0b1f43]/35">
                                    Official Store
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRODUCTO */}
            <section className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-10">
                <div className="mx-auto max-w-[1600px]">
                    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                        {/* GALERÍA */}
                        <div className="grid gap-4">
                            <div className="relative aspect-[4/5] overflow-hidden bg-[#eef2f4]">
                                <Image
                                    src="/jersey-visitante-modelo.png"
                                    alt="Modelo usando el uniforme visitante de Génesis FC"
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 58vw"
                                    className="object-cover object-top"
                                />

                                <div className="absolute left-5 top-5 bg-white/95 px-4 py-3 backdrop-blur">
                                    <p className="text-[8px] font-black uppercase tracking-[0.26em] text-[#0b1f43]">
                                        Uniforme Visitante
                                    </p>
                                </div>
                            </div>

                            {/* BLOQUES EDITORIALES */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex min-h-[320px] flex-col justify-between bg-[#0b1f43] p-7 text-white sm:p-9">
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.32em] text-[#6bd2ff]">
                                            Génesis FC
                                        </p>

                                        <h2 className="mt-6 text-4xl font-black uppercase leading-[0.88] tracking-[-0.05em] sm:text-5xl">
                                            Nuestra
                                            <span className="block text-[#5bcaff]">
                                                identidad.
                                            </span>
                                        </h2>
                                    </div>

                                    <p className="max-w-xs text-xs leading-6 text-white/50">
                                        Un uniforme creado para llevar nuestros
                                        colores a cada cancha, cada ciudad y
                                        cada partido.
                                    </p>
                                </div>

                                <div className="flex min-h-[320px] flex-col justify-end bg-white p-7 sm:p-9">
                                    <p className="text-[8px] font-black uppercase tracking-[0.28em] text-[#158bd2]">
                                        Colección 2026
                                    </p>

                                    <h3 className="mt-5 text-3xl font-black uppercase leading-[0.92] tracking-[-0.04em] text-[#0b1f43]">
                                        Hecha para
                                        <span className="block text-[#158bd2]">
                                            representar.
                                        </span>
                                    </h3>

                                    <p className="mt-5 text-xs leading-6 text-[#0b1f43]/45">
                                        Una propuesta visitante que mantiene
                                        nuestros colores y la identidad de
                                        Génesis FC fuera de casa.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* INFORMACIÓN */}
                        <aside className="bg-white lg:sticky lg:top-5 lg:h-fit">
                            <div className="p-7 sm:p-10 lg:p-12 xl:p-14">
                                <div className="flex items-start justify-between gap-5">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                            Génesis FC
                                        </p>

                                        <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.24em] text-[#0b1f43]/35">
                                            Colección oficial 2026
                                        </p>
                                    </div>

                                    <span className="border border-[#0b1f43]/10 px-3 py-2 text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/45">
                                        Visitante
                                    </span>
                                </div>

                                <h1 className="mt-10 text-5xl font-black uppercase leading-[0.86] tracking-[-0.055em] sm:text-6xl">
                                    Jersey
                                    <span className="block text-[#158bd2]">
                                        Visitante
                                    </span>
                                </h1>

                                <p className="mt-5 text-2xl font-black tracking-[-0.03em]">
                                    L 1,300
                                </p>

                                <p className="mt-7 max-w-md text-sm leading-7 text-[#0b1f43]/52">
                                    Uniforme visitante oficial de Génesis FC.
                                    Una propuesta azul y blanca creada para
                                    mantener la identidad del club en cada
                                    cancha.
                                </p>

                                {/* TALLAS */}
                                <div className="mt-10 border-t border-[#0b1f43]/10 pt-8">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[9px] font-black uppercase tracking-[0.26em]">
                                            Selecciona talla
                                        </p>

                                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#0b1f43]/35">
                                            {tallaSeleccionada}
                                        </p>
                                    </div>

                                    <div className="mt-5 grid grid-cols-5 gap-2">
                                        {tallas.map((talla) => {
                                            const activa =
                                                talla === tallaSeleccionada;
                                            const stockTalla =
                                                stockPorTalla[talla] ?? 0;
                                            const agotada =
                                                !cargandoStock &&
                                                stockTalla <= 0;

                                            return (
                                                <button
                                                    key={talla}
                                                    type="button"
                                                    disabled={
                                                        cargandoStock ||
                                                        Boolean(errorStock) ||
                                                        agotada
                                                    }
                                                    onClick={() =>
                                                        seleccionarTalla(talla)
                                                    }
                                                    className={`relative flex h-12 items-center justify-center border text-[10px] font-black uppercase transition duration-200 ${
                                                        agotada
                                                            ? "cursor-not-allowed border-[#0b1f43]/10 bg-[#f3f3f0] text-[#0b1f43]/25 line-through"
                                                            : activa
                                                              ? "border-[#0b1f43] bg-[#0b1f43] text-white"
                                                              : "border-[#0b1f43]/15 bg-white text-[#0b1f43] hover:border-[#0b1f43]"
                                                    } ${
                                                        cargandoStock || errorStock
                                                            ? "cursor-not-allowed opacity-50"
                                                            : ""
                                                    }`}
                                                >
                                                    {talla}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-4 min-h-5">
                                        {cargandoStock ? (
                                            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#0b1f43]/35">
                                                Consultando disponibilidad...
                                            </p>
                                        ) : errorStock ? (
                                            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-red-600">
                                                {errorStock}
                                            </p>
                                        ) : stockSeleccionado <= 0 ? (
                                            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-red-600">
                                                Talla agotada
                                            </p>
                                        ) : stockSeleccionado === 1 ? (
                                            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#158bd2]">
                                                Última unidad disponible
                                            </p>
                                        ) : stockSeleccionado <= 3 ? (
                                            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#158bd2]">
                                                Solo quedan {stockSeleccionado} unidades
                                            </p>
                                        ) : (
                                            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#0b1f43]/35">
                                                {stockSeleccionado} unidades disponibles
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* PERSONALIZACIÓN */}
                                <div className="mt-9 border-t border-[#0b1f43]/10 pt-8">
                                    <div className="flex items-start justify-between gap-5">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.26em]">
                                                Personalización
                                            </p>

                                            <p className="mt-2 max-w-sm text-xs leading-5 text-[#0b1f43]/45">
                                                Agrega nombre y número al jersey. Es opcional.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPersonalizar((actual) => !actual);

                                                if (personalizar) {
                                                    setNombrePersonalizado("");
                                                    setNumeroPersonalizado("");
                                                }
                                            }}
                                            className={`min-w-[106px] border px-4 py-3 text-[8px] font-black uppercase tracking-[0.18em] transition ${
                                                personalizar
                                                    ? "border-[#158bd2] bg-[#158bd2] text-white"
                                                    : "border-[#0b1f43]/15 bg-white text-[#0b1f43] hover:border-[#0b1f43]"
                                            }`}
                                        >
                                            {personalizar ? "Activada" : "Personalizar"}
                                        </button>
                                    </div>

                                    {personalizar && (
                                        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_140px]">
                                            <label className="block">
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/45">
                                                    Nombre
                                                </span>

                                                <input
                                                    type="text"
                                                    value={nombrePersonalizado}
                                                    maxLength={12}
                                                    onChange={(event) => {
                                                        const valor = event.target.value
                                                            .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]/g, "")
                                                            .slice(0, 12);

                                                        setNombrePersonalizado(valor);
                                                    }}
                                                    placeholder="SANCHEZ"
                                                    className="mt-2 h-12 w-full border border-[#0b1f43]/15 bg-white px-4 text-sm font-black uppercase outline-none transition placeholder:text-[#0b1f43]/20 focus:border-[#158bd2]"
                                                />
                                            </label>

                                            <label className="block">
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/45">
                                                    Número
                                                </span>

                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={numeroPersonalizado}
                                                    maxLength={2}
                                                    onChange={(event) =>
                                                        setNumeroPersonalizado(
                                                            event.target.value
                                                                .replace(/\D/g, "")
                                                                .slice(0, 2)
                                                        )
                                                    }
                                                    placeholder="10"
                                                    className="mt-2 h-12 w-full border border-[#0b1f43]/15 bg-white px-4 text-sm font-black outline-none transition placeholder:text-[#0b1f43]/20 focus:border-[#158bd2]"
                                                />
                                            </label>

                                            {(nombrePersonalizado ||
                                                numeroPersonalizado) && (
                                                <div className="border border-[#158bd2]/20 bg-[#edf8ff] px-4 py-4 sm:col-span-2">
                                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#158bd2]">
                                                        Vista de personalización
                                                    </p>

                                                    <p className="mt-2 text-xs font-black uppercase text-[#0b1f43]">
                                                        {nombrePersonalizado
                                                            ? `Nombre: ${nombrePersonalizado.trim().toUpperCase()}`
                                                            : "Sin nombre"}
                                                        {numeroPersonalizado
                                                            ? ` · Número: ${numeroPersonalizado}`
                                                            : ""}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* CANTIDAD */}
                                <div className="mt-9 border-t border-[#0b1f43]/10 pt-8">
                                    <p className="text-[9px] font-black uppercase tracking-[0.26em]">
                                        Cantidad
                                    </p>

                                    <div className="mt-5 flex w-fit items-center border border-[#0b1f43]/15">
                                        <button
                                            type="button"
                                            onClick={disminuirCantidad}
                                            className="flex h-12 w-12 items-center justify-center text-lg transition hover:bg-[#f3f3f0]"
                                            aria-label="Disminuir cantidad"
                                        >
                                            −
                                        </button>

                                        <div className="flex h-12 min-w-14 items-center justify-center border-x border-[#0b1f43]/15 text-sm font-black">
                                            {cantidad}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={aumentarCantidad}
                                            disabled={
                                                cargandoStock ||
                                                Boolean(errorStock) ||
                                                tallaAgotada ||
                                                cantidad >= limiteCantidad
                                            }
                                            className="flex h-12 w-12 items-center justify-center text-lg transition hover:bg-[#f3f3f0] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                            aria-label="Aumentar cantidad"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {!cargandoStock &&
                                        !errorStock &&
                                        stockSeleccionado > 0 && (
                                            <p className="mt-3 text-[8px] font-bold uppercase tracking-[0.16em] text-[#0b1f43]/35">
                                                Máximo disponible para esta talla: {limiteCantidad}
                                            </p>
                                        )}
                                </div>

                                {/* TOTAL */}
                                <div className="mt-9 flex items-end justify-between gap-6 border-t border-[#0b1f43]/10 pt-8">
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.24em] text-[#0b1f43]/35">
                                            Total
                                        </p>

                                        <p className="mt-2 text-2xl font-black">
                                            L{" "}
                                            {(1300 * cantidad).toLocaleString(
                                                "en-US"
                                            )}
                                        </p>
                                    </div>

                                    <p className="text-right text-[8px] font-bold uppercase leading-5 tracking-[0.18em] text-[#0b1f43]/30">
                                        Impuestos y entrega
                                        <br />
                                        por definir
                                    </p>
                                </div>

                                {/* AGREGAR AL CARRITO */}
                                <div className="mt-8">
                                    <button
                                        type="button"
                                        onClick={agregarAlCarrito}
                                        disabled={
                                            cargandoStock ||
                                            Boolean(errorStock) ||
                                            tallaAgotada ||
                                            cantidad > limiteCantidad
                                        }
                                        className={`flex w-full items-center justify-between px-6 py-5 text-[9px] font-black uppercase tracking-[0.22em] text-white transition duration-300 disabled:cursor-not-allowed disabled:bg-[#0b1f43]/35 ${
                                            agregado
                                                ? "bg-[#158bd2]"
                                                : "bg-[#0b1f43] hover:bg-[#158bd2]"
                                        }`}
                                    >
                                        {cargandoStock
                                            ? "Consultando stock"
                                            : errorStock
                                              ? "Disponibilidad no disponible"
                                              : tallaAgotada
                                                ? "Talla agotada"
                                                : agregado
                                                  ? "Agregado al carrito"
                                                  : "Agregar al carrito"}

                                        <span>
                                            {agregado && !tallaAgotada ? "✓" : "→"}
                                        </span>
                                    </button>

                                    <Link
                                        href="/tienda/carrito"
                                        className="mt-3 flex w-full items-center justify-center border border-[#0b1f43]/15 px-6 py-4 text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43] transition hover:border-[#0b1f43]"
                                    >
                                        Ver carrito ({totalItems})
                                    </Link>
                                </div>

                                {/* DETALLES */}
                                <div className="mt-10 border-t border-[#0b1f43]/10">
                                    <div className="flex items-center justify-between border-b border-[#0b1f43]/10 py-5">
                                        <span className="text-[8px] font-black uppercase tracking-[0.24em] text-[#0b1f43]/35">
                                            Producto
                                        </span>

                                        <span className="text-[9px] font-black uppercase tracking-[0.12em]">
                                            Jersey oficial
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between border-b border-[#0b1f43]/10 py-5">
                                        <span className="text-[8px] font-black uppercase tracking-[0.24em] text-[#0b1f43]/35">
                                            Colección
                                        </span>

                                        <span className="text-[9px] font-black uppercase tracking-[0.12em]">
                                            2026
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between border-b border-[#0b1f43]/10 py-5">
                                        <span className="text-[8px] font-black uppercase tracking-[0.24em] text-[#0b1f43]/35">
                                            Tipo
                                        </span>

                                        <span className="text-[9px] font-black uppercase tracking-[0.12em]">
                                            Visitante
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between py-5">
                                        <span className="text-[8px] font-black uppercase tracking-[0.24em] text-[#0b1f43]/35">
                                            Tallas
                                        </span>

                                        <span className="text-[9px] font-black uppercase tracking-[0.12em]">
                                            S — 2XL
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* PUNTOS DE VENTA */}
            <section className="mt-16 bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
                <div className="mx-auto max-w-[1600px]">
                    <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.32em] text-[#158bd2]">
                                Puntos de venta
                            </p>

                            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-6xl">
                                También
                                <span className="block text-[#158bd2]">
                                    en tienda.
                                </span>
                            </h2>

                            <p className="mt-7 max-w-sm text-sm leading-7 text-[#0b1f43]/50">
                                Consulta disponibilidad presencial del Jersey
                                Visitante en nuestros puntos autorizados.
                            </p>
                        </div>

                        <div className="border-t border-[#0b1f43]/15">
                            <div className="grid grid-cols-[90px_1fr_auto] items-center gap-5 border-b border-[#0b1f43]/15 py-7 sm:grid-cols-[130px_1fr_auto]">
                                <span className="text-[8px] font-black uppercase tracking-[0.25em] text-[#158bd2]">
                                    La Paz
                                </span>

                                <span className="text-xl font-black uppercase sm:text-2xl">
                                    K9 Store
                                </span>

                                <span className="text-xl text-[#0b1f43]/30">
                                    →
                                </span>
                            </div>

                            <div className="grid grid-cols-[90px_1fr_auto] items-center gap-5 border-b border-[#0b1f43]/15 py-7 sm:grid-cols-[130px_1fr_auto]">
                                <span className="text-[8px] font-black uppercase tracking-[0.25em] text-[#158bd2]">
                                    Tegucigalpa
                                </span>

                                <span className="text-xl font-black uppercase sm:text-2xl">
                                    Suutuk
                                </span>

                                <span className="text-xl text-[#0b1f43]/30">
                                    →
                                </span>
                            </div>

                            <div className="grid grid-cols-[90px_1fr_auto] items-center gap-5 py-7 sm:grid-cols-[130px_1fr_auto]">
                                <span className="text-[8px] font-black uppercase tracking-[0.25em] text-[#158bd2]">
                                    Online
                                </span>

                                <div>
                                    <span className="text-xl font-black uppercase sm:text-2xl">
                                        Génesis FC Shop
                                    </span>

                                    <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-[#0b1f43]/35">
                                        Carrito disponible
                                    </p>
                                </div>

                                <span className="text-xl text-[#0b1f43]/30">
                                    →
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <section className="bg-[#f7f7f5] px-5 pb-5 pt-5 sm:px-8 lg:px-10">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-8 bg-[#0b1f43] px-7 py-12 text-white sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14">
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#5cc8ff]">
                            Génesis FC Official Store
                        </p>

                        <p className="mt-3 text-2xl font-black uppercase tracking-[-0.03em]">
                            Lleva nuestros colores.
                        </p>
                    </div>

                    <Link
                        href="/tienda"
                        className="inline-flex w-fit items-center gap-4 border border-white/20 px-6 py-4 text-[8px] font-black uppercase tracking-[0.22em] transition hover:bg-white hover:text-[#0b1f43]"
                    >
                        Seguir comprando
                        <span>→</span>
                    </Link>
                </div>
            </section>
        </main>
    );
}