"use client";

import Link from "next/link";
import {
    FormEvent,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    TARIFAS_ENVIO,
    obtenerTarifaEnvio,
} from "../../../lib/tienda/envios";

import { useCart } from "../CartProvider";

type GoogleLocation = {
    lat: () => number;
    lng: () => number;
};

type GooglePlace = {
    formattedAddress?: string;
    location?: GoogleLocation;
    fetchFields: (options: {
        fields: string[];
    }) => Promise<void>;
};

type GooglePlacePrediction = {
    toPlace: () => GooglePlace;
};

type GooglePlaceSelectEvent = Event & {
    placePrediction?: GooglePlacePrediction;
};

type PlaceAutocompleteElementType =
    HTMLElement & {
        includedRegionCodes?: string[];
        placeholder?: string;
    };

type PlaceAutocompleteConstructor =
    new () => PlaceAutocompleteElementType;

type GoogleMapsGlobal = {
    maps: {
        places?: {
            PlaceAutocompleteElement?:
                PlaceAutocompleteConstructor;
        };
    };
};

declare global {
    interface Window {
        google?: GoogleMapsGlobal;
    }
}

const GOOGLE_MAPS_SCRIPT_ID =
    "genesis-fc-google-maps";

function esperarGooglePlaces(
    timeoutMs = 8000
): Promise<void> {
    return new Promise(
        (resolve, reject) => {
            const inicio = Date.now();

            const comprobar = () => {
                if (
                    window.google?.maps
                        ?.places
                        ?.PlaceAutocompleteElement
                ) {
                    resolve();
                    return;
                }

                if (
                    Date.now() - inicio >=
                    timeoutMs
                ) {
                    reject(
                        new Error(
                            "Google Places no terminó de cargar."
                        )
                    );
                    return;
                }

                window.setTimeout(
                    comprobar,
                    100
                );
            };

            comprobar();
        }
    );
}

function cargarGoogleMaps(
    apiKey: string
): Promise<void> {
    return new Promise(
        (resolve, reject) => {
            if (
                window.google?.maps
                    ?.places
                    ?.PlaceAutocompleteElement
            ) {
                resolve();
                return;
            }

            const scriptExistente =
                document.getElementById(
                    GOOGLE_MAPS_SCRIPT_ID
                ) as HTMLScriptElement | null;

            if (scriptExistente) {
                esperarGooglePlaces()
                    .then(resolve)
                    .catch(reject);

                return;
            }

            const script =
                document.createElement(
                    "script"
                );

            script.id =
                GOOGLE_MAPS_SCRIPT_ID;

            script.src =
                `https://maps.googleapis.com/maps/api/js` +
                `?key=${encodeURIComponent(
                    apiKey
                )}` +
                `&libraries=places` +
                `&v=weekly` +
                `&loading=async`;

            script.async = true;
            script.defer = true;

            script.onload = () => {
                esperarGooglePlaces()
                    .then(resolve)
                    .catch(reject);
            };

            script.onerror = () =>
                reject(
                    new Error(
                        "No se pudo cargar Google Maps."
                    )
                );

            document.head.appendChild(
                script
            );
        }
    );
}

