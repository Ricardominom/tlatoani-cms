import { useState, useEffect } from "react";
import { MdClose, MdCheck } from "react-icons/md";
import styles from "./ModalGrupo.module.css";
import { GRUPOS } from "../../components/ui/AnimalKit";
import type { ApiGroup, ApiLevel, GrupoForm } from "./types";
import { crearGrupo, actualizarGrupo } from "../../services/gruposService";

interface Props {
  open: boolean;
  grupo?: ApiGroup | null;
  niveles: ApiLevel[];
  onClose: () => void;
  onSuccess: () => void;
}

const FORM_VACIO: GrupoForm = {
  level_uuid: "",
  name: "",
  color: "#F5C800",
  entry_time: "08:00",
  dismissal_time: "13:00",
  monthly_fee: "3000",
  capacity: 25,
  active: true
};

export default function ModalGrupo({
  open,
  grupo,
  niveles,
  onClose,
  onSuccess
}: Props) {
  const [form, setForm] = useState<GrupoForm>(FORM_VACIO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (grupo) {
      setForm({
        level_uuid: grupo.level?.id ?? "",
        name: grupo.name,
        color: grupo.color,
        icon_path: grupo.icon_path ?? "",
        entry_time: grupo.entry_time?.slice(0, 5) ?? "08:00",
        dismissal_time: grupo.dismissal_time?.slice(0, 5) ?? "13:00",
        monthly_fee: grupo.monthly_fee,
        capacity: grupo.capacity,
        active: grupo.active
      });
    } else {
      setForm({ ...FORM_VACIO, level_uuid: niveles[0]?.id ?? "" });
    }
    setError(null);
  }, [grupo, open, niveles]);

  if (!open) return null;

  const set = <K extends keyof GrupoForm>(key: K, val: GrupoForm[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  function seleccionarAnimal(nombre: string, color: string) {
    setForm((f) => ({ ...f, color, icon_path: nombre }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (grupo) {
        await actualizarGrupo(grupo.uuid, form);
      } else {
        await crearGrupo(form);
      }
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.titulo}>
            {grupo ? "Editar grupo" : "Nuevo grupo"}
          </span>
          <button className={styles.closeBtn} type="button" onClick={onClose}>
            <MdClose size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.body}>
            {error && <div className={styles.error}>{error}</div>}

            {/* NIVEL */}
            <div className={styles.campo}>
              <span className={styles.label}>Nivel *</span>
              <select
                className={styles.input}
                value={form.level_uuid}
                onChange={(e) => set("level_uuid", e.target.value)}
                required
              >
                <option value="">Selecciona un nivel…</option>
                {niveles.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SELECTOR DE ANIMAL */}
            <div className={styles.campo}>
              <span className={styles.label}>Animal del grupo *</span>
              <div className={styles.animalGrid}>
                {GRUPOS.map((g) => (
                  <div
                    key={g.name}
                    className={`${styles.animalOpt} ${form.icon_path === g.name ? styles.animalOptSel : ""}`}
                    onClick={() => seleccionarAnimal(g.name, g.color)}
                  >
                    <div
                      className={styles.animalBanner}
                      style={{ background: g.light }}
                    >
                      <g.Icon size={36} />
                      {form.icon_path === g.name && (
                        <div className={styles.checkMark}>
                          <MdCheck size={10} color="#FFF" />
                        </div>
                      )}
                    </div>
                    <span className={styles.animalNombre}>{g.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NOMBRE DEL GRUPO */}
            <div className={styles.campo}>
              <span className={styles.label}>Nombre del grupo *</span>
              <input
                className={styles.input}
                type="text"
                placeholder="ej. Maternal A, Grupo Azul…"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </div>

            {/* HORARIO */}
            <div className={styles.g2}>
              <div className={styles.campo}>
                <span className={styles.label}>Hora de entrada</span>
                <input
                  className={styles.input}
                  type="time"
                  value={form.entry_time}
                  onChange={(e) => set("entry_time", e.target.value)}
                />
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Hora de salida</span>
                <input
                  className={styles.input}
                  type="time"
                  value={form.dismissal_time}
                  onChange={(e) => set("dismissal_time", e.target.value)}
                />
              </div>
            </div>

            {/* CUOTA + CAPACIDAD */}
            <div className={styles.g2}>
              <div className={styles.campo}>
                <span className={styles.label}>Cuota mensual (MXN)</span>
                <input
                  className={styles.input}
                  type="number"
                  min={0}
                  placeholder="3000"
                  value={form.monthly_fee}
                  onChange={(e) => set("monthly_fee", e.target.value)}
                />
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Capacidad máx.</span>
                <input
                  className={styles.input}
                  type="number"
                  min={1}
                  placeholder="25"
                  value={form.capacity}
                  onChange={(e) =>
                    set("capacity", parseInt(e.target.value) || 1)
                  }
                />
              </div>
            </div>

            {/* COLOR */}
            <div className={styles.campo}>
              <span className={styles.label}>Color del grupo</span>
              <div className={styles.colorChips}>
                {GRUPOS.map((g) => (
                  <button
                    key={g.name}
                    type="button"
                    className={`${styles.colorChip} ${form.color === g.color ? styles.colorChipSel : ""}`}
                    style={{ background: g.color }}
                    onClick={() => set("color", g.color)}
                    title={g.name}
                  />
                ))}
              </div>
              <div className={styles.colorWrap}>
                <input
                  className={styles.colorInput}
                  type="color"
                  value={form.color}
                  onChange={(e) => set("color", e.target.value)}
                />
                <input
                  className={styles.colorHex}
                  value={form.color}
                  onChange={(e) => set("color", e.target.value)}
                  placeholder="#F5C800"
                  maxLength={7}
                />
              </div>
            </div>

            {/* ACTIVO */}
            <div className={styles.toggleRow}>
              <span className={styles.toggleLbl}>Grupo activo</span>
              <div
                className={`${styles.toggle} ${form.active ? styles.togOn : styles.togOff}`}
                onClick={() => set("active", !form.active)}
              >
                <div
                  className={`${styles.tThumb} ${form.active ? styles.onPos : styles.offPos}`}
                />
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={loading || !form.name || !form.level_uuid}
            >
              {loading
                ? "Guardando…"
                : grupo
                  ? "Guardar cambios"
                  : "Crear grupo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
