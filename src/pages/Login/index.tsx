import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Login.module.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Escribe tu correo y contraseña.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg ?? "Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <svg width="48" height="48" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#F5C800"
              strokeWidth="9"
            />
            <circle
              cx="50"
              cy="50"
              r="31"
              fill="none"
              stroke="#7BC441"
              strokeWidth="9"
            />
            <path
              d="M50 32 a18 18 0 1 1 -0.01 0"
              fill="none"
              stroke="#E5297E"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="8" fill="#00AECC" />
          </svg>
          <span className={styles.logoColegio}>Panel</span>
          <span className={styles.logoTlatoani}>tlatoani</span>
          <span className={styles.logoSub}>Montessori</span>
        </div>

        <p className={styles.titulo}>Bienvenido</p>
        <p className={styles.sub}>Inicia sesión para continuar</p>

        <form onSubmit={handleLogin}>
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

          <div className={styles.fieldWrap}>
            <label className={styles.label}>Contraseña</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar al panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
