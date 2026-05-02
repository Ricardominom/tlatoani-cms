import { useState, useEffect } from "react";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdMessage,
  MdNotifications
} from "react-icons/md";
import { AnimalAvatar, getGrupo } from "../../components/ui/AnimalKit";
import styles from "./Familias.module.css";
import { FAMILIAS } from "./familias.mock";

type Filtro = "todas" | "vencidas" | "semana" | "corriente";

const PAGO_STYLE = {
  "Al corriente": {
    av: {
      bg: "var(--verde-light)",
      color: "var(--verde-s)",
      border: "var(--verde)"
    },
    badge: { bg: "var(--verde-light)", color: "var(--verde-s)" },
    monto: "var(--verde)"
  },
  Vencido: {
    av: { bg: "var(--rojo-light)", color: "var(--rojo)", border: "#F5C8C8" },
    badge: { bg: "var(--rojo-light)", color: "var(--rojo)" },
    monto: "var(--rojo)"
  },
  Proximo: {
    av: {
      bg: "var(--amarillo-light)",
      color: "#7A6200",
      border: "var(--amarillo)"
    },
    badge: { bg: "var(--amarillo-light)", color: "#B89600" },
    monto: "#B89600"
  }
};

const MES_STYLE = {
  pagado: {
    barra: "var(--verde)",
    monto: "var(--texto)",
    bg: "var(--verde-light)",
    color: "var(--verde-s)",
    label: "✓ Pagado"
  },
  pendiente: {
    barra: "var(--amarillo)",
    monto: "#B89600",
    bg: "var(--amarillo-light)",
    color: "#B89600",
    label: ""
  },
  proximo: {
    barra: "#E0E0E0",
    monto: "var(--texto-3)",
    bg: "var(--gris-bg)",
    color: "var(--texto-3)",
    label: "Próximo"
  }
};

const PADRE_COLORS = [
  {
    bg: "var(--amarillo-light)",
    color: "#7A6200",
    border: "var(--amarillo)",
    rolBg: "var(--amarillo-light)",
    rolColor: "#B89600"
  },
  {
    bg: "var(--rosa-light)",
    color: "var(--rosa-s)",
    border: "var(--rosa)",
    rolBg: "var(--rosa-light)",
    rolColor: "var(--rosa-s)"
  },
  {
    bg: "var(--verde-light)",
    color: "var(--verde-s)",
    border: "var(--verde)",
    rolBg: "var(--verde-light)",
    rolColor: "var(--verde-s)"
  },
  {
    bg: "var(--turquesa-light)",
    color: "var(--turquesa-s)",
    border: "var(--turquesa)",
    rolBg: "var(--turquesa-light)",
    rolColor: "var(--turquesa-s)"
  }
];

const NOTIF_CONFIG = [
  {
    key: "avisos" as const,
    lbl: "Avisos importantes",
    sub: "Comunicados del maestro"
  },
  { key: "colegiatura" as const, lbl: "Colegiatura", sub: "Alertas de pago" },
  {
    key: "comida" as const,
    lbl: "Comida compartida",
    sub: "Recordatorios de turno"
  },
  { key: "galeria" as const, lbl: "Galería", sub: "Fotos y videos nuevos" }
];

