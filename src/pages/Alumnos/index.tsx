import { useState, useEffect } from "react";
import { MdDownload, MdEdit, MdAdd, MdSearch, MdDelete } from "react-icons/md";
import {
  AnimalAvatar,
  AnimalPillLight,
  AnimalIcon,
  getGrupo
} from "../../components/ui/AnimalKit";
import styles from "./Alumnos.module.css";
import type { ApiStudent } from "./types";
import type { ApiGroup } from "../Grupos/types";
import { getAlumnos, eliminarAlumno } from "../../services/alumnosService";
import { getGrupos } from "../../services/gruposService";
import ModalAlumno from "./ModalAlumno";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { ASISTENCIA, AREAS, AUTORIZADOS, BITACORAS } from "./alumnos.mock";

const ASIST_CLASS: Record<string, string> = {
  vac: styles.dVac,
  pres: styles.dPres,
  aus: styles.dAus,
  tard: styles.dTard,
  hoy: styles.dHoy
};

function calcularEdad(birthDate: string): string {
  const hoy = new Date();
  const nac = new Date(birthDate + "T00:00:00");
  let años = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) años--;
  return `${años} año${años !== 1 ? "s" : ""}`;
}

function formatFecha(dateStr: string): string {
  const fecha = new Date(dateStr + "T00:00:00");
  return fecha.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

let _cacheAlumnos: ApiStudent[] = [];
let _cacheGruposAlumnos: ApiGroup[] = [];

export default function Alumnos() {
  const [alumnos, setAlumnos] = useState<ApiStudent[]>(_cacheAlumnos);
  const [grupos, setGrupos] = useState<ApiGroup[]>(_cacheGruposAlumnos);
  const [cargando, setCargando] = useState(_cacheAlumnos.length === 0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [filtroGrupo, setFiltroGrupo] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [modalAlumnoOpen, setModalAlumnoOpen] = useState(false);
  const [alumnoEditando, setAlumnoEditando] = useState<ApiStudent | null>(null);
  const [confirmEliminarOpen, setConfirmEliminarOpen] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getAlumnos({
        order_by: "last_name",
        order_direction: "asc",
        per_page: 100
      }),
      getGrupos({ active: true, per_page: 50 })
    ])
      .then(([alumnosRes, gruposRes]) => {
        _cacheAlumnos = alumnosRes.data;
        _cacheGruposAlumnos = gruposRes.data;
        setAlumnos(alumnosRes.data);
        setGrupos(gruposRes.data);
        if (alumnosRes.data.length > 0) setSelectedUuid(alumnosRes.data[0].id);
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setCargando(false));
  }, []);

  const gruposConAlumnos = grupos.filter((g) =>
    alumnos.some((a) => a.group?.id === g.id)
  );

  const alumnosFiltrados = alumnos.filter((a) => {
    const nombre = `${a.name} ${a.last_name}`.toLowerCase();
    const matchBusqueda =
      !busqueda ||
      nombre.includes(busqueda.toLowerCase()) ||
      a.curp.toLowerCase().includes(busqueda.toLowerCase());
    const matchGrupo = !filtroGrupo || a.group?.id === filtroGrupo;
    return matchBusqueda && matchGrupo;
  });

  const alumnoSel = alumnos.find((a) => a.id === selectedUuid) ?? null;
  const gc = alumnoSel ? getGrupo(alumnoSel.group?.icon_path ?? "") : null;

  async function handleEliminar() {
    if (!alumnoSel) return;
    const alumnoEliminado = alumnoSel;
    setAlumnos((prev) => prev.filter((a) => a.id !== alumnoEliminado.id));
    setSelectedUuid(null);
    setConfirmEliminarOpen(false);
    try {
      await eliminarAlumno(alumnoEliminado.id);
    } catch (err) {
      setAlumnos((prev) => [...prev, alumnoEliminado]);
      setSelectedUuid(alumnoEliminado.id);
      setErrorEliminar(
        err instanceof Error ? err.message : "No se pudo eliminar el alumno."
      );
    }
  }

  function handleAlumnoGuardado(alumnoGuardado: ApiStudent) {
    setModalAlumnoOpen(false);
    setAlumnos((prev) => {
      const existe = prev.find((a) => a.id === alumnoGuardado.id);
      if (existe)
        return prev.map((a) =>
          a.id === alumnoGuardado.id ? alumnoGuardado : a
        );
      return [...prev, alumnoGuardado];
    });
    setSelectedUuid(alumnoGuardado.id);
  }

  if (cargando)
    return (
      <div
        className={styles.root}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 700,
          color: "var(--texto-3)"
        }}
      >
        Cargando alumnos…
      </div>
    );
  if (errorMsg)
    return (
      <div
        className={styles.root}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 700,
          color: "var(--rojo)"
        }}
      >
        {errorMsg}
      </div>
    );

  return (
    <div className={styles.root}>
      {/* ── LISTA ── */}
      <div className={styles.panelLista}>
        <div className={styles.listaHeader}>
          <div className={styles.listaTop}>
            <span className={styles.listaTitulo}>Alumnos</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className={styles.listaCount}>
                {alumnos.length} alumnos
              </span>
              <button
                className={styles.btnP}
                onClick={() => {
                  setAlumnoEditando(null);
                  setModalAlumnoOpen(true);
                }}
              >
                <MdAdd size={12} /> Nuevo
              </button>
            </div>
          </div>
          <div className={styles.searchWrap}>
            <MdSearch size={14} color="var(--texto-3)" />
            <input
              className={styles.searchInput}
              placeholder="Buscar alumno o CURP…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className={styles.salonFilters}>
            <button
              className={`${styles.sf} ${filtroGrupo === null ? styles.sfOn : styles.sfOff}`}
              onClick={() => setFiltroGrupo(null)}
            >
              Todos · {alumnos.length}
            </button>
            {gruposConAlumnos.map((g) => (
              <button
                key={g.id}
                className={`${styles.sf} ${filtroGrupo === g.id ? styles.sfOn : styles.sfOff}`}
                onClick={() => setFiltroGrupo(g.id)}
              >
                <AnimalIcon salon={g.icon_path ?? ""} size={10} />
                {g.name} · {alumnos.filter((a) => a.group?.id === g.id).length}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.lista}>
          {alumnosFiltrados.length === 0 && (
            <div
              style={{
                padding: "32px 16px",
                textAlign: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "var(--texto-3)"
              }}
            >
              No se encontraron alumnos
            </div>
          )}
          {alumnosFiltrados.map((a) => {
            const g = getGrupo(a.group?.icon_path ?? "");
            return (
              <div
                key={a.id}
                className={`${styles.alItem} ${a.id === selectedUuid ? styles.alSel : ""}`}
                onClick={() => setSelectedUuid(a.id)}
              >
                <div
                  className={styles.alAv}
                  style={{
                    background: g?.light ?? "var(--gris-bg)",
                    color: g?.dark ?? "var(--texto-2)",
                    border: `1.5px solid ${g?.color ?? "var(--gris-borde)"}`
                  }}
                >
                  {a.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.alDatos}>
                  <div className={styles.alNombre}>
                    {a.name} {a.last_name}
                  </div>
                  <div className={styles.alMeta}>
                    <span
                      className={styles.alTag}
                      style={{
                        background: g?.light ?? "var(--gris-bg)",
                        color: g?.dark ?? "var(--texto-2)"
                      }}
                    >
                      {a.group?.name ?? "Sin grupo"}
                    </span>
                    <span className={styles.alEdad}>
                      {calcularEdad(a.birth_date)}
                    </span>
                  </div>
                </div>
                <div className={styles.alRight}>
                  <span
                    className={styles.alSt}
                    style={{
                      background: a.active
                        ? "var(--verde-light)"
                        : "var(--rojo-light)",
                      color: a.active ? "var(--verde-s)" : "var(--rojo)"
                    }}
                  >
                    {a.active ? "Activo" : "Baja"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── EXPEDIENTE ── */}
      {alumnoSel ? (
        <div className={styles.panelExp}>
          <div className={styles.expTopbar}>
            <div>
              <div className={styles.expTitulo}>
                {alumnoSel.name} {alumnoSel.last_name}
              </div>
              <div className={styles.expSub}>
                Expediente · {alumnoSel.group?.name ?? "Sin grupo"}
              </div>
            </div>
            <div className={styles.expActions}>
              <button className={styles.btnS}>
                <MdDownload size={13} /> Exportar
              </button>
              <button
                className={styles.btnS}
                onClick={() => {
                  setAlumnoEditando(alumnoSel);
                  setModalAlumnoOpen(true);
                }}
              >
                <MdEdit size={13} /> Editar
              </button>
              <button
                className={styles.btnS}
                style={{ color: "var(--rojo)" }}
                onClick={() => setConfirmEliminarOpen(true)}
              >
                <MdDelete size={13} /> Eliminar
              </button>
              <button className={styles.btnP}>
                <MdAdd size={13} color="#5A4800" /> Nueva bitácora
              </button>
            </div>
          </div>

          {errorEliminar && (
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--rojo)",
                background: "var(--rojo-light)",
                borderRadius: 8,
                padding: "8px 14px",
                margin: "0 20px"
              }}
            >
              {errorEliminar}
            </div>
          )}

          <div className={styles.expContent}>
            {/* HERO */}
            <div className={styles.alumnoHero}>
              <AnimalAvatar
                group={alumnoSel.group?.icon_path ?? ""}
                size="lg"
              />
              <div className={styles.heroDatos}>
                <div className={styles.heroNombre}>
                  {alumnoSel.name} {alumnoSel.last_name}
                </div>
                <div className={styles.heroChips}>
                  <span className={styles.hc}>
                    ⏱ {calcularEdad(alumnoSel.birth_date)}
                  </span>
                  <span className={styles.hc}>
                    📅 {formatFecha(alumnoSel.birth_date)}
                  </span>
                  {alumnoSel.group && (
                    <AnimalPillLight
                      group={alumnoSel.group.icon_path ?? ""}
                      label={alumnoSel.group.name}
                    />
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { num: "—", lbl: "Asistencia", color: "var(--verde)" },
                    { num: "—", lbl: "Bitácoras", color: "var(--turquesa)" },
                    { num: "—", lbl: "Áreas activas", color: "var(--rosa)" },
                    {
                      num: "—",
                      lbl: "Avisos leídos",
                      color: "var(--amarillo-s)"
                    }
                  ].map((sc) => (
                    <div key={sc.lbl} className={styles.statChip}>
                      <div className={styles.scNum} style={{ color: sc.color }}>
                        {sc.num}
                      </div>
                      <div className={styles.scLbl}>{sc.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.heroRight}>
                <span className={styles.inscritaBadge}>
                  {alumnoSel.active ? "✓ Activo" : "Baja"}
                </span>
                <div style={{ textAlign: "right", marginTop: 4 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--texto-3)"
                    }}
                  >
                    CURP
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: "var(--texto)"
                    }}
                  >
                    {alumnoSel.curp}
                  </div>
                </div>
              </div>
            </div>

            {/* DATOS + ASISTENCIA */}
            <div className={styles.g2}>
              <div className={styles.dc}>
                <div className={styles.dch}>
                  <span className={styles.dct}>Datos personales</span>
                  <span
                    className={styles.dcl}
                    onClick={() => {
                      setAlumnoEditando(alumnoSel);
                      setModalAlumnoOpen(true);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Editar
                  </span>
                </div>
                <div className={styles.dcb}>
                  {[
                    {
                      lbl: "Nombre completo",
                      val: `${alumnoSel.name} ${alumnoSel.last_name}`
                    },
                    {
                      lbl: "Fecha de nacimiento",
                      val: `${formatFecha(alumnoSel.birth_date)} · ${calcularEdad(alumnoSel.birth_date)}`
                    },
                    { lbl: "CURP", val: alumnoSel.curp },
                    {
                      lbl: "Tipo de sangre",
                      val: alumnoSel.blood_type ?? "No registrado"
                    },
                    {
                      lbl: "Alergias",
                      val: alumnoSel.allergies ?? "Ninguna",
                      color: alumnoSel.allergies ? "var(--rojo)" : undefined
                    },
                    {
                      lbl: "Medicamentos",
                      val: alumnoSel.medicines ?? "Ninguno"
                    }
                  ].map((d) => (
                    <div key={d.lbl} className={styles.datoRow}>
                      <span className={styles.datoLbl}>{d.lbl}</span>
                      <span
                        className={styles.datoVal}
                        style={{ color: d.color }}
                      >
                        {d.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.dc}>
                <div className={styles.dch}>
                  <span className={styles.dct}>Asistencia — Octubre 2025</span>
                  <span className={styles.dcl}>Ver historial</span>
                </div>
                <div className={styles.dcb}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                    {[
                      { color: "var(--verde)", lbl: "Presente" },
                      { color: "var(--rojo)", lbl: "Ausente" },
                      { color: "var(--amarillo)", lbl: "Retardo" }
                    ].map((l) => (
                      <div
                        key={l.lbl}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 10,
                          fontWeight: 700,
                          color: "var(--texto-2)"
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 3,
                            background: l.color
                          }}
                        />
                        {l.lbl}
                      </div>
                    ))}
                  </div>
                  <div className={styles.asistGrid}>
                    {ASISTENCIA.map((d) => (
                      <div
                        key={d.dia}
                        className={`${styles.dia} ${ASIST_CLASS[d.tipo]}`}
                      >
                        {d.dia}
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      marginTop: 10,
                      justifyContent: "center"
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        color: "var(--verde)"
                      }}
                    >
                      14 presentes
                    </span>
                    <span style={{ color: "var(--texto-3)" }}>·</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        color: "var(--rojo)"
                      }}
                    >
                      1 ausente
                    </span>
                    <span style={{ color: "var(--texto-3)" }}>·</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        color: "#B89600"
                      }}
                    >
                      1 retardo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* MONTESSORI + AUTORIZADOS */}
            <div className={styles.g2}>
              <div className={styles.dc}>
                <div className={styles.dch}>
                  <span className={styles.dct}>Desarrollo Montessori</span>
                  <span className={styles.dcl}>Ver bitácoras</span>
                </div>
                <div className={styles.dcb}>
                  {AREAS.map((a) => (
                    <div key={a.nombre} className={styles.areaRow}>
                      <div
                        className={styles.areaDot}
                        style={{ background: a.color }}
                      />
                      <span className={styles.areaNombre}>{a.nombre}</span>
                      <div className={styles.areaBarraW}>
                        <div
                          className={styles.areaBarra}
                          style={{
                            width: `${a.pct * 100}%`,
                            background: a.color
                          }}
                        />
                      </div>
                      <span className={styles.areaCount}>{a.count}</span>
                      <span
                        className={styles.areaNivel}
                        style={{ background: a.nBg, color: a.nColor }}
                      >
                        {a.nivel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.dc}>
                <div className={styles.dch}>
                  <span className={styles.dct}>Personas autorizadas</span>
                  <span className={styles.dcl}>+ Agregar</span>
                </div>
                <div className={styles.dcb}>
                  {AUTORIZADOS.map((p) => (
                    <div key={p.nombre} className={styles.autRow}>
                      <div
                        className={styles.autAv}
                        style={{
                          background: p.bg,
                          color: p.color,
                          border: `1.5px solid ${p.border}`
                        }}
                      >
                        {p.inicial}
                      </div>
                      <div className={styles.autDatos}>
                        <div className={styles.autNombre}>{p.nombre}</div>
                        <div className={styles.autRel}>{p.rel}</div>
                        <div className={styles.autTel}>{p.tel}</div>
                      </div>
                      <span
                        className={styles.autBadge}
                        style={{ background: p.badgeBg, color: p.badgeColor }}
                      >
                        {p.badge}
                      </span>
                    </div>
                  ))}
                  <button className={styles.btnAdd}>
                    <MdAdd size={14} /> Agregar persona autorizada
                  </button>
                </div>
              </div>
            </div>

            {/* BITÁCORAS */}
            <div className={styles.dc}>
              <div className={styles.dch}>
                <div>
                  <span className={styles.dct}>Bitácoras recientes</span>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--texto-3)",
                      marginTop: 2
                    }}
                  >
                    28 observaciones en el ciclo
                  </div>
                </div>
                <span className={styles.dcl}>Ver todas →</span>
              </div>
              <div
                className={styles.dcb}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "0 20px"
                }}
              >
                {BITACORAS.map((b) => (
                  <div key={b.area} className={styles.bitItem}>
                    <div className={styles.bitTop}>
                      <span
                        className={styles.bitArea}
                        style={{ background: b.areaBg, color: b.areaColor }}
                      >
                        {b.area}
                      </span>
                      <span className={styles.bitFecha}>{b.fecha}</span>
                    </div>
                    <div className={styles.bitTexto}>{b.texto}</div>
                    <span
                      className={styles.bitNivel}
                      style={{ background: b.nivelBg, color: b.nivelColor }}
                    >
                      {b.nivel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={styles.panelExp}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--texto-3)"
          }}
        >
          Selecciona un alumno para ver su expediente
        </div>
      )}

      <ModalAlumno
        open={modalAlumnoOpen}
        alumno={alumnoEditando}
        grupos={grupos}
        onClose={() => setModalAlumnoOpen(false)}
        onSuccess={handleAlumnoGuardado}
      />

      <ConfirmDialog
        open={confirmEliminarOpen}
        titulo="Eliminar alumno"
        mensaje={`¿Seguro que quieres eliminar a "${alumnoSel?.name} ${alumnoSel?.last_name}"? Esta acción no se puede deshacer.`}
        onConfirm={handleEliminar}
        onCancel={() => setConfirmEliminarOpen(false)}
      />
    </div>
  );
}
