import { useEffect } from "react";
import { MdClose, MdCheck } from "react-icons/md";
import styles from "./ModalGrupo.module.css";
import { GRUPOS } from "../../components/ui/AnimalKit";
import { crearGrupo, actualizarGrupo } from "../../services/gruposService";
import { grupoFormSchema, type Grupo, type GrupoFormData, type Nivel } from "../../types";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  grupo?: Grupo | null;
  niveles: Nivel[];
  onClose: () => void;
  onSuccess: (grupoId: string) => void;
}

const initialValues: GrupoFormData = {
  level_uuid: "",
  name: "",
  color: "#F5C800",
  icon_path: null,
  entry_time: "08:00",
  dismissal_time: "13:00",
  monthly_fee: "3000",
  capacity: 25,
  active: true
};

export default function ModalGrupo({
  open,
  grupo,
  niveles,
  onClose,
  onSuccess
}: Props) {

  const { register, handleSubmit, reset, setError, setValue, control, formState: { errors } } = useForm<GrupoFormData>({resolver: zodResolver(grupoFormSchema), defaultValues: initialValues});

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (formData: GrupoFormData) =>
      grupo ? actualizarGrupo(grupo.id, formData) : crearGrupo(formData),
    onSuccess: (grupoGuardado) => {
      toast.success(grupo ? "Grupo actualizado" : "Grupo creado");
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      onSuccess(grupoGuardado.id);
    },
    onError: (error) => {
      setError("root", {
        message: error instanceof Error ? error.message : "Ocurrió un error inesperado."
      });
    }
  });

  const iconPath = useWatch({control, name: 'icon_path'});
  const color = useWatch({control, name: 'color'});
  const active = useWatch({control, name: 'active'});

  useEffect(() => {
    if (grupo) {
      reset({
        level_uuid: grupo.level?.id ?? "",
        name: grupo.name,
        color: grupo.color,
        icon_path: grupo.icon_path,
        entry_time: grupo.entry_time?.slice(0, 5) ?? "08:00",
        dismissal_time: grupo.dismissal_time?.slice(0, 5) ?? "13:00",
        monthly_fee: grupo.monthly_fee,
        capacity: grupo.capacity,
        active: grupo.active
      });
    } else {
      reset({ ...initialValues, level_uuid: niveles[0]?.id ?? "" });
    }
  }, [grupo, open, niveles, reset]);

  if (!open) return null;

  function seleccionarAnimal(nombre: string) {
    if (iconPath === nombre) {
      setValue('icon_path', null);
    } else {
      const animal = GRUPOS.find((g) => g.name === nombre);
      setValue('icon_path', nombre);
      setValue('color', animal?.color ?? color);
    }
  }

  const handleForm = ( formData : GrupoFormData) => mutate(formData);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.titulo}>
            {grupo ? "Editar grupo" : "Nuevo grupo"}
          </span>
          <button className={styles.closeBtn} type="button" onClick={onClose}>
            <MdClose size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleForm)} className={styles.form}>
          <div className={styles.body}>
            {errors.root && <div className={styles.error}>{errors.root.message}</div>}

            {/* NIVEL */}
            <div className={styles.campo}>
              <span className={styles.label}>Nivel *</span>
              <select
                className={styles.input}
                {...register('level_uuid')}
                required
              >
                <option value="">Selecciona un nivel…</option>
                {niveles.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SELECTOR DE ANIMAL */}
            <div className={styles.campo}>
              <span className={styles.label}>Animal del grupo *</span>
              <div className={styles.animalGrid}>
                {GRUPOS.map((g) => (
                  <div
                    key={g.name}
                    className={`${styles.animalOpt} ${iconPath === g.name ? styles.animalOptSel : ""}`}
                    onClick={() => seleccionarAnimal(g.name)}
                  >
                    <div
                      className={styles.animalBanner}
                      style={{ background: g.light }}
                    >
                      <g.Icon size={36} />
                      {iconPath === g.name && (
                        <div className={styles.checkMark}>
                          <MdCheck size={10} color="#FFF" />
                        </div>
                      )}
                    </div>
                    <span className={styles.animalNombre}>{g.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NOMBRE DEL GRUPO */}
            <div className={styles.campo}>
              <span className={styles.label}>Nombre del grupo *</span>
              <input
                className={styles.input}
                type="text"
                placeholder="ej. Maternal A, Grupo Azul…"
                {...register('name')}
                required
              />
            </div>

            {/* HORARIO */}
            <div className={styles.g2}>
              <div className={styles.campo}>
                <span className={styles.label}>Hora de entrada</span>
                <input
                  className={styles.input}
                  type="time"
                  {...register('entry_time')}
                />
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Hora de salida</span>
                <input
                  className={styles.input}
                  type="time"
                  {...register('dismissal_time')}
                />
              </div>
            </div>

            {/* CUOTA + CAPACIDAD */}
            <div className={styles.g2}>
              <div className={styles.campo}>
                <span className={styles.label}>Cuota mensual (MXN)</span>
                <input
                  className={styles.input}
                  type="number"
                  min={0}
                  placeholder="3000"
                  {...register('monthly_fee')}
                />
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Capacidad máx.</span>
                <input
                  className={styles.input}
                  type="number"
                  min={1}
                  placeholder="25"
                  {...register('capacity', { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* COLOR */}
            <div className={styles.campo}>
              <span className={styles.label}>Color del grupo</span>
              <div className={styles.colorChips}>
                {GRUPOS.map((g) => (
                  <button
                    key={g.name}
                    type="button"
                    className={`${styles.colorChip} ${color === g.color ? styles.colorChipSel : ""}`}
                    style={{ background: g.color }}
                    onClick={() => setValue("color", g.color)}
                    title={g.name}
                  />
                ))}
              </div>
              <div className={styles.colorWrap}>
                <input
                  className={styles.colorInput}
                  type="color"
                  value={color}
                  onChange={(e) => setValue("color", e.target.value)}
                />
                <input
                  className={styles.colorHex}
                  value={color}
                  onChange={(e) => setValue("color", e.target.value)}
                  placeholder="#F5C800"
                  maxLength={7}
                />
              </div>
            </div>

            {/* ACTIVO */}
            <div className={styles.toggleRow}>
              <span className={styles.toggleLbl}>Grupo activo</span>
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
                : grupo
                  ? "Guardar cambios"
                  : "Crear grupo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
