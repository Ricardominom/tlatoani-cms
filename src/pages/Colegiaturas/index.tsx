import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MdSearch,
  MdSave,
  MdCheckCircleOutline,
  MdErrorOutline,
  MdAccessTime,
  MdMonetizationOn,
} from "react-icons/md";
import { getGrupo } from "../../components/ui/AnimalKit";
import {
  getColegiaturas,
  actualizarColegiatura,
  eliminarColegiatura,
  generarColegiaturasDelMes,
} from "../../services/colegiaturasService";
import { useAuth } from "../../context/AuthContext";
import type { Colegiatura } from "../../types";
import styles from "./Colegiaturas.module.css";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

type FiltroColeg = "todas" | "vencidas" | "pendientes" | "pagadas";

const ESTADO_LABEL: Record<Colegiatura["status"], string> = {
  paid: "Pagado",
  pending: "Pendiente",
  overdue: "Vencido",
};

const ESTADO_STYLE: Record<
  Colegiatura["status"],
  { bg: string; color: string }
> = {
  paid: { bg: "var(--verde-light)", color: "var(--verde-s)" },
  pending: { bg: "var(--amarillo-light)", color: "var(--amarillo-s)" },
  overdue: { bg: "var(--rojo-light)", color: "var(--rojo)" },
};

function periodoActual() {
  return new Date().toISOString().slice(0, 7); // "YYYY-MM"
}

