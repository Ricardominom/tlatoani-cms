import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MdSearch, MdEdit, MdAdd, MdDelete } from "react-icons/md";
import styles from "./Usuarios.module.css";
import type { Usuario, UsuariosPaginados, RolUsuario } from "../../types";
import { ROLES_USUARIO } from "../../types";
import { getUsuarios, eliminarUsuario } from "../../services/usuariosService";
import ModalUsuario from "./ModalUsuario";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { PERMISOS, PERMISOS_DEFAULT, ACTIVIDAD } from "./usuarios.mock";

type PermisoEstado = "on" | "mid" | "off";

const ROLE_LABEL: Record<RolUsuario, string> = {
  superadmin: "Super admin",
  admin: "Administrador",
  teacher: "Maestro",
  family: "Familia"
};

const ROLE_STYLE: Record<
  RolUsuario,
  { bg: string; color: string; border: string }
> = {
  superadmin: {
    bg: "#1E1E1E",
    color: "var(--amarillo)",
    border: "rgba(245,200,0,0.3)"
  },
  admin: {
    bg: "var(--amarillo-light)",
    color: "#7A6200",
    border: "var(--amarillo)"
  },
  teacher: {
    bg: "var(--turquesa-light)",
    color: "var(--turquesa-s)",
    border: "var(--turquesa)"
  },
  family: {
    bg: "var(--verde-light)",
    color: "var(--verde-s)",
    border: "var(--verde)"
  }
};

const TOG_NEXT: Record<PermisoEstado, PermisoEstado> = {
  on: "mid",
  mid: "off",
  off: "on"
};
const TOG_BG: Record<PermisoEstado, string> = {
  on: styles.togOn,
  mid: styles.togMid,
  off: styles.togOff
};
const TOG_POS: Record<PermisoEstado, string> = {
  on: styles.onPos,
  mid: styles.midPos,
  off: styles.offPos
};

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

