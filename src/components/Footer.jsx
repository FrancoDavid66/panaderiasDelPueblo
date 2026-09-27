import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import logo from "../assets/img/logo.webp";
import { NEGOCIO, SUCURSALES } from "../data";

const ease = [0.16, 1, 0.3, 1];

export default function Footer() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  // El logo gigante "sale del horno": sube y se endereza al llegar al final
  const y = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const rot = useTransform(scrollYProgress, [0, 1], [-10, -4]);
  const escala = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-corteza px-4 pb-10 pt-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <motion.img
              src={logo}
              alt="Panaderías del Pueblo"
              loading="lazy"
              whileHover={{ rotate: -6, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 250, damping: 12 }}
              className="h-24 w-auto"
            />
            <p className="mt-6 max-w-xs text-miga-soft">
              El pan más rico y fresco. Las facturas más grandes y deliciosas de CABA.
            </p>
            <p className="firma mt-4 text-3xl text-mostaza">Sabor, tradición y abundancia</p>
          </div>

          <div>
            <p className="etiqueta text-mostaza">Sucursales</p>
            <motion.ul
              initial="fuera"
              whileInView="dentro"
              viewport={{ once: true }}
              variants={{ dentro: { transition: { staggerChildren: 0.05 } } }}
              className="mt-5 grid gap-1.5 text-sm text-miga-soft"
            >
              {SUCURSALES.map((s) => (
                <motion.li
                  key={s.dir}
                  variants={{ fuera: { opacity: 0, x: -12 }, dentro: { opacity: 1, x: 0, transition: { ease } } }}
                >
                  <a href="#sucursales" className="transition-colors hover:text-mostaza">
                    {s.dir}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div>
            <p className="etiqueta text-mostaza">Contacto</p>
            <ul className="mt-5 grid gap-4 text-sm">
              <li>
                <span className="block text-miga/50">Consultas</span>
                <a href={`mailto:${NEGOCIO.email}`} className="break-all hover:text-mostaza">
                  {NEGOCIO.email}
                </a>
              </li>
              <li>
                <span className="block text-miga/50">Franquicias</span>
                <a href={`mailto:${NEGOCIO.emailFranquicias}`} className="break-all hover:text-mostaza">
                  {NEGOCIO.emailFranquicias}
                </a>
              </li>
              <li>
                <span className="block text-miga/50">Instagram</span>
                <a
                  href={`https://www.instagram.com/${NEGOCIO.instagram}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mostaza"
                >
                  @{NEGOCIO.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Firma gigante que sube al final */}
        <motion.div
          style={{ y, rotate: rot, scale: escala }}
          className="pointer-events-none mt-16 select-none text-center"
          aria-hidden
        >
          <span className="firma block text-[clamp(5rem,22vw,18rem)] leading-[0.9] text-mostaza/90">del Pueblo</span>
        </motion.div>

        <div className="mt-10 flex flex-col gap-3 border-t border-corteza pt-6 text-xs text-miga/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Panaderías del Pueblo. Todos los derechos reservados.</p>
          <motion.a href="#inicio" whileHover={{ y: -3 }} className="hover:text-mostaza">
            Volver arriba ↑
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
