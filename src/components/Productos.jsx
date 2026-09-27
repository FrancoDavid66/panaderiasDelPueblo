import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Foto from "./Foto";
import Troquel from "./Troquel";
import { Firma, Linea } from "./Revelar";
import { PRODUCTOS } from "../data";

const ease = [0.16, 1, 0.3, 1];

// ------------------------------------------------------------
// Ticket: sale "impreso" del dispenser y se inclina en 3D con el mouse
// ------------------------------------------------------------
function Ticket({ p, i, onVisto }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotY = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 180, damping: 18 });
  const rotX = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 180, damping: 18 });
  const brilloX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const brillo = useTransform(brilloX, (x) => `radial-gradient(circle at ${x} 30%, rgba(255,255,255,0.35), transparent 55%)`);

  const mover = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const soltar = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.article
      initial="fuera"
      whileInView="dentro"
      viewport={{ once: true, amount: 0.25 }}
      className="group w-[78vw] max-w-[19rem] shrink-0 snap-center [perspective:900px] sm:w-auto sm:max-w-none"
    >
      {/* Capa "impresora": el ticket sale de arriba hacia abajo */}
      <motion.div
        variants={{
          fuera: { clipPath: "inset(-20% -20% 100% -20%)", y: -40, rotate: 0 },
          dentro: {
            clipPath: "inset(-20% -20% -20% -20%)",
            y: 0,
            rotate: i % 2 ? 1.2 : -1.2,
            transition: { duration: 1, ease: [0.65, 0, 0.35, 1], delay: (i % 4) * 0.1 },
          },
        }}
      >
        <motion.div
          onViewportEnter={() => onVisto(i)}
          viewport={{ amount: 0.7 }}
          onPointerMove={mover}
          onPointerLeave={soltar}
          style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
          whileHover={{ y: -10, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
          className="ticket relative rounded-2xl p-3 shadow-[0_30px_50px_-30px_rgba(0,0,0,0.9)]"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
            <motion.div className="h-full w-full" whileHover={{ scale: 1.08 }} transition={{ duration: 0.8, ease }}>
              <Foto
                nombre={p.foto}
                alt={p.nombre}
                sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 78vw"
                className="h-full w-full"
              />
            </motion.div>
            {p.sello && (
              <motion.span
                initial={{ scale: 2.2, opacity: 0, rotate: -25 }}
                whileInView={{ scale: 1, opacity: 1, rotate: -6 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.7 + (i % 4) * 0.1 }}
                className="absolute left-3 top-3 rounded-full bg-mostaza px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-horno shadow-lg"
              >
                {p.sello}
              </motion.span>
            )}
          </div>
          <Troquel pad={12} className="mt-5" />
          <div className="flex items-start gap-4 px-2 pb-2 pt-4">
            <div className="text-center">
              <p className="text-[0.6rem] font-bold uppercase tracking-widest text-horno/50">Nº</p>
              <p className="cartel text-4xl leading-none text-tostado">{String(i + 1).padStart(2, "0")}</p>
            </div>
            <div>
              <h3 className="cartel text-xl leading-tight">{p.nombre}</h3>
              <p className="mt-1.5 text-sm leading-snug text-horno/65">{p.detalle}</p>
            </div>
          </div>
          {/* Brillo de papel que sigue al mouse */}
          <motion.div
            style={{ background: brillo }}
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </motion.div>
      </motion.div>
    </motion.article>
  );
}

// ------------------------------------------------------------
// Visor del turnero: "Atendiendo al Nº ..." cambia según el ticket en pantalla
// ------------------------------------------------------------
function Visor({ numero }) {
  const txt = String(numero).padStart(2, "0");
  return (
    <div className="flex w-fit items-center gap-4 rounded-2xl border border-corteza bg-masa px-5 py-3">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff5a36] opacity-70" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#ff5a36]" />
      </span>
      <div>
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-miga/50">Atendiendo al</p>
        <div className="flex items-baseline gap-1">
          <span className="cartel text-lg text-miga/60">Nº</span>
          <span className="relative inline-flex h-11 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={txt}
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="cartel block text-[2.6rem] leading-[2.75rem] text-[#ff7a4d] [text-shadow:0_0_14px_rgba(255,90,54,0.7)]"
              >
                {txt}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Productos() {
  const [atendiendo, setAtendiendo] = useState(1);

  return (
    <section id="productos" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="etiqueta text-mostaza">Tome su número</p>
            <h2 className="cartel mt-4 text-5xl sm:text-7xl">
              <Linea texto="Lo que sale" />
              <br />
              <Firma className="text-mostaza">del horno</Firma>
            </h2>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <p className="max-w-sm text-miga-soft md:text-right">
              Pan y especialidades clásicas, todos los días. Pedí por número en cualquiera de nuestras sucursales.
            </p>
            <Visor numero={atendiendo} />
          </div>
        </div>
      </div>

      {/* Mobile: carrusel horizontal · Desktop: grilla */}
      <div className="sin-scroll mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 pt-2 sm:mx-auto sm:grid sm:max-w-7xl sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-6 lg:grid-cols-4">
        {PRODUCTOS.map((p, i) => (
          <Ticket key={p.nombre} p={p} i={i} onVisto={(n) => setAtendiendo(n + 1)} />
        ))}
      </div>
      <p className="mt-2 px-4 text-center text-xs text-miga/40 sm:hidden">Deslizá para ver más →</p>
    </section>
  );
}
