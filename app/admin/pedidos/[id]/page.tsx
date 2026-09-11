"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { supabase } from "../../../../lib/supabase/client";

type EstadoPedido =
    | "pendiente"
    | "confirmado"
    | "entregado";

type Pedido = {
    id: string;
    numero_pedido: string;
    estado: EstadoPedido;
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

type PedidoItem = {
    id: string;
    pedido_id: string;
    producto_id: string;
    nombre_producto: string;
    talla: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    creado_en: string;
};

type RespuestaDetalle = {
    ok: boolean;
    error?: string;
    mensaje?: string;
    pedido?: Pedido;
    items?: PedidoItem[];
};

export default function AdminPedidoDetallePage() {
    const router = useRouter();
    const params = useParams();

    const id =
        typeof params.id === "string"
            ? params.id
            : "";

    const [pedido, setPedido] =
        useState<Pedido | null>(null);

    const [items, setItems] =
        useState<PedidoItem[]>([]);

    const [cargando, setCargando] =
        useState(true);

    const [actualizandoEstado, setActualizandoEstado] =
        useState(false);

    const [error, setError] =
        useState("");

    const [mensaje, setMensaje] =
        useState("");

    useEffect(() => {
        let activo = true;

        async function cargarPedido() {
            try {
                setCargando(true);
                setError("");
                setMensaje("");

                const {
                    data: { session },
                    error: sessionError,
                } = await supabase.auth.getSession();

                if (
                    sessionError ||
                    !session
                ) {
                    router.replace("/admin/login");
                    return;
                }

                const respuesta = await fetch(
                    `/api/admin/pedidos/${encodeURIComponent(id)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                        cache: "no-store",
                    }
                );

                const data =
                    (await respuesta.json()) as RespuestaDetalle;

                if (respuesta.status === 401) {
                    await supabase.auth.signOut();
                    router.replace("/admin/login");
                    return;
                }

                if (
                    !respuesta.ok ||
                    !data.ok
                ) {
                    if (activo) {
                        setError(
                            data.error ||
                                "No se pudo cargar el pedido."
                        );
                    }

                    return;
                }

                if (!activo) {
                    return;
                }

                setPedido(data.pedido ?? null);
                setItems(data.items ?? []);
            } catch {
                if (activo) {
                    setError(
                        "No se pudo conectar con el sistema de pedidos."
                    );
                }
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        }

        if (id) {
            cargarPedido();
        }

        return () => {
            activo = false;
        };
    }, [id, router]);

    async function cambiarEstado(
        nuevoEstado: EstadoPedido
    ) {
        if (
            !pedido ||
            actualizandoEstado ||
            pedido.estado === nuevoEstado
        ) {
            return;
        }

        setActualizandoEstado(true);
        setError("");
        setMensaje("");

        try {
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (
                sessionError ||
                !session
            ) {
                router.replace("/admin/login");
                return;
            }

            const respuesta = await fetch(
                `/api/admin/pedidos/${encodeURIComponent(id)}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({
                        estado: nuevoEstado,
                    }),
                }
            );

            const data =
                (await respuesta.json()) as RespuestaDetalle;

            if (respuesta.status === 401) {
                await supabase.auth.signOut();
                router.replace("/admin/login");
                return;
            }

            if (
                !respuesta.ok ||
                !data.ok ||
                !data.pedido
            ) {
                setError(
                    data.error ||
                        "No se pudo actualizar el estado."
                );

                return;
            }

            setPedido(data.pedido);

            setMensaje(
                data.mensaje ||
                    "Estado actualizado correctamente."
            );

            router.refresh();
        } catch {
            setError(
                "No se pudo conectar con el sistema para actualizar el pedido."
            );
        } finally {
            setActualizandoEstado(false);
        }
    }

    function formatearDinero(
        valor: number | null
    ) {
        return `L ${(valor ?? 0).toLocaleString(
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
            ).format(new Date(fecha));
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
            return "Transferencia bancaria";
        }

        if (metodo === "contraentrega") {
            return "Pago al recibir";
        }

        return metodo || "Sin definir";
    }

    function textoEstado(
        estado: EstadoPedido
    ) {
        if (estado === "pendiente") {
            return "Pendiente";
        }

        if (estado === "confirmado") {
            return "Confirmado";
        }

        return "Entregado";
    }

    if (cargando) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f5f5f2] text-[#0b1f43]">
                <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                        Génesis FC
                    </p>

                    <p className="mt-4 text-sm font-black uppercase tracking-[0.18em]">
                        Cargando pedido...
                    </p>
                </div>
            </main>
        );
    }

    if (error && !pedido) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f5f5f2] px-6 text-[#0b1f43]">
                <div className="w-full max-w-xl border border-red-200 bg-white p-8 text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-red-600">
                        Error
                    </p>

                    <h1 className="mt-3 text-2xl font-black uppercase">
                        No pudimos abrir el pedido
                    </h1>

                    <p className="mt-4 text-sm leading-7 text-[#0b1f43]/50">
                        {error}
                    </p>

                    <Link
                        href="/admin/pedidos"
                        className="mt-7 inline-flex bg-[#0b1f43] px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-[#158bd2]"
                    >
                        ← Volver a pedidos
                    </Link>
                </div>
            </main>
        );
    }

    if (!pedido) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f5f5f2] px-6 text-[#0b1f43]">
                <div className="text-center">
                    <p className="text-sm font-black uppercase">
                        Pedido no encontrado
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f5f5f2] text-[#0b1f43]">
            <header className="border-b border-[#0b1f43]/10 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-6 lg:px-10">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                            Génesis FC
                        </p>

                        <h1 className="mt-1 text-xl font-black uppercase">
                            Administración
                        </h1>
                    </div>

                    <Link
                        href="/admin/pedidos"
                        className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/50 transition hover:text-[#158bd2]"
                    >
                        ← Pedidos
                    </Link>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
                <div className="border-b border-[#0b1f43]/10 pb-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                        Detalle del pedido
                    </p>

                    <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="break-all text-3xl font-black uppercase tracking-[-0.04em] sm:text-4xl">
                                {pedido.numero_pedido}
                            </h2>

                            <p className="mt-3 text-sm text-[#0b1f43]/45">
                                {formatearFecha(
                                    pedido.creado_en
                                )}
                            </p>
                        </div>

                        <div className="inline-flex w-fit border border-[#158bd2]/20 bg-[#edf8ff] px-5 py-4">
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#158bd2]">
                                    Estado
                                </p>

                                <p className="mt-1 text-sm font-black uppercase">
                                    {textoEstado(
                                        pedido.estado
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {(error || mensaje) && (
                    <div className="mt-6">
                        {error && (
                            <div className="border border-red-200 bg-red-50 px-5 py-4">
                                <p className="text-sm font-bold text-red-700">
                                    {error}
                                </p>
                            </div>
                        )}

                        {mensaje && (
                            <div className="border border-green-200 bg-green-50 px-5 py-4">
                                <p className="text-sm font-bold text-green-700">
                                    {mensaje}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 border border-[#0b1f43]/10 bg-white p-7">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#158bd2]">
                        Gestión
                    </p>

                    <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em]">
                        Estado del pedido
                    </h3>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#0b1f43]/45">
                        Actualiza el avance de este pedido.
                        El cambio se guarda directamente
                        en Supabase.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                cambiarEstado(
                                    "pendiente"
                                )
                            }
                            disabled={
                                actualizandoEstado ||
                                pedido.estado ===
                                    "pendiente"
                            }
                            className={`px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] transition ${
                                pedido.estado ===
                                "pendiente"
                                    ? "cursor-default bg-[#158bd2] text-white"
                                    : "border border-[#0b1f43]/15 bg-white text-[#0b1f43] hover:border-[#158bd2] hover:text-[#158bd2]"
                            } disabled:opacity-60`}
                        >
                            Pendiente
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                cambiarEstado(
                                    "confirmado"
                                )
                            }
                            disabled={
                                actualizandoEstado ||
                                pedido.estado ===
                                    "confirmado"
                            }
                            className={`px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] transition ${
                                pedido.estado ===
                                "confirmado"
                                    ? "cursor-default bg-[#158bd2] text-white"
                                    : "border border-[#0b1f43]/15 bg-white text-[#0b1f43] hover:border-[#158bd2] hover:text-[#158bd2]"
                            } disabled:opacity-60`}
                        >
                            Confirmar pedido
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                cambiarEstado(
                                    "entregado"
                                )
                            }
                            disabled={
                                actualizandoEstado ||
                                pedido.estado ===
                                    "entregado"
                            }
                            className={`px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] transition ${
                                pedido.estado ===
                                "entregado"
                                    ? "cursor-default bg-[#0b1f43] text-white"
                                    : "border border-[#0b1f43]/15 bg-white text-[#0b1f43] hover:bg-[#0b1f43] hover:text-white"
                            } disabled:opacity-60`}
                        >
                            Marcar como entregado
                        </button>
                    </div>

                    {actualizandoEstado && (
                        <p className="mt-4 text-[9px] font-black uppercase tracking-[0.18em] text-[#158bd2]">
                            Guardando cambio...
                        </p>
                    )}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <div className="border border-[#0b1f43]/10 bg-white p-7">
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#158bd2]">
                            Cliente
                        </p>

                        <h3 className="mt-4 text-xl font-black">
                            {pedido.nombre_cliente}
                        </h3>

                        <div className="mt-6 space-y-4 text-sm">
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/30">
                                    Teléfono
                                </p>

                                <p className="mt-1 font-bold">
                                    {pedido.telefono}
                                </p>
                            </div>

                            <div>
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/30">
                                    Correo
                                </p>

                                <p className="mt-1 break-all font-bold">
                                    {pedido.correo}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border border-[#0b1f43]/10 bg-white p-7">
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#158bd2]">
                            Entrega
                        </p>

                        <h3 className="mt-4 text-xl font-black uppercase">
                            {pedido.metodo_entrega}
                        </h3>

                        <div className="mt-6 space-y-4 text-sm">
                            {pedido.ciudad && (
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/30">
                                        Ciudad
                                    </p>

                                    <p className="mt-1 font-bold">
                                        {pedido.ciudad}
                                    </p>
                                </div>
                            )}

                            {pedido.direccion && (
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/30">
                                        Dirección
                                    </p>

                                    <p className="mt-1 leading-6">
                                        {pedido.direccion}
                                    </p>
                                </div>
                            )}

                            {pedido.punto_retiro && (
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/30">
                                        Punto de retiro
                                    </p>

                                    <p className="mt-1 font-bold">
                                        {pedido.punto_retiro}
                                    </p>
                                </div>
                            )}

                            {pedido.notas && (
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/30">
                                        Notas
                                    </p>

                                    <p className="mt-1 leading-6">
                                        {pedido.notas}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 border border-[#0b1f43]/10 bg-white">
                    <div className="border-b border-[#0b1f43]/10 px-7 py-6">
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#158bd2]">
                            Productos
                        </p>

                        <h3 className="mt-2 text-2xl font-black uppercase">
                            Artículos del pedido
                        </h3>
                    </div>

                    <div className="divide-y divide-[#0b1f43]/10">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="grid gap-5 px-7 py-6 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                            >
                                <div>
                                    <p className="font-black">
                                        {item.nombre_producto}
                                    </p>

                                    <p className="mt-2 text-xs uppercase text-[#0b1f43]/40">
                                        Talla:{" "}
                                        <span className="font-black">
                                            {item.talla}
                                        </span>
                                    </p>
                                </div>

                                <div className="sm:text-right">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/30">
                                        Cantidad
                                    </p>

                                    <p className="mt-1 font-black">
                                        {item.cantidad}
                                    </p>
                                </div>

                                <div className="sm:min-w-32 sm:text-right">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/30">
                                        Subtotal
                                    </p>

                                    <p className="mt-1 font-black">
                                        {formatearDinero(
                                            item.subtotal
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {items.length === 0 && (
                            <div className="px-7 py-12 text-center text-sm text-[#0b1f43]/40">
                                Este pedido no tiene productos registrados.
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
                    <div className="border border-[#0b1f43]/10 bg-white p-7">
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#158bd2]">
                            Pago
                        </p>

                        <h3 className="mt-4 text-xl font-black uppercase">
                            {textoMetodoPago(
                                pedido.metodo_pago
                            )}
                        </h3>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <span className="border border-[#0b1f43]/10 px-4 py-2 text-[9px] font-black uppercase tracking-[0.15em]">
                                Pedido:{" "}
                                {textoEstado(
                                    pedido.estado
                                )}
                            </span>

                            <span className="border border-[#0b1f43]/10 px-4 py-2 text-[9px] font-black uppercase tracking-[0.15em]">
                                Pago:{" "}
                                {pedido.estado_pago}
                            </span>
                        </div>
                    </div>

                    <div className="bg-[#0b1f43] p-7 text-white">
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#68c8ff]">
                            Resumen
                        </p>

                        <div className="mt-6 space-y-4 text-sm">
                            <div className="flex justify-between gap-4">
                                <span className="text-white/50">
                                    Subtotal
                                </span>

                                <span className="font-black">
                                    {formatearDinero(
                                        pedido.subtotal
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-white/50">
                                    Envío
                                </span>

                                <span className="font-black">
                                    {formatearDinero(
                                        pedido.costo_envio
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-white/15 pt-6">
                            <div className="flex items-end justify-between gap-4">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
                                    Total
                                </span>

                                <span className="text-3xl font-black">
                                    {formatearDinero(
                                        pedido.total
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}