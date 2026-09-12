import { createClient } from "@supabase/supabase-js";

/* =========================================================
   VARIABLES PÚBLICAS

   IMPORTANTE:
   Este archivo corre en el navegador.

   Aquí SOLO pueden usarse variables NEXT_PUBLIC_*.
   Nunca usar SUPABASE_SECRET_KEY aquí.
========================================================= */

const supabaseUrl =
    process.env
        .NEXT_PUBLIC_SUPABASE_URL;

const supabasePublishableKey =
    process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY;

/* =========================================================
   VALIDACIÓN
========================================================= */

if (!supabaseUrl) {
    throw new Error(
        "Falta NEXT_PUBLIC_SUPABASE_URL en las variables de entorno."
    );
}

if (!supabasePublishableKey) {
    throw new Error(
        "Falta NEXT_PUBLIC_SUPABASE_ANON_KEY en las variables de entorno."
    );
}

/* =========================================================
   CLIENTE PÚBLICO DE SUPABASE
========================================================= */

export const supabase =
    createClient(
        supabaseUrl,
        supabasePublishableKey,
        {
            auth: {
                persistSession:
                    true,

                autoRefreshToken:
                    true,

                detectSessionInUrl:
                    true,
            },
        }
    );