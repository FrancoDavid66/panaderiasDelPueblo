import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import Foto from "./Foto";
import Troquel from "./Troquel";
import { SUCURSALES } from "../data";

const ease = [0.16, 1, 0.3, 1];

// ------------------------------------------------------------
// Harina cayendo: partículas que flotan en el resplandor del horno
// ------------------------------------------------------------
function Harina({ cantidad = 26 }) {
  const granos = useMemo(
    () =>
      Array.from({ length: cantidad }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        tam: Math.random() * 3 + 1.5,
        dur: Math.random() * 10 + 9,
        delay: Math.random() * -18,
        deriva: (Math.random() - 0.5) * 80,
        op: Math.random() * 0.5 + 0.2,
      })),
    [cantidad],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {granos.map((g) => (
        <motion.span
          key={g.id}
          className="absolute -top-4 rounded-full bg-harina"
          style={{ left: `${g.x}%`, width: g.tam, height: g.tam, opacity: g.op, filter: "blur(0.5px)" }}
          animate={{ y: ["0vh", "110vh"], x: [0, g.deriva, 0] }}
          transition={{ duration: g.dur, delay: g.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// ------------------------------------------------------------
// Vapor que sale del pan caliente
// ------------------------------------------------------------
function Vapor({ className = "" }) {
  return (
    <svg viewBox="0 0 80 90" className={`pointer-events-none ${className}`} aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M${22 + i * 18} 88 C ${10 + i * 18} 70, ${34 + i * 18} 58, ${22 + i * 18} 40 S ${12 + i * 18} 14, ${24 + i * 18} 2`}
          fill="none"
          stroke="#F4EBDC"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0, y: 10 }}
          animate={{ pathLength: [0, 1, 1], opacity: [0, 0.55, 0], y: [10, -6, -18] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.9, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

// ------------------------------------------------------------
// "ABUNDANCIA": cada letra leuda (crece desde abajo con rebote)
// ------------------------------------------------------------
function PalabraQueLeuda({ texto, listo }) {
  return (
    <span className="cartel mt-1 flex text-[clamp(3.6rem,13vw,9.5rem)] text-mostaza" aria-label={texto}>
      {texto.split("").map((l, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.04em]" aria-hidden>
          <motion.span
            className="inline-block origin-bottom"
            initial={{ y: "105%", scaleY: 0.4, scaleX: 1.3 }}
            animate={listo ? { y: "0%", scaleY: 1, scaleX: 1 } : {}}
            transition={{ type: "spring", stiffness: 260, damping: 13, mass: 0.9, delay: 0.25 + i * 0.055 }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ------------------------------------------------------------
// Ticket del turnero: llama números y se inclina siguiendo el mouse
// ------------------------------------------------------------
function Turnero({ listo }) {
  const [n, setN] = useState(47);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });

  useEffect(() => {
    const t = setInterval(() => setN((v) => (v >= 99 ? 1 : v + 1)), 2600);
    return () => clearInterval(t);
  }, []);

  const mover = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 30);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 30);
  };
  const num = String(n).padStart(3, "0");

  return (
    <motion.div
      initial={{ y: -260, rotate: 0, opacity: 0 }}
      animate={listo ? { y: 0, rotate: -6, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 90, damping: 11, delay: 0.9 }}
      style={{ perspective: 600 }}
    >
      <motion.div
        onPointerMove={mover}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        whileTap={{ scale: 0.95 }}
        onTap={() => setN((v) => (v >= 99 ? 1 : v + 1))}
        className="ticket w-48 cursor-pointer rounded-md px-5 pb-4 pt-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] sm:w-60"
      >
        <p className="etiqueta text-center !text-[0.55rem] !tracking-[0.25em] text-tostado">Panaderías del Pueblo</p>
        <p className="mt-2 text-center text-xs font-semibold uppercase tracking-widest text-horno/60">Su número</p>
        <div className="relative mt-1 h-[4.2rem] overflow-hidden text-center sm:h-20">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={num}
              initial={{ rotateX: -90, y: "60%", opacity: 0 }}
              animate={{ rotateX: 0, y: 0, opacity: 1 }}
              exit={{ rotateX: 90, y: "-60%", opacity: 0 }}
              transition={{ duration: 0.6, ease }}
              className="cartel block text-6xl leading-none text-horno sm:text-7xl"
              style={{ transformOrigin: "50% 50%" }}
            >
              {num}
            </motion.span>
          </AnimatePresence>
        </div>
        <Troquel pad={20} className="mt-3" muescas={false} />
        <p className="firma pt-3 text-center text-2xl leading-none text-tostado">¡Recién horneado!</p>
      </motion.div>
    </motion.div>
  );
}

// ------------------------------------------------------------
// HERO
// ------------------------------------------------------------
export default function Hero({ listo = true }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yTexto = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opTexto = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const yArco = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yCanasta = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const escalaArco = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const aparecer = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: listo ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1, ease, delay },
  });

  return (
    <section ref={ref} id="inicio" className="relative flex items-center overflow-hidden pt-28 sm:pt-32 lg:min-h-[100svh]">
      {/* Resplandor de horno que "respira" */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-40 top-10 h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(233,140,40,0.3),transparent_62%)]"
      />
      <div className="pointer-events-none absolute -left-60 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(217,166,72,0.12),transparent_65%)]" />
      <Harina />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pb-20">
        {/* Texto */}
        <motion.div style={{ y: yTexto, opacity: opTexto }}>
          <motion.p {...aparecer(0.1)} className="etiqueta flex items-center gap-3 text-mostaza">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={listo ? { scaleX: 1 } : {}}
              transition={{ duration: 1, ease, delay: 0.1 }}
              className="h-px w-10 origin-left bg-mostaza"
            />
            Panadería en CABA · {SUCURSALES.length} sucursales
          </motion.p>

          <h1 className="mt-6">
            {/* La firma se "escribe" de izquierda a derecha */}
            <motion.span
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={listo ? { clipPath: "inset(0 0% 0 0)" } : {}}
              transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
              className="firma block whitespace-nowrap pr-4 text-[2.6rem] text-miga sm:text-6xl"
            >
              Sabor, tradición y
            </motion.span>
            <PalabraQueLeuda texto="Abundancia" listo={listo} />
          </h1>

          <motion.p {...aparecer(0.9)} className="mt-6 max-w-lg text-lg leading-relaxed text-miga-soft">
            Las <strong className="font-semibold text-miga">facturas más grandes y deliciosas de CABA</strong> y pan fresco todos
            los días, recién salido del horno. Del desayuno a la cena, estamos en tu barrio.
          </motion.p>

          <motion.div {...aparecer(1.05)} className="mt-9 flex flex-wrap gap-3">
            <motion.a
              href="#sucursales"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-mostaza animate-latido"
            >
              Ver sucursales <span aria-hidden>→</span>
            </motion.a>
            <motion.a href="#productos" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-linea">
              Sacá número
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Imágenes + turnero */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          {/* Arco del horno: se abre de abajo hacia arriba */}
          <motion.div
            style={{ y: yArco }}
            initial={{ clipPath: "inset(100% 0 0 0 round 999px 999px 0 0)" }}
            animate={listo ? { clipPath: "inset(0% 0 0 0 round 999px 999px 0 0)" } : {}}
            transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
            className="relative ml-auto aspect-[4/5] w-[82%] overflow-hidden rounded-t-full border border-corteza"
          >
            <motion.div style={{ scale: escalaArco }} className="h-full w-full">
              <Foto
                nombre="foto2"
                alt="Bandejas de pan dentro del horno"
                prioridad
                sizes="(min-width:1024px) 35vw, 80vw"
                className="h-full w-full"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-horno/70 via-transparent to-transparent" />
          </motion.div>

          {/* Canasta con vapor */}
          <motion.div
            style={{ y: yCanasta }}
            initial={{ opacity: 0, x: -60, rotate: -12 }}
            animate={listo ? { opacity: 1, x: 0, rotate: -3 } : {}}
            transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.7 }}
            className="absolute -left-2 bottom-10 w-[38%] sm:left-0"
          >
            <Vapor className="absolute -top-16 left-1/2 h-20 w-16 -translate-x-1/2" />
            <div className="overflow-hidden rounded-2xl border-4 border-horno shadow-2xl">
              <Foto
                nombre="foto3"
                alt="Canasta de pan fresco"
                sizes="(min-width:1024px) 15vw, 38vw"
                className="aspect-square w-full"
              />
            </div>
          </motion.div>

          <div className="absolute -top-4 right-0 sm:-right-4">
            <Turnero listo={listo} />
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <motion.a
        href="#que-pinta"
        initial={{ opacity: 0 }}
        animate={listo ? { opacity: 1 } : {}}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-miga/50 lg:flex"
        aria-label="Bajar"
      >
        <span className="etiqueta !text-[0.6rem]">Bajá</span>
        <span className="flex h-10 w-6 justify-center rounded-full border border-miga/30 pt-2">
          <motion.span
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-1 rounded-full bg-mostaza"
          />
        </span>
      </motion.a>
    </section>
  );
}
