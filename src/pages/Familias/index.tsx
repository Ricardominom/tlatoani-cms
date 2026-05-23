import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MdSearch, MdEdit, MdPhone, MdEmail } from "react-icons/md";
import styles from "./Familias.module.css";
import type { Usuario } from "../../types";
import { getUsuarios } from "../../services/usuariosService";
import ModalUsuario from "../Usuarios/ModalUsuario";

type Filtro = "todos" | "activos" | "baja";

function formatFecha(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function formatFechaHora(dateStr: string | null): string {
  if (!dateStr) return "Nunca";
  return new Date(dateStr).toLocaleString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function Familias() {
  const queryClient = useQueryClient();
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  const {
    data: usuariosRes,
    isLoading,
    error
  } = useQuery({
    queryKey: ["usuarios-familia"],
    queryFn: () =>
      getUsuarios({
        role: "family",
        order_by: "last_name",
        order_direction: "asc",
        per_page: 100
      })
  });

  const familias = usuariosRes?.data ?? [];
  const activeUuid = selectedUuid ?? familias[0]?.id ?? null;
  const errorMsg = error instanceof Error ? error.message : null;

  const familiasFiltradas = familias.filter((u) => {
    const nombre = `${u.name} ${u.last_name}`.toLowerCase();
    const matchBusqueda =
      !busqueda ||
      nombre.includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase());
    const matchFiltro =
      filtro === "activos" ? u.active : filtro === "baja" ? !u.active : true;
    return matchBusqueda && matchFiltro;
  });

  const familiaSel = familias.find((u) => u.id === activeUuid) ?? null;

  function handleGuardado(usuarioGuardado: Usuario) {
    queryClient.invalidateQueries({ queryKey: ["usuarios-familia"] });
    setModalOpen(false);
    setSelectedUuid(usuarioGuardado.id);
  }

  if (isLoading)
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
        Cargando familias…
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
            <span className={styles.listaTitulo}>Familias</span>
            <span className={styles.listaCount}>{familias.length} padres</span>
          </div>
          <div className={styles.searchWrap}>
            <MdSearch size={14} color="var(--texto-3)" />
            <input
              className={styles.searchInput}
              placeholder="Buscar padre, tutor o correo…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className={styles.filtros}>
            <button
              className={`${styles.fil} ${filtro === "todos" ? styles.filOn : styles.filOff}`}
              onClick={() => setFiltro("todos")}
            >
              Todos · {familias.length}
            </button>
            <button
              className={`${styles.fil} ${filtro === "activos" ? styles.filOn : styles.filOff}`}
              onClick={() => setFiltro("activos")}
            >
              Activos · {familias.filter((u) => u.active).length}
            </button>
            <button
              className={`${styles.fil} ${filtro === "baja" ? styles.filOn : styles.filRed}`}
              onClick={() => setFiltro("baja")}
            >
              Baja · {familias.filter((u) => !u.active).length}
            </button>
          </div>
        </div>

        <div className={styles.lista}>
          {familiasFiltradas.length === 0 && (
            <div className={styles.sinResultados}>
              No se encontraron familias
            </div>
          )}
          {familiasFiltradas.map((u) => (
            <div
              key={u.id}
              className={`${styles.famItem} ${u.id === activeUuid ? styles.famSel : ""}`}
              onClick={() => setSelectedUuid(u.id)}
            >
              <div
                className={styles.famAv}
                style={{
                  background: u.active
                    ? "var(--amarillo-light)"
                    : "var(--gris-bg)",
                  color: u.active ? "#7A6200" : "var(--texto-3)",
                  border: `1.5px solid ${u.active ? "var(--amarillo)" : "var(--gris-borde)"}`
                }}
              >
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.famDatos}>
                <div className={styles.famNombre}>
                  {u.name} {u.last_name}
                </div>
                <div className={styles.famEmail}>{u.email}</div>
                {u.phone_number && (
                  <div className={styles.famPhone}>{u.phone_number}</div>
                )}
              </div>
              {!u.active && (
                <span
                  className={styles.famStatus}
                  style={{
                    background: "var(--rojo-light)",
                    color: "var(--rojo)"
                  }}
                >
                  Baja
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── DETALLE ── */}
      {familiaSel ? (
        <div className={styles.panelDet}>
          <div className={styles.detTopbar}>
            <div>
              <div className={styles.detTitulo}>
                {familiaSel.name} {familiaSel.last_name}
              </div>
              <div className={styles.detSub}>
                Padre / Tutor · {familiaSel.email}
              </div>
            </div>
            <div className={styles.detActions}>
              <button
                className={styles.btnP}
                onClick={() => {
                  setUsuarioEditando(familiaSel);
                  setModalOpen(true);
                }}
              >
                <MdEdit size={13} /> Editar
              </button>
            </div>
          </div>

          <div className={styles.detContent}>
            {/* HERO */}
            <div className={styles.famHero}>
              <div
                className={styles.heroAv}
                style={{
                  background: familiaSel.active
                    ? "var(--amarillo-light)"
                    : "var(--gris-bg)",
                  color: familiaSel.active ? "#7A6200" : "var(--texto-3)",
                  border: `2px solid ${familiaSel.active ? "var(--amarillo)" : "var(--gris-borde)"}`,
                  boxShadow: familiaSel.active
                    ? "0 3px 0 var(--amarillo)"
                    : "none"
                }}
              >
                {familiaSel.name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.heroDatos}>
                <div className={styles.heroNombre}>
                  {familiaSel.name} {familiaSel.last_name}
                </div>
                <div className={styles.heroMeta}>
                  <span className={styles.metaChip}>
                    <MdEmail size={10} style={{ marginRight: 3 }} />
                    {familiaSel.email}
                  </span>
                  {familiaSel.phone_number && (
                    <span className={styles.metaChip}>
                      <MdPhone size={10} style={{ marginRight: 3 }} />
                      {familiaSel.phone_number}
                    </span>
                  )}
                  <span className={styles.metaChip}>
                    📅 Desde {formatFecha(familiaSel.created_at)}
                  </span>
                  <span className={styles.metaChip}>
                    Últ. acceso: {formatFechaHora(familiaSel.last_access)}
                  </span>
                </div>
              </div>
              <div className={styles.heroRight}>
                <span
                  className={styles.estadoBadge}
                  style={{
                    background: familiaSel.active
                      ? "var(--verde-light)"
                      : "var(--rojo-light)",
                    color: familiaSel.active ? "var(--verde-s)" : "var(--rojo)",
                    border: `1px solid ${familiaSel.active ? "var(--verde)" : "#F5C8C8"}`
                  }}
                >
                  {familiaSel.active ? "✓ Activo" : "Baja"}
                </span>
              </div>
            </div>

            <div className={styles.g2}>
              {/* DATOS DE CONTACTO */}
              <div className={styles.dc}>
                <div className={styles.dch}>
                  <span className={styles.dct}>Datos de contacto</span>
                  <span
                    className={styles.dcl}
                    onClick={() => {
                      setUsuarioEditando(familiaSel);
                      setModalOpen(true);
                    }}
                  >
                    Editar
                  </span>
                </div>
                <div className={styles.dcb}>
                  {[
                    {
                      lbl: "Nombre completo",
                      val: `${familiaSel.name} ${familiaSel.last_name}`
                    },
                    { lbl: "Correo", val: familiaSel.email },
                    {
                      lbl: "Teléfono",
                      val: familiaSel.phone_number ?? "No registrado"
                    },
                    {
                      lbl: "Estado",
                      val: familiaSel.active ? "Activo" : "Baja",
                      color: familiaSel.active
                        ? "var(--verde-s)"
                        : "var(--rojo)"
                    },
                    {
                      lbl: "Registrado",
                      val: formatFecha(familiaSel.created_at)
                    },
                    {
                      lbl: "Último acceso",
                      val: formatFechaHora(familiaSel.last_access)
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

              {/* ALUMNOS VINCULADOS */}
              <div className={styles.dc}>
                <div className={styles.dch}>
                  <div>
                    <span className={styles.dct}>Alumnos vinculados</span>
                    <div className={styles.dcSub}>Próximamente</div>
                  </div>
                </div>
                <div className={styles.dcb}>
                  <div className={styles.placeholder}>
                    <span className={styles.placeholderTxt}>
                      Disponible cuando el backend exponga
                    </span>
                    <code className={styles.placeholderCode}>
                      GET /v1/users/{"{uuid}"}/students
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={styles.panelDet}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--texto-3)"
          }}
        >
          Selecciona un padre o tutor para ver el detalle
        </div>
      )}

      <ModalUsuario
        key={usuarioEditando?.id ?? "editar-familia"}
        open={modalOpen}
        usuario={usuarioEditando}
        onClose={() => setModalOpen(false)}
        onSuccess={handleGuardado}
      />
    </div>
  );
}
