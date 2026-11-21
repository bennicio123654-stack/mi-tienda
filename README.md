# indumen2k 🦋

Tienda online de ropa y accesorios Y2K, con dropshipping para EE.UU., Argentina y Europa.

- **Estado:** 🟡 MODO PRUEBA. No se cobra ni se compra nada real.
- **Primer mercado:** EE.UU. (inglés, dólares, PayPal).

## Cómo probar la tienda en tu compu

### Lo que tenés que instalar (una sola vez)
1. **Node.js**: entrá a **nodejs.org**, descargá la versión que dice **LTS** e instalala (siguiente, siguiente, finalizar).
2. **El código**: en GitHub, abrí este repositorio, elegí la rama `claude/dropshipping-store-setup-s3d87e`,
   tocá el botón verde **Code → Download ZIP** y descomprimilo donde quieras.

### Cada vez que quieras ver la tienda
1. Abrí una terminal **dentro de la carpeta** del proyecto:
   - Windows: abrí la carpeta, hacé clic en la barra de direcciones, escribí `cmd` y Enter.
   - Mac: clic derecho en la carpeta → *Nuevo terminal en la carpeta*.
2. La primera vez, escribí esto y Enter (descarga las piezas que usa la tienda; tarda 1 o 2 minutos):
   ```
   npm install
   ```
3. Para prender la tienda:
   ```
   npm run dev
   ```
4. Abrí el navegador en **http://localhost:3000**
5. Para apagarla: volvé a la terminal y apretá `Ctrl + C`.

### Comandos útiles
| Comando | Qué hace |
|---|---|
| `npm run dev` | Prende la tienda en tu compu |
| `npm run verificar` | Revisa que tus claves del `.env` funcionen (no compra ni cobra nada) |

## Dónde está cada cosa

| Quiero cambiar... | Archivo |
|---|---|
| Costos de envío, cotizaciones, qué mercados venden | `src/config/markets.ts` |
| Nombre y slogan de la tienda | `src/config/store.ts` |
| Textos de la web (inglés y español) | `src/i18n/messages.ts` |
| Productos (por ahora de ejemplo) | `src/data/products.ts` |
| Claves secretas | `.env` (ver [docs/CLAVES.md](docs/CLAVES.md)) |

## Seguridad
- Las claves van **solo** en `.env`, que está bloqueado para que nunca se suba a GitHub.
- `.env.example` es una plantilla **sin** claves reales.
