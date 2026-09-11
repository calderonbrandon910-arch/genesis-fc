"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../CartProvider";

export default function CarritoPage() {
    const {
        items,
        totalItems,
        totalPrice,
        removeItem,
        updateQuantity,
        clearCart,
    } = useCart();

    return (
        <main className="min-h-screen bg-[#f7f7f5] text-[#0b1f43]">
            {/* CABECERA */}
            <section className="border-b border-[#0b1f43]/10 bg-white">
                <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
                    <Link
                        href="/tienda"
                        className="group inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.24em] text-[#0b1f43]/55 transition hover:text-[#158bd2]"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">
                            ←
                        </span>
                        Seguir comprando
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
            </section>

            {/* CONTENIDO */}
            <section className="px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
                <div className="mx-auto max-w-[1500px]">
                    <div className="mb-12 flex flex-col gap-5 border-b border-[#0b1f43]/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.32em] text-[#158bd2]">
                                Génesis FC Shop
                            </p>

                            <h1 className="mt-4 text-5xl font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-6xl">
                                Tu
                                <span className="block text-[#158bd2]">
                                    carrito.
                                </span>
                            </h1>
                        </div>

                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/40">
                            {totalItems}{" "}
                            {totalItems === 1
                                ? "producto"
                                : "productos"}
                        </p>
                    </div>

                    {items.length === 0 ? (
                        <div className="bg-white px-7 py-20 text-center sm:px-10">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                Carrito vacío
                            </p>

                            <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.04em] sm:text-5xl">
                                Todavía no has
                                <span className="block text-[#158bd2]">
                                    elegido tu jersey.
                                </span>
                            </h2>

                            <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[#0b1f43]/50">
                                Explora la colección oficial de Génesis FC y
                                agrega tus productos favoritos.
                            </p>

                            <Link
                                href="/tienda"
                                className="mt-9 inline-flex items-center gap-4 bg-[#0b1f43] px-7 py-5 text-[9px] font-black uppercase tracking-[0.22em] text-white transition hover:bg-[#158bd2]"
                            >
                                Ver colección
                                <span>→</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
                            {/* PRODUCTOS */}
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <article
                                        key={`${item.id}-${item.talla}`}
                                        className="grid overflow-hidden bg-white sm:grid-cols-[220px_1fr]"
                                    >
                                        <Link
                                            href={item.href}
                                            className="relative aspect-[4/5] overflow-hidden bg-[#e9edf0] sm:aspect-auto sm:min-h-[290px]"
                                        >
                                            <Image
                                                src={item.imagen}
                                                alt={item.nombre}
                                                fill
                                                sizes="(max-width: 640px) 100vw, 220px"
                                                className="object-cover object-top"
                                            />
                                        </Link>

                                        <div className="flex flex-col justify-between p-6 sm:p-8">
                                            <div>
                                                <div className="flex items-start justify-between gap-5">
                                                    <div>
                                                        <p className="text-[8px] font-black uppercase tracking-[0.28em] text-[#158bd2]">
                                                            Génesis FC
                                                        </p>

                                                        <Link
                                                            href={item.href}
                                                            className="mt-2 block text-2xl font-black uppercase tracking-[-0.03em] transition hover:text-[#158bd2]"
                                                        >
                                                            {item.nombre}
                                                        </Link>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeItem(
                                                                item.id,
                                                                item.talla
                                                            )
                                                        }
                                                        className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/35 transition hover:text-red-600"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>

                                                <div className="mt-6 grid grid-cols-2 gap-4 border-y border-[#0b1f43]/10 py-5">
                                                    <div>
                                                        <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                                            Talla
                                                        </p>

                                                        <p className="mt-2 text-sm font-black">
                                                            {item.talla}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                                            Precio
                                                        </p>

                                                        <p className="mt-2 text-sm font-black">
                                                            L{" "}
                                                            {item.precio.toLocaleString(
                                                                "en-US"
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
                                                <div>
                                                    <p className="mb-3 text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                                        Cantidad
                                                    </p>

                                                    <div className="flex items-center border border-[#0b1f43]/15">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.talla,
                                                                    item.cantidad -
                                                                        1
                                                                )
                                                            }
                                                            className="flex h-10 w-10 items-center justify-center transition hover:bg-[#f5f5f2]"
                                                            aria-label="Disminuir cantidad"
                                                        >
                                                            −
                                                        </button>

                                                        <span className="flex h-10 min-w-12 items-center justify-center border-x border-[#0b1f43]/15 text-xs font-black">
                                                            {item.cantidad}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.talla,
                                                                    item.cantidad +
                                                                        1
                                                                )
                                                            }
                                                            className="flex h-10 w-10 items-center justify-center transition hover:bg-[#f5f5f2]"
                                                            aria-label="Aumentar cantidad"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                                        Subtotal
                                                    </p>

                                                    <p className="mt-2 text-xl font-black">
                                                        L{" "}
                                                        {(
                                                            item.precio *
                                                            item.cantidad
                                                        ).toLocaleString(
                                                            "en-US"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* RESUMEN */}
                            <aside className="h-fit bg-white p-7 lg:sticky lg:top-6 lg:p-9">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                    Resumen
                                </p>

                                <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.04em]">
                                    Tu pedido
                                </h2>

                                <div className="mt-8 border-y border-[#0b1f43]/10">
                                    <div className="flex items-center justify-between border-b border-[#0b1f43]/10 py-5">
                                        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#0b1f43]/45">
                                            Productos
                                        </span>

                                        <span className="text-sm font-black">
                                            {totalItems}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between py-5">
                                        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#0b1f43]/45">
                                            Envío
                                        </span>

                                        <span className="text-[9px] font-black uppercase tracking-[0.14em]">
                                            Por definir
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-7">
                                    <p className="text-[8px] font-black uppercase tracking-[0.24em] text-[#0b1f43]/35">
                                        Total
                                    </p>

                                    <p className="mt-2 text-3xl font-black">
                                        L{" "}
                                        {totalPrice.toLocaleString(
                                            "en-US"
                                        )}
                                    </p>
                                </div>

                                {/* AHORA SÍ CONECTADO AL CHECKOUT */}
                                <Link
                                    href="/tienda/checkout"
                                    className="mt-8 flex w-full items-center justify-between bg-[#0b1f43] px-6 py-5 text-[9px] font-black uppercase tracking-[0.22em] text-white transition duration-300 hover:bg-[#158bd2]"
                                >
                                    Finalizar compra
                                    <span>→</span>
                                </Link>

                                <p className="mt-4 text-center text-[8px] uppercase leading-5 tracking-[0.16em] text-[#0b1f43]/30">
                                    Revisa tus datos antes de confirmar el pedido
                                </p>

                                <button
                                    type="button"
                                    onClick={clearCart}
                                    className="mt-7 w-full border-t border-[#0b1f43]/10 pt-6 text-center text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35 transition hover:text-red-600"
                                >
                                    Vaciar carrito
                                </button>
                            </aside>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}