import { type ReactNode } from "react";
import { MdClose } from "react-icons/md";
import styles from "./ModalBase.module.css";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  isPending: boolean;
  submitLabel?: string;
  children: ReactNode;
  width?: number;
}

export default function ModalBase({
  open,
  title,
  onClose,
  onSubmit,
  isPending,
  submitLabel = "Guardar",
  children,
  width = 520
}: Props) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <span className={styles.titulo}>{title}</span>
          <button className={styles.closeBtn} type="button" onClick={onClose}>
            <MdClose size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.body}>{children}</div>
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
              {isPending ? "Guardando…" : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
