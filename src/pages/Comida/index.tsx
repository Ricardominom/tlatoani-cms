import { useState } from "react";
import { MdChevronLeft, MdChevronRight, MdAdd, MdSend } from "react-icons/md";
import { getGrupo, AnimalIcon } from "../../components/ui/AnimalKit";
import styles from "./Comida.module.css";
import {
  SALONES_COMIDA,
  TURNOS,
  ALUMNOS_DISPONIBLES,
  RECETA_HOY
} from "./comida.mock";

const ESTADO_STYLE = {
  Entrego: { bg: "var(--verde-light)", color: "var(--verde-s)" },
  Confirmo: { bg: "var(--turquesa-light)", color: "var(--turquesa-s)" },
  Pendiente: { bg: "var(--amarillo-light)", color: "#B89600" },
  SinReceta: { bg: "var(--rojo-light)", color: "var(--rojo)" },
  SinAsignar: { bg: "var(--rojo-light)", color: "var(--rojo)" }
};

const ESTADO_LABEL = {
  Entrego: "✓ Entregó",
  Confirmo: "✓ Confirmó",
  Pendiente: "Pendiente",
  SinReceta: "Sin receta",
  SinAsignar: "Sin asignar"
};

const STATS = [
  { num: 20, color: "var(--texto)", lbl: "Días hábiles", sub: "Nov 2025" },
  {
    num: 14,
    color: "var(--verde)",
    lbl: "Turnos asignados",
    sub: "70% completado"
  },
  {
    num: 6,
    color: "var(--rojo)",
    lbl: "Sin asignar",
    sub: "Requieren atención"
  },
  {
    num: 22,
    color: "var(--turquesa)",
    lbl: "Alumnos en rotación",
    sub: "Abejas"
  },
  {
    num: 8,
    color: "var(--amarillo-s)",
    lbl: "Con receta capturada",
    sub: "de 14 asignados"
  }
];

