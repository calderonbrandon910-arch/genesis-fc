"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../CartProvider";

const tallas = ["S", "M", "L", "XL", "2XL"];

export default function JerseyAzulPage() {
    const [tallaSeleccionada, setTallaSeleccionada] = useState("M");
    const [cantidad, setCantidad] = useState(1);
    const [agregado, setAgregado] = useState(false);

    const { addItem, totalItems } = useCart();

    const aumentarCantidad = () => {
        setCantidad((cantidadActual) =>
            Math.min(cantidadActual + 1, 10)
        );
    };

    const disminuirCantidad = () => {
        setCantidad((cantidadActual) =>
            Math.max(cantidadActual - 1, 1)
        );
    };

    const agregarAlCarrito = () => {
        addItem({
            id: "jersey-azul",
            nombre: "Jersey Azul",
            precio: 1300,
            talla: tallaSeleccionada,
            cantidad,
            imagen: "/jersey-azul-modelo.png",
            href: "/tienda/jersey-azul",
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
                        {/* FOTO */}
                        <div className="grid gap-4">
                            <div className="relative aspect-[4/5] overflow-hidden bg-[#e8eef2]">
                                <Image
                                    src="/jersey-azul-modelo.png"
                                    alt="Modelo usando el Jersey Azul de Génesis FC"
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 58vw"
                                    className="object-cover object-top"
                                />

                                <div className="absolute left-5 top-5 bg-white/95 px-4 py-3 backdrop-blur">
                                    <p className="text-[8px] font-black uppercase tracking-[0.26em] text-[#0b1f43]">
                                        Uniforme Local
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
                                                casa.
                                            </span>
                                        </h2>
                                    </div>

                                    <p className="max-w-xs text-xs leading-6 text-white/50">
                                        El azul como protagonista y el escudo
                                        de Génesis FC al frente. Una camiseta
                                        diseñada para representar al club desde
                                        el primer minuto.
                                    </p>
                                </div>

                                <div className="flex min-h-[320px] flex-col justify-end bg-white p-7 sm:p-9">
                                    <p className="text-[8px] font-black uppercase tracking-[0.28em] text-[#158bd2]">
                                        Colección 2026
                                    </p>

                                    <h3 className="mt-5 text-3xl font-black uppercase leading-[0.92] tracking-[-0.04em] text-[#0b1f43]">
                                        El color
                                        <span className="block text-[#158bd2]">
                                            de nuestra identidad.
                                        </span>
                                    </h3>

                                    <p className="mt-5 text-xs leading-6 text-[#0b1f43]/45">
                                        Una silueta deportiva y contemporánea
                                        que mantiene el azul de Génesis FC como
                                        eje central.
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
                                        Local
                                    </span>
                                </div>

                                <h1 className="mt-10 text-5xl font-black uppercase leading-[0.86] tracking-[-0.055em] sm:text-6xl">
                                    Jersey
                                    <span className="block text-[#158bd2]">
                                        Azul
                                    </span>
                                </h1>

                                <p className="mt-5 text-2xl font-black tracking-[-0.03em]">
                                    L 1,300
                                </p>

                                <p className="mt-7 max-w-md text-sm leading-7 text-[#0b1f43]/52">
                                    Uniforme local oficial de Génesis FC.
                                    El azul como protagonista, acompañado por
                                    los detalles y la identidad oficial del
                                    club.
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

                                            return (
                                                <button
                                                    key={talla}
                                                    type="button"
                                                    onClick={() =>
                                                        setTallaSeleccionada(
                                                            talla
                                                        )
                                                    }
                                                    className={`flex h-12 items-center justify-center border text-[10px] font-black uppercase transition duration-200 ${
                                                        activa
                                                            ? "border-[#0b1f43] bg-[#0b1f43] text-white"
                                                            : "border-[#0b1f43]/15 bg-white text-[#0b1f43] hover:border-[#0b1f43]"
                                                    }`}
                                                >
                                                    {talla}
                                                </button>
                                            );
                                        })}
                                    </div>
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
                                            className="flex h-12 w-12 items-center justify-center text-lg transition hover:bg-[#f3f3f0]"
                                            aria-label="Aumentar cantidad"
                                        >
                                            +
                                        </button>
                                    </div>
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

                                {/* CARRITO */}
                                <div className="mt-8">
                                    <button
                                        type="button"
                                        onClick={agregarAlCarrito}
                                        className={`flex w-full items-center justify-between px-6 py-5 text-[9px] font-black uppercase tracking-[0.22em] text-white transition duration-300 ${
                                            agregado
                                                ? "bg-[#158bd2]"
                                                : "bg-[#0b1f43] hover:bg-[#158bd2]"
                                        }`}
                                    >
                                        {agregado
                                            ? "Agregado al carrito"
                                            : "Agregar al carrito"}

                                        <span>
                                            {agregado ? "✓" : "→"}
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
                                            Color
                                        </span>

                                        <span className="text-[9px] font-black uppercase tracking-[0.12em]">
                                            Azul
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
                                Azul en nuestros puntos autorizados.
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