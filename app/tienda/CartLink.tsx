"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartLink() {
    const { totalItems } = useCart();

    return (
        <Link
            href="/tienda/carrito"
            className="group inline-flex items-center gap-3 border border-[#0b1f43]/10 bg-white px-4 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43] transition hover:border-[#0b1f43]"
            aria-label={`Ver carrito con ${totalItems} productos`}
        >
            <span>Carrito</span>

            <span className="flex h-6 min-w-6 items-center justify-center bg-[#0b1f43] px-1 text-[8px] text-white transition group-hover:bg-[#158bd2]">
                {totalItems}
            </span>
        </Link>
    );
}