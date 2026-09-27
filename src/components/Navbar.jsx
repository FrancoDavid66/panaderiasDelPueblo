import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import logo from "../assets/img/logo.webp";
import Foto from "./Foto";
import { LINKS, NEGOCIO, SUCURSALES } from "../data";

const ease = [0.16, 1, 0.3, 1];

// ------------------------------------------------------------
// Sección activa según el scroll (para el indicador del menú)
// ------------------------------------------------------------
function useSeccionActiva() {
  const [activa, setActiva] = useState("");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && setActiva(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return activa;
}

// ------------------------------------------------------------
// Botón hamburguesa: las dos rayas se cruzan y forman una X
// ------------------------------------------------------------
function BotonMenu({ abierto, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
      aria-expanded={abierto}
      className={`relative z-[70] flex h-12 items-center gap-3 rounded-full border pl-4 pr-3 backdrop-blur transition-colors duration-500 lg:hidden ${
        abierto ? "border-mostaza bg-mostaza" : "border-miga/20 bg-horno/60"
      }`}
    >
      <span className="relative h-5 overflow-hidden text-xs font-bold uppercase tracking-[0.2em]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={abierto ? "cerrar" : "menu"}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: -20 }}
            transition={{ duration: 0.4, ease }}
            className={`block leading-5 ${abierto ? "text-horno" : "text-miga"}`}
          >
            {abierto ? "Cerrar" : "Menú"}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className={`relative flex h-8 w-8 items-center justify-center rounded-full ${abierto ? "bg-horno" : "bg-mostaza"}`}>
        <motion.span
          className={`absolute h-0.5 w-4 rounded-full ${abierto ? "bg-mostaza" : "bg-horno"}`}
          animate={abierto ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
        />
        <motion.span
          className={`absolute h-0.5 rounded-full ${abierto ? "bg-mostaza" : "bg-horno"}`}
          animate={abierto ? { rotate: -45, y: 0, width: 16 } : { rotate: 0, y: 3, width: 10 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
        />
      </span>
    </button>
  );
}

// ------------------------------------------------------------
// Menú mobile: "se abre la puerta del horno"
// Doble cortina circular desde el botón + tickets que se dan vuelta
// ------------------------------------------------------------
const cortina = (delay) => ({
  cerrado: { clipPath: "circle(0% at calc(100% - 3.2rem) 2.6rem)", transition: { duration: 0.6, ease, delay: 0.25 - delay } },
  abierto: { clipPath: "circle(150% at calc(100% - 3.2rem) 2.6rem)", transition: { duration: 0.9, ease, delay } },
});

const lista = {
  abierto: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } },
  cerrado: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};
const item = {
  cerrado: { opacity: 0, y: 60, rotateX: -80 },
  abierto: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease } },
};

