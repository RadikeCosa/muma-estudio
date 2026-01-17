# 🚀 Setup Final - Muma Estudio v1

**Estado:** Todo completado ✅  
**Fecha:** 17 de enero de 2026

---

## 📋 Checklist de Setup Antes de Deploy

### 1️⃣ Variables de Entorno

**Archivo:** `.env.local` (copiar de `.env.local.example`)

```env
# Google Analytics - REQUERIDO para tracking
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
# Obtener en: https://analytics.google.com > Admin > Propiedad > Detalles de propiedad

# WhatsApp - REQUERIDO para contacto
NEXT_PUBLIC_WHATSAPP_NUMBER=5492999123456
# Formato: país + 10 dígitos, sin espacios ni +

# Site URL - REQUERIDO para SEO
NEXT_PUBLIC_SITE_URL=https://mumaestudio.com
# Mismo dominio en producción

# Redes Sociales - OPCIONAL pero recomendado
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/mumaestudio
NEXT_PUBLIC_CONTACT_EMAIL=contacto@mumaestudio.com

# Supabase - YA CONFIGURADO
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

### 2️⃣ Google Analytics 4 Setup

1. **Crear cuenta:**
   - Ir a https://analytics.google.com
   - Click "Crear cuenta"
   - Ingresar nombre (ej: "Muma Estudio")

2. **Crear propiedad:**
   - Ingresar URL: `https://mumaestudio.com`
   - País: Argentina
   - Zona horaria: (UTC-3) Buenos Aires
   - Moneda: ARS

3. **Crear data stream:**
   - Seleccionar "Web"
   - URL: `https://mumaestudio.com`
   - Nombre: "Web - Muma Estudio"
   - Copiar ID de medida (ej: `G-XXXXXXXXXX`)

4. **Configurar .env.local:**

   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

5. **Validar en local:**
   ```bash
   npm run dev
   # Abrir DevTools > Network
   # Buscar "google" en filtro
   # Hacer click en producto/categoría
   # Debe aparecer evento en Network
   ```

---

### 3️⃣ Verificaciones SEO

#### A. Sitemap

```bash
# Local
curl http://localhost:3000/sitemap.xml

# Production
curl https://mumaestudio.com/sitemap.xml
```

Debe mostrar:

- Homepage (priority: 1.0)
- /productos (priority: 0.9)
- Todos los productos (priority: 0.6-0.8)

#### B. Robots.txt

```bash
# Local
curl http://localhost:3000/robots.txt

# Production
curl https://mumaestudio.com/robots.txt
```

Debe permitir: `/`  
Debe bloquear: `/api/`, `/_next/`, `/private/`

#### C. JSON-LD

1. Ir a https://validator.schema.org/
2. Ingresar URL de producto
3. Validar que aparezcan:
   - ✅ Product schema
   - ✅ BreadcrumbList schema

#### D. Open Graph

1. Ir a https://www.opengraph.xyz/
2. Ingresar URL de producto
3. Verificar imagen, título, descripción

---

### 4️⃣ Google Search Console Setup

1. **Registrar sitio:**
   - Ir a https://search.google.com/search-console
   - "Agregar propiedad"
   - Ingresar `https://mumaestudio.com`

2. **Validar dominio:**
   - Descargar archivo HTML
   - Subir a raíz del sitio
   - Completar validación

3. **Enviar sitemap:**
   - Ir a "Sitemaps"
   - Click "Agregar sitemap"
   - Ingresar: `https://mumaestudio.com/sitemap.xml`

4. **Monitorear:**
   - Esperar 24-48 horas
   - Revisar "Inspección de URL"
   - Buscar problemas en "Cobertura"

---

### 5️⃣ Testing Local

```bash
# Instalar dependencias
npm install

# Build de producción
npm run build

# Servir localmente
npm run start

# Probar en navegador
# http://localhost:3000
```

**Checklist de testing:**

#### Homepage

- [ ] Metadata correcta en HTML
- [ ] Open Graph visible
- [ ] JSON-LD Organization
- [ ] Links funcionales

