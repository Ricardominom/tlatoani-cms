import { useLocation } from "react-router-dom";
import styles from "./Topbar.module.css";
import { MdNotificationsNone, MdAdd } from "react-icons/md";

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
          <MdNotificationsNone size={20} color="#888" />
          <div className={styles.notifDot} />
        </div>

        <button className={styles.btnPrimario}>
          <MdAdd size={16} color="#5A4800" />
          Nuevo aviso
        </button>
      </div>
    </header>
  );
}