function MenuMobile({ abierto, cerrar }) {
  const [foco, setFoco] = useState(0);
  const [turno] = useState(() => Math.floor(Math.random() * 90) + 10);

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div className="fixed inset-0 z-[60] lg:hidden" initial="cerrado" animate="abierto" exit="cerrado">
          {/* Cortina 1: mostaza */}
          <motion.div variants={cortina(0)} className="absolute inset-0 bg-mostaza" />
          {/* Cortina 2: horno */}
          <motion.div variants={cortina(0.12)} className="absolute inset-0 overflow-hidden bg-horno">
            {/* Foto de fondo que cambia según el link tocado */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={foco}
                initial={{ opacity: 0, scale: 1.15 }}
                animate={{ opacity: 0.28, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease }}
                className="absolute inset-0"
              >
                <Foto nombre={LINKS[foco].foto} sizes="100vw" className="h-full w-full" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-horno via-horno/80 to-horno/40" />

            <div className="relative flex h-full flex-col px-6 pb-8 pt-24">
              <p className="etiqueta text-mostaza">¿A dónde vamos?</p>

              <motion.ul variants={lista} className="mt-6 flex flex-col gap-1 [perspective:800px]">
                {LINKS.map((l, i) => (
                  <motion.li key={l.href} variants={item} style={{ transformOrigin: "50% 100%" }}>
                    <a
                      href={l.href}
                      onClick={cerrar}
                      onPointerEnter={() => setFoco(i)}
                      onTouchStart={() => setFoco(i)}
                      className="group flex items-center gap-4 border-b border-miga/10 py-3"
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-md transition-colors duration-300 ${
                          foco === i ? "bg-mostaza text-horno" : "bg-miga/10 text-miga/60"
                        }`}
                      >
                        <span className="text-[0.45rem] font-bold leading-none tracking-widest">Nº</span>
                        <span className="cartel text-lg leading-none">0{i + 1}</span>
                      </span>
                      <span
                        className={`cartel text-[clamp(2rem,9vw,3.2rem)] transition-colors duration-300 ${
                          foco === i ? "text-mostaza" : "text-miga"
                        }`}
                      >
                        {l.label}
                      </span>
                      <motion.span
                        animate={{ x: foco === i ? 0 : -10, opacity: foco === i ? 1 : 0 }}
                        className="ml-auto text-2xl text-mostaza"
                      >
                        →
                      </motion.span>
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Pie del menú */}
              <motion.div
                variants={{
                  cerrado: { opacity: 0, y: 30 },
                  abierto: { opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.7, ease } },
                }}
                className="mt-auto"
              >
                <div className="flex items-end justify-between gap-4">
                  <div className="text-sm text-miga-soft">
                    <p className="firma text-3xl text-mostaza">Sabor, tradición y abundancia</p>
                    <p className="mt-2">{SUCURSALES.length} sucursales en CABA</p>
                    <a
                      href={`https://www.instagram.com/${NEGOCIO.instagram}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block font-semibold text-miga"
                    >
                      @{NEGOCIO.instagram}
                    </a>
                  </div>
                  {/* Ticket del turnero */}
                  <motion.div
                    variants={{
                      cerrado: { y: -120, rotate: 0 },
                      abierto: { y: 0, rotate: -8, transition: { type: "spring", stiffness: 120, damping: 12, delay: 0.9 } },
                    }}
                    className="ticket shrink-0 rounded-md px-4 py-3 text-center shadow-2xl"
                  >
                    <p className="text-[0.5rem] font-bold uppercase tracking-widest text-horno/60">Su número</p>
                    <p className="cartel text-4xl leading-none">0{turno}</p>
                  </motion.div>
                </div>
                <a href="#sucursales" onClick={cerrar} className="btn btn-mostaza mt-6 w-full">
                  Encontrá tu sucursal →
                </a>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ------------------------------------------------------------
// Navbar
// ------------------------------------------------------------
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [oculto, setOculto] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [hover, setHover] = useState(null);
  const activa = useSeccionActiva();

  const { scrollY, scrollYProgress } = useScroll();
  const progreso = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  // Se esconde al bajar, aparece al subir
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setOculto(y > 400 && y > prev && !abierto);
  });

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    const esc = (e) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [abierto]);

  return (
    <>
      <motion.header
        animate={{ y: oculto ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease }}
        className={`fixed inset-x-0 top-0 z-[65] transition-[background,padding,border-color] duration-500 ${
          scrolled && !abierto ? "border-b border-corteza bg-horno/85 py-2 backdrop-blur-md" : "border-b border-transparent py-4"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <a href="#inicio" aria-label="Panaderías del Pueblo — inicio" className="relative z-[70] shrink-0">
            <motion.img
              src={logo}
              alt="Panaderías del Pueblo"
              whileHover={{ rotate: -4, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className={`w-auto transition-all duration-500 ${scrolled ? "h-10" : "h-12 sm:h-14"} ${abierto ? "opacity-0" : ""}`}
            />
          </a>

          {/* Links desktop con "pastilla" que sigue al mouse */}
          <ul className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setHover(null)}>
            {LINKS.map((l) => (
              <li key={l.href} className="relative">
                <a
                  href={l.href}
                  onMouseEnter={() => setHover(l.href)}
                  className={`relative z-10 block px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                    hover === l.href ? "text-horno" : activa === l.href ? "text-mostaza" : "text-miga/80"
                  }`}
                >
                  {l.label}
                </a>
                {hover === l.href && (
                  <motion.span
                    layoutId="pastilla"
                    className="absolute inset-0 rounded-full bg-mostaza"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {activa === l.href && (
                  <motion.span
                    layoutId="activa"
                    className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-mostaza"
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a href="#sucursales" className={`btn btn-mostaza hidden !px-5 !py-2.5 text-sm ${abierto ? "" : "sm:inline-flex"}`}>
              Encontrá tu sucursal
            </a>
            <BotonMenu abierto={abierto} onClick={() => setAbierto((v) => !v)} />
          </div>
        </nav>

        {/* Barra de progreso: "cuánto falta para que salga del horno" */}
        <motion.div
          style={{ scaleX: progreso }}
          className="absolute bottom-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-tostado via-mostaza to-dorado"
        />
      </motion.header>

      <MenuMobile abierto={abierto} cerrar={() => setAbierto(false)} />
    </>
  );
}
