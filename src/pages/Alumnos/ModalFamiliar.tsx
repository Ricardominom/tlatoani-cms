import { MdClose } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import styles from "./ModalAlumno.module.css";
import {
  familyMemberAttachFormSchema,
  type FamilyMember,
  type FamilyMemberAttachFormData
} from "../../types";
import { getUsuarios } from "../../services/usuariosService";
import {
  attachFamilyMember,
  actualizarFamilyMember
} from "../../services/familyMembersService";

interface Props {
  open: boolean;
  familiar?: FamilyMember | null;
  alumnoUuid: string;
  familialesActuales: FamilyMember[];
  onClose: () => void;
  onSuccess: (familiar: FamilyMember) => void;
}

const initialValues: FamilyMemberAttachFormData = {
  user_uuid: "",
  relationship: "",
  primary_contact: false
};

export default function ModalFamiliar({
  open,
  familiar,
  alumnoUuid,
  familialesActuales,
  onClose,
  onSuccess
}: Props) {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors }
  } = useForm<FamilyMemberAttachFormData>({
    resolver: zodResolver(familyMemberAttachFormSchema),
    defaultValues: familiar
      ? {
          user_uuid: familiar.id,
          relationship: familiar.pivot.relationship,
          primary_contact: familiar.pivot.primary_contact
        }
      : initialValues
  });

  const primaryContact = useWatch({ control, name: "primary_contact" });

  const { data: usuariosRes, isLoading: cargandoUsuarios } = useQuery({
    queryKey: ["usuarios-family"],
    queryFn: () =>
      getUsuarios({
        role: "family",
        per_page: 100,
        order_by: "last_name",
        order_direction: "asc"
      }),
    enabled: !familiar && open
  });

  const disponibles = (usuariosRes?.data ?? []).filter(
    (u) => !familialesActuales.some((f) => f.id === u.id)
  );

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FamilyMemberAttachFormData) =>
      familiar
        ? actualizarFamilyMember(alumnoUuid, familiar.id, {
            relationship: formData.relationship,
            primary_contact: formData.primary_contact
          })
        : attachFamilyMember(alumnoUuid, formData),
    onSuccess: (familiarGuardado) => {
      toast.success(familiar ? "Familiar actualizado" : "Familiar agregado");
      onSuccess(familiarGuardado);
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
            {familiar ? "Editar familiar" : "Agregar familiar"}
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

            {familiar ? (
              <div className={styles.campo}>
                <span className={styles.label}>Usuario</span>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "var(--texto)",
                    padding: "8px 0"
                  }}
                >
                  {familiar.name} {familiar.last_name}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--texto-3)",
                      marginLeft: 8
                    }}
                  >
                    {familiar.email}
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles.campo}>
                <span className={styles.label}>Usuario *</span>
                {cargandoUsuarios ? (
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--texto-3)",
                      padding: "8px 0"
                    }}
                  >
                    Cargando usuarios…
                  </div>
                ) : disponibles.length === 0 ? (
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--texto-3)",
                      padding: "8px 0"
                    }}
                  >
                    No hay usuarios disponibles con rol "familiar"
                  </div>
                ) : (
                  <select className={styles.input} {...register("user_uuid")}>
                    <option value="">Selecciona un usuario…</option>
                    {disponibles.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.last_name}, {u.name} — {u.email}
                      </option>
                    ))}
                  </select>
                )}
                {errors.user_uuid && (
                  <span className={styles.error}>
                    {errors.user_uuid.message}
                  </span>
                )}
              </div>
            )}

            <div className={styles.campo}>
              <span className={styles.label}>Relación *</span>
              <input
                className={styles.input}
                type="text"
                placeholder="ej. Madre, Padre, Tutor"
                {...register("relationship")}
              />
              {errors.relationship && (
                <span className={styles.error}>
                  {errors.relationship.message}
                </span>
              )}
            </div>

            <div className={styles.campo}>
              <span className={styles.label}>Contacto principal</span>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  marginTop: 4
                }}
              >
                <input type="checkbox" {...register("primary_contact")} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: primaryContact ? "var(--texto)" : "var(--texto-3)"
                  }}
                >
                  {primaryContact
                    ? "Sí, es el contacto principal"
                    : "No es el contacto principal"}
                </span>
              </label>
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
                : familiar
                  ? "Guardar cambios"
                  : "Agregar familiar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
