import { useState, useEffect } from "react";
import {
  MdSearch,
  MdCheck,
  MdSave,
  MdNotificationsNone,
  MdCheckCircleOutline,
  MdErrorOutline,
  MdAccessTime,
  MdMonetizationOn
} from "react-icons/md";
import { getGrupo } from "../../components/ui/AnimalKit";
import styles from "./Colegiaturas.module.css";
import type { FiltroColeg } from "./types";
import { FAMILIAS_COLEG, MESES_CICLO } from "./colegiaturas.mock";

const ESTADO_STYLE = {
  Vencido: { bg: "var(--rojo-light)", color: "var(--rojo)" },
  EstaSemana: { bg: "var(--amarillo-light)", color: "var(--amarillo-s)" },
  AlCorriente: { bg: "var(--verde-light)", color: "var(--verde-s)" }
};

const MES_PILL_CLS = {
  ok: styles.mpOk,
  pend: styles.mpPend,
  fut: styles.mpFut
};

const FIN_CARDS = [
  {
    accent: "var(--verde)",
    iconBg: "var(--verde-light)",
    icon: <MdCheckCircleOutline size={18} color="var(--verde)" />,
    num: "$326,400",
    numColor: "var(--verde)",
    lbl: "Cobrado este ciclo",
    sub: "81% del total esperado"
  },
  {
    accent: "var(--rojo)",
    iconBg: "var(--rojo-light)",
    icon: <MdErrorOutline size={18} color="var(--rojo)" />,
    num: "$38,400",
    numColor: "var(--rojo)",
    lbl: "Pendiente de cobro",
    sub: "12 familias · vencido"
  },
  {
    accent: "var(--amarillo)",
    iconBg: "var(--amarillo-light)",
    icon: <MdAccessTime size={18} color="var(--amarillo-s)" />,
    num: "$19,200",
    numColor: "var(--amarillo-s)",
    lbl: "Vence esta semana",
    sub: "6 familias · próximas"
  },
  {
    accent: "var(--turquesa)",
    iconBg: "var(--turquesa-light)",
    icon: <MdMonetizationOn size={18} color="var(--turquesa)" />,
    num: "$403,200",
    numColor: "var(--turquesa)",
    lbl: "Total del ciclo",
    sub: "102 alumnos · $3,200 c/u"
  }
];

