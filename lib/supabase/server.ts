/**
 * Cliente de Supabase para Server Components
 * Uso: import { createClient } from '@/lib/supabase/server'
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Valida y retorna las variables de entorno requeridas
 * @throws Error si las variables no están definidas
 */
function getSupabaseConfig(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL no está definida en las variables de entorno"
    );
  }

  if (!anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida en las variables de entorno"
    );
  }

  return { url, anonKey };
}

/**
 * Crea una instancia del cliente de Supabase para uso en Server Components
 * @returns Cliente de Supabase configurado para el servidor
 */
export async function createClient() {
  const { url, anonKey } = getSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll es llamado desde Server Component donde no se pueden setear cookies
          // Esto es seguro de ignorar si no hay middleware de autenticación
        }
      },
    },
  });
}
