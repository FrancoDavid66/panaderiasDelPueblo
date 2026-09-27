import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Foto from "./Foto";
import { Firma, Linea } from "./Revelar";
import { GALERIA, NEGOCIO } from "../data";

const ease = [0.16, 1, 0.3, 1];

function useColumnas() {
  const [cols, setCols] = useState(2);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setCols(mq.matches ? 3 : 2);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return cols;
}

// Una pieza de la galería: se revela de abajo hacia arriba
function Pieza({ item, i }) {
  return (
    <motion.div initial="fuera" whileInView="dentro" viewport={{ once: true, margin: "0px 0px -40px 0px" }}>
      <motion.figure
        variants={{
          fuera: { clipPath: "inset(100% 0 0 0 round 1rem)" },
          dentro: {
            clipPath: "inset(0% 0 0 0 round 1rem)",
            transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: (i % 3) * 0.1 },
          },
        }}
        className="group relative overflow-hidden rounded-2xl border border-corteza"
      >
        <motion.div
          variants={{ fuera: { scale: 1.35 }, dentro: { scale: 1, transition: { duration: 1.6, ease } } }}
          className="overflow-hidden"
        >
          {item.video ? (
            <video
              src={item.video}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              className="aspect-[9/16] w-full object-cover"
            />
          ) : (
            <Foto
              nombre={item.foto}
              alt={item.frase}
              sizes="(min-width:1024px) 20vw, (min-width:768px) 30vw, 48vw"
              className="w-full transition-transform duration-700 ease-horno group-hover:scale-105"
            />
          )}
        </motion.div>
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-horno via-horno/70 to-transparent p-4 pt-14 sm:p-5">
          <motion.p
            variants={{
              fuera: { y: 30, opacity: 0 },
              dentro: { y: 0, opacity: 1, transition: { duration: 0.8, ease, delay: 0.6 } },
            }}
            className="cartel text-base leading-tight text-miga sm:text-xl"
          >
            {item.frase}
          </motion.p>
        </figcaption>
      </motion.figure>
    </motion.div>
  );
}

export default function Mostrador() {
  const ref = useRef(null);
  const cols = useColumnas();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const suave = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  // Cada columna viaja a distinta velocidad (efecto muro con profundidad)
  const velocidades = [
    useTransform(suave, [0, 1], [60, -140]),
    useTransform(suave, [0, 1], [-40, 120]),
    useTransform(suave, [0, 1], [100, -60]),
  ];

  const columnas = Array.from({ length: cols }, (_, c) => GALERIA.map((g, i) => ({ ...g, i })).filter((g) => g.i % cols === c));

  return (
    <section ref={ref} id="mostrador" className="relative overflow-hidden bg-masa px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          {/* Columna fija con texto */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="etiqueta text-mostaza">Detrás del mostrador</p>
            <h2 className="cartel mt-4 text-5xl sm:text-7xl">
              <Linea texto="Harina, horno" rotar />
              <Firma bloque className="text-mostaza" delay={0.35}>
                y buen humor
              </Firma>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-miga-soft">
              Antes de que abra la persiana ya estamos amasando. Mirá cómo se hace el pan del Pueblo y enterate de todo lo que
              sale del horno en nuestro Instagram.
            </p>
            <motion.a
              href={`https://www.instagram.com/${NEGOCIO.instagram}/`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-mostaza mt-8"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              @{NEGOCIO.instagram}
            </motion.a>
          </div>

          {/* Muro de fotos con columnas en paralaje */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {columnas.map((col, c) => (
              <motion.div key={c} style={{ y: velocidades[c] }} className="flex flex-col gap-4">
                {col.map((item) => (
                  <Pieza key={item.i} item={item} i={item.i} />
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
