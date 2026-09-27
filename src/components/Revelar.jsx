import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1];

/**
 * Texto que sube desde abajo de una "ranura" (palabra por palabra).
 * El disparador es el contenedor (no la palabra escondida), así el
 * navegador detecta bien cuándo entra en pantalla.
 */
export function Linea({ texto, className = "", delay = 0, rotar = false }) {
  const palabras = texto.split(" ");
  return (
    <motion.span
      initial="fuera"
      whileInView="dentro"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      className={`inline ${className}`}
      aria-label={texto}
    >
      {palabras.map((p, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.06em] align-bottom" aria-hidden>
          <motion.span
            className="mr-[0.22em] inline-block"
            variants={{
              fuera: { y: "110%", rotate: rotar ? 6 : 0 },
              dentro: { y: "0%", rotate: 0, transition: { duration: 0.85, ease, delay: delay + i * 0.07 } },
            }}
          >
            {p}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/**
 * Firma cursiva que se "escribe" de izquierda a derecha.
 */
export function Firma({ children, className = "", delay = 0.3, bloque = false }) {
  return (
    <motion.span
      initial="fuera"
      whileInView="dentro"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      className={`${bloque ? "block" : "inline-block"} ${className}`}
    >
      <motion.span
        className="firma inline-block pr-3"
        variants={{
          fuera: { clipPath: "inset(0 100% 0 0)" },
          dentro: { clipPath: "inset(0 0% 0 0)", transition: { duration: 1.2, ease: [0.65, 0, 0.35, 1], delay } },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
