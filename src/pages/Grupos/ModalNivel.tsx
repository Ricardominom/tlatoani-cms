import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import styles from "./ModalNivel.module.css";
import { crearNivel, actualizarNivel } from "../../services/gruposService";
import { nivelFormSchema, type Nivel, type NivelFormData } from "../../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  nivel?: Nivel | null;
  onClose: () => void;
  onSuccess: () => void;
}

const initialValues : NivelFormData = {
    name: "",
    description: "",
    order: 1
}

export default function ModalNivel({ open, nivel, onClose, onSuccess }: Props) {

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<NivelFormData>({ resolver: zodResolver(nivelFormSchema), defaultValues: initialValues});

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (FormData: NivelFormData) =>
      nivel ? actualizarNivel(nivel.id, FormData) : crearNivel(FormData),
    onSuccess: () => {
      toast.success(nivel ? 'Nivel actualizado' : 'Nivel creado');
      queryClient.invalidateQueries({ queryKey: ['niveles']});
      queryClient.invalidateQueries({ queryKey: ['grupos']});
      onSuccess();
    },
    onError: (error) => {
      setError('root', { message: error instanceof Error ? error.message : 'Error inesperado'});
    }
  });

  useEffect(() => {
    if (nivel) {
      reset ({ name: nivel.name, description: nivel.description ?? "", order: nivel.order })
    } else {
      reset(initialValues);
    }
  }, [nivel, open, reset]);

  const handleForm = (formData: NivelFormData) => mutate(formData);

  if (!open) return null;

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

        <form onSubmit={handleSubmit(handleForm)}>
          <div className={styles.body}>
            {errors.root && <div className={styles.error}>{errors.root.message}</div>}

            <div className={styles.campo}>
              <span className={styles.label}>Nombre del nivel *</span>
              <input
                className={styles.input}
                placeholder="ej. Casa de niños"
                {...register('name')}
                required
              />
            </div>

            <div className={styles.campo}>
              <span className={styles.label}>Descripción</span>
              <textarea
                className={styles.textarea}
                placeholder="Descripción breve del nivel educativo…"
                {...register('description')}
              />
            </div>

            <div className={styles.campo}>
              <span className={styles.label}>Orden de aparición *</span>
              <input
                className={styles.input}
                type="number"
                min={1}
                {...register('order', { valueAsNumber: true })}
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
              disabled={isPending}
            >
              {isPending
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
