 import { useState } from "react";                                                                                                           
  import { MdSearch, MdEdit } from "react-icons/md";                                                                                          
  import styles from "./Usuarios.module.css";                                                                                                 
  import type { FiltroRol, PermisoEstado, RolUsuario } from "./types";                                                                        
  import { GRUPOS_USUARIOS, PERMISOS, PERMISOS_DEFAULT, ACTIVIDAD } from "./usuarios.mock";                                                   
                                                                                                                                              
  const ROL_STYLE: Record<RolUsuario, { bg: string; color: string }> = {                                                                      
    Directivo:      { bg: "var(--turquesa-light)", color: "var(--turquesa-s)" },
    Administrativa: { bg: "var(--amarillo-light)", color: "#7A6200"            },
    Maestra:        { bg: "var(--rosa-light)",     color: "var(--rosa-s)"     },
    Maestro:        { bg: "var(--rosa-light)",     color: "var(--rosa-s)"     },
    Padre:          { bg: "var(--verde-light)",    color: "var(--verde-s)"    },
    SinAcceder:     { bg: "#F0F0F0",               color: "#777"              },
    Inactivo:       { bg: "var(--rojo-light)",     color: "var(--rojo)"       },
  };

  const FILTRO_LABELS: Record<FiltroRol, string> = {
    todos: "Todos", admin: "Admin", maestros: "Maestros", padres: "Padres",
  };

  const FILTRO_ROLES: Record<FiltroRol, RolUsuario[] | null> = {
    todos:    null,
    admin:    ["Directivo", "Administrativa"],
    maestros: ["Maestra", "Maestro"],
    padres:   ["Padre", "SinAcceder", "Inactivo"],
  };

  const TOG_BG:   Record<PermisoEstado, string> = { on: styles.togOn,  mid: styles.togMid,  off: styles.togOff  };
  const TOG_POS:  Record<PermisoEstado, string> = { on: styles.onPos,  mid: styles.midPos,  off: styles.offPos  };
  const TOG_NEXT: Record<PermisoEstado, PermisoEstado> = { on: "mid", mid: "off", off: "on" };

  const TODOS = GRUPOS_USUARIOS.flatMap(g => g.usuarios);

  export default function Usuarios() {
    const [selectedId, setSelectedId] = useState(2);
    const [filtroRol, setFiltroRol]   = useState<FiltroRol>("todos");
    const [busqueda,  setBusqueda]    = useState("");
    const [permisos,  setPermisos]    = useState<Record<string, PermisoEstado>>(PERMISOS_DEFAULT);

    const rolesPermitidos = FILTRO_ROLES[filtroRol];

    const gruposFiltrados = GRUPOS_USUARIOS.map(g => ({
      ...g,
      usuarios: g.usuarios.filter(u => {
        const matchRol = !rolesPermitidos || rolesPermitidos.includes(u.rol);
        const matchBus = !busqueda || u.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return matchRol && matchBus;
      }),
    })).filter(g => g.usuarios.length > 0);

    const usuario = TODOS.find(u => u.id === selectedId)!;
    const rolSt   = ROL_STYLE[usuario.rol];

    const togglePermiso = (id: string) =>
      setPermisos(p => ({ ...p, [id]: TOG_NEXT[p[id]] }));

    return (
      <div className={styles.root}>

        {/* ── PANEL IZQUIERDO ── */}
        <div className={styles.panelLista}>
          <div className={styles.listaHeader}>
            <div className={styles.listaTop}>
              <span className={styles.listaTitulo}>Usuarios</span>
              <span className={styles.listaCount}>{TODOS.length} usuarios</span>
            </div>
            <div className={styles.searchWrap}>
              <MdSearch size={14} color="var(--texto-3)" />
              <input
                className={styles.searchInput}
                placeholder="Buscar usuario…"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
            </div>
            <div className={styles.rolTabs}>
              {(["todos", "admin", "maestros", "padres"] as FiltroRol[]).map(f => (
                <button
                  key={f}
                  className={`${styles.rt} ${filtroRol === f ? styles.rtOn : styles.rtOff}`}
                  onClick={() => setFiltroRol(f)}
                >
                  {FILTRO_LABELS[f]}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.lista}>
            {gruposFiltrados.map(g => (
              <div key={g.label}>
                <div className={styles.grupoLabel}>{g.label} · {g.usuarios.length}</div>
                {g.usuarios.map(u => {
                  const rs = ROL_STYLE[u.rol];
                  return (
                    <div
                      key={u.id}
                      className={`${styles.userItem} ${u.id === selectedId ? styles.uiSel : ""}`}
                      onClick={() => setSelectedId(u.id)}
                    >
                      <div className={styles.avWrap}>
                        <div
                          className={styles.uiAv}
                          style={{ background: u.avBg, color: u.avColor, borderColor: u.avBorder }}
                        >
                          {u.inicial}
                        </div>
                        {u.online && <div className={styles.onlineDot} />}
                      </div>
                      <div className={styles.uiDatos}>
                        <div className={styles.uiNombre}>{u.nombre}</div>
                        <div className={styles.uiMeta}>
                          <span className={styles.uiRol} style={{ background: rs.bg, color: rs.color }}>
                            {u.rol}
                          </span>
                          <span className={styles.uiEmail}>{u.email}</span>
                        </div>
                      </div>
                      {u.inactivo && (
                        <span className={styles.uiBadge} style={{ background: "var(--rojo-light)", color: "var(--rojo)" }}>
                          Inactivo
                        </span>
                      )}
                      {u.rol === "SinAcceder" && (
                        <span className={styles.uiBadge} style={{ background: "#F0F0F0", color: "#777" }}>
                          Pendiente
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* ── PANEL DERECHO ── */}
        <div className={styles.panelDet}>
          <div className={styles.detTopbar}>
            <div>
              <div className={styles.detTitulo}>{usuario.nombre}</div>
              <div className={styles.detSub}>{usuario.rol} · {usuario.email}</div>
            </div>
            <div className={styles.detActions}>
              <button className={styles.btnPeligro}>Suspender</button>
              <button className={styles.btnS}>Reset contraseña</button>
              <button className={styles.btnP}><MdEdit size={13} /> Editar</button>
            </div>
          </div>

          <div className={styles.detScroll}>

            {/* HERO */}
            <div className={styles.userHero}>
              <div className={styles.heroAvWrap}>
                <div
                  className={styles.heroAv}
                  style={{ background: usuario.avBg, color: usuario.avColor, borderColor: usuario.avBorder }}
                >
                  {usuario.inicial}
                </div>
                {usuario.online && <div className={styles.heroOnlineDot} />}
              </div>
              <div className={styles.heroDatos}>
                <div className={styles.heroNombre}>{usuario.nombre}</div>
                <div className={styles.heroChips}>
                  <span className={styles.hc} style={{ background: rolSt.bg, color: rolSt.color }}>
                    {usuario.rol}
                  </span>
                  <span className={styles.hc}>📅 Desde {usuario.desde}</span>
                  {usuario.online
                    ? <span className={styles.hc} style={{ background: "var(--verde-light)", color: "var(--verde-s)" }}>● En línea</span>
                    : <span className={styles.hc}>Últ. acceso: {usuario.ultimoAcceso}</span>
                  }
                </div>
                <div className={styles.heroStats}>
                  {[
                    { num: "28", lbl: "Accesos",     color: "var(--turquesa)" },
                    { num: "12", lbl: "Comunicados", color: "var(--rosa)"     },
                    { num: "5",  lbl: "Reportes",    color: "var(--verde)"    },
                  ].map(sc => (
                    <div key={sc.lbl} className={styles.hStat}>
                      <div className={styles.hStatNum} style={{ color: sc.color }}>{sc.num}</div>
                      <div className={styles.hStatLbl}>{sc.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.heroRight}>
                {usuario.inactivo && (
                  <span className={styles.inactivoBadge}>Inactivo</span>
                )}
              </div>
            </div>

            {/* DATOS + CREDENCIALES */}
            <div className={styles.g2}>
              <div className={styles.card}>
                <div className={styles.cardH}>
                  <div className={styles.cardT}>Datos personales</div>
                  <span className={styles.cardLnk}>Editar</span>
                </div>
                <div className={styles.cardB}>
                  {[
                    { lbl: "Nombre completo", val: usuario.nombre },
                    { lbl: "Correo",          val: usuario.email  },
                    { lbl: "Teléfono",        val: usuario.telefono    ?? "—" },
                    { lbl: "Rol",             val: usuario.rol         },
                    { lbl: "Desde",           val: usuario.desde       ?? "—" },
                    { lbl: "Último acceso",   val: usuario.online ? "En línea ahora" : (usuario.ultimoAcceso ?? "—") },
                  ].map(d => (
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
                  <span className={styles.cardLnk}>Historial</span>
                </div>
                <div className={styles.cardB}>
                  <div className={styles.credCard}>
                    <div className={styles.credRow}>
                      <span className={styles.credLbl}>Usuario</span>
                      <span className={styles.credVal}>{usuario.email}</span>
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
                          usuario.inactivo
                            ? { background: "var(--rojo-light)",  color: "var(--rojo)"    }
                            : usuario.rol === "SinAcceder"
                              ? { background: "#F0F0F0",           color: "#777"           }
                              : { background: "var(--verde-light)", color: "var(--verde-s)" }
                        }
                      >
                        {usuario.inactivo ? "Inactivo" : usuario.rol === "SinAcceder" ? "Sin acceder" : "Activo"}
                      </span>
                    </div>
                  </div>
                  <div className={styles.credCard}>
                    <div className={styles.credRow}>
                      <span className={styles.credLbl}>Sesiones activas</span>
                      <span className={styles.credVal}>{usuario.online ? "1" : "0"}</span>
                    </div>
                    <div className={styles.credRow}>
                      <span className={styles.credLbl}>2FA</span>
                      <span className={styles.credBadge} style={{ background: "var(--amarillo-light)", color: "#7A6200" }}>
                        No activo
                      </span>
                    </div>
                  </div>
                  <button className={styles.btnReset}>Enviar restablecimiento</button>
                </div>
              </div>
            </div>

            {/* PERMISOS */}
            <div className={styles.card}>
              <div className={styles.cardH}>
                <div>
                  <div className={styles.cardT}>Permisos de acceso</div>
                  <div className={styles.cardSub}>Clic en el toggle: Acceso completo → Solo lectura → Sin acceso</div>
                </div>
                <button className={styles.btnS}>Guardar cambios</button>
              </div>
              <div className={styles.cardB}>
                <div className={styles.permisosGrid}>
                  {PERMISOS.map(p => {
                    const est = permisos[p.id] ?? "off";
                    return (
                      <div key={p.id} className={styles.permisoRow}>
                        <div className={styles.permIcn} style={{ background: p.iconBg, color: p.iconColor }}>
                          {p.icono}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className={styles.permNombre}>{p.nombre}</div>
                          <div className={styles.permDesc}>{p.desc}</div>
                        </div>
                        <div
                          className={`${styles.toggle} ${TOG_BG[est]}`}
                          onClick={() => togglePermiso(p.id)}
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
                    <div className={styles.actDot} style={{ background: a.color }} />
                    <div>
                      <div className={styles.actTxt}>
                        {a.bold && <span className={styles.actBold}>{a.bold}</span>}
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