"use client";

import {
    useMemo,
    useState,
} from "react";

type StockProductoPublico = {
    productoId: string;
    nombre: string;
    stockPorTalla: Record<
        string,
        number | null
    >;
};

type Props = {
    productos: StockProductoPublico[];
};

const TALLAS = [
    "S",
    "M",
    "L",
    "XL",
    "2XL",
];

export default function StockPublico({
    productos,
}: Props) {
    const [
        seleccion,
        setSeleccion,
    ] = useState<{
        productoId: string;
        talla: string;
    } | null>(null);

    const [
        correo,
        setCorreo,
    ] = useState("");

    const [
        enviando,
        setEnviando,
    ] = useState(false);

    const [
        mensaje,
        setMensaje,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState("");

    const productoSeleccionado =
        useMemo(() => {
            if (!seleccion) {
                return null;
            }

            return productos.find(
                (producto) =>
                    producto.productoId ===
                    seleccion.productoId
            );
        }, [
            productos,
            seleccion,
        ]);

    async function registrarAviso() {
        if (!seleccion) {
            return;
        }

        setEnviando(true);
        setError("");
        setMensaje("");

        try {
            const response =
                await fetch(
                    "/api/tienda/reposicion",
                    {
                        method:
                            "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body:
                            JSON.stringify(
                                {
                                    productoId:
                                        seleccion.productoId,
                                    talla:
                                        seleccion.talla,
                                    correo,
                                }
                            ),
                    }
                );

            const data =
                (await response.json()) as {
                    ok: boolean;
                    error?: string;
                    mensaje?: string;
                };

            if (
                !response.ok ||
                !data.ok
            ) {
                setError(
                    data.error ||
                        "No se pudo registrar el aviso."
                );
                return;
            }

            setMensaje(
                data.mensaje ||
                    "Aviso registrado."
            );

            setCorreo("");
        } catch {
            setError(
                "No se pudo conectar con el sistema de avisos."
            );
        } finally {
            setEnviando(false);
        }
    }

    return (
        <section className="bg-[#071d49] px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-20">
            <div className="mx-auto max-w-[1600px]">
                <div className="grid gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#5cc8ff]">
                            Disponibilidad real
                        </p>

                        <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
                            Stock por talla
                            <span className="text-[#5cc8ff]">
                                .
                            </span>
                        </h2>
                    </div>

                    <p className="max-w-[560px] text-sm leading-7 text-white/45">
                        Consulta la disponibilidad actual. Si una talla se agota, puedes registrar tu correo para recibir un aviso cuando vuelva.
                    </p>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-3">
                    {productos.map(
                        (producto) => (
                            <article
                                key={
                                    producto.productoId
                                }
                                className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5 sm:p-6"
                            >
                                <h3 className="text-xl font-black uppercase">
                                    {
                                        producto.nombre
                                    }
                                </h3>

                                <div className="mt-5 grid grid-cols-5 gap-2">
                                    {TALLAS.map(
                                        (
                                            talla
                                        ) => {
                                            const valor =
                                                producto.stockPorTalla[
                                                    talla
                                                ];

                                            const agotado =
                                                valor ===
                                                0;

                                            return (
                                                <button
                                                    key={
                                                        talla
                                                    }
                                                    type="button"
                                                    disabled={
                                                        !agotado
                                                    }
                                                    onClick={() => {
                                                        if (
                                                            agotado
                                                        ) {
                                                            setSeleccion(
                                                                {
                                                                    productoId:
                                                                        producto.productoId,
                                                                    talla,
                                                                }
                                                            );
                                                            setMensaje(
                                                                ""
                                                            );
                                                            setError(
                                                                ""
                                                            );
                                                        }
                                                    }}
                                                    className={`rounded-[14px] border px-2 py-3 text-center transition ${
                                                        agotado
                                                            ? "border-red-300/25 bg-red-300/[0.08] hover:bg-red-300/[0.14]"
                                                            : "border-emerald-300/20 bg-emerald-300/[0.08]"
                                                    }`}
                                                >
                                                    <p className="text-[8px] font-black uppercase">
                                                        {
                                                            talla
                                                        }
                                                    </p>

                                                    <p
                                                        className={`mt-1 text-[6px] font-black uppercase ${
                                                            agotado
                                                                ? "text-red-300"
                                                                : "text-emerald-300"
                                                        }`}
                                                    >
                                                        {valor ===
                                                        null
                                                            ? "—"
                                                            : agotado
                                                              ? "Agotado"
                                                              : "Disponible"}
                                                    </p>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>

                                <p className="mt-4 text-[7px] font-bold uppercase tracking-[0.12em] text-white/30">
                                    Toca una talla agotada para activar un aviso.
                                </p>
                            </article>
                        )
                    )}
                </div>

                {seleccion ? (
                    <div className="mt-6 rounded-[26px] border border-[#5cc8ff]/20 bg-[#5cc8ff]/[0.06] p-6 sm:p-8">
                        <p className="text-[7px] font-black uppercase tracking-[0.22em] text-[#5cc8ff]">
                            Avísame cuando vuelva
                        </p>

                        <h3 className="mt-3 text-2xl font-black uppercase">
                            {
                                productoSeleccionado?.nombre
                            }{" "}
                            · Talla{" "}
                            {
                                seleccion.talla
                            }
                        </h3>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <input
                                type="email"
                                value={
                                    correo
                                }
                                onChange={(
                                    event
                                ) =>
                                    setCorreo(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="tu@correo.com"
                                className="min-h-12 flex-1 rounded-[14px] border border-white/10 bg-white px-4 text-sm text-[#071d49] outline-none"
                            />

                            <button
                                type="button"
                                onClick={
                                    registrarAviso
                                }
                                disabled={
                                    enviando
                                }
                                className="min-h-12 rounded-[14px] bg-[#5cc8ff] px-6 text-[8px] font-black uppercase tracking-[0.15em] text-[#071d49] transition hover:bg-white disabled:opacity-50"
                            >
                                {enviando
                                    ? "Registrando..."
                                    : "Avísame"}
                            </button>
                        </div>

                        {mensaje ? (
                            <p className="mt-4 text-sm font-bold text-emerald-300">
                                {
                                    mensaje
                                }
                            </p>
                        ) : null}

                        {error ? (
                            <p className="mt-4 text-sm font-bold text-red-300">
                                {
                                    error
                                }
                            </p>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </section>
    );
}
