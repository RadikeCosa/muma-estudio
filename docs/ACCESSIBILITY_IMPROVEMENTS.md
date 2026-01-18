# Accessibility Improvements Checklist

## Overview
This document outlines accessibility (a11y) improvements for Muma Estudio. The goal is to meet WCAG 2.1 Level AA standards and provide an excellent experience for all users.

---

## ✅ Implemented

### 1. Button Component
- ✅ Proper focus ring styles (`focus:ring-2`)
- ✅ Active state feedback
- ✅ Keyboard navigation support
- ✅ Clear visual feedback on hover/focus
- ✅ Adequate touch target size (minimum 44x44px)

### 2. Input Component
- ✅ Associated labels with inputs via `htmlFor`
- ✅ Error messages linked with `aria-describedby`
- ✅ Required field indicators
- ✅ Clear focus states
- ✅ Helper text support

### 3. Textarea Component
- ✅ Associated labels with textarea
- ✅ Error and helper text support
- ✅ Focus states
- ✅ Required field indicators

### 4. Breadcrumbs Component
- ✅ Semantic `<nav>` element
- ✅ `aria-label="Breadcrumb"`
- ✅ `aria-current="page"` on last item
- ✅ SEO structured data (JSON-LD)
- ✅ Keyboard navigable links

### 5. Link Components
- ✅ External links have `rel="noopener noreferrer"`
- ✅ Clear focus states
- ✅ Hover states for visual feedback

---

## ⚠️ High Priority - To Implement

### 1. Skip to Content Link
**Issue:** Keyboard users must tab through entire navigation to reach main content.

**Solution:** Add skip link at the top of the page.

**Location:** `app/layout.tsx`

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {/* Skip to content link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-lg focus:shadow-lg"
        >
          Saltar al contenido principal
        </a>
        
        <Header />
        <main id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

**Acceptance Criteria:**
- [ ] Link is visually hidden by default
- [ ] Link becomes visible when focused via keyboard
- [ ] Clicking/activating link jumps to main content
- [ ] Link is the first focusable element on page

---

### 2. Focus Trap in MobileNav
**Issue:** When mobile menu is open, focus can escape to background content.

**Solution:** Implement focus trap using `focus-trap-react` or custom solution.

**Location:** `components/layout/MobileNav.tsx`

**Option A: Using focus-trap-react library**

```bash
npm install focus-trap-react
```

```tsx
import FocusTrap from 'focus-trap-react';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)} aria-label="Abrir menú">
        <Menu />
      </button>
      
      {isOpen && (
        <FocusTrap
          focusTrapOptions={{
            onDeactivate: () => setIsOpen(false),
            clickOutsideDeactivates: true,
          }}
        >
          <div className="mobile-nav-overlay">
            {/* Menu content */}
          </div>
        </FocusTrap>
      )}
    </>
  );
}
```

**Option B: Custom focus trap (minimal dependencies)**

```tsx
// hooks/useFocusTrap.ts
import { useEffect, useRef } from 'react';

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
}
```

**Acceptance Criteria:**
- [ ] Focus stays within mobile menu when open
- [ ] Tab key cycles through menu items
- [ ] Shift+Tab cycles backwards
- [ ] ESC key closes menu (already implemented via useEscapeKey)
- [ ] Focus returns to trigger button on close

---

### 3. ARIA Labels for FilterBar Checkboxes
**Issue:** Checkboxes may not be clearly labeled for screen readers.

**Solution:** Add explicit ARIA labels.

**Location:** `components/productos/FilterBar.tsx`

```tsx
<input
  type="checkbox"
  id={`categoria-${categoria.id}`}
  checked={filters.categorias.includes(categoria.id)}
  onChange={(e) => {
    // ... existing logic
  }}
  aria-label={`Filtrar por categoría ${categoria.nombre}`}
  aria-checked={filters.categorias.includes(categoria.id)}
  className="..."
/>
<label htmlFor={`categoria-${categoria.id}`}>
  {categoria.nombre}
</label>
```

**Acceptance Criteria:**
- [ ] Each checkbox has unique `id` and `aria-label`
- [ ] Label is associated with checkbox via `htmlFor`
- [ ] `aria-checked` reflects current state
- [ ] Screen readers announce "Filtrar por categoría Manteles, casilla de verificación, marcada"

---

### 4. Keyboard Navigation for VariationSelector
**Issue:** Size/color selection may not be fully keyboard accessible.

**Solution:** Implement keyboard support.

**Location:** `components/productos/VariationSelector.tsx`

```tsx
export function VariationSelector() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  function handleKeyDown(e: React.KeyboardEvent, size: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedSize(size);
    }
  }
  
  return (
    <div role="group" aria-label="Selección de tamaño">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => setSelectedSize(size)}
          onKeyDown={(e) => handleKeyDown(e, size)}
          aria-pressed={selectedSize === size}
          className={cn(
            "...",
            selectedSize === size && "..."
          )}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
