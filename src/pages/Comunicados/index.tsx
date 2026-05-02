import { useState } from "react";
import {
  MdAdd,
  MdSearch,
  MdSend,
  MdContentCopy,
  MdDelete,
  MdAttachFile,
  MdNotifications,
  MdWarning,
  MdStar,
  MdGroups,
  MdLunchDining,
  MdCampaign,
  MdAccessTime,
  MdEditNote
} from "react-icons/md";
import styles from "./Comunicados.module.css";
import type { Tipo, Filtro } from "./types";
import { COMUNICADOS, CONFIRMACIONES } from "./comunicados.mock";

const TIPO_STYLE: Record<
  Tipo,
  {
    itemBg: string;
    itemBorder: string;
    iconColor: string;
    tagBg: string;
    tagColor: string;
    bannerBg: string;
    badgeBg: string;
    badgeColor: string;
  }
> = {
  General: {
    itemBg: "var(--turquesa-light)",
    itemBorder: "var(--turquesa)",
    iconColor: "var(--turquesa)",
    tagBg: "var(--turquesa-light)",
    tagColor: "var(--turquesa-s)",
    bannerBg: "var(--turquesa-light)",
    badgeBg: "var(--turquesa)",
    badgeColor: "#fff"
  },
  Urgente: {
    itemBg: "var(--rojo-light)",
    itemBorder: "#F5C8C8",
    iconColor: "var(--rojo)",
    tagBg: "var(--rojo-light)",
    tagColor: "var(--rojo)",
    bannerBg: "var(--rojo-light)",
    badgeBg: "var(--rojo)",
    badgeColor: "#fff"
  },
  Festival: {
    itemBg: "var(--rosa-light)",
    itemBorder: "var(--rosa)",
    iconColor: "var(--rosa)",
    tagBg: "var(--rosa-light)",
    tagColor: "var(--rosa-s)",
    bannerBg: "var(--rosa-light)",
    badgeBg: "var(--rosa)",
    badgeColor: "#fff"
  },
  Junta: {
    itemBg: "var(--amarillo-light)",
    itemBorder: "var(--amarillo)",
    iconColor: "#B89600",
    tagBg: "var(--amarillo-light)",
    tagColor: "#7A6200",
    bannerBg: "var(--amarillo-light)",
    badgeBg: "var(--amarillo)",
    badgeColor: "#5A4800"
  },
  Comida: {
    itemBg: "var(--verde-light)",
    itemBorder: "var(--verde)",
    iconColor: "var(--verde)",
    tagBg: "var(--verde-light)",
    tagColor: "var(--verde-s)",
    bannerBg: "var(--verde-light)",
    badgeBg: "var(--verde)",
    badgeColor: "#fff"
  },
  Recordatorio: {
    itemBg: "var(--gris-bg)",
    itemBorder: "var(--gris-borde)",
    iconColor: "var(--texto-3)",
    tagBg: "var(--gris-bg)",
    tagColor: "var(--texto-2)",
    bannerBg: "var(--gris-bg)",
    badgeBg: "#888",
    badgeColor: "#fff"
  }
};

const TIPO_PILL: Record<Tipo, { bg: string; color: string }> = {
  General: { bg: "var(--turquesa)", color: "#fff" },
  Urgente: { bg: "var(--rojo)", color: "#fff" },
  Festival: { bg: "var(--rosa)", color: "#fff" },
  Junta: { bg: "var(--amarillo)", color: "#5A4800" },
  Comida: { bg: "var(--verde)", color: "#fff" },
  Recordatorio: { bg: "#888", color: "#fff" }
};

const TIPOS: Tipo[] = [
  "General",
  "Urgente",
  "Festival",
  "Junta",
  "Comida",
  "Recordatorio"
];
const DESTINOS = [
  "Toda la escuela",
  "Abejas",
  "Halcones",
  "Hormigas",
  "Lobos",
  "Familia específica"
];

function TipoIcon({ tipo, color }: { tipo: Tipo; color: string }) {
  const p = { size: 18, color };
  switch (tipo) {
    case "Urgente":
      return <MdWarning {...p} />;
    case "Festival":
      return <MdStar {...p} />;
    case "Junta":
      return <MdGroups {...p} />;
    case "Comida":
      return <MdLunchDining {...p} />;
    case "Recordatorio":
      return <MdAccessTime {...p} />;
    default:
      return <MdCampaign {...p} />;
  }
}

