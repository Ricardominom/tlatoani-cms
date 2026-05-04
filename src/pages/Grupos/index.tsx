import { useState, useEffect } from "react";
import { MdSearch, MdAdd, MdEdit, MdDelete, MdSettings } from "react-icons/md";
import { AnimalIcon, getGrupo } from "../../components/ui/AnimalKit";
import styles from "./Grupos.module.css";
import type { ApiGroup, ApiLevel, FiltroAsist } from "./types";
import { getGrupos, getNiveles } from "../../services/gruposService";
import ModalNivel from "./ModalNivel";

function formatHorario(entry: string | null, dismissal: string | null) {
  if (!entry && !dismissal) return "—";
  const fmt = (t: string) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour || 12}:${m}${hour >= 12 ? "pm" : "am"}`;
  };
  return `${entry ? fmt(entry) : "—"} – ${dismissal ? fmt(dismissal) : "—"}`;
}

function formatCuota(fee: string) {
  return `$${parseFloat(fee).toLocaleString("es-MX")} MXN`;
}

export default function Grupos() {
  const [grupos, setGrupos] = useState<ApiGroup[]>([]);
  const [niveles, setNiveles] = useState<ApiLevel[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroAsist, setFiltroAsist] = useState<FiltroAsist>("todos");
  const [modalNivelOpen, setModalNivelOpen] = useState(false);
  const [nivelEditando, setNivelEditando] = useState<ApiLevel | null>(null);

  useEffect(() => {
    Promise.all([
      getGrupos({ active: true, per_page: 50 }),
      getNiveles({ order_by: "order", order_direction: "asc", per_page: 100 })
    ])
      .then(([gruposRes, nivelesRes]) => {
        setGrupos(gruposRes.data);
        setNiveles(nivelesRes.data);
        if (gruposRes.data.length > 0) setSelectedUuid(gruposRes.data[0].uuid);
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setCargando(false));
  }, []);

  const gruposPorNivel = niveles
    .sort((a, b) => a.order - b.order)
    .map((nivel) => ({
      nivel,
      grupos: grupos.filter((g) => g.level?.id === nivel.id)
    }))
    .filter((n) => n.grupos.length > 0);

  const grupoSel = grupos.find((g) => g.uuid === selectedUuid) ?? null;
  const gc = grupoSel ? getGrupo(grupoSel.name) : null;

  if (cargando) {
    return <div className={styles.stateBox}>Cargando grupos…</div>;
  }

  if (errorMsg) {
    return (
      <div className={styles.stateBox} style={{ color: "var(--rojo)" }}>
        {errorMsg}
      </div>
    );
  }

  function recargar() {
    setCargando(true);
    Promise.all([
      getGrupos({ active: true, per_page: 50 }),
      getNiveles({ order_by: "order", order_direction: "asc", per_page: 100 })
    ])
      .then(([gruposRes, nivelesRes]) => {
        setGrupos(gruposRes.data);
        setNiveles(nivelesRes.data);
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setCargando(false));
  }

  return (
    <div className={styles.content}>
      {/* ── HEADER ── */}
      <div className={styles.headerRow}>
        <span
          style={{ fontSize: 12, fontWeight: 700, color: "var(--texto-3)" }}
        >
          {grupos.length} grupos · {niveles.length} niveles
        </span>
        <div className={styles.headerBtns}>
          <button
            className={styles.btnH}
            onClick={() => {
              setNivelEditando(null);
              setModalNivelOpen(true);
            }}
          >
            <MdSettings size={13} /> Gestionar niveles
          </button>
          <button className={styles.btnP}>
            <MdAdd size={13} /> Nuevo grupo
          </button>
        </div>
      </div>

      {grupos.length === 0 && niveles.length === 0 && (
        <div className={styles.emptyAlumnos} style={{ padding: "48px 24px" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🏫</div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "var(--texto-2)",
              marginBottom: 4
            }}
          >
            No hay grupos registrados
          </div>
          <div style={{ fontSize: 11, fontWeight: 600 }}>
            Comienza creando un nivel y luego asigna grupos a él
          </div>
        </div>
      )}

      {grupos.length === 0 && niveles.length > 0 && (
        <div className={styles.emptyAlumnos} style={{ padding: "48px 24px" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "var(--texto-2)",
              marginBottom: 4
            }}
          >
            Niveles creados — ahora agrega grupos
          </div>
        </div>
      )}

      {/* ── GRUPOS POR NIVEL ── */}
      {gruposPorNivel.map(({ nivel, grupos: grs }) => (
        <div key={nivel.id} className={styles.nivelSeccion}>
          <div className={styles.nivelHeader}>
            <span className={styles.nivelTitulo}>{nivel.name}</span>
            {nivel.description && (
              <span className={styles.nivelDesc}>· {nivel.description}</span>
            )}
            <span className={styles.nivelCount}>{grs.length} grupos</span>
          </div>

          <div className={styles.gruposGrid}>
            {grs.map((gr) => {
              const g = getGrupo(gr.name);
              return (
                <div
                  key={gr.uuid}
                  className={`${styles.grupoCard} ${gr.uuid === selectedUuid ? styles.grupoCardSel : ""}`}
                  onClick={() => {
                    setSelectedUuid(gr.uuid);
                    setBusqueda("");
                    setFiltroAsist("todos");
                  }}
                >
                  <div
                    className={styles.gcBanner}
                    style={{ background: g?.light }}
                  >
                    <AnimalIcon salon={gr.name} size={48} />
                  </div>
                  <div className={styles.gcBody}>
                    <div className={styles.gcNombre}>
                      {gr.name}
                      {gr.uuid === selectedUuid && (
                        <span className={styles.gcSelBadge}>Seleccionado</span>
                      )}
                    </div>
                    <div className={styles.gcNivel}>{nivel.name}</div>
                    <div className={styles.gcStats}>
                      <div className={styles.gcStat}>
                        <span className={styles.gcNum}>{gr.capacity}</span>
                        <span className={styles.gcLbl}>Capacidad</span>
                      </div>
                      <div className={styles.gcStat}>
                        <span
                          className={styles.gcNum}
                          style={{ color: "var(--verde)", fontSize: 12 }}
                        >
                          {formatCuota(gr.monthly_fee)}
                        </span>
                        <span className={styles.gcLbl}>Cuota</span>
                      </div>
                      <div className={styles.gcStat}>
                        <span
                          className={styles.gcNum}
                          style={{
                            color: gr.active ? "var(--verde)" : "var(--rojo)",
                            fontSize: 12
                          }}
                        >
                          {gr.active ? "Activo" : "Inactivo"}
                        </span>
                        <span className={styles.gcLbl}>Estado</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* ── DETALLE ── */}
      {grupoSel && (
        <>
          <div className={styles.detalleHeader}>
            <div
              className={styles.detalleDot}
              style={{
                background: gc?.color,
                boxShadow: `0 1px 0 ${gc?.shadow}`
              }}
            />
            <span className={styles.detalleTitulo}>
              Detalle — {grupoSel.name}
            </span>
            <span
              className={styles.nivelBadge}
              style={{ background: gc?.light, color: gc?.dark }}
            >
              {grupoSel.level?.name ?? "Sin nivel"}
            </span>
            <div className={styles.headerBtns} style={{ marginLeft: "auto" }}>
              <button className={styles.btnH}>
                <MdEdit size={12} /> Editar
              </button>
              <button className={styles.btnDanger}>
                <MdDelete size={12} /> Eliminar
              </button>
            </div>
          </div>

          <div className={styles.detalleLayout}>
            {/* TABLA DE ALUMNOS */}
            <div className={styles.card}>
              <div className={styles.cardH}>
                <div>
                  <div className={styles.cardT}>Alumnos del salón</div>
                  <div className={styles.cardSub}>
                    Capacidad máx. {grupoSel.capacity} alumnos
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
                    {(["todos", "presentes", "ausentes"] as FiltroAsist[]).map(
                      (f) => (
                        <button
                          key={f}
                          className={`${styles.fp} ${filtroAsist === f ? styles.fpOn : styles.fpOff}`}
                          onClick={() => setFiltroAsist(f)}
                        >
                          {
                            {
                              todos: "Todos",
                              presentes: "Presentes",
                              ausentes: "Ausentes"
                            }[f]
                          }
                        </button>
                      )
                    )}
                  </div>
                </div>
                <div className={styles.emptyAlumnos}>
                  Los alumnos de este grupo se mostrarán aquí
                </div>
              </div>
            </div>

            {/* PANEL LATERAL */}
            <div className={styles.infoStack}>
              <div className={styles.card}>
                <div className={styles.cardH}>
                  <div className={styles.cardT}>Configuración</div>
                  <span className={styles.cardLnk}>Editar</span>
                </div>
                <div className={styles.cardB}>
                  <div className={styles.configRow}>
                    <span className={styles.configLbl}>Nivel</span>
                    <span className={styles.configVal}>
                      {grupoSel.level?.name ?? "—"}
                    </span>
                  </div>
                  <div className={styles.configRow}>
                    <span className={styles.configLbl}>Horario</span>
                    <span className={styles.configVal}>
                      {formatHorario(
                        grupoSel.entry_time,
                        grupoSel.dismissal_time
                      )}
                    </span>
                  </div>
                  <div className={styles.configRow}>
                    <span className={styles.configLbl}>Capacidad máx.</span>
                    <span className={styles.configVal}>
                      {grupoSel.capacity} alumnos
                    </span>
                  </div>
                  <div className={styles.configRow}>
                    <span className={styles.configLbl}>Cuota mensual</span>
                    <span className={styles.configVal}>
                      {formatCuota(grupoSel.monthly_fee)}
                    </span>
                  </div>
                  <div className={styles.configRow}>
                    <span className={styles.configLbl}>Estado</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: grupoSel.active
                          ? "var(--verde-light)"
                          : "var(--rojo-light)",
                        color: grupoSel.active
                          ? "var(--verde-s)"
                          : "var(--rojo)"
                      }}
                    >
                      {grupoSel.active ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className={styles.configRow}>
                    <span className={styles.configLbl}>Color</span>
                    <div
                      className={styles.colorDot}
                      style={{ background: grupoSel.color }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <ModalNivel
        open={modalNivelOpen}
        nivel={nivelEditando}
        onClose={() => setModalNivelOpen(false)}
        onSuccess={() => {
          setModalNivelOpen(false);
          recargar();
        }}
      />
    </div>
  );
}