export default function CheckoutPage() {
    const {
        items,
        totalItems,
        totalPrice,
        checkoutData,
        saveCheckoutData,
    } = useCart();

    const [nombre, setNombre] =
        useState("");

    const [telefono, setTelefono] =
        useState("");

    const [correo, setCorreo] =
        useState("");

    const [ciudad, setCiudad] =
        useState("La Paz");

    const [direccion, setDireccion] =
        useState("");

    const [
        metodoEntrega,
        setMetodoEntrega,
    ] = useState<
        "envio" | "recoger"
    >("envio");

    const [
        puntoRetiro,
        setPuntoRetiro,
    ] = useState(
        "K9 Store - La Paz"
    );

    const [notas, setNotas] =
        useState("");

    const [revision, setRevision] =
        useState(false);

    const [latitud, setLatitud] =
        useState<number | null>(
            null
        );

    const [longitud, setLongitud] =
        useState<number | null>(
            null
        );

    const [
        mapsCargando,
        setMapsCargando,
    ] = useState(false);

    const [
        mapsDisponible,
        setMapsDisponible,
    ] = useState(false);

    const [
        errorMaps,
        setErrorMaps,
    ] = useState("");

    const autocompleteContainerRef =
        useRef<HTMLDivElement | null>(
            null
        );

    const tarifaSeleccionada =
        metodoEntrega === "envio"
            ? obtenerTarifaEnvio(
                  ciudad
              )
            : null;

    const costoEnvioVisual =
        metodoEntrega === "recoger"
            ? 0
            : tarifaSeleccionada
                    ?.disponible
              ? tarifaSeleccionada.costo
              : null;

    const envioDisponible =
        metodoEntrega === "recoger" ||
        Boolean(
            tarifaSeleccionada
                ?.disponible
        );

    const totalFinal =
        totalPrice +
        (costoEnvioVisual ?? 0);

    /* =====================================================
       CARGAR DATOS GUARDADOS
    ===================================================== */

    useEffect(() => {
        if (!checkoutData) {
            return;
        }

        setNombre(
            checkoutData.nombre
        );

        setTelefono(
            checkoutData.telefono
        );

        setCorreo(
            checkoutData.correo
        );

        setCiudad(
            checkoutData.ciudad
        );

        setDireccion(
            checkoutData.direccion
        );

        setMetodoEntrega(
            checkoutData.metodoEntrega
        );

        setPuntoRetiro(
            checkoutData.puntoRetiro
        );

        setNotas(
            checkoutData.notas
        );

        setLatitud(
            checkoutData.latitud
        );

        setLongitud(
            checkoutData.longitud
        );
    }, [checkoutData]);

    /* =====================================================
       GOOGLE MAPS + PLACES
    ===================================================== */

    useEffect(() => {
        if (
            metodoEntrega !== "envio"
        ) {
            setMapsDisponible(false);
            setMapsCargando(false);
            setErrorMaps("");

            return;
        }

        const apiKey =
            process.env
                .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            setMapsDisponible(false);

            setErrorMaps(
                "Google Maps todavía no está configurado."
            );

            return;
        }

        let cancelado = false;

        let autocomplete:
            | PlaceAutocompleteElementType
            | null = null;

        let manejarSeleccion:
            | ((event: Event) => void)
            | null = null;

        const iniciarAutocomplete =
            async () => {
                try {
                    setMapsCargando(
                        true
                    );

                    setMapsDisponible(
                        false
                    );

                    setErrorMaps("");

                    await cargarGoogleMaps(
                        apiKey
                    );

                    if (
                        cancelado ||
                        !window.google
                    ) {
                        return;
                    }

                    const PlaceAutocompleteElement =
                        window.google.maps
                            .places
                            ?.PlaceAutocompleteElement;

                    if (
                        !PlaceAutocompleteElement
                    ) {
                        throw new Error(
                            "PlaceAutocompleteElement no está disponible."
                        );
                    }

                    if (
                        cancelado ||
                        !autocompleteContainerRef.current
                    ) {
                        return;
                    }

                    autocomplete =
                        new PlaceAutocompleteElement();

                    autocomplete.placeholder =
                        "Busca tu dirección de entrega";

                    autocomplete.includedRegionCodes =
                        ["hn"];

                    autocomplete.className =
                        "block w-full";

                    manejarSeleccion =
                        async (
                            event: Event
                        ) => {
                            const evento =
                                event as GooglePlaceSelectEvent;

                            const prediction =
                                evento.placePrediction;

                            if (
                                !prediction
                            ) {
                                return;
                            }

                            try {
                                const place =
                                    prediction.toPlace();

                                await place.fetchFields(
                                    {
                                        fields: [
                                            "formattedAddress",
                                            "location",
                                        ],
                                    }
                                );

                                if (
                                    place.formattedAddress
                                ) {
                                    setDireccion(
                                        place.formattedAddress
                                    );
                                }

                                if (
                                    place.location
                                ) {
                                    setLatitud(
                                        place.location.lat()
                                    );

                                    setLongitud(
                                        place.location.lng()
                                    );
                                } else {
                                    setLatitud(
                                        null
                                    );

                                    setLongitud(
                                        null
                                    );
                                }

                                setErrorMaps(
                                    ""
                                );
                            } catch (
                                error
                            ) {
                                console.error(
                                    "No se pudo obtener la ubicación seleccionada:",
                                    error
                                );

                                setLatitud(
                                    null
                                );

                                setLongitud(
                                    null
                                );

                                setErrorMaps(
                                    "No se pudo obtener la ubicación exacta. Puedes escribir la dirección manualmente."
                                );
                            }
                        };

                    autocomplete.addEventListener(
                        "gmp-select",
                        manejarSeleccion
                    );

                    /*
                     * IMPORTANTE:
                     * React NO tiene hijos dentro de
                     * autocompleteContainerRef.
                     *
                     * Google es el único que agrega
                     * contenido dentro del contenedor.
                     * Esto evita el error removeChild.
                     */

                    autocompleteContainerRef.current.appendChild(
                        autocomplete
                    );

                    if (!cancelado) {
                        setMapsDisponible(
                            true
                        );
                    }
                } catch (error) {
                    console.error(
                        "Error cargando Google Maps:",
                        error
                    );

                    if (!cancelado) {
                        setMapsDisponible(
                            false
                        );

                        setErrorMaps(
                            "No se pudo cargar el buscador de Google Maps. Puedes continuar escribiendo la dirección manualmente."
                        );
                    }
                } finally {
                    if (!cancelado) {
                        setMapsCargando(
                            false
                        );
                    }
                }
            };

        iniciarAutocomplete();

        return () => {
            cancelado = true;

            if (
                autocomplete &&
                manejarSeleccion
            ) {
                autocomplete.removeEventListener(
                    "gmp-select",
                    manejarSeleccion
                );
            }

            /*
             * Google controla este elemento.
             * Lo retiramos nosotros mismos
             * antes de que React destruya
             * el contenedor.
             */

            if (
                autocomplete &&
                autocomplete.parentNode
            ) {
                autocomplete.remove();
            }
        };
    }, [metodoEntrega]);

    /* =====================================================
       GUARDAR CHECKOUT
    ===================================================== */

    const guardarDatos = () => {
        saveCheckoutData({
            nombre,
            telefono,
            correo,
            metodoEntrega,
            ciudad,
            direccion,
            puntoRetiro,
            notas,

            latitud:
                metodoEntrega ===
                "envio"
                    ? latitud
                    : null,

            longitud:
                metodoEntrega ===
                "envio"
                    ? longitud
                    : null,
        });
    };

    const manejarSubmit = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (
            items.length === 0
        ) {
            return;
        }

        guardarDatos();

        setRevision(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const volverAEditar = () => {
        setRevision(false);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const seleccionarEnvio =
        () => {
            setMetodoEntrega(
                "envio"
            );
        };

    const seleccionarRecoger =
        () => {
            setMetodoEntrega(
                "recoger"
            );

            setLatitud(null);
            setLongitud(null);
        };

    const cambiarCiudad = (
        nuevaCiudad: string
    ) => {
        setCiudad(
            nuevaCiudad
        );

        setLatitud(null);
        setLongitud(null);
    };

    const cambiarDireccionManual =
        (
            nuevaDireccion: string
        ) => {
            setDireccion(
                nuevaDireccion
            );

            setLatitud(null);
            setLongitud(null);
        };

    return (
        <main className="min-h-screen bg-[#f7f7f5] text-[#0b1f43]">
            {/* =================================================
                CABECERA
            ================================================= */}

            <section className="border-b border-[#0b1f43]/10 bg-white">
                <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-5 py-5 sm:px-8 lg:px-10">
                    <Link
                        href="/tienda/carrito"
                        className="group inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.24em] text-[#0b1f43]/55 transition hover:text-[#158bd2]"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">
                            ←
                        </span>

                        Volver al carrito
                    </Link>

                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-[0.24em]">
                            Génesis FC
                        </p>

                        <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-[#0b1f43]/35">
                            Checkout
                        </p>
                    </div>
                </div>
            </section>

            {/* =================================================
                PASOS
            ================================================= */}

            <section className="border-b border-[#0b1f43]/10 bg-white">
                <div className="mx-auto flex max-w-[1500px] items-center gap-4 overflow-x-auto px-5 py-4 sm:px-8 lg:px-10">
                    <div className="flex items-center gap-3">
                        <span
                            className={`flex h-7 w-7 flex-none items-center justify-center text-[9px] font-black ${
                                revision
                                    ? "bg-[#158bd2] text-white"
                                    : "bg-[#0b1f43] text-white"
                            }`}
                        >
                            {revision
                                ? "✓"
                                : "1"}
                        </span>

                        <span
                            className={`whitespace-nowrap text-[8px] font-black uppercase tracking-[0.22em] ${
                                revision
                                    ? "text-[#0b1f43]/40"
                                    : "text-[#0b1f43]"
                            }`}
                        >
                            Datos
                        </span>
                    </div>

                    <div className="h-px w-10 flex-none bg-[#0b1f43]/15" />

                    <div className="flex items-center gap-3">
                        <span
                            className={`flex h-7 w-7 flex-none items-center justify-center text-[9px] font-black ${
                                revision
                                    ? "bg-[#0b1f43] text-white"
                                    : "bg-[#0b1f43]/10 text-[#0b1f43]/40"
                            }`}
                        >
                            2
                        </span>

                        <span
                            className={`whitespace-nowrap text-[8px] font-black uppercase tracking-[0.22em] ${
                                revision
                                    ? "text-[#0b1f43]"
                                    : "text-[#0b1f43]/35"
                            }`}
                        >
                            Revisión
                        </span>
                    </div>

                    <div className="h-px w-10 flex-none bg-[#0b1f43]/15" />

                    <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 flex-none items-center justify-center bg-[#0b1f43]/10 text-[9px] font-black text-[#0b1f43]/40">
                            3
                        </span>

                        <span className="whitespace-nowrap text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                            Pago
                        </span>
                    </div>
                </div>
            </section>

            {/* =================================================
                CONTENIDO
            ================================================= */}

            <section className="px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
                <div className="mx-auto max-w-[1500px]">
                    {items.length ===
                    0 ? (
                        <div className="bg-white px-7 py-20 text-center">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                No hay productos
                            </p>

                            <h1 className="mt-5 text-4xl font-black uppercase tracking-[-0.04em] sm:text-5xl">
                                Tu carrito está
                                vacío.
                            </h1>

                            <Link
                                href="/tienda"
                                className="mt-8 inline-flex items-center gap-4 bg-[#0b1f43] px-7 py-5 text-[9px] font-black uppercase tracking-[0.22em] text-white transition hover:bg-[#158bd2]"
                            >
                                Ir a la tienda

                                <span>
                                    →
                                </span>
                            </Link>
                        </div>
                    ) : revision ? (
                        /* =====================================
                           REVISIÓN
                        ===================================== */

                        <div>
                            <div className="mb-12 border-b border-[#0b1f43]/10 pb-8">
                                <p className="text-[9px] font-black uppercase tracking-[0.32em] text-[#158bd2]">
                                    Paso 02 ·
                                    Revisión
                                </p>

                                <h1 className="mt-4 text-5xl font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                                    Revisa

                                    <span className="block text-[#158bd2]">
                                        tu pedido.
                                    </span>
                                </h1>
                            </div>

                            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                                <div className="space-y-6">
                                    <section className="bg-white p-7 sm:p-9 lg:p-10">
                                        <div className="flex items-center justify-between gap-5">
                                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                                Datos del
                                                cliente
                                            </p>

                                            <button
                                                type="button"
                                                onClick={
                                                    volverAEditar
                                                }
                                                className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/40 transition hover:text-[#158bd2]"
                                            >
                                                Editar
                                            </button>
                                        </div>

                                        <div className="mt-8 divide-y divide-[#0b1f43]/10 border-y border-[#0b1f43]/10">
                                            <div className="grid gap-3 py-5 sm:grid-cols-[160px_1fr]">
                                                <span className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                                    Nombre
                                                </span>

                                                <span className="text-sm font-black">
                                                    {
                                                        nombre
                                                    }
                                                </span>
                                            </div>

                                            <div className="grid gap-3 py-5 sm:grid-cols-[160px_1fr]">
                                                <span className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                                    Teléfono
                                                </span>

                                                <span className="text-sm font-black">
                                                    {
                                                        telefono
                                                    }
                                                </span>
                                            </div>

                                            <div className="grid gap-3 py-5 sm:grid-cols-[160px_1fr]">
                                                <span className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                                    Correo
                                                </span>

                                                <span className="break-all text-sm font-black">
                                                    {
                                                        correo
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="bg-white p-7 sm:p-9 lg:p-10">
                                        <div className="flex items-center justify-between gap-5">
                                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                                Entrega
                                            </p>

                                            <button
                                                type="button"
                                                onClick={
                                                    volverAEditar
                                                }
                                                className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/40 transition hover:text-[#158bd2]"
                                            >
                                                Editar
                                            </button>
                                        </div>

                                        <div className="mt-8 divide-y divide-[#0b1f43]/10 border-y border-[#0b1f43]/10">
                                            <div className="grid gap-3 py-5 sm:grid-cols-[160px_1fr]">
                                                <span className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                                    Método
                                                </span>

                                                <span className="text-sm font-black uppercase">
                                                    {metodoEntrega ===
                                                    "envio"
                                                        ? "Envío a domicilio"
                                                        : "Recoger en tienda"}
                                                </span>
                                            </div>

                                            {metodoEntrega ===
                                            "envio" ? (
                                                <>
                                                    <div className="grid gap-3 py-5 sm:grid-cols-[160px_1fr]">
                                                        <span className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                                            Ciudad
                                                        </span>

                                                        <span className="text-sm font-black">
                                                            {
                                                                ciudad
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="grid gap-3 py-5 sm:grid-cols-[160px_1fr]">
                                                        <span className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                                            Dirección
                                                        </span>

                                                        <span className="text-sm font-black leading-6">
                                                            {
                                                                direccion
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="grid gap-3 py-5 sm:grid-cols-[160px_1fr]">
                                                        <span className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                                            Ubicación
                                                        </span>

                                                        <span className="text-sm font-black">
                                                            {latitud !==
                                                                null &&
                                                            longitud !==
                                                                null
                                                                ? "Ubicación confirmada con Google Maps"
                                                                : "Dirección ingresada manualmente"}
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="grid gap-3 py-5 sm:grid-cols-[160px_1fr]">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                                        Punto de
                                                        retiro
                                                    </span>

                                                    <span className="text-sm font-black">
                                                        {
                                                            puntoRetiro
                                                        }
                                                    </span>
                                                </div>
                                            )}

                                            {notas.trim() !==
                                                "" && (
                                                <div className="grid gap-3 py-5 sm:grid-cols-[160px_1fr]">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                                        Notas
                                                    </span>

                                                    <span className="text-sm leading-6 text-[#0b1f43]/70">
                                                        {
                                                            notas
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                </div>

                                <aside className="h-fit bg-[#0b1f43] p-7 text-white sm:p-9 lg:sticky lg:top-6">
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5cc8ff]">
                                        Resumen final
                                    </p>

                                    <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.04em]">
                                        Tu pedido
                                    </h2>

                                    <div className="mt-8 divide-y divide-white/15 border-y border-white/15">
                                        {items.map(
                                            (
                                                item
                                            ) => (
                                                <div
                                                    key={`${item.id}-${item.talla}`}
                                                    className="py-5"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-[0.1em]">
                                                                {
                                                                    item.nombre
                                                                }
                                                            </p>

                                                            <p className="mt-2 text-[8px] uppercase tracking-[0.16em] text-white/40">
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

                                    <div className="mt-7 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                                                Productos
                                            </span>

                                            <span className="text-sm font-black">
                                                {
                                                    totalItems
                                                }
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                                                Subtotal
                                            </span>

                                            <span className="text-sm font-black">
                                                L{" "}
                                                {totalPrice.toLocaleString(
                                                    "en-US"
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                                                Entrega
                                            </span>

                                            <span className="text-right text-[9px] font-black uppercase tracking-[0.14em]">
                                                {metodoEntrega ===
                                                "recoger"
                                                    ? "Sin costo"
                                                    : costoEnvioVisual !==
                                                        null
                                                      ? `L ${costoEnvioVisual.toLocaleString(
                                                            "en-US"
                                                        )}`
                                                      : "Por confirmar"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-8 border-t border-white/15 pt-7">
                                        <p className="text-[8px] font-black uppercase tracking-[0.24em] text-white/40">
                                            Total provisional
                                        </p>

                                        <p className="mt-2 text-4xl font-black">
                                            L{" "}
                                            {totalFinal.toLocaleString(
                                                "en-US"
                                            )}
                                        </p>
                                    </div>

                                    <Link
                                        href="/tienda/pago"
                                        onClick={
                                            guardarDatos
                                        }
                                        className="mt-9 flex w-full items-center justify-between bg-white px-6 py-5 text-[9px] font-black uppercase tracking-[0.22em] text-[#0b1f43] transition duration-300 hover:bg-[#5cc8ff]"
                                    >
                                        Continuar al pago

                                        <span>
                                            →
                                        </span>
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={
                                            volverAEditar
                                        }
                                        className="mt-7 w-full border-t border-white/15 pt-6 text-center text-[8px] font-black uppercase tracking-[0.22em] text-white/45 transition hover:text-white"
                                    >
                                        Editar información
                                    </button>
                                </aside>
                            </div>
                        </div>
                    ) : (
                        /* =====================================
                           FORMULARIO
                        ===================================== */

                        <div>
                            <div className="mb-12 border-b border-[#0b1f43]/10 pb-8">
                                <p className="text-[9px] font-black uppercase tracking-[0.32em] text-[#158bd2]">
                                    Paso 01 ·
                                    Finalizar compra
                                </p>

                                <h1 className="mt-4 text-5xl font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                                    Datos de

                                    <span className="block text-[#158bd2]">
                                        tu pedido.
                                    </span>
                                </h1>
                            </div>

                            <form
                                onSubmit={
                                    manejarSubmit
                                }
                                className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]"
                            >
                                <div className="space-y-6">
                                    <section className="bg-white p-7 sm:p-9 lg:p-10">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                            01 · Contacto
                                        </p>

                                        <div className="mt-8 grid gap-6 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-3 block text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/45">
                                                    Nombre completo
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        nombre
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setNombre(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    required
                                                    className="w-full border border-[#0b1f43]/15 px-4 py-4 text-sm outline-none focus:border-[#158bd2]"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-3 block text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/45">
                                                    Teléfono
                                                </label>

                                                <input
                                                    type="tel"
                                                    value={
                                                        telefono
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setTelefono(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    required
                                                    className="w-full border border-[#0b1f43]/15 px-4 py-4 text-sm outline-none focus:border-[#158bd2]"
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className="mb-3 block text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/45">
                                                    Correo electrónico
                                                </label>

                                                <input
                                                    type="email"
                                                    value={
                                                        correo
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setCorreo(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    required
                                                    className="w-full border border-[#0b1f43]/15 px-4 py-4 text-sm outline-none focus:border-[#158bd2]"
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    <section className="bg-white p-7 sm:p-9 lg:p-10">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                            02 · Entrega
                                        </p>

                                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                            <button
                                                type="button"
                                                onClick={
                                                    seleccionarEnvio
                                                }
                                                className={`border px-5 py-5 text-left ${
                                                    metodoEntrega ===
                                                    "envio"
                                                        ? "border-[#0b1f43] bg-[#0b1f43] text-white"
                                                        : "border-[#0b1f43]/15 bg-white"
                                                }`}
                                            >
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em]">
                                                    Envío
                                                </p>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={
                                                    seleccionarRecoger
                                                }
                                                className={`border px-5 py-5 text-left ${
                                                    metodoEntrega ===
                                                    "recoger"
                                                        ? "border-[#0b1f43] bg-[#0b1f43] text-white"
                                                        : "border-[#0b1f43]/15 bg-white"
                                                }`}
                                            >
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em]">
                                                    Recoger
                                                </p>
                                            </button>
                                        </div>

                                        <div className="mt-8 grid gap-6">
                                            {metodoEntrega ===
                                            "envio" ? (
                                                <>
                                                    <div>
                                                        <label className="mb-3 block text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/45">
                                                            Ciudad de entrega
                                                        </label>

                                                        <select
                                                            value={
                                                                ciudad
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                cambiarCiudad(
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full border border-[#0b1f43]/15 px-4 py-4 text-sm outline-none focus:border-[#158bd2]"
                                                        >
                                                            {TARIFAS_ENVIO.map(
                                                                (
                                                                    tarifa
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            tarifa.ciudad
                                                                        }
                                                                        value={
                                                                            tarifa.ciudad
                                                                        }
                                                                    >
                                                                        {
                                                                            tarifa.ciudad
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>

                                                    <div className="border border-[#158bd2]/20 bg-[#edf8ff] p-4">
                                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#158bd2]">
                                                            Tarifa de envío
                                                        </p>

                                                        <p className="mt-2 text-xs leading-6 text-[#0b1f43]/55">
                                                            {envioDisponible &&
                                                            costoEnvioVisual !==
                                                                null
                                                                ? `Envío configurado: L ${costoEnvioVisual.toLocaleString(
                                                                      "en-US"
                                                                  )}`
                                                                : "La tarifa para esta ciudad está pendiente de confirmación."}
                                                        </p>
                                                    </div>

                                                    {/* GOOGLE MAPS */}

                                                    <div>
                                                        <label className="mb-3 block text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/45">
                                                            Buscar dirección con Google Maps
                                                        </label>

                                                        {mapsCargando && (
                                                            <div className="mb-3 border border-[#0b1f43]/10 bg-[#f7f7f5] px-4 py-3">
                                                                <p className="text-xs text-[#0b1f43]/45">
                                                                    Cargando Google Maps...
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/*
                                                            ESTE DIV SIEMPRE ESTÁ
                                                            VACÍO PARA REACT.

                                                            GOOGLE ES EL ÚNICO
                                                            QUE INSERTA EL
                                                            AUTOCOMPLETE AQUÍ.
                                                        */}

                                                        <div
                                                            ref={
                                                                autocompleteContainerRef
                                                            }
                                                            className="min-h-[58px] border border-[#0b1f43]/15 bg-white p-2"
                                                        />

                                                        {mapsDisponible && (
                                                            <p className="mt-3 text-[8px] font-black uppercase tracking-[0.16em] text-[#158bd2]">
                                                                ✓ Google Maps activo
                                                            </p>
                                                        )}

                                                        {errorMaps && (
                                                            <p className="mt-3 text-xs leading-5 text-red-600">
                                                                {
                                                                    errorMaps
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="mb-3 block text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/45">
                                                            Dirección de entrega
                                                        </label>

                                                        <textarea
                                                            value={
                                                                direccion
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                cambiarDireccionManual(
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            required
                                                            rows={
                                                                4
                                                            }
                                                            placeholder="Selecciona una dirección con Google Maps o escríbela manualmente"
                                                            className="w-full resize-none border border-[#0b1f43]/15 px-4 py-4 text-sm outline-none focus:border-[#158bd2]"
                                                        />

                                                        <div className="mt-3">
                                                            {latitud !==
                                                                null &&
                                                            longitud !==
                                                                null ? (
                                                                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-green-700">
                                                                    ✓ Ubicación exacta confirmada
                                                                </p>
                                                            ) : (
                                                                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#0b1f43]/35">
                                                                    Ubicación exacta pendiente
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div>
                                                    <label className="mb-3 block text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/45">
                                                        Punto de retiro
                                                    </label>

                                                    <select
                                                        value={
                                                            puntoRetiro
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            setPuntoRetiro(
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        className="w-full border border-[#0b1f43]/15 px-4 py-4 text-sm outline-none focus:border-[#158bd2]"
                                                    >
                                                        <option value="K9 Store - La Paz">
                                                            K9 Store — La Paz
                                                        </option>

                                                        <option value="Suutuk - Tegucigalpa">
                                                            Suutuk — Tegucigalpa
                                                        </option>
                                                    </select>

                                                    <div className="mt-4 border border-[#0b1f43]/10 bg-[#f7f7f5] p-4">
                                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0b1f43]/40">
                                                            Retiro sin costo
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <label className="mb-3 block text-[8px] font-black uppercase tracking-[0.22em] text-[#0b1f43]/45">
                                                    Notas del pedido
                                                </label>

                                                <textarea
                                                    value={
                                                        notas
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setNotas(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    rows={
                                                        3
                                                    }
                                                    placeholder="Notas del pedido (opcional)"
                                                    className="w-full resize-none border border-[#0b1f43]/15 px-4 py-4 text-sm outline-none focus:border-[#158bd2]"
                                                />
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <aside className="h-fit bg-white p-7 sm:p-9 lg:sticky lg:top-6">
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                        Resumen
                                    </p>

                                    <h2 className="mt-4 text-3xl font-black uppercase">
                                        Tu pedido
                                    </h2>

                                    <div className="mt-8 divide-y divide-[#0b1f43]/10 border-y border-[#0b1f43]/10">
                                        {items.map(
                                            (
                                                item
                                            ) => (
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

                                                            <p className="mt-2 text-[9px] uppercase text-[#0b1f43]/40">
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

                                                        <p className="text-sm font-black">
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

                                    <div className="mt-7 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#0b1f43]/40">
                                                Productos
                                            </span>

                                            <span className="text-sm font-black">
                                                {
                                                    totalItems
                                                }
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#0b1f43]/40">
                                                Entrega
                                            </span>

                                            <span className="text-right text-[9px] font-black uppercase tracking-[0.14em]">
                                                {metodoEntrega ===
                                                "recoger"
                                                    ? "Sin costo"
                                                    : costoEnvioVisual !==
                                                        null
                                                      ? `L ${costoEnvioVisual.toLocaleString(
                                                            "en-US"
                                                        )}`
                                                      : "Por confirmar"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-7 border-t border-[#0b1f43]/10 pt-7">
                                        <p className="text-[8px] font-black uppercase tracking-[0.24em] text-[#0b1f43]/35">
                                            Total provisional
                                        </p>

                                        <p className="mt-2 text-3xl font-black">
                                            L{" "}
                                            {totalFinal.toLocaleString(
                                                "en-US"
                                            )}
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="mt-8 flex w-full items-center justify-between bg-[#0b1f43] px-6 py-5 text-[9px] font-black uppercase tracking-[0.22em] text-white transition hover:bg-[#158bd2]"
                                    >
                                        Revisar pedido

                                        <span>
                                            →
                                        </span>
                                    </button>
                                </aside>
                            </form>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}