export default function Colegiaturas() {
  const [selectedId, setSelectedId] = useState(3);
  const [filtro, setFiltro] = useState<FiltroColeg>("todas");
  const [busqueda, setBusqueda] = useState("");
  const [mesesChecked, setMesesChecked] = useState<string[]>([]);
  const [metodoPago, setMetodoPago] = useState("Transferencia bancaria");

  const fam =
    FAMILIAS_COLEG.find((f) => f.id === selectedId) ?? FAMILIAS_COLEG[0];

  useEffect(() => {
    const f =
      FAMILIAS_COLEG.find((f) => f.id === selectedId) ?? FAMILIAS_COLEG[0];
    setMesesChecked([...f.mesesPendientesList]);
  }, [selectedId]);

  const familiasFiltradas = FAMILIAS_COLEG.filter((f) => {
    const matchBusqueda =
      !busqueda || f.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchFiltro =
      filtro === "vencidas"
        ? f.estado === "Vencido"
        : filtro === "estaSemana"
          ? f.estado === "EstaSemana"
          : filtro === "corriente"
            ? f.estado === "AlCorriente"
            : true;
    return matchBusqueda && matchFiltro;
  });

  const countVencidas = FAMILIAS_COLEG.filter(
    (f) => f.estado === "Vencido"
  ).length;
  const countEstaSemana = FAMILIAS_COLEG.filter(
    (f) => f.estado === "EstaSemana"
  ).length;

  const toggleMes = (mes: string) =>
    setMesesChecked((prev) =>
      prev.includes(mes) ? prev.filter((m) => m !== mes) : [...prev, mes]
    );

  const total = mesesChecked.length * fam.cuotaMensual;

  return (
    <div className={styles.content}>
      {/* ── FIN GRID ── */}
      <div className={styles.finGrid}>
        {FIN_CARDS.map((c) => (
          <div key={c.lbl} className={styles.finCard}>
            <div
              className={styles.finAccent}
              style={{ background: c.accent }}
            />
            <div className={styles.finIcono} style={{ background: c.iconBg }}>
              {c.icon}
            </div>
            <div className={styles.finNum} style={{ color: c.numColor }}>
              {c.num}
            </div>
            <div className={styles.finLbl}>{c.lbl}</div>
            <div className={styles.finSub}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* ── CICLO ── */}
      <div className={styles.cicloCard}>
        <div className={styles.cicloHeader}>
          <div>
            <div className={styles.cicloTitulo}>
              Progreso de cobro — Ciclo 2025–2026
            </div>
            <div className={styles.cicloSub}>
              8 de 10 meses · $326,400 de $403,200
            </div>
          </div>
          <div className={styles.cicloPct}>81%</div>
        </div>
        <div className={styles.cicloBarraWrap}>
          <div className={styles.cicloBarra} />
        </div>
        <div className={styles.cicloMeses}>
          {MESES_CICLO.map((m) => (
            <div
              key={m.nombre}
              className={`${styles.mesPill} ${MES_PILL_CLS[m.tipo]}`}
            >
              {m.nombre}
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className={styles.mainGrid}>
        {/* TABLA */}
        <div className={styles.tablaCard}>
          <div className={styles.tablaHeader}>
            <span className={styles.tablaTitulo}>Familias</span>
            <div className={styles.searchWrap}>
              <MdSearch size={13} color="var(--texto-3)" />
              <input
                className={styles.searchInput}
                placeholder="Buscar familia…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className={styles.filTabs}>
              <button
                className={`${styles.filTab} ${filtro === "todas" ? styles.ftOn : styles.ftOff}`}
                onClick={() => setFiltro("todas")}
              >
                Todas · {FAMILIAS_COLEG.length}
              </button>
              <button
                className={`${styles.filTab} ${filtro === "vencidas" ? styles.ftOn : styles.ftRed}`}
                onClick={() => setFiltro("vencidas")}
              >
                Vencidas · {countVencidas}
              </button>
              <button
                className={`${styles.filTab} ${filtro === "estaSemana" ? styles.ftOn : styles.ftYel}`}
                onClick={() => setFiltro("estaSemana")}
              >
                Esta semana · {countEstaSemana}
              </button>
              <button
                className={`${styles.filTab} ${filtro === "corriente" ? styles.ftOn : styles.ftGrn}`}
                onClick={() => setFiltro("corriente")}
              >
                Al corriente
              </button>
            </div>
          </div>

          <div className={styles.tablaWrap}>
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th>Familia</th>
                  <th>Salón(es)</th>
                  <th>Monto</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {familiasFiltradas.map((f) => {
                  const st = ESTADO_STYLE[f.estado];
                  const isVencido = f.estado === "Vencido";
                  const isCorriente = f.estado === "AlCorriente";
                  const salones = [...new Set(f.hijos.map((h) => h.salon))];
                  return (
                    <tr
                      key={f.id}
                      className={
                        f.id === selectedId ? styles.trSelected : undefined
                      }
                      onClick={() => setSelectedId(f.id)}
                    >
                      <td>
                        <div className={styles.famCell}>
                          <div
                            className={styles.famAv}
                            style={{
                              background: f.avBg,
                              color: f.avColor,
                              border: `1.5px solid ${f.avBorder}`
                            }}
                          >
                            {f.inicial}
                          </div>
                          <div>
                            <div className={styles.famNombre}>{f.nombre}</div>
                            <div className={styles.famHijos}>
                              {f.hijos.map((h) => {
                                const g = getGrupo(h.salon);
                                return (
                                  <span
                                    key={h.nombre}
                                    className={styles.chipXs}
                                    style={{
                                      background: g?.light,
                                      color: g?.dark
                                    }}
                                  >
                                    {h.nombre} · {h.salon}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.salonesCell}>
                          {salones.map((s) => {
                            const g = getGrupo(s);
                            return (
                              <span
                                key={s}
                                className={styles.chipXs}
                                style={{ background: g?.light, color: g?.dark }}
                              >
                                {s}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td>
                        <span
                          className={
                            isCorriente
                              ? styles.montoCobrado
                              : isVencido
                                ? styles.montoPendiente
                                : styles.montoProximo
                          }
                        >
                          ${f.monto.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            isVencido
                              ? styles.vencTxtRed
                              : isCorriente
                                ? styles.vencTxtGreen
                                : styles.vencTxt
                          }
                        >
                          {f.vencimientoTxt}
                        </span>
                      </td>
                      <td>
                        <span
                          className={styles.stBadge}
                          style={{ background: st.bg, color: st.color }}
                        >
                          {f.estadoTxt}
                        </span>
                      </td>
                      <td>
                        <div className={styles.accionesCell}>
                          {isCorriente ? (
                            <button
                              className={styles.actBtn}
                              style={{
                                background: "var(--gris-bg)",
                                color: "var(--texto-2)",
                                border: "1px  solid var(--gris-borde)"
                              }}
                            >
                              Historial
                            </button>
                          ) : (
                            <>
                              <button
                                className={styles.actBtn}
                                style={
                                  isVencido
                                    ? {
                                        background: "var(--rojo-light)",
                                        color: "var(--rojo)"
                                      }
                                    : {
                                        background: "var(--amarillo-light)",
                                        color: "var(--amarillo-s)"
                                      }
                                }
                              >
                                Recordar
                              </button>
                              <button
                                className={styles.actBtn}
                                style={{
                                  background: "var(--verde-light)",
                                  color: "var(--verde-s)"
                                }}
                              >
                                ✓ Pagado
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* PANEL PAGO */}
        <div className={styles.panelPago}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitulo}>Registrar pago</div>
            <div className={styles.panelSub}>{fam.nombre} · seleccionada</div>
          </div>
          <div className={styles.panelBody}>
            <div className={styles.famSelCard}>
              <div className={styles.famSelNombre}>{fam.nombre}</div>
              <div className={styles.famSelHijos}>
                {fam.hijos.map((h) => {
                  const g = getGrupo(h.salon);
                  return (
                    <span
                      key={h.nombre}
                      className={styles.chipXs}
                      style={{
                        background: g?.light,
                        color: g?.dark,
                        fontSize: 9,
                        padding: "2px 8px",
                        borderRadius: 8
                      }}
                    >
                      {h.nombre} · {h.salon}
                    </span>
                  );
                })}
              </div>
              <div className={styles.famSelStats}>
                <div className={styles.famSelStat}>
                  <span
                    className={styles.famSelNum}
                    style={{ color: "var(--verde)" }}
                  >
                    {fam.mesesPagados}
                  </span>
                  <span className={styles.famSelLbl}>Pagados</span>
                </div>
                <div className={styles.famSelStat}>
                  <span
                    className={styles.famSelNum}
                    style={{ color: "var(--amarillo-s)" }}
                  >
                    {fam.mesesPendientes}
                  </span>
                  <span className={styles.famSelLbl}>Pendientes</span>
                </div>
                <div className={styles.famSelStat}>
                  <span className={styles.famSelNum}>
                    ${fam.monto.toLocaleString()}
                  </span>
                  <span className={styles.famSelLbl}>A pagar</span>
                </div>
              </div>
            </div>

            {fam.mesesPendientesList.length > 0 && (
              <div className={styles.field}>
                <label className={styles.fieldLbl}>Meses a registrar</label>
                <div className={styles.mesesGrid}>
                  {fam.mesesPendientesList.map((mes) => {
                    const checked = mesesChecked.includes(mes);
                    return (
                      <div
                        key={mes}
                        className={`${styles.mesCheck} ${checked ? styles.mesCheckOn : ""}`}
                        onClick={() => toggleMes(mes)}
                      >
                        <div
                          className={`${styles.mesCheckBox} ${checked ? styles.mesCheckBoxOn : ""}`}
                        >
                          {checked && <MdCheck size={9} color="#5A4800" />}
                        </div>
                        <span className={styles.mesCheckLbl}>{mes}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.fieldLbl}>Método de pago</label>
              <select
                className={`${styles.fieldInput} ${styles.fieldSelect}`}
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <option>Transferencia bancaria</option>
                <option>Efectivo</option>
                <option>Tarjeta</option>
                <option>Cheque</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLbl}>
                Referencia / comprobante
              </label>
              <input
                className={styles.fieldInput}
                type="text"
                placeholder="TRF-2025-XXXX"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLbl}>Fecha de pago</label>
              <input className={styles.fieldInput} type="date" />
            </div>

            <div className={styles.totalRow}>
              <span className={styles.totalLbl}>Total a registrar</span>
              <span className={styles.totalNum}>${total.toLocaleString()}</span>
            </div>

            <button className={styles.btnRegistrar}>
              <MdSave size={15} />
              Registrar pago
            </button>

            <button className={styles.btnRecordar}>
              <MdNotificationsNone size={13} />
              Enviar recordatorio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