export default function Colegiaturas() {
  const { user } = useAuth();
  const esAdmin = user?.role === "superadmin" || user?.role === "admin";

  const [periodo, setPeriodo] = useState(periodoActual());
  const [filtro, setFiltro] = useState<FiltroColeg>("todas");
  const [busqueda, setBusqueda] = useState("");
  const [seleccionada, setSeleccionada] = useState<Colegiatura | null>(null);
  const [metodoPago, setMetodoPago] = useState("Transferencia bancaria");
  const [referencia, setReferencia] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [confirmEliminarOpen, setConfirmEliminarOpen] = useState(false);
  const [colegiaturaAEliminar, setColegiaturaAEliminar] =
    useState<Colegiatura | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["colegiaturas", periodo, filtro, busqueda],
    queryFn: () =>
      getColegiaturas({
        period: periodo,
        status:
          filtro === "vencidas"
            ? "overdue"
            : filtro === "pendientes"
              ? "pending"
              : filtro === "pagadas"
                ? "paid"
                : undefined,
        search: busqueda || undefined,
        per_page: 100,
        include: "student,paidBy",
      }),
  });

  const registros = data?.data ?? [];
  const totalRegistros = data?.meta.total ?? registros.length;

  const resumen = registros.reduce(
    (acc, r) => {
      const monto = Number(r.amount);
      acc.total += monto;
      if (r.status === "paid") acc.cobrado += monto;
      if (r.status === "pending") acc.pendiente += monto;
      if (r.status === "overdue") acc.vencido += monto;
      return acc;
    },
    { cobrado: 0, pendiente: 0, vencido: 0, total: 0 },
  );

  const countVencidas = registros.filter((r) => r.status === "overdue").length;
  const countPendientes = registros.filter(
    (r) => r.status === "pending",
  ).length;
  const countPagadas = registros.filter((r) => r.status === "paid").length;

  const marcarPagado = useMutation({
    mutationFn: (vars: {
      uuid: string;
      payment_method: string;
      reference: string;
      payment_date: string;
    }) =>
      actualizarColegiatura(vars.uuid, {
        status: "paid",
        payment_method: vars.payment_method,
        reference: vars.reference,
        payment_date: vars.payment_date,
        paid_by_uuid: user?.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colegiaturas"] });
      setSeleccionada(null);
      setReferencia("");
      setFechaPago("");
    },
  });

  const generar = useMutation({
    mutationFn: () => generarColegiaturasDelMes(periodo),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["colegiaturas"] });
      const r = result as { created: number; skipped: number };
      alert(`Generadas: ${r.created}, ya existían: ${r.skipped}`);
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: (uuid: string) => eliminarColegiatura(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colegiaturas"] });
      queryClient.invalidateQueries({ queryKey: ["colegiaturas-alumno"] });
      setConfirmEliminarOpen(false);
      setColegiaturaAEliminar(null);
    },
  });

  return (
    <div className={styles.content}>
      <div className={styles.finGrid}>
        <div className={styles.finCard}>
          <div
            className={styles.finAccent}
            style={{ background: "var(--verde)" }}
          />
          <div
            className={styles.finIcono}
            style={{ background: "var(--verde-light)" }}
          >
            <MdCheckCircleOutline size={18} color="var(--verde)" />
          </div>
          <div className={styles.finNum} style={{ color: "var(--verde)" }}>
            ${resumen.cobrado.toLocaleString()}
          </div>
          <div className={styles.finLbl}>Cobrado en {periodo}</div>
        </div>
        <div className={styles.finCard}>
          <div
            className={styles.finAccent}
            style={{ background: "var(--rojo)" }}
          />
          <div
            className={styles.finIcono}
            style={{ background: "var(--rojo-light)" }}
          >
            <MdErrorOutline size={18} color="var(--rojo)" />
          </div>
          <div className={styles.finNum} style={{ color: "var(--rojo)" }}>
            ${resumen.vencido.toLocaleString()}
          </div>
          <div className={styles.finLbl}>Vencido</div>
        </div>
        <div className={styles.finCard}>
          <div
            className={styles.finAccent}
            style={{ background: "var(--amarillo)" }}
          />
          <div
            className={styles.finIcono}
            style={{ background: "var(--amarillo-light)" }}
          >
            <MdAccessTime size={18} color="var(--amarillo-s)" />
          </div>
          <div className={styles.finNum} style={{ color: "var(--amarillo-s)" }}>
            ${resumen.pendiente.toLocaleString()}
          </div>
          <div className={styles.finLbl}>Pendiente</div>
        </div>
        <div className={styles.finCard}>
          <div
            className={styles.finAccent}
            style={{ background: "var(--turquesa)" }}
          />
          <div
            className={styles.finIcono}
            style={{ background: "var(--turquesa-light)" }}
          >
            <MdMonetizationOn size={18} color="var(--turquesa)" />
          </div>
          <div className={styles.finNum} style={{ color: "var(--turquesa)" }}>
            ${resumen.total.toLocaleString()}
          </div>
          <div className={styles.finLbl}>
            Total del periodo · {totalRegistros} registros
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.tablaCard}>
          <div className={styles.tablaHeader}>
            <span className={styles.tablaTitulo}>Colegiaturas</span>
            <input
              className={styles.fieldInput}
              type="month"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
            />
            <div className={styles.searchWrap}>
              <MdSearch size={13} color="var(--texto-3)" />
              <input
                className={styles.searchInput}
                placeholder="Buscar alumno…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className={styles.filTabs}>
              <button
                className={`${styles.filTab} ${filtro === "todas" ? styles.ftOn : styles.ftOff}`}
                onClick={() => setFiltro("todas")}
              >
                Todas · {registros.length}
              </button>
              <button
                className={`${styles.filTab} ${filtro === "vencidas" ? styles.ftOn : styles.ftRed}`}
                onClick={() => setFiltro("vencidas")}
              >
                Vencidas · {countVencidas}
              </button>
              <button
                className={`${styles.filTab} ${filtro === "pendientes" ? styles.ftOn : styles.ftYel}`}
                onClick={() => setFiltro("pendientes")}
              >
                Pendientes · {countPendientes}
              </button>
              <button
                className={`${styles.filTab} ${filtro === "pagadas" ? styles.ftOn : styles.ftGrn}`}
                onClick={() => setFiltro("pagadas")}
              >
                Pagadas · {countPagadas}
              </button>
            </div>
            {esAdmin && (
              <button
                className={styles.btnRegistrar}
                onClick={() => generar.mutate()}
                disabled={generar.isPending}
              >
                Generar colegiaturas de {periodo}
              </button>
            )}
          </div>

          <div className={styles.tablaWrap}>
            {error && (
              <div style={{ color: "var(--rojo)", padding: 12 }}>
                {error instanceof Error
                  ? error.message
                  : "Error al cargar colegiaturas"}
              </div>
            )}
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Periodo</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha de pago</th>
                  {esAdmin && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={6}>Cargando…</td>
                  </tr>
                )}
                {registros.map((r) => {
                  const st = ESTADO_STYLE[r.status];
                  const g = r.student?.group
                    ? getGrupo(r.student.group.name)
                    : undefined;
                  return (
                    <tr
                      key={r.id}
                      className={
                        seleccionada?.id === r.id
                          ? styles.trSelected
                          : undefined
                      }
                      onClick={() => setSeleccionada(r)}
                    >
                      <td>
                        <div className={styles.famCell}>
                          <div>
                            <div className={styles.famNombre}>
                              {r.student
                                ? `${r.student.name} ${r.student.last_name}`
                                : "—"}
                            </div>
                            {g && (
                              <span
                                className={styles.chipXs}
                                style={{ background: g.light, color: g.dark }}
                              >
                                {r.student?.group?.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{r.period}</td>
                      <td>${Number(r.amount).toLocaleString()}</td>
                      <td>
                        <span
                          className={styles.stBadge}
                          style={{ background: st.bg, color: st.color }}
                        >
                          {ESTADO_LABEL[r.status]}
                        </span>
                      </td>
                      <td>{r.payment_date ?? "—"}</td>
                      {esAdmin && (
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            {r.status !== "paid" && (
                              <button
                                className={styles.actBtn}
                                style={{
                                  background: "var(--verde-light)",
                                  color: "var(--verde-s)",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSeleccionada(r);
                                }}
                              >
                                ✓ Pagado
                              </button>
                            )}
                            <button
                              className={styles.actBtn}
                              style={{
                                background: "var(--rojo-light)",
                                color: "var(--rojo)",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setColegiaturaAEliminar(r);
                                setConfirmEliminarOpen(true);
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {esAdmin && seleccionada && (
          <div className={styles.panelPago}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitulo}>Registrar pago</div>
              <div className={styles.panelSub}>
                {seleccionada.student
                  ? `${seleccionada.student.name} ${seleccionada.student.last_name}`
                  : "—"}{" "}
                · {seleccionada.period}
              </div>
            </div>
            <div className={styles.panelBody}>
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
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder="TRF-2026-XXXX"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLbl}>Fecha de pago</label>
                <input
                  className={styles.fieldInput}
                  type="date"
                  value={fechaPago}
                  onChange={(e) => setFechaPago(e.target.value)}
                />
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLbl}>Monto</span>
                <span className={styles.totalNum}>
                  ${Number(seleccionada.amount).toLocaleString()}
                </span>
              </div>
              <button
                className={styles.btnRegistrar}
                disabled={marcarPagado.isPending || !fechaPago}
                onClick={() =>
                  marcarPagado.mutate({
                    uuid: seleccionada.id,
                    payment_method: metodoPago,
                    reference: referencia,
                    payment_date: fechaPago,
                  })
                }
              >
                <MdSave size={15} />
                Registrar pago
              </button>
            </div>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={confirmEliminarOpen}
        titulo="Eliminar colegiatura"
        mensaje={`¿Eliminar el registro de ${colegiaturaAEliminar?.period ?? ""} por $${Number(colegiaturaAEliminar?.amount ?? 0).toLocaleString()}? Esta acción no se puede deshacer.`}
        labelConfirm="Eliminar"
        onConfirm={() =>
          colegiaturaAEliminar &&
          eliminarMutation.mutate(colegiaturaAEliminar.id)
        }
        onCancel={() => {
          setConfirmEliminarOpen(false);
          setColegiaturaAEliminar(null);
        }}
      />
    </div>
  );
}
