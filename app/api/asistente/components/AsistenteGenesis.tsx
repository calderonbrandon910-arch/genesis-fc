"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

type Mensaje = {
    role: "user" | "assistant";
    content: string;
};

type RespuestaAsistente = {
    ok: boolean;
    respuesta?: string;
    error?: string;
};

const ATAJOS = [
    {
        texto: "Próximos partidos",
        mensaje:
            "¿Dónde puedo ver los próximos partidos de Génesis FC?",
    },
    {
        texto: "Tienda Oficial",
        mensaje:
            "Quiero información sobre la Tienda Oficial de Génesis FC.",
    },
    {
        texto: "Seguir pedido",
        mensaje:
            "¿Cómo puedo seguir mi pedido de la Tienda Oficial?",
    },
];

export default function AsistenteGenesis() {
    const [abierto, setAbierto] =
        useState(false);

    const [mensaje, setMensaje] =
        useState("");

    const [enviando, setEnviando] =
        useState(false);

    const [error, setError] =
        useState("");

    const [historial, setHistorial] =
        useState<Mensaje[]>([
            {
                role: "assistant",
                content:
                    "Hola 👋 Soy el Asistente Génesis. Puedo ayudarte con información del club, partidos, tienda y seguimiento de pedidos.",
            },
        ]);

    const mensajesRef =
        useRef<HTMLDivElement | null>(
            null
        );

    function scrollFinal() {
        window.setTimeout(() => {
            mensajesRef.current?.scrollTo({
                top:
                    mensajesRef.current
                        .scrollHeight,
                behavior: "smooth",
            });
        }, 50);
    }

    async function enviarMensaje(
        textoManual?: string
    ) {
        const texto =
            (
                textoManual ??
                mensaje
            )
                .trim();

        if (
            !texto ||
            enviando
        ) {
            return;
        }

        const historialParaApi =
            historial.filter(
                (item) =>
                    !(
                        item.role ===
                            "assistant" &&
                        item ===
                            historial[0]
                    )
            );

        const mensajeUsuario: Mensaje = {
            role: "user",
            content: texto,
        };

        setHistorial((actual) => [
            ...actual,
            mensajeUsuario,
        ]);

        setMensaje("");
        setError("");
        setEnviando(true);

        scrollFinal();

        try {
            const respuesta =
                await fetch(
                    "/api/asistente",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            mensaje: texto,
                            historial:
                                historialParaApi.slice(
                                    -8
                                ),
                        }),
                    }
                );

            const data =
                (await respuesta.json()) as RespuestaAsistente;

            if (
                !respuesta.ok ||
                !data.ok ||
                !data.respuesta
            ) {
                setError(
                    data.error ||
                        "El asistente no pudo responder."
                );

                return;
            }

            setHistorial((actual) => [
                ...actual,
                {
                    role: "assistant",
                    content:
                        data.respuesta ?? "",
                },
            ]);

            scrollFinal();
        } catch {
            setError(
                "No se pudo conectar con el asistente."
            );
        } finally {
            setEnviando(false);
        }
    }

    async function manejarSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        await enviarMensaje();
    }

    return (
        <>
            {/* BOTÓN FLOTANTE */}
            <button
                type="button"
                onClick={() =>
                    setAbierto(
                        (valor) => !valor
                    )
                }
                aria-label={
                    abierto
                        ? "Cerrar Asistente Génesis"
                        : "Abrir Asistente Génesis"
                }
                className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#0b1f43] text-white shadow-[0_18px_50px_rgba(11,31,67,0.28)] transition duration-300 hover:bg-[#158bd2] sm:bottom-7 sm:right-7 sm:h-16 sm:w-16"
            >
                {abierto ? (
                    <span className="text-xl font-light">
                        ×
                    </span>
                ) : (
                    <span className="text-[11px] font-black uppercase tracking-[0.12em]">
                        IA
                    </span>
                )}
            </button>

            {/* PANEL */}
            <div
                className={`fixed inset-x-4 bottom-24 z-[89] overflow-hidden border border-[#0b1f43]/10 bg-white shadow-[0_30px_80px_rgba(11,31,67,0.22)] transition-all duration-300 sm:inset-x-auto sm:bottom-28 sm:right-7 sm:w-[390px] ${
                    abierto
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-5 opacity-0"
                }`}
            >
                {/* CABECERA */}
                <div className="bg-[#0b1f43] px-5 py-5 text-white">
                    <div className="flex items-start justify-between gap-5">
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-[0.28em] text-[#5cc8ff]">
                                Génesis FC
                            </p>

                            <h2 className="mt-2 text-lg font-black uppercase tracking-[-0.03em]">
                                Asistente Génesis
                            </h2>
                        </div>

                        <span className="inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.18em] text-white/50">
                            <span className="h-2 w-2 rounded-full bg-[#5cc8ff]" />
                            En línea
                        </span>
                    </div>
                </div>

                {/* MENSAJES */}
                <div
                    ref={mensajesRef}
                    className="max-h-[420px] min-h-[320px] overflow-y-auto bg-[#f7f7f5] px-4 py-5"
                >
                    <div className="space-y-4">
                        {historial.map(
                            (
                                item,
                                index
                            ) => (
                                <div
                                    key={`${item.role}-${index}`}
                                    className={`flex ${
                                        item.role ===
                                        "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[85%] px-4 py-3 text-sm leading-6 ${
                                            item.role ===
                                            "user"
                                                ? "bg-[#0b1f43] text-white"
                                                : "border border-[#0b1f43]/10 bg-white text-[#0b1f43]/70"
                                        }`}
                                    >
                                        {
                                            item.content
                                        }
                                    </div>
                                </div>
                            )
                        )}

                        {enviando && (
                            <div className="flex justify-start">
                                <div className="border border-[#0b1f43]/10 bg-white px-4 py-3 text-sm text-[#0b1f43]/45">
                                    Escribiendo...
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ATAJOS */}
                <div className="border-t border-[#0b1f43]/10 bg-white px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                        {ATAJOS.map(
                            (atajo) => (
                                <button
                                    key={
                                        atajo.texto
                                    }
                                    type="button"
                                    onClick={() =>
                                        enviarMensaje(
                                            atajo.mensaje
                                        )
                                    }
                                    disabled={
                                        enviando
                                    }
                                    className="border border-[#0b1f43]/10 px-3 py-2 text-[8px] font-black uppercase tracking-[0.14em] text-[#0b1f43]/55 transition hover:border-[#158bd2] hover:text-[#158bd2] disabled:opacity-40"
                                >
                                    {
                                        atajo.texto
                                    }
                                </button>
                            )
                        )}
                    </div>

                    {error && (
                        <p className="mt-3 text-xs leading-5 text-red-600">
                            {error}
                        </p>
                    )}
                </div>

                {/* INPUT */}
                <form
                    onSubmit={
                        manejarSubmit
                    }
                    className="border-t border-[#0b1f43]/10 bg-white p-4"
                >
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={
                                mensaje
                            }
                            onChange={(
                                event
                            ) =>
                                setMensaje(
                                    event
                                        .target
                                        .value
                                )
                            }
                            maxLength={
                                1000
                            }
                            placeholder="Escribe tu pregunta..."
                            className="min-h-12 flex-1 border border-[#0b1f43]/15 bg-white px-4 text-sm outline-none transition focus:border-[#158bd2]"
                        />

                        <button
                            type="submit"
                            disabled={
                                enviando ||
                                !mensaje.trim()
                            }
                            className="min-h-12 bg-[#0b1f43] px-4 text-[9px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#158bd2] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Enviar
                        </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4">
                        <p className="text-[7px] uppercase leading-4 tracking-[0.14em] text-[#0b1f43]/30">
                            Puede cometer errores.
                            Verifica información
                            importante.
                        </p>

                        <Link
                            href="/tienda"
                            className="whitespace-nowrap text-[7px] font-black uppercase tracking-[0.16em] text-[#158bd2]"
                        >
                            Tienda →
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}