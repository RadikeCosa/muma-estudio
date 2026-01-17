/**
 * Queries reutilizables para Supabase
 * Uso en Server Components: await getCategorias()
 */

import { createClient } from "@/lib/supabase/server";
import type { Categoria, ProductoCompleto } from "@/lib/types";
import type { PaginatedResult } from "@/lib/types/pagination";
import { ProductoRepository } from "@/lib/repositories/producto.repository";

interface GetProductosParams {
  categoriaSlug?: string;
  page?: number;
  pageSize?: number;
}

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
  params?: GetProductosParams,
): Promise<PaginatedResult<ProductoCompleto>> {
  const page = Math.max(1, params?.page ?? 1);
  const pageSize = Math.max(1, params?.pageSize ?? 12);
  const categoriaSlug = params?.categoriaSlug;

  const productoRepository = new ProductoRepository();

  // Query base con relaciones
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { items, total } = await productoRepository.findAll({
    categoria: categoriaSlug,
    limit: pageSize,
    offset: start,
  });

  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 0;

  return {
    items,
    pagination: {
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Obtiene un producto por su slug
 * @param slug - Slug único del producto
 * @returns Producto completo o null si no existe/inactivo
 */
export async function getProductoBySlug(
  slug: string,
): Promise<ProductoCompleto | null> {
  const productoRepository = new ProductoRepository();
  return productoRepository.findBySlug(slug);
}

/**
 * Obtiene productos relacionados de la misma categoría
 * @param productoId - ID del producto actual (para excluir)
 * @param categoriaId - ID de la categoría
 * @param limite - Número de productos a retornar (default: 4)
 * @returns Lista de productos relacionados activos
 */
export async function getProductosRelacionados(
  productoId: string,
  categoriaId: string,
  limite: number = 4,
): Promise<ProductoCompleto[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("productos")
    .select(
      `
      *,
      categoria:categorias(*),
      variaciones(*),
      imagenes:imagenes_producto(*)
    `,
    )
    .eq("categoria_id", categoriaId)
    .eq("activo", true)
    .neq("id", productoId)
    .limit(limite);

  if (error) throw error;

  return (data as ProductoCompleto[]) ?? [];
}
