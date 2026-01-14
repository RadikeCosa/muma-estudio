/**
 * Queries reutilizables para Supabase
 * Uso en Server Components: await getCategorias()
 */

import { createClient } from "@/lib/supabase/server";
import type { Categoria, ProductoCompleto } from "@/lib/types";

/**
 * Obtiene todas las categorías ordenadas
 * @returns Lista de categorías ordenadas por campo 'orden'
 */
export async function getCategorias(): Promise<Categoria[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .order("orden", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

/**
 * Obtiene productos activos con sus relaciones
 * @param categoriaSlug - Filtrar por slug de categoría (opcional)
 * @returns Lista de productos completos (destacados primero, luego por nombre)
 */
export async function getProductos(
  categoriaSlug?: string
): Promise<ProductoCompleto[]> {
  const supabase = await createClient();

  // Query base con relaciones
  let query = supabase
    .from("productos")
    .select(
      `
      *,
      categoria:categorias(*),
      variaciones(*),
      imagenes:imagenes_producto(*)
    `
    )
    .eq("activo", true)
    .order("destacado", { ascending: false })
    .order("nombre", { ascending: true });

  // Filtro por categoría si se proporciona slug
  if (categoriaSlug) {
    // Primero obtenemos el ID de la categoría por su slug
    const { data: categoria } = await supabase
      .from("categorias")
      .select("id")
      .eq("slug", categoriaSlug)
      .single();

    if (categoria) {
      query = query.eq("categoria_id", categoria.id);
    }
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data as ProductoCompleto[]) ?? [];
}

/**
 * Obtiene un producto por su slug
 * @param slug - Slug único del producto
 * @returns Producto completo o null si no existe/inactivo
 */
export async function getProductoBySlug(
  slug: string
): Promise<ProductoCompleto | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("productos")
    .select(
      `
      *,
      categoria:categorias(*),
      variaciones(*),
      imagenes:imagenes_producto(*)
    `
    )
    .eq("slug", slug)
    .eq("activo", true)
    .single();

  if (error) {
    // .single() lanza error si no encuentra resultados
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data as ProductoCompleto;
}
