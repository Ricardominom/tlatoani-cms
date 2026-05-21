import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import styles from "./ModalAlumno.module.css";
import {
  emergencyContactFormSchema,
  type EmergencyContact,
  type EmergencyContactFormData
} from "../../types";
import {
  crearEmergencyContact,
  actualizarEmergencyContact
} from "../../services/emergencyContactsService";

interface Props {
  open: boolean;
  contacto?: EmergencyContact | null;
  alumnoUuid: string;
  onClose: () => void;
  onSuccess: (contacto: EmergencyContact) => void;
}

const initialValues: EmergencyContactFormData = {
  name: "",
  last_name: "",
  phone_number: "",
  relationship: ""
};

export default function ModalContactoEmergencia({
  open,
  contacto,
  alumnoUuid,
  onClose,
  onSuccess
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<EmergencyContactFormData>({
    resolver: zodResolver(emergencyContactFormSchema),
    defaultValues: initialValues
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (formData: EmergencyContactFormData) =>
      contacto
        ? actualizarEmergencyContact(alumnoUuid, contacto.id, formData)
        : crearEmergencyContact(alumnoUuid, formData),
    onSuccess: (contactoGuardado) => {
      toast.success(contacto ? "Contacto actualizado" : "Contacto agregado");
      queryClient.invalidateQueries({
        queryKey: ["emergency-contacts", alumnoUuid]
      });
      onSuccess(contactoGuardado);
    },
    onError: (error) => {
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado."
      });
    }
  });

  useEffect(() => {
    if (contacto) {
      reset({
        name: contacto.name,
        last_name: contacto.last_name,
        phone_number: contacto.phone_number,
        relationship: contacto.relationship
      });
    } else {
      reset(initialValues);
    }
  }, [contacto, open, reset]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.titulo}>
            {contacto ? "Editar contacto" : "Nuevo contacto de emergencia"}
          </span>
          <button className={styles.closeBtn} type="button" onClick={onClose}>
            <MdClose size={16} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((data) => mutate(data))}
          className={styles.form}
        >
          <div className={styles.body}>
            {errors.root && (
              <div className={styles.error}>{errors.root.message}</div>
            )}

            <div className={styles.g2}>
              <div className={styles.campo}>
                <span className={styles.label}>Nombre *</span>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="ej. Juan"
                  {...register("name")}
                />
                {errors.name && (
                  <span className={styles.error}>{errors.name.message}</span>
                )}
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Apellidos *</span>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="ej. García López"
                  {...register("last_name")}
                />
                {errors.last_name && (
                  <span className={styles.error}>
                    {errors.last_name.message}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.g2}>
              <div className={styles.campo}>
                <span className={styles.label}>Teléfono *</span>
                <input
                  className={styles.input}
                  type="tel"
                  placeholder="ej. 5512345678"
                  maxLength={13}
                  {...register("phone_number")}
                />
                {errors.phone_number && (
                  <span className={styles.error}>
                    {errors.phone_number.message}
                  </span>
                )}
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Relación *</span>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="ej. Abuela, Tío, Vecino"
                  {...register("relationship")}
                />
                {errors.relationship && (
                  <span className={styles.error}>
                    {errors.relationship.message}
                  </span>
                )}
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
              disabled={isPending}
            >
              {isPending
                ? "Guardando…"
                : contacto
                  ? "Guardar cambios"
                  : "Agregar contacto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
