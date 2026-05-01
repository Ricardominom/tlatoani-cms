import React from "react";
import styles from "./Dashboard.module.css";
import { AnimalIcon } from "../../components/ui/AnimalKit";
import { MdGroups, MdCreditCard, MdCampaign, MdChat, MdLunchDining } from "react-icons/md";

interface StatItem {
  num: number;
  lbl: string;
  delta: string;
  tipo: string;
  acento: string;
  icono: React.ReactNode;
  iconoBg: string;
  numColor?: string;
}

interface ActividadItem {
  inicial: string;
  bg: string;
  color: string;
  txt: React.ReactNode;
  hora: string;
  tipo: string;
  tipoBg: string;
  tipoColor: string;
}

interface AlertaItem {
  icono: React.ReactNode;
  iconoBg: string;
  titulo: string;
  desc: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
}

const STATS: StatItem[] = [
  {
    num: 87,
    lbl: "Alumnos presentes",
    delta: "85% de asistencia",
    tipo: "up",
    acento: "var(--verde)",
    icono: <MdGroups size={20} color="var(--verde)" />,
    iconoBg: "var(--verde-light)"
  },
  {
    num: 12,
    lbl: "Colegiaturas vencidas",
    delta: "$38,400 pendiente",
    tipo: "down",
    acento: "var(--rojo)",
    icono: <MdCreditCard size={20} color="var(--rojo)" />,
    iconoBg: "var(--rojo-light)",
    numColor: "var(--rojo)"
  },
  {
    num: 23,
    lbl: "Avisos sin confirmar",
    delta: "3 salones pendientes",
    tipo: "neutral",
    acento: "var(--amarillo)",
    icono: <MdCampaign size={20} color="#B89600" />,
    iconoBg: "var(--amarillo-light)"
  },
  {
    num: 3,
    lbl: "Mensajes sin leer",
    delta: "de 2 maestros",
    tipo: "neutral",
    acento: "var(--turquesa)",
    icono: <MdChat size={20} color="var(--turquesa)" />,
    iconoBg: "var(--turquesa-light)"
  }
];

const SALONES = [
  {
    nombre: "Abejas",
    nivel: "Casa de niños · Mtra. Sandra",
    pct: 0.86,
    num: "19/22",
    color: "var(--verde)",
    bg: "var(--amarillo-light)",
    border: "var(--amarillo)"
  },
  {
    nombre: "Hormigas",
    nivel: "Casa de niños · Mtra. Lupita",
    pct: 0.88,
    num: "21/24",
    color: "var(--verde)",
    bg: "var(--verde-light)",
    border: "var(--verde)"
  },
  {
    nombre: "Halcones",
    nivel: "Taller 1 · Mtro. Roberto",
    pct: 0.83,
    num: "24/29",
    color: "var(--turquesa)",
    bg: "var(--turquesa-light)",
    border: "var(--turquesa)"
  },
  {
    nombre: "Lobos",
    nivel: "Taller 2 · Mtra. Carmen",
    pct: 0.85,
    num: "23/27",
    color: "var(--rosa)",
    bg: "var(--rosa-light)",
    border: "var(--rosa)"
  }
];

const ACTIVIDAD: ActividadItem[] = [
  {
    inicial: "S",
    bg: "var(--turquesa-light)",
    color: "var(--turquesa)",
    txt: (
      <>
        <strong>Mtra. Sandra</strong> publicó un aviso en Abejas
      </>
    ),
    hora: "Hace 12 min",
    tipo: "Aviso",
    tipoBg: "var(--turquesa-light)",
    tipoColor: "var(--turquesa)"
  },
  {
    inicial: "R",
    bg: "var(--verde-light)",
    color: "var(--verde)",
    txt: (
      <>
        <strong>Familia Ramírez</strong> confirmó lectura del aviso de excursión
      </>
    ),
    hora: "Hace 28min",
    tipo: "Confirmación",
    tipoBg: "var(--verde-light)",
    tipoColor: "var(--verde)"
  },
  {
    inicial: "L",
    bg: "var(--rojo-light)",
    color: "var(--rojo)",
    txt: (
      <>
        <strong>Familia López</strong> tiene 2 meses de colegiatura vencida
      </>
    ),
    hora: "Hace 1h",
    tipo: "Alerta pago",
    tipoBg: "var(--rojo-light)",
    tipoColor: "var(--rojo)"
  },
  {
    inicial: "C",
    bg: "var(--amarillo-light)",
    color: "#B89600",
    txt: (
      <>
        <strong>Mtra. Carmen</strong> subió 14 fotos del festival de otoño
      </>
    ),
    hora: "Hace 2h",
    tipo: "Galería",
    tipoBg: "var(--amarillo-light)",
    tipoColor: "#B89600"
  }
];

