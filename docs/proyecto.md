# ¿Qué es Pixel Store?

**Pixel Store** es una tienda en línea de productos de Roblox: Robux (la moneda del juego), armas "Godly" de *Murder Mystery 2*, ítems in-game y coleccionables *Limited*. La página se construyó como un proyecto escolar con la idea de demostrar cómo se haría una tienda real, con catálogo, filtros, busquedas, métodos de pago por país, carrito de compras y una capa de confianza (reseñas, pedidos entregados, FAQs).

El nombre técnico del repositorio es `tienda-premium` y el título que muestra la página es **"Ladrillo: Robux e ítems de Roblox"**. El branding visual habla de "Pixel Store" (logo en `/img/logo-4x.png`), un nombre que jugaba al principio de "píxeles" y tienda.

## La idea de negocio

- ** Público objetivo**: jugadores de Roblox de Latinoamérica (y luego el mundo) que quieren comprar Robux o ítems sin pasar por los canales oficiales, con precios en moneda local y métodos de pago regionales.
- **Lo que se vende**:
  - Paquetes de Robux (400, 800, 1.700 y la opción de elegir cantidad con un slider hasta 20.000).
  - Armas de *Murder Mystery 2* (Icewing, Eternal IV, Eternal III, Eternalcane, Orange Seer, …).
  - Ítems in-game de juegos como *Blox Fruits* (+1 Fruit Storage), *Jujutsu Shenanigans* (emotes), etc.
  - Limiteds de Roblox, desde $35.
- **Propuesta de valor**: "Compra Robux e ítems baratos y seguros", con entrega rápida (15 min – 24 h), impuestos de Roblox cubiertos y soporte humano los 7 días.

## ¿Por qué existe este proyecto?

Nació como ejercicio práctico para un curso: tomar una idea de negocio (una tienda de Roblox) y materializarla en una aplicación web completa, con frontend, backend ligero, diseño responsive, animaciones y despliegue. Elcommitted history muestra tres momentos clave:

1. **Commit inicial** (`8df887b`) — el esqueleto de Next.js de `create-next-app`.
2. **Commit de seguridad antes de cambios de diseño** (`9a00cda`) — se añadió la lógica de catálogo, componentes (`Thumb`, `Flag`, `GameRail`, `CartProvider`), la API de íconos de juegos y los datos iniciales. También se guardaron dos versiones estáticas de la página (`clean.html`, `pagina-nueva.html`) como referencia visual.
3. **Commit de publicación en Vercel** (`b8a59d0`) — se aplicó el diseño completo (`ladrillo.css`, `page.tsx` con 1.270 líneas), se añadieron imágenes reales de los productos y se dejó el proyecto listo para desplegar.

## Estado actual

La aplicación está **lista para publicarse en Vercel**. Se puede ejecutar localmente con `npm run dev` (puerto 3000) y construir con `npm run build`. No requiere backend propio: la única llamada externa es la API de íconos de Roblox (`/api/game-icons`), que cachea las URLs de los íconos de los juegos durante una hora.