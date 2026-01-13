# Proyecto: Tienda de Textiles

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Supabase** (PostgreSQL + Storage)
- **Tailwind CSS** (estilos)
- **React Hook Form + Zod** (formularios)
- **Deploy:** Vercel

## Contexto del Negocio

E-commerce de manteles, servilletas y caminos de mesa. Productos con variaciones de tamaño/color.

- **V1 (actual):** Catálogo + consultas por WhatsApp
- **V2 (futuro):** Carrito + Mercado Pago

---

## Reglas de Código

### TypeScript

- Siempre tipos explícitos, nunca `any`
- Preferir `interface` para objetos, `type` para unions
- Nombres de UI/datos en español, código en inglés

```typescript
// ✅ Bien
interface Product {
  nombre: string; // Datos en español
  precio: number;
}

// ❌ Evitar
let data: any;
const products = []; // Sin tipo explícito
```

### React

- **Server Components** por defecto
- Solo `'use client'` cuando uses: hooks, eventos, browser APIs
- Orden: imports → types → component → handlers → JSX

```typescript
// Server Component (por defecto)
export function ProductList() {
  const products = await getProducts();
  return ...;
}

// Client Component (solo cuando es necesario)
'use client';
export function ProductCard() {
  const [liked, setLiked] = useState(false);
  return ...;
}
```

### Tailwind

- Clases en múltiples líneas para legibilidad
- Mobile-first (sin prefijo → sm → md → lg)
- Usar `clsx` para condicionales

```tsx
// ✅ Bien
<div className="
  flex items-center gap-4
  p-4 rounded-lg
  bg-white hover:shadow-lg
  md:flex-row md:gap-6
">

// ❌ Evitar CSS inline
<div style={{ padding: '16px' }}>
```

### Naming

- Componentes: `ProductCard.tsx` (PascalCase)
- Funciones/vars: `fetchProducts`, `isLoading` (camelCase)
- Constantes: `API_ROUTES` (UPPER_SNAKE_CASE)
- Booleans: `isX`, `hasX`, `shouldX`

---

## Estructura del Proyecto

```
app/
├── page.tsx              # Home
├── productos/
│   ├── page.tsx         # Listado
│   └── [slug]/page.tsx  # Detalle
└── api/                 # API Routes

components/
├── layout/              # Header, Footer
├── productos/           # Product*, Variation*
└── ui/                  # Button, Card, Input

lib/
├── supabase/
│   ├── client.ts        # Cliente Supabase
│   └── queries.ts       # Queries reutilizables
├── types.ts             # Types compartidos
└── utils.ts             # Utilidades
```

---

## Patrones del Proyecto

### Queries Supabase

```typescript
// Siempre tipar y manejar errores
const { data, error } = await supabase
  .from("productos")
  .select("*, variaciones(*), imagenes_producto(*)")
  .eq("activo", true);

if (error) throw error;
return data ?? []; // Manejar null
```

### Imágenes

```typescript
// Siempre Next.js Image
import Image from "next/image";

<Image
  src={imageUrl}
  alt={`${producto.nombre}`}
  width={800}
  height={600}
  quality={85}
  className="..."
/>;
```

### Formularios

```typescript
// React Hook Form + Zod
const schema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### WhatsApp

```typescript
const msg = `Hola! Me interesa: ${producto.nombre}`;
const url = `https://wa.me/549${PHONE}?text=${encodeURIComponent(msg)}`;
```

---

## Checklist antes de Commit

```bash
- [ ] Sin errores de TypeScript
- [ ] Sin console.logs
- [ ] Maneja loading/error/empty states
- [ ] Responsive mobile/desktop
- [ ] npm run build exitoso
```

---

## Comandos Útiles

```bash
npm run dev          # Dev server
npm run build        # Build producción
npm run lint         # Linter
vercel               # Deploy preview
vercel --prod        # Deploy producción
```

---

## Base de Datos (Supabase)

### Tablas principales

- `categorias` (id, nombre, slug)
- `productos` (id, nombre, slug, descripcion, categoria_id, precio_desde, activo)
- `variaciones` (id, producto_id, tamanio, color, precio, stock)
- `imagenes_producto` (id, producto_id, url, es_principal)
- `consultas` (id, nombre, email, telefono, producto_id, mensaje)

---

## Notas

- **Idioma:** UI en español, código en inglés
- **Formato moneda:** ARS → `$1.234,56`
- **Commits:** Conventional Commits (`feat:`, `fix:`, `style:`, etc.)

---
