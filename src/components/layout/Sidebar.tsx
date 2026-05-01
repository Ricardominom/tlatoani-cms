import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Sidebar.module.css";
import { MdGridView, MdGroups, MdPerson, MdHomeWork, MdCreditCard, MdCampaign, MdChat, MdLunchDining, MdPhotoLibrary, MdCalendarMonth, MdManageAccounts } from "react-icons/md";

const NAV = [
    {
      seccion: "Principal",
      items: [
        { label: "Dashboard",   path: "/dashboard",   icon: <MdGridView size={18} /> },
        { label: "Familias",    path: "/familias",    icon: <MdGroups size={18} /> },
        { label: "Alumnos",     path: "/alumnos",     icon: <MdPerson size={18} /> },
        { label: "Grupos",      path: "/grupos",      icon: <MdHomeWork size={18} /> },
      ]
    },
    {
      seccion: "Finanzas",
      items: [
        { label: "Colegiaturas", path: "/colegiaturas", badge: 12, icon: <MdCreditCard size={18} /> },
      ]
    },
    {
      seccion: "Comunicación",
      items: [
        { label: "Comunicados", path: "/comunicados",             icon: <MdCampaign size={18} /> },
        { label: "Mensajería",  path: "/mensajeria",  badge: 3,  icon: <MdChat size={18} /> },
      ]
    },
    {
      seccion: "Contenido",
      items: [
        { label: "Comida compartida", path: "/comida",     icon: <MdLunchDining size={18} /> },
        { label: "Galería",           path: "/galeria",    icon: <MdPhotoLibrary size={18} /> },
        { label: "Calendario",        path: "/calendario", icon: <MdCalendarMonth size={18} /> },
      ]
    },
    {
      seccion: "Sistema",
      items: [
        { label: "Usuarios", path: "/usuarios", icon: <MdManageAccounts size={18} /> },
      ]
    }
  ];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <svg width="32" height="32" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#F5C800"
            strokeWidth="9"
          />
          <circle
            cx="50"
            cy="50"
            r="31"
            fill="none"
            stroke="#7BC441"
            strokeWidth="9"
          />
          <path
            d="M50 32 a18 18 0 1 1 -0.01 0"
            fill="none"
            stroke="#E5297E"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="8" fill="#00AECC" />
        </svg>
        <div className={styles.logoTexts}>
          <span className={styles.logoColegio}>Panel</span>
          <span className={styles.logoTlatoani}>tlatoani</span>
        </div>
      </div>

      <div className={styles.escuela}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F5C800"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
        <div style={{ flex: 1 }}>
          <div className={styles.escuelaNombre}>Tlatoani Montessori</div>
          <div className={styles.escuelaCiclo}>Ciclo 2025–2026</div>
        </div>
      </div>

      {NAV.map((grupo) => (
        <div key={grupo.seccion} className={styles.section}>
          <div className={styles.sectionLbl}>{grupo.seccion}</div>
          {grupo.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
            >
              <div className={`${styles.navIcon}`}>
                {item.icon}
              </div>
              <span className={styles.navLbl}>{item.label}</span>
              {"badge" in item && (
                <span className={styles.navBadge}>{item.badge}</span>
              )}
            </NavLink>
          ))}
        </div>
      ))}

      <div className={styles.bottom}>
        <div className={styles.userChip} onClick={logout}>
          <div className={styles.userAv}>
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div>
            <div className={styles.userName}>{user?.name ?? "Usuario"}</div>
            <div className={styles.userRol}>Administrador</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
