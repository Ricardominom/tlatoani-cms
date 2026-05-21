import { MdClose } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import styles from "./ModalAlumno.module.css";
import {
  doctorInformationFormSchema,
  type DoctorInformation,
  type DoctorInformationFormData
} from "../../types";
import {
  crearDoctor,
  actualizarDoctor
} from "../../services/doctorInformationService";

interface Props {
  open: boolean;
  doctor?: DoctorInformation | null;
  alumnoUuid: string;
  onClose: () => void;
  onSuccess: (doctor: DoctorInformation) => void;
}

const initialValues: DoctorInformationFormData = {
  name: "",
  last_name: "",
  phone_number: "",
  clinic_name: "",
  clinic_address: ""
};

export default function ModalDoctor({
  open,
  doctor,
  alumnoUuid,
  onClose,
  onSuccess
}: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<DoctorInformationFormData>({
    resolver: zodResolver(doctorInformationFormSchema),
    defaultValues: doctor
      ? {
          name: doctor.name,
          last_name: doctor.last_name,
          phone_number: doctor.phone_number,
          clinic_name: doctor.clinic_name ?? "",
          clinic_address: doctor.clinic_address ?? ""
        }
      : initialValues
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: DoctorInformationFormData) =>
      doctor
        ? actualizarDoctor(alumnoUuid, doctor.id, formData)
        : crearDoctor(alumnoUuid, formData),
    onSuccess: (doctorGuardado) => {
      toast.success(doctor ? "Doctor actualizado" : "Doctor agregado");
      onSuccess(doctorGuardado);
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

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.titulo}>
            {doctor ? "Editar médico" : "Agregar médico"}
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
                  placeholder="ej. Carlos"
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
                  placeholder="ej. López Herrera"
                  {...register("last_name")}
                />
                {errors.last_name && (
                  <span className={styles.error}>
                    {errors.last_name.message}
                  </span>
                )}
              </div>
            </div>

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
              <span className={styles.label}>Consultorio / Clínica</span>
              <input
                className={styles.input}
                type="text"
                placeholder="ej. Clínica San Rafael"
                {...register("clinic_name")}
              />
            </div>

            <div className={styles.campo}>
              <span className={styles.label}>Dirección del consultorio</span>
              <textarea
                className={styles.textarea}
                placeholder="ej. Av. Juárez 123, Col. Centro"
                {...register("clinic_address")}
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
                : doctor
                  ? "Guardar cambios"
                  : "Agregar médico"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
