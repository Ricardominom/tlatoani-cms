import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ModalBase from "../../components/ui/ModalBase";
import styles from "./ModalAlumno.module.css";
import {
  alumnoFormSchema,
  type Alumno,
  type AlumnoFormData,
  type Grupo
} from "../../types";
import { crearAlumno, actualizarAlumno } from "../../services/alumnosService";

interface Props {
  open: boolean;
  alumno?: Alumno | null;
  grupos: Grupo[];
  defaultGroupUuid?: string;
  onClose: () => void;
  onSuccess: (alumno: Alumno) => void;
}

const initialValues: AlumnoFormData = {
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
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
    formState: { errors }
  } = useForm<AlumnoFormData>({
    resolver: zodResolver(alumnoFormSchema),
    defaultValues: initialValues
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (formData: AlumnoFormData) =>
      alumno ? actualizarAlumno(alumno.id, formData) : crearAlumno(formData),
    onSuccess: (alumnoGuardado) => {
      toast.success(alumno ? "Alumno actualizado" : "Alumno creado");
      queryClient.invalidateQueries({ queryKey: ["alumnos"] });
      onSuccess(alumnoGuardado);
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

  const active = useWatch({ control, name: "active" });

  useEffect(() => {
    if (alumno) {
      reset({
        group_uuid: alumno.group?.id ?? "",
        name: alumno.name,
        last_name: alumno.last_name,
        birth_date: alumno.birth_date.substring(0, 10),
        curp: alumno.curp,
        blood_type: alumno.blood_type ?? "",
        allergies: alumno.allergies ?? "",
        medicines: alumno.medicines ?? "",
        active: alumno.active
      });
    } else {
      reset({
        ...initialValues,
        group_uuid: defaultGroupUuid ?? grupos[0]?.id ?? ""
      });
    }
  }, [alumno, open, grupos, defaultGroupUuid, reset]);

  return (
    <ModalBase
      open={open}
      title={alumno ? "Editar alumno" : "Nuevo alumno"}
      onClose={onClose}
      onSubmit={handleSubmit((data) => mutate(data))}
      isPending={isPending}
      submitLabel={alumno ? "Guardar cambios" : "Crear alumno"}
    >
      {errors.root && <div className={styles.error}>{errors.root.message}</div>}

      <div className={styles.g2}>
        <div className={styles.campo}>
          <span className={styles.label}>Nombre *</span>
          <input
            className={styles.input}
            type="text"
            placeholder="ej. Sofía"
            {...register("name")}
          />
          {errors.name && (
            <span className={styles.errorField}>{errors.name.message}</span>
          )}
        </div>
        <div className={styles.campo}>
          <span className={styles.label}>Apellidos *</span>
          <input
            className={styles.input}
            type="text"
            placeholder="ej. Ramírez Mendoza"
            {...register("last_name")}
          />
          {errors.last_name && (
            <span className={styles.errorField}>
              {errors.last_name.message}
            </span>
          )}
        </div>
      </div>

      <div className={styles.g2}>
        <div className={styles.campo}>
          <span className={styles.label}>Fecha de nacimiento *</span>
          <input
            className={styles.input}
            type="date"
            {...register("birth_date")}
          />
        </div>
        <div className={styles.campo}>
          <span className={styles.label}>CURP *</span>
          <input
            className={styles.input}
            type="text"
            placeholder="ej. RASF201015..."
            {...register("curp")}
            onChange={(e) =>
              setValue("curp", e.target.value.toUpperCase(), {
                shouldValidate: true
              })
            }
            maxLength={18}
          />
          {errors.curp && (
            <span className={styles.errorField}>{errors.curp.message}</span>
          )}
        </div>
      </div>

      <div className={styles.campo}>
        <span className={styles.label}>Grupo</span>
        <select className={styles.input} {...register("group_uuid")}>
          <option value="">Sin grupo asignado</option>
          {grupos.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.campo}>
        <span className={styles.label}>Tipo de sangre</span>
        <input
          className={styles.input}
          type="text"
          placeholder="ej. O+, A-, AB+"
          {...register("blood_type")}
          maxLength={3}
        />
      </div>

      <div className={styles.campo}>
        <span className={styles.label}>Alergias</span>
        <textarea
          className={styles.textarea}
          placeholder="Describe las alergias conocidas…"
          {...register("allergies")}
        />
      </div>

      <div className={styles.campo}>
        <span className={styles.label}>Medicamentos</span>
        <textarea
          className={styles.textarea}
          placeholder="Medicamentos que toma regularmente…"
          {...register("medicines")}
        />
      </div>

      <div className={styles.toggleRow}>
        <span className={styles.toggleLbl}>Alumno activo</span>
        <div
          className={`${styles.toggle} ${active ? styles.togOn : styles.togOff}`}
          onClick={() => setValue("active", !active)}
        >
          <div
            className={`${styles.tThumb} ${active ? styles.onPos : styles.offPos}`}
          />
        </div>
      </div>
    </ModalBase>
  );
}
