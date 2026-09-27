import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Foto from "./Foto";
import { MOMENTOS } from "../data";

const ease = [0.16, 1, 0.3, 1];

// Hora actual en Buenos Aires (aunque el visitante esté en otro huso)
function horaBA() {
  try {
    return Number(
      new Intl.DateTimeFormat("es-AR", { hour: "numeric", hour12: false, timeZone: "America/Argentina/Buenos_Aires" }).format(
        new Date(),
      ),
    );
  } catch {
    return new Date().getHours();
  }
}

function momentoActual(h) {
  return MOMENTOS.find((m) => (m.desde < m.hasta ? h >= m.desde && h < m.hasta : h >= m.desde || h < m.hasta)) || MOMENTOS[0];
}

// Ángulos del sol sobre el arco (desayuno sale, cena se pone)
const ANGULOS = [-70, -23, 23, 70];

// ------------------------------------------------------------
// Reloj solar: el sol (o la luna) recorre el arco hasta el momento elegido
// ------------------------------------------------------------
function RelojSolar({ indice }) {
  const esNoche = MOMENTOS[indice].id === "cena";
  return (
    <div className="relative mx-auto h-24 w-48 sm:h-28 sm:w-56" aria-hidden>
      <svg viewBox="0 0 200 100" className="absolute inset-0 h-full w-full overflow-visible">
        <path d="M10 100 A90 90 0 0 1 190 100" fill="none" stroke="#3A2A22" strokeWidth="2" strokeDasharray="4 6" />
        {ANGULOS.map((a, i) => {
          const rad = ((a - 90) * Math.PI) / 180;
          return (
            <circle
              key={i}
              cx={100 + 90 * Math.cos(rad)}
              cy={100 + 90 * Math.sin(rad)}
              r="3"
              fill={i === indice ? "#D9A648" : "#3A2A22"}
            />
          );
        })}
      </svg>
      {/* Brazo que gira desde el centro del arco */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-[90%] w-0 origin-bottom"
        animate={{ rotate: ANGULOS[indice] }}
        transition={{ type: "spring", stiffness: 70, damping: 12 }}
      >
        <motion.div
          className="absolute -left-4 -top-4 flex h-8 w-8 items-center justify-center rounded-full"
          animate={{
            backgroundColor: esNoche ? "#F4EBDC" : "#D9A648",
            boxShadow: esNoche ? "0 0 20px rgba(244,235,220,0.5)" : "0 0 30px rgba(233,140,40,0.8)",
            rotate: -ANGULOS[indice],
          }}
          transition={{ duration: 0.6 }}
        >
          {esNoche && <span className="absolute right-0 top-0 h-6 w-6 rounded-full bg-horno" />}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function QuePinta() {
  const ahora = useMemo(() => momentoActual(horaBA()), []);
  const [activo, setActivo] = useState(ahora.id);
  const indice = MOMENTOS.findIndex((x) => x.id === activo);
  const m = MOMENTOS[indice];

  return (
    <section id="que-pinta" className="relative px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
          >
            <p className="etiqueta text-mostaza">Del desayuno a la cena</p>
            <h2 className="cartel mt-4 text-5xl sm:text-7xl">
              ¿Qué{" "}
              <motion.span
                className="firma inline-block text-mostaza"
                initial={{ rotate: -12, scale: 0.6, opacity: 0 }}
                whileInView={{ rotate: -4, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.3 }}
              >
                pinta
              </motion.span>{" "}
              ahora?
            </h2>
          </motion.div>
          <div className="flex items-end gap-6">
            <p className="max-w-[16rem] text-miga-soft">
              Ahora en Buenos Aires es hora de <strong className="text-miga">{ahora.nombre.toLowerCase()}</strong>. Te decimos qué
              llevar.
            </p>
            <div className="hidden sm:block">
              <RelojSolar indice={indice} />
            </div>
          </div>
        </div>

        {/* Selector de momento con pastilla que se desliza */}
        <div
          role="tablist"
          className="sin-scroll mt-10 flex gap-1 overflow-x-auto rounded-full border border-corteza p-1 sm:inline-flex"
        >
          {MOMENTOS.map((x) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={activo === x.id}
              onClick={() => setActivo(x.id)}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                activo === x.id ? "text-horno" : "text-miga-soft hover:text-miga"
              }`}
            >
              {activo === x.id && (
                <motion.span
                  layoutId="momento"
                  className="absolute inset-0 rounded-full bg-mostaza"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">{x.nombre}</span>
              {x.id === ahora.id && (
                <span className="absolute right-1 top-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-dorado opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-dorado" />
                </span>
              )}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease }}
          className="mt-8 grid overflow-hidden rounded-3xl border border-corteza bg-masa md:grid-cols-2"
        >
          <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[30rem]">
            {/* La foto nueva entra como una persiana */}
            <AnimatePresence initial={false}>
              <motion.div
                key={m.id}
                initial={{ clipPath: "inset(0 0 0 100%)", scale: 1.15 }}
                animate={{ clipPath: "inset(0 0 0 0%)", scale: 1 }}
                exit={{ opacity: 0.6, transition: { duration: 0.9 } }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0"
              >
                <Foto nombre={m.foto} alt={m.titulo} sizes="(min-width:768px) 50vw, 100vw" className="h-full w-full" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-4 left-4 sm:hidden">
              <div className="rounded-2xl bg-horno/80 p-2 backdrop-blur">
                <RelojSolar indice={indice} />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-12">
            <AnimatePresence mode="wait">
              <motion.div key={m.id} initial="fuera" animate="dentro" exit="salida">
                <motion.p
                  variants={{ fuera: { opacity: 0, x: -20 }, dentro: { opacity: 1, x: 0 }, salida: { opacity: 0 } }}
                  transition={{ duration: 0.5, ease }}
                  className="firma text-3xl text-mostaza"
                >
                  Hora de {m.nombre.toLowerCase()}
                </motion.p>
                <h3 className="cartel mt-3 text-4xl sm:text-5xl">
                  {m.titulo.split(" ").map((p, i) => (
                    <span key={i} className="inline-block overflow-hidden align-bottom">
                      <motion.span
                        className="mr-[0.25em] inline-block"
                        variants={{ fuera: { y: "110%" }, dentro: { y: "0%" }, salida: { y: "-110%" } }}
                        transition={{ duration: 0.6, ease, delay: i * 0.06 }}
                      >
                        {p}
                      </motion.span>
                    </span>
                  ))}
                </h3>
                <motion.p
                  variants={{ fuera: { opacity: 0, y: 16 }, dentro: { opacity: 1, y: 0 }, salida: { opacity: 0 } }}
                  transition={{ duration: 0.6, ease, delay: 0.2 }}
                  className="mt-5 text-lg leading-relaxed text-miga-soft"
                >
                  {m.texto}
                </motion.p>

                <p className="etiqueta mt-8 text-miga/50">Lo que más sale</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {m.pide.map((p, i) => (
                    <motion.li
                      key={p}
                      variants={{ fuera: { opacity: 0, scale: 0.5 }, dentro: { opacity: 1, scale: 1 }, salida: { opacity: 0 } }}
                      transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 + i * 0.08 }}
                      className="rounded-full border border-mostaza/40 px-4 py-1.5 text-sm text-dorado"
                    >
                      {p}
                    </motion.li>
                  ))}
                </ul>

                <motion.a
                  href="#sucursales"
                  whileHover={{ scale: 1.05, x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-mostaza mt-10"
                >
                  Pasá a buscarlo →
                </motion.a>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
