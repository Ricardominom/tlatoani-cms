import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import styles from "./ModalAlumno.module.css";
import type { ApiStudent, AlumnoForm } from "./types";
import type { ApiGroup } from "../Grupos/types";
import { crearAlumno, actualizarAlumno } from "../../services/alumnosService";

interface Props {
  open: boolean;
  alumno?: ApiStudent | null;
  grupos: ApiGroup[];
  defaultGroupUuid?: string;
  onClose: () => void;
  onSuccess: (alumno: ApiStudent) => void;
}

const FORM_VACIO: AlumnoForm = {
  group_uuid: "",
  name: "",
  last_name: "",
  birth_date: "",
  curp: "",
  blood_type: "",
  allergies: "",
  medicines: "",
  active: true
};

export default function ModalAlumno({
  open,
  alumno,
  grupos,
  defaultGroupUuid,
  onClose,
  onSuccess
}: Props) {
  const [form, setForm] = useState<AlumnoForm>(FORM_VACIO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (alumno) {
      setForm({
        group_uuid: alumno.group?.id ?? "",
        name: alumno.name,
        last_name: alumno.last_name,
        birth_date: alumno.birth_date,
        curp: alumno.curp,
        blood_type: alumno.blood_type ?? "",
        allergies: alumno.allergies ?? "",
        medicines: alumno.medicines ?? "",
        active: alumno.active
      });
    } else {
      setForm({
        ...FORM_VACIO,
        group_uuid: defaultGroupUuid ?? grupos[0]?.id ?? ""
      });
    }
    setError(null);
  }, [alumno, open, grupos, defaultGroupUuid]);

  if (!open) return null;

  const set = <K extends keyof AlumnoForm>(key: K, val: AlumnoForm[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const alumnoGuardado = alumno
        ? await actualizarAlumno(alumno.id, form)
        : await crearAlumno(form);
      onSuccess(alumnoGuardado);
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
            {alumno ? "Editar alumno" : "Nuevo alumno"}
          </span>
          <button className={styles.closeBtn} type="button" onClick={onClose}>
            <MdClose size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.body}>
            {error && <div className={styles.error}>{error}</div>}

            {/* NOMBRE Y APELLIDOS */}
            <div className={styles.g2}>
              <div className={styles.campo}>
                <span className={styles.label}>Nombre *</span>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="ej. Sofía"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                />
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Apellidos *</span>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="ej. Ramírez Mendoza"
                  value={form.last_name}
                  onChange={(e) => set("last_name", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* FECHA DE NACIMIENTO Y CURP */}
            <div className={styles.g2}>
              <div className={styles.campo}>
                <span className={styles.label}>Fecha de nacimiento *</span>
                <input
                  className={styles.input}
                  type="date"
                  value={form.birth_date}
                  onChange={(e) => set("birth_date", e.target.value)}
                  required
                />
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>CURP *</span>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="ej. RASF201015..."
                  value={form.curp}
                  onChange={(e) => set("curp", e.target.value.toUpperCase())}
                  maxLength={18}
                  required
                />
              </div>
            </div>

            {/* GRUPO */}
            <div className={styles.campo}>
              <span className={styles.label}>Grupo</span>
              <select
                className={styles.input}
                value={form.group_uuid}
                onChange={(e) => set("group_uuid", e.target.value)}
              >
                <option value="">Sin grupo asignado</option>
                {grupos.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TIPO DE SANGRE */}
            <div className={styles.campo}>
              <span className={styles.label}>Tipo de sangre</span>
              <input
                className={styles.input}
                type="text"
                placeholder="ej. O+, A-, AB+"
                value={form.blood_type}
                onChange={(e) => set("blood_type", e.target.value)}
                maxLength={3}
              />
            </div>

            {/* ALERGIAS */}
            <div className={styles.campo}>
              <span className={styles.label}>Alergias</span>
              <textarea
                className={styles.textarea}
                placeholder="Describe las alergias conocidas…"
                value={form.allergies}
                onChange={(e) => set("allergies", e.target.value)}
              />
            </div>

            {/* MEDICAMENTOS */}
            <div className={styles.campo}>
              <span className={styles.label}>Medicamentos</span>
              <textarea
                className={styles.textarea}
                placeholder="Medicamentos que toma regularmente…"
                value={form.medicines}
                onChange={(e) => set("medicines", e.target.value)}
              />
            </div>

            {/* ACTIVO */}
            <div className={styles.toggleRow}>
              <span className={styles.toggleLbl}>Alumno activo</span>
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
              disabled={
                loading ||
                !form.name ||
                !form.last_name ||
                !form.birth_date ||
                !form.curp
              }
            >
              {loading
                ? "Guardando…"
                : alumno
                  ? "Guardar cambios"
                  : "Crear alumno"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
