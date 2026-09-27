import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import Foto from "./Foto";
import { Firma, Linea } from "./Revelar";
import { NEGOCIO } from "../data";

const ease = [0.16, 1, 0.3, 1];

// Botón "magnético": se acerca al cursor cuando pasás cerca
function BotonMagnetico({ children, className = "", ...props }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 15 });
  const sy = useSpring(y, { stiffness: 250, damping: 15 });
  return (
    <motion.button
      {...props}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.25);
        y.set((e.clientY - r.top - r.height / 2) * 0.4);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

export default function Franquicias() {
  const ref = useRef(null);
  const [form, setForm] = useState({ nombre: "", zona: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const xMarca = useTransform(scrollYProgress, [0, 1], ["20%", "-30%"]);
  const rotFoto = useTransform(scrollYProgress, [0, 1], [-8, 6]);

  // Arma un mail listo para enviar (sin servidores ni claves)
  const enviar = (e) => {
    e.preventDefault();
    const asunto = `Franquicia Del Pueblo — ${form.nombre || "Consulta"}`;
    const cuerpo = `Nombre: ${form.nombre}\nZona de interés: ${form.zona}\n\n${form.mensaje}`;
    setEnviado(true);
    setTimeout(() => {
      window.location.href = `mailto:${NEGOCIO.emailFranquicias}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(
        cuerpo,
      )}`;
    }, 700);
  };

  const input =
    "w-full rounded-xl border-2 border-horno/15 bg-harina/60 px-4 py-3.5 text-horno placeholder:text-horno/40 outline-none transition-colors focus:border-horno";

  const campo = {
    fuera: { opacity: 0, y: 24 },
    dentro: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  };

  return (
    <section ref={ref} id="franquicias" className="relative overflow-hidden bg-mostaza px-4 py-24 text-horno sm:px-6 lg:py-32">
      {/* Palabra gigante que se desliza con el scroll */}
      <motion.p
        aria-hidden
        style={{ x: xMarca }}
        className="firma pointer-events-none absolute -bottom-10 left-0 select-none whitespace-nowrap text-[12rem] leading-none text-horno/[0.08] sm:text-[22rem]"
      >
        del Pueblo
      </motion.p>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <p className="etiqueta">Franquicias</p>
          <h2 className="cartel mt-4 text-5xl sm:text-7xl">
            <Linea texto="Llevá el Pueblo" />
            <Firma bloque className="text-harina">
              a tu barrio
            </Firma>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-horno/75">
            Sumate a una marca que el barrio ya conoce: productos que se venden solos, recetas probadas y el acompañamiento de un
            equipo que vive la panadería todos los días.
          </p>
          <motion.div
            style={{ rotate: rotFoto }}
            className="mt-8 hidden max-w-sm overflow-hidden rounded-2xl shadow-2xl lg:block"
          >
            <Foto nombre="foto10" alt="Criollitos recién horneados" sizes="24rem" className="aspect-[3/2] w-full" />
          </motion.div>
        </div>

        <motion.form
          onSubmit={enviar}
          initial="fuera"
          whileInView="dentro"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ dentro: { transition: { staggerChildren: 0.1 } } }}
          className="relative overflow-hidden rounded-3xl bg-miga p-6 shadow-[0_40px_80px_-30px_rgba(21,16,13,0.5)] sm:p-10"
        >
          <motion.p variants={campo} className="cartel text-3xl">
            Quiero mi franquicia
          </motion.p>
          <motion.p variants={campo} className="mt-2 text-sm text-horno/60">
            Completá tus datos y te contactamos.
          </motion.p>
          <div className="mt-7 flex flex-col gap-4">
            <motion.input
              variants={campo}
              required
              className={input}
              placeholder="Nombre y apellido"
              value={form.nombre}
              onChange={set("nombre")}
            />
            <motion.input
              variants={campo}
              required
              className={input}
              placeholder="Zona o barrio de interés"
              value={form.zona}
              onChange={set("zona")}
            />
            <motion.textarea
              variants={campo}
              rows={4}
              className={`${input} resize-none`}
              placeholder="Contanos un poco sobre vos (opcional)"
              value={form.mensaje}
              onChange={set("mensaje")}
            />
            <motion.div variants={campo}>
              <BotonMagnetico type="submit" className="btn mt-2 w-full bg-horno text-miga hover:bg-corteza">
                Enviar consulta →
              </BotonMagnetico>
            </motion.div>
            <motion.p variants={campo} className="text-center text-xs text-horno/50">
              O escribinos a{" "}
              <a href={`mailto:${NEGOCIO.emailFranquicias}`} className="font-semibold underline">
                {NEGOCIO.emailFranquicias}
              </a>
            </motion.p>
          </div>

          {/* Confirmación: el formulario se "sella" */}
          <AnimatePresence>
            {enviado && (
              <motion.div
                initial={{ clipPath: "circle(0% at 50% 90%)" }}
                animate={{ clipPath: "circle(150% at 50% 90%)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-horno p-8 text-center text-miga"
              >
                <motion.span
                  initial={{ scale: 3, rotate: -30, opacity: 0 }}
                  animate={{ scale: 1, rotate: -8, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.4 }}
                  className="cartel rounded-lg border-4 border-mostaza px-5 py-2 text-3xl text-mostaza"
                >
                  ¡Recibido!
                </motion.span>
                <p className="mt-6 max-w-xs text-miga-soft">
                  Se abrió tu correo con la consulta lista. Solo falta que la envíes.
                </p>
                <button
                  type="button"
                  onClick={() => setEnviado(false)}
                  className="mt-6 text-sm font-semibold text-mostaza underline"
                >
                  Volver al formulario
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
}
