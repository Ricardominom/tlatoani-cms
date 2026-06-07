import { useState } from "react";
  import { Link } from "react-router-dom";
  import { forgotPassword } from "../../services/authService";
  import styles from "./ForgotPassword.module.css";

  export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [enviado, setEnviado] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) {
        setError("Escribe tu correo electrónico.");
        return;
      }
      try {
        setLoading(true);
        setError("");
        await forgotPassword(email);
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
          <p className={styles.titulo}>Recuperar contraseña</p>

          {enviado ? (
            <>
              <p className={styles.sub}>
                Si el correo está registrado, recibirás un enlace para
                restablecer tu contraseña.
              </p>
              <Link to="/login" className={styles.link}>
                Volver al inicio de sesión
              </Link>
            </>
          ) : (
            <>
              <p className={styles.sub}>
                Escribe tu correo y te enviaremos un enlace de recuperación.
              </p>
              <form onSubmit={handleSubmit}>
                <div className={styles.fieldWrap}>
                  <label className={styles.label}>Correo electrónico</label>
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button className={styles.btn} type="submit" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar enlace"}
                </button>
              </form>
              <Link to="/login" className={styles.link}>
                Volver al inicio de sesión
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }