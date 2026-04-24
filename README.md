# 🍓 Fresas con Crema ALO

Aplicación web progresiva (PWA) completa para la gestión y recepción de pedidos de un negocio de fresas con crema. Construida con las últimas tecnologías web para ofrecer una experiencia rápida, offline-first y con un panel de administración sumamente robusto.

## 🚀 Características Principales

### Para los Clientes (Tienda Pública PWA)
- **Catálogo Dinámico:** Menú interactivo con productos, tamaños, cubiertas y toppings actualizados en tiempo real.
- **Soporte Offline (Sin Conexión):** Gracias a `IndexedDB` y Service Workers, los usuarios pueden armar su pedido y enviarlo incluso si la conexión a internet es inestable. El sistema se sincroniza en segundo plano al recuperar la conexión.
- **Instalable:** Se puede instalar como una aplicación nativa en dispositivos móviles (iOS/Android) y escritorio.
- **Integración con WhatsApp:** Envío de pedidos calculados y perfectamente formateados directamente al WhatsApp del local.
- **Diseño Premium:** Interfaz oscura, moderna, con efectos "glassmorphism", brillos neón y micro-interacciones.

### Para el Administrador (Panel ALO)
- **Punto de Venta (POS):** Interfaz ultrarrápida para tomar pedidos físicos directamente en mostrador.
- **Gestión de Pedidos (Kanban):** Control total sobre el ciclo de vida de cada orden (Pendiente, En Preparación, Enviado, Entregado, Cancelado).
- **Finanzas y Utilidad:** Registro automatizado de ingresos, creación de gastos (Insumos, Sueldos, etc.) y cálculo de la **Ganancia Libre (Utilidad Neta)** por periodo.
- **Analíticas Reales:** Gráficos interactivos (`Chart.js`) para medir el tráfico exacto de visitas por día y hora.
- **Clientes Frecuentes (CRM):** Historial inteligente que agrupa compras por número de teléfono para identificar a los mejores clientes.
- **Catálogo / Inventario (CRUD):** Administración visual para agregar o editar Tamaños, Toppings, Cubiertas y "Los Más Pedidos" (con subida de imágenes a Firebase Storage).
- **Configuraciones:** Control del logotipo, información de contacto y enlaces.
- **Imprimir Menú:** Generación de un layout en blanco y negro optimizado para impresión térmica o física.

## ⚙️ Stack Tecnológico

- **Framework Core:** Angular 21.2 (100% Signals, Standalone Components, nueva sintaxis de plantillas `@if`, `@for`).
- **Estilos:** Tailwind CSS 4 + PostCSS (Variables CSS personalizadas para el tema Neón).
- **Backend as a Service:** Firebase 11 (Firestore, Auth, Storage) integrado vía AngularFire 20.
- **Offline & PWA:** Angular Service Worker (`@angular/pwa`) + IndexedDB API nativa.
- **Gráficas:** Chart.js v4 + ng2-charts.
- **Hosting:** Optimizado para Netlify.

## 🛠️ Requisitos e Instalación

1. Asegúrate de tener **Node.js** (v20 o superior) y **Angular CLI 21**.
2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Levanta el servidor local de desarrollo:
   ```bash
   npm start
   # o
   ng serve
   ```
4. Visita `http://localhost:4200` en tu navegador.

*Nota:* Si configuras tu propio proyecto de Firebase, debes reemplazar las credenciales en `src/environments/environment.ts`.

## 🔒 Reglas de Seguridad de Firestore

El proyecto requiere reglas de base de datos específicas para funcionar (lectura pública para el catálogo, lectura/escritura privada para administración, y permisos especiales para el registro de órdenes y analíticas).
Asegúrate de copiar el contenido del archivo `firestore.rules` incluido en este repositorio directamente en la consola de Firebase -> Firestore Database -> Reglas.

## 📦 Compilación (Producción)

Para generar la versión optimizada lista para producción:
```bash
ng build
```
Los artefactos generados se guardarán en `dist/fresas-alo/browser/`.
