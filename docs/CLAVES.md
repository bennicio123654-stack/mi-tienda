# 🔑 Cómo conseguir cada clave

Todas son **gratis** y todas son **de prueba**: con ellas no se cobra ni se compra nada real.

> **Regla de oro:** las claves van **solo** en el archivo `.env` de tu compu.
> Nunca las pegues en el chat, en un mail ni en GitHub. Si alguna vez se filtra una,
> entrás al servicio, la borrás y generás otra.

## ¿Cuáles necesito ahora?

| Servicio | ¿Para qué? | ¿Cuándo? |
|---|---|---|
| CJ Dropshipping | Ver productos, precios y envíos del proveedor | **Etapa 2** (la próxima) |
| PayPal Sandbox | Cobrar en EE.UU. (en modo prueba) | Etapa 3 |
| Resend | Mandarte un mail por cada pedido | Etapa 4 |
| Base de datos | Guardar los pedidos | Etapa 4 (te guío ahí) |
| Mercado Pago | Cobrar en Argentina | Cuando sumemos Argentina |

---

## 0. Crear tu archivo `.env`

1. En la carpeta del proyecto, buscá el archivo **`.env.example`**.
2. Hacé una copia y renombrala a **`.env`** (exacto: punto, e, n, v; sin `.txt` al final).
   - En Windows, si no ves la extensión, activá *Vista → Extensiones de nombre de archivo*.
3. Abrilo con el Bloc de notas (o cualquier editor) y pegá cada clave después del `=`, sin espacios ni comillas:
   ```
   CJ_API_KEY=abc123...
   ```
4. Guardá y corré `npm run verificar` para comprobar que funcionan.

---

## 1. CJ Dropshipping → `CJ_API_KEY`

1. Entrá a **cjdropshipping.com** y creá una cuenta (gratis).
2. Ya logueado, andá a **My CJ → Authorization → API** (puede figurar como "API Key" en el menú de tu cuenta).
3. Tocá **Generate** / **Create** y copiá la clave.
4. Pegala en `.env` como `CJ_API_KEY=`.

ℹ️ CJ **no tiene modo prueba**. Por eso nuestro código, mientras estemos en modo prueba,
solo *consulta* productos y precios, y **nunca paga** pedidos en CJ. Los pedidos en CJ
solo se compran cuando vos los aprobás y pagás.

⚠️ CJ limita la cantidad de veces que se puede pedir acceso (aprox. una vez cada 5 minutos).
Si `npm run verificar` dice "too many requests", esperá un rato y probá de nuevo.

---

## 2. PayPal Sandbox → `PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET`

1. Si no tenés cuenta de PayPal, creá una en **paypal.com** (personal alcanza para probar).
2. Entrá a **developer.paypal.com** e iniciá sesión con esa cuenta.
3. Arriba, asegurate de que el interruptor diga **Sandbox** (no "Live").
4. Andá a **Apps & Credentials**. Vas a ver una app "Default Application" (o tocá **Create App**,
   nombre `indumen2k`, tipo *Merchant*).
5. Copiá el **Client ID** y el **Secret** (tocá "Show" para verlo).
6. En **Testing Tools → Sandbox Accounts** hay dos cuentas truchas ya creadas
   (una "Personal" = comprador y una "Business" = vendedor). Con la "Personal" vas a hacer
   las compras de prueba en la etapa 3.

---

## 3. Resend → `RESEND_API_KEY` y `ADMIN_EMAIL`

1. Entrá a **resend.com** y creá una cuenta (gratis: 3.000 mails por mes).
2. Andá a **API Keys → Create API Key**, permiso *Sending access*, y copiala.
3. En `ADMIN_EMAIL=` poné **tu** mail: ahí te llegan los avisos de pedidos.
   (Mientras no tengamos dominio propio, Resend solo deja mandar mails al mail con el que te registraste: usá ese.)

---

## 4. Mercado Pago (para más adelante) → `MERCADOPAGO_ACCESS_TOKEN` y `MERCADOPAGO_PUBLIC_KEY`

1. Entrá a **mercadopago.com.ar/developers** con tu cuenta de Mercado Pago.
2. **Tus integraciones → Crear aplicación** (nombre `indumen2k`, tipo *Pagos online*, *Checkout Pro*).
3. Dentro de la app: **Credenciales de prueba**. Copiá el *Access Token* y la *Public Key*.

---

## 5. Stripe (a futuro, opcional)

Stripe no permite abrir cuentas desde Argentina como persona. Si en el futuro hay una empresa
en EE.UU. (por ejemplo una LLC), se carga acá. El código ya tiene el lugar reservado.
