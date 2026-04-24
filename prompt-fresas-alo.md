# 🍓 PROMPT — Fresas con Crema ALO
## Proyecto Angular 21 completo con Firebase + Tailwind + Signals + PWA

---

Eres un desarrollador Angular 21 experto. Genera un proyecto Angular **completo, funcional y production-ready** llamado `fresas-alo` para un negocio de fresas con crema llamado **"Fresas con Crema ALO"**.

---

## ⚙️ Stack tecnológico

- **Angular 21.2** con standalone components, **100% Signals** (sin RxJS en componentes, solo en servicios donde sea inevitable).
- **PWA (Progressive Web App)** configurada para ser instalable e incluir soporte offline.
- **AngularFire 20 + Firebase 11** (Firestore + Auth + Storage).
- **Tailwind CSS 4** con PostCSS.
- **Chart.js + ng2-charts** para analíticas y visualización de datos.
- **WhatsApp Web API** (`wa.me`) para el envío de pedidos.
- **IndexedDB** nativo para el manejo de pedidos sin conexión y sincronización en segundo plano.
- Deploy en **Netlify** — genera `netlify.toml` y `public/_redirects`.
- **Sin librerías de UI externas** (excepto gráficas) — solo Tailwind + CSS personalizado.

---

## 📦 `package.json` — dependencias exactas a usar

```json
{
  "dependencies": {
    "@angular/common": "^21.2.4",
    "@angular/compiler": "^21.2.4",
    "@angular/core": "^21.2.4",
    "@angular/fire": "^20.0.1",
    "@angular/forms": "^21.2.4",
    "@angular/platform-browser": "^21.2.4",
    "@angular/router": "^21.2.4",
    "@angular/service-worker": "^21.2.4",
    "@tailwindcss/postcss": "^4.1.11",
    "chart.js": "^4.4.2",
    "firebase": "^11.10.0",
    "ng2-charts": "^6.0.1",
    "postcss": "^8.5.6",
    "rxjs": "~7.8.0",
    "tailwindcss": "^4.1.11",
    "tslib": "^2.3.0"
  }
}
```

---

## 🔥 Firebase — credenciales

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyD2lqaWGUeFvnFC3GRbolSdiBkoiwklUhA",
    authDomain: "logueo-8511e.firebaseapp.com",
    databaseURL: "https://logueo-8511e-default-rtdb.firebaseio.com",
    projectId: "logueo-8511e",
    storageBucket: "logueo-8511e.firebasestorage.app",
    messagingSenderId: "273658207971",
    appId: "1:273658207971:web:808bb2266b03f623b8efd6"
  },
  whatsappNumber: "527181043376"
};
```

---

## 🎨 Identidad visual — extraída del logotipo real

El logo es un emblema circular con **neón morado/púrpura brillante**, fondo gris oscuro tipo pizarra, texto en **rojo vino**, fresa ilustrada con crema blanca. Toda la UI debe reflejar esta identidad y usar un modo oscuro por defecto (Dark Mode UI con Glassmorphism).

### Paleta de colores (`styles.css`)

```css
:root {
  /* Morados neón — color dominante del logo */
  --neon:        #c026d3;   
  --neon-light:  #e879f9;   
  --neon-dark:   #86198f;   
  --neon-glow:   rgba(192, 38, 211, 0.4);

  /* Fondos oscuros */
  --bg-base:     #1a1a1f;   
  --bg-card:     #242429;   
  --bg-surface:  #2e2e35;   

  /* Rojo vino — texto y acento secundario */
  --vino:        #8b1a1a;
  --vino-claro:  #c0392b;

  /* Crema / blanco */
  --crema:       #fdf6ee;
  --blanco:      #ffffff;

  /* Texto */
  --texto-primary:   #f5f0ff;
  --texto-secondary: rgba(245, 240, 255, 0.6);
  --texto-muted:     rgba(245, 240, 255, 0.35);
}
```

### Tipografía
- **`Cinzel`** — títulos y logo (serif elegante, similar al del logo).
- **`Nunito`** — cuerpo, botones, etiquetas.

---

## 📁 Estructura de archivos completa

```
fresas-alo/
├── netlify.toml
├── public/
│   ├── _redirects
│   ├── manifest.webmanifest
│   └── logo.png
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.css
│   ├── environments/
│   │   └── environment.ts
│   └── app/
│       ├── app.component.ts
│       ├── app.config.ts
│       ├── app.routes.ts
│       ├── core/
│       │   ├── models/
│       │   │   └── product.model.ts
│       │   ├── guards/
│       │   │   └── auth.guard.ts
│       │   └── services/
│       │       ├── firebase-core.service.ts
│       │       ├── firebase.service.ts
│       │       ├── storage.service.ts
│       │       ├── auth.service.ts
│       │       ├── order.service.ts
│       │       ├── offline-sync.service.ts
│       │       └── whatsapp.service.ts
│       └── features/
│           ├── order/
│           │   ├── order-page/
│           │   └── vaso-card/
│           └── admin/
│               ├── admin-login/
│               ├── admin-layout/
│               ├── dashboard/
│               ├── pos/                  ← Punto de Venta para mostrador
│               ├── finanzas/             ← Registro de ingresos, egresos y utilidad
│               ├── pedidos/              ← Gestión de estado de pedidos (Kanban-style/lista)
│               ├── clientes/             ← CRM con historial de clientes frecuentes
│               ├── analytics/            ← Gráficas de visitas reales y métricas
│               ├── configuraciones/      ← Branding, horarios e información de contacto
│               ├── print-menu/           ← Versión imprimible del menú
│               └── products/
│                   ├── toppings-crud/
│                   ├── cubiertas-crud/
│                   ├── precios-crud/
│                   └── populares-crud/
```

---

## 🗄️ Modelos TypeScript (`product.model.ts`)

```typescript
export interface Topping {
  id: string;
  name: string;
  imageUrl: string;
  available: boolean;
  popular: boolean;
  order: number;
}

