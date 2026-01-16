---
title: "Instrucciones de GitHub Copilot para Muma Estudio"
description: "Guía de desarrollo para el e-commerce de textiles artesanales con Next.js 15 + Supabase"
version: "2.0"
lastUpdated: "2026-01-16"
stack:
  - Next.js 15 (App Router)
  - TypeScript (strict mode)
  - Supabase (PostgreSQL + Storage)
  - Tailwind CSS
  - Vercel
---

# Instrucciones de GitHub Copilot - Muma Estudio

## 🎯 Contexto del Proyecto

**Muma Estudio** es un e-commerce de textiles artesanales (manteles, servilletas, caminos de mesa) con productos que tienen múltiples variaciones de tamaño y color.

- **V1 (Actual):** Catálogo visual + consultas por WhatsApp
- **V2 (Futuro):** Carrito + pagos con Mercado Pago

---

## 🏗️ Arquitectura

### Stack Tecnológico

- **Framework:** Next.js 15 con App Router
- **Lenguaje:** TypeScript en modo estricto
- **Base de datos:** Supabase (PostgreSQL)
- **Estilos:** Tailwind CSS (utility-first, light mode)
- **Deploy:** Vercel con integración Supabase

### Estructura de Directorios

```
app/                    # Pages y layouts (App Router)
components/             # Componentes React por dominio
  ├── layout/          # Header, Footer, MobileNav
  ├── productos/       # ProductCard, ProductGallery, VariationSelector
  └── ui/              # Componentes reutilizables (futuro)
lib/                   # Lógica de negocio
  ├── constants/       # Configuración global (SITE_CONFIG, WHATSAPP)
  ├── supabase/        # Clientes (client. ts, server.ts) y queries
  ├── utils/           # Utilidades (formatPrice, etc.)
  └── types.ts         # Tipos TypeScript compartidos
```

### Esquema de Base de Datos (Supabase)

```
categorias          → id, nombre, slug, orden
productos           → id, nombre, slug, descripcion, categoria_id, activo, destacado
variaciones         → id, producto_id, tamanio, color, precio, stock, activo
imagenes_producto   → id, producto_id, url, alt_text, orden, es_principal
consultas           → id, nombre, email, mensaje, created_at
```

---

## 📜 Reglas Fundamentales

### 1. TypeScript Estricto

```typescript
// ✅ SIEMPRE: Tipos explícitos en funciones y parámetros
export async function getProductos(): Promise<ProductoCompleto[]> {
  const supabase = await createClient();
  // ...
}

// ❌ NUNCA: Usar 'any' o tipos implícitos
let data: any; // ❌
function get() {} // ❌
```

**Reglas:**

- Tipos explícitos en todas las funciones
- `interface` para objetos, `type` para unions
- Nombres de propiedades de negocio en **español**, código en **inglés**
- **NUNCA** usar `any`

---

### 2. Server vs Client Components

```typescript
// ✅ Por defecto: Server Component (sin 'use client')
// Usar Server Components para:
// - Queries de base de datos
// - Generación de metadata
// - Contenido estático

export default async function ProductosPage() {
  const productos = await getProductos(); // Query directa
  return <ProductGrid productos={productos} />;
}

// ✅ Client Component (solo cuando es necesario)
// Usar 'use client' para:
// - useState, useEffect, hooks de React
// - Eventos (onClick, onChange)
// - Browser APIs (window, localStorage)

("use client");
export function VariationSelector() {
  const [selected, setSelected] = useState(null);
  // ...
}
```

---

### 3. Queries de Supabase

#### Patrón estándar con relaciones:

```typescript
const { data, error } = await supabase
  .from("productos")
  .select(
    `
    *,
    categoria: categorias(*),
    variaciones(*),
    imagenes:imagenes_producto(*)
  `
  )
  .eq("activo", true);

if (error) throw error;

// ⚠️ IMPORTANTE: Ordenar relaciones en JavaScript
// Supabase NO permite . order() en joins
data.forEach((producto) => {
  producto.variaciones.sort((a, b) => a.precio - b.precio);
  producto.imagenes.sort((a, b) => a.orden - b.orden);
});
```

**Reglas clave:**

- ✅ Usar `activo` como columna de estado (no `disponible`)
- ❌ NO usar `.order('variaciones(precio)')` - ordenar en JS
- ✅ Siempre validar `error` antes de usar `data`
- ✅ Usar `.single()` para queries de un solo resultado

---

### 4. Importaciones y Constantes

