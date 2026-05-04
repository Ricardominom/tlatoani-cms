import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./MiCuenta.module.css";

const PREFERENCIAS = [
  {
    id: "notifComunicados",
    lbl: "Notificaciones de comunicados",
    desc: "Recibe alertas cuando se publique un aviso nuevo"
  },
  {
    id: "notifPagos",
    lbl: "Recordatorios de colegiaturas",
    desc: "Aviso cuando una familia tiene pagos pendientes"
  },
  {
    id: "notifBitacoras",
    lbl: "Actualizaciones de bitácoras",
    desc: "Notificación cuando se registre una observación nueva"
  },
  {
    id: "resumenDiario",
    lbl: "Resumen diario por correo",
    desc: "Recibe un resumen al inicio del día escolar"
  }
];

const SESIONES = [
  {
    icono: "🖥️",
    nombre: "Chrome · Windows 11",
    meta: "Ciudad de México · Ahora mismo",
    actual: true
  },
  {
    icono: "📱",
    nombre: "Safari · iPhone",
    meta: "Ciudad de México · Hace 2 días",
    actual: false
  }
];

export default function MiCuenta() {
  const { user } = useAuth();

  const [nombre, setNombre] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [telefono, setTelefono] = useState("222 111 0000");

  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");
  const [passConfirmar, setPassConfirmar] = useState("");

  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    notifComunicados: true,
    notifPagos: true,
    notifBitacoras: false,
    resumenDiario: true
  });

  const togglePref = (id: string) => setPrefs((p) => ({ ...p, [id]: !p[id] }));

  const inicial = nombre.charAt(0).toUpperCase() || "U";

  return (
    <div className={styles.content}>
      {/* ── HERO ── */}
      <div className={styles.hero}>
        <div className={styles.heroAvWrap}>
          <div className={styles.heroAv}>{inicial}</div>
          <div className={styles.heroDot} />
        </div>
        <div className={styles.heroDatos}>
          <div className={styles.heroNombre}>{nombre || "Usuario"}</div>
          <div className={styles.heroChips}>
            <span
              className={styles.hc}
              style={{
                background: "var(--amarillo-light)",
                color: "#7A6200",
                border: "1px solid var(--amarillo)"
              }}
            >
              Administrativa
            </span>
            <span className={styles.hc}>● En línea</span>
            <span className={styles.hc}>📅 Desde ago 2024</span>
          </div>
        </div>
        <div className={styles.heroRight}>
          <button className={styles.btnFoto}>Cambiar foto</button>
        </div>
      </div>

      {/* ── DATOS + SEGURIDAD ── */}
      <div className={styles.g2}>
        {/* DATOS PERSONALES */}
        <div className={styles.card}>
          <div className={styles.cardH}>
            <div>
              <div className={styles.cardT}>Datos personales</div>
              <div className={styles.cardSub}>
                Información visible para el equipo
              </div>
            </div>
          </div>
          <div className={styles.cardB}>
            <div className={styles.campo}>
              <span className={styles.campoLbl}>Nombre completo</span>
              <input
                className={styles.campoInput}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className={styles.campo}>
              <span className={styles.campoLbl}>Correo electrónico</span>
              <input
                className={styles.campoInput}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.campo}>
              <span className={styles.campoLbl}>Teléfono</span>
              <input
                className={styles.campoInput}
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
            <div className={styles.campo}>
              <span className={styles.campoLbl}>Rol</span>
              <input
                className={styles.campoInput}
                value="Administrativa"
                disabled
              />
              <span className={styles.campoHint}>
                El rol solo puede cambiarlo un Directivo
              </span>
            </div>
            <div className={styles.btnRow}>
              <button className={styles.btnS}>Cancelar</button>
              <button className={styles.btnP}>Guardar cambios</button>
            </div>
          </div>
        </div>

        {/* SEGURIDAD */}
        <div className={styles.card}>
          <div className={styles.cardH}>
            <div>
              <div className={styles.cardT}>Seguridad</div>
              <div className={styles.cardSub}>Actualiza tu contraseña</div>
            </div>
          </div>
          <div className={styles.cardB}>
            <div className={styles.campo}>
              <span className={styles.campoLbl}>Contraseña actual</span>
              <input
                className={styles.campoInput}
                type="password"
                placeholder="••••••••"
                value={passActual}
                onChange={(e) => setPassActual(e.target.value)}
              />
            </div>
            <div className={styles.campo}>
              <span className={styles.campoLbl}>Nueva contraseña</span>
              <input
                className={styles.campoInput}
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={passNueva}
                onChange={(e) => setPassNueva(e.target.value)}
              />
            </div>
            <div className={styles.campo}>
              <span className={styles.campoLbl}>Confirmar contraseña</span>
              <input
                className={styles.campoInput}
                type="password"
                placeholder="Repite la nueva contraseña"
                value={passConfirmar}
                onChange={(e) => setPassConfirmar(e.target.value)}
              />
              {passNueva && passConfirmar && passNueva !== passConfirmar && (
                <span
                  className={styles.campoHint}
                  style={{ color: "var(--rojo)" }}
                >
                  Las contraseñas no coinciden
                </span>
              )}
            </div>
            <div className={styles.btnRow}>
              <button
                className={styles.btnP}
                disabled={
                  !passActual || !passNueva || passNueva !== passConfirmar
                }
              >
                Cambiar contraseña
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── PREFERENCIAS + SESIONES ── */}
      <div className={styles.g2}>
        {/* PREFERENCIAS */}
        <div className={styles.card}>
          <div className={styles.cardH}>
            <div>
              <div className={styles.cardT}>Preferencias</div>
              <div className={styles.cardSub}>Notificaciones y alertas</div>
            </div>
          </div>
          <div className={styles.cardB}>
            {PREFERENCIAS.map((p) => (
              <div key={p.id} className={styles.prefRow}>
                <div className={styles.prefInfo}>
                  <div className={styles.prefLbl}>{p.lbl}</div>
                  <div className={styles.prefDesc}>{p.desc}</div>
                </div>
                <div
                  className={`${styles.toggle} ${prefs[p.id] ? styles.togOn : styles.togOff}`}
                  onClick={() => togglePref(p.id)}
                >
                  <div
                    className={`${styles.tThumb} ${prefs[p.id] ? styles.onPos : styles.offPos}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SESIONES */}
        <div className={styles.card}>
          <div className={styles.cardH}>
            <div>
              <div className={styles.cardT}>Sesiones activas</div>
              <div className={styles.cardSub}>
                Dispositivos con acceso a tu cuenta
              </div>
            </div>
          </div>
          <div className={styles.cardB}>
            {SESIONES.map((s, i) => (
              <div key={i} className={styles.sesionItem}>
                <div className={styles.sesionIcn}>{s.icono}</div>
                <div className={styles.sesionDatos}>
                  <div className={styles.sesionNombre}>{s.nombre}</div>
                  <div className={styles.sesionMeta}>{s.meta}</div>
                </div>
                {s.actual ? (
                  <span className={styles.sesionActual}>Esta sesión</span>
                ) : (
                  <button className={styles.btnS}>Cerrar</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
