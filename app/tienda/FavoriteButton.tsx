"use client";

import { useEffect, useState } from "react";

export type FavoritoTienda = {
    productoId: string;
    nombre: string;
    enlace: string;
    imagen: string;
    precioTexto: string;
};

const FAVORITOS_STORAGE_KEY = "genesis-fc-tienda-favoritos";
const FAVORITOS_EVENT = "genesis-fc-favoritos-actualizados";

function leerFavoritos(): FavoritoTienda[] {
    if (typeof window === "undefined") {
        return [];
    }

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

function guardarFavoritos(favoritos: FavoritoTienda[]) {
    window.localStorage.setItem(
        FAVORITOS_STORAGE_KEY,
        JSON.stringify(favoritos)
    );

    window.dispatchEvent(new Event(FAVORITOS_EVENT));
}

type FavoriteButtonProps = FavoritoTienda & {
    compacto?: boolean;
};

export default function FavoriteButton({
    productoId,
    nombre,
    enlace,
    imagen,
    precioTexto,
    compacto = true,
}: FavoriteButtonProps) {
    const [esFavorito, setEsFavorito] = useState(false);
    const [listo, setListo] = useState(false);

    useEffect(() => {
        const sincronizar = () => {
            const favoritos = leerFavoritos();

            setEsFavorito(
                favoritos.some(
                    (favorito) => favorito.productoId === productoId
                )
            );
            setListo(true);
        };

        sincronizar();

        window.addEventListener("storage", sincronizar);
        window.addEventListener(FAVORITOS_EVENT, sincronizar);

        return () => {
            window.removeEventListener("storage", sincronizar);
            window.removeEventListener(FAVORITOS_EVENT, sincronizar);
        };
    }, [productoId]);

    const alternarFavorito = () => {
        const favoritos = leerFavoritos();
        const yaExiste = favoritos.some(
            (favorito) => favorito.productoId === productoId
        );

        if (yaExiste) {
            guardarFavoritos(
                favoritos.filter(
                    (favorito) => favorito.productoId !== productoId
                )
            );
            return;
        }

        guardarFavoritos([
            ...favoritos,
            {
                productoId,
                nombre,
                enlace,
                imagen,
                precioTexto,
            },
        ]);
    };

    return (
        <button
            type="button"
            onClick={alternarFavorito}
            disabled={!listo}
            aria-pressed={esFavorito}
            aria-label={
                esFavorito
                    ? `Quitar ${nombre} de favoritos`
                    : `Agregar ${nombre} a favoritos`
            }
            title={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
            className={`group inline-flex items-center justify-center border transition duration-200 disabled:cursor-wait disabled:opacity-40 ${
                compacto ? "h-10 w-10" : "gap-3 px-5 py-4"
            } ${
                esFavorito
                    ? "border-[#158bd2] bg-[#158bd2] text-white"
                    : "border-[#0b1f43]/15 bg-white text-[#0b1f43] hover:border-[#158bd2] hover:text-[#158bd2]"
            }`}
        >
            <span
                aria-hidden="true"
                className="text-lg leading-none transition-transform duration-200 group-hover:scale-110"
            >
                {esFavorito ? "♥" : "♡"}
            </span>

            {!compacto && (
                <span className="text-[8px] font-black uppercase tracking-[0.18em]">
                    {esFavorito ? "Guardado" : "Guardar favorito"}
                </span>
            )}
        </button>
    );
}
