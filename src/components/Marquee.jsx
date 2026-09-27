import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

const ITEMS = ["Medialunas", "Pan francés", "Facturas XL", "Figazas", "Pepas", "Prepizzas", "Pebetes", "Criollitos", "Miñones"];

// Envuelve un valor entre min y max (para que la cinta sea infinita)
const envolver = (min, max, v) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/**
 * Cinta que cruza la página en diagonal.
 * Se acelera y se inclina según la velocidad del scroll, y cambia de sentido
 * cuando el usuario sube o baja.
 */
export default function Marquee({ invertida = false, velocidad = 3 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const velSuave = useSpring(vel, { damping: 50, stiffness: 400 });
  const factor = useTransform(velSuave, [-1000, 0, 1000], [-5, 0, 5], { clamp: false });
  const inclinacion = useTransform(velSuave, [-2000, 0, 2000], [-8, 0, 8]);
  const direccion = useRef(invertida ? -1 : 1);

  useAnimationFrame((_, delta) => {
    let mover = direccion.current * velocidad * (delta / 1000);
    if (factor.get() < 0) direccion.current = invertida ? 1 : -1;
    else if (factor.get() > 0) direccion.current = invertida ? -1 : 1;
    mover += direccion.current * mover * factor.get();
    baseX.set(baseX.get() + mover);
  });

  const x = useTransform(baseX, (v) => `${envolver(-25, 0, -v)}%`);
  const fila = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="relative z-10 overflow-hidden py-6">
      <div
        className={`-mx-[5%] w-[110%] overflow-hidden py-4 ${
          invertida ? "rotate-[1.5deg] bg-miga text-horno" : "-rotate-[1.5deg] bg-mostaza text-horno"
        }`}
      >
        <motion.div className="flex w-max" style={{ x, skewX: inclinacion }}>
          {fila.map((t, i) => (
            <span key={i} className="flex items-center">
              <span className="cartel whitespace-nowrap px-6 text-2xl sm:text-3xl">{t}</span>
              <motion.span
                className="inline-block text-xl sm:text-2xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                aria-hidden
              >
                ✦
              </motion.span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