#### Listado de Productos

- [ ] Breadcrumbs visible
- [ ] Filtros por categoría funcionan
- [ ] URLs con query params: `/productos?categoria=X`
- [ ] Breadcrumb actualiza

#### Detalle de Producto

- [ ] Breadcrumbs específicos
- [ ] JSON-LD Product
- [ ] Open Graph con imagen
- [ ] Productos relacionados muestran
- [ ] WhatsApp tracking en GA4

#### Google Analytics

- [ ] Abrir DevTools
- [ ] Network > Buscar "google"
- [ ] Hacer click en producto
- [ ] Verificar `whatsapp_click` evento
- [ ] Revisar en GA4 > Eventos

---

### 6️⃣ Deploy en Vercel

1. **Conectar repositorio:**

   ```bash
   git push origin main
   ```

2. **Vercel auto-detecta:**
   - Framework: Next.js ✅
   - Build command: `next build` ✅
   - Output directory: `.next` ✅

3. **Configurar variables:**
   - Ir a Project Settings > Environment Variables
   - Agregar todas las `NEXT_PUBLIC_*` variables

4. **Deploy:**
   - Click "Deploy"
   - Esperar ~3 minutos
   - Verificar en `https://muma-estudio.vercel.app`

---

### 7️⃣ Post-Deploy Checklist

#### Primeros 24 Horas

- [ ] Sitio carga correctamente
- [ ] GA4 recibe eventos
- [ ] Sitemap accesible
- [ ] Open Graph funciona (compartir en WhatsApp)

#### Primeros 7 Días

- [ ] Google Search Console indexa páginas
- [ ] Buscar "Muma Estudio" en Google
- [ ] Revisar errores en GSC
- [ ] Validar JSON-LD en productos

#### Primeros 30 Días

- [ ] Analizar datos en GA4
- [ ] Verificar tráfico orgánico
- [ ] Revisar conversion WhatsApp
- [ ] Optimizar si es necesario

---

## 🔗 Links Útiles

### Herramientas

- [Google Analytics](https://analytics.google.com)
- [Google Search Console](https://search.google.com/search-console)
- [Schema Validator](https://validator.schema.org/)
- [OpenGraph Checker](https://www.opengraph.xyz/)

### Documentación

- [Next.js App Router](https://nextjs.org/docs/app)
- [Schema.org](https://schema.org/)
- [Google Search Console Help](https://support.google.com/webmasters)

### Monitoreo

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Google Analytics](https://analytics.google.com)
- [GSC Coverage Report](https://search.google.com/search-console)

---

## 📞 Soporte

### Problemas Comunes

**P: GA4 no recibe eventos**

- Verificar `NEXT_PUBLIC_GA_MEASUREMENT_ID` en `.env.local`
- Ejecutar `npm run build` y `npm run start`
- Revisar DevTools Network para eventos Google
- Esperar 24 horas para aparecer en GA4

**P: Sitemap no indexa productos**

- Verificar `NEXT_PUBLIC_SITE_URL` correcto
- Enviar manualmente en GSC
- Esperar 7-14 días para crawl inicial
- Revisar "Cobertura" en GSC para errores

**P: Open Graph no muestra imagen**

- Verificar imagen existe en `/public/og-image.jpg`
- Usar `https://www.opengraph.xyz/` para debug
- Cache: usar `og:image` URL absoluta

**P: Breadcrumbs no aparecen**

- Revisar script JSON-LD está en HTML
- Verificar categoría existe en Supabase
- Validar con `https://validator.schema.org/`

---

## ✅ Todo Listo!

El proyecto está completamente configurado con:

✅ Google Analytics 4  
✅ Breadcrumbs SEO  
✅ Filtros por categoría  
✅ Productos relacionados  
✅ Sitemap dinámico  
✅ Robots.txt  
✅ JSON-LD estructurado  
✅ Open Graph

**Ahora solo necesitas:**

1. Completar .env.local
2. Crear cuenta GA4
3. Hacer deploy en Vercel
4. Validar en Google Search Console

¡Éxito! 🚀
