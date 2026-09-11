"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../CartProvider";

type MetodoPago =
    | "tarjeta"
    | "transferencia"
    | "contraentrega";

type RespuestaPedido = {
    ok: boolean;
    mensaje?: string;
    error?: string;
    reutilizado?: boolean;
    idempotencyKey?: string;
    pedido?: {
        id: string;
        numeroPedido: string;
        estado: string;
        estadoPago?: string;
        totalArticulos: number;
        subtotal: number;
        envio: number | null;
        total: number;
        moneda: string;
        creadoEn: string;
    };
};

const IDEMPOTENCY_STORAGE_KEY =
    "genesis-fc-order-idempotency-key";

function crearIdempotencyKeyCliente() {
    if (
        typeof crypto !== "undefined" &&
        "randomUUID" in crypto
    ) {
        return `gfc_${crypto.randomUUID()}`;
    }

    return `gfc_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}`;
}

export default function PagoPage() {
    const {
        items,
        totalItems,
        totalPrice,
        checkoutData,
        clearCart,
        clearCheckoutData,
    } = useCart();

    const [metodoPago, setMetodoPago] =
        useState<MetodoPago>("tarjeta");

    const [creandoPedido, setCreandoPedido] =
        useState(false);

    const [errorPedido, setErrorPedido] =
        useState("");

    const [pedidoCreado, setPedidoCreado] =
        useState<RespuestaPedido["pedido"] | null>(
            null
        );

    const [pedidoReutilizado, setPedidoReutilizado] =
        useState(false);

    const [numeroCopiado, setNumeroCopiado] =
        useState(false);

    const [
        idempotencyKey,
        setIdempotencyKey,
    ] = useState("");

    useEffect(() => {
        try {
            const existente =
                window.sessionStorage.getItem(
                    IDEMPOTENCY_STORAGE_KEY
                );

            if (existente) {
                setIdempotencyKey(existente);
                return;
            }

            const nuevaKey =
                crearIdempotencyKeyCliente();

            window.sessionStorage.setItem(
                IDEMPOTENCY_STORAGE_KEY,
                nuevaKey
            );

            setIdempotencyKey(nuevaKey);
        } catch {
            setIdempotencyKey(
                crearIdempotencyKeyCliente()
            );
        }
    }, []);

    const prepararPedido = async () => {
        if (
            creandoPedido ||
            items.length === 0 ||
            !checkoutData ||
            !idempotencyKey
        ) {
            return;
        }

        setCreandoPedido(true);
        setErrorPedido("");

        try {
            const respuesta = await fetch(
                "/api/pedidos",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        cliente: {
                            nombre:
                                checkoutData.nombre,
                            telefono:
                                checkoutData.telefono,
                            correo:
                                checkoutData.correo,
                            metodoEntrega:
                                checkoutData.metodoEntrega,
                            ciudad:
                                checkoutData.ciudad,
                            direccion:
                                checkoutData.direccion,
                            puntoRetiro:
                                checkoutData.puntoRetiro,
                            notas:
                                checkoutData.notas,
                        },

                        productos: items.map(
                            (item) => ({
                                id: item.id,
                                talla: item.talla,
                                cantidad:
                                    item.cantidad,
                            })
                        ),

                        metodoPago,

                        idempotencyKey,
                    }),
                }
            );

            const data =
                (await respuesta.json()) as RespuestaPedido;

            if (
                !respuesta.ok ||
                !data.ok ||
                !data.pedido
            ) {
                throw new Error(
                    data.error ||
                        "No se pudo crear el pedido."
                );
            }

            setPedidoCreado(data.pedido);

            setPedidoReutilizado(
                Boolean(data.reutilizado)
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } catch (error) {
            const mensaje =
                error instanceof Error
                    ? error.message
                    : "No se pudo crear el pedido.";

            setErrorPedido(mensaje);
        } finally {
            setCreandoPedido(false);
        }
    };

    const copiarNumeroPedido = async () => {
        if (!pedidoCreado?.numeroPedido) {
            return;
        }

        try {
            await navigator.clipboard.writeText(
                pedidoCreado.numeroPedido
            );

            setNumeroCopiado(true);

            window.setTimeout(() => {
                setNumeroCopiado(false);
            }, 2200);
        } catch {
            setNumeroCopiado(false);
        }
    };

    const finalizarPedido = () => {
        clearCart();
        clearCheckoutData();

        try {
            window.sessionStorage.removeItem(
                IDEMPOTENCY_STORAGE_KEY
            );
        } catch {
            // No hacemos nada si sessionStorage no está disponible.
        }
    };

    if (
        pedidoCreado &&
        checkoutData
    ) {
        return (
            <main className="min-h-screen bg-[#f7f7f5] px-5 py-16 text-[#0b1f43] sm:px-8 lg:px-10 lg:py-24">
                <div className="mx-auto max-w-[1100px]">
                    <div className="bg-white px-7 py-16 sm:px-10 lg:px-16 lg:py-20">
                        <div className="text-center">
                            <p className="text-[9px] font-black uppercase tracking-[0.32em] text-[#158bd2]">
                                Génesis FC Shop
                            </p>

                            <h1 className="mt-5 text-5xl font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-6xl">
                                Pedido
                                <span className="block text-[#158bd2]">
                                    creado.
                                </span>
                            </h1>

                            <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-[#0b1f43]/50">
                                El pedido quedó registrado correctamente en el
                                sistema de Génesis FC.
                            </p>
                        </div>

                        <div className="mx-auto mt-10 max-w-2xl bg-[#0b1f43] px-6 py-8 text-center text-white sm:px-8">
                            <p className="text-[8px] font-black uppercase tracking-[0.28em] text-[#5cc8ff]">
                                Número de pedido
                            </p>

                            <p className="mt-4 break-all text-2xl font-black uppercase tracking-[0.06em] sm:text-3xl">
                                {pedidoCreado.numeroPedido}
                            </p>

                            <p className="mt-4 text-[8px] uppercase tracking-[0.18em] text-white/40">
                                Guarda este número como referencia
                            </p>

                            <button
                                type="button"
                                onClick={copiarNumeroPedido}
                                className="mt-6 inline-flex items-center gap-3 border border-white/20 px-5 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#0b1f43]"
                            >
                                {numeroCopiado
                                    ? "Número copiado ✓"
                                    : "Copiar número de pedido"}
                            </button>
                        </div>

                        {pedidoReutilizado && (
                            <div className="mx-auto mt-6 max-w-2xl border border-[#158bd2]/20 bg-[#edf8ff] p-5">
                                <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#158bd2]">
                                    Pedido recuperado
                                </p>

                                <p className="mt-3 text-xs leading-6 text-[#0b1f43]/50">
                                    Detectamos un reintento y reutilizamos el
                                    pedido existente en lugar de crear uno
                                    duplicado.
                                </p>
                            </div>
                        )}

                        <div className="mx-auto mt-10 max-w-2xl">
                            <div className="divide-y divide-[#0b1f43]/10 border-y border-[#0b1f43]/10">
                                <div className="grid gap-3 py-5 sm:grid-cols-[180px_1fr]">
                                    <span className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                        Cliente
                                    </span>

                                    <span className="text-sm font-black">
                                        {checkoutData.nombre}
                                    </span>
                                </div>

                                <div className="grid gap-3 py-5 sm:grid-cols-[180px_1fr]">
                                    <span className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                        Estado
                                    </span>

                                    <span className="text-sm font-black uppercase">
                                        {pedidoCreado.estado}
                                    </span>
                                </div>

                                <div className="grid gap-3 py-5 sm:grid-cols-[180px_1fr]">
                                    <span className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                        Productos
                                    </span>

                                    <span className="text-sm font-black">
                                        {pedidoCreado.totalArticulos}
                                    </span>
                                </div>

                                <div className="grid gap-3 py-5 sm:grid-cols-[180px_1fr]">
                                    <span className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                        Método elegido
                                    </span>

                                    <span className="text-sm font-black uppercase">
                                        {metodoPago ===
                                        "tarjeta"
                                            ? "Tarjeta"
                                            : metodoPago ===
                                                "transferencia"
                                              ? "Transferencia bancaria"
                                              : "Pago al recibir"}
                                    </span>
                                </div>

                                <div className="grid gap-3 py-5 sm:grid-cols-[180px_1fr]">
                                    <span className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                        Total
                                    </span>

                                    <span className="text-2xl font-black">
                                        L{" "}
                                        {pedidoCreado.total.toLocaleString(
                                            "en-US"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mx-auto mt-8 max-w-2xl border border-[#158bd2]/20 bg-[#edf8ff] p-5">
                            <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#158bd2]">
                                Protección activa
                            </p>

                            <p className="mt-3 text-xs leading-6 text-[#0b1f43]/50">
                                Esta compra utiliza una llave de idempotencia.
                                Si la misma solicitud se repite, el sistema no
                                debería crear una segunda orden.
                            </p>
                        </div>

                        <div className="mx-auto mt-6 max-w-2xl border border-[#0b1f43]/10 bg-white p-5">
                            <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#158bd2]">
                                Próximo paso
                            </p>

                            {metodoPago === "transferencia" ? (
                                <p className="mt-3 text-xs leading-6 text-[#0b1f43]/55">
                                    Tu pedido quedó recibido y permanecerá pendiente
                                    hasta que Génesis FC confirme la transferencia.
                                    Conserva tu número de pedido para consultar el
                                    estado en cualquier momento.
                                </p>
                            ) : metodoPago === "contraentrega" ? (
                                <p className="mt-3 text-xs leading-6 text-[#0b1f43]/55">
                                    Tu pedido quedó recibido. Génesis FC confirmará
                                    el pedido antes de coordinar el despacho, la
                                    entrega o el retiro correspondiente.
                                </p>
                            ) : (
                                <p className="mt-3 text-xs leading-6 text-[#0b1f43]/55">
                                    Tu pedido quedó recibido. Puedes consultar su
                                    estado con el número de pedido mientras se
                                    completa la confirmación del pago.
                                </p>
                            )}
                        </div>

                        <div className="mt-10 flex flex-wrap justify-center gap-3">
                            <Link
                                href={`/tienda/seguimiento?numeroPedido=${encodeURIComponent(
                                    pedidoCreado.numeroPedido
                                )}`}
                                className="inline-flex items-center gap-4 bg-[#158bd2] px-7 py-5 text-[9px] font-black uppercase tracking-[0.22em] text-white transition hover:bg-[#0b1f43]"
                            >
                                Ver estado de mi pedido
                                <span>→</span>
                            </Link>

                            <Link
                                href="/tienda"
                                onClick={finalizarPedido}
                                className="inline-flex items-center gap-4 bg-[#0b1f43] px-7 py-5 text-[9px] font-black uppercase tracking-[0.22em] text-white transition hover:bg-[#158bd2]"
                            >
                                Finalizar compra
                                <span>→</span>
                            </Link>

                            <Link
                                href="/tienda/carrito"
                                className="inline-flex items-center border border-[#0b1f43]/15 px-7 py-5 text-[9px] font-black uppercase tracking-[0.22em] text-[#0b1f43] transition hover:border-[#0b1f43]"
                            >
                                Ver carrito
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f7f5] text-[#0b1f43]">
            <section className="border-b border-[#0b1f43]/10 bg-white">
                <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-5 py-5 sm:px-8 lg:px-10">
                    <Link
                        href="/tienda/checkout"
                        className="group inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.24em] text-[#0b1f43]/55 transition hover:text-[#158bd2]"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">
                            ←
                        </span>

                        Volver al checkout
                    </Link>

                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-[0.24em]">
                            Génesis FC
                        </p>

                        <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-[#0b1f43]/35">
                            Pago
                        </p>
                    </div>
                </div>
            </section>

            <section className="border-b border-[#0b1f43]/10 bg-white">
                <div className="mx-auto flex max-w-[1500px] items-center gap-4 overflow-x-auto px-5 py-4 sm:px-8 lg:px-10">
                    <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center bg-[#158bd2] text-[9px] font-black text-white">
                            ✓
                        </span>

                        <span className="whitespace-nowrap text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/40">
                            Datos
                        </span>
                    </div>

                    <div className="h-px w-10 flex-none bg-[#0b1f43]/15" />

                    <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center bg-[#158bd2] text-[9px] font-black text-white">
                            ✓
                        </span>

                        <span className="whitespace-nowrap text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/40">
                            Revisión
                        </span>
                    </div>

                    <div className="h-px w-10 flex-none bg-[#0b1f43]/15" />

                    <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center bg-[#0b1f43] text-[9px] font-black text-white">
                            3
                        </span>

                        <span className="whitespace-nowrap text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]">
                            Pago
                        </span>
                    </div>
                </div>
            </section>

            <section className="px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
                <div className="mx-auto max-w-[1500px]">
                    {items.length === 0 ? (
                        <div className="bg-white px-7 py-20 text-center">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                No hay productos
                            </p>

                            <h1 className="mt-5 text-4xl font-black uppercase tracking-[-0.04em] sm:text-5xl">
                                Tu carrito está vacío.
                            </h1>

                            <Link
                                href="/tienda"
                                className="mt-8 inline-flex items-center gap-4 bg-[#0b1f43] px-7 py-5 text-[9px] font-black uppercase tracking-[0.22em] text-white transition hover:bg-[#158bd2]"
                            >
                                Ir a la tienda
                                <span>→</span>
                            </Link>
                        </div>
                    ) : !checkoutData ? (
                        <div className="bg-white px-7 py-20 text-center">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                Faltan tus datos
                            </p>

                            <h1 className="mt-5 text-4xl font-black uppercase tracking-[-0.04em] sm:text-5xl">
                                Completa primero
                                <span className="block text-[#158bd2]">
                                    el checkout.
                                </span>
                            </h1>

                            <Link
                                href="/tienda/checkout"
                                className="mt-8 inline-flex items-center gap-4 bg-[#0b1f43] px-7 py-5 text-[9px] font-black uppercase tracking-[0.22em] text-white transition hover:bg-[#158bd2]"
                            >
                                Ir al checkout
                                <span>→</span>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-12 border-b border-[#0b1f43]/10 pb-8">
                                <p className="text-[9px] font-black uppercase tracking-[0.32em] text-[#158bd2]">
                                    Paso 03 · Pago
                                </p>

                                <h1 className="mt-4 text-5xl font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                                    Elige cómo
                                    <span className="block text-[#158bd2]">
                                        pagar.
                                    </span>
                                </h1>

                                <p className="mt-6 max-w-xl text-sm leading-7 text-[#0b1f43]/50">
                                    El pedido está protegido contra reintentos
                                    accidentales antes de integrar pagos reales.
                                </p>
                            </div>

                            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                                <div className="space-y-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMetodoPago(
                                                "tarjeta"
                                            )
                                        }
                                        className={`w-full border p-6 text-left transition sm:p-8 ${
                                            metodoPago ===
                                            "tarjeta"
                                                ? "border-[#0b1f43] bg-[#0b1f43] text-white"
                                                : "border-[#0b1f43]/10 bg-white text-[#0b1f43]"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-6">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.28em]">
                                                    Tarjeta
                                                </p>

                                                <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em]">
                                                    Crédito o débito
                                                </h2>
                                            </div>

                                            <span className="text-xl">
                                                {metodoPago ===
                                                "tarjeta"
                                                    ? "●"
                                                    : "○"}
                                            </span>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMetodoPago(
                                                "transferencia"
                                            )
                                        }
                                        className={`w-full border p-6 text-left transition sm:p-8 ${
                                            metodoPago ===
                                            "transferencia"
                                                ? "border-[#0b1f43] bg-[#0b1f43] text-white"
                                                : "border-[#0b1f43]/10 bg-white text-[#0b1f43]"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-6">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.28em]">
                                                    Transferencia
                                                </p>

                                                <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em]">
                                                    Transferencia bancaria
                                                </h2>
                                            </div>

                                            <span className="text-xl">
                                                {metodoPago ===
                                                "transferencia"
                                                    ? "●"
                                                    : "○"}
                                            </span>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMetodoPago(
                                                "contraentrega"
                                            )
                                        }
                                        className={`w-full border p-6 text-left transition sm:p-8 ${
                                            metodoPago ===
                                            "contraentrega"
                                                ? "border-[#0b1f43] bg-[#0b1f43] text-white"
                                                : "border-[#0b1f43]/10 bg-white text-[#0b1f43]"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-6">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.28em]">
                                                    Alternativa
                                                </p>

                                                <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em]">
                                                    Pago al recibir
                                                </h2>
                                            </div>

                                            <span className="text-xl">
                                                {metodoPago ===
                                                "contraentrega"
                                                    ? "●"
                                                    : "○"}
                                            </span>
                                        </div>
                                    </button>

                                    {metodoPago === "transferencia" && (
                                        <div className="border border-[#158bd2]/20 bg-[#edf8ff] p-7 sm:p-8">
                                            <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#158bd2]">
                                                Datos para transferencia
                                            </p>

                                            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-[#0b1f43]">
                                                Banco Atlántida
                                            </h2>

                                            <p className="mt-4 text-xs leading-6 text-[#0b1f43]/55">
                                                Realiza la transferencia a la cuenta oficial de
                                                Club Deportivo Génesis FC. Después de preparar el
                                                pedido, guarda tu número de pedido como referencia.
                                            </p>

                                            <div className="mt-6 divide-y divide-[#0b1f43]/10 border-y border-[#0b1f43]/10">
                                                <div className="grid gap-2 py-4 sm:grid-cols-[150px_1fr]">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/35">
                                                        Banco
                                                    </span>
                                                    <span className="text-sm font-black">
                                                        Banco Atlántida
                                                    </span>
                                                </div>

                                                <div className="grid gap-2 py-4 sm:grid-cols-[150px_1fr]">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/35">
                                                        Tipo de cuenta
                                                    </span>
                                                    <span className="text-sm font-black">
                                                        Cuenta de cheques
                                                    </span>
                                                </div>

                                                <div className="grid gap-2 py-4 sm:grid-cols-[150px_1fr]">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/35">
                                                        Titular
                                                    </span>
                                                    <span className="text-sm font-black">
                                                        Club Deportivo Génesis FC
                                                    </span>
                                                </div>

                                                <div className="grid gap-2 py-4 sm:grid-cols-[150px_1fr]">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/35">
                                                        Número de cuenta
                                                    </span>
                                                    <span className="text-lg font-black tracking-[0.04em]">
                                                        2010091276
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="mt-5 text-[8px] font-black uppercase leading-5 tracking-[0.16em] text-[#0b1f43]/40">
                                                El pedido quedará pendiente hasta confirmar la transferencia.
                                            </p>
                                        </div>
                                    )}

                                    <div className="bg-white p-7 sm:p-8">
                                        <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#158bd2]">
                                            Datos del pedido
                                        </p>

                                        <div className="mt-7 divide-y divide-[#0b1f43]/10 border-y border-[#0b1f43]/10">
                                            <div className="grid gap-2 py-5 sm:grid-cols-[150px_1fr]">
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/35">
                                                    Cliente
                                                </span>

                                                <span className="text-sm font-black">
                                                    {
                                                        checkoutData.nombre
                                                    }
                                                </span>
                                            </div>

                                            <div className="grid gap-2 py-5 sm:grid-cols-[150px_1fr]">
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/35">
                                                    Teléfono
                                                </span>

                                                <span className="text-sm font-black">
                                                    {
                                                        checkoutData.telefono
                                                    }
                                                </span>
                                            </div>

                                            <div className="grid gap-2 py-5 sm:grid-cols-[150px_1fr]">
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/35">
                                                    Entrega
                                                </span>

                                                <span className="text-sm font-black uppercase">
                                                    {checkoutData.metodoEntrega ===
                                                    "envio"
                                                        ? "Envío a domicilio"
                                                        : "Recoger en tienda"}
                                                </span>
                                            </div>

                                            <div className="grid gap-2 py-5 sm:grid-cols-[150px_1fr]">
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/35">
                                                    Destino
                                                </span>

                                                <span className="text-sm font-black leading-6">
                                                    {checkoutData.metodoEntrega ===
                                                    "envio"
                                                        ? `${checkoutData.ciudad} · ${checkoutData.direccion}`
                                                        : checkoutData.puntoRetiro}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <aside className="h-fit bg-white p-7 sm:p-9 lg:sticky lg:top-6">
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                        Resumen de pago
                                    </p>

                                    <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.04em]">
                                        Tu pedido
                                    </h2>

                                    <div className="mt-8 divide-y divide-[#0b1f43]/10 border-y border-[#0b1f43]/10">
                                        {items.map(
                                            (item) => (
                                                <div
                                                    key={`${item.id}-${item.talla}`}
                                                    className="py-5"
                                                >
                                                    <div className="flex items-start justify-between gap-5">
                                                        <div>
                                                            <p className="text-sm font-black uppercase">
                                                                {
                                                                    item.nombre
                                                                }
                                                            </p>

                                                            <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-[#0b1f43]/40">
                                                                Talla{" "}
                                                                {
                                                                    item.talla
                                                                }{" "}
                                                                ·{" "}
                                                                {
                                                                    item.cantidad
                                                                }
                                                            </p>
                                                        </div>

                                                        <p className="whitespace-nowrap text-sm font-black">
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
                                            )
                                        )}
                                    </div>

                                    <div className="mt-7 space-y-5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0b1f43]/40">
                                                Productos
                                            </span>

                                            <span className="text-sm font-black">
                                                {totalItems}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0b1f43]/40">
                                                Entrega
                                            </span>

                                            <span className="text-right text-[9px] font-black uppercase tracking-[0.16em] text-[#0b1f43]/45">
                                                {checkoutData.metodoEntrega ===
                                                "recoger"
                                                    ? "Sin costo"
                                                    : "Por confirmar"}
                                            </span>
                                        </div>

                                        <div className="border-t border-[#0b1f43]/10 pt-6">
                                            <p className="text-[8px] font-black uppercase tracking-[0.24em] text-[#0b1f43]/35">
                                                Total provisional
                                            </p>

                                            <p className="mt-2 text-4xl font-black">
                                                L{" "}
                                                {totalPrice.toLocaleString(
                                                    "en-US"
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 border border-[#158bd2]/20 bg-[#edf8ff] p-5">
                                        <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#158bd2]">
                                            Pedido protegido
                                        </p>

                                        <p className="mt-3 text-xs leading-6 text-[#0b1f43]/50">
                                            El sistema evita crear una segunda
                                            orden si esta misma solicitud se
                                            procesa más de una vez.
                                        </p>
                                    </div>

                                    {errorPedido && (
                                        <div className="mt-5 border border-red-200 bg-red-50 p-5">
                                            <p className="text-[8px] font-black uppercase tracking-[0.22em] text-red-600">
                                                No se pudo crear el pedido
                                            </p>

                                            <p className="mt-3 text-xs leading-6 text-red-700">
                                                {errorPedido}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={
                                            prepararPedido
                                        }
                                        disabled={
                                            creandoPedido ||
                                            !idempotencyKey
                                        }
                                        className={`mt-8 flex w-full items-center justify-between px-6 py-5 text-[9px] font-black uppercase tracking-[0.22em] text-white transition ${
                                            creandoPedido ||
                                            !idempotencyKey
                                                ? "cursor-wait bg-[#0b1f43]/50"
                                                : "bg-[#0b1f43] hover:bg-[#158bd2]"
                                        }`}
                                    >
                                        {creandoPedido
                                            ? "Creando pedido..."
                                            : !idempotencyKey
                                              ? "Preparando seguridad..."
                                              : "Preparar pedido"}

                                        <span>
                                            {creandoPedido ||
                                            !idempotencyKey
                                                ? "…"
                                                : "→"}
                                        </span>
                                    </button>

                                    <p className="mt-4 text-center text-[8px] uppercase leading-5 tracking-[0.16em] text-[#0b1f43]/30">
                                        Todavía no se realizará ningún cobro
                                    </p>
                                </aside>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}