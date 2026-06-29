import { MdClose } from "react-icons/md";
import styles from "../../components/ui/ModalBase.module.css";
import SeccionPadres from "./SeccionPadres";
import type { Alumno, FamilyMember } from "../../types";

interface Props {
  open: boolean;
  alumno: Alumno | null;
  familyMembers: FamilyMember[];
  onClose: () => void;
}

export default function ModalPadres({
  open,
  alumno,
  familyMembers,
  onClose,
}: Props) {
  if (!open || !alumno) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        style={{ width: 540 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <span className={styles.titulo}>
            Padres y tutores — {alumno.name} {alumno.last_name}
          </span>
          <button className={styles.closeBtn} type="button" onClick={onClose}>
            <MdClose size={16} />
          </button>
        </div>
        <div className={styles.body}>
          <SeccionPadres
            modo="editar"
            studentUuid={alumno.id}
            familyMembers={familyMembers}
          />
        </div>
      </div>
    </div>
  );
}