```

**For color swatches:**

```tsx
<button
  onClick={() => setSelectedColor(color)}
  onKeyDown={(e) => handleKeyDown(e, color)}
  aria-label={`Color ${color}`}
  aria-pressed={selectedColor === color}
  className="..."
  style={{ backgroundColor: color }}
/>
```

**Acceptance Criteria:**
- [ ] Tab key focuses each option
- [ ] Enter/Space selects option
- [ ] Visual focus indicator
- [ ] `aria-pressed` indicates selected state
- [ ] Group has descriptive `aria-label`

---

## 🔶 Medium Priority - To Implement

### 5. Color Contrast
**Issue:** Muted text may not meet WCAG AA contrast ratio (4.5:1).

**Solution:** Check and adjust if needed.

**Location:** `app/globals.css`

**Steps:**
1. Use contrast checker tool (e.g., WebAIM Contrast Checker)
2. Test `--muted-foreground` against `--background`
3. Adjust if contrast ratio < 4.5:1

**Current values:**
```css
:root {
  --background: #ffffff;
  --muted-foreground: #737373; /* Current value */
}
```

**If adjustment needed:**
```css
:root {
  --muted-foreground: #525252; /* Darker for better contrast */
}
```

**Acceptance Criteria:**
- [ ] All text meets WCAG AA (4.5:1) or AAA (7:1)
- [ ] Large text (18pt+) meets WCAG AA (3:1)
- [ ] Tested with automated tools
- [ ] Verified in browser DevTools

---

### 6. Image Alt Text Best Practices
**Issue:** Alt text may be generic (just product name).

**Solution:** Add descriptive alt text.

**Location:** Product images throughout the site

**Bad:**
```tsx
<img src="/mantel.jpg" alt="Mantel Floral" />
```

**Good:**
```tsx
<img 
  src="/mantel.jpg" 
  alt="Mantel rectangular con estampado floral rojo y blanco, ideal para 6 personas" 
/>
```

**Guidelines:**
- Describe what the image shows visually
- Include relevant details (colors, patterns, size context)
- Keep under 125 characters if possible
- Don't start with "Imagen de..." (screen readers already announce "image")

**Acceptance Criteria:**
- [ ] All product images have descriptive alt text
- [ ] Alt text includes visual details
- [ ] Decorative images use `alt=""` or `role="presentation"`

---

### 7. Form Validation Announcements
**Issue:** Form errors may not be announced to screen readers.

**Solution:** Use `aria-live` regions.

**Location:** `components/contacto/ContactForm.tsx`

```tsx
export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Error summary (announced to screen readers) */}
      {Object.keys(errors).length > 0 && (
        <div 
          role="alert" 
          aria-live="assertive"
          className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
        >
          <h3 className="font-bold text-red-900 mb-2">
            Hay errores en el formulario:
          </h3>
          <ul className="list-disc list-inside text-red-700">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}
      
      <Input
        id="nombre"
        label="Nombre"
        error={errors.nombre}
        aria-invalid={!!errors.nombre}
        aria-describedby={errors.nombre ? "nombre-error" : undefined}
      />
      {errors.nombre && (
        <span id="nombre-error" className="text-red-600 text-sm">
          {errors.nombre}
        </span>
      )}
      
      {/* ... rest of form */}
    </form>
  );
}
```

**Acceptance Criteria:**
- [ ] Errors are announced when form is submitted
- [ ] Each field error is associated via `aria-describedby`
- [ ] `aria-invalid` indicates fields with errors
- [ ] Error summary uses `role="alert"`

---

## 🔵 Low Priority - Nice to Have

### 8. Reduced Motion Support
**Issue:** Animations may cause discomfort for users with motion sensitivity.

**Solution:** Respect `prefers-reduced-motion` media query.

**Location:** `app/globals.css`

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Or with Tailwind (in components):**

```tsx
<div className="transition-transform motion-reduce:transition-none hover:scale-105 motion-reduce:hover:scale-100">
  {/* Content */}
