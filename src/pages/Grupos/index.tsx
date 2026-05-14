import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MdSearch, MdAdd, MdEdit, MdDelete, MdSettings } from "react-icons/md";
import { AnimalIcon, getGrupo } from "../../components/ui/AnimalKit";
import styles from "./Grupos.module.css";
import {
  getGrupos,
  getNiveles,
  eliminarGrupo
} from "../../services/gruposService";
import ModalGrupo from "./ModalGrupo";
import ModalGestionNiveles from "./ModalGestionNiveles";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ModalAlumno from "../Alumnos/ModalAlumno";
import { getAlumnos } from "../../services/alumnosService";
import type { ApiStudent, PaginatedResponse as PRStudent } from "../Alumnos/types";
import type { Grupo, GrupoFormData, Nivel, PaginatedResponseS } from "../../types";

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

function calcularEdad(birthDate: string): string {
  const hoy = new Date();
  const nac = new Date(birthDate + "T00:00:00");
  let años = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) años--;
  return `${años} año${años !== 1 ? "s" : ""}`;
}

export default function Grupos() {
  const queryClient = useQueryClient();

  // Estado de UI 
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [modalNivelOpen, setModalNivelOpen] = useState(false);
  const [modalGrupoOpen, setModalGrupoOpen] = useState(false);
  const [grupoEditando, setGrupoEditando] = useState<GrupoFormData | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);
  const [confirmEliminarOpen, setConfirmEliminarOpen] = useState(false);
  const [modalAgregarAlumnoOpen, setModalAgregarAlumnoOpen] = useState(false);

  // Queries
  const { data: nivelesRes, isLoading: cargandoNiveles } = useQuery({
    queryKey: ["niveles"],
    queryFn: () => getNiveles({ order_by: "order", order_direction: "asc", per_page: 100 }),
  });

  const { data: gruposRes, isLoading: cargandoGrupos, error: gruposError } = useQuery({
    queryKey: ["grupos"],
    queryFn: () => getGrupos({ active: true, per_page: 50 }),
  });

  // Alumnos del grupo seleccionado — TanStack cachea por grupo automáticamente
  const { data: alumnosRes, isLoading: cargandoAlumnos } = useQuery({
    queryKey: ["alumnos-grupo", selectedUuid],
    queryFn: () => getAlumnos({ group_uuid: selectedUuid!, per_page: 100 }),
    enabled: !!selectedUuid,
  });

  const niveles = nivelesRes?.data ?? [];
  const grupos = gruposRes?.data ?? [];
  const alumnosGrupo = alumnosRes?.data ?? [];
  const cargando = cargandoNiveles || cargandoGrupos;
  const errorMsg = gruposError instanceof Error ? gruposError.message : null;

  // Seleccionar el primer grupo cuando cargan los datos
  useEffect(() => {
    if (grupos.length > 0 && !selectedUuid) {
      setSelectedUuid(grupos[0].id);
    }
  }, [grupos.length]);

  // Mutation: eliminar grupo con optimistic update
  const eliminarMutation = useMutation({
    mutationFn: (uuid: string) => eliminarGrupo(uuid),
    onMutate: async (uuid) => {
      await queryClient.cancelQueries({ queryKey: ["grupos"] });
      const prevData = queryClient.getQueryData(["grupos"]);
      queryClient.setQueryData<PaginatedResponseS<Grupo>>(["grupos"], (old) =>
        old ? { ...old, data: old.data.filter((g) => g.id !== uuid) } : old
      );
      setSelectedUuid(null);
      setConfirmEliminarOpen(false);
      return { prevData, uuid };
    },
    onError: (err, uuid, context) => {
      queryClient.setQueryData(["grupos"], context?.prevData);
      setSelectedUuid(uuid);
      setErrorEliminar(err instanceof Error ? err.message : "No se pudo eliminar el grupo.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
    },
  });

  // Derivados
  const gruposPorNivel = [...niveles]
    .sort((a, b) => a.order - b.order)
    .map((nivel) => ({
      nivel,
      grupos: grupos.filter((g) => g.level?.id === nivel.id),
    }))
    .filter((n) => n.grupos.length > 0);

  const grupoSel = grupos.find((g) => g.id === selectedUuid) ?? null;
  const gc = grupoSel ? getGrupo(grupoSel.icon_path ?? "") : null;
  const alumnosFiltrados = alumnosGrupo.filter(
    (a) =>
      !busqueda ||
      `${a.name} ${a.last_name}`.toLowerCase().includes(busqueda.toLowerCase())
  );

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

  function handleEliminar() {
    if (!grupoSel) return;
    eliminarMutation.mutate(grupoSel.id);
  }

  return (
    <div className={styles.content}>
      {/* ── HEADER ── */}
      <div className={styles.headerRow}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--texto-3)" }}>
          {grupos.length} grupos · {niveles.length} niveles
        </span>
        <div className={styles.headerBtns}>
          <button className={styles.btnH} onClick={() => setModalNivelOpen(true)}>
            <MdSettings size={13} /> Gestionar niveles
          </button>
          <button
            className={styles.btnP}
            onClick={() => {
              setGrupoEditando(null);
              setModalGrupoOpen(true);
            }}
          >
            <MdAdd size={13} /> Nuevo grupo
          </button>
        </div>
      </div>

      {grupoSel && (
        <div className={styles.headerBtns} style={{ justifyContent: "flex-end" }}>
          <button
            className={styles.btnH}
            onClick={() => {
              setGrupoEditando(grupoSel);
              setModalGrupoOpen(true);
            }}
          >
            <MdEdit size={13} /> Editar
          </button>
          <button
            className={styles.btnDanger}
            onClick={() => setConfirmEliminarOpen(true)}
          >
            <MdDelete size={13} /> Eliminar
          </button>
        </div>
      )}

      {errorEliminar && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--rojo)",
            background: "var(--rojo-light)",
            borderRadius: 8,
            padding: "8px 14px",
          }}
        >
          {errorEliminar}
        </div>
      )}

      {grupos.length === 0 && niveles.length === 0 && (
        <div className={styles.emptyAlumnos} style={{ padding: "48px 24px" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🏫</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--texto-2)", marginBottom: 4 }}>
            No hay grupos registrados
          </div>
          <div style={{ fontSize: 11, fontWeight: 600 }}>
            Comienza creando un nivel y luego asigna grupos a él
          </div>
        </div>
      )}

      {grupos.length === 0 && niveles.length > 0 && (
        <div className={styles.emptyAlumnos} style={{ padding: "48px 24px" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--texto-2)", marginBottom: 4 }}>
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
              const g = getGrupo(gr.icon_path ?? "");
              return (
                <div
                  key={gr.id}
                  className={`${styles.grupoCard} ${gr.id === selectedUuid ? styles.grupoCardSel : ""}`}
                  onClick={() => {
                    setSelectedUuid(gr.id);
                    setBusqueda("");
                  }}
                >
                  <div className={styles.gcBanner} style={{ background: `${gr.color}22` }}>
                    <AnimalIcon salon={gr.icon_path ?? ""} size={48} />
                  </div>
                  <div className={styles.gcBody}>
                    <div className={styles.gcNombre}>
                      {gr.name}
                      {gr.id === selectedUuid && (
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
                        <span className={styles.gcNum} style={{ color: "var(--verde)", fontSize: 12 }}>
                          {formatCuota(gr.monthly_fee)}
                        </span>
                        <span className={styles.gcLbl}>Cuota</span>
                      </div>
                      <div className={styles.gcStat}>
                        <span
                          className={styles.gcNum}
                          style={{ color: gr.active ? "var(--verde)" : "var(--rojo)", fontSize: 12 }}
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
                background: grupoSel.color,
                boxShadow: `0 1px 0 ${gc?.shadow ?? "var(--gris-borde)"}`,
              }}
            />
            <span className={styles.detalleTitulo}>{grupoSel.name}</span>
            <span
              className={styles.nivelBadge}
              style={{
                background: gc?.light ?? "var(--gris-bg)",
                color: gc?.dark ?? "var(--texto-2)",
              }}
            >
              {grupoSel.level?.name ?? "Sin nivel"}
            </span>
          </div>

          <div className={styles.detalleLayout}>
            {/* TABLA DE ALUMNOS */}
            <div className={styles.card}>
              <div className={styles.cardH}>
                <div>
                  <div className={styles.cardT}>Alumnos del salón</div>
                  <div className={styles.cardSub}>Capacidad máx. {grupoSel.capacity} alumnos</div>
                </div>
                <button className={styles.btnP} onClick={() => setModalAgregarAlumnoOpen(true)}>
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
                </div>

                {cargandoAlumnos ? (
                  <div className={styles.emptyAlumnos}>Cargando alumnos…</div>
                ) : alumnosFiltrados.length === 0 ? (
                  <div className={styles.emptyAlumnos}>
                    {busqueda ? "No se encontraron alumnos" : "Este grupo no tiene alumnos aún"}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {alumnosFiltrados.map((a) => (
                      <div
                        key={a.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 4px",
                          borderBottom: "1px solid var(--gris-borde)",
                        }}
                      >
                        <div
                          className={styles.alAv}
                          style={{
                            background: gc?.light ?? "var(--gris-bg)",
                            color: gc?.dark ?? "var(--texto-2)",
                            border: `1.5px solid ${gc?.color ?? "var(--gris-borde)"}`,
                          }}
                        >
                          {a.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className={styles.alNombre}>{a.name} {a.last_name}</div>
                          <div className={styles.alEdad}>{calcularEdad(a.birth_date)}</div>
                        </div>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 900,
                            padding: "2px 8px",
                            borderRadius: 20,
                            background: a.active ? "var(--verde-light)" : "var(--rojo-light)",
                            color: a.active ? "var(--verde-s)" : "var(--rojo)",
                          }}
                        >
                          {a.active ? "Activo" : "Baja"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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
                    <span className={styles.configVal}>{grupoSel.level?.name ?? "—"}</span>
                  </div>
                  <div className={styles.configRow}>
                    <span className={styles.configLbl}>Horario</span>
                    <span className={styles.configVal}>
                      {formatHorario(grupoSel.entry_time, grupoSel.dismissal_time)}
                    </span>
                  </div>
                  <div className={styles.configRow}>
                    <span className={styles.configLbl}>Capacidad máx.</span>
                    <span className={styles.configVal}>{grupoSel.capacity} alumnos</span>
                  </div>
                  <div className={styles.configRow}>
                    <span className={styles.configLbl}>Cuota mensual</span>
                    <span className={styles.configVal}>{formatCuota(grupoSel.monthly_fee)}</span>
                  </div>
                  <div className={styles.configRow}>
                    <span className={styles.configLbl}>Estado</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: grupoSel.active ? "var(--verde-light)" : "var(--rojo-light)",
                        color: grupoSel.active ? "var(--verde-s)" : "var(--rojo)",
                      }}
                    >
                      {grupoSel.active ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className={styles.configRow}>
                    <span className={styles.configLbl}>Color</span>
                    <div
                      className={styles.colorDot}
                      style={{ background: gc?.color ?? "#E5E5E5" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── MODALES ── */}
      <ModalGestionNiveles
        open={modalNivelOpen}
        niveles={niveles}
        onClose={() => setModalNivelOpen(false)}
        onSuccess={(nuevosNiveles) => {
          queryClient.setQueryData<PaginatedResponseS<Nivel>>(["niveles"], (old) =>
            old ? { ...old, data: nuevosNiveles } : old
          );
          queryClient.invalidateQueries({ queryKey: ["niveles"] });
          queryClient.invalidateQueries({ queryKey: ["grupos"] });
        }}
      />

      <ModalGrupo
        open={modalGrupoOpen}
        grupo={grupoEditando}
        niveles={niveles}
        onClose={() => setModalGrupoOpen(false)}
        onSuccess={(grupoGuardado) => {
          setModalGrupoOpen(false);
          queryClient.setQueryData<PaginatedResponseS<Grupo>>(["grupos"], (old) => {
            if (!old) return old;
            const existe = old.data.find((g) => g.id === grupoGuardado.id);
            if (existe) {
              return { ...old, data: old.data.map((g) => g.id === grupoGuardado.id ? grupoGuardado : g) };
            }
            return { ...old, data: [...old.data, grupoGuardado] };
          });
          queryClient.invalidateQueries({ queryKey: ["grupos"] });
          setSelectedUuid(grupoGuardado.id);
        }}
      />

      <ConfirmDialog
        open={confirmEliminarOpen}
        titulo="Eliminar grupo"
        mensaje={`¿Seguro que quieres eliminar "${grupoSel?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={handleEliminar}
        onCancel={() => setConfirmEliminarOpen(false)}
      />

      <ModalAlumno
        open={modalAgregarAlumnoOpen}
        grupos={grupos}
        defaultGroupUuid={grupoSel?.id}
        onClose={() => setModalAgregarAlumnoOpen(false)}
        onSuccess={(alumnoGuardado) => {
          setModalAgregarAlumnoOpen(false);
          queryClient.setQueryData<PRStudent<ApiStudent>>(
            ["alumnos-grupo", selectedUuid],
            (old) => old ? { ...old, data: [...old.data, alumnoGuardado] } : old
          );
          queryClient.invalidateQueries({ queryKey: ["alumnos-grupo", selectedUuid] });
        }}
      />
    </div>
  );
}
