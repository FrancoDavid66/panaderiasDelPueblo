import { useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import QuePinta from "./components/QuePinta";
import Nosotros from "./components/Nosotros";
import Productos from "./components/Productos";
import Mostrador from "./components/Mostrador";
import Sucursales from "./components/Sucursales";
import Franquicias from "./components/Franquicias";
import Footer from "./components/Footer";
import { NEGOCIO } from "./data";

export default function App() {
  // El hero arranca sus animaciones cuando se abre la puerta del horno (Loader)
  const [listo, setListo] = useState(false);

  return (
    // reducedMotion="user": si el visitante pidió menos movimiento en su sistema, se respeta
    <MotionConfig reducedMotion="user">
      <div className="grano">
        <Loader onFin={() => setListo(true)} />
        <Navbar />
        <main>
          <Hero listo={listo} />
          <Marquee />
          <QuePinta />
          <Nosotros />
          <Productos />
          <Marquee invertida />
          <Mostrador />
          <Sucursales />
          <Franquicias />
        </main>
        <Footer />

        {/* WhatsApp flotante: aparece solo si se carga el número en data.js */}
        {NEGOCIO.whatsapp && (
          <motion.a
            href={`https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent("¡Hola! Quiero hacer un pedido 🥐")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escribinos por WhatsApp"
            initial={{ scale: 0, rotate: -90 }}
            animate={listo ? { scale: 1, rotate: 0 } : {}}
            whileHover={{ scale: 1.12, rotate: 8 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 14, delay: 1.8 }}
            className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-mostaza text-horno shadow-xl"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.8-1.1-4.6-4-4.8-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.1.1.6-.1 1.2Z" />
            </svg>
          </motion.a>
        )}
      </div>
    </MotionConfig>
  );
}
