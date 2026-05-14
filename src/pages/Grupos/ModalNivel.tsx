import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import styles from "./ModalNivel.module.css";
import { crearNivel, actualizarNivel } from "../../services/gruposService";
import type { Nivel, NivelFormData } from "../../types";

interface Props {
  open: boolean;
  nivel?: Nivel | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalNivel({ open, nivel, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<NivelFormData>({
    name: "",
    description: "",
    order: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (nivel) {
      setForm({
        name: nivel.name,
        description: nivel.description ?? "",
        order: nivel.order
      });
    } else {
      setForm({ name: "", description: "", order: 1 });
    }
    setError(null);
  }, [nivel, open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (nivel) {
        await actualizarNivel(nivel.id, form);
      } else {
        await crearNivel(form);
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
            {nivel ? "Editar nivel" : "Nuevo nivel"}
          </span>
          <button className={styles.closeBtn} type="button" onClick={onClose}>
            <MdClose size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.campo}>
              <span className={styles.label}>Nombre del nivel *</span>
              <input
                className={styles.input}
                placeholder="ej. Casa de niños"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </div>

            <div className={styles.campo}>
              <span className={styles.label}>Descripción</span>
              <textarea
                className={styles.textarea}
                placeholder="Descripción breve del nivel educativo…"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            <div className={styles.campo}>
              <span className={styles.label}>Orden de aparición *</span>
              <input
                className={styles.input}
                type="number"
                min={1}
                value={form.order}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    order: parseInt(e.target.value) || 1
                  }))
                }
                required
              />
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
              disabled={loading || !form.name.trim()}
            >
              {loading
                ? "Guardando…"
                : nivel
                  ? "Guardar cambios"
                  : "Crear nivel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
