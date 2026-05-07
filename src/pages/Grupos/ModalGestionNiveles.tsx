import { useState, useEffect } from "react";
import { MdClose, MdEdit, MdDelete, MdAdd } from "react-icons/md";
import styles from "./ModalGestionNiveles.module.css";
import type { ApiLevel, NivelForm } from "./types";
import {
  crearNivel,
  actualizarNivel,
  eliminarNivel
} from "../../services/gruposService";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

interface Props {
  open: boolean;
  niveles: ApiLevel[];
  onClose: () => void;
  onSuccess: (niveles: ApiLevel[]) => void;
}

const FORM_VACIO: NivelForm = { name: "", description: "", order: 1 };

export default function ModalGestionNiveles({
  open,
  niveles,
  onClose,
  onSuccess
}: Props) {
  const [editando, setEditando] = useState<ApiLevel | "nuevo" | null>(null);
  const [form, setForm] = useState<NivelForm>(FORM_VACIO);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState<string | null>(null);
  const [nivelAEliminar, setNivelAEliminar] = useState<ApiLevel | null>(null);

  useEffect(() => {
    if (!open) setEditando(null);
  }, [open]);

  useEffect(() => {
    if (editando === "nuevo") {
      setForm({ ...FORM_VACIO, order: niveles.length + 1 });
    } else if (editando !== null) {
      setForm({
        name: editando.name,
        description: editando.description ?? "",
        order: editando.order
      });
    }
    setFormError(null);
  }, [editando]);

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (editando === "nuevo") {
        const nuevo = await crearNivel(form);
        onSuccess([...niveles, nuevo]);
      } else if (editando !== null) {
        const actualizando = await actualizarNivel(editando.id, form);
        onSuccess(
          niveles.map((n) => (n.id === editando.id ? actualizando : n))
        );
      }
      setEditando(null);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleEliminar() {
    if (!nivelAEliminar) return;
    setEliminando(nivelAEliminar.id);
    setNivelAEliminar(null);
    try {
      await eliminarNivel(nivelAEliminar.id);
      onSuccess(niveles.filter((n) => n.id !== nivelAEliminar.id));
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "No se pudo eliminar el nivel."
      );
    } finally {
      setEliminando(null);
    }
  }

  function toggleEditar(nivel: ApiLevel) {
    const yaEditando =
      editando !== "nuevo" && editando !== null && editando.id === nivel.id;
    setEditando(yaEditando ? null : nivel);
  }

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.titulo}>Gestionar niveles</span>
          <button className={styles.closeBtn} type="button" onClick={onClose}>
            <MdClose size={16} />
          </button>
        </div>

        <div className={styles.body}>
          {niveles.length === 0 ? (
            <div className={styles.empty}>No hay niveles creados aún</div>
          ) : (
            niveles.map((n) => {
              const isEditing =
                editando !== "nuevo" &&
                editando !== null &&
                editando.id === n.id;
              return (
                <div key={n.id}>
                  <div className={styles.nivelRow}>
                    <div className={styles.nivelOrden}>{n.order}</div>
                    <div className={styles.nivelInfo}>
                      <span className={styles.nivelNombre}>{n.name}</span>
                      {n.description && (
                        <span className={styles.nivelDesc}>
                          {n.description}
                        </span>
                      )}
                    </div>
                    <div className={styles.nivelAcciones}>
                      <button
                        className={styles.btnAcc}
                        onClick={() => toggleEditar(n)}
                        title="Editar"
                      >
                        <MdEdit size={13} />
                      </button>
                      <button
                        className={`${styles.btnAcc} ${styles.btnDel}`}
                        onClick={() => setNivelAEliminar(n)}
                        disabled={eliminando === n.id}
                        title="Eliminar"
                      >
                        <MdDelete size={13} />
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <form
                      className={styles.inlineForm}
                      onSubmit={handleGuardar}
                    >
                      {formError && (
                        <div className={styles.error}>{formError}</div>
                      )}
                      <div className={styles.campo}>
                        <span className={styles.label}>Nombre *</span>
                        <input
                          className={styles.input}
                          value={form.name}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                          }
                          autoFocus
                          required
                        />
                      </div>
                      <div className={styles.campo}>
                        <span className={styles.label}>Descripción</span>
                        <input
                          className={styles.input}
                          value={form.description}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              description: e.target.value
                            }))
                          }
                        />
                      </div>
                      <div className={styles.campo}>
                        <span className={styles.label}>Orden</span>
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
                        />
                      </div>
                      <div className={styles.inlineFooter}>
                        <button
                          type="button"
                          className={styles.btnCancel}
                          onClick={() => setEditando(null)}
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className={styles.btnSubmit}
                          disabled={saving || !form.name.trim()}
                        >
                          {saving ? "Guardando…" : "Guardar cambios"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              );
            })
          )}

          {editando === "nuevo" && (
            <form className={styles.inlineForm} onSubmit={handleGuardar}>
              {formError && <div className={styles.error}>{formError}</div>}
              <div className={styles.campo}>
                <span className={styles.label}>Nombre *</span>
                <input
                  className={styles.input}
                  placeholder="ej. Preescolar"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  autoFocus
                  required
                />
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Descripción</span>
                <input
                  className={styles.input}
                  placeholder="Descripción breve…"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Orden</span>
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
                />
              </div>
              <div className={styles.inlineFooter}>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => setEditando(null)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.btnSubmit}
                  disabled={saving || !form.name.trim()}
                >
                  {saving ? "Guardando…" : "Crear nivel"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.btnAgregar}
            type="button"
            onClick={() => setEditando(editando === "nuevo" ? null : "nuevo")}
          >
            <MdAdd size={14} />
            {editando === "nuevo" ? "Cancelar nuevo nivel" : "Agregar nivel"}
          </button>
        </div>
      </div>
      <ConfirmDialog
        open={nivelAEliminar !== null}
        titulo="Eliminar nivel"
        mensaje={`¿Seguro que quieres eliminar "${nivelAEliminar?.name}"? Los grupos de este nivel quedarán sin nivel asignado.`}
        onConfirm={handleEliminar}
        onCancel={() => setNivelAEliminar(null)}
      />
    </div>
  );
}