const ALERTAS: AlertaItem[] = [
  {
    icono: <MdCreditCard size={18} color="var(--rojo)" />,
    iconoBg: "var(--rojo-light)",
    titulo: "12 pagos vencidos",
    desc: "$38,400 pendiente de cobro",
    badge: "Urgente",
    badgeBg: "var(--rojo-light)",
    badgeColor: "var(--rojo)"
  },
  {
    icono: <MdCampaign size={18} color="#B89600" />,
    iconoBg: "var(--amarillo-light)",
    titulo: "23 avisos sin leer",
    desc: "Abejas, Halcones y Lobos",
    badge: "Pendiente",
    badgeBg: "var(--amarillo-light)",
    badgeColor: "#B89600"
  },
  {
    icono: <MdChat size={18} color="var(--turquesa)" />,
    iconoBg: "var(--turquesa-light)",
    titulo: "3 mensajes sin leer",
    desc: "Mtra. Sandra · Mtro. Roberto",
    badge: "Nuevo",
    badgeBg: "var(--turquesa-light)",
    badgeColor: "var(--turquesa)"
  }
];

const PAGOS = [
  {
    inicial: "L",
    bg: "var(--rojo-light)",
    color: "var(--rojo)",
    familia: "Familia López",
    desc: "Mateo · Abejas · 2 meses",
    monto: "$6,400",
    status: "Vencido",
    statusBg: "var(--rojo-light)",
    statusColor: "var(--rojo)"
  },
  {
    inicial: "T",
    bg: "var(--rojo-light)",
    color: "var(--rojo)",
    familia: "Familia Torres",
    desc: "Valeria · Abejas",
    monto: "$3,200",
    status: "Vencido",
    statusBg: "var(--rojo-light)",
    statusColor: "var(--rojo)"
  },
  {
    inicial: "R",
    bg: "var(--amarillo-light)",
    color: "#B89600",
    familia: "Familia Ramírez",
    desc: "Sofía · Diego · 2 hijos",
    monto: "$6,400",
    status: "3 días",
    statusBg: "var(--amarillo-light)",
    statusColor: "#B89600"
  }
];

const EVENTOS = [
  {
    dia: 25,
    mes: "oct",
    nombre: "Suspensión de clases",
    salon: "Toda la escuela · día del maestro",
    bg: "var(--turquesa-light)",
    color: "var(--turquesa)"
  },
  {
    dia: 28,
    mes: "oct",
    nombre: "Junta de ambiente",
    salon: "Abejas · 1:15pm",
    bg: "var(--amarillo-light)",
    color: "#B89600"
  },
  {
    dia: 31,
    mes: "oct",
    nombre: "Festival de Halloween",
    salon: "Toda la escuela · 10am",
    bg: "var(--rosa-light)",
    color: "var(--rosa)"
  }
];

const RESUMEN = [
  { lbl: "Alumnos inscritos", val: "102", color: "var(--texto)" },
  { lbl: "Cobrado este ciclo", val: "$326,400", color: "var(--verde)" },
  { lbl: "Pendiente de cobro", val: "$38,400", color: "var(--rojo)" },
  { lbl: "Bitácoras escritas", val: "486", color: "var(--texto)" },
  { lbl: "Avisos publicados", val: "134", color: "var(--texto)" }
];

