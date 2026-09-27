// Línea troquelada del ticket con las dos muescas laterales.
// `pad` = padding horizontal del ticket (px), para que las muescas toquen el borde.
export default function Troquel({ pad = 12, className = "", color = "bg-horno", muescas = true }) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      {muescas && (
        <>
          <span className={`absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full ${color}`} style={{ left: -pad - 14 }} />
          <span className={`absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full ${color}`} style={{ right: -pad - 14 }} />
        </>
      )}
      <div className="border-t-2 border-dashed border-horno/25" />
    </div>
  );
}