</div>
```

**Acceptance Criteria:**
- [ ] All animations respect user preference
- [ ] Page remains functional without animations
- [ ] Smooth scroll disabled when motion reduced
- [ ] Hover effects still work (just no animation)

---

### 9. Focus-Visible Only (Remove Focus Ring for Mouse Users)
**Issue:** Focus rings appear on mouse clicks, which some users find distracting.

**Solution:** Use `:focus-visible` instead of `:focus`.

**Location:** Design tokens and components

**Current:**
```tsx
"focus:ring-2 focus:ring-foreground"
```

**Improved:**
```tsx
"focus-visible:ring-2 focus-visible:ring-foreground focus:outline-none"
```

**Note:** Tailwind 3+ supports `focus-visible` by default. Update components to use `focus-visible:` instead of `focus:` where appropriate.

**Acceptance Criteria:**
- [ ] Focus rings only appear for keyboard navigation
- [ ] Mouse clicks don't show focus rings
- [ ] Tab key shows focus rings
- [ ] All interactive elements updated

---

### 10. Landmark Regions
**Issue:** Screen reader users benefit from explicit landmark roles.

**Solution:** Add ARIA landmarks.

**Location:** Various layout files

```tsx
// app/layout.tsx
<body>
  <a href="#main-content">Skip to content</a>
  
  <header role="banner">
    <Header />
  </header>
  
  <main role="main" id="main-content">
    {children}
  </main>
  
  <footer role="contentinfo">
    <Footer />
  </footer>
</body>
```

**For sidebars/filters:**
```tsx
<aside role="complementary" aria-label="Filtros de productos">
  <FilterBar />
</aside>
```

**Note:** HTML5 semantic elements (`<header>`, `<main>`, `<footer>`, `<aside>`) already provide implicit roles. Explicit roles are mainly for clarity and older browser support.

**Acceptance Criteria:**
- [ ] Main content area has `<main>` or `role="main"`
- [ ] Navigation has `<nav>` or `role="navigation"`
- [ ] Footer has `<footer>` or `role="contentinfo"`
- [ ] Header has `<header>` or `role="banner"`

---

## 🧪 Testing Tools

### Automated Testing
- **axe DevTools** (Browser extension)
- **Lighthouse** (Chrome DevTools > Audits)
- **WAVE** (WebAIM browser extension)
- **Pa11y** (CLI tool)

### Manual Testing
- **Keyboard Navigation:** Tab through entire site
- **Screen Reader:** NVDA (Windows), JAWS (Windows), VoiceOver (Mac)
- **Browser Zoom:** Test at 200% zoom
- **Color Blindness:** Chrome extension ColorBlindly

### Checklist for Manual Testing
- [ ] Can complete all tasks using only keyboard
- [ ] All interactive elements have visible focus
- [ ] Screen reader announces all important info
- [ ] Form can be filled and submitted via keyboard
- [ ] Modal/menu traps focus when open
- [ ] Page is usable at 200% zoom
- [ ] Color is not the only way to convey info

---

## 📈 Priority Implementation Order

1. **Week 1:** Skip to content link + Focus trap in MobileNav (HIGH)
2. **Week 2:** FilterBar ARIA labels + VariationSelector keyboard support (HIGH)
3. **Week 3:** Color contrast audit + Image alt text improvements (MEDIUM)
4. **Week 4:** Form validation announcements + Reduced motion support (MEDIUM/LOW)
5. **Week 5:** Focus-visible improvements + Landmark regions (LOW)

---

## ✅ Acceptance Criteria (Overall)

A fully accessible site should:
- [ ] Score 90+ on Lighthouse Accessibility audit
- [ ] Pass axe DevTools automated tests with 0 critical/serious issues
- [ ] Be fully navigable via keyboard only
- [ ] Work with screen readers (NVDA/JAWS/VoiceOver)
- [ ] Meet WCAG 2.1 Level AA standards
- [ ] Respect user preferences (reduced motion, high contrast)
- [ ] Provide clear focus indicators
- [ ] Have descriptive alt text for all meaningful images
- [ ] Include skip links and focus management
- [ ] Use semantic HTML and ARIA where appropriate

---

## 📚 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Resources](https://webaim.org/resources/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [React Accessibility](https://react.dev/learn/accessibility)
- [Next.js Accessibility](https://nextjs.org/docs/accessibility)

---

## 💬 Questions?

For implementation help:
- Reference this document for specifications
- Check existing tests for patterns
- Consult WCAG guidelines for standards
- Use automated tools to verify

**Remember:** Accessibility is not a feature, it's a requirement. Making the site accessible benefits all users, not just those with disabilities.
