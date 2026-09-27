import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import logo from "../assets/img/logo.webp";

const ease = [0.76, 0, 0.24, 1];

// Solo se muestra la primera vez en la sesión
function yaVisto() {
  try {
    return sessionStorage.getItem("pueblo-horno") === "1";
  } catch {
    return false;
  }
}

/**
 * Pantalla de carga "El horno": el logo leuda (se llena de abajo hacia arriba)
 * mientras corre el termómetro, y después se abre la puerta del horno.
 */
export default function Loader({ onFin }) {
  const [visible, setVisible] = useState(() => !yaVisto());
  const progreso = useMotionValue(0);
  const porcentaje = useTransform(progreso, (v) => `${Math.round(v * 2.2)}°`); // sube hasta 220°, temperatura de horno
  const termometro = useTransform(progreso, [0, 100], [0, 1]);
  const relleno = useTransform(progreso, [0, 100], ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]);

  useEffect(() => {
    if (!visible) {
      onFin?.();
      return;
    }
    document.body.style.overflow = "hidden";
    const ctrl = animate(progreso, 100, {
      duration: 1.6,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        try {
          sessionStorage.setItem("pueblo-horno", "1");
        } catch {
          /* sin storage: no pasa nada */
        }
        setTimeout(() => setVisible(false), 250);
      },
    });
    return () => ctrl.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
        onFin?.();
      }}
    >
      {visible && (
        <motion.div
          key="horno"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          exit={{ pointerEvents: "none" }}
        >
          {/* Puerta del horno: dos hojas que se abren */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-horno"
            exit={{ y: "-100%", transition: { duration: 0.9, ease } }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-horno"
            exit={{ y: "100%", transition: { duration: 0.9, ease } }}
          />
          {/* Resplandor que se ve al abrir */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle,rgba(233,140,40,0.35),transparent_60%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
          />

          <motion.div
            className="relative flex flex-col items-center"
            exit={{ scale: 1.4, opacity: 0, transition: { duration: 0.5, ease } }}
          >
            <div className="relative w-56 sm:w-72">
              {/* Logo "crudo" (apagado) */}
              <img src={logo} alt="" className="w-full opacity-15 grayscale" />
              {/* Logo "horneado" que sube como la masa */}
              <motion.img
                src={logo}
                alt="Panaderías del Pueblo"
                style={{ clipPath: relleno }}
                className="absolute inset-0 w-full"
              />
            </div>

            <div className="mt-8 flex items-center gap-3 text-miga-soft">
              <span className="etiqueta">Horneando</span>
              <motion.span className="cartel w-16 text-2xl text-mostaza">{porcentaje}</motion.span>
            </div>
            {/* Termómetro */}
            <div className="mt-3 h-1 w-48 overflow-hidden rounded-full bg-miga/10">
              <motion.div style={{ scaleX: termometro }} className="h-full origin-left bg-mostaza" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
