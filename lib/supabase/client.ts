/**
 * Cliente de Supabase para Client Components
 * Uso: import { createClient } from '@/lib/supabase/client'
 */
"use client";

import { createBrowserClient } from "@supabase/ssr";

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
 * Crea una instancia del cliente de Supabase para uso en Client Components
 * @returns Cliente de Supabase configurado
 */
export function createClient() {
  const { url, anonKey } = getSupabaseConfig();

  return createBrowserClient(url, anonKey);
}