export interface Cubierta {
  id: string;
  name: string;
  imageUrl: string;
  available: boolean;
}

export interface PrecioVaso {
  id: string;
  precio: number;
  label: string;
  available: boolean;
}

export interface ProductoPopular {
  id: string;
  nombre: string;
  descripcion: string;
  imageUrl: string;
  preciosIds: string[];
  visible: boolean;
  orden: number;
}

export interface VasoPedido {
  id: string;
  productoNombre?: string;
  productoEmoji?: string;
  precio: number;
  precioLabel?: string;
  toppings: string[];
  toppingNames: string[];
  cubierta: string;
  cubiertaName: string;
  combinado: boolean;
  cantidad: number;
  notas: string;
}

export type PedidoStatus = 'pendiente' | 'recibido' | 'en_preparacion' | 'enviado' | 'entregado' | 'cancelado';

export interface Pedido {
  id: string;
  nombreCliente: string;
  telefonoCliente: string;
  vasos: VasoPedido[];
  totalVasos: number;
  totalPrecio: number;
  timestamp: Date;
  mensaje: string;
  status?: PedidoStatus;
}

export type CategoriaGasto = 'Insumos' | 'Empaques' | 'Servicios' | 'Sueldos' | 'Otros';

export interface Gasto {
  id: string;
  monto: number;
  concepto: string;
  categoria: CategoriaGasto;
  timestamp: Date;
  notas?: string;
}

export interface Visita {
  id: string;
  timestamp: Date;
}
```

---

## 🗂️ Colecciones Firestore y Reglas (`firestore.rules`)

| Colección | Contenido |
|---|---|
| `toppings` | Catálogo de toppings |
| `cubiertas` | Catálogo de cubiertas |
| `precios` | Precios y tamaños disponibles |
| `populares` | Productos destacados prearmados |
| `productos` | Catálogo base general |
| `pedidos` | Historial de órdenes de compra |
| `gastos` | Gastos del negocio (Finanzas) |
| `visits` | Historial de visitas por timestamp |
| `config` | Documentos: `branding` (logo, contacto) y `stats` (visitas totales) |

**Reglas Firestore de Seguridad** a configurar: Lectura libre para catálogos y visitas, pero escritura restringida a usuarios autenticados (excepto `pedidos` y `visits` que permiten `write: if true`).

---

## 🚀 Módulos Funcionales Clave del Admin

1. **Dashboard (`DashboardComponent`)**: Visión general con métricas (total pedidos, ingresos, productos activos).
2. **Punto de Venta (`PosComponent`)**: Permite al administrador crear pedidos de mostrador directamente desde el panel sin tener que usar WhatsApp. Actualiza la base de datos de inmediato.
3. **Gestión de Pedidos (`PedidosComponent`)**: Lista los pedidos en tiempo real. Permite cambiar el `status` del pedido (recibido, en preparación, enviado, entregado, cancelado) y eliminar órdenes.
4. **Finanzas (`FinanzasComponent`)**: Muestra ingresos (basado en pedidos "entregados" y "enviados") menos egresos (gastos creados manualmente). Permite crear nuevos gastos categorizados y calcular la Utilidad Neta en diferentes periodos (hoy, semana, mes, personalizado).
5. **Clientes Frecuentes (`ClientesComponent`)**: Consolida la información agrupando por `telefonoCliente` para mostrar cantidad de pedidos, total gastado y última fecha de compra por cliente.
6. **Analíticas (`AnalyticsComponent`)**: Usa `chart.js` para graficar el flujo de visitas a la página principal por hora y por día, usando la colección `visits`.

---

## 📱 Sincronización Offline (`OfflineSyncService`)

Implementa un servicio con IndexedDB nativo (sin RxDB) llamado `fresasAlo_offline` que intercepta la creación de pedidos en el frontend.
1. Si hay red (`navigator.onLine == true`): intenta guardar en Firebase directamente.
2. Si falla o no hay red: Guarda el pedido en IndexedDB.
3. Escucha el evento `window.addEventListener('online')` para sincronizar los pendientes con Firebase en segundo plano sin interrumpir al usuario.

---

## 📋 Reglas generales obligatorias

1. **100% Signals** — Cero `subscribe()` en componentes, cero `async pipe`. Usa `toSignal()` en servicios de datos y `signal()` / `computed()` / `effect()` en la UI.
2. **Nueva sintaxis de plantillas Angular** — `@if`, `@for`, `@switch`.
3. **Inputs/Outputs modernos** — `input()`, `input.required()`, `output()`.
4. **Standalone components** — Todo es `standalone: true`.
5. **Tailwind para maquetación** — Cero librerías como Material, PrimeNG, etc.
6. **Diseño Premium y Oscuro** — Aplica glassmorphism, sombras neón, y colores de la paleta. Todo debe verse espectacular, profesional e intuitivo.
7. **Modularidad** — La lógica de datos va en servicios (`FirebaseService`, `OrderService`, `OfflineSyncService`), los componentes solo consumen signals.
8. **Generación Completa** — Cero omisiones en los archivos generados. Todo debe estar listo para usarse.

---
*Fin del prompt actualizado.*
