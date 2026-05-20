import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import styles from "./ModalUsuario.module.css";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  usuarioCreateFormSchema,
  usuarioUpdateFormSchema,
  ROLES_USUARIO,
  type Usuario,
  type UsuarioFormData
} from "../../types";
import {
  crearUsuario,
  actualizarUsuario
} from "../../services/usuariosService";

interface Props {
  open: boolean;
  usuario?: Usuario | null;
  onClose: () => void;
  onSuccess: (usuario: Usuario) => void;
}

const ROLE_LABEL: Record<(typeof ROLES_USUARIO)[number], string> = {
  superadmin: "Super administrador",
  admin: "Administrador",
  teacher: "Maestro",
  family: "Familia"
};

const initialValues: UsuarioFormData = {
  name: "",
  last_name: "",
  email: "",
  password: "",
  password_confirmation: "",
  phone_number: "",
  role: "admin",
  active: true
};

export default function ModalUsuario({
  open,
  usuario,
  onClose,
  onSuccess
}: Props) {
  const esEdicion = !!usuario;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
    formState: { errors }
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(
      esEdicion ? usuarioUpdateFormSchema : usuarioCreateFormSchema
    ),
    defaultValues: initialValues
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (formData: UsuarioFormData) =>
      usuario
        ? actualizarUsuario(usuario.id, formData)
        : crearUsuario(formData),
    onSuccess: (usuarioGuardado) => {
      toast.success(usuario ? "Usuario actualizado" : "Usuario creado");
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      onSuccess(usuarioGuardado);
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
    if (usuario) {
      reset({
        name: usuario.name,
        last_name: usuario.last_name,
        email: usuario.email,
        password: "",
        password_confirmation: "",
        phone_number: usuario.phone_number ?? "",
        role: usuario.role,
        active: usuario.active
      });
    } else {
      reset(initialValues);
    }
  }, [usuario, open, reset]);

  if (!open) return null;

  const handleForm = (formData: UsuarioFormData) => mutate(formData);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.titulo}>
            {esEdicion ? "Editar usuario" : "Nuevo usuario"}
          </span>
          <button className={styles.closeBtn} type="button" onClick={onClose}>
            <MdClose size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleForm)} className={styles.form}>
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
                  placeholder="ej. María"
                  {...register("name")}
                />
                {errors.name && (
                  <span className={styles.fieldErr}>{errors.name.message}</span>
                )}
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Apellidos *</span>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="ej. González López"
                  {...register("last_name")}
                />
                {errors.last_name && (
                  <span className={styles.fieldErr}>
                    {errors.last_name.message}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.g2}>
              <div className={styles.campo}>
                <span className={styles.label}>Correo *</span>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="usuario@correo.com"
                  {...register("email")}
                />
                {errors.email && (
                  <span className={styles.fieldErr}>
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Teléfono</span>
                <input
                  className={styles.input}
                  type="tel"
                  placeholder="ej. 5512345678"
                  maxLength={13}
                  {...register("phone_number")}
                />
                {errors.phone_number && (
                  <span className={styles.fieldErr}>
                    {errors.phone_number.message}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.g2}>
              <div className={styles.campo}>
                <span className={styles.label}>
                  {esEdicion ? "Password (vacío = sin cambios)" : "Password *"}
                </span>
                <input
                  className={styles.input}
                  type="password"
                  placeholder={esEdicion ? "••••••••" : "Mínimo 8 caracteres"}
                  autoComplete="new-password"
                  {...register("password")}
                />
                {errors.password && (
                  <span className={styles.fieldErr}>
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>
                  {esEdicion ? "Confirmar password" : "Confirmar password *"}
                </span>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="Repite el password"
                  autoComplete="new-password"
                  {...register("password_confirmation")}
                />
                {errors.password_confirmation && (
                  <span className={styles.fieldErr}>
                    {errors.password_confirmation.message}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.campo}>
              <span className={styles.label}>Rol *</span>
              <select className={styles.input} {...register("role")}>
                {ROLES_USUARIO.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </option>
                ))}
              </select>
              {errors.role && (
                <span className={styles.fieldErr}>{errors.role.message}</span>
              )}
            </div>

            <div className={styles.toggleRow}>
              <span className={styles.toggleLbl}>Usuario activo</span>
              <div
                className={`${styles.toggle} ${active ? styles.togOn : styles.togOff}`}
                onClick={() => setValue("active", !active)}
              >
                <div
                  className={`${styles.tThumb} ${active ? styles.onPos : styles.offPos}`}
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
              disabled={isPending}
            >
              {isPending
                ? "Guardando…"
                : esEdicion
                  ? "Guardar cambios"
                  : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
