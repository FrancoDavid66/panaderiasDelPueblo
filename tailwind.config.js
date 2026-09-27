/** @type {import('tailwindcss').Config} */
// ============================================================
// PANADERÍAS DEL PUEBLO — Identidad visual
// Paleta sacada del logo (mostaza) + fotos (horno, madera, harina)
// ============================================================
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Anton = carteles de panadería / titulares grandes
        cartel: ["Anton", "Impact", "sans-serif"],
        // Yellowtail = firma cursiva, eco del logo "del Pueblo"
        firma: ["Yellowtail", "cursive"],
        // Work Sans = cuerpo
        sans: ["'Work Sans'", "system-ui", "sans-serif"],
      },
      colors: {
        horno: "#15100D",    // fondo principal (horno apagado)
        masa: "#211813",     // superficies / tarjetas
        corteza: "#3A2A22",  // bordes cálidos / contraste
        mostaza: "#D9A648",  // color del logo (acento principal)
        dorado: "#EBC77A",   // mostaza clara (hover / brillos)
        tostado: "#A8722F",  // mostaza profunda
        miga: "#F4EBDC",     // crema (texto principal)
        harina: "#FFFDF8",   // blanco cálido
        "miga-soft": "#C9BBA6", // texto secundario
      },
      transitionTimingFunction: {
        horno: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        flotar: {
          "0%, 100%": { transform: "translateY(0) rotate(-6deg)" },
          "50%": { transform: "translateY(-10px) rotate(-4deg)" },
        },
        latido: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(217,166,72,0.45)" },
          "50%": { boxShadow: "0 0 0 10px rgba(217,166,72,0)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "marquee-lento": "marquee 45s linear infinite",
        flotar: "flotar 6s ease-in-out infinite",
        latido: "latido 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
