import { useLocation } from "react-router-dom";
import styles from "./Topbar.module.css";

const TITULOS: Record<string, { titulo: string; sub: string }> = {
  "/dashboard": { titulo: "Dashboard", sub: "Resumen general de la escuela" },
  "/familias": { titulo: "Familias", sub: "Gestión de familias inscritas" },
  "/alumnos": { titulo: "Alumnos", sub: "Gestión de alumnos" },
  "/grupos": { titulo: "Grupos", sub: "Salones y grupos escolares" },
  "/colegiaturas": {
    titulo: "Colegiaturas",
    sub: "Control de pagos y estados"
  },
  "/comunicados": { titulo: "Comunicados", sub: "Publicación de avisos" },
  "/mensajeria": { titulo: "Mensajería", sub: "Conversaciones con familias" },
  "/comida": { titulo: "Comida compartida", sub: "Turnos y asignaciones" },
  "/galeria": { titulo: "Galería", sub: "Fotos y eventos" },
  "/calendario": { titulo: "Calendario", sub: "Eventos escolares" },
  "/usuarios": { titulo: "Usuarios", sub: "Gestión de accesos y roles" }
};

const HOY = new Date().toLocaleDateString("es-MX", {
  weekday: "long",
  day: "numeric",
  month: "long"
});

export default function Topbar() {
  const location = useLocation();
  const pagina = TITULOS[location.pathname] ?? { titulo: "Panel", sub: "" };

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <span className={styles.titulo}>{pagina.titulo}</span>
        <span className={styles.sub}>
          {HOY.charAt(0).toUpperCase() + HOY.slice(1)} · {pagina.sub}
        </span>
      </div>

      <div className={styles.right}>
        <div className={styles.btn} style={{ position: "relative" }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <div className={styles.notifDot} />
        </div>

        <button className={styles.btnPrimario}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5A4800"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo aviso
        </button>
      </div>
    </header>
  );
}
