import { useState, useEffect, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import styles from "./MiCuenta.module.css";
import {
  usuarioUpdateFormSchema,
  ROLES_USUARIO,
  type UsuarioFormData,
  type RolUsuario,
} from "../../types";
import { getUsuario, actualizarUsuario } from "../../services/usuariosService";

const ROLE_LABEL: Record<(typeof ROLES_USUARIO)[number], string> = {
  superadmin: "Super administrador",
  admin: "Administrador",
  teacher: "Maestro",
  family: "Familia",
};

function formatFecha(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    month: "short",
    year: "numeric",
  });
}

const PREFERENCIAS = [
  {
    id: "notifComunicados",
    lbl: "Notificaciones de comunicados",
    desc: "Recibe alertas cuando se publique un aviso nuevo",
  },
  {
    id: "notifPagos",
    lbl: "Recordatorios de colegiaturas",
    desc: "Aviso cuando una familia tiene pagos pendientes",
  },
  {
    id: "notifBitacoras",
    lbl: "Actualizaciones de bitácoras",
    desc: "Notificación cuando se registre una observación nueva",
  },
  {
    id: "resumenDiario",
    lbl: "Resumen diario por correo",
    desc: "Recibe un resumen al inicio del día escolar",
  },
];

const SESIONES = [
  {
    icono: "🖥️",
    nombre: "Chrome · Windows 11",
    meta: "Ciudad de México · Ahora mismo",
    actual: true,
  },
  {
    icono: "📱",
    nombre: "Safari · iPhone",
    meta: "Ciudad de México · Hace 2 días",
    actual: false,
  },
];

