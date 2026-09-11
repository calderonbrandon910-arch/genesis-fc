"use client";

import Link from "next/link";
import {
    FormEvent,
    useEffect,
    useState,
} from "react";

type EstadoPedido =
    | "pendiente"
    | "confirmado"
    | "entregado";

type PedidoSeguimiento = {
    numeroPedido: string;
    estado: EstadoPedido;
    metodoEntrega: string;
    ciudad: string | null;
    puntoRetiro: string | null;
    total: number;
    moneda: string;
    creadoEn: string;
};

type RespuestaSeguimiento = {
    ok: boolean;
    error?: string;
    pedido?: PedidoSeguimiento;
};

export default function SeguimientoPedidoPage() {
    const [numeroPedido, setNumeroPedido] =
        useState("");

    const [pedido, setPedido] =
        useState<PedidoSeguimiento | null>(
            null
        );

    const [cargando, setCargando] =
        useState(false);

    const [error, setError] =
        useState("");

    async function consultarPedido(
        numero: string
    ) {
        const numeroLimpio =
            numero.trim().toUpperCase();

        if (!numeroLimpio) {
            setError(
                "Escribe tu número de pedido."
            );

            setPedido(null);

            return;
        }

        setNumeroPedido(numeroLimpio);
        setCargando(true);
        setError("");
        setPedido(null);

        try {
            const respuesta = await fetch(
                `/api/pedidos/seguimiento?numeroPedido=${encodeURIComponent(
                    numeroLimpio
                )}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            const data =
                (await respuesta.json()) as RespuestaSeguimiento;

            if (
                !respuesta.ok ||
                !data.ok ||
                !data.pedido
            ) {
                setError(
                    data.error ||
                        "No encontramos ese pedido."
                );

                return;
            }

            setPedido(data.pedido);
        } catch {
            setError(
                "No se pudo conectar con el sistema de seguimiento."
            );
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        const parametros =
            new URLSearchParams(
                window.location.search
            );

        const numeroDesdeUrl =
            parametros.get(
                "numeroPedido"
            );

        if (!numeroDesdeUrl) {
            return;
        }

        const numeroLimpio =
            numeroDesdeUrl
                .trim()
                .toUpperCase();

        if (!numeroLimpio) {
            return;
        }

        setNumeroPedido(
            numeroLimpio
        );

        consultarPedido(
            numeroLimpio
        );
    }, []);

    async function buscarPedido(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        await consultarPedido(
            numeroPedido
        );
    }

    function formatearDinero(
        valor: number
    ) {
        return `L ${valor.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    }

    function formatearFecha(
        fecha: string
    ) {
        try {
            return new Intl.DateTimeFormat(
                "es-HN",
                {
                    dateStyle: "long",
                    timeStyle: "short",
                }
            ).format(
                new Date(fecha)
            );
        } catch {
            return fecha;
        }
    }

    function textoEstado(
        estado: EstadoPedido
    ) {
        if (
            estado ===
            "pendiente"
        ) {
            return "Pedido recibido";
        }

        if (
            estado ===
            "confirmado"
        ) {
            return "Pedido confirmado";
        }

        return "Pedido entregado";
    }

    function descripcionEstado(
        estado: EstadoPedido
    ) {
        if (
            estado ===
            "pendiente"
        ) {
            return "Recibimos tu pedido y estamos revisando la información antes de comenzar su preparación.";
        }

        if (
            estado ===
            "confirmado"
        ) {
            return "Tu pedido fue confirmado y se encuentra en proceso de preparación.";
        }

        return "Tu pedido aparece como entregado. Gracias por comprar en la Tienda Oficial de Génesis FC.";
    }

    function indiceEstado(
        estado: EstadoPedido
    ) {
        if (
            estado ===
            "pendiente"
        ) {
            return 1;
        }

        if (
            estado ===
            "confirmado"
        ) {
            return 2;
        }

        return 3;
    }

    const progreso =
        pedido
            ? indiceEstado(
                  pedido.estado
              )
            : 0;

    return (
        <main className="min-h-screen bg-[#f7f7f5] text-[#0b1f43]">
            {/* HEADER */}
            <header className="border-b border-[#0b1f43]/10 bg-white">
                <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-5 py-5 sm:px-8 lg:px-10">
                    <Link
                        href="/tienda"
                        className="group inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.24em] text-[#0b1f43]/55 transition hover:text-[#158bd2]"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">
                            ←
                        </span>

                        Volver a la tienda
                    </Link>

                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-[0.24em]">
                            Génesis FC
                        </p>

                        <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-[#0b1f43]/35">
                            Seguimiento
                        </p>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section className="border-b border-[#0b1f43]/10 bg-[#0b1f43] px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-24">
                <div className="mx-auto max-w-[1500px]">
                    <p className="text-[9px] font-black uppercase tracking-[0.32em] text-[#5cc8ff]">
                        Tienda Oficial
                    </p>

                    <h1 className="mt-5 max-w-5xl text-5xl font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-6xl lg:text-8xl">
                        Sigue
                        <span className="block text-[#5cc8ff]">
                            tu pedido.
                        </span>
                    </h1>

                    <p className="mt-7 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                        Ingresa el número de pedido
                        que recibiste al finalizar tu
                        compra y consulta su estado.
                    </p>
                </div>
            </section>

            {/* BUSCADOR */}
            <section className="px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
                <div className="mx-auto max-w-[1100px]">
                    <div className="border border-[#0b1f43]/10 bg-white p-7 sm:p-10">
                        <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#158bd2]">
                            Consultar pedido
                        </p>

                        <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.04em] sm:text-4xl">
                            Número de pedido
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-[#0b1f43]/45">
                            Si llegaste aquí desde tu
                            compra, cargaremos tu pedido
                            automáticamente.
                        </p>

                        <form
                            onSubmit={
                                buscarPedido
                            }
                            className="mt-8"
                        >
                            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                                <input
                                    type="text"
                                    value={
                                        numeroPedido
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNumeroPedido(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="GFC-..."
                                    autoComplete="off"
                                    className="min-h-14 w-full border border-[#0b1f43]/15 bg-[#f7f7f5] px-5 text-sm font-black uppercase tracking-[0.08em] outline-none transition focus:border-[#158bd2]"
                                />

                                <button
                                    type="submit"
                                    disabled={
                                        cargando
                                    }
                                    className="min-h-14 bg-[#0b1f43] px-8 text-[9px] font-black uppercase tracking-[0.22em] text-white transition hover:bg-[#158bd2] disabled:cursor-wait disabled:opacity-60"
                                >
                                    {cargando
                                        ? "Buscando..."
                                        : "Consultar pedido →"}
                                </button>
                            </div>
                        </form>

                        {error && (
                            <div className="mt-5 border border-red-200 bg-red-50 px-5 py-4">
                                <p className="text-sm font-bold text-red-700">
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* RESULTADO */}
                    {pedido && (
                        <div className="mt-8">
                            <div className="border border-[#0b1f43]/10 bg-white">
                                <div className="border-b border-[#0b1f43]/10 p-7 sm:p-10">
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#158bd2]">
                                                Pedido
                                            </p>

                                            <h2 className="mt-3 break-all text-2xl font-black uppercase sm:text-3xl">
                                                {
                                                    pedido.numeroPedido
                                                }
                                            </h2>

                                            <p className="mt-2 text-xs text-[#0b1f43]/40">
                                                {formatearFecha(
                                                    pedido.creadoEn
                                                )}
                                            </p>
                                        </div>

                                        <div className="w-fit bg-[#edf8ff] px-5 py-4">
                                            <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#158bd2]">
                                                Estado actual
                                            </p>

                                            <p className="mt-1 text-sm font-black uppercase">
                                                {textoEstado(
                                                    pedido.estado
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* PROGRESO */}
                                <div className="p-7 sm:p-10">
                                    <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#158bd2]">
                                        Seguimiento
                                    </p>

                                    <div className="mt-7 grid gap-6 sm:grid-cols-3">
                                        <div>
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center text-sm font-black ${
                                                    progreso >=
                                                    1
                                                        ? "bg-[#158bd2] text-white"
                                                        : "bg-[#0b1f43]/10 text-[#0b1f43]/30"
                                                }`}
                                            >
                                                {progreso >
                                                1
                                                    ? "✓"
                                                    : "1"}
                                            </div>

                                            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em]">
                                                Pedido recibido
                                            </p>

                                            <p className="mt-2 text-xs leading-6 text-[#0b1f43]/40">
                                                Tu compra fue
                                                registrada.
                                            </p>
                                        </div>

                                        <div>
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center text-sm font-black ${
                                                    progreso >=
                                                    2
                                                        ? "bg-[#158bd2] text-white"
                                                        : "bg-[#0b1f43]/10 text-[#0b1f43]/30"
                                                }`}
                                            >
                                                {progreso >
                                                2
                                                    ? "✓"
                                                    : "2"}
                                            </div>

                                            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em]">
                                                Confirmado
                                            </p>

                                            <p className="mt-2 text-xs leading-6 text-[#0b1f43]/40">
                                                Estamos
                                                preparando tu
                                                pedido.
                                            </p>
                                        </div>

                                        <div>
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center text-sm font-black ${
                                                    progreso >=
                                                    3
                                                        ? "bg-[#0b1f43] text-white"
                                                        : "bg-[#0b1f43]/10 text-[#0b1f43]/30"
                                                }`}
                                            >
                                                {progreso >=
                                                3
                                                    ? "✓"
                                                    : "3"}
                                            </div>

                                            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em]">
                                                Entregado
                                            </p>

                                            <p className="mt-2 text-xs leading-6 text-[#0b1f43]/40">
                                                Pedido
                                                completado.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 border-l-4 border-[#158bd2] bg-[#edf8ff] px-5 py-5">
                                        <p className="text-sm font-bold leading-7 text-[#0b1f43]/70">
                                            {descripcionEstado(
                                                pedido.estado
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* INFORMACIÓN */}
                            <div className="mt-6 grid gap-5 sm:grid-cols-3">
                                <div className="border border-[#0b1f43]/10 bg-white p-6">
                                    <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                        Entrega
                                    </p>

                                    <p className="mt-3 text-sm font-black uppercase">
                                        {pedido.metodoEntrega ===
                                        "envio"
                                            ? "Envío a domicilio"
                                            : "Recoger"}
                                    </p>
                                </div>

                                <div className="border border-[#0b1f43]/10 bg-white p-6">
                                    <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                        Destino
                                    </p>

                                    <p className="mt-3 text-sm font-black">
                                        {pedido.metodoEntrega ===
                                        "recoger"
                                            ? pedido.puntoRetiro ||
                                              "Punto de retiro"
                                            : pedido.ciudad ||
                                              "Honduras"}
                                    </p>
                                </div>

                                <div className="border border-[#0b1f43]/10 bg-white p-6">
                                    <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                        Total
                                    </p>

                                    <p className="mt-3 text-xl font-black">
                                        {formatearDinero(
                                            pedido.total
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* CIERRE */}
            <section className="px-5 pb-5 sm:px-8 lg:px-10">
                <div className="mx-auto max-w-[1100px] bg-[#0b1f43] px-7 py-10 text-white sm:px-10">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-[0.28em] text-[#5cc8ff]">
                                Génesis FC
                            </p>

                            <p className="mt-2 text-sm font-black uppercase">
                                Tienda Oficial
                            </p>
                        </div>

                        <Link
                            href="/tienda"
                            className="inline-flex w-fit items-center gap-3 border border-white/20 px-5 py-4 text-[8px] font-black uppercase tracking-[0.2em] transition hover:bg-white hover:text-[#0b1f43]"
                        >
                            Seguir comprando
                            <span>→</span>
                        </Link>
                    </div>
                </div>
            </section>

            <div className="h-5" />
        </main>
    );
}