/**
 * DATOS GENERALES DE LA TIENDA
 * Cambiá acá el nombre, el slogan o el mail de contacto.
 */
export const STORE = {
  name: "indumen2k",
  tagline: {
    en: "Y2K fashion & accessories, straight from the 2000s",
    es: "Ropa y accesorios Y2K, directo de los 2000s",
  },
  // Mail que ven los clientes para consultas (cambialo por el tuyo cuando lo tengas)
  contactEmail: "hola@indumen2k.com",
};

/**
 * MODO PRUEBA
 * Mientras esto no diga "production" en el .env, la tienda usa los entornos
 * de prueba (sandbox) de PayPal, Mercado Pago y CJ, y no se cobra nada real.
 */
export const IS_PRODUCTION = process.env.STORE_MODE === "production";
