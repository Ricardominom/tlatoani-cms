import { useState, useEffect } from "react";
import { MdClose, MdEdit, MdDelete, MdAdd } from "react-icons/md";
import styles from "./ModalGestionNiveles.module.css";
import {
  crearNivel,
  actualizarNivel,
  eliminarNivel
} from "../../services/gruposService";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { nivelFormSchema, type Nivel, type NivelFormData } from "../../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  niveles: Nivel[];
  onClose: () => void;
  onSuccess: () => void;
}

const initialValues : NivelFormData = {
    name: "",
    description: "",
    order: 1
}

export default function ModalGestionNiveles({ open, niveles, onClose, onSuccess }: Props) {

  const [editando, setEditando] = useState<Nivel | "nuevo" | null>(null);
  const [nivelAEliminar, setNivelAEliminar] = useState<Nivel | null>(null);
  const [eliminarError, setEliminarError] = useState<string | null>(null);

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm({ resolver: zodResolver(nivelFormSchema), defaultValues: initialValues });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (formData: NivelFormData) => {
      if (editando === 'nuevo') return crearNivel(formData);
      if (editando !== null) return actualizarNivel(editando.id, formData);
      return Promise.reject(new Error("Estado inválido"));
    },
    onSuccess: () => {
      toast.success(editando === 'nuevo' ? "Nivel creado" : "Nivel actualizado");
      queryClient.invalidateQueries({ queryKey: ["niveles"] });
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      setEditando(null);
      onSuccess();
    },
    onError: (error) => {
      setError("root", {
        message: error instanceof Error ? error.message : "Ocurrió un error inesperado."
      });
    }
  });
  const { mutate: mutateEliminar, isPending: eliminandoPending, variables: eliminandoId } = useMutation({
    mutationFn: (uuid: string) => eliminarNivel(uuid),
    onSuccess: () => {
      toast.success("Nivel eliminado");
      queryClient.invalidateQueries({ queryKey: ["niveles"] });
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      onSuccess();
    },
    onError: (error) => {
      setEliminarError(
        error instanceof Error ? error.message : "No se pudo eliminar el nivel."
      );
    }
  });

  useEffect(() => {
    if(editando === 'nuevo') {
      reset({ ...initialValues, order: niveles.length + 1 });
    } else if(editando !== null) {
      reset({
        name: editando.name,
        description: editando.description ?? "",
        order: editando.order
      })
    }
  }, [editando, niveles.length, reset]);

  const handleGuardar = (formData: NivelFormData) => mutate(formData); 

  function handleEliminar() {
    if(!nivelAEliminar) return;
    mutateEliminar(nivelAEliminar.id);
    setNivelAEliminar(null);
  }

  function toggleEditar(nivel: Nivel) {
    const yaEditando =
      editando !== "nuevo" && editando !== null && editando.id === nivel.id;
    setEditando(yaEditando ? null : nivel);
  }

  function handleCerrar() {
    setEditando(null);
    onClose();
  }

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={handleCerrar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.titulo}>Gestionar niveles</span>
          <button className={styles.closeBtn} type="button" onClick={handleCerrar}>
            <MdClose size={16} />
          </button>
        </div>

        <div className={styles.body}>
          {eliminarError && (
            <div className={styles.error}>{eliminarError}</div>
          )}
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
                        disabled={eliminandoPending && eliminandoId === n.id}
                        title="Eliminar"
                      >
                        <MdDelete size={13} />
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <form
                      className={styles.inlineForm}
                      onSubmit={handleSubmit(handleGuardar)}
                    >
                      {errors.root && (
                        <div className={styles.error}>{errors.root.message}</div>
                      )}
                      <div className={styles.campo}>
                        <span className={styles.label}>Nombre *</span>
                        <input
                          className={styles.input}
                          {...register('name')}
                          autoFocus
                          required
                        />
                      </div>
                      <div className={styles.campo}>
                        <span className={styles.label}>Descripción</span>
                        <input
                          className={styles.input}
                          {...register('description')}
                        />
                      </div>
                      <div className={styles.campo}>
                        <span className={styles.label}>Orden</span>
                        <input
                          className={styles.input}
                          type="number"
                          min={1}
                          {...register('order', { valueAsNumber: true })}
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
                          disabled={isPending}
                        >
                          {isPending ? "Guardando…" : "Guardar cambios"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              );
            })
          )}

          {editando === "nuevo" && (
            <form className={styles.inlineForm} onSubmit={handleSubmit(handleGuardar)}>
              {errors.root && <div className={styles.error}>{errors.root.message}</div>}
              <div className={styles.campo}>
                <span className={styles.label}>Nombre *</span>
                <input
                  className={styles.input}
                  placeholder="ej. Preescolar"
                  {...register('name')}
                  autoFocus
                  required
                />
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Descripción</span>
                <input
                  className={styles.input}
                  placeholder="Descripción breve…"
                  {...register('description')}
                />
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Orden</span>
                <input
                  className={styles.input}
                  type="number"
                  min={1}
                  {...register('order', { valueAsNumber: true })}
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
                  disabled={isPending}
                >
                  {isPending ? "Guardando…" : "Crear nivel"}
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
