"use client";

import Link from "next/link";
import {
    useEffect,
    useMemo,
    useState,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { supabase } from "../../../lib/supabase/client";

const PRODUCTOS = [
    {
        id: "jersey-blanco",
        nombre: "Jersey Blanco",
        subtitulo: "Alternativo",
    },
    {
        id: "jersey-azul",
        nombre: "Jersey Azul",
        subtitulo: "Local",
    },
    {
        id: "jersey-visitante",
        nombre: "Jersey Visitante",
        subtitulo: "Visitante",
    },
] as const;

const TALLAS = [
    "S",
    "M",
    "L",
    "XL",
    "2XL",
] as const;

type StockRow = {
    producto_id: string;
    talla: string;
    stock: number | null;
    actualizado_en: string;
};

type RespuestaStock = {
    ok: boolean;
    error?: string;
    stock?: StockRow[];
};

export default function AdminCommercePage() {
    const router = useRouter();

    const [usuario, setUsuario] =
        useState<User | null>(null);

    const [stock, setStock] =
        useState<StockRow[]>([]);

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState("");

    const [error, setError] =
        useState("");

    const [mensaje, setMensaje] =
        useState("");

    const [
        cerrandoSesion,
        setCerrandoSesion,
    ] = useState(false);

    useEffect(() => {
        let activo = true;

        async function cargar() {
            try {
                setCargando(true);
                setError("");

                const {
                    data: { session },
                    error: sessionError,
                } =
                    await supabase.auth.getSession();

                if (
                    sessionError ||
                    !session
                ) {
                    router.replace(
                        "/admin/login"
                    );
                    return;
                }

                if (!activo) {
                    return;
                }

                setUsuario(
                    session.user
                );

                const response =
                    await fetch(
                        "/api/admin/tienda/stock",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${session.access_token}`,
                            },
                            cache:
                                "no-store",
                        }
                    );

                const data =
                    (await response.json()) as RespuestaStock;

                if (
                    response.status ===
                    401
                ) {
                    await supabase.auth.signOut();

                    router.replace(
                        "/admin/login"
                    );
                    return;
                }

                if (
                    !response.ok ||
                    !data.ok
                ) {
                    setError(
                        data.error ||
                            "No se pudo cargar el inventario."
                    );
                    return;
                }

                if (!activo) {
                    return;
                }

                setStock(
                    data.stock ?? []
                );
            } catch {
                if (!activo) {
                    return;
                }

                setError(
                    "No se pudo conectar con Commerce Center."
                );
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        }

        cargar();

        return () => {
            activo = false;
        };
    }, [router]);

    const totalUnidades =
        useMemo(() => {
            return stock.reduce(
                (
                    total,
                    fila
                ) =>
                    total +
                    (fila.stock ?? 0),
                0
            );
        }, [stock]);

    const tallasAgotadas =
        useMemo(() => {
            return stock.filter(
                (fila) =>
                    fila.stock === 0
            ).length;
        }, [stock]);

    const tallasBajas =
        useMemo(() => {
            return stock.filter(
                (fila) =>
                    fila.stock !== null &&
                    fila.stock > 0 &&
                    fila.stock <= 3
            ).length;
        }, [stock]);

    function obtenerFila(
        productoId: string,
        talla: string
    ) {
        return stock.find(
            (fila) =>
                fila.producto_id ===
                    productoId &&
                fila.talla === talla
        );
    }

    async function actualizarStock(
        productoId: string,
        talla: string,
        valor: number
    ) {
        const id =
            `${productoId}-${talla}`;

        if (guardando === id) {
            return;
        }

        setGuardando(id);
        setError("");
        setMensaje("");

        try {
            const {
                data: { session },
            } =
                await supabase.auth.getSession();

            if (!session) {
                router.replace(
                    "/admin/login"
                );
                return;
            }

            const response =
                await fetch(
                    "/api/admin/tienda/stock",
                    {
                        method:
                            "PUT",
                        headers: {
                            "Content-Type":
                                "application/json",
                            Authorization:
                                `Bearer ${session.access_token}`,
                        },
                        body:
                            JSON.stringify(
                                {
                                    productoId,
                                    talla,
                                    stock:
                                        valor,
                                }
                            ),
                    }
                );

            const data =
                (await response.json()) as {
                    ok: boolean;
                    error?: string;
                    stock?: StockRow;
                };

            if (
                response.status ===
                401
            ) {
                await supabase.auth.signOut();

                router.replace(
                    "/admin/login"
                );
                return;
            }

            if (
                !response.ok ||
                !data.ok ||
                !data.stock
            ) {
                setError(
                    data.error ||
                        "No se pudo actualizar el stock."
                );
                return;
            }

            const nuevoStock =
                data.stock;

            setStock(
                (actual) =>
                    actual.map(
                        (fila) =>
                            fila.producto_id ===
                                nuevoStock
                                    .producto_id &&
                            fila.talla ===
                                nuevoStock
                                    .talla
                                ? nuevoStock
                                : fila
                    )
            );

            setMensaje(
                `${productoId} · ${talla} actualizado a ${valor}.`
            );

            router.refresh();
        } catch {
            setError(
                "No se pudo guardar el cambio."
            );
        } finally {
            setGuardando("");
        }
    }

    async function cerrarSesion() {
        if (cerrandoSesion) {
            return;
        }

        setCerrandoSesion(true);

        try {
            await supabase.auth.signOut();

            router.replace(
                "/admin/login"
            );

            router.refresh();
        } finally {
            setCerrandoSesion(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#f3f5f7] text-[#071d49]">
            <header className="border-b border-[#071d49]/10 bg-white">
                <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.28em] text-[#168cab]">
                            Génesis FC · Administración
                        </p>

                        <h1 className="mt-1 text-xl font-black uppercase">
                            Commerce Center
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/pedidos"
                            className="rounded-full border border-[#071d49]/10 px-4 py-2 text-[7px] font-black uppercase tracking-[0.13em]"
                        >
                            Pedidos
                        </Link>

                        <Link
                            href="/tienda"
                            className="hidden rounded-full border border-[#071d49]/10 px-4 py-2 text-[7px] font-black uppercase tracking-[0.13em] sm:inline-flex"
                        >
                            Ver tienda
                        </Link>

                        <button
                            type="button"
                            onClick={
                                cerrarSesion
                            }
                            disabled={
                                cerrandoSesion
                            }
                            className="rounded-full bg-[#071d49] px-4 py-2 text-[7px] font-black uppercase tracking-[0.13em] text-white disabled:opacity-50"
                        >
                            {cerrandoSesion
                                ? "Cerrando..."
                                : "Cerrar sesión"}
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
                <section className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#168cab]">
                            Tienda 2.0
                        </p>

                        <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
                            Inventario
                            <span className="text-[#168cab]">
                                .
                            </span>
                        </h2>

                        <p className="mt-4 max-w-[660px] text-sm leading-7 text-[#071d49]/50">
                            Controla el stock real por producto y talla. Los cambios se reflejan en Supabase y en la tienda oficial.
                        </p>
                    </div>

                    <div className="rounded-[22px] border border-[#071d49]/10 bg-white px-5 py-4">
                        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#071d49]/35">
                            Sesión activa
                        </p>

                        <p className="mt-1 max-w-[260px] truncate text-[9px] font-black">
                            {usuario?.email ??
                                "Administrador"}
                        </p>
                    </div>
                </section>

                <section className="mt-8 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[24px] bg-[#071d49] p-6 text-white">
                        <p className="text-[7px] font-black uppercase tracking-[0.18em] text-white/40">
                            Unidades totales
                        </p>

                        <p className="mt-3 text-4xl font-black">
                            {totalUnidades}
                        </p>
                    </div>

                    <div className="rounded-[24px] bg-white p-6">
                        <p className="text-[7px] font-black uppercase tracking-[0.18em] text-[#071d49]/35">
                            Tallas con stock bajo
                        </p>

                        <p className="mt-3 text-4xl font-black text-amber-600">
                            {tallasBajas}
                        </p>
                    </div>

                    <div className="rounded-[24px] bg-white p-6">
                        <p className="text-[7px] font-black uppercase tracking-[0.18em] text-[#071d49]/35">
                            Tallas agotadas
                        </p>

                        <p className="mt-3 text-4xl font-black text-red-600">
                            {tallasAgotadas}
                        </p>
                    </div>
                </section>

                {error ? (
                    <div className="mt-6 rounded-[20px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
                        {error}
                    </div>
                ) : null}

                {mensaje ? (
                    <div className="mt-6 rounded-[20px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
                        {mensaje}
                    </div>
                ) : null}

                <section className="mt-8">
                    {cargando ? (
                        <div className="rounded-[28px] bg-white px-6 py-16 text-center">
                            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#071d49]/40">
                                Cargando inventario...
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5">
                            {PRODUCTOS.map(
                                (
                                    producto
                                ) => (
                                    <article
                                        key={
                                            producto.id
                                        }
                                        className="overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(7,29,73,0.05)]"
                                    >
                                        <div className="flex flex-col gap-4 border-b border-[#071d49]/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#168cab]">
                                                    {
                                                        producto.subtitulo
                                                    }
                                                </p>

                                                <h3 className="mt-2 text-2xl font-black uppercase">
                                                    {
                                                        producto.nombre
                                                    }
                                                </h3>
                                            </div>

                                            <p className="text-[7px] font-black uppercase tracking-[0.14em] text-[#071d49]/30">
                                                Stock por talla
                                            </p>
                                        </div>

                                        <div className="grid divide-y divide-[#071d49]/10 sm:grid-cols-5 sm:divide-x sm:divide-y-0">
                                            {TALLAS.map(
                                                (
                                                    talla
                                                ) => {
                                                    const fila =
                                                        obtenerFila(
                                                            producto.id,
                                                            talla
                                                        );

                                                    const valor =
                                                        fila?.stock ??
                                                        0;

                                                    const id =
                                                        `${producto.id}-${talla}`;

                                                    return (
                                                        <div
                                                            key={
                                                                talla
                                                            }
                                                            className="p-5"
                                                        >
                                                            <div className="flex items-center justify-between sm:block">
                                                                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#071d49]/35">
                                                                    Talla{" "}
                                                                    {
                                                                        talla
                                                                    }
                                                                </p>

                                                                <p className="text-2xl font-black sm:mt-3 sm:text-3xl">
                                                                    {
                                                                        valor
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div className="mt-4 flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        guardando ===
                                                                        id
                                                                    }
                                                                    onClick={() =>
                                                                        actualizarStock(
                                                                            producto.id,
                                                                            talla,
                                                                            Math.max(
                                                                                0,
                                                                                valor -
                                                                                    1
                                                                            )
                                                                        )
                                                                    }
                                                                    className="flex h-10 flex-1 items-center justify-center rounded-[12px] border border-[#071d49]/10 text-lg font-black transition hover:bg-[#f3f5f7] disabled:opacity-40"
                                                                >
                                                                    −
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        guardando ===
                                                                        id
                                                                    }
                                                                    onClick={() =>
                                                                        actualizarStock(
                                                                            producto.id,
                                                                            talla,
                                                                            valor +
                                                                                1
                                                                        )
                                                                    }
                                                                    className="flex h-10 flex-1 items-center justify-center rounded-[12px] bg-[#071d49] text-lg font-black text-white transition hover:bg-[#168cab] disabled:opacity-40"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    guardando ===
                                                                    id
                                                                }
                                                                onClick={() =>
                                                                    actualizarStock(
                                                                        producto.id,
                                                                        talla,
                                                                        0
                                                                    )
                                                                }
                                                                className="mt-2 w-full rounded-[10px] border border-red-100 px-3 py-2 text-[6px] font-black uppercase tracking-[0.13em] text-red-500 transition hover:bg-red-50 disabled:opacity-40"
                                                            >
                                                                Marcar agotado
                                                            </button>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </article>
                                )
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
