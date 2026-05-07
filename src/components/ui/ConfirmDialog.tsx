import { MdWarning } from "react-icons/md";
import styles from "./ConfirmDialog.module.css";

interface Props {
  open: boolean;
  titulo: string;
  mensaje: string;
  labelConfirm?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  titulo,
  mensaje,
  labelConfirm = "Eliminar",
  onConfirm,
  onCancel
}: Props) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconWrap}>
          <MdWarning size={28} color="var(--rojo)" />
        </div>
        <div className={styles.titulo}>{titulo}</div>
        <div className={styles.mensaje}>{mensaje}</div>
        <div className={styles.btns}>
          <button className={styles.btnCancel} onClick={onCancel}>
            Cancelar
          </button>
          <button className={styles.btnConfirm} onClick={onConfirm}>
            {labelConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}