export default function MiCuenta() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: perfil,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["perfil"],
    queryFn: () => getUsuario(user!.id),
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioUpdateFormSchema),
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      phone_number: "",
      role: "admin",
      active: true,
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (perfil) {
      reset({
        name: perfil.name,
        last_name: perfil.last_name,
        email: perfil.email,
        phone_number: perfil.phone_number ?? "",
        role: perfil.role as RolUsuario,
        active: perfil.active,
        password: "",
        password_confirmation: "",
      });
    }
  }, [perfil, reset]);

  const { mutate: guardarDatos, isPending: guardandoDatos } = useMutation({
    mutationFn: (data: UsuarioFormData) =>
      actualizarUsuario(perfil?.id ?? "", data),
    onSuccess: () => {
      toast.success("Perfil actualizado");
      queryClient.invalidateQueries({ queryKey: ["perfil"] });
    },
    onError: (err) => {
      setError("root", {
        message: err instanceof Error ? err.message : "Error al guardar",
      });
    },
  });

  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");
  const [passConfirmar, setPassConfirmar] = useState("");
  const [passErr, setPassErr] = useState<string | null>(null);
  const [passRootErr, setPassRootErr] = useState<string | null>(null);

  const { mutate: guardarPass, isPending: guardandoPass } = useMutation({
    mutationFn: (data: UsuarioFormData) =>
      actualizarUsuario(perfil?.id ?? "", data),
    onSuccess: () => {
      toast.success("Contraseña actualizada");
      setPassActual("");
      setPassNueva("");
      setPassConfirmar("");
    },
    onError: (err) => {
      setPassRootErr(
        err instanceof Error ? err.message : "Error al cambiar contraseña",
      );
    },
  });

  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    notifComunicados: true,
    notifPagos: true,
    notifBitacoras: false,
    resumenDiario: true,
  });
  const togglePref = (id: string) => setPrefs((p) => ({ ...p, [id]: !p[id] }));

  if (isLoading) {
    return (
      <div
        className={styles.content}
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 0",
          fontSize: 13,
          fontWeight: 700,
          color: "var(--texto-3)",
        }}
      >
        Cargando perfil…
      </div>
    );
  }
  if (isError || !perfil) {
    return (
      <div
        className={styles.content}
        style={{
          padding: "60px 24px",
          fontSize: 13,
          fontWeight: 700,
          color: "var(--rojo)",
        }}
      >
        Error:{" "}
        {error instanceof Error ? error.message : "No se pudo cargar el perfil"}
      </div>
    );
  }

  const rolLabel = ROLE_LABEL[perfil.role as RolUsuario] ?? perfil.role;

  function handleGuardarPass(e: FormEvent) {
    e.preventDefault();
    if (!perfil) return;
    setPassErr(null);
    setPassRootErr(null);
    if (passNueva.length < 8) {
      setPassErr("Mínimo 8 caracteres");
      return;
    }
    if (passNueva !== passConfirmar) {
      setPassErr("Las contraseñas no coinciden");
      return;
    }
    guardarPass({
      name: perfil.name,
      last_name: perfil.last_name,
      email: perfil.email,
      phone_number: perfil.phone_number ?? "",
      role: perfil.role as RolUsuario,
      active: perfil.active,
      password: passNueva,
      password_confirmation: passConfirmar,
    });
  }

  return (
    <div className={styles.content}>
      {/* ── HERO ── */}
      <div className={styles.hero}>
        <div className={styles.heroAvWrap}>
          <div className={styles.heroAv}>
            {perfil.profile_picture_url ? (
              <img
                src={perfil.profile_picture_url}
                alt={`${perfil.name} ${perfil.last_name}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "inherit",
                }}
              />
            ) : (
              perfil.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className={styles.heroDot} />
        </div>
        <div className={styles.heroDatos}>
          <div className={styles.heroNombre}>
            {perfil.name} {perfil.last_name}
          </div>
          <div className={styles.heroChips}>
            <span
              className={styles.hc}
              style={{
                background: "var(--amarillo-light)",
                color: "#7A6200",
                border: "1px solid var(--amarillo)",
              }}
            >
              {rolLabel}
            </span>
            <span className={styles.hc}>● En línea</span>
            <span className={styles.hc}>
              📅 Desde {formatFecha(perfil.created_at)}
            </span>
          </div>
        </div>
        <div className={styles.heroRight}>
          <button className={styles.btnFoto}>Cambiar foto</button>
        </div>
      </div>

      {/* ── DATOS + SEGURIDAD ── */}
      <div className={styles.g2}>
        {/* DATOS PERSONALES */}
        <div className={styles.card}>
          <div className={styles.cardH}>
            <div>
              <div className={styles.cardT}>Datos personales</div>
              <div className={styles.cardSub}>
                Información visible para el equipo
              </div>
            </div>
          </div>
          <form
            className={styles.cardB}
            onSubmit={handleSubmit((data) => guardarDatos(data))}
          >
            {errors.root && (
              <div className={styles.errorMsg}>{errors.root.message}</div>
            )}
            <div className={styles.campo}>
              <span className={styles.campoLbl}>Nombre</span>
              <input className={styles.campoInput} {...register("name")} />
              {errors.name && (
                <span className={styles.campoErr}>{errors.name.message}</span>
              )}
            </div>
            <div className={styles.campo}>
              <span className={styles.campoLbl}>Apellidos</span>
              <input className={styles.campoInput} {...register("last_name")} />
              {errors.last_name && (
                <span className={styles.campoErr}>
                  {errors.last_name.message}
                </span>
              )}
            </div>
            <div className={styles.campo}>
              <span className={styles.campoLbl}>Correo electrónico</span>
              <input
                className={styles.campoInput}
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <span className={styles.campoErr}>{errors.email.message}</span>
              )}
            </div>
            <div className={styles.campo}>
              <span className={styles.campoLbl}>Teléfono</span>
              <input
                className={styles.campoInput}
                type="tel"
                maxLength={13}
                {...register("phone_number")}
              />
            </div>
            <div className={styles.campo}>
              <span className={styles.campoLbl}>Rol</span>
              <input className={styles.campoInput} value={rolLabel} disabled />
              <span className={styles.campoHint}>
                El rol solo puede cambiarlo un Directivo
              </span>
            </div>
            <div className={styles.btnRow}>
              <button
                type="button"
                className={styles.btnS}
                onClick={() =>
                  reset({
                    name: perfil.name,
                    last_name: perfil.last_name,
                    email: perfil.email,
                    phone_number: perfil.phone_number ?? "",
                    role: perfil.role as RolUsuario,
                    active: perfil.active,
                    password: "",
                    password_confirmation: "",
                  })
                }
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.btnP}
                disabled={guardandoDatos}
              >
                {guardandoDatos ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>

        {/* SEGURIDAD */}
        <div className={styles.card}>
          <div className={styles.cardH}>
            <div>
              <div className={styles.cardT}>Seguridad</div>
              <div className={styles.cardSub}>Actualiza tu contraseña</div>
            </div>
          </div>
          <form className={styles.cardB} onSubmit={handleGuardarPass}>
            {passRootErr && (
              <div className={styles.errorMsg}>{passRootErr}</div>
            )}
            <div className={styles.campo}>
              <span className={styles.campoLbl}>Contraseña actual</span>
              <input
                className={styles.campoInput}
                type="password"
                placeholder="••••••••"
                value={passActual}
                onChange={(e) => setPassActual(e.target.value)}
              />
            </div>
            <div className={styles.campo}>
              <span className={styles.campoLbl}>Nueva contraseña</span>
              <input
                className={styles.campoInput}
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={passNueva}
                onChange={(e) => setPassNueva(e.target.value)}
              />
            </div>
            <div className={styles.campo}>
              <span className={styles.campoLbl}>Confirmar contraseña</span>
              <input
                className={styles.campoInput}
                type="password"
                placeholder="Repite la nueva contraseña"
                value={passConfirmar}
                onChange={(e) => setPassConfirmar(e.target.value)}
              />
              {passErr && <span className={styles.campoErr}>{passErr}</span>}
              {!passErr &&
                passNueva &&
                passConfirmar &&
                passNueva !== passConfirmar && (
                  <span
                    className={styles.campoHint}
                    style={{ color: "var(--rojo)" }}
                  >
                    Las contraseñas no coinciden
                  </span>
                )}
            </div>
            <div className={styles.btnRow}>
              <button
                type="submit"
                className={styles.btnP}
                disabled={
                  guardandoPass ||
                  !passActual ||
                  !passNueva ||
                  passNueva !== passConfirmar
                }
              >
                {guardandoPass ? "Guardando…" : "Cambiar contraseña"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── PREFERENCIAS + SESIONES ── */}
      <div className={styles.g2}>
        <div className={styles.card}>
          <div className={styles.cardH}>
            <div>
              <div className={styles.cardT}>Preferencias</div>
              <div className={styles.cardSub}>Notificaciones y alertas</div>
            </div>
          </div>
          <div className={styles.cardB}>
            {PREFERENCIAS.map((p) => (
              <div key={p.id} className={styles.prefRow}>
                <div className={styles.prefInfo}>
                  <div className={styles.prefLbl}>{p.lbl}</div>
                  <div className={styles.prefDesc}>{p.desc}</div>
                </div>
                <div
                  className={`${styles.toggle} ${prefs[p.id] ? styles.togOn : styles.togOff}`}
                  onClick={() => togglePref(p.id)}
                >
                  <div
                    className={`${styles.tThumb} ${prefs[p.id] ? styles.onPos : styles.offPos}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardH}>
            <div>
              <div className={styles.cardT}>Sesiones activas</div>
              <div className={styles.cardSub}>
                Dispositivos con acceso a tu cuenta
              </div>
            </div>
          </div>
          <div className={styles.cardB}>
            {SESIONES.map((s, i) => (
              <div key={i} className={styles.sesionItem}>
                <div className={styles.sesionIcn}>{s.icono}</div>
                <div className={styles.sesionDatos}>
                  <div className={styles.sesionNombre}>{s.nombre}</div>
                  <div className={styles.sesionMeta}>{s.meta}</div>
                </div>
                {s.actual ? (
                  <span className={styles.sesionActual}>Esta sesión</span>
                ) : (
                  <button className={styles.btnS}>Cerrar</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
