import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Sidebar.module.css";

const NAV = [
  {
    seccion: "Principal",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        )
      },
      {
        label: "Familias",
        path: "/familias",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M17 21v-2a4 4 0
   0 0-4-4H5a4 4 0 0 0-4 4v2"
            />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        )
      },
      {
        label: "Alumnos",
        path: "/alumnos",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
          </svg>
        )
      },
      {
        label: "Grupos",
        path: "/grupos",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M3 9l9-7 9
  7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
            />
          </svg>
        )
      }
    ]
  },
  {
    seccion: "Finanzas",
    items: [
      {
        label: "Colegiaturas",
        path: "/colegiaturas",
        badge: 12,
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        )
      }
    ]
  },
  {
    seccion: "Comunicación",
    items: [
      {
        label: "Comunicados",
        path: "/comunicados",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M18 8A6 6 0
   0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
            />
          </svg>
        )
      },
      {
        label: "Mensajería",
        path: "/mensajeria",
        badge: 3,
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )
      }
    ]
  },
  {
    seccion: "Contenido",
    items: [
      {
        label: "Comida compartida",
        path: "/comida",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M18
  8h1a4 4 0 0 1 0 8h-1"
            />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          </svg>
        )
      },
      {
        label: "Galería",
        path: "/galeria",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )
      },
      {
        label: "Calendario",
        path: "/calendario",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        )
      }
    ]
  },
  {
    seccion: "Sistema",
    items: [
      {
        label: "Usuarios",
        path: "/usuarios",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
          </svg>
        )
      }
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
