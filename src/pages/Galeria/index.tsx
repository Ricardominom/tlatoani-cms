import { useState } from "react";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdSend,
  MdUpload,
  MdPublish,
  MdDelete,
  MdExpandMore
} from "react-icons/md";
import styles from "./Galeria.module.css";
import { EVENTOS, FOTOS_HALLOWEEN, SALONES_GALERIA } from "./galeria.mock";

export default function Galeria() {
  const [selectedId, setSelectedId] = useState(1);
  const [filtroSalon, setFiltroSalon] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [seleccionadas, setSeleccionadas] = useState<number[]>([1, 3, 7]);

  const evento = EVENTOS.find((e) => e.id === selectedId) ?? EVENTOS[0];

  const eventosFiltrados = EVENTOS.filter(
    (e) => !busqueda || e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleFoto = (id: number) =>
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleTodas = () =>
    setSeleccionadas((prev) =>
      prev.length === FOTOS_HALLOWEEN.length
        ? []
        : FOTOS_HALLOWEEN.map((f) => f.id)
    );

  return (
    <div className={styles.content}>
      <div className={styles.galeriaLayout}>
        {/* ── PANEL EVENTOS ── */}
        <div className={styles.panelEventos}>
          <div className={styles.peHeader}>
            <div>
              <div className={styles.peTitulo}>Eventos</div>
              <div className={styles.peSub}>8 eventos · 342 fotos</div>
            </div>
          </div>

          <div className={styles.searchWrap}>
            <MdSearch size={13} color="var(--texto-3)" />
            <input
              placeholder="Buscar evento…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className={styles.salonTabs}>
            {SALONES_GALERIA.map((s) => (
              <button
                key={s}
                className={`${styles.stBtn} ${filtroSalon === s ? styles.stOn : styles.stOff}`}
                onClick={() => setFiltroSalon(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {eventosFiltrados.map((ev) => (
            <div
              key={ev.id}
              className={`${styles.evItem} ${ev.id === selectedId ? styles.evItemSel : ""}`}
              onClick={() => setSelectedId(ev.id)}
            >
              <div className={styles.evThumb}>
                <div
                  className={styles.evThumbBg}
                  style={{ background: ev.thumbBg }}
                >
                  {ev.emoji}
                </div>
                <div className={styles.evThumbCount}>{ev.fotos}</div>
              </div>
              <div className={styles.evDatos}>
                <div className={styles.evNombre}>{ev.nombre}</div>
                <div className={styles.evMeta}>
                  <span
                    className={styles.evTag}
                    style={{ background: ev.tagBg, color: ev.tagColor }}
                  >
                    {ev.tipoTxt}
                  </span>
                  <span className={styles.evFechaTxt}>{ev.fechaTxt}</span>
                </div>
              </div>
              <div className={styles.evRight}>
                <span className={styles.evFotos}>{ev.fotos} fotos</span>
                <span
                  className={styles.evPubSt}
                  style={{
                    color:
                      ev.estado === "Publicado"
                        ? "var(--verde)"
                        : "var(--amarillo-s)"
                  }}
                >
                  {ev.estado === "Publicado" ? "✓ Publicado" : "Borrador"}
                </span>
              </div>
            </div>
          ))}

          <button className={styles.btnAddEv}>
            <MdAdd size={13} /> Crear nuevo evento
          </button>
        </div>

        {/* ── PANEL FOTOS ── */}
        <div className={styles.panelFotos}>
          {/* HERO */}
          <div className={styles.evHero}>
            <div
              className={styles.evhBanner}
              style={{ background: evento.heroBg }}
            >
              <div className={styles.evhEmoji}>{evento.emoji}</div>
              <div className={styles.evhDatos}>
                <div
                  className={styles.evhNombre}
                  style={{ color: evento.heroColor }}
                >
                  {evento.nombre}
                </div>
                <div className={styles.evhMeta}>
                  {[
                    evento.fechaTxt,
                    evento.heroMeta,
                    `${evento.fotos} fotos subidas`
                  ].map((txt) => (
                    <span
                      key={txt}
                      className={styles.evhChip}
                      style={{
                        background: evento.heroChipBg,
                        color: evento.heroChipColor
                      }}
                    >
                      {txt}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.evhActions}>
                <button
                  className={`${styles.evhBtn} ${styles.evhBtnSec}`}
                  style={{ color: evento.heroColor }}
                >
                  <MdEdit size={12} /> Editar evento
                </button>
                <button
                  className={`${styles.evhBtn} ${styles.evhBtnPri}`}
                  style={{
                    background: evento.heroColor,
                    boxShadow: `0 2px 0 rgba(0,0,0,0.2)`
                  }}
                >
                  <MdSend size={12} /> Publicar a familias
                </button>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className={styles.fotosStats}>
            {[
              { num: evento.fotos, color: "var(--rosa)", lbl: "Fotos subidas" },
              { num: 0, color: "var(--amarillo-s)", lbl: "Publicadas" },
              { num: 4, color: "var(--turquesa)", lbl: "Salones" },
              { num: 0, color: "var(--verde)", lbl: "Vistas de papás" }
            ].map((s) => (
              <div key={s.lbl} className={styles.fstat}>
                <div className={styles.fstatNum} style={{ color: s.color }}>
                  {s.num}
                </div>
                <div className={styles.fstatLbl}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* UPLOAD ZONE */}
          <div className={styles.uploadZone}>
            <div className={styles.uploadIcono}>
              <MdUpload size={22} color="var(--texto-3)" />
            </div>
            <div className={styles.uploadTitulo}>
              Arrastra fotos aquí o haz clic para subir
            </div>
            <div className={styles.uploadSub}>
              JPG, PNG, HEIC · Máximo 50 fotos a la vez
            </div>
            <button className={styles.uploadBtn}>Seleccionar archivos</button>
          </div>

          {/* FOTOS GRID */}
          <div className={styles.fotosCard}>
            <div className={styles.fcHeader}>
              <div className={styles.fcTitulo}>
                {evento.fotos} fotos — {evento.nombre}
              </div>
              <div className={styles.fcAcciones}>
                {seleccionadas.length > 0 && (
                  <span className={styles.fcSelCount}>
                    {seleccionadas.length} seleccionadas
                  </span>
                )}
                <button
                  className={styles.fcBtn + " " + styles.fcBtnSec}
                  onClick={toggleTodas}
                >
                  {seleccionadas.length === FOTOS_HALLOWEEN.length
                    ? "Deseleccionar"
                    : "Seleccionar todo"}
                </button>
                {seleccionadas.length > 0 && (
                  <>
                    <button className={`${styles.fcBtn} ${styles.fcBtnPub}`}>
                      <MdPublish size={12} /> Publicar selección
                    </button>
                    <button className={`${styles.fcBtn} ${styles.fcBtnDel}`}>
                      <MdDelete size={12} /> Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className={styles.fotosGrid}>
              {FOTOS_HALLOWEEN.map((foto) => {
                const checked = seleccionadas.includes(foto.id);
                return (
                  <div
                    key={foto.id}
                    className={`${styles.fotoItem} ${
                      foto.variante === "tall"
                        ? styles.fotoTall
                        : foto.variante === "wide"
                          ? styles.fotoWide
                          : ""
                    }`}
                    onClick={() => toggleFoto(foto.id)}
                  >
                    <div
                      className={styles.fotoBg}
                      style={{ background: foto.bg }}
                    >
                      {foto.emoji}
                    </div>
                    <div className={styles.fotoOverlay}>
                      <div
                        className={`${styles.fotoCheck} ${checked ? styles.fotoCheckOn : ""}`}
                      >
                        {checked && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#5A4800"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span className={styles.fotoTag}>{foto.salon}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.loadMore}>
              <button className={styles.lmBtn}>
                Ver las {evento.fotos - FOTOS_HALLOWEEN.length} fotos restantes
                <MdExpandMore size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
