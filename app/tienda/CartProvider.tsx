"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

export type CartItem = {
    id: string;
    nombre: string;
    precio: number;
    talla: string;
    cantidad: number;
    imagen: string;
    href: string;

    nombrePersonalizado?: string;
    numeroPersonalizado?: string;
};

export type CheckoutData = {
    nombre: string;
    telefono: string;
    correo: string;
    metodoEntrega: "envio" | "recoger";
    ciudad: string;
    direccion: string;
    puntoRetiro: string;
    notas: string;

    latitud: number | null;
    longitud: number | null;
};

type CartContextType = {
    items: CartItem[];

    totalItems: number;
    totalPrice: number;

    addItem: (item: CartItem) => void;

    removeItem: (
        id: string,
        talla: string,
        nombrePersonalizado?: string,
        numeroPersonalizado?: string
    ) => void;

    updateQuantity: (
        id: string,
        talla: string,
        cantidad: number,
        nombrePersonalizado?: string,
        numeroPersonalizado?: string
    ) => void;

    clearCart: () => void;

    checkoutData: CheckoutData | null;

    saveCheckoutData: (
        data: CheckoutData
    ) => void;

    clearCheckoutData: () => void;
};

const CartContext =
    createContext<CartContextType | undefined>(
        undefined
    );

const CART_STORAGE_KEY =
    "genesis-fc-cart";

const CHECKOUT_STORAGE_KEY =
    "genesis-fc-checkout";

function normalizarNombrePersonalizado(
    valor?: string
) {
    return (valor ?? "")
        .trim()
        .replace(/\s+/g, " ");
}

function normalizarNumeroPersonalizado(
    valor?: string
) {
    return (valor ?? "")
        .trim()
        .replace(/\s+/g, "");
}

function mismaPersonalizacion(
    item: CartItem,
    otroItem: CartItem
) {
    return (
        normalizarNombrePersonalizado(
            item.nombrePersonalizado
        ).toUpperCase() ===
            normalizarNombrePersonalizado(
                otroItem.nombrePersonalizado
            ).toUpperCase() &&
        normalizarNumeroPersonalizado(
            item.numeroPersonalizado
        ) ===
            normalizarNumeroPersonalizado(
                otroItem.numeroPersonalizado
            )
    );
}

function coincideItem(
    item: CartItem,
    id: string,
    talla: string,
    nombrePersonalizado?: string,
    numeroPersonalizado?: string
) {
    return (
        item.id === id &&
        item.talla === talla &&
        normalizarNombrePersonalizado(
            item.nombrePersonalizado
        ).toUpperCase() ===
            normalizarNombrePersonalizado(
                nombrePersonalizado
            ).toUpperCase() &&
        normalizarNumeroPersonalizado(
            item.numeroPersonalizado
        ) ===
            normalizarNumeroPersonalizado(
                numeroPersonalizado
            )
    );
}

function normalizarCartItem(
    item: CartItem
): CartItem {
    const nombrePersonalizado =
        normalizarNombrePersonalizado(
            item.nombrePersonalizado
        );

    const numeroPersonalizado =
        normalizarNumeroPersonalizado(
            item.numeroPersonalizado
        );

    return {
        ...item,

        nombrePersonalizado:
            nombrePersonalizado ||
            undefined,

        numeroPersonalizado:
            numeroPersonalizado ||
            undefined,
    };
}

export function CartProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [items, setItems] =
        useState<CartItem[]>([]);

    const [
        checkoutData,
        setCheckoutData,
    ] = useState<CheckoutData | null>(
        null
    );

    const [loaded, setLoaded] =
        useState(false);

    /* =====================================================
       CARGAR INFORMACIÓN GUARDADA
    ===================================================== */

    useEffect(() => {
        try {
            const savedCart =
                window.localStorage.getItem(
                    CART_STORAGE_KEY
                );

            if (savedCart) {
                const parsedCart =
                    JSON.parse(
                        savedCart
                    ) as CartItem[];

                if (Array.isArray(parsedCart)) {
                    const carritoNormalizado =
                        parsedCart
                            .filter(
                                (item) =>
                                    item &&
                                    typeof item ===
                                        "object"
                            )
                            .map(
                                normalizarCartItem
                            );

                    setItems(
                        carritoNormalizado
                    );
                }
            }

            const savedCheckout =
                window.localStorage.getItem(
                    CHECKOUT_STORAGE_KEY
                );

            if (savedCheckout) {
                const parsedCheckout =
                    JSON.parse(
                        savedCheckout
                    ) as Partial<CheckoutData>;

                if (
                    parsedCheckout &&
                    typeof parsedCheckout ===
                        "object"
                ) {
                    setCheckoutData({
                        nombre:
                            parsedCheckout.nombre ??
                            "",

                        telefono:
                            parsedCheckout.telefono ??
                            "",

                        correo:
                            parsedCheckout.correo ??
                            "",

                        metodoEntrega:
                            parsedCheckout.metodoEntrega ===
                            "recoger"
                                ? "recoger"
                                : "envio",

                        ciudad:
                            parsedCheckout.ciudad ??
                            "La Paz",

                        direccion:
                            parsedCheckout.direccion ??
                            "",

                        puntoRetiro:
                            parsedCheckout.puntoRetiro ??
                            "K9 Store - La Paz",

                        notas:
                            parsedCheckout.notas ??
                            "",

                        latitud:
                            typeof parsedCheckout.latitud ===
                            "number"
                                ? parsedCheckout.latitud
                                : null,

                        longitud:
                            typeof parsedCheckout.longitud ===
                            "number"
                                ? parsedCheckout.longitud
                                : null,
                    });
                }
            }
        } catch (error) {
            console.error(
                "No se pudo cargar la información de la tienda:",
                error
            );

            setItems([]);
            setCheckoutData(null);
        } finally {
            setLoaded(true);
        }
    }, []);

    /* =====================================================
       GUARDAR CARRITO
    ===================================================== */

    useEffect(() => {
        if (!loaded) {
            return;
        }

        try {
            window.localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify(items)
            );
        } catch (error) {
            console.error(
                "No se pudo guardar el carrito:",
                error
            );
        }
    }, [items, loaded]);

    /* =====================================================
       GUARDAR CHECKOUT
    ===================================================== */

    useEffect(() => {
        if (!loaded) {
            return;
        }

        try {
            if (checkoutData) {
                window.localStorage.setItem(
                    CHECKOUT_STORAGE_KEY,
                    JSON.stringify(
                        checkoutData
                    )
                );
            } else {
                window.localStorage.removeItem(
                    CHECKOUT_STORAGE_KEY
                );
            }
        } catch (error) {
            console.error(
                "No se pudieron guardar los datos del checkout:",
                error
            );
        }
    }, [checkoutData, loaded]);

    /* =====================================================
       CARRITO
    ===================================================== */

    const addItem = (
        newItem: CartItem
    ) => {
        const itemNormalizado =
            normalizarCartItem(
                newItem
            );

        setItems((currentItems) => {
            const existingItem =
                currentItems.find(
                    (item) =>
                        item.id ===
                            itemNormalizado.id &&
                        item.talla ===
                            itemNormalizado.talla &&
                        mismaPersonalizacion(
                            item,
                            itemNormalizado
                        )
                );

            if (existingItem) {
                return currentItems.map(
                    (item) => {
                        if (
                            item.id ===
                                itemNormalizado.id &&
                            item.talla ===
                                itemNormalizado.talla &&
                            mismaPersonalizacion(
                                item,
                                itemNormalizado
                            )
                        ) {
                            return {
                                ...item,

                                cantidad:
                                    Math.min(
                                        item.cantidad +
                                            itemNormalizado.cantidad,
                                        10
                                    ),
                            };
                        }

                        return item;
                    }
                );
            }

            return [
                ...currentItems,
                itemNormalizado,
            ];
        });
    };

    const removeItem = (
        id: string,
        talla: string,
        nombrePersonalizado?: string,
        numeroPersonalizado?: string
    ) => {
        setItems(
            (currentItems) =>
                currentItems.filter(
                    (item) =>
                        !coincideItem(
                            item,
                            id,
                            talla,
                            nombrePersonalizado,
                            numeroPersonalizado
                        )
                )
        );
    };

    const updateQuantity = (
        id: string,
        talla: string,
        cantidad: number,
        nombrePersonalizado?: string,
        numeroPersonalizado?: string
    ) => {
        if (cantidad <= 0) {
            removeItem(
                id,
                talla,
                nombrePersonalizado,
                numeroPersonalizado
            );

            return;
        }

        setItems(
            (currentItems) =>
                currentItems.map(
                    (item) => {
                        if (
                            coincideItem(
                                item,
                                id,
                                talla,
                                nombrePersonalizado,
                                numeroPersonalizado
                            )
                        ) {
                            return {
                                ...item,

                                cantidad:
                                    Math.min(
                                        cantidad,
                                        10
                                    ),
                            };
                        }

                        return item;
                    }
                )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    /* =====================================================
       CHECKOUT
    ===================================================== */

    const saveCheckoutData = (
        data: CheckoutData
    ) => {
        const datosNormalizados: CheckoutData =
            {
                ...data,

                latitud:
                    data.metodoEntrega ===
                    "envio"
                        ? data.latitud
                        : null,

                longitud:
                    data.metodoEntrega ===
                    "envio"
                        ? data.longitud
                        : null,
            };

        setCheckoutData(
            datosNormalizados
        );
    };

    const clearCheckoutData =
        () => {
            setCheckoutData(null);
        };

    /* =====================================================
       TOTALES
    ===================================================== */

    const totalItems =
        useMemo(() => {
            return items.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    item.cantidad,
                0
            );
        }, [items]);

    const totalPrice =
        useMemo(() => {
            return items.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    item.precio *
                        item.cantidad,
                0
            );
        }, [items]);

    /* =====================================================
       PROVIDER
    ===================================================== */

    return (
        <CartContext.Provider
            value={{
                items,

                totalItems,
                totalPrice,

                addItem,
                removeItem,
                updateQuantity,
                clearCart,

                checkoutData,
                saveCheckoutData,
                clearCheckoutData,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context =
        useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart debe utilizarse dentro de CartProvider"
        );
    }

    return context;
}