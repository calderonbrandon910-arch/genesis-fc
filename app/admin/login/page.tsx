"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "../../../lib/supabase/client";

export default function AdminLoginPage() {
    const router = useRouter();

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const [cargando, setCargando] = useState(true);
    const [iniciandoSesion, setIniciandoSesion] =
        useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        let activo = true;

        async function comprobarSesion() {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (!activo) {
                    return;
                }

                if (session) {
                    router.replace("/admin/pedidos");
                    return;
                }
            } catch {
                // Si no se puede comprobar la sesión,
                // simplemente dejamos disponible el login.
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        }

        comprobarSesion();

        return () => {
            activo = false;
        };
    }, [router]);

    async function iniciarSesion(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (iniciandoSesion) {
            return;
        }

        const correoLimpio =
            correo.trim().toLowerCase();

        if (!correoLimpio || !password) {
            setError(
                "Ingresa tu correo y contraseña."
            );
            return;
        }

        setIniciandoSesion(true);
        setError("");

        try {
            const {
                data,
                error: loginError,
            } =
                await supabase.auth.signInWithPassword({
                    email: correoLimpio,
                    password,
                });

            if (
                loginError ||
                !data.session
            ) {
                setError(
                    "Correo o contraseña incorrectos."
                );
                return;
            }

            router.replace("/admin/pedidos");
            router.refresh();
        } catch {
            setError(
                "No se pudo iniciar sesión. Intenta nuevamente."
            );
        } finally {
            setIniciandoSesion(false);
        }
    }

    if (cargando) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#06142d] px-6 text-white">
                <div className="text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-300">
                        Génesis FC
                    </p>

                    <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-white/50">
                        Verificando acceso...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#06142d] px-5 py-12 text-white">
            <div className="w-full max-w-[470px]">
                <div className="mb-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.06]">
                        <span className="text-lg font-black text-cyan-300">
                            GFC
                        </span>
                    </div>

                    <p className="mt-6 text-[8px] font-black uppercase tracking-[0.3em] text-cyan-300">
                        Génesis FC
                    </p>

                    <h1 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em]">
                        Administración
                    </h1>

                    <p className="mt-4 text-sm leading-6 text-white/40">
                        Acceso privado al panel administrativo.
                    </p>
                </div>

                <form
                    onSubmit={iniciarSesion}
                    className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
                >
                    <div>
                        <label
                            htmlFor="correo"
                            className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40"
                        >
                            Correo
                        </label>

                        <input
                            id="correo"
                            type="email"
                            value={correo}
                            onChange={(event) =>
                                setCorreo(
                                    event.target.value
                                )
                            }
                            autoComplete="email"
                            placeholder="correo@ejemplo.com"
                            disabled={
                                iniciandoSesion
                            }
                            className="mt-3 w-full rounded-[16px] border border-white/10 bg-white/[0.05] px-4 py-4 text-sm font-semibold text-white outline-none transition placeholder:text-white/20 focus:border-cyan-300/50 disabled:opacity-50"
                        />
                    </div>

                    <div className="mt-5">
                        <label
                            htmlFor="password"
                            className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40"
                        >
                            Contraseña
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            autoComplete="current-password"
                            placeholder="••••••••"
                            disabled={
                                iniciandoSesion
                            }
                            className="mt-3 w-full rounded-[16px] border border-white/10 bg-white/[0.05] px-4 py-4 text-sm font-semibold text-white outline-none transition placeholder:text-white/20 focus:border-cyan-300/50 disabled:opacity-50"
                        />
                    </div>

                    {error && (
                        <div className="mt-5 rounded-[16px] border border-red-400/20 bg-red-500/10 px-4 py-4">
                            <p className="text-xs font-bold leading-5 text-red-200">
                                {error}
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={iniciandoSesion}
                        className="mt-7 flex w-full items-center justify-center rounded-[16px] bg-cyan-300 px-5 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#06142d] transition hover:bg-white disabled:cursor-wait disabled:opacity-50"
                    >
                        {iniciandoSesion
                            ? "Ingresando..."
                            : "Iniciar sesión"}
                    </button>
                </form>

                <p className="mt-7 text-center text-[7px] font-black uppercase tracking-[0.18em] text-white/20">
                    Acceso restringido · Génesis FC
                </p>
            </div>
        </main>
    );
}