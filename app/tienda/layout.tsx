import { ReactNode } from "react";
import { CartProvider } from "./CartProvider";

export default function TiendaLayout({
    children,
}: {
    children: ReactNode;
}) {
    return <CartProvider>{children}</CartProvider>;
}