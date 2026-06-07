import { useState } from "react";
import { Link } from "react-router-dom";
import { resendVerificationEmail } from "../../services/authService";
import styles from "./VerifyEmail.module.css";

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    try {
      setLoading(true);
      setError("");
      await resendVerificationEmail();
      setEnviado(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <p className={styles.titulo}>Verifica tu correo</p>
        <p className={styles.sub}>
          Tu cuenta aún no está verificada. Revisa tu bandeja de entrada y haz
          clic en el enlace que te enviamos.
        </p>

        {enviado && (
          <p className={styles.success}>
            Correo reenviado. Revisa tu bandeja de entrada.
          </p>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={styles.btn}
          onClick={handleResend}
          disabled={loading || enviado}
        >
          {loading
            ? "Enviando..."
            : enviado
              ? "Correo enviado"
              : "Reenviar correo"}
        </button>

        <Link to="/login" className={styles.link}>
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
