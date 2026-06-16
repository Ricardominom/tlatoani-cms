import { useEffect } from "react";
import styles from "./ModalNivel.module.css";
import ModalBase from "../../components/ui/ModalBase";
import { crearNivel, actualizarNivel } from "../../services/gruposService";
import { nivelFormSchema, type Nivel, type NivelFormData } from "../../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  nivel?: Nivel | null;
  onClose: () => void;
  onSuccess: () => void;
}

const initialValues: NivelFormData = {
  name: "",
  description: "",
};

export default function ModalNivel({ open, nivel, onClose, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<NivelFormData>({
    resolver: zodResolver(nivelFormSchema),
    defaultValues: initialValues
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (formData: NivelFormData) =>
      nivel ? actualizarNivel(nivel.id, formData) : crearNivel(formData),
    onSuccess: () => {
      toast.success(nivel ? "Nivel actualizado" : "Nivel creado");
      queryClient.invalidateQueries({ queryKey: ["niveles"] });
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      onSuccess();
    },
    onError: (error) => {
      setError("root", {
        message: error instanceof Error ? error.message : "Error inesperado"
      });
    }
  });

  useEffect(() => {
    if (nivel) {
      reset({
        name: nivel.name,
        description: nivel.description ?? "",
      });
    } else {
      reset(initialValues);
    }
  }, [nivel, open, reset]);

  const handleForm = (formData: NivelFormData) => mutate(formData);

  return (
    <ModalBase
      open={open}
      title={nivel ? "Editar nivel" : "Nuevo nivel"}
      onClose={onClose}
      onSubmit={handleSubmit(handleForm)}
      isPending={isPending}
      submitLabel={nivel ? "Guardar cambios" : "Crear nivel"}
    >
      {errors.root && <div className={styles.error}>{errors.root.message}</div>}

      <div className={styles.campo}>
        <span className={styles.label}>Nombre del nivel *</span>
        <input
          className={styles.input}
          placeholder="ej. Casa de niños"
          {...register("name")}
          required
        />
      </div>

      <div className={styles.campo}>
        <span className={styles.label}>Descripción</span>
        <textarea
          className={styles.textarea}
          placeholder="Descripción breve del nivel educativo…"
          {...register("description")}
        />
      </div>
    </ModalBase>
  );
}