```typescript
// ✅ Usar constantes centralizadas
import { SITE_CONFIG, WHATSAPP, ERROR_MESSAGES } from "@/lib/constants";

// ✅ Tipos desde lib/types. ts
import type { Producto, ProductoCompleto, Variacion } from "@/lib/types";

// ✅ Queries desde lib/supabase/queries. ts
import { getProductos, getProductoBySlug } from "@/lib/supabase/queries";

// ✅ Cliente de Supabase según contexto
import { createClient } from "@/lib/supabase/server"; // Server Components
import { createClient } from "@/lib/supabase/client"; // Client Components
```

---

### 5. Estilos con Tailwind CSS

```tsx
// ✅ Clases en múltiples líneas para legibilidad
<div className="
  flex items-center gap-4
  p-4 rounded-lg
  bg-white hover:shadow-lg
  md: flex-row md:gap-6
">

// ✅ Mobile-first (sin prefijo → sm → md → lg → xl)
<div className="
  grid grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  gap-4
">
```

---

### 6. Manejo de Errores y Loading States

```tsx
// ✅ Suspense boundaries en Server Components
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<ProductosSkeleton />}>
      <ProductosContent />
    </Suspense>
  );
}

// ✅ O usar loading. tsx en App Router
// app/productos/loading.tsx
export default function Loading() {
  return <ProductosSkeleton />;
}

// ✅ Manejo de errores con try/catch
try {
  const data = await getProductoBySlug(slug);
  if (!data) return notFound();
  return <ProductDetail producto={data} />;
} catch (error) {
  console.error("Error al cargar producto:", error);
  throw error; // Next.js lo captura con error.tsx
}
```

---

## 🎨 Convenciones de Código

### Naming

```typescript
// Componentes → PascalCase
ProductCard.tsx
VariationSelector.tsx

// Funciones/variables → camelCase
getProductos()
isLoading

// Constantes → UPPER_SNAKE_CASE
const SITE_CONFIG = { ... }
const ERROR_MESSAGES = { ... }

// Booleans → prefijos is/has/should
isLoading, hasError, shouldDisplay
```

### Commits (Conventional Commits)

```bash
feat: Agregar selector de variaciones
fix: Corregir ordenamiento de precios
style: Mejorar espaciado en ProductCard
refactor: Extraer lógica de WhatsApp a utils
docs: Actualizar README con nuevas instrucciones
```

---

## 🔐 Modelo de Negocio (V1 Actual)

### Estructura de Productos

```
Producto Base:  "Mantel Floral"
├── Variación 1: 150x200cm - Rojo - $15,000
├── Variación 2: 150x200cm - Azul - $15,000
└── Variación 3: 180x250cm - Rojo - $18,500
```

**IMPORTANTE:**

- Los precios están en las **variaciones**, no en el producto base
- Cada producto puede tener múltiples variaciones de tamaño y color
- Las imágenes pueden ser compartidas o específicas por variación

### Flujo de Compra (V1)

1. Usuario navega el catálogo
2. Selecciona un producto → página de detalle
3. Elige variación (tamaño + color)
4. Click en "Consultar por WhatsApp"
5. Se abre WhatsApp con mensaje pre-formateado
6. Venta se cierra fuera de la plataforma

**NO hay carrito ni pagos online en V1**

---

## 🚀 Features Futuras (V2 - NO Implementar Aún)

Cuando llegue V2, se agregará:

- Carrito de compras con Context API
- Integración con Mercado Pago
- Server Actions para checkout
- Gestión de pedidos

**🚨 NO generar código de V2 a menos que se solicite explícitamente.**

---

## ✅ Checklist de Calidad

Antes de sugerir código, verificar:

- [ ] ¿Los tipos están explícitos y sin `any`?
- [ ] ¿Es Server Component por defecto o realmente necesita `'use client'`?
- [ ] ¿Las queries de Supabase usan `activo` (no `disponible`)?
- [ ] ¿Las relaciones se ordenan en JavaScript después del fetch?
- [ ] ¿Los imports usan rutas absolutas con `@/`?
- [ ] ¿Las constantes vienen de `lib/constants`?
- [ ] ¿Los estilos siguen mobile-first?
- [ ] ¿El código sigue las convenciones de naming?

---

## 📚 Recursos

- Documentación del proyecto: `README.md`
- Skills detalladas: `.github/skills.md`
- Tipos compartidos: `lib/types.ts`
- Constantes globales: `lib/constants/index.ts`
