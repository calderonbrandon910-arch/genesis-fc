"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { supabase } from "../../../lib/supabase/client";

type Pedido = {
    id: string;
    numero_pedido: string;
    estado: string;
    estado_pago: string;
    metodo_pago: string | null;
    nombre_cliente: string;
    telefono: string;
    correo: string;
    metodo_entrega: string;
    ciudad: string | null;
    direccion: string | null;
    punto_retiro: string | null;
    notas: string | null;
    latitud: number | null;
    longitud: number | null;
    total_articulos: number;
    subtotal: number;
    costo_envio: number | null;
    total: number;
    moneda: string;
    creado_en: string;
};

type RespuestaPedidos = {
    ok: boolean;
    error?: string;

    administrador?: {
        id: string;
        correo: string;
    };

    resumen?: {
        total: number;
        pendientes: number;
        confirmados: number;
        entregados: number;
    };

    pedidos?: Pedido[];
};

export default function AdminPedidosPage() {
    const router = useRouter();

    const [usuario, setUsuario] = useState<User | null>(
        null
    );

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [cerrandoSesion, setCerrandoSesion] =
        useState(false);

    useEffect(() => {
        let activo = true;

        async function cargarPanel() {
            try {
                setCargando(true);
                setError("");

                const {
                    data: { session },
                    error: sessionError,
                } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    router.replace("/admin/login");
                    return;
                }

                if (!activo) {
                    return;
                }

                setUsuario(session.user);

                const respuesta = await fetch(
                    "/api/admin/pedidos",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                        cache: "no-store",
                    }
                );

                const data =
                    (await respuesta.json()) as RespuestaPedidos;

                if (respuesta.status === 401) {
                    await supabase.auth.signOut();
                    router.replace("/admin/login");
                    return;
                }

                if (respuesta.status === 403) {
                    setError(
                        "Tu cuenta inició sesión correctamente, pero no tiene permisos administrativos."
                    );
                    return;
                }

                if (
                    !respuesta.ok ||
                    !data.ok
                ) {
                    setError(
                        data.error ||
                            "No se pudieron cargar los pedidos."
                    );
                    return;
                }

                if (!activo) {
                    return;
                }

                setPedidos(
                    data.pedidos ?? []
                );
            } catch {
                if (!activo) {
                    return;
                }

                setError(
                    "No se pudo conectar con el sistema de pedidos."
                );
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        }

        cargarPanel();

        return () => {
            activo = false;
        };
    }, [router]);

    const resumen = useMemo(() => {
        return {
            total: pedidos.length,

            pendientes:
                pedidos.filter(
                    (pedido) =>
                        pedido.estado === "pendiente"
                ).length,

            confirmados:
                pedidos.filter(
                    (pedido) =>
                        pedido.estado === "confirmado"
                ).length,

            entregados:
                pedidos.filter(
                    (pedido) =>
                        pedido.estado === "entregado"
                ).length,
        };
    }, [pedidos]);

    async function cerrarSesion() {
        if (cerrandoSesion) {
            return;
        }

        setCerrandoSesion(true);

        try {
            await supabase.auth.signOut();
            router.replace("/admin/login");
            router.refresh();
        } finally {
            setCerrandoSesion(false);
        }
    }

    function formatearFecha(
        fecha: string
    ) {
        try {
            return new Intl.DateTimeFormat(
                "es-HN",
                {
                    dateStyle: "medium",
                    timeStyle: "short",
                }
            ).format(
                new Date(fecha)
            );
        } catch {
            return fecha;
        }
    }

    function textoMetodoPago(
        metodo: string | null
    ) {
        if (metodo === "tarjeta") {
            return "Tarjeta";
        }

        if (metodo === "transferencia") {
            return "Transferencia";
        }

        if (metodo === "contraentrega") {
            return "Pago al recibir";
        }

        return "Sin definir";
    }

    if (cargando) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f5f5f2] px-6 text-[#0b1f43]">
                <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                        Génesis FC
                    </p>

                    <p className="mt-4 text-sm font-black uppercase tracking-[0.18em]">
                        Cargando pedidos...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f5f5f2] text-[#0b1f43]">
            <header className="border-b border-[#0b1f43]/10 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                            Génesis FC
                        </p>

                        <h1 className="mt-1 text-xl font-black uppercase tracking-[-0.03em]">
                            Administración
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {usuario?.email && (
                            <div className="hidden text-right md:block">
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/30">
                                    Sesión activa
                                </p>

                                <p className="mt-1 text-xs font-bold text-[#0b1f43]/60">
                                    {usuario.email}
                                </p>
                            </div>
                        )}

                        <Link
                            href="/"
                            className="inline-flex items-center border border-[#0b1f43]/10 px-5 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/50 transition hover:border-[#158bd2] hover:text-[#158bd2]"
                        >
                            Ver sitio →
                        </Link>

                        <button
                            type="button"
                            onClick={cerrarSesion}
                            disabled={cerrandoSesion}
                            className="inline-flex items-center bg-[#0b1f43] px-5 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-[#158bd2] disabled:cursor-wait disabled:opacity-50"
                        >
                            {cerrandoSesion
                                ? "Saliendo..."
                                : "Cerrar sesión"}
                        </button>
                    </div>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
                <div className="flex flex-col gap-6 border-b border-[#0b1f43]/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                            Tienda Oficial
                        </p>

                        <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
                            Pedidos
                        </h2>

                        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#0b1f43]/50">
                            Centro de administración de pedidos de
                            la Tienda Oficial de Génesis FC.
                        </p>
                    </div>

                    <div className="border border-[#158bd2]/20 bg-[#edf8ff] px-5 py-4">
                        <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#158bd2]">
                            Sistema
                        </p>

                        <p className="mt-1 text-sm font-black uppercase">
                            Conectado a Supabase
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mt-8 border border-red-200 bg-red-50 p-6">
                        <p className="text-[8px] font-black uppercase tracking-[0.22em] text-red-600">
                            Error administrativo
                        </p>

                        <p className="mt-3 text-sm font-bold leading-6 text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="border border-[#0b1f43]/10 bg-white p-6">
                        <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                            Pedidos
                        </p>

                        <p className="mt-4 text-3xl font-black">
                            {resumen.total}
                        </p>

                        <p className="mt-2 text-xs text-[#0b1f43]/40">
                            Total registrado
                        </p>
                    </div>

                    <div className="border border-[#0b1f43]/10 bg-white p-6">
                        <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                            Pendientes
                        </p>

                        <p className="mt-4 text-3xl font-black">
                            {resumen.pendientes}
                        </p>

                        <p className="mt-2 text-xs text-[#0b1f43]/40">
                            Requieren atención
                        </p>
                    </div>

                    <div className="border border-[#0b1f43]/10 bg-white p-6">
                        <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                            Confirmados
                        </p>

                        <p className="mt-4 text-3xl font-black">
                            {resumen.confirmados}
                        </p>

                        <p className="mt-2 text-xs text-[#0b1f43]/40">
                            En procesamiento
                        </p>
                    </div>

                    <div className="border border-[#0b1f43]/10 bg-white p-6">
                        <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                            Entregados
                        </p>

                        <p className="mt-4 text-3xl font-black">
                            {resumen.entregados}
                        </p>

                        <p className="mt-2 text-xs text-[#0b1f43]/40">
                            Pedidos completados
                        </p>
                    </div>
                </div>

                <div className="mt-8 overflow-hidden border border-[#0b1f43]/10 bg-white">
                    <div className="border-b border-[#0b1f43]/10 px-6 py-6 sm:px-8">
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#158bd2]">
                            Gestión
                        </p>

                        <h3 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em]">
                            Pedidos recientes
                        </h3>
                    </div>

                    {pedidos.length === 0 ? (
                        <div className="flex min-h-[260px] items-center justify-center px-6 py-16 text-center">
                            <div className="max-w-md">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#158bd2]/25 bg-[#edf8ff] text-lg font-black text-[#158bd2]">
                                    G
                                </div>

                                <h4 className="mt-5 text-lg font-black uppercase">
                                    Sin pedidos
                                </h4>

                                <p className="mt-3 text-sm leading-7 text-[#0b1f43]/45">
                                    No hay pedidos almacenados para
                                    mostrar en este momento.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#0b1f43]/10">
                            {pedidos.map((pedido) => (
                                <article
                                    key={pedido.id}
                                    className="grid gap-6 px-6 py-7 sm:px-8 xl:grid-cols-[1.2fr_1fr_1fr_auto_auto] xl:items-center"
                                >
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#158bd2]">
                                            Número de pedido
                                        </p>

                                        <p className="mt-2 break-all text-sm font-black uppercase">
                                            {pedido.numero_pedido}
                                        </p>

                                        <p className="mt-2 text-xs text-[#0b1f43]/40">
                                            {formatearFecha(
                                                pedido.creado_en
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/30">
                                            Cliente
                                        </p>

                                        <p className="mt-2 text-sm font-black">
                                            {pedido.nombre_cliente}
                                        </p>

                                        <p className="mt-1 text-xs text-[#0b1f43]/45">
                                            {pedido.telefono}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/30">
                                            Pago
                                        </p>

                                        <p className="mt-2 text-sm font-black uppercase">
                                            {textoMetodoPago(
                                                pedido.metodo_pago
                                            )}
                                        </p>

                                        <p className="mt-1 text-xs font-black uppercase text-[#0b1f43]/40">
                                            {pedido.estado}
                                        </p>
                                    </div>

                                    <div className="xl:text-right">
                                        <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/30">
                                            Total
                                        </p>

                                        <p className="mt-2 text-2xl font-black">
                                            L{" "}
                                            {pedido.total.toLocaleString(
                                                "en-US"
                                            )}
                                        </p>

                                        <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#0b1f43]/35">
                                            {pedido.total_articulos}{" "}
                                            artículo
                                            {pedido.total_articulos ===
                                            1
                                                ? ""
                                                : "s"}
                                        </p>
                                    </div>

                                    <div className="xl:text-right">
                                        <Link
                                            href={`/admin/pedidos/${pedido.id}`}
                                            className="inline-flex min-w-36 items-center justify-center bg-[#0b1f43] px-5 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-[#158bd2]"
                                        >
                                            Ver pedido →
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