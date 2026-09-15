"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FavoriteButton, { type FavoritoTienda } from "../FavoriteButton";

const FAVORITOS_STORAGE_KEY = "genesis-fc-tienda-favoritos";
const FAVORITOS_EVENT = "genesis-fc-favoritos-actualizados";

function leerFavoritos(): FavoritoTienda[] {
    try {
        const guardados = window.localStorage.getItem(FAVORITOS_STORAGE_KEY);

        if (!guardados) {
            return [];
        }

        const datos = JSON.parse(guardados);

        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
}

export default function FavoritosPage() {
    const [favoritos, setFavoritos] = useState<FavoritoTienda[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const sincronizar = () => {
            setFavoritos(leerFavoritos());
            setCargando(false);
        };

        sincronizar();

        window.addEventListener("storage", sincronizar);
        window.addEventListener(FAVORITOS_EVENT, sincronizar);

        return () => {
            window.removeEventListener("storage", sincronizar);
            window.removeEventListener(FAVORITOS_EVENT, sincronizar);
        };
    }, []);

    return (
        <main className="min-h-screen bg-[#f7f7f5] text-[#0b1f43]">
            <section className="border-b border-[#0b1f43]/10 bg-white">
                <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-5 px-5 py-5 sm:px-8 lg:px-10">
                    <Link
                        href="/tienda"
                        className="group inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.24em] text-[#0b1f43]/55 transition hover:text-[#158bd2]"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">
                            ←
                        </span>
                        Volver a tienda
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

            <section className="px-5 pb-14 pt-16 sm:px-8 lg:px-10 lg:pb-24 lg:pt-24">
                <div className="mx-auto max-w-[1600px]">
                    <p className="text-[9px] font-black uppercase tracking-[0.32em] text-[#158bd2]">
                        Tienda 2.0
                    </p>

                    <div className="mt-5 flex flex-col gap-7 border-b border-[#0b1f43]/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-5xl font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-7xl">
                                Tus
                                <span className="block text-[#158bd2]">
                                    favoritos.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-sm leading-7 text-[#0b1f43]/50">
                                Guarda los jerseys que más te gustan y vuelve a
                                encontrarlos rápidamente cuando quieras.
                            </p>
                        </div>

                        {!cargando && favoritos.length > 0 && (
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/35">
                                {favoritos.length}{" "}
                                {favoritos.length === 1
                                    ? "producto guardado"
                                    : "productos guardados"}
                            </p>
                        )}
                    </div>

                    {cargando ? (
                        <div className="py-20">
                            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                Cargando favoritos...
                            </p>
                        </div>
                    ) : favoritos.length === 0 ? (
                        <div className="grid min-h-[430px] place-items-center bg-white px-6 py-16 text-center">
                            <div>
                                <span className="text-5xl text-[#158bd2]">♡</span>

                                <h2 className="mt-6 text-3xl font-black uppercase tracking-[-0.04em]">
                                    Aún no tienes favoritos
                                </h2>

                                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#0b1f43]/45">
                                    Marca el corazón de cualquier producto para
                                    guardarlo aquí.
                                </p>

                                <Link
                                    href="/tienda#coleccion"
                                    className="mt-8 inline-flex items-center gap-4 bg-[#0b1f43] px-7 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-[#158bd2]"
                                >
                                    Ver colección
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {favoritos.map((favorito) => (
                                <article
                                    key={favorito.productoId}
                                    className="overflow-hidden bg-white"
                                >
                                    <Link
                                        href={favorito.enlace}
                                        className="group relative block aspect-[4/5] overflow-hidden bg-[#e8edf2]"
                                    >
                                        <Image
                                            src={favorito.imagen}
                                            alt={favorito.nombre}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                            className="object-cover object-top transition duration-700 group-hover:scale-[1.015]"
                                        />
                                    </Link>

                                    <div className="p-6 sm:p-7">
                                        <div className="flex items-start justify-between gap-5">
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-[#158bd2]">
                                                    Génesis FC
                                                </p>

                                                <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.035em]">
                                                    {favorito.nombre}
                                                </h2>

                                                <p className="mt-2 text-lg font-black">
                                                    {favorito.precioTexto}
                                                </p>
                                            </div>

                                            <FavoriteButton
                                                {...favorito}
                                            />
                                        </div>

                                        <Link
                                            href={favorito.enlace}
                                            className="group mt-7 flex w-full items-center justify-between bg-[#0b1f43] px-5 py-4 text-[8px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-[#158bd2]"
                                        >
                                            Ver producto
                                            <span className="transition-transform group-hover:translate-x-1">
                                                →
                                            </span>
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
