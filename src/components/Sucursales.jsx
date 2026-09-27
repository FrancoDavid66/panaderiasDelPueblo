import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SUCURSALES } from "../data";
import { Firma, Linea } from "./Revelar";

const ease = [0.16, 1, 0.3, 1];

// Distancia en km entre dos coordenadas (fórmula de Haversine)
function distanciaKm(a, b) {
  const R = 6371;
  const rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const mapaUrl = (s) => `https://maps.google.com/maps?q=${s.lat},${s.lng}&z=16&output=embed`;
const comoLlegar = (s) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(s.dir + ", CABA, Argentina")}`;

// Radar que aparece mientras se busca la ubicación
function Radar() {
  return (
    <span className="relative flex h-5 w-5 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute h-5 w-5 rounded-full border-2 border-horno"
          animate={{ scale: [0.3, 1.6], opacity: [1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.45, ease: "easeOut" }}
        />
      ))}
      <span className="h-1.5 w-1.5 rounded-full bg-horno" />
    </span>
  );
}

export default function Sucursales() {
  const [yo, setYo] = useState(null);
  const [estado, setEstado] = useState("idle"); // idle | buscando | ok | error
  const [sel, setSel] = useState(0);

  const lista = useMemo(() => {
    const base = SUCURSALES.map((s, i) => ({ ...s, i, km: yo ? distanciaKm(yo, s) : null }));
    return yo ? [...base].sort((a, b) => a.km - b.km) : base;
  }, [yo]);

  const buscarCercana = () => {
    if (!navigator.geolocation) return setEstado("error");
    setEstado("buscando");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setYo(p);
        setEstado("ok");
        const masCerca = SUCURSALES.map((s, i) => ({ i, km: distanciaKm(p, s) })).sort((a, b) => a.km - b.km)[0];
        setSel(masCerca.i);
      },
      () => setEstado("error"),
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  const actual = SUCURSALES[sel];

  return (
    <section id="sucursales" className="relative px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="etiqueta text-mostaza">{SUCURSALES.length} sucursales en CABA</p>
            <h2 className="cartel mt-4 text-5xl sm:text-7xl">
              <Linea texto="Siempre hay" /> <Firma className="text-mostaza">una cerca</Firma>
            </h2>
          </div>
          <motion.button
            onClick={buscarCercana}
            disabled={estado === "buscando"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className="btn btn-mostaza self-start md:self-auto"
          >
            {estado === "buscando" ? (
              <Radar />
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                <circle cx="12" cy="12" r="8" />
              </svg>
            )}
            {estado === "buscando" ? "Buscándote…" : "¿Cuál me queda más cerca?"}
          </motion.button>
        </div>
        <AnimatePresence>
          {estado === "error" && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 text-sm text-dorado"
            >
              No pudimos acceder a tu ubicación. Elegí la sucursal de la lista para verla en el mapa.
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.ul
            layout
            initial="fuera"
            whileInView="dentro"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ dentro: { transition: { staggerChildren: 0.06 } } }}
            className="sin-scroll flex max-h-[34rem] flex-col gap-2 overflow-y-auto pr-1"
          >
            {lista.map((s, pos) => {
              const activo = s.i === sel;
              return (
                <motion.li
                  key={s.dir}
                  layout
                  variants={{ fuera: { opacity: 0, x: -40 }, dentro: { opacity: 1, x: 0 } }}
                  transition={{ layout: { type: "spring", stiffness: 300, damping: 30 }, duration: 0.6, ease }}
                >
                  <motion.button
                    onClick={() => setSel(s.i)}
                    whileHover={{ x: 6 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-corteza bg-masa p-4 text-left"
                  >
                    {/* Fondo mostaza que se desliza entre sucursales */}
                    {activo && (
                      <motion.span
                        layoutId="sucursal-activa"
                        className="absolute inset-0 bg-mostaza"
                        transition={{ type: "spring", stiffness: 350, damping: 32 }}
                      />
                    )}
                    <span
                      className={`cartel relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg transition-colors duration-300 ${
                        activo ? "bg-horno text-mostaza" : "bg-corteza text-miga"
                      }`}
                    >
                      {String(s.i + 1).padStart(2, "0")}
                    </span>
                    <span className={`relative flex-1 transition-colors duration-300 ${activo ? "text-horno" : ""}`}>
                      <span className="block font-semibold">{s.dir}</span>
                      <span className={`text-sm ${activo ? "text-horno/70" : "text-miga-soft"}`}>
                        CABA
                        {s.km != null && ` · a ${s.km < 1 ? Math.round(s.km * 1000) + " m" : s.km.toFixed(1) + " km"}`}
                        {yo && pos === 0 && " · la más cercana"}
                      </span>
                    </span>
                    <motion.span
                      aria-hidden
                      animate={{ x: activo ? 0 : -6, opacity: activo ? 1 : 0.4 }}
                      className={`relative text-xl ${activo ? "text-horno" : ""}`}
                    >
                      →
                    </motion.span>
                  </motion.button>
                </motion.li>
              );
            })}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 50, rotate: 1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
            className="overflow-hidden rounded-3xl border border-corteza bg-masa"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:h-[28rem]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={sel}
                  initial={{ clipPath: "circle(0% at 50% 50%)" }}
                  animate={{ clipPath: "circle(75% at 50% 50%)" }}
                  exit={{ opacity: 1, transition: { duration: 0.9 } }}
                  transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute inset-0"
                >
                  <iframe
                    title={`Mapa sucursal ${actual.dir}`}
                    src={mapaUrl(actual)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full grayscale-[35%] sepia-[25%]"
                  />
                </motion.div>
              </AnimatePresence>
              {/* Pin que cae sobre el mapa */}
              <motion.div
                key={`pin-${sel}`}
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.5 }}
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
              >
                <div className="flex h-10 w-10 -rotate-45 items-center justify-center rounded-full rounded-bl-none border-2 border-horno bg-mostaza shadow-xl">
                  <span className="cartel rotate-45 text-sm text-horno">P</span>
                </div>
              </motion.div>
            </div>
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={sel}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <p className="firma text-2xl text-mostaza">Panaderías del Pueblo</p>
                  <p className="cartel text-2xl">{actual.dir}</p>
                </motion.div>
              </AnimatePresence>
              <motion.a
                href={comoLlegar(actual)}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-linea"
              >
                Cómo llegar ↗
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
