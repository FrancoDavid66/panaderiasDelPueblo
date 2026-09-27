import { useEffect, useRef, useState } from "react";
import meta from "../assets/fotos/meta.json";

// Todas las versiones optimizadas (AVIF + WebP en 480 / 800 / 1200 px)
const archivos = import.meta.glob("../assets/fotos/*.{avif,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

const url = (nombre, ancho, ext) => archivos[`../assets/fotos/${nombre}-${ancho}.${ext}`];
const srcset = (nombre, ext) => meta[nombre].anchos.map((w) => `${url(nombre, w, ext)} ${w}w`).join(", ");

/**
 * <Foto nombre="medialunas" alt="..." sizes="(min-width:1024px) 25vw, 80vw" />
 * - Sirve AVIF (más liviano) y WebP de respaldo, en el tamaño justo para cada pantalla.
 * - Muestra un placeholder borroso mientras carga y aparece con un fundido.
 * - `prioridad` para la imagen principal (carga inmediata).
 */
export default function Foto({ nombre, alt = "", sizes = "100vw", prioridad = false, className = "", imgClassName = "" }) {
  const [lista, setLista] = useState(false);
  const ref = useRef(null);
  // Si la imagen ya estaba en caché, se marca como lista al montar
  useEffect(() => {
    if (ref.current?.complete) setLista(true);
  }, []);
  const m = meta[nombre];
  if (!m) return null;
  const mayor = m.anchos[m.anchos.length - 1];

  return (
    <picture className={`block overflow-hidden bg-cover bg-center ${className}`} style={{ backgroundImage: `url(${m.lqip})` }}>
      <source type="image/avif" srcSet={srcset(nombre, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(nombre, "webp")} sizes={sizes} />
      <img
        ref={ref}
        src={url(nombre, mayor, "webp")}
        alt={alt}
        width={m.w}
        height={m.h}
        loading={prioridad ? "eager" : "lazy"}
        fetchPriority={prioridad ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLista(true)}
        className={`h-full w-full object-cover transition-opacity duration-700 ${lista ? "opacity-100" : "opacity-0"} ${imgClassName}`}
      />
    </picture>
  );
}
