import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  MdNotificationsNone,
  MdAdd,
  MdSearch,
  MdPerson,
  MdLogout
} from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
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
  "/usuarios": { titulo: "Usuarios", sub: "Gestión de accesos y roles" },
  "/mi-cuenta": { titulo: "Mi cuenta", sub: "Perfil y preferencias" }
};

const HOY = new Date().toLocaleDateString("es-MX", {
  weekday: "long",
  day: "numeric",
  month: "long"
});

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const pagina = TITULOS[location.pathname] ?? { titulo: "Panel", sub: "" };

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    setOpen(false);
    await logout();
    navigate("/login");
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <span className={styles.titulo}>{pagina.titulo}</span>
        <span className={styles.sub}>
          {HOY.charAt(0).toUpperCase() + HOY.slice(1)} · {pagina.sub}
        </span>
      </div>

      <div className={styles.right}>
        <div className={styles.btn}>
          <MdSearch size={20} color="#888" />
        </div>

        <div className={styles.btn} style={{ position: "relative" }}>
          <MdNotificationsNone size={20} color="#888" />
          <div className={styles.notifDot} />
        </div>

        <button className={styles.btnPrimario}>
          <MdAdd size={16} color="#5A4800" />
          Nuevo aviso
        </button>

        {/* ── AVATAR ── */}
        <div className={styles.avatarWrap} ref={wrapRef}>
          <button
            className={styles.avatarBtn}
            onClick={() => setOpen((o) => !o)}
          >
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </button>

          {open && (
            <div className={styles.dropdown}>
              <div className={styles.ddHeader}>
                <div className={styles.ddNombre}>{user?.name ?? "Usuario"}</div>
                <div className={styles.ddRol}>{user?.email ?? ""}</div>
              </div>

              <Link
                to="/mi-cuenta"
                className={styles.ddItem}
                onClick={() => setOpen(false)}
              >
                <MdPerson size={15} /> Mi perfil
              </Link>

              <div className={styles.ddDivider} />

              <button
                className={`${styles.ddItem} ${styles.ddLogout}`}
                onClick={handleLogout}
              >
                <MdLogout size={15} /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
