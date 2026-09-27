import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useScroll, useTransform } from "framer-motion";
import Foto from "./Foto";
import { Linea } from "./Revelar";
import { SUCURSALES } from "../data";

const ease = [0.16, 1, 0.3, 1];

const PILARES = [
  { t: "Calidad", d: "Cuidamos cada detalle, desde la masa hasta la presentación final." },
  { t: "Tradición", d: "Recetas y procesos de panadería de barrio, como se hicieron siempre." },
  { t: "Abundancia", d: "Facturas grandes de verdad. Acá nadie se queda con hambre." },
];

const TEXTO =
  "Horneamos todos los días pan y especialidades clásicas para que tengas lo mejor, recién salido del horno. Desde las facturas o los criollitos para el mate, hasta el sándwich perfecto o la pizza para tu almuerzo. Nuestra comunidad nos reconoce por la calidad, la tradición y la abundancia.";

// Una palabra que se "tuesta" (se enciende) a medida que scrolleás
function Palabra({ children, progreso, rango }) {
  const opacidad = useTransform(progreso, rango, [0.15, 1]);
  return (
    <motion.span style={{ opacity: opacidad }} className="mr-[0.28em] inline-block">
      {children}
    </motion.span>
  );
}

function TextoQueSeTuesta() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const palabras = TEXTO.split(" ");
  return (
    <p ref={ref} className="mt-7 text-xl leading-relaxed sm:text-2xl">
      {palabras.map((p, i) => (
        <Palabra key={i} progreso={scrollYProgress} rango={[i / palabras.length, (i + 1) / palabras.length]}>
          {p}
        </Palabra>
      ))}
    </p>
  );
}

// Número que cuenta desde 0 cuando aparece
function Contador({ hasta }) {
  const ref = useRef(null);
  const visto = useInView(ref, { once: true });
  const v = useMotionValue(0);
  const texto = useTransform(v, (x) => Math.round(x));
  useEffect(() => {
    if (visto) animate(v, hasta, { duration: 1.6, ease });
  }, [visto, hasta, v]);
  return <motion.span ref={ref}>{texto}</motion.span>;
}

export default function Nosotros() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const giroSello = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const yFoto = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={ref} id="nosotros" className="relative overflow-hidden bg-miga px-4 py-24 text-horno sm:px-6 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div className="relative order-2 lg:order-1">
          {/* Puerta del horno que se abre desde el centro */}
          <motion.div style={{ y: yFoto }} initial="fuera" whileInView="dentro" viewport={{ once: true, margin: "-100px" }}>
            <motion.div
              variants={{
                fuera: { clipPath: "inset(50% 0 50% 0 round 2rem)" },
                dentro: { clipPath: "inset(0% 0 0% 0 round 2rem)", transition: { duration: 1.3, ease: [0.76, 0, 0.24, 1] } },
              }}
              className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[2rem]"
            >
              <motion.div
                variants={{ fuera: { scale: 1.4 }, dentro: { scale: 1, transition: { duration: 1.8, ease } } }}
                className="h-full w-full"
              >
                <Foto
                  nombre="foto8"
                  alt="Pila de figazas recién horneadas"
                  sizes="(min-width:1024px) 28rem, 90vw"
                  className="h-full w-full"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Sello que gira con el scroll */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.6 }}
            className="absolute -right-2 -top-6 flex h-32 w-32 items-center justify-center rounded-full bg-horno text-center text-mostaza shadow-xl sm:right-8 sm:h-36 sm:w-36"
          >
            <motion.svg style={{ rotate: giroSello }} viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              <defs>
                <path id="circulo" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text fontSize="8.6" fontWeight="700" fill="currentColor">
                <textPath href="#circulo" textLength="232" lengthAdjust="spacing">
                  RECIÉN HORNEADO • DEL PUEBLO •
                </textPath>
              </text>
            </motion.svg>
            <span className="relative leading-none">
              <span className="cartel block text-4xl text-miga">
                <Contador hasta={SUCURSALES.length} />
              </span>
              <span className="block text-[0.55rem] font-bold uppercase tracking-widest text-mostaza">sucursales</span>
            </span>
          </motion.div>
        </div>

        <div className="order-1 lg:order-2">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="etiqueta text-tostado"
          >
            Somos del Pueblo
          </motion.p>
          <h2 className="cartel mt-4 text-5xl sm:text-7xl">
            <Linea texto="Una panadería de" />
            <span className="relative z-0 mr-[0.22em] inline-block">
              barrio,
              {/* Swoosh del logo que se dibuja */}
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease, delay: 0.5 }}
                className="absolute -bottom-[0.1em] -left-[4%] -right-[6%] -z-10 h-[0.22em] origin-left -rotate-[2.5deg] -skew-x-[20deg] rounded-full bg-mostaza"
              />
            </span>
            <span className="inline-block">en {SUCURSALES.length} barrios</span>
          </h2>

          <TextoQueSeTuesta />

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {PILARES.map((p, i) => (
              <motion.div
                key={p.t}
                initial={{ opacity: 0, y: 40, rotate: i === 1 ? 0 : i === 0 ? -4 : 4 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                whileHover={{ y: -6, rotate: i === 1 ? 0 : i === 0 ? -1.5 : 1.5 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 140, damping: 14, delay: i * 0.12 }}
                className="rounded-2xl border border-horno/15 bg-harina/40 p-5"
              >
                <span className="firma text-2xl text-tostado">0{i + 1}</span>
                <h3 className="cartel mt-1 text-2xl">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-horno/65">{p.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