export default function Comunicados() {
  const [selectedId, setSelectedId] = useState(1);
  const [modoNuevo, setModoNuevo] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [nuevoTipo, setNuevoTipo] = useState<Tipo>("General");
  const [destinos, setDestinos] = useState<string[]>([]);
  const [confTab, setConfTab] = useState<"leyo" | "pendiente">("leyo");

  const comunicadosFiltrados = COMUNICADOS.filter((c) => {
    const matchBusqueda =
      !busqueda || c.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const matchFiltro = filtro === "todos" || c.status === filtro;
    return matchBusqueda && matchFiltro;
  });

  const aviso = COMUNICADOS.find((c) => c.id === selectedId) ?? COMUNICADOS[0];
  const ts = TIPO_STYLE[aviso.tipo];
  const pct =
    aviso.confirmados && aviso.totalFamilias
      ? Math.round((aviso.confirmados / aviso.totalFamilias) * 100)
      : 0;
  const pendientes = (aviso.totalFamilias ?? 0) - (aviso.confirmados ?? 0);
  const confFiltradas = CONFIRMACIONES.filter((c) =>
    confTab === "leyo" ? c.leyo : !c.leyo
  );

  const toggleDestino = (d: string) =>
    setDestinos((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );

  return (
    <div className={styles.root}>
      {/* ── LISTA ── */}
      <div className={styles.panelLista}>
        <div className={styles.listaHeader}>
          <div className={styles.lhTop}>
            <span className={styles.lhTitulo}>Comunicados</span>
            <button
              className={styles.btnNuevo}
              onClick={() => {
                setModoNuevo(true);
                setDestinos([]);
                setNuevoTipo("General");
              }}
            >
              <MdAdd size={11} /> Nuevo aviso
            </button>
          </div>
          <div className={styles.searchWrap}>
            <MdSearch size={13} color="var(--texto-3)" />
            <input
              className={styles.searchInput}
              placeholder="Buscar comunicado…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className={styles.filtTabs}>
            <button
              className={`${styles.ft} ${filtro === "todos" ? styles.ftOn : styles.ftOff}`}
              onClick={() => setFiltro("todos")}
            >
              Todos
            </button>
            <button
              className={`${styles.ft} ${styles.ftBor}`}
              onClick={() => setFiltro("borrador")}
            >
              Borrador · 0
            </button>
            <button
              className={`${styles.ft} ${filtro === "publicado" ? styles.ftOn : styles.ftOff}`}
              onClick={() => setFiltro("publicado")}
            >
              Publicados
            </button>
          </div>
        </div>

        <div className={styles.lista}>
          {modoNuevo && (
            <div className={`${styles.avItem} ${styles.avItemSel}`}>
              <div
                className={styles.avIcono}
                style={{
                  background: "var(--amarillo-light)",
                  border: "1.5px solid var(--amarillo)"
                }}
              >
                <MdEditNote size={18} color="#B89600" />
              </div>
              <div className={styles.avDatos}>
                <div className={styles.avTituloTxt}>Nuevo aviso · borrador</div>
                <div className={styles.avPreview}>
                  Escribe el contenido del aviso…
                </div>
                <div className={styles.avMeta}>
                  <span
                    className={styles.avTag}
                    style={{
                      background: "var(--amarillo-light)",
                      color: "#B89600"
                    }}
                  >
                    Borrador
                  </span>
                  <span className={styles.avFecha}>Ahora</span>
                </div>
              </div>
            </div>
          )}

          {comunicadosFiltrados.map((c) => {
            const st = TIPO_STYLE[c.tipo];
            const sel = !modoNuevo && c.id === selectedId;
            const confPct =
              c.confirmados && c.totalFamilias
                ? `${Math.round((c.confirmados / c.totalFamilias) * 100)}%`
                : null;
            return (
              <div
                key={c.id}
                className={`${styles.avItem} ${sel ? styles.avItemSel : ""}`}
                onClick={() => {
                  setSelectedId(c.id);
                  setModoNuevo(false);
                }}
              >
                <div
                  className={styles.avIcono}
                  style={{
                    background: st.itemBg,
                    border: `1.5px solid ${st.itemBorder}`
                  }}
                >
                  <TipoIcon tipo={c.tipo} color={st.iconColor} />
                </div>
                <div className={styles.avDatos}>
                  <div className={styles.avTituloTxt}>{c.titulo}</div>
                  <div className={styles.avPreview}>{c.preview}</div>
                  <div className={styles.avMeta}>
                    <span
                      className={styles.avTag}
                      style={{ background: st.tagBg, color: st.tagColor }}
                    >
                      {c.tipo}
                    </span>
                    <span
                      className={styles.avTag}
                      style={{
                        background: "var(--gris-bg)",
                        color: "var(--texto-2)"
                      }}
                    >
                      {c.destinos.includes("Toda la escuela")
                        ? "Escuela"
                        : c.destinos[0]}
                    </span>
                    <span className={styles.avFecha}>{c.fecha}</span>
                  </div>
                </div>
                {c.status === "publicado" && confPct && (
                  <div className={styles.avRight}>
                    <span
                      className={styles.avConf}
                      style={{ color: "var(--verde)" }}
                    >
                      {confPct}
                    </span>
                    <span
                      className={styles.avSt}
                      style={{
                        background: "var(--verde-light)",
                        color: "var(--verde-s)"
                      }}
                    >
                      ✓ Pub.
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── DETALLE ── */}
      <div className={styles.panelDet}>
        <div className={styles.detTopbar}>
          <div>
            <div className={styles.detTitulo}>
              {modoNuevo ? "Nuevo comunicado" : aviso.titulo}
            </div>
            <div className={styles.detSub}>
              {modoNuevo
                ? "Borrador · sin publicar"
                : `${aviso.tipo} · ${aviso.fecha}`}
            </div>
          </div>
          <div className={styles.detActions}>
            <button className={styles.btnS}>
              <MdContentCopy size={12} /> Duplicar
            </button>
            <button className={`${styles.btnS} ${styles.btnSDanger}`}>
              <MdDelete size={12} /> Eliminar
            </button>
            <button className={styles.btnP}>
              <MdSend size={12} color="#5A4800" /> Publicar ahora
            </button>
          </div>
        </div>

        <div className={styles.detContent}>
          {/* COLUMNA AVISO */}
          <div className={styles.colAviso}>
            {/* Preview del aviso seleccionado */}
            <div className={styles.avisoPrev}>
              <div
                className={styles.apBanner}
                style={{ background: ts.bannerBg }}
              >
                <div className={styles.apTipoRow}>
                  <span
                    className={styles.apTipoBadge}
                    style={{ background: ts.badgeBg, color: ts.badgeColor }}
                  >
                    {aviso.tipo}
                  </span>
                  {aviso.tipo === "Urgente" && (
                    <span className={styles.apUrgente}>
                      Requiere confirmación
                    </span>
                  )}
                </div>
                <div className={styles.apTituloBig}>{aviso.titulo}</div>
                <div className={styles.apDestino}>
                  {aviso.destinos.map((d) => (
                    <span
                      key={d}
                      className={styles.apDestChip}
                      style={
                        d === "Toda la escuela"
                          ? {
                              background: ts.bannerBg,
                              borderColor: ts.itemBorder,
                              color: ts.iconColor
                            }
                          : {}
                      }
                    >
                      {d === "Toda la escuela" && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            d="M3 9l9-7
  9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                          />
                        </svg>
                      )}
                      {d}
                    </span>
                  ))}
                  {aviso.totalFamilias && (
                    <span className={styles.apDestChip}>
                      {aviso.totalFamilias} familias
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.apBody}>
                <div className={styles.apTexto}>
                  {aviso.body.split("\n").map((line, i) =>
                    line === "" ? (
                      <br key={i} />
                    ) : (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    )
                  )}
                </div>
                {aviso.adjunto && (
                  <div className={styles.apAdjunto}>
                    <div className={styles.apAdjIcon}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--turquesa)"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div>
                      <div className={styles.apAdjNombre}>
                        {aviso.adjunto.nombre}
                      </div>
                      <div className={styles.apAdjSize}>
                        {aviso.adjunto.size}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.apFooter}>
                <div className={styles.apPubInfo}>
                  Publicado {aviso.fecha} por Ana Martínez
                </div>
                {aviso.confirmados !== undefined && (
                  <div className={styles.apConfRow}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 900,
                        color: "var(--verde)"
                      }}
                    >
                      {aviso.confirmados} leyeron
                    </span>
                    <span style={{ color: "var(--texto-3)" }}>·</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 900,
                        color: "var(--rojo)"
                      }}
                    >
                      {pendientes} sin leer
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Editor (solo en modo nuevo) */}
            {modoNuevo && (
              <div className={styles.editorCard}>
                <div className={styles.ecHeader}>
                  <span className={styles.ecTitulo}>
                    ✏️ Redactar nuevo comunicado
                  </span>
                  <span className={styles.ecEstado}>
                    Borrador · sin publicar
                  </span>
                </div>
                <div className={styles.ecBody}>
                  <div className={styles.field}>
                    <label className={styles.fieldLbl}>Tipo de aviso</label>
                    <div className={styles.tipoPills}>
                      {TIPOS.map((t) => {
                        const ps = TIPO_PILL[t];
                        const on = nuevoTipo === t;
                        return (
                          <button
                            key={t}
                            className={`${styles.tipoPill} ${on ? styles.tpOn : styles.tpOff}`}
                            style={
                              on ? { background: ps.bg, color: ps.color } : {}
                            }
                            onClick={() => setNuevoTipo(t)}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.fieldLbl}>Título del aviso</label>
                    <input
                      className={styles.fieldInput}
                      type="text"
                      placeholder="Ej: Junta de padres — Abejas · 28 oct"
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.fieldLbl}>Mensaje</label>
                    <textarea
                      className={`${styles.fieldInput} ${styles.fieldTextarea}`}
                      placeholder="Escribe el mensaje para las familias…"
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.fieldLbl}>Destino</label>
                    <div className={styles.destinoGrid}>
                      {DESTINOS.map((d) => {
                        const on = destinos.includes(d);
                        return (
                          <div
                            key={d}
                            className={`${styles.destCheck} ${on ? styles.destCheckOn : ""}`}
                            onClick={() => toggleDestino(d)}
                          >
                            <div
                              className={`${styles.destBox} ${on ? styles.destBoxOn : ""}`}
                            >
                              {on && (
                                <svg
                                  width="9"
                                  height="9"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#5A4800"
                                  strokeWidth="3"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                            <span className={styles.destLbl}>{d}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.fieldLbl}>
                      Adjunto (opcional)
                    </label>
                    <div className={styles.adjUpload}>
                      <MdAttachFile size={16} color="var(--texto-3)" />
                      <span className={styles.adjTxt}>
                        Adjuntar PDF, imagen o documento…
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.ecFooter}>
                  <button className={styles.btnBorrador}>
                    Guardar borrador
                  </button>
                  <button className={styles.btnPublicar}>
                    <MdSend size={14} color="#5A4800" />
                    Publicar y notificar —{" "}
                    {destinos.length > 0 ? "seleccionados" : "29 familias"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA CONFIRMACIONES */}
          <div className={styles.colConf}>
            <div className={styles.confProg}>
              <div className={styles.cpTitulo}>
                Confirmaciones —{" "}
                {aviso.titulo.length > 28
                  ? aviso.titulo.slice(0, 28) + "…"
                  : aviso.titulo}
              </div>
              <div className={styles.cpNums}>
                <span
                  className={styles.cpTotal}
                  style={{ color: "var(--verde)" }}
                >
                  {aviso.confirmados ?? 0}
                </span>
                <span className={styles.cpDe}>
                  de {aviso.totalFamilias ?? 0} familias
                </span>
              </div>
              <div className={styles.cpBarraWrap}>
                <div className={styles.cpBarra} style={{ width: `${pct}%` }} />
              </div>
              <div className={styles.cpStats}>
                <div className={styles.cpStat}>
                  <span
                    className={styles.cpNum}
                    style={{ color: "var(--verde)" }}
                  >
                    {aviso.confirmados ?? 0}
                  </span>
                  <span className={styles.cpLbl}>Confirmaron</span>
                </div>
                <div className={styles.cpStat}>
                  <span
                    className={styles.cpNum}
                    style={{ color: "var(--rojo)" }}
                  >
                    {pendientes}
                  </span>
                  <span className={styles.cpLbl}>Sin leer</span>
                </div>
                <div className={styles.cpStat}>
                  <span
                    className={styles.cpNum}
                    style={{ color: "var(--texto-3)" }}
                  >
                    {pct}%
                  </span>
                  <span className={styles.cpLbl}>Tasa</span>
                </div>
              </div>
              <button className={styles.btnRecordar}>
                <MdNotifications size={12} />
                Recordar a los {pendientes} pendientes
              </button>
            </div>

            <div className={styles.confLista}>
              <div className={styles.clTabs}>
                <button
                  className={`${styles.clTab} ${confTab === "leyo" ? styles.clTabOn : styles.clTabOff}`}
                  onClick={() => setConfTab("leyo")}
                >
                  ✓ Leyeron · {CONFIRMACIONES.filter((c) => c.leyo).length}
                </button>
                <button
                  className={`${styles.clTab} ${confTab === "pendiente" ? styles.clTabPend : styles.clTabOff}`}
                  onClick={() => setConfTab("pendiente")}
                >
                  Sin leer · {CONFIRMACIONES.filter((c) => !c.leyo).length}
                </button>
              </div>
              <div className={styles.clScroll}>
                {confFiltradas.map((c, i) => (
                  <div key={i} className={styles.confRow}>
                    <div
                      className={styles.confAv}
                      style={{
                        background: c.bg,
                        color: c.color,
                        border: `1px solid ${c.border}`
                      }}
                    >
                      {c.inicial}
                    </div>
                    <div className={styles.confDatos}>
                      <div className={styles.confNombre}>{c.nombre}</div>
                      <div className={styles.confHijo}>{c.hijos}</div>
                      <div className={styles.confHora}>{c.hora}</div>
                    </div>
                    <div
                      className={styles.confSt}
                      style={{
                        background: c.leyo
                          ? "var(--verde-light)"
                          : "var(--rojo-light)"
                      }}
                    >
                      {c.leyo ? (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--verde-s)"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--rojo)"
                          strokeWidth="3"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
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
