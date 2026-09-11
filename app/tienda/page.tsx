import Image from "next/image";
import Link from "next/link";
import CartLink from "./CartLink";

export default function TiendaPage() {
    return (
        <main className="overflow-hidden bg-[#f7f7f5] text-[#0b1f43]">
            {/* HERO EDITORIAL */}
            <section className="bg-[#f7f7f5] px-5 pb-10 pt-5 sm:px-8 lg:px-10">
                <div className="mx-auto max-w-[1600px]">
                    <div className="grid overflow-hidden bg-white lg:grid-cols-[0.82fr_1.18fr]">
                        {/* TEXTO */}
                        <div className="flex min-h-[760px] flex-col justify-between px-7 py-10 sm:px-10 sm:py-12 lg:min-h-[820px] lg:px-14 lg:py-16 xl:px-20">
                            {/* CABECERA INTERNA */}
                            <div className="flex items-start justify-between gap-5">
                                <div className="flex items-center gap-4">
                                    <Image
                                        src="/genesis.jpg"
                                        alt="Escudo oficial de Génesis FC"
                                        width={52}
                                        height={52}
                                        priority
                                        className="h-11 w-11 rounded-full object-cover"
                                    />

                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#0b1f43]">
                                            Génesis FC
                                        </p>

                                        <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-[#0b1f43]/40">
                                            Official Store
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    <CartLink />

                                    <span className="hidden text-[8px] font-bold uppercase tracking-[0.24em] text-[#0b1f43]/30 sm:block">
                                        Honduras
                                    </span>
                                </div>
                            </div>

                            <div className="py-16 lg:py-20">
                                <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.34em] text-[#158bd2]">
                                    Nueva colección
                                </p>

                                <h1 className="max-w-3xl text-[54px] font-black uppercase leading-[0.86] tracking-[-0.06em] text-[#0b1f43] sm:text-[72px] lg:text-[78px] xl:text-[96px]">
                                    Viste
                                    <span className="block text-[#158bd2]">
                                        nuestros
                                    </span>
                                    colores.
                                </h1>

                                <p className="mt-8 max-w-lg text-sm leading-7 text-[#0b1f43]/55 sm:text-base">
                                    Una colección creada para llevar la identidad
                                    de Génesis FC más allá de la cancha.
                                </p>

                                <div className="mt-10 flex flex-wrap gap-3">
                                    <a
                                        href="#coleccion"
                                        className="inline-flex items-center gap-4 bg-[#0b1f43] px-7 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-[#158bd2]"
                                    >
                                        Ver colección
                                        <span>→</span>
                                    </a>

                                    <a
                                        href="#comprar"
                                        className="inline-flex items-center border border-[#0b1f43]/15 bg-white px-7 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#0b1f43] transition duration-300 hover:border-[#0b1f43]"
                                    >
                                        Dónde comprar
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-end justify-between border-t border-[#0b1f43]/10 pt-6">
                                <p className="max-w-xs text-[10px] uppercase leading-5 tracking-[0.16em] text-[#0b1f43]/35">
                                    Indumentaria oficial · Génesis FC
                                </p>

                                <span className="text-xl text-[#0b1f43]/25">
                                    ↓
                                </span>
                            </div>
                        </div>

                        {/* FOTO HERO */}
                        <div className="relative min-h-[620px] overflow-hidden bg-white lg:min-h-[820px]">
                            <Image
                                src="/tienda-coleccion.jpg"
                                alt="Colección oficial de Génesis FC"
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                className="object-contain object-center"
                            />

                            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />

                            <div className="absolute bottom-6 left-6 z-10 bg-white/95 px-5 py-4 shadow-sm sm:bottom-8 sm:left-8">
                                <p className="text-[9px] font-black uppercase tracking-[0.26em] text-[#158bd2]">
                                    Génesis FC
                                </p>

                                <p className="mt-1 text-sm font-black uppercase tracking-tight text-[#0b1f43]">
                                    Colección oficial
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BANDA */}
            <section className="border-y border-[#0b1f43]/10 bg-white">
                <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 py-5 text-[9px] font-black uppercase tracking-[0.28em] text-[#0b1f43]/45 sm:justify-between">
                    <span>Génesis FC</span>
                    <span>Official Kit</span>
                    <span>Honduras K9</span>
                    <span>2026</span>
                </div>
            </section>

            {/* INTRO COLECCIÓN */}
            <section
                id="coleccion"
                className="bg-[#f7f7f5] px-5 pb-14 pt-20 sm:px-8 lg:px-10 lg:pb-16 lg:pt-28"
            >
                <div className="mx-auto max-w-[1600px]">
                    <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
                        <div>
                            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                Colección 2026
                            </p>

                            <h2 className="text-5xl font-black uppercase leading-[0.88] tracking-[-0.05em] text-[#0b1f43] sm:text-6xl lg:text-7xl">
                                Elige
                                <span className="block text-[#158bd2]">
                                    tus colores.
                                </span>
                            </h2>
                        </div>

                        <p className="max-w-md text-sm leading-7 text-[#0b1f43]/50 lg:justify-self-end">
                            Los jerseys oficiales de Génesis FC. Diseñados para
                            representar al club dentro y fuera de la cancha.
                        </p>
                    </div>
                </div>
            </section>

            {/* JERSEY BLANCO */}
            <section className="bg-[#f7f7f5] px-5 pb-14 sm:px-8 lg:px-10 lg:pb-20">
                <div className="mx-auto max-w-[1600px]">
                    <div className="grid overflow-hidden bg-white lg:grid-cols-[1.18fr_0.82fr]">
                        <Link
                            href="/tienda/jersey-blanco"
                            className="group relative min-h-[650px] overflow-hidden bg-[#e8edf2] lg:min-h-[820px]"
                        >
                            <Image
                                src="/tienda-hero.jpg"
                                alt="Modelo usando el uniforme alternativo de Génesis FC"
                                fill
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                className="object-cover object-top transition duration-700 group-hover:scale-[1.015]"
                            />

                            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/20 to-transparent" />

                            <div className="absolute left-5 top-5 bg-white px-4 py-3 sm:left-7 sm:top-7">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0b1f43]">
                                    Uniforme Alternativo
                                </p>
                            </div>
                        </Link>

                        <div className="flex flex-col justify-between px-7 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14 xl:px-16">
                            <div>
                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                        Génesis FC
                                    </p>

                                    <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                        Alternativa
                                    </span>
                                </div>

                                <h3 className="mt-12 text-5xl font-black uppercase leading-[0.88] tracking-[-0.055em] text-[#0b1f43] sm:text-6xl">
                                    Jersey
                                    <span className="block text-[#158bd2]">
                                        Blanco
                                    </span>
                                </h3>

                                <p className="mt-5 text-2xl font-black">
                                    L 1,300
                                </p>

                                <p className="mt-8 max-w-md text-sm leading-7 text-[#0b1f43]/50">
                                    Base blanca, líneas verticales azules y
                                    detalles contrastantes en cuello y mangas.
                                    Una versión elegante de la identidad de
                                    Génesis FC.
                                </p>

                                <div className="mt-12 border-y border-[#0b1f43]/10">
                                    <div className="grid grid-cols-2 border-b border-[#0b1f43]/10 py-5">
                                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0b1f43]/35">
                                            Color
                                        </p>

                                        <p className="text-right text-[11px] font-black uppercase tracking-[0.08em]">
                                            Blanco / Azul
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 border-b border-[#0b1f43]/10 py-5">
                                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0b1f43]/35">
                                            Tallas
                                        </p>

                                        <p className="text-right text-[11px] font-black uppercase tracking-[0.08em]">
                                            S — 2XL
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 py-5">
                                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0b1f43]/35">
                                            Tipo
                                        </p>

                                        <p className="text-right text-[11px] font-black uppercase tracking-[0.08em]">
                                            Alternativo
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-14">
                                <Link
                                    href="/tienda/jersey-blanco"
                                    className="group inline-flex w-full items-center justify-between bg-[#0b1f43] px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-[#158bd2]"
                                >
                                    Ver producto

                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* JERSEY AZUL */}
            <section className="bg-[#f7f7f5] px-5 pb-14 sm:px-8 lg:px-10 lg:pb-20">
                <div className="mx-auto max-w-[1600px]">
                    <div className="grid overflow-hidden bg-white lg:grid-cols-[0.82fr_1.18fr]">
                        <div className="order-2 flex flex-col justify-between px-7 py-10 sm:px-10 sm:py-12 lg:order-1 lg:px-12 lg:py-14 xl:px-16">
                            <div>
                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                        Génesis FC
                                    </p>

                                    <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                        Local
                                    </span>
                                </div>

                                <h3 className="mt-12 text-5xl font-black uppercase leading-[0.88] tracking-[-0.055em] text-[#0b1f43] sm:text-6xl">
                                    Jersey
                                    <span className="block text-[#158bd2]">
                                        Azul
                                    </span>
                                </h3>

                                <p className="mt-5 text-2xl font-black">
                                    L 1,300
                                </p>

                                <p className="mt-8 max-w-md text-sm leading-7 text-[#0b1f43]/50">
                                    El uniforme local de Génesis FC. Azul como
                                    protagonista, detalles oficiales del club y
                                    una identidad creada para representar
                                    nuestros colores.
                                </p>

                                <div className="mt-12 border-y border-[#0b1f43]/10">
                                    <div className="grid grid-cols-2 border-b border-[#0b1f43]/10 py-5">
                                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0b1f43]/35">
                                            Color
                                        </p>

                                        <p className="text-right text-[11px] font-black uppercase tracking-[0.08em]">
                                            Azul
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 border-b border-[#0b1f43]/10 py-5">
                                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0b1f43]/35">
                                            Tallas
                                        </p>

                                        <p className="text-right text-[11px] font-black uppercase tracking-[0.08em]">
                                            S — 2XL
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 py-5">
                                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0b1f43]/35">
                                            Tipo
                                        </p>

                                        <p className="text-right text-[11px] font-black uppercase tracking-[0.08em]">
                                            Local
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-14">
                                <Link
                                    href="/tienda/jersey-azul"
                                    className="group inline-flex w-full items-center justify-between bg-[#0b1f43] px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-[#158bd2]"
                                >
                                    Ver producto

                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </Link>
                            </div>
                        </div>

                        <Link
                            href="/tienda/jersey-azul"
                            className="group relative order-1 min-h-[650px] overflow-hidden bg-[#dbeaf3] lg:order-2 lg:min-h-[820px]"
                        >
                            <Image
                                src="/jersey-azul-principal.png"
                                alt="Uniforme local azul de Génesis FC"
                                fill
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                className="object-cover object-top transition duration-700 group-hover:scale-[1.015]"
                            />

                            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#071d49]/30 to-transparent" />

                            <div className="absolute right-5 top-5 bg-white px-4 py-3 sm:right-7 sm:top-7">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0b1f43]">
                                    Home Kit
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* JERSEY VISITANTE */}
            <section className="bg-[#f7f7f5] px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
                <div className="mx-auto max-w-[1600px]">
                    <div className="grid overflow-hidden bg-white lg:grid-cols-[1.18fr_0.82fr]">
                        <Link
                            href="/tienda/jersey-visitante"
                            className="group relative min-h-[650px] overflow-hidden bg-[#edf2f5] lg:min-h-[820px]"
                        >
                            <Image
                                src="/jersey-visitante-portada.png"
                                alt="Modelo usando el uniforme visitante de Génesis FC"
                                fill
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                className="object-cover object-center transition duration-700 group-hover:scale-[1.015]"
                            />

                            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#071d49]/25 to-transparent" />

                            <div className="absolute left-5 top-5 bg-white px-4 py-3 sm:left-7 sm:top-7">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0b1f43]">
                                    Away Kit
                                </p>
                            </div>
                        </Link>

                        <div className="flex flex-col justify-between px-7 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14 xl:px-16">
                            <div>
                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                        Génesis FC
                                    </p>

                                    <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#0b1f43]/35">
                                        Visitante
                                    </span>
                                </div>

                                <h3 className="mt-12 text-5xl font-black uppercase leading-[0.88] tracking-[-0.055em] text-[#0b1f43] sm:text-6xl">
                                    Jersey
                                    <span className="block text-[#158bd2]">
                                        Visitante
                                    </span>
                                </h3>

                                <p className="mt-5 text-2xl font-black">
                                    L 1,300
                                </p>

                                <p className="mt-8 max-w-md text-sm leading-7 text-[#0b1f43]/50">
                                    El uniforme visitante oficial de Génesis FC.
                                    Una propuesta diseñada para mantener nuestra
                                    identidad en cada cancha y en cada ciudad.
                                </p>

                                <div className="mt-12 border-y border-[#0b1f43]/10">
                                    <div className="grid grid-cols-2 border-b border-[#0b1f43]/10 py-5">
                                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0b1f43]/35">
                                            Colección
                                        </p>

                                        <p className="text-right text-[11px] font-black uppercase tracking-[0.08em]">
                                            2026
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 border-b border-[#0b1f43]/10 py-5">
                                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0b1f43]/35">
                                            Tallas
                                        </p>

                                        <p className="text-right text-[11px] font-black uppercase tracking-[0.08em]">
                                            S — 2XL
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 py-5">
                                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0b1f43]/35">
                                            Tipo
                                        </p>

                                        <p className="text-right text-[11px] font-black uppercase tracking-[0.08em]">
                                            Visitante
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-14">
                                <Link
                                    href="/tienda/jersey-visitante"
                                    className="group inline-flex w-full items-center justify-between bg-[#0b1f43] px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-[#158bd2]"
                                >
                                    Ver producto

                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DÓNDE COMPRAR */}
            <section
                id="comprar"
                className="bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
            >
                <div className="mx-auto max-w-[1600px]">
                    <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#158bd2]">
                                Disponibilidad
                            </p>

                            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-[#0b1f43] sm:text-6xl">
                                Encuentra
                                <span className="block text-[#158bd2]">
                                    tu jersey.
                                </span>
                            </h2>

                            <p className="mt-7 max-w-sm text-sm leading-7 text-[#0b1f43]/50">
                                Disponible en puntos seleccionados y también a
                                través de Génesis FC Shop.
                            </p>
                        </div>

                        <div className="border-t border-[#0b1f43]/10">
                            <div className="grid gap-4 border-b border-[#0b1f43]/10 py-7 sm:grid-cols-[1fr_auto] sm:items-center">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#158bd2]">
                                        La Paz
                                    </p>

                                    <h3 className="mt-2 text-2xl font-black uppercase tracking-tight">
                                        K9 Store
                                    </h3>
                                </div>

                                <span className="text-2xl text-[#0b1f43]/35">
                                    →
                                </span>
                            </div>

                            <div className="grid gap-4 border-b border-[#0b1f43]/10 py-7 sm:grid-cols-[1fr_auto] sm:items-center">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#158bd2]">
                                        Tegucigalpa
                                    </p>

                                    <h3 className="mt-2 text-2xl font-black uppercase tracking-tight">
                                        Suutuk
                                    </h3>
                                </div>

                                <span className="text-2xl text-[#0b1f43]/35">
                                    →
                                </span>
                            </div>

                            <div className="grid gap-4 py-7 sm:grid-cols-[1fr_auto] sm:items-center">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#158bd2]">
                                        Online
                                    </p>

                                    <h3 className="mt-2 text-2xl font-black uppercase tracking-tight">
                                        Génesis FC Shop
                                    </h3>

                                    <p className="mt-2 text-xs text-[#0b1f43]/40">
                                        Carrito disponible.
                                    </p>
                                </div>

                                <Link
                                    href="/tienda/carrito"
                                    className="text-2xl text-[#0b1f43]/35 transition hover:text-[#158bd2]"
                                    aria-label="Ir al carrito"
                                >
                                    →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CIERRE */}
            <section className="bg-[#f7f7f5] px-5 pb-5 sm:px-8 lg:px-10">
                <div className="mx-auto max-w-[1600px] bg-[#0b1f43] px-7 py-16 text-white sm:px-10 lg:px-16 lg:py-20">
                    <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.32em] text-[#5cc8ff]">
                                Génesis FC
                            </p>

                            <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.045em] sm:text-6xl">
                                La identidad
                                <span className="block text-[#5cc8ff]">
                                    también se viste.
                                </span>
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/tienda/carrito"
                                className="inline-flex items-center gap-4 bg-white px-6 py-4 text-[9px] font-black uppercase tracking-[0.22em] text-[#0b1f43] transition hover:bg-[#5cc8ff]"
                            >
                                Ver carrito
                                <span>→</span>
                            </Link>

                            <Link
                                href="/tienda/seguimiento"
                                className="inline-flex items-center gap-4 border border-[#5cc8ff]/40 bg-[#5cc8ff]/10 px-6 py-4 text-[9px] font-black uppercase tracking-[0.22em] text-[#5cc8ff] transition hover:bg-[#5cc8ff] hover:text-[#0b1f43]"
                            >
                                Seguir mi pedido
                                <span>→</span>
                            </Link>

                            <Link
                                href="/"
                                className="inline-flex items-center gap-4 border border-white/20 px-6 py-4 text-[9px] font-black uppercase tracking-[0.22em] transition hover:bg-white hover:text-[#0b1f43]"
                            >
                                Volver al inicio
                                <span>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="h-5 bg-[#f7f7f5]" />
        </main>
    );
}