export default function Dashboard() {
  return (
    <>
      {/* STATS */}
      <div className={styles.statsGrid}>
        {STATS.map((s) => (
          <div key={s.lbl} className={styles.statCard}>
            <div
              className={styles.statAccent}
              style={{ background: s.acento }}
            />
            <div className={styles.statIcono} style={{ background: s.iconoBg }}>
              {s.icono}
            </div>
            <div
              className={styles.statNum}
              style={{ color: s.numColor ?? "var(--texto)" }}
            >
              {s.num}
            </div>
            <div className={styles.statLbl}>{s.lbl}</div>
            <div
              className={`${styles.statDelta} ${s.tipo === "up" ? styles.deltaUp : s.tipo === "down" ? styles.deltaDown : styles.deltaNeutral}`}
            >
              {s.tipo === "up" && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline
                    points="18 15 12 9 6
  15"
                  />
                </svg>
              )}
              {s.tipo === "down" && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline
                    points="6 9 12 15 18
  9"
                  />
                </svg>
              )}
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className={styles.mainGrid}>
        <div className={styles.colLeft}>
          {/* Asistencia */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitulo}>
                  Asistencia de hoy por salón
                </div>
                <div className={styles.cardSub}>102 alumnos inscritos</div>
              </div>
              <span className={styles.cardLink}>Ver detalle →</span>
            </div>
            <div className={styles.cardBody}>
              {SALONES.map((s) => (
                <div key={s.nombre} className={styles.salonRow}>
                  <div
                    className={styles.salonIcono}
                    style={{
                      background: s.bg,
                      border: `1.5px solid ${s.border}`
                    }}
                  >
                    <AnimalIcon salon={s.nombre} size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.salonNombre}>{s.nombre}</div>
                    <div className={styles.salonNivel}>{s.nivel}</div>
                  </div>
                  <div className={styles.barraWrap}>
                    <div
                      className={styles.barra}
                      style={{ width: `${s.pct * 100}%`, background: s.color }}
                    />
                  </div>
                  <div className={styles.salonNum}>{s.num}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Actividad */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitulo}>Actividad reciente</div>
                <div className={styles.cardSub}>
                  Últimas acciones en el sistema
                </div>
              </div>
              <span className={styles.cardLink}>Ver todo →</span>
            </div>
            <div className={styles.cardBody}>
              {ACTIVIDAD.map((a, i) => (
                <div key={i} className={styles.actItem}>
                  <div
                    className={styles.actAv}
                    style={{ background: a.bg, color: a.color }}
                  >
                    {a.inicial}
                  </div>
                  <div>
                    <div className={styles.actTxt}>{a.txt}</div>
                    <div className={styles.actHora}>{a.hora}</div>
                    <span
                      className={styles.actTipo}
                      style={{ background: a.tipoBg, color: a.tipoColor }}
                    >
                      {a.tipo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.colRight}>
          {/* Alertas */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitulo}>Alertas urgentes</div>
                <div className={styles.cardSub}>Requieren atención hoy</div>
              </div>
            </div>
            <div className={styles.cardBody}>
              {ALERTAS.map((a) => (
                <div key={a.titulo} className={styles.alertaItem}>
                  <div
                    className={styles.alertaIcono}
                    style={{ background: a.iconoBg }}
                  >
                    {a.icono}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.alertaTitulo}>{a.titulo}</div>
                    <div className={styles.alertaDesc}>{a.desc}</div>
                  </div>
                  <span
                    className={styles.alertaBadge}
                    style={{ background: a.badgeBg, color: a.badgeColor }}
                  >
                    {a.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pagos */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitulo}>Colegiaturas pendientes</div>
                <div className={styles.cardSub}>Vencidas o por vencer</div>
              </div>
              <span className={styles.cardLink}>Ver todas →</span>
            </div>
            <div className={styles.cardBody}>
              {PAGOS.map((p) => (
                <div key={p.familia} className={styles.pagoItem}>
                  <div
                    className={styles.pagoAv}
                    style={{ background: p.bg, color: p.color }}
                  >
                    {p.inicial}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.pagoFamilia}>{p.familia}</div>
                    <div className={styles.pagoDesc}>{p.desc}</div>
                  </div>
                  <div>
                    <div className={styles.pagoMonto}>{p.monto}</div>
                    <span
                      className={styles.pagoStatus}
                      style={{ background: p.statusBg, color: p.statusColor }}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className={styles.bottomGrid}>
        {/* Comida */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitulo}>Comida compartida</div>
              <div className={styles.cardSub}>Octubre 2025</div>
            </div>
            <span className={styles.cardLink}>Ver menú →</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.comidaHoy}>
              <div className={styles.comidaIcono}>
                <MdLunchDining size={22} color="#5A4800" />
              </div>
              <div>
                <div className={styles.comidaNombre}>Pasta boloñesa</div>
                <div className={styles.comidaSalon}>
                  Sofía Ramírez · Abejas · hoy
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--texto-2)",
                marginBottom: 6
              }}
            >
              Próximos turnos
            </div>
            {[
              {
                nombre: "Valeria Torres",
                fecha: "Mié 23 · Abejas",
                alerta: false
              },
              {
                nombre: "Lucas Hernández",
                fecha: "Jue 24 · Abejas",
                alerta: false
              },
              { nombre: "Sin asignar", fecha: "Vie 25 · Abejas", alerta: true }
            ].map((t) => (
              <div
                key={t.fecha}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 11,
                  marginBottom: 5
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    color: t.alerta ? "var(--rojo)" : "var(--texto)"
                  }}
                >
                  {t.nombre}
                </span>
                <span style={{ color: "var(--texto-3)" }}>{t.fecha}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Eventos */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitulo}>Próximos eventos</div>
              <div className={styles.cardSub}>Calendario escolar</div>
            </div>
            <span className={styles.cardLink}>Ver calendario →</span>
          </div>
          <div className={styles.cardBody}>
            {EVENTOS.map((e) => (
              <div key={e.nombre} className={styles.eventoItem}>
                <div
                  className={styles.eventoFecha}
                  style={{ background: e.bg }}
                >
                  <span className={styles.evDia} style={{ color: e.color }}>
                    {e.dia}
                  </span>
                  <span className={styles.evMes} style={{ color: e.color }}>
                    {e.mes}
                  </span>
                </div>
                <div>
                  <div className={styles.eventoNombre}>{e.nombre}</div>
                  <div className={styles.eventoSalon}>{e.salon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitulo}>Resumen del ciclo</div>
              <div className={styles.cardSub}>2025 – 2026</div>
            </div>
          </div>
          <div className={styles.cardBody}>
            {RESUMEN.map((r) => (
              <div key={r.lbl} className={styles.resumenRow}>
                <span className={styles.resumenLbl}>{r.lbl}</span>
                <span className={styles.resumenVal} style={{ color: r.color }}>
                  {r.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
