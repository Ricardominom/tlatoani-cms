/* eslint-disable react-refresh/only-export-components */
  import { useState } from "react";
  import { MdDownload, MdEdit, MdAdd, MdSearch } from "react-icons/md";
  import { AnimalAvatar, AnimalPillLight, AnimalIcon, getGrupo } from "../../components/ui/AnimalKit";
  import styles from "./Alumnos.module.css";

  interface Alumno {
    id: number; nombre: string; inicial: string;
    salon: string; nivel: string; edad: string;
    status: "Presente" | "Ausente" | "Retardo";
  }

  const ALUMNOS: Alumno[] = [
    { id: 1, nombre: "Sofía Ramírez",    inicial: "S", salon: "Abejas",   nivel: "Casa de niños", edad: "4 años", status: "Presente" },
    { id: 2, nombre: "Valeria Torres",   inicial: "V", salon: "Abejas",   nivel: "Casa de niños", edad: "4 años", status: "Retardo"  },
    { id: 3, nombre: "Mateo López",      inicial: "M", salon: "Abejas",   nivel: "Casa de niños", edad: "5 años", status: "Ausente"  },
    { id: 4, nombre: "Emilio Vega",      inicial: "E", salon: "Abejas",   nivel: "Casa de niños", edad: "4 años", status: "Presente" },
    { id: 5, nombre: "Diego Ramírez",    inicial: "D", salon: "Halcones", nivel: "Taller 1",      edad: "7 años", status: "Presente" },
    { id: 6, nombre: "Renata Hernández", inicial: "R", salon: "Lobos",    nivel: "Taller 2",      edad: "9 años", status: "Presente" },
    { id: 7, nombre: "Lucas Hernández",  inicial: "L", salon: "Abejas",   nivel: "Casa de niños", edad: "5 años", status: "Presente" },
    { id: 8, nombre: "Isabela Moreno",   inicial: "I", salon: "Abejas",   nivel: "Casa de niños", edad: "4 años", status: "Presente" },
  ];

  const SALONES_FILTER = [
    { label: "Todos",    count: 102 },
    { label: "Abejas",   count: 22  },
    { label: "Hormigas", count: 24  },
    { label: "Halcones", count: 29  },
    { label: "Lobos",    count: 27  },
  ];

  const STATUS_STYLE = {
    Presente: { bg: "var(--verde-light)",    color: "var(--verde-s)"  },
    Retardo:  { bg: "var(--amarillo-light)", color: "#B89600"         },
    Ausente:  { bg: "var(--rojo-light)",     color: "var(--rojo)"     },
  };

  const ASISTENCIA = [
    { dia: 1,  tipo: "vac"  }, { dia: 2,  tipo: "pres" }, { dia: 3,  tipo: "pres" },
    { dia: 4,  tipo: "pres" }, { dia: 7,  tipo: "pres" }, { dia: 8,  tipo: "aus"  },
    { dia: 9,  tipo: "pres" }, { dia: 10, tipo: "pres" }, { dia: 11, tipo: "pres" },
    { dia: 14, tipo: "pres" }, { dia: 15, tipo: "pres" }, { dia: 16, tipo: "tard" },
    { dia: 17, tipo: "pres" }, { dia: 18, tipo: "pres" }, { dia: 21, tipo: "pres" },
    { dia: 22, tipo: "hoy"  },
  ];

  const ASIST_CLASS: Record<string, string> = {
    vac: styles.dVac, pres: styles.dPres,
    aus: styles.dAus, tard: styles.dTard, hoy: styles.dHoy,
  };

  const AREAS = [
    { nombre: "Lenguaje",      color: "var(--turquesa)", pct: 0.85, count: 11, nivel: "Logrado",    nBg: "var(--verde-light)",    nColor:
  "var(--verde-s)"    },
    { nombre: "Matemáticas",   color: "var(--amarillo)", pct: 0.62, count: 8,  nivel: "En proceso", nBg: "var(--turquesa-light)", nColor:
  "var(--turquesa-s)" },
    { nombre: "Vida práctica", color: "var(--verde)",    pct: 0.62, count: 8,  nivel: "En proceso", nBg: "var(--turquesa-light)", nColor:
  "var(--turquesa-s)" },
    { nombre: "Sensorial",     color: "var(--rosa)",     pct: 0.38, count: 5,  nivel: "Iniciando",  nBg: "var(--amarillo-light)", nColor:
  "#B89600"           },
    { nombre: "Cultura",       color: "var(--texto-3)",  pct: 0.23, count: 3,  nivel: "Iniciando",  nBg: "var(--gris-bg)",        nColor:
  "var(--texto-3)"    },
  ];

  const AUTORIZADOS = [
    { inicial: "C", nombre: "Carlos Ramírez", rel: "Papá",           tel: "222 345 6789", badge: "Principal",  bg: "var(--amarillo-light)",
  color: "#7A6200",        border: "var(--amarillo)", badgeBg: "var(--amarillo-light)", badgeColor: "#B89600"        },
    { inicial: "L", nombre: "Laura Mendoza",  rel: "Mamá",           tel: "222 456 7890", badge: "Principal",  bg: "var(--rosa-light)",
  color: "var(--rosa-s)", border: "var(--rosa)",     badgeBg: "var(--rosa-light)",     badgeColor: "var(--rosa-s)"  },
    { inicial: "R", nombre: "Rosa Flores",    rel: "Abuela materna", tel: "222 567 8901", badge: "Autorizada", bg: "var(--verde-light)",
  color: "var(--verde-s)",border: "var(--verde)",    badgeBg: "var(--verde-light)",    badgeColor: "var(--verde-s)" },
  ];

  const BITACORAS = [
    { area: "Lenguaje",      areaBg: "var(--turquesa-light)", areaColor: "var(--turquesa-s)", fecha: "Hoy · 10:30am", texto: "Completó sola el trabajo de letras móviles. Formó su nombre completo sin ayuda.",   nivel: "🌟 Logrado",    nivelBg: "var(--verde-light)",    nivelColor: "var(--verde-s)"    },
    { area: "Vida práctica", areaBg: "var(--verde-light)",    areaColor: "var(--verde-s)",    fecha: "Ayer · 2:15pm", texto: "Ayudó a compañeros a servir agua con mucha concentración y cuidado.",               nivel: "🌿 En proceso", nivelBg: "var(--turquesa-light)",
  nivelColor: "var(--turquesa-s)" },
    { area: "Matemáticas",   areaBg: "var(--amarillo-light)", areaColor: "#B89600",           fecha: "Lun 14 oct",    texto: "Exploró las perlas doradas e identificó el cubo de 1000 correctamente.",             nivel: "🌿 En proceso", nivelBg: "var(--turquesa-light)",
  nivelColor: "var(--turquesa-s)" },
  ];

  export default function Alumnos() {
    const [selectedId, setSelectedId] = useState(1);
    const [filtroSalon, setFiltroSalon] = useState<string | null>(null);
    const [busqueda, setBusqueda] = useState("");

    const alumnosFiltrados = ALUMNOS.filter(a =>
      (!filtroSalon || a.salon === filtroSalon) &&
      (!busqueda || a.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    );

    const alumno = ALUMNOS.find(a => a.id === selectedId)!;

    return (
      <div className={styles.root}>

        {/* ── LISTA ── */}
        <div className={styles.panelLista}>
          <div className={styles.listaHeader}>
            <div className={styles.listaTop}>
              <span className={styles.listaTitulo}>Alumnos</span>
              <span className={styles.listaCount}>102 alumnos</span>
            </div>
            <div className={styles.searchWrap}>
              <MdSearch size={14} color="var(--texto-3)" />
              <input
                className={styles.searchInput}
                placeholder="Buscar alumno o familia…"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
            </div>
            <div className={styles.salonFilters}>
              {SALONES_FILTER.map(sf => {
                const isAll = sf.label === "Todos";
                const active = isAll ? filtroSalon === null : filtroSalon === sf.label;
                return (
                  <button
                    key={sf.label}
                    className={`${styles.sf} ${active ? styles.sfOn : styles.sfOff}`}
                    onClick={() => setFiltroSalon(isAll ? null : sf.label)}
                  >
                    {!isAll && <AnimalIcon salon={sf.label} size={10} />}
                    {sf.label} · {sf.count}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.lista}>
            {alumnosFiltrados.map(a => {
              const g = getGrupo(a.salon);
              const st = STATUS_STYLE[a.status];
              return (
                <div
                  key={a.id}
                  className={`${styles.alItem} ${a.id === selectedId ? styles.alSel : ""}`}
                  onClick={() => setSelectedId(a.id)}
                >
                  <div className={styles.alAv} style={{ background: g?.light, color: g?.dark, border: `1.5px solid ${g?.color}` }}>
                    {a.inicial}
                  </div>
                  <div className={styles.alDatos}>
                    <div className={styles.alNombre}>{a.nombre}</div>
                    <div className={styles.alMeta}>
                      <span className={styles.alTag} style={{ background: g?.light, color: g?.dark }}>{a.salon}</span>
                      <span className={styles.alEdad}>{a.edad}</span>
                    </div>
                  </div>
                  <div className={styles.alRight}>
                    <span className={styles.alSt} style={{ background: st.bg, color: st.color }}>{a.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── EXPEDIENTE ── */}
        <div className={styles.panelExp}>
          <div className={styles.expTopbar}>
            <div>
              <div className={styles.expTitulo}>{alumno.nombre}</div>
              <div className={styles.expSub}>Expediente · {alumno.salon} · {alumno.nivel}</div>
            </div>
            <div className={styles.expActions}>
              <button className={styles.btnS}><MdDownload size={13} /> Exportar</button>
              <button className={styles.btnS}><MdEdit size={13} /> Editar</button>
              <button className={styles.btnP}><MdAdd size={13} color="#5A4800" /> Nueva bitácora</button>
            </div>
          </div>

          <div className={styles.expContent}>

            {/* HERO */}
            <div className={styles.alumnoHero}>
              <AnimalAvatar group={alumno.salon} size="lg" />
              <div className={styles.heroDatos}>
                <div className={styles.heroNombre}>{alumno.nombre}</div>
                <div className={styles.heroChips}>
                  <span className={styles.hc}>⏱ {alumno.edad}</span>
                  <span className={styles.hc}>📅 Desde ago 2024</span>
                  <span className={styles.hc}>🏠 {alumno.nivel}</span>
                  <AnimalPillLight group={alumno.salon} label={`${alumno.salon} · Mtra. Sandra`} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { num: "94%", lbl: "Asistencia",   color: "var(--verde)"      },
                    { num: "28",  lbl: "Bitácoras",     color: "var(--turquesa)"   },
                    { num: "5",   lbl: "Áreas activas", color: "var(--rosa)"       },
                    { num: "14",  lbl: "Avisos leídos", color: "var(--amarillo-s)" },
                  ].map(sc => (
                    <div key={sc.lbl} className={styles.statChip}>
                      <div className={styles.scNum} style={{ color: sc.color }}>{sc.num}</div>
                      <div className={styles.scLbl}>{sc.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.heroRight}>
                <span className={styles.inscritaBadge}>✓ Inscrita activa</span>
                <div style={{ textAlign: "right", marginTop: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--texto-3)" }}>CURP</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "var(--texto)" }}>RASF201015MPLLVRA8</div>
                </div>
              </div>
            </div>

            {/* DATOS + ASISTENCIA */}
            <div className={styles.g2}>
              <div className={styles.dc}>
                <div className={styles.dch}><span className={styles.dct}>Datos personales</span><span 
  className={styles.dcl}>Editar</span></div>
                <div className={styles.dcb}>
                  {[
                    { lbl: "Nombre completo",    val: "Sofía Ramírez Mendoza"           },
                    { lbl: "Fecha de nacimiento",val: "15 oct 2020 · 4 años"            },
                    { lbl: "CURP",               val: "RASF201015MPLLVRA8"              },
                    { lbl: "Tipo de sangre",     val: "O+"                              },
                    { lbl: "Alergias",           val: "Polen · Polvo", color: "var(--rojo)" },
                    { lbl: "Medicamentos",       val: "Ninguno"                         },
                    { lbl: "Médico de cabecera", val: "Dr. Hernández · 222 111 2233"    },
                  ].map(d => (
                    <div key={d.lbl} className={styles.datoRow}>
                      <span className={styles.datoLbl}>{d.lbl}</span>
                      <span className={styles.datoVal} style={{ color: d.color }}>{d.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.dc}>
                <div className={styles.dch}><span className={styles.dct}>Asistencia — Octubre 2025</span><span className={styles.dcl}>Ver
  historial</span></div>
                <div className={styles.dcb}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                    {[{ color: "var(--verde)", lbl: "Presente" }, { color: "var(--rojo)", lbl: "Ausente" }, { color: "var(--amarillo)", lbl:
  "Retardo" }].map(l => (
                      <div key={l.lbl} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: 
  "var(--texto-2)" }}>
                        <div style={{ width: 8, height: 8, borderRadius: 3, background: l.color }} />{l.lbl}
                      </div>
                    ))}
                  </div>
                  <div className={styles.asistGrid}>
                    {ASISTENCIA.map(d => (
                      <div key={d.dia} className={`${styles.dia} ${ASIST_CLASS[d.tipo]}`}>{d.dia}</div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "var(--verde)" }}>14 presentes</span>
                    <span style={{ color: "var(--texto-3)" }}>·</span>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "var(--rojo)" }}>1 ausente</span>
                    <span style={{ color: "var(--texto-3)" }}>·</span>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "#B89600" }}>1 retardo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MONTESSORI + AUTORIZADOS */}
            <div className={styles.g2}>
              <div className={styles.dc}>
                <div className={styles.dch}><span className={styles.dct}>Desarrollo Montessori</span><span className={styles.dcl}>Ver
  bitácoras</span></div>
                <div className={styles.dcb}>
                  {AREAS.map(a => (
                    <div key={a.nombre} className={styles.areaRow}>
                      <div className={styles.areaDot} style={{ background: a.color }} />
                      <span className={styles.areaNombre}>{a.nombre}</span>
                      <div className={styles.areaBarraW}><div className={styles.areaBarra} style={{ width: `${a.pct * 100}%`, background: 
  a.color }} /></div>
                      <span className={styles.areaCount}>{a.count}</span>
                      <span className={styles.areaNivel} style={{ background: a.nBg, color: a.nColor }}>{a.nivel}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.dc}>
                <div className={styles.dch}><span className={styles.dct}>Personas autorizadas</span><span className={styles.dcl}>+
  Agregar</span></div>
                <div className={styles.dcb}>
                  {AUTORIZADOS.map(p => (
                    <div key={p.nombre} className={styles.autRow}>
                      <div className={styles.autAv} style={{ background: p.bg, color: p.color, border: `1.5px solid ${p.border}`
  }}>{p.inicial}</div>
                      <div className={styles.autDatos}>
                        <div className={styles.autNombre}>{p.nombre}</div>
                        <div className={styles.autRel}>{p.rel}</div>
                        <div className={styles.autTel}>{p.tel}</div>
                      </div>
                      <span className={styles.autBadge} style={{ background: p.badgeBg, color: p.badgeColor }}>{p.badge}</span>
                    </div>
                  ))}
                  <button className={styles.btnAdd}><MdAdd size={14} /> Agregar persona autorizada</button>
                </div>
              </div>
            </div>

            {/* BITÁCORAS */}
            <div className={styles.dc}>
              <div className={styles.dch}>
                <div>
                  <span className={styles.dct}>Bitácoras recientes</span>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--texto-3)", marginTop: 2 }}>28 observaciones en el ciclo</div>
                </div>
                <span className={styles.dcl}>Ver todas →</span>
              </div>
              <div className={styles.dcb} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }}>
                {BITACORAS.map(b => (
                  <div key={b.area} className={styles.bitItem}>
                    <div className={styles.bitTop}>
                      <span className={styles.bitArea} style={{ background: b.areaBg, color: b.areaColor }}>{b.area}</span>
                      <span className={styles.bitFecha}>{b.fecha}</span>
                    </div>
                    <div className={styles.bitTexto}>{b.texto}</div>
                    <span className={styles.bitNivel} style={{ background: b.nivelBg, color: b.nivelColor }}>{b.nivel}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }