import { useState } from "react";
import { MdAdd, MdChevronLeft, MdChevronRight } from "react-icons/md";
import styles from "./Calendario.module.css";
import {
  CELDAS_OCTUBRE,
  EVENTOS_DIA_SEL,
  DOT_COLOR,
  PROXIMOS_EVENTOS
} from "./calendario.mock";

const DIAS_NOMBRE = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo"
];

const LEYENDA = [
  { color: "var(--rosa)", label: "Festival / celebración" },
  { color: "var(--rojo)", label: "Suspensión de clases" },
  { color: "var(--turquesa)", label: "Junta de ambiente" },
  { color: "#F57C00", label: "Puente / día festivo" },
  { color: "var(--verde)", label: "Inicio / fin de ciclo" }
];

const DOT_CLASS: Record<string, string> = {
  festival: styles.dotFestival,
  suspension: styles.dotSuspension,
  junta: styles.dotJunta,
  puente: styles.dotPuente
};

export default function Calendario() {
  const [vista, setVista] = useState<"mes" | "ciclo">("mes");
  const [selIdx, setSelIdx] = useState(29); // Oct 28

  const celda = CELDAS_OCTUBRE[selIdx];
  const colIdx = selIdx % 7;
  const diaNombre = DIAS_NOMBRE[colIdx];
  const tieneEventos = celda.num === 28 && !celda.otroMes;

  return (
    <div className={styles.content}>
      {/* ── PANEL IZQUIERDO ── */}
      <div className={styles.panelLeft}>
        {/* MINI CALENDARIO */}
        <div className={styles.miniCal}>
          <div className={styles.mcHeader}>
            <span className={styles.mcMes}>Octubre 2025</span>
            <div className={styles.mcNav}>
              <div className={styles.mcBtn}>
                <MdChevronLeft size={13} color="#888" />
              </div>
              <div className={styles.mcBtn}>
                <MdChevronRight size={13} color="#888" />
              </div>
            </div>
          </div>
          <div className={styles.mcBody}>
            <div className={styles.diasSemana}>
              {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                <div key={i} className={styles.ds}>
                  {d}
                </div>
              ))}
            </div>
            <div className={styles.diasGrid}>
              {CELDAS_OCTUBRE.map((d, i) => (
                <div
                  key={i}
                  onClick={() => !d.otroMes && setSelIdx(i)}
                  className={[
                    styles.dia,
                    d.otroMes ? styles.diaOtroMes : "",
                    !d.otroMes && d.esFinSemana ? styles.diaFinSemana : "",
                    d.esHoy ? styles.diaHoy : "",
                    i === selIdx && !d.otroMes ? styles.diaSel : "",
                    d.dotTipo ? styles.diaDot : "",
                    d.dotTipo ? DOT_CLASS[d.dotTipo] : ""
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {d.num}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.leyenda}>
            {LEYENDA.map((l) => (
              <div key={l.label} className={styles.leyItem}>
                <div
                  className={styles.leyDot}
                  style={{ background: l.color }}
                />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* DETALLE DÍA SELECCIONADO */}
        <div className={styles.evDetalle}>
          <div className={styles.evdHeader}>
            <div className={styles.evdTitulo}>
              {diaNombre} {celda.num} de octubre
            </div>
            <div className={styles.evdSub}>
              {tieneEventos
                ? `${EVENTOS_DIA_SEL.length} eventos programados`
                : "Sin eventos programados"}
            </div>
          </div>
          <div className={styles.evdBody}>
            {tieneEventos
              ? EVENTOS_DIA_SEL.map((ev, i) => (
                  <div
                    key={i}
                    className={styles.evCard}
                    style={{ background: ev.bg, borderColor: ev.border }}
                  >
                    <div className={styles.evcTop}>
                      <div
                        className={styles.evcDot}
                        style={{ background: ev.dotColor }}
                      />
                      <span
                        className={styles.evcNombre}
                        style={{ color: ev.textColor }}
                      >
                        {ev.nombre}
                      </span>
                      <span
                        className={styles.evcTipo}
                        style={{ background: ev.tipoBg, color: ev.tipoColor }}
                      >
                        {ev.tipoTxt}
                      </span>
                    </div>
                    <div
                      className={styles.evcMeta}
                      style={{ color: ev.textColor }}
                    >
                      {ev.meta.map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>
                  </div>
                ))
              : null}
            <button className={styles.btnAddEv}>
              <MdAdd size={13} /> Agregar evento en este día
            </button>
          </div>
        </div>
      </div>

      {/* ── PANEL DERECHO ── */}
      <div className={styles.panelRight}>
        {/* TABS + MES NAV */}
        <div className={styles.topRow}>
          <div className={styles.vistaTabs}>
            <button
              className={`${styles.vtBtn} ${vista === "mes" ? styles.vtOn : styles.vtOff}`}
              onClick={() => setVista("mes")}
            >
              Mes
            </button>
            <button
              className={`${styles.vtBtn} ${vista === "ciclo" ? styles.vtOn : styles.vtOff}`}
              onClick={() => setVista("ciclo")}
            >
              Ciclo completo
            </button>
          </div>
          <div className={styles.mesNav}>
            <div className={styles.cgBtn}>
              <MdChevronLeft size={14} color="#888" />
            </div>
            <span className={styles.cgMesLbl}>Octubre 2025</span>
            <div className={styles.cgBtn}>
              <MdChevronRight size={14} color="#888" />
            </div>
            <button className={styles.cgHoy}>Hoy</button>
          </div>
        </div>

        {/* CALENDARIO GRANDE */}
        {vista === "mes" && (
          <div className={styles.calGrande}>
            <div className={styles.cgDiasSemana}>
              {["Lun", "Mar", "Mié", "Jue", "Vie"].map((d) => (
                <div key={d} className={styles.cgds}>
                  {d}
                </div>
              ))}
              <div className={`${styles.cgds} ${styles.cgdsGris}`}>Sáb</div>
              <div className={`${styles.cgds} ${styles.cgdsGris}`}>Dom</div>
            </div>
            <div className={styles.cgGrid}>
              {CELDAS_OCTUBRE.map((d, i) => {
                const isFinSemana = d.esFinSemana;
                return (
                  <div
                    key={i}
                    onClick={() => !d.otroMes && setSelIdx(i)}
                    className={[
                      styles.cgDia,
                      d.otroMes ? styles.cgDiaOtroMes : "",
                      isFinSemana ? styles.cgDiaFinSemana : "",
                      d.esHoy ? styles.cgDiaHoy : "",
                      i === selIdx && !d.otroMes ? styles.cgDiaSel : ""
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div
                      className={[
                        styles.cgNum,
                        d.otroMes ? styles.cgNumOtroMes : "",
                        isFinSemana && !d.esHoy ? styles.cgNumFinSemana : "",
                        d.esHoy ? styles.cgNumHoy : ""
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {d.num}
                    </div>
                    {d.pills?.map((p) => (
                      <span
                        key={p.label}
                        className={styles.evPill}
                        style={{ background: p.bg, color: p.color }}
                      >
                        {p.label}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LISTA PRÓXIMOS EVENTOS */}
        <div className={styles.cicloCard}>
          <div className={styles.ccHeader}>
            <div>
              <div className={styles.ccTitulo}>Próximos eventos del ciclo</div>
              <div className={styles.ccSub}>
                Ordenados por fecha · Ciclo 2025–2026
              </div>
            </div>
            <button className={styles.btnP}>
              <MdAdd size={13} /> Nuevo evento
            </button>
          </div>

          {PROXIMOS_EVENTOS.map((mes) => (
            <div key={mes.nombre} className={styles.mesSeccion}>
              <div className={styles.mesTituloRow}>
                <span className={styles.mesTitulo}>{mes.nombre}</span>
                <span className={styles.mesCount}>
                  {mes.eventos.length} eventos
                </span>
              </div>
              {mes.eventos.map((ev) => (
                <div key={ev.id} className={styles.evListaItem}>
                  <div
                    className={styles.evFechaBox}
                    style={{ background: ev.fechaBg }}
                  >
                    <div
                      className={styles.evDiaN}
                      style={{ color: ev.fechaColor }}
                    >
                      {ev.dia}
                    </div>
                    <div
                      className={styles.evMesN}
                      style={{ color: ev.fechaColor }}
                    >
                      {ev.mesCorto}
                    </div>
                  </div>
                  <div className={styles.evInfo}>
                    <div className={styles.evNombreL}>{ev.nombre}</div>
                    <div className={styles.evMetaL}>
                      {ev.chips.map((c) => (
                        <span
                          key={c.label}
                          className={styles.evChip}
                          style={{ background: c.bg, color: c.color }}
                        >
                          {c.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.evRight}>
                    <button className={styles.evEditBtn}>Editar</button>
                    <span
                      className={
                        ev.estado === "Publicado"
                          ? styles.evEstadoOk
                          : styles.evEstadoDraft
                      }
                    >
                      {ev.estado === "Publicado" ? "✓ Publicado" : "Borrador"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