function formatDesde(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export default function Usuarios() {
  const queryClient = useQueryClient();

  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [filtroRol, setFiltroRol] = useState<RolUsuario | "todos">("todos");
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [confirmEliminarOpen, setConfirmEliminarOpen] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);
  const [permisos, setPermisos] =
    useState<Record<string, PermisoEstado>>(PERMISOS_DEFAULT);

  const {
    data: usuariosRes,
    isLoading,
    error
  } = useQuery({
    queryKey: ["usuarios"],
    queryFn: () =>
      getUsuarios({
        order_by: "last_name",
        order_direction: "asc",
        per_page: 100
      })
  });

  const usuarios = usuariosRes?.data ?? [];
  const activeUuid = selectedUuid ?? usuarios[0]?.id ?? null;
  const errorMsg = error instanceof Error ? error.message : null;

  const eliminarMutation = useMutation({
    mutationFn: (uuid: string) => eliminarUsuario(uuid),
    onMutate: async (uuid) => {
      await queryClient.cancelQueries({ queryKey: ["usuarios"] });
      const prevData = queryClient.getQueryData(["usuarios"]);
      queryClient.setQueryData<UsuariosPaginados>(["usuarios"], (old) =>
        old ? { ...old, data: old.data.filter((u) => u.id !== uuid) } : old
      );
      setSelectedUuid(null);
      setConfirmEliminarOpen(false);
      return { prevData, uuid };
    },
    onError: (err, uuid, context) => {
      queryClient.setQueryData(["usuarios"], context?.prevData);
      setSelectedUuid(uuid);
      setErrorEliminar(
        err instanceof Error ? err.message : "No se pudo eliminar el usuario."
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    }
  });

  const togglePermiso = (key: string) =>
    setPermisos((p) => ({ ...p, [key]: TOG_NEXT[p[key]] }));

  function handleUsuarioGuardado(usuarioGuardado: Usuario) {
    setModalOpen(false);
    setSelectedUuid(usuarioGuardado.id);
  }

  const usuariosFiltrados = usuarios.filter((u) => {
    const nombre = `${u.name} ${u.last_name}`.toLowerCase();
    const matchBusqueda =
      !busqueda ||
      nombre.includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase());
    const matchRol = filtroRol === "todos" || u.role === filtroRol;
    return matchBusqueda && matchRol;
  });

  const usuarioSel = usuarios.find((u) => u.id === activeUuid) ?? null;
  const rolSt = usuarioSel ? ROLE_STYLE[usuarioSel.role] : null;

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
        Cargando usuarios…
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
      {/* ── PANEL IZQUIERDO ── */}
      <div className={styles.panelLista}>
        <div className={styles.listaHeader}>
          <div className={styles.listaTop}>
            <span className={styles.listaTitulo}>Usuarios</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className={styles.listaCount}>
                {usuarios.length} usuarios
              </span>
              <button
                className={styles.btnP}
                onClick={() => {
                  setUsuarioEditando(null);
                  setModalOpen(true);
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
              placeholder="Buscar usuario…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className={styles.rolTabs}>
            <button
              className={`${styles.rt} ${filtroRol === "todos" ? styles.rtOn : styles.rtOff}`}
              onClick={() => setFiltroRol("todos")}
            >
              Todos
            </button>
            {ROLES_USUARIO.map((r) => (
              <button
                key={r}
                className={`${styles.rt} ${filtroRol === r ? styles.rtOn : styles.rtOff}`}
                onClick={() => setFiltroRol(r)}
              >
                {ROLE_LABEL[r]}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.lista}>
          {usuariosFiltrados.length === 0 && (
            <div
              style={{
                padding: "32px 16px",
                textAlign: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "var(--texto-3)"
              }}
            >
              No se encontraron usuarios
            </div>
          )}
          {usuariosFiltrados.map((u) => {
            const rs = ROLE_STYLE[u.role];
            return (
              <div
                key={u.id}
                className={`${styles.userItem} ${u.id === activeUuid ? styles.uiSel : ""}`}
                onClick={() => setSelectedUuid(u.id)}
              >
                <div className={styles.avWrap}>
                  <div
                    className={styles.uiAv}
                    style={{
                      background: rs.bg,
                      color: rs.color,
                      borderColor: rs.border
                    }}
                  >
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className={styles.uiDatos}>
                  <div className={styles.uiNombre}>
                    {u.name} {u.last_name}
                  </div>
                  <div className={styles.uiMeta}>
                    <span
                      className={styles.uiRol}
                      style={{ background: rs.bg, color: rs.color }}
                    >
                      {ROLE_LABEL[u.role]}
                    </span>
                    <span className={styles.uiEmail}>{u.email}</span>
                  </div>
                </div>
                {!u.active && (
                  <span
                    className={styles.uiBadge}
                    style={{
                      background: "var(--rojo-light)",
                      color: "var(--rojo)"
                    }}
                  >
                    Baja
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── PANEL DERECHO ── */}
      {usuarioSel && rolSt ? (
        <div className={styles.panelDet}>
          <div className={styles.detTopbar}>
            <div>
              <div className={styles.detTitulo}>
                {usuarioSel.name} {usuarioSel.last_name}
              </div>
              <div className={styles.detSub}>
                {ROLE_LABEL[usuarioSel.role]} · {usuarioSel.email}
              </div>
            </div>
            <div className={styles.detActions}>
              <button
                className={styles.btnPeligro}
                onClick={() => setConfirmEliminarOpen(true)}
              >
                Eliminar
              </button>
              <button
                className={styles.btnP}
                onClick={() => {
                  setUsuarioEditando(usuarioSel);
                  setModalOpen(true);
                }}
              >
                <MdEdit size={13} /> Editar
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
                margin: "16px 24px 0"
              }}
            >
              {errorEliminar}
            </div>
          )}

          <div className={styles.detScroll}>
            {/* HERO */}
            <div className={styles.userHero}>
              <div className={styles.heroAvWrap}>
                <div
                  className={styles.heroAv}
                  style={{
                    background: rolSt.bg,
                    color: rolSt.color,
                    borderColor: rolSt.border
                  }}
                >
                  {usuarioSel.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className={styles.heroDatos}>
                <div className={styles.heroNombre}>
                  {usuarioSel.name} {usuarioSel.last_name}
                </div>
                <div className={styles.heroChips}>
                  <span
                    className={styles.hc}
                    style={{ background: rolSt.bg, color: rolSt.color }}
                  >
                    {ROLE_LABEL[usuarioSel.role]}
                  </span>
                  <span className={styles.hc}>
                    📅 Desde {formatDesde(usuarioSel.created_at)}
                  </span>
                  <span className={styles.hc}>
                    Últ. acceso: {formatFechaHora(usuarioSel.last_access)}
                  </span>
                </div>
                <div className={styles.heroStats}>
                  {[
                    { num: "—", lbl: "Accesos", color: "var(--turquesa)" },
                    { num: "—", lbl: "Comunicados", color: "var(--rosa)" },
                    { num: "—", lbl: "Reportes", color: "var(--verde)" }
                  ].map((sc) => (
                    <div key={sc.lbl} className={styles.hStat}>
                      <div
                        className={styles.hStatNum}
                        style={{ color: sc.color }}
                      >
                        {sc.num}
                      </div>
                      <div className={styles.hStatLbl}>{sc.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.heroRight}>
                {!usuarioSel.active && (
                  <span className={styles.inactivoBadge}>Baja</span>
                )}
              </div>
            </div>

            {/* DATOS + CREDENCIALES */}
            <div className={styles.g2}>
              <div className={styles.card}>
                <div className={styles.cardH}>
                  <div className={styles.cardT}>Datos personales</div>
                  <span
                    className={styles.cardLnk}
                    onClick={() => {
                      setUsuarioEditando(usuarioSel);
                      setModalOpen(true);
                    }}
                  >
                    Editar
                  </span>
                </div>
                <div className={styles.cardB}>
                  {[
                    {
                      lbl: "Nombre completo",
                      val: `${usuarioSel.name} ${usuarioSel.last_name}`
                    },
                    { lbl: "Correo", val: usuarioSel.email },
                    {
                      lbl: "Teléfono",
                      val: usuarioSel.phone_number ?? "No registrado"
                    },
                    { lbl: "Rol", val: ROLE_LABEL[usuarioSel.role] },
                    { lbl: "Desde", val: formatDesde(usuarioSel.created_at) },
                    {
                      lbl: "Último acceso",
                      val: formatFechaHora(usuarioSel.last_access)
                    }
                  ].map((d) => (
                    <div key={d.lbl} className={styles.datoRow}>
                      <span className={styles.datoLbl}>{d.lbl}</span>
                      <span className={styles.datoVal}>{d.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardH}>
                  <div className={styles.cardT}>Credenciales</div>
                </div>
                <div className={styles.cardB}>
                  <div className={styles.credCard}>
                    <div className={styles.credRow}>
                      <span className={styles.credLbl}>Usuario</span>
                      <span className={styles.credVal}>{usuarioSel.email}</span>
                    </div>
                    <div className={styles.credRow}>
                      <span className={styles.credLbl}>Contraseña</span>
                      <span className={styles.credVal}>••••••••</span>
                    </div>
                    <div className={styles.credRow}>
                      <span className={styles.credLbl}>Estado</span>
                      <span
                        className={styles.credBadge}
                        style={
                          usuarioSel.active
                            ? {
                                background: "var(--verde-light)",
                                color: "var(--verde-s)"
                              }
                            : {
                                background: "var(--rojo-light)",
                                color: "var(--rojo)"
                              }
                        }
                      >
                        {usuarioSel.active ? "Activo" : "Baja"}
                      </span>
                    </div>
                  </div>
                  <div className={styles.credCard}>
                    <div className={styles.credRow}>
                      <span className={styles.credLbl}>2FA</span>
                      <span
                        className={styles.credBadge}
                        style={{
                          background: "var(--amarillo-light)",
                          color: "#7A6200"
                        }}
                      >
                        No activo
                      </span>
                    </div>
                  </div>
                  <button className={styles.btnReset}>
                    Enviar restablecimiento
                  </button>
                </div>
              </div>
            </div>

            {/* PERMISOS */}
            <div className={styles.card}>
              <div className={styles.cardH}>
                <div>
                  <div className={styles.cardT}>Permisos de acceso</div>
                  <div className={styles.cardSub}>
                    Clic en el toggle: Acceso completo → Solo lectura → Sin
                    acceso
                  </div>
                </div>
                <button className={styles.btnS}>Guardar cambios</button>
              </div>
              <div className={styles.cardB}>
                <div className={styles.permisosGrid}>
                  {PERMISOS.map((p) => {
                    const est = permisos[p.key] ?? "off";
                    return (
                      <div key={p.key} className={styles.permisoRow}>
                        <div
                          className={styles.permIcn}
                          style={{ background: p.iconBg, color: p.iconColor }}
                        />
                        <div style={{ flex: 1 }}>
                          <div className={styles.permNombre}>{p.label}</div>
                          <div className={styles.permDesc}>{p.sub}</div>
                        </div>
                        <div
                          className={`${styles.toggle} ${TOG_BG[est]}`}
                          onClick={() => togglePermiso(p.key)}
                        >
                          <div className={`${styles.tThumb} ${TOG_POS[est]}`} />
                        </div>
                      </div>
                    );
                  })}
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
                {ACTIVIDAD.map((a, i) => (
                  <div key={i} className={styles.actItem}>
                    <div
                      className={styles.actDot}
                      style={{ background: a.color }}
                    />
                    <div>
                      <div className={styles.actTxt}>
                        {a.bold && (
                          <span className={styles.actBold}>{a.bold} </span>
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
          Selecciona un usuario para ver el detalle
        </div>
      )}

      {/* key fuerza remount → useForm toma el resolver correcto en cada apertura */}
      <ModalUsuario
        key={usuarioEditando?.id ?? "nuevo"}
        open={modalOpen}
        usuario={usuarioEditando}
        onClose={() => setModalOpen(false)}
        onSuccess={handleUsuarioGuardado}
      />

      <ConfirmDialog
        open={confirmEliminarOpen}
        titulo="Eliminar usuario"
        mensaje={`¿Seguro que quieres eliminar a "${usuarioSel?.name} ${usuarioSel?.last_name}"? Esta acción no se puede deshacer.`}
        onConfirm={() => usuarioSel && eliminarMutation.mutate(usuarioSel.id)}
        onCancel={() => setConfirmEliminarOpen(false)}
      />
    </div>
  );
}
