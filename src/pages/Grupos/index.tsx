import { useState } from "react";
import { MdSearch, MdAdd } from "react-icons/md";
import { AnimalIcon, getGrupo } from "../../components/ui/AnimalKit";
import styles from "./Grupos.module.css";
import type { FiltroAsist } from "./types";
import { GRUPOS } from "./grupos.mock";

const AV_COLORS = [
  { bg: "var(--amarillo-light)", color: "#7A6200", border: "var(--amarillo)" },
  { bg: "var(--rosa-light)", color: "var(--rosa-s)", border: "var(--rosa)" },
  {
    bg: "var(--turquesa-light)",
    color: "var(--turquesa-s)",
    border: "var(--turquesa)"
  },
  { bg: "var(--verde-light)", color: "var(--verde-s)", border: "var(--verde)" },
  { bg: "#F0F0F0", color: "#555", border: "#D0D0D0" }
];

const STATUS_STYLE = {
  Presente: { bg: "var(--verde-light)", color: "var(--verde-s)" },
  Retardo: { bg: "var(--amarillo-light)", color: "#B89600" },
  Ausente: { bg: "var(--rojo-light)", color: "var(--rojo)" }
};

export default function Grupos() {
  const [selectedId, setSelectedId] = useState(2);
  const [busqueda, setBusqueda] = useState("");
  const [filtroAsist, setFiltroAsist] = useState<FiltroAsist>("todos");

  const grupo = GRUPOS.find((g) => g.id === selectedId)!;
  const gc = getGrupo(grupo.nombre);

  const alumnosFiltrados = grupo.alumnos.filter((a) => {
    const matchBusqueda =
      !busqueda || a.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchFiltro =
      filtroAsist === "presentes"
        ? a.status === "Presente"
        : filtroAsist === "ausentes"
          ? a.status === "Ausente" || a.status === "Retardo"
          : true;
    return matchBusqueda && matchFiltro;
  });

  return (
    <div className={styles.content}>
      {/* ── CARDS DE GRUPOS ── */}
      <div className={styles.gruposGrid}>
        {GRUPOS.map((gr) => {
          const g = getGrupo(gr.nombre);
          return (
            <div
              key={gr.id}
              className={`${styles.grupoCard} ${gr.id === selectedId ? styles.grupoCardSel : ""}`}
              onClick={() => {
                setSelectedId(gr.id);
                setBusqueda("");
                setFiltroAsist("todos");
              }}
            >
              <div className={styles.gcBanner} style={{ background: g?.light }}>
                <AnimalIcon salon={gr.nombre} size={48} />
              </div>
              <div className={styles.gcBody}>
                <div className={styles.gcNombre}>
                  {gr.nombre}
                  {gr.id === selectedId && (
                    <span className={styles.gcSelBadge}>Seleccionado</span>
                  )}
                </div>
                <div className={styles.gcNivel}>{gr.nivel}</div>
                <div className={styles.gcMaestra}>
                  <div
                    className={styles.gcMav}
                    style={{
                      background: gr.guia.avBg,
                      color: gr.guia.avColor,
                      border: `1px solid 
  ${gr.guia.avBorder}`
                    }}
                  >
                    {gr.guia.inicial}
                  </div>
                  <span className={styles.gcMnombre}>
                    Mtra. {gr.guia.nombre.split(" ")[0]}
                  </span>
                </div>
                <div className={styles.gcStats}>
                  <div className={styles.gcStat}>
                    <span className={styles.gcNum}>{gr.totalAlumnos}</span>
                    <span className={styles.gcLbl}>Alumnos</span>
                  </div>
                  <div className={styles.gcStat}>
                    <span
                      className={styles.gcNum}
                      style={{ color: "var(--verde)" }}
                    >
                      {gr.presentes}
                    </span>
                    <span className={styles.gcLbl}>Presentes</span>
                  </div>
                  <div className={styles.gcStat}>
                    <span
                      className={styles.gcNum}
                      style={{ color: "var(--rojo)" }}
                    >
                      {gr.ausentes}
                    </span>
                    <span className={styles.gcLbl}>Ausentes</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CABECERA DEL DETALLE ── */}
      <div className={styles.detalleHeader}>
        <div
          className={styles.detalleDot}
          style={{ background: gc?.color, boxShadow: `0 1px 0 ${gc?.shadow}` }}
        />
        <span className={styles.detalleTitulo}>Detalle — {grupo.nombre}</span>
        <span
          className={styles.nivelBadge}
          style={{ background: gc?.light, color: gc?.dark }}
        >
          {grupo.nivel}
        </span>
      </div>

      {/* ── LAYOUT DETALLE ── */}
      <div className={styles.detalleLayout}>
        {/* TABLA DE ALUMNOS */}
        <div className={styles.card}>
          <div className={styles.cardH}>
            <div>
              <div className={styles.cardT}>Alumnos del salón</div>
              <div className={styles.cardSub}>
                {grupo.totalAlumnos} inscritos · {grupo.presentes} presentes hoy
              </div>
            </div>
            <button className={styles.btnP}>
              <MdAdd size={11} /> Agregar alumno
            </button>
          </div>
          <div className={styles.cardB}>
            <div className={styles.searchRow}>
              <div className={styles.si}>
                <MdSearch size={13} color="var(--texto-3)" />
                <input
                  placeholder="Buscar alumno…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <div className={styles.filRow}>
                <button
                  className={`${styles.fp} ${filtroAsist === "todos" ? styles.fpOn : styles.fpOff}`}
                  onClick={() => setFiltroAsist("todos")}
                >
                  Todos · {grupo.totalAlumnos}
                </button>
                <button
                  className={`${styles.fp} ${filtroAsist === "presentes" ? styles.fpOn : styles.fpOk}`}
                  onClick={() => setFiltroAsist("presentes")}
                >
                  Presentes · {grupo.presentes}
                </button>
                <button
                  className={`${styles.fp} ${filtroAsist === "ausentes" ? styles.fpOn : styles.fpAbs}`}
                  onClick={() => setFiltroAsist("ausentes")}
                >
                  Ausentes · {grupo.ausentes}
                </button>
              </div>
            </div>

            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Edad</th>
                  <th>Familia</th>
                  <th>Asistencia</th>
                  <th>Última bitácora</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alumnosFiltrados.map((a, i) => {
                  const c = AV_COLORS[i % AV_COLORS.length];
                  const st = STATUS_STYLE[a.status];
                  return (
                    <tr key={a.id}>
                      <td>
                        <div className={styles.alCell}>
                          <div
                            className={styles.alAv}
                            style={{
                              background: c.bg,
                              color: c.color,
                              border: `1.5px solid ${c.border}`
                            }}
                          >
                            {a.inicial}
                          </div>
                          <div className={styles.alNombre}>{a.nombre}</div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.alEdad}>{a.edad}</span>
                      </td>
                      <td>
                        <span className={styles.alFamilia}>{a.familia}</span>
                      </td>
                      <td>
                        <span
                          className={styles.stBadge}
                          style={{ background: st.bg, color: st.color }}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            a.bitacoraAlerta
                              ? styles.bitAlerta
                              : a.ultimaBitacora.startsWith("Hoy")
                                ? styles.bitHoy
                                : styles.bitNormal
                          }
                        >
                          {a.ultimaBitacora}
                        </span>
                      </td>
                      <td>
                        <div className={styles.accCell}>
                          <button
                            className={styles.acBtn}
                            style={
                              a.bitacoraAlerta
                                ? {
                                    background: "var(--amarillo-light)",
                                    color: "#B89600",
                                    border: "1px solid #F0DC80"
                                  }
                                : {
                                    background: "var(--turquesa-light)",
                                    color: "var(--turquesa-s)"
                                  }
                            }
                          >
                            {a.bitacoraAlerta ? "⚠ Bitácora" : "Bitácora"}
                          </button>
                          <button
                            className={styles.acBtn}
                            style={{
                              background: "var(--gris-bg)",
                              color: "var(--texto-2)",
                              border: "1px solid var(--gris-borde)"
                            }}
                          >
                            Ver
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className={styles.tablaFooter}>
              Mostrando {alumnosFiltrados.length} de {grupo.totalAlumnos}{" "}
              alumnos ·{" "}
              <span className={styles.tablaFooterLnk}>Ver todos →</span>
            </div>
          </div>
        </div>

        {/* PANEL LATERAL */}
        <div className={styles.infoStack}>
          {/* GUÍA */}
          <div className={styles.card}>
            <div className={styles.cardH}>
              <div>
                <div className={styles.cardT}>Guía asignada</div>
              </div>
              <span className={styles.cardLnk}>Cambiar</span>
            </div>
            <div className={styles.cardB}>
              <div className={styles.maestraCard}>
                <div
                  className={styles.mavFull}
                  style={{
                    background: grupo.guia.avBg,
                    color: grupo.guia.avColor,
                    border: `2px solid 
  ${grupo.guia.avBorder}`
                  }}
                >
                  {grupo.guia.inicial}
                </div>
                <div style={{ flex: 1 }}>
                  <div className={styles.mNombre}>{grupo.guia.nombre}</div>
                  <div className={styles.mInfo}>
                    {grupo.guia.rol} · desde {grupo.guia.desde}
                  </div>
                  <div className={styles.mInfo}>{grupo.guia.email}</div>
                </div>
              </div>
              <div className={styles.mBtns}>
                <button className={styles.btnS}>Mensaje</button>
                <button className={styles.btnS}>Ver perfil</button>
              </div>
            </div>
          </div>

          {/* ESTADÍSTICAS */}
          <div className={styles.card}>
            <div className={styles.cardH}>
              <div className={styles.cardT}>Estadísticas del salón</div>
            </div>
            <div className={styles.cardB}>
              <div className={styles.statsGrid}>
                {grupo.stats.map((s) => (
                  <div key={s.lbl} className={styles.smCard}>
                    <div className={styles.smNum} style={{ color: s.color }}>
                      {s.num}
                    </div>
                    <div className={styles.smLbl}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CONFIGURACIÓN */}
          <div className={styles.card}>
            <div className={styles.cardH}>
              <div className={styles.cardT}>Configuración</div>
              <span className={styles.cardLnk}>Editar</span>
            </div>
            <div className={styles.cardB}>
              <div className={styles.configRow}>
                <span className={styles.configLbl}>Nivel</span>
                <span className={styles.configVal}>{grupo.config.nivel}</span>
              </div>
              <div className={styles.configRow}>
                <span className={styles.configLbl}>Horario</span>
                <span className={styles.configVal}>{grupo.config.horario}</span>
              </div>
              <div className={styles.configRow}>
                <span className={styles.configLbl}>Capacidad máx.</span>
                <span className={styles.configVal}>
                  {grupo.config.capacidad}
                </span>
              </div>
              <div className={styles.configRow}>
                <span className={styles.configLbl}>Cuota mensual</span>
                <span className={styles.configVal}>{grupo.config.cuota}</span>
              </div>
              <div className={styles.configRow}>
                <span className={styles.configLbl}>Color del grupo</span>
                <div
                  className={styles.colorDot}
                  style={{
                    background: gc?.color,
                    boxShadow: `0 1px 0 ${gc?.shadow}`
                  }}
                />
              </div>
            </div>
          </div>

          {/* ACTIVIDAD */}
          <div className={styles.card}>
            <div className={styles.cardH}>
              <div className={styles.cardT}>Actividad reciente</div>
              <span className={styles.cardLnk}>Ver todo</span>
            </div>
            <div className={styles.cardB}>
              {grupo.actividad.map((a, i) => (
                <div key={i} className={styles.actItem}>
                  <div
                    className={styles.actDot}
                    style={{ background: a.color }}
                  />
                  <div>
                    <div className={styles.actTxt}>
                      {a.bold && (
                        <span className={styles.actBold}>{a.bold}</span>
                      )}
                      {a.texto}
                    </div>
                    <div className={styles.actHora}>{a.hora}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
