import "server-only";

import { createClient } from "@supabase/supabase-js";

/* =========================================================
   VARIABLES PRIVADAS DEL SERVIDOR

   IMPORTANTE:
   Este archivo es exclusivamente server-side.

   SUPABASE_SECRET_KEY nunca debe:
   - llevar NEXT_PUBLIC_
   - importarse desde componentes cliente
   - enviarse al navegador
   - mostrarse en respuestas de API
========================================================= */

const supabaseUrl =
    process.env.SUPABASE_URL;

const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY;

/* =========================================================
   VALIDACIÓN
========================================================= */

if (!supabaseUrl) {
    throw new Error(
        "Falta SUPABASE_URL en las variables de entorno."
    );
}

if (!supabaseSecretKey) {
    throw new Error(
        "Falta SUPABASE_SECRET_KEY en las variables de entorno."
    );
}

/* =========================================================
   CLIENTE ADMINISTRATIVO

   Este cliente posee privilegios elevados y solamente
   debe utilizarse desde código ejecutado en el servidor.
========================================================= */

export const supabaseAdmin =
    createClient(
        supabaseUrl,
        supabaseSecretKey,
        {
            auth: {
                persistSession:
                    false,

                autoRefreshToken:
                    false,

                detectSessionInUrl:
                    false,
            },
        }
    );