export default function Familias() {
  const [selectedId, setSelectedId] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todas");

  const familia = FAMILIAS.find((f) => f.id === selectedId)!;
  const [notif, setNotif] = useState(familia.notif);

  useEffect(() => {
    setNotif(familia.notif);
  }, [selectedId]);

  const familiasFiltradas = FAMILIAS.filter((f) => {
    const matchBusqueda =
      !busqueda ||
      f.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      f.hijos.some((h) =>
        h.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    const matchFiltro =
      filtro === "vencidas"
        ? f.pagoStatus === "Vencido"
        : filtro === "semana"
          ? f.pagoStatus === "Proximo"
          : filtro === "corriente"
            ? f.pagoStatus === "Al corriente"
            : true;
    return matchBusqueda && matchFiltro;
  });

  const ps = PAGO_STYLE[familia.pagoStatus];
  const apellido = familia.nombre.replace("Familia ", "");
  const vencidasCount = FAMILIAS.filter(
    (f) => f.pagoStatus === "Vencido"
  ).length;
  const semanaCount = FAMILIAS.filter((f) => f.pagoStatus === "Proximo").length;

  const toggleNotif = (key: keyof typeof notif) =>
    setNotif((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className={styles.root}>
      {/* ── LISTA ── */}
      <div className={styles.panelLista}>
        <div className={styles.listaHeader}>
          <div className={styles.listaTop}>
            <span className={styles.listaTitulo}>Familias</span>
            <span className={styles.listaCount}>
              {FAMILIAS.length} familias
            </span>
          </div>
          <div className={styles.searchWrap}>
            <MdSearch size={14} color="var(--texto-3)" />
            <input
              className={styles.searchInput}
              placeholder="Buscar familia o alumno…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className={styles.filtros}>
            <button
              className={`${styles.fil} ${filtro === "todas" ? styles.filOn : styles.filOff}`}
              onClick={() => setFiltro("todas")}
            >
              Todas
            </button>
            <button
              className={`${styles.fil} ${filtro === "vencidas" ? styles.filOn : styles.filRed}`}
              onClick={() => setFiltro("vencidas")}
            >
              Vencidas · {vencidasCount}
            </button>
            <button
              className={`${styles.fil} ${filtro === "semana" ? styles.filOn : styles.filYel}`}
              onClick={() => setFiltro("semana")}
            >
              Esta semana · {semanaCount}
            </button>
            <button
              className={`${styles.fil} ${filtro === "corriente" ? styles.filOn : styles.filOff}`}
              onClick={() => setFiltro("corriente")}
            >
              Al corriente
            </button>
          </div>
        </div>

        <div className={styles.lista}>
          {familiasFiltradas.map((f) => {
            const fp = PAGO_STYLE[f.pagoStatus];
            return (
              <div
                key={f.id}
                className={`${styles.famItem} ${f.id === selectedId ? styles.famSel : ""}`}
                onClick={() => setSelectedId(f.id)}
              >
                <div
                  className={styles.famAv}
                  style={{
                    background: fp.av.bg,
                    color: fp.av.color,
                    border: `1.5px solid ${fp.av.border}`
                  }}
                >
                  {f.inicial}
                </div>
                <div className={styles.famDatos}>
                  <div className={styles.famNombre}>{f.nombre}</div>
                  <div className={styles.famHijos}>
                    {f.hijos.map((h) => {
                      const g = getGrupo(h.salon);
                      return (
                        <span
                          key={h.nombre}
                          className={styles.hijoChip}
                          style={{ background: g?.light, color: g?.dark }}
                        >
                          {h.nombre} · {h.salon}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className={styles.famRight}>
                  <span className={styles.famMonto} style={{ color: fp.monto }}>
                    ${f.monto.toLocaleString()}
                  </span>
                  <span
                    className={styles.famStatus}
                    style={{ background: fp.badge.bg, color: fp.badge.color }}
                  >
                    {f.pagoStatus === "Proximo"
                      ? `${f.diasRestantes} días`
                      : f.pagoStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── DETALLE ── */}
      <div className={styles.panelDet}>
        <div className={styles.detTopbar}>
          <div>
            <div className={styles.detTitulo}>{familia.nombre}</div>
            <div className={styles.detSub}>
              {familia.contacto} · {familia.hijos.length}{" "}
              {familia.hijos.length === 1 ? "hijo inscrito" : "hijos inscritos"}{" "}
              · desde {familia.desde}
            </div>
          </div>
          <div className={styles.detActions}>
            <button className={styles.btnS}>
              <MdMessage size={13} /> Mensaje
            </button>
            <button className={styles.btnS}>
              <MdEdit size={13} /> Editar
            </button>
            <button className={styles.btnP}>
              <MdNotifications size={13} color="#5A4800" /> Recordar pago
            </button>
          </div>
        </div>

        <div className={styles.detContent}>
          {/* HERO */}
          <div className={styles.famHero}>
            <div
              className={styles.heroAv}
              style={{
                background: ps.av.bg,
                color: ps.av.color,
                border: `2px solid ${ps.av.border}`,
                boxShadow: `0 3px 0 ${ps.av.border}`
              }}
            >
              {familia.inicial}
            </div>
            <div className={styles.heroDatos}>
              <div className={styles.heroNombre}>{familia.nombre}</div>
              <div className={styles.heroMeta}>
                <span className={styles.metaChip}>{familia.contacto}</span>
                <span className={styles.metaChip}>{familia.telefono}</span>
                <span className={styles.metaChip}>{familia.email}</span>
                <span className={styles.metaChip}>
                  {familia.hijos.length}{" "}
                  {familia.hijos.length === 1 ? "hijo" : "hijos"}
                </span>
                <span className={styles.metaChip}>Desde {familia.desde}</span>
              </div>
            </div>
            <div className={styles.heroRight}>
              <span
                className={styles.estadoBadge}
                style={{
                  background: ps.badge.bg,
                  color: ps.badge.color,
                  border: `1px solid 
  ${ps.av.border}`
                }}
              >
                {familia.pagoStatus === "Proximo"
                  ? `Pago próximo · ${familia.diasRestantes} días`
                  : familia.pagoStatus}
              </span>
              <div className={styles.heroMonto} style={{ color: ps.monto }}>
                ${familia.monto.toLocaleString()}
              </div>
              <div className={styles.heroMontoLbl}>pendiente</div>
            </div>
          </div>

          {/* RESUMEN */}
          <div className={styles.resumenChips}>
            <div className={styles.rchip}>
              <span
                className={styles.rchipNum}
                style={{ color: "var(--verde)" }}
              >
                {familia.mesesPagados}
              </span>
              <span className={styles.rchipLbl}>Meses pagados</span>
            </div>
            <div className={styles.rchip}>
              <span className={styles.rchipNum} style={{ color: "#B89600" }}>
                {familia.mesesPendientes}
              </span>
              <span className={styles.rchipLbl}>Meses pendientes</span>
            </div>
            <div className={styles.rchip}>
              <span className={styles.rchipNum}>{familia.totalPagado}</span>
              <span className={styles.rchipLbl}>Total pagado</span>
            </div>
            <div className={styles.rchip}>
              <span
                className={styles.rchipNum}
                style={{ color: "var(--turquesa)" }}
              >
                {familia.avisosConfirmados}
              </span>
              <span className={styles.rchipLbl}>Avisos confirmados</span>
            </div>
            <div className={styles.rchip}>
              <span
                className={styles.rchipNum}
                style={{ color: "var(--rosa)" }}
              >
                {familia.bitacorasRecibidas}
              </span>
              <span className={styles.rchipLbl}>Bitácoras recibidas</span>
            </div>
          </div>

          {/* HIJOS + PADRES */}
          <div className={styles.g2}>
            <div className={styles.dc}>
              <div className={styles.dch}>
                <span className={styles.dct}>Hijos inscritos</span>
                <span className={styles.dcl}>+ Agregar hijo</span>
              </div>
              <div className={styles.dcb}>
                {familia.hijos.map((h) => {
                  const g = getGrupo(h.salon);
                  return (
                    <div key={h.nombre} className={styles.hijoCard}>
                      <AnimalAvatar group={h.salon} size="sm" />
                      <div className={styles.hijoDatos}>
                        <div className={styles.hijoNombre}>
                          {h.nombre} {apellido}
                        </div>
                        <div className={styles.hijoNivel}>{h.salon}</div>
                      </div>
                      <span
                        className={styles.hijoTag}
                        style={{ background: g?.light, color: g?.dark }}
                      >
                        {h.salon}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.dc}>
              <div className={styles.dch}>
                <span className={styles.dct}>Padres / tutores</span>
                <span className={styles.dcl}>+ Agregar</span>
              </div>
              <div className={styles.dcb}>
                {familia.padres.map((p, i) => {
                  const c = PADRE_COLORS[i % PADRE_COLORS.length];
                  return (
                    <div key={p.nombre} className={styles.padreRow}>
                      <div
                        className={styles.padreAv}
                        style={{
                          background: c.bg,
                          color: c.color,
                          border: `1.5px solid ${c.border}`
                        }}
                      >
                        {p.inicial}
                      </div>
                      <div className={styles.padreDatos}>
                        <div className={styles.padreNombre}>{p.nombre}</div>
                        <div className={styles.padreInfo}>
                          {p.telefono} · {p.email}
                        </div>
                      </div>
                      <span
                        className={styles.padreRol}
                        style={{ background: c.rolBg, color: c.rolColor }}
                      >
                        {p.rol}
                      </span>
                    </div>
                  );
                })}
                <button className={styles.btnAgregar}>
                  <MdAdd size={13} /> Agregar persona autorizada
                </button>
              </div>
            </div>
          </div>

          {/* COLEGIATURA + ACTIVIDAD */}
          <div className={styles.g2}>
            <div className={styles.dc}>
              <div className={styles.dch}>
                <span className={styles.dct}>Historial de colegiatura</span>
                <span className={styles.dcl}>Registrar pago</span>
              </div>
              <div className={styles.dcb}>
                {familia.colegiatura.map((m) => {
                  const ms = MES_STYLE[m.status];
                  const label =
                    m.status === "pendiente"
                      ? `${m.diasRestantes} días`
                      : ms.label;
                  return (
                    <div key={m.mes} className={styles.mesRow}>
                      <span className={styles.mesLbl}>{m.mes}</span>
                      <div className={styles.mesBarraW}>
                        <div
                          className={styles.mesBarra}
                          style={{
                            width: `${m.pct * 100}%`,
                            background: ms.barra
                          }}
                        />
                      </div>
                      <span
                        className={styles.mesMonto}
                        style={{ color: ms.monto }}
                      >
                        ${m.monto.toLocaleString()}
                      </span>
                      <span
                        className={styles.mesStatus}
                        style={{ background: ms.bg, color: ms.color }}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.dc}>
              <div className={styles.dch}>
                <span className={styles.dct}>Actividad reciente</span>
                <span className={styles.dcl}>Ver todo</span>
              </div>
              <div className={styles.dcb}>
                {familia.actividad.map((a, i) => (
                  <div key={i} className={styles.actItem}>
                    <div
                      className={styles.actDot}
                      style={{ background: a.color }}
                    />
                    <div>
                      <div className={styles.actTexto}>
                        <span className={styles.actBold}>{a.bold}</span>
                        {a.texto}
                      </div>
                      <div className={styles.actFecha}>{a.fecha}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* NOTIFICACIONES */}
          <div className={styles.dc}>
            <div className={styles.dch}>
              <span className={styles.dct}>
                Configuración de notificaciones
              </span>
              <span className={styles.dcl}>Vista de la app →</span>
            </div>
            <div className={styles.dcb}>
              <div className={styles.notifGrid}>
                {NOTIF_CONFIG.map((n) => (
                  <div key={n.key} className={styles.notifRow}>
                    <div>
                      <div className={styles.notifLbl}>{n.lbl}</div>
                      <div className={styles.notifSub}>{n.sub}</div>
                    </div>
                    <div
                      className={`${styles.toggle} ${notif[n.key] ? styles.toggleOn : styles.toggleOff}`}
                      onClick={() => toggleNotif(n.key)}
                    >
                      <div
                        className={`${styles.toggleThumb} ${notif[n.key] ? styles.thumbOn : styles.thumbOff}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
