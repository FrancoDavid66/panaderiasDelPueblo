// ============================================================
// DATOS DEL NEGOCIO — todo lo editable está acá
// Las fotos se nombran por archivo: "medialunas" = src/assets/fotos/medialunas-*.avif/webp
// ============================================================

export const NEGOCIO = {
  nombre: "Panaderías del Pueblo",
  instagram: "panaderiasdelpueblo",
  email: "delpueblopanaderias@gmail.com",
  emailFranquicias: "panaderiasdelpueblo@hotmail.com",
  // Completar con el número real (formato internacional sin +, ej: 5491122334455).
  // Si queda vacío, no se muestra el botón flotante de WhatsApp.
  whatsapp: "",
};

// ------------------------------------------------------------
// PRODUCTOS — cada uno es un "número" del turnero
// ------------------------------------------------------------
export const PRODUCTOS = [
  {
    nombre: "Medialunas y Facturas",
    detalle: "Grandes de verdad. De manteca, de grasa, con dulce de leche o crema pastelera.",
    foto: "medialunas",
    sello: "La estrella",
  },
  {
    nombre: "Pan Francés y Miñones",
    detalle: "Corteza que cruje y miga tierna. Horneado varias veces por día.",
    foto: "foto5",
    sello: "Todos los días",
  },
  {
    nombre: "Figazas y Hamburguesas",
    detalle: "Suaves y esponjosas, para el sándwich de mediodía o la parrilla del finde.",
    foto: "hamburguesas",
  },
  {
    nombre: "Pepas",
    detalle: "Con membrillo, hechas a mano, de las que se terminan en el primer mate.",
    foto: "pepas",
    sello: "Hechas a mano",
  },
  {
    nombre: "Pre Pizzas y Pizzetas",
    detalle: "Con salsa, listas para el horno. La cena resuelta en quince minutos.",
    foto: "prepizzas",
  },
  {
    nombre: "Pancitos con Salvado",
    detalle: "Una opción más liviana, con todo el sabor del pan recién hecho.",
    foto: "salvado",
  },
  {
    nombre: "Mini Pebetes",
    detalle: "Para cumpleaños, reuniones y picadas. Encargalos con anticipación.",
    foto: "pebetes",
  },
  {
    nombre: "Especialidades",
    detalle: "Criollitos, bizcochitos y lo que salga del horno según el día.",
    foto: "foto3",
  },
];

// ------------------------------------------------------------
// ¿QUÉ PINTA AHORA? — según la hora del día
// ------------------------------------------------------------
export const MOMENTOS = [
  {
    id: "desayuno",
    nombre: "Desayuno",
    desde: 5,
    hasta: 11,
    titulo: "Medialunas recién salidas",
    texto: "Un café con leche y una docena de medialunas del Pueblo. Así arranca el barrio.",
    pide: ["Medialunas", "Facturas", "Pan francés"],
    foto: "medialunas",
  },
  {
    id: "almuerzo",
    nombre: "Almuerzo",
    desde: 11,
    hasta: 15,
    titulo: "El sándwich perfecto",
    texto: "Pebetes, figazas y pan del día para armar el almuerzo sin vueltas.",
    pide: ["Mini pebetes", "Figazas", "Miñones"],
    foto: "pebetes",
  },
  {
    id: "merienda",
    nombre: "Merienda",
    desde: 15,
    hasta: 20,
    titulo: "Llegó la hora del mate",
    texto: "Criollitos, pepas y facturas grandes. La merienda como tiene que ser: abundante.",
    pide: ["Facturas", "Pepas", "Criollitos"],
    foto: "pepas",
  },
  {
    id: "cena",
    nombre: "Cena",
    desde: 20,
    hasta: 5,
    titulo: "La cena resuelta",
    texto: "Una prepizza al horno, pan para acompañar y el postre para después.",
    pide: ["Prepizzas", "Pan francés", "Hamburguesas"],
    foto: "prepizzas",
  },
];

// ------------------------------------------------------------
// DETRÁS DEL MOSTRADOR — galería
// Fotos: { foto: "nombre", frase }
// Videos (reels descargados): poné el .mp4 en /public/videos y usá
// { video: "/videos/mi-reel.mp4", poster: "foto1", frase: "..." }
// ------------------------------------------------------------
export const GALERIA = [
  { foto: "foto1", frase: "5 AM. El horno ya está prendido." },
  { foto: "foto10", frase: "El jefe solo nos deja comer las que están rotas." },
  { foto: "foto11", frase: "Miga de verdad." },
  { foto: "foto8", frase: "Cuando decimos grandes, es grandes." },
  { foto: "foto4", frase: "Pan francés, versión del Pueblo." },
  { foto: "foto12", frase: "Recién salidos." },
  { foto: "foto9", frase: "Criollitos para el mate." },
  { foto: "foto7", frase: "Harina, agua, sal y oficio." },
];

// ------------------------------------------------------------
// SUCURSALES (coordenadas reales de la web actual)
// ------------------------------------------------------------
export const SUCURSALES = [
  { dir: "Av. Independencia 1202", lat: -34.6179184, lng: -58.383173 },
  { dir: "Av. Rivadavia 3164", lat: -34.6106177, lng: -58.4111267 },
  { dir: "Ayacucho 429", lat: -34.6039801, lng: -58.3952546 },
  { dir: "Bolívar 1823", lat: -34.6298318, lng: -58.3721053 },
  { dir: "Bartolomé Mitre 1423", lat: -34.6075609, lng: -58.3866997 },
  { dir: "Av. San Juan 2824", lat: -34.6242307, lng: -58.4039591 },
  { dir: "Av. Entre Ríos 1012", lat: -34.6204696, lng: -58.3913977 },
  { dir: "Av. Rivadavia 2286", lat: -34.6097913, lng: -58.3988326 },
  { dir: "Av. San Juan 3764", lat: -34.6258912, lng: -58.4183485 },
];

// Links del menú (id de sección + foto que se ve en el menú mobile)
export const LINKS = [
  { href: "#que-pinta", label: "¿Qué pinta?", foto: "pepas" },
  { href: "#productos", label: "Productos", foto: "medialunas" },
  { href: "#mostrador", label: "Detrás del mostrador", foto: "foto1" },
  { href: "#sucursales", label: "Sucursales", foto: "foto3" },
  { href: "#franquicias", label: "Franquicias", foto: "foto10" },
];
