# 🗺️ Plan de indumen2k (presupuesto cero)

Todo lo que usamos tiene plan gratis. Nada se paga hasta que lo decidas vos.

| Necesidad | Servicio | Costo |
|---|---|---|
| Proveedor | CJ Dropshipping (API) | Gratis. Pagás cada pedido **después** de que el cliente te pagó |
| Hosting (web en internet) | Netlify (plan gratis, permite vender) | Gratis |
| Dirección web | `indumen2k.netlify.app` | Gratis (dominio propio `.com`: ~USD 10/año, opcional y más adelante) |
| Base de datos | Supabase o Neon (plan gratis) | Gratis |
| Mails | Resend (3.000/mes) | Gratis |
| Cobros | PayPal / Mercado Pago | Solo comisión por venta, nada fijo |
| Publicidad | TikTok / Instagram orgánico (sin pagar anuncios) | Gratis |

> Cambio respecto del plan original: para publicar usamos **Netlify** en vez de Vercel,
> porque el plan gratis de Vercel no permite tiendas que venden.

## Etapas
| # | Etapa | Estado |
|---|---|---|
| 0 | Cuentas y claves | ✅ |
| 1 | Esqueleto de la tienda (país, idioma, moneda, carrito) | ✅ |
| 2 | Comparador de proveedores (CJ) | ✅ código listo — falta probarlo con tu clave |
| 3 | Pagos EE.UU. con PayPal (sandbox) + webhook | ⏳ |
| 4 | Pedidos pendientes de tu aprobación + mail + panel | ⏳ |
| 5 | Páginas legales EE.UU. | ⏳ |
| 6 | Publicar en Netlify (modo prueba) | ⏳ pide tu OK |
| 7-8 | Sumar Europa y Argentina | ⏳ |
| 9 | Producción (cobros reales) | ⏳ solo cuando digas |

## ⚠️ El riesgo principal sin plata: el "bache" de caja
1. El cliente te paga, por ejemplo, USD 16 por PayPal.
2. Para que CJ despache, tenés que pagarle a CJ (por ejemplo USD 6,30) **en ese momento**.
3. PayPal suele **retener** la plata de vendedores nuevos varios días (a veces hasta 21).

Sin ahorro, esa plata retenida puede trabar el primer pedido. Cómo achicar el riesgo:
- Arrancar con **productos baratos** (costo total menor a USD 10): el comparador ya filtra por precio.
- Cargar el número de seguimiento apenas CJ despacha: PayPal suele liberar antes.
- Juntar las primeras ganancias como colchón antes de sumar productos caros.