export default function Comida() {
  const [selectedSalon, setSelectedSalon] = useState("Abejas");

  return (
    <div className={styles.content}>
      {/* ── SELECTOR BAR ── */}
      <div className={styles.selectorBar}>
        <span className={styles.selLabel}>Salón:</span>
        <div className={styles.salonPills}>
          {SALONES_COMIDA.map((s) => {
            const g = getGrupo(s);
            const isOn = s === selectedSalon;
            return (
              <button
                key={s}
                className={`${styles.sp} ${isOn ? "" : styles.spOff}`}
                style={
                  isOn
                    ? {
                        background: g?.color,
                        color: g?.dark,
                        boxShadow: `0 2px 0 ${g?.shadow}`
                      }
                    : {}
                }
                onClick={() => setSelectedSalon(s)}
              >
                {isOn && <AnimalIcon salon={s} size={11} />}
                {s}
              </button>
            );
          })}
        </div>

        <div className={styles.dividerV} />

        <span className={styles.selLabel}>Mes:</span>
        <div className={styles.mesNav}>
          <div className={styles.mesBtn}>
            <MdChevronLeft size={14} color="#888" />
          </div>
          <span className={styles.mesLbl}>Noviembre 2025</span>
          <div className={styles.mesBtn}>
            <MdChevronRight size={14} color="#888" />
          </div>
        </div>

        <div className={styles.pubStatus}>
          <span
            className={styles.pubBadge}
            style={{
              background: "var(--amarillo-light)",
              color: "#B89600",
              border: "1px solid #F0DC80"
            }}
          >
            ⏳ Borrador · sin publicar
          </span>
          <span className={styles.pubOk}>Octubre ya publicado ✓</span>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className={styles.statsRow}>
        {STATS.map((s) => (
          <div key={s.lbl} className={styles.sc}>
            <div className={styles.scNum} style={{ color: s.color }}>
              {s.num}
            </div>
            <div className={styles.scLbl}>{s.lbl}</div>
            <div className={styles.scSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── EDITOR LAYOUT ── */}
      <div className={styles.editorLayout}>
        {/* TABLA DE TURNOS */}
        <div className={styles.editorCard}>
          <div className={styles.editorHeader}>
            <div>
              <div className={styles.editorTitulo}>
                Turnos de noviembre — {selectedSalon}
              </div>
              <div className={styles.editorSub}>
                Haz clic en cualquier celda para editar
              </div>
            </div>
            <div className={styles.legend}>
              {[
                { color: "var(--verde)", label: "Asignado" },
                { color: "var(--rojo)", label: "Sin asignar" },
                { color: "var(--amarillo)", label: "Hoy" },
                { color: "var(--texto-3)", label: "Pasado" }
              ].map((l) => (
                <div key={l.label} className={styles.legItem}>
                  <div
                    className={styles.legDot}
                    style={{ background: l.color }}
                  />
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          <table className={styles.turnos}>
            <thead>
              <tr>
                <th style={{ width: 80 }}>Fecha</th>
                <th>Alumno</th>
                <th>Platillo</th>
                <th style={{ width: 110 }}>Estado</th>
                <th style={{ width: 110 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {TURNOS.map((t) => {
                const g = t.alumno ? getGrupo(t.alumno.salon) : null;
                const st = ESTADO_STYLE[t.estado];
                const isHoy = t.tipo === "hoy";
                const isPasado = t.tipo === "pasado";
                const isVacio = t.tipo === "vacio";

                return (
                  <tr
                    key={t.id}
                    className={
                      isPasado
                        ? styles.rowPasado
                        : isHoy
                          ? styles.rowHoy
                          : isVacio
                            ? styles.rowVacio
                            : undefined
                    }
                  >
                    {/* FECHA */}
                    <td>
                      <div
                        className={`${styles.tFecha} ${isHoy ? styles.tFechaHoy : isVacio ? styles.tFechaVacio : ""}`}
                      >
                        <div
                          className={`${styles.tDiaNum} ${isHoy ? styles.tDiaNumHoy : isVacio ? styles.tDiaNumVacio : ""}`}
                        >
                          {t.diaNum}
                        </div>
                        <div
                          className={`${styles.tDiaLbl} ${
                            isHoy
                              ? styles.tDiaLblHoy
                              : isVacio
                                ? styles.tDiaLblVacio
                                : isPasado
                                  ? styles.tDiaLblPasado
                                  : ""
                          }`}
                        >
                          {t.diaNombre}
                        </div>
                      </div>
                    </td>

                    {/* ALUMNO */}
                    <td>
                      {isVacio ? (
                        <div className={styles.tAlumnoVacio}>
                          <MdAdd size={16} color="var(--rojo)" />
                          Sin asignar · arrastra un alumno aquí
                        </div>
                      ) : (
                        <div
                          className={styles.tAlumno}
                          style={isPasado ? { cursor: "default" } : {}}
                        >
                          <div
                            className={styles.tAv}
                            style={{
                              background: g?.light,
                              color: g?.dark,
                              border: `1px solid ${g?.color}`
                            }}
                          >
                            {t.alumno!.inicial}
                          </div>
                          <div>
                            <div className={styles.tNombre}>
                              {t.alumno!.nombre}
                            </div>
                            <div className={styles.tFamilia}>
                              {t.alumno!.familia}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* PLATILLO */}
                    <td>
                      <div className={styles.tPlatillo}>
                        {isPasado ? (
                          <div className={styles.tPlatilloNombre}>
                            {t.platillo}
                          </div>
                        ) : (
                          <input
                            className={styles.tPlatilloInput}
                            defaultValue={t.platillo}
                            placeholder="Escribe el platillo…"
                            readOnly={isHoy}
                          />
                        )}
                      </div>
                    </td>

                    {/* ESTADO */}
                    <td>
                      <div className={styles.tStatus}>
                        <span
                          className={styles.stBadge}
                          style={{ background: st.bg, color: st.color }}
                        >
                          {ESTADO_LABEL[t.estado]}
                        </span>
                      </div>
                    </td>

                    {/* ACCIONES */}
                    <td>
                      <div className={styles.tAcciones}>
                        {isPasado && (
                          <button
                            className={styles.taBtn}
                            style={{
                              background: "var(--gris-bg)",
                              color: "var(--texto-2)",
                              border: "1px  solid var(--gris-borde)"
                            }}
                          >
                            Ver
                          </button>
                        )}
                        {isHoy && (
                          <button
                            className={styles.taBtn}
                            style={{
                              background: "var(--turquesa-light)",
                              color: "var(--turquesa-s)"
                            }}
                          >
                            Receta
                          </button>
                        )}
                        {t.tipo === "asignado" && (
                          <>
                            <button
                              className={styles.taBtn}
                              style={{
                                background: "var(--turquesa-light)",
                                color: "var(--turquesa-s)"
                              }}
                            >
                              Receta
                            </button>
                            <button
                              className={styles.taBtn}
                              style={{
                                background: "var(--rojo-light)",
                                color: "var(--rojo)"
                              }}
                            >
                              ✕
                            </button>
                          </>
                        )}
                        {t.tipo === "sinReceta" && (
                          <button
                            className={styles.taBtn}
                            style={{
                              background: "var(--amarillo-light)",
                              color: "#B89600"
                            }}
                          >
                            + Receta
                          </button>
                        )}
                        {isVacio && (
                          <button
                            className={styles.taBtn}
                            style={{
                              background: "var(--amarillo-light)",
                              color: "#B89600"
                            }}
                          >
                            Asignar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PANEL DERECHO */}
        <div className={styles.rightStack}>
          {/* PROGRESO */}
          <div className={styles.progCard}>
            <div className={styles.progHeader}>
              <div>
                <div className={styles.progTitulo}>Progreso del menú</div>
                <div className={styles.progSub}>14 de 20 días asignados</div>
              </div>
              <div className={styles.progPct}>70%</div>
            </div>
            <div className={styles.progBarraWrap}>
              <div className={styles.progBarra} />
            </div>
            <div className={styles.progChips}>
              <span
                className={styles.pChip}
                style={{
                  background: "var(--verde-light)",
                  color: "var(--verde-s)"
                }}
              >
                ✓ 14 asignados
              </span>
              <span
                className={styles.pChip}
                style={{
                  background: "var(--rojo-light)",
                  color: "var(--rojo)"
                }}
              >
                6 sin asignar
              </span>
              <span
                className={styles.pChip}
                style={{
                  background: "var(--amarillo-light)",
                  color: "#B89600"
                }}
              >
                6 sin receta
              </span>
            </div>
          </div>

          {/* ALUMNOS DISPONIBLES */}
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitulo}>Alumnos disponibles</div>
              <div className={styles.panelSub}>
                Arrastra al día que quieras asignar
              </div>
            </div>
            <div className={styles.panelBody}>
              {ALUMNOS_DISPONIBLES.map((a) => {
                const g = getGrupo(a.salon);
                return (
                  <div
                    key={a.nombre}
                    className={`${styles.aluChip} ${a.asignado ? styles.aluChipAsignado : ""}`}
                  >
                    <div
                      className={styles.acAv}
                      style={{
                        background: g?.light,
                        color: g?.dark,
                        border: `1.5px solid ${g?.color}`
                      }}
                    >
                      {a.inicial}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className={styles.acNombre}>{a.nombre}</div>
                      <div className={styles.acTurno}>{a.turnoTxt}</div>
                    </div>
                    <span
                      className={styles.acBadge}
                      style={{
                        background: "var(--verde-light)",
                        color: "var(--verde-s)"
                      }}
                    >
                      {a.asignado ? "✓ Asignada" : "Libre"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RECETA DEL DÍA */}
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitulo}>
                Receta — {RECETA_HOY.alumnoNombre} · {RECETA_HOY.diaTxt}
              </div>
              <div className={styles.panelSub}>
                {RECETA_HOY.platillo} · {RECETA_HOY.porciones} porciones
              </div>
            </div>
            <div className={styles.panelBody}>
              <div className={styles.recetaCard}>
                <div className={styles.recTitulo}>
                  Ingredientes
                  <span className={styles.recLnk}>Editar receta</span>
                </div>
                <div className={styles.recIng}>
                  {RECETA_HOY.ingredientes.map((ing) => (
                    <div key={ing.item}>
                      · {ing.item}
                      {ing.cantidad && (
                        <>
                          {" "}
                          <strong>{ing.cantidad}</strong>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className={styles.recNota}>📋 Nota: {RECETA_HOY.nota}</div>
              </div>
              <button className={styles.btnNotificar}>
                <MdSend size={13} />
                Notificar a familia Vega
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
