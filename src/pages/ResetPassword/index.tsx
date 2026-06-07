import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import styles from "./ResetPassword.module.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token || !email) {
    return (
      <div className={styles.root}>
        <div className={styles.card}>
          <p className={styles.titulo}>Enlace inválido</p>
          <p className={styles.sub}>Este enlace no es válido o ha expirado.</p>
          <Link to="/forgot-password" className={styles.link}>
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("La contraseña debe tener mínimo 8 caracteres.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      navigate("/login", { replace: true });
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
        <p className={styles.titulo}>Nueva contraseña</p>
        <p className={styles.sub}>
          Elige una contraseña segura para tu cuenta.
        </p>
        <form onSubmit={handleSubmit}>
          <div className={styles.fieldWrap}>
            <label className={styles.label}>Nueva contraseña</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className={styles.fieldWrap}>
            <label className={styles.label}>Confirmar contraseña</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Repite tu nueva contraseña"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </form>
        <Link to="/login" className={styles.link}>
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
