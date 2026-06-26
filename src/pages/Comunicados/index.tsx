import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MdAdd,
  MdSearch,
  MdSend,
  MdDelete,
  MdAttachFile,
  MdNotifications,
  MdWarning,
  MdStar,
  MdGroups,
  MdLunchDining,
  MdCampaign,
  MdAccessTime,
  MdEditNote,
} from "react-icons/md";
import styles from "./Comunicados.module.css";
import {
  type Comunicado,
  type ComunicadoFormData,
  type TIPOS_COMUNICADO,
  comunicadoFormSchema,
} from "../../types";
import {
  getComunicados,
  getComunicado,
  crearComunicado,
  eliminarComunicado,
  publicarComunicado,
  marcarComunicadoLeido,
} from "../../services/comunicadosService";
import { getGrupos } from "../../services/gruposService";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

type TipoComunicado = (typeof TIPOS_COMUNICADO)[number];
type FiltroEstado = "todos" | "draft" | "published";

const TIPO_STYLE: Record<
  TipoComunicado,
  {
    itemBg: string;
    itemBorder: string;
    iconColor: string;
    tagBg: string;
    tagColor: string;
    bannerBg: string;
    badgeBg: string;
    badgeColor: string;
  }
> = {
  general: {
    itemBg: "var(--turquesa-light)",
    itemBorder: "var(--turquesa)",
    iconColor: "var(--turquesa)",
    tagBg: "var(--turquesa-light)",
    tagColor: "var(--turquesa-s)",
    bannerBg: "var(--turquesa-light)",
    badgeBg: "var(--turquesa)",
    badgeColor: "#fff",
  },
  urgent: {
    itemBg: "var(--rojo-light)",
    itemBorder: "#F5C8C8",
    iconColor: "var(--rojo)",
    tagBg: "var(--rojo-light)",
    tagColor: "var(--rojo)",
    bannerBg: "var(--rojo-light)",
    badgeBg: "var(--rojo)",
    badgeColor: "#fff",
  },
  announcement: {
    itemBg: "var(--turquesa-light)",
    itemBorder: "var(--turquesa)",
    iconColor: "var(--turquesa)",
    tagBg: "var(--turquesa-light)",
    tagColor: "var(--turquesa-s)",
    bannerBg: "var(--turquesa-light)",
    badgeBg: "var(--turquesa)",
    badgeColor: "#fff",
  },
  festival: {
    itemBg: "var(--rosa-light)",
    itemBorder: "var(--rosa)",
    iconColor: "var(--rosa)",
    tagBg: "var(--rosa-light)",
    tagColor: "var(--rosa-s)",
    bannerBg: "var(--rosa-light)",
    badgeBg: "var(--rosa)",
    badgeColor: "#fff",
  },
  meeting: {
    itemBg: "var(--amarillo-light)",
    itemBorder: "var(--amarillo)",
    iconColor: "#B89600",
    tagBg: "var(--amarillo-light)",
    tagColor: "#7A6200",
    bannerBg: "var(--amarillo-light)",
    badgeBg: "var(--amarillo)",
    badgeColor: "#5A4800",
  },
  food: {
    itemBg: "var(--verde-light)",
    itemBorder: "var(--verde)",
    iconColor: "var(--verde)",
    tagBg: "var(--verde-light)",
    tagColor: "var(--verde-s)",
    bannerBg: "var(--verde-light)",
    badgeBg: "var(--verde)",
    badgeColor: "#fff",
  },
  reminder: {
    itemBg: "var(--gris-bg)",
    itemBorder: "var(--gris-borde)",
    iconColor: "var(--texto-3)",
    tagBg: "var(--gris-bg)",
    tagColor: "var(--texto-2)",
    bannerBg: "var(--gris-bg)",
    badgeBg: "#888",
    badgeColor: "#fff",
  },
};

const TIPO_LABEL: Record<TipoComunicado, string> = {
  general: "General",
  urgent: "Urgente",
  announcement: "Anuncio",
  festival: "Festival",
  meeting: "Junta",
  food: "Comida",
  reminder: "Recordatorio",
};

const TIPOS_LISTA: TipoComunicado[] = [
  "general",
  "urgent",
  "announcement",
  "festival",
  "meeting",
  "food",
  "reminder",
];

function TipoIcon({ tipo, color }: { tipo: TipoComunicado; color: string }) {
  const p = { size: 18, color };
  switch (tipo) {
    case "urgent":
      return <MdWarning {...p} />;
    case "festival":
      return <MdStar {...p} />;
    case "meeting":
      return <MdGroups {...p} />;
    case "food":
      return <MdLunchDining {...p} />;
    case "reminder":
      return <MdAccessTime {...p} />;
    default:
      return <MdCampaign {...p} />;
  }
}

function formatFecha(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const FORM_DEFAULT: ComunicadoFormData = {
  title: "",
  content: "",
  type: "general",
  is_global: true,
  group_uuids: [],
  student_uuids: [],
  status: "draft",
  attachment: null,
};

export default function Comunicados() {
  const queryClient = useQueryClient();

  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [modoNuevo, setModoNuevo] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<FiltroEstado>("todos");
  const [confirmEliminarOpen, setConfirmEliminarOpen] = useState(false);

  const { data: comunicadosRes, isLoading } = useQuery({
    queryKey: ["comunicados", filtro, busqueda],
    queryFn: () =>
      getComunicados({
        status: filtro !== "todos" ? filtro : undefined,
        search: busqueda || undefined,
        per_page: 50,
        order_by: "created_at",
        order_direction: "desc",
      }),
  });

  const comunicados = comunicadosRes?.data ?? [];
  const activeUuid = selectedUuid ?? comunicados[0]?.id ?? null;

  const { data: comunicadoDetalle } = useQuery({
    queryKey: ["comunicado", activeUuid],
    queryFn: () => getComunicado(activeUuid!),
    enabled: !!activeUuid && !modoNuevo,
  });

  const { data: gruposRes } = useQuery({
    queryKey: ["grupos"],
    queryFn: () => getGrupos({ per_page: 100 }),
    enabled: modoNuevo,
  });
  const grupos = gruposRes?.data ?? [];

  const aviso: Comunicado | null =
    comunicadoDetalle ?? comunicados.find((c) => c.id === activeUuid) ?? null;
  const ts = aviso ? TIPO_STYLE[aviso.type] : TIPO_STYLE["general"];

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ComunicadoFormData>({
    resolver: zodResolver(comunicadoFormSchema),
    defaultValues: FORM_DEFAULT,
  });

  const isGlobal = watch("is_global");

  const crearMutation = useMutation({
    mutationFn: (data: ComunicadoFormData) => crearComunicado(data),
    onSuccess: (nuevo) => {
      queryClient.invalidateQueries({ queryKey: ["comunicados"] });
      setModoNuevo(false);
      setSelectedUuid(nuevo?.id ?? null);
      reset(FORM_DEFAULT);
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: (uuid: string) => eliminarComunicado(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comunicados"] });
      setSelectedUuid(null);
      setConfirmEliminarOpen(false);
    },
  });

  const publicarMutation = useMutation({
    mutationFn: (uuid: string) => publicarComunicado(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comunicados"] });
      queryClient.invalidateQueries({ queryKey: ["comunicado", activeUuid] });
    },
  });

  const marcarLeidoMutation = useMutation({
    mutationFn: (uuid: string) => marcarComunicadoLeido(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comunicado", activeUuid] });
      queryClient.invalidateQueries({ queryKey: ["comunicados"] });
    },
  });

  const draftCount = comunicados.filter((c) => c.status === "draft").length;

  function handleGuardarBorrador() {
    setValue("status", "draft");
    handleSubmit((data) => crearMutation.mutate(data))();
  }

  function handlePublicarNuevo() {
    setValue("status", "published");
    handleSubmit((data) => crearMutation.mutate(data))();
  }

  return (
    <div className={styles.root}>
      {/* ── LISTA ── */}
      <div className={styles.panelLista}>
        <div className={styles.listaHeader}>
          <div className={styles.lhTop}>
            <span className={styles.lhTitulo}>Comunicados</span>
            <button
              className={styles.btnNuevo}
              onClick={() => {
                setModoNuevo(true);
                setSelectedUuid(null);
                reset(FORM_DEFAULT);
              }}
            >
              <MdAdd size={11} /> Nuevo aviso
            </button>
          </div>
          <div className={styles.searchWrap}>
            <MdSearch size={13} color="var(--texto-3)" />
            <input
              className={styles.searchInput}
              placeholder="Buscar comunicado…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className={styles.filtTabs}>
            <button
              className={`${styles.ft} ${filtro === "todos" ? styles.ftOn : styles.ftOff}`}
              onClick={() => setFiltro("todos")}
            >
              Todos
            </button>
            <button
              className={`${styles.ft} ${filtro === "draft" ? styles.ftOn : styles.ftBor}`}
              onClick={() => setFiltro("draft")}
            >
              Borrador · {draftCount}
            </button>
            <button
              className={`${styles.ft} ${filtro === "published" ? styles.ftOn : styles.ftOff}`}
              onClick={() => setFiltro("published")}
            >
              Publicados
            </button>
          </div>
        </div>

        <div className={styles.lista}>
          {isLoading && (
            <div
              style={{
                padding: "24px 16px",
                fontSize: 12,
                color: "var(--texto-3)",
                fontWeight: 700,
              }}
            >
              Cargando comunicados…
            </div>
          )}

          {modoNuevo && (
            <div className={`${styles.avItem} ${styles.avItemSel}`}>
              <div
                className={styles.avIcono}
                style={{
                  background: "var(--amarillo-light)",
                  border: "1.5px solid var(--amarillo)",
                }}
              >
                <MdEditNote size={18} color="#B89600" />
              </div>
              <div className={styles.avDatos}>
                <div className={styles.avTituloTxt}>Nuevo aviso · borrador</div>
                <div className={styles.avPreview}>
                  Escribe el contenido del aviso…
                </div>
                <div className={styles.avMeta}>
                  <span
                    className={styles.avTag}
                    style={{
                      background: "var(--amarillo-light)",
                      color: "#B89600",
                    }}
                  >
                    Borrador
                  </span>
                  <span className={styles.avFecha}>Ahora</span>
                </div>
              </div>
            </div>
          )}

          {comunicados.map((c) => {
            const st = TIPO_STYLE[c.type];
            const sel = !modoNuevo && c.id === activeUuid;
            return (
              <div
                key={c.id}
                className={`${styles.avItem} ${sel ? styles.avItemSel : ""}`}
                onClick={() => {
                  setSelectedUuid(c.id);
                  setModoNuevo(false);
                }}
              >
                <div
                  className={styles.avIcono}
                  style={{
                    background: st.itemBg,
                    border: `1.5px solid ${st.itemBorder}`,
                  }}
                >
                  <TipoIcon tipo={c.type} color={st.iconColor} />
                </div>
                <div className={styles.avDatos}>
                  <div className={styles.avTituloTxt}>{c.title}</div>
                  <div className={styles.avPreview}>
                    {c.content.slice(0, 60)}…
                  </div>
                  <div className={styles.avMeta}>
                    <span
                      className={styles.avTag}
                      style={{ background: st.tagBg, color: st.tagColor }}
                    >
                      {TIPO_LABEL[c.type]}
                    </span>
                    <span
                      className={styles.avTag}
                      style={{
                        background: "var(--gris-bg)",
                        color: "var(--texto-2)",
                      }}
                    >
                      {c.is_global ? "Escuela" : "Grupos"}
                    </span>
                    <span className={styles.avFecha}>
                      {formatFecha(c.published_at ?? c.created_at)}
                    </span>
                  </div>
                </div>
                {c.status === "published" && (
                  <div className={styles.avRight}>
                    <span
                      className={styles.avSt}
                      style={{
                        background: "var(--verde-light)",
                        color: "var(--verde-s)",
                      }}
                    >
                      ✓ Pub.
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── DETALLE ── */}
      <div className={styles.panelDet}>
        {modoNuevo ? (
          <>
            <div className={styles.detTopbar}>
              <div>
                <div className={styles.detTitulo}>Nuevo comunicado</div>
                <div className={styles.detSub}>Borrador · sin publicar</div>
              </div>
              <div className={styles.detActions}>
                <button
                  className={styles.btnS}
                  onClick={() => {
                    setModoNuevo(false);
                    reset(FORM_DEFAULT);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
            <div className={styles.detContent}>
              <div className={styles.colAviso}>
                <div className={styles.editorCard}>
                  <div className={styles.ecHeader}>
                    <span className={styles.ecTitulo}>
                      ✏️ Redactar nuevo comunicado
                    </span>
                    <span className={styles.ecEstado}>
                      Borrador · sin publicar
                    </span>
                  </div>
                  <div className={styles.ecBody}>
                    <div className={styles.field}>
                      <label className={styles.fieldLbl}>Tipo de aviso</label>
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <div className={styles.tipoPills}>
                            {TIPOS_LISTA.map((t) => {
                              const st = TIPO_STYLE[t];
                              const on = field.value === t;
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  className={`${styles.tipoPill} ${on ? styles.tpOn : styles.tpOff}`}
                                  style={
                                    on
                                      ? {
                                          background: st.badgeBg,
                                          color: st.badgeColor,
                                        }
                                      : {}
                                  }
                                  onClick={() => field.onChange(t)}
                                >
                                  {TIPO_LABEL[t]}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.fieldLbl}>
                        Título del aviso
                      </label>
                      <input
                        className={styles.fieldInput}
                        placeholder="Ej: Junta de padres — Abejas · 28 oct"
                        {...register("title")}
                      />
                      {errors.title && (
                        <span style={{ fontSize: 11, color: "var(--rojo)" }}>
                          {errors.title.message}
                        </span>
                      )}
                    </div>

                    <div className={styles.field}>
                      <label className={styles.fieldLbl}>Mensaje</label>
                      <textarea
                        className={`${styles.fieldInput} ${styles.fieldTextarea}`}
                        placeholder="Escribe el mensaje para las familias…"
                        {...register("content")}
                      />
                      {errors.content && (
                        <span style={{ fontSize: 11, color: "var(--rojo)" }}>
                          {errors.content.message}
                        </span>
                      )}
                    </div>

                    <div className={styles.field}>
                      <label className={styles.fieldLbl}>Destino</label>
                      <Controller
                        name="is_global"
                        control={control}
                        render={({ field }) => (
                          <div className={styles.destinoGrid}>
                            <div
                              className={`${styles.destCheck} ${isGlobal ? styles.destCheckOn : ""}`}
                              onClick={() => {
                                field.onChange(true);
                                setValue("group_uuids", []);
                              }}
                            >
                              <div
                                className={`${styles.destBox} ${isGlobal ? styles.destBoxOn : ""}`}
                              >
                                {isGlobal && (
                                  <svg
                                    width="9"
                                    height="9"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#5A4800"
                                    strokeWidth="3"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </div>
                              <span className={styles.destLbl}>
                                Toda la escuela
                              </span>
                            </div>
                            {grupos.map((g) => (
                              <Controller
                                key={g.id}
                                name="group_uuids"
                                control={control}
                                render={({ field: gField }) => {
                                  const checked = gField.value.includes(g.id);
                                  return (
                                    <div
                                      className={`${styles.destCheck} ${checked ? styles.destCheckOn : ""}`}
                                      onClick={() => {
                                        field.onChange(false);
                                        gField.onChange(
                                          checked
                                            ? gField.value.filter(
                                                (id) => id !== g.id,
                                              )
                                            : [...gField.value, g.id],
                                        );
                                      }}
                                    >
                                      <div
                                        className={`${styles.destBox} ${checked ? styles.destBoxOn : ""}`}
                                      >
                                        {checked && (
                                          <svg
                                            width="9"
                                            height="9"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#5A4800"
                                            strokeWidth="3"
                                          >
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                        )}
                                      </div>
                                      <span className={styles.destLbl}>
                                        {g.name}
                                      </span>
                                    </div>
                                  );
                                }}
                              />
                            ))}
                          </div>
                        )}
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.fieldLbl}>
                        Adjunto (opcional)
                      </label>
                      <Controller
                        name="attachment"
                        control={control}
                        render={({ field }) => (
                          <div className={styles.adjUpload}>
                            <MdAttachFile size={16} color="var(--texto-3)" />
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              style={{ display: "none" }}
                              id="adjunto-input"
                              onChange={(e) =>
                                field.onChange(e.target.files?.[0] ?? null)
                              }
                            />
                            <label
                              htmlFor="adjunto-input"
                              className={styles.adjTxt}
                              style={{ cursor: "pointer" }}
                            >
                              {field.value instanceof File
                                ? field.value.name
                                : "Adjuntar PDF, imagen o documento…"}
                            </label>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  <div className={styles.ecFooter}>
                    <button
                      type="button"
                      className={styles.btnBorrador}
                      disabled={crearMutation.isPending}
                      onClick={handleGuardarBorrador}
                    >
                      Guardar borrador
                    </button>
                    <button
                      type="button"
                      className={styles.btnPublicar}
                      disabled={crearMutation.isPending}
                      onClick={handlePublicarNuevo}
                    >
                      <MdSend size={14} color="#5A4800" />
                      {crearMutation.isPending
                        ? "Publicando…"
                        : "Publicar y notificar"}
                    </button>
                  </div>
                  {crearMutation.isError && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--rojo)",
                        padding: "8px 16px",
                      }}
                    >
                      {crearMutation.error instanceof Error
                        ? crearMutation.error.message
                        : "Error al crear el comunicado"}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.colConf} />
            </div>
          </>
        ) : aviso ? (
          <>
            <div className={styles.detTopbar}>
              <div>
                <div className={styles.detTitulo}>{aviso.title}</div>
                <div className={styles.detSub}>
                  {TIPO_LABEL[aviso.type]} ·{" "}
                  {formatFecha(aviso.published_at ?? aviso.created_at)}
                </div>
              </div>
              <div className={styles.detActions}>
                {aviso.status === "draft" && (
                  <button
                    className={styles.btnP}
                    disabled={publicarMutation.isPending}
                    onClick={() => publicarMutation.mutate(aviso.id)}
                  >
                    <MdSend size={12} color="#5A4800" />
                    {publicarMutation.isPending
                      ? "Publicando…"
                      : "Publicar ahora"}
                  </button>
                )}
                <button
                  className={`${styles.btnS} ${styles.btnSDanger}`}
                  onClick={() => setConfirmEliminarOpen(true)}
                >
                  <MdDelete size={12} /> Eliminar
                </button>
              </div>
            </div>

            <div className={styles.detContent}>
              <div className={styles.colAviso}>
                <div className={styles.avisoPrev}>
                  <div
                    className={styles.apBanner}
                    style={{ background: ts.bannerBg }}
                  >
                    <div className={styles.apTipoRow}>
                      <span
                        className={styles.apTipoBadge}
                        style={{ background: ts.badgeBg, color: ts.badgeColor }}
                      >
                        {TIPO_LABEL[aviso.type]}
                      </span>
                      {aviso.type === "urgent" && (
                        <span className={styles.apUrgente}>
                          Requiere confirmación
                        </span>
                      )}
                    </div>
                    <div className={styles.apTituloBig}>{aviso.title}</div>
                    <div className={styles.apDestino}>
                      {aviso.is_global ? (
                        <span
                          className={styles.apDestChip}
                          style={{
                            background: ts.bannerBg,
                            borderColor: ts.itemBorder,
                            color: ts.iconColor,
                          }}
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          </svg>{" "}
                          Toda la escuela
                        </span>
                      ) : (
                        aviso.groups?.map((g) => (
                          <span key={g.id} className={styles.apDestChip}>
                            {g.name}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <div className={styles.apBody}>
                    <div className={styles.apTexto}>
                      {aviso.content.split("\n").map((line, i) =>
                        line === "" ? (
                          <br key={i} />
                        ) : (
                          <span key={i}>
                            {line}
                            <br />
                          </span>
                        ),
                      )}
                    </div>
                    {aviso.attachment && (
                      <div className={styles.apAdjunto}>
                        <div className={styles.apAdjIcon}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--turquesa)"
                            strokeWidth="2"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div>
                          <a
                            href={aviso.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.apAdjNombre}
                          >
                            Ver adjunto
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={styles.apFooter}>
                    <div className={styles.apPubInfo}>
                      {aviso.status === "published"
                        ? `Publicado ${formatFecha(aviso.published_at)}`
                        : "Borrador · sin publicar"}
                      {aviso.author &&
                        ` por ${aviso.author.name} ${aviso.author.last_name}`}
                    </div>
                    <div className={styles.apConfRow}>
                      {aviso.is_read ? (
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 900,
                            color: "var(--verde)",
                          }}
                        >
                          ✓ Leído{" "}
                          {aviso.read_at ? formatFecha(aviso.read_at) : ""}
                        </span>
                      ) : aviso.status === "published" ? (
                        <button
                          className={styles.btnBorrador}
                          disabled={marcarLeidoMutation.isPending}
                          onClick={() => marcarLeidoMutation.mutate(aviso.id)}
                        >
                          <MdNotifications size={12} /> Marcar como leído
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.colConf}>
                <div className={styles.confProg}>
                  <div className={styles.cpTitulo}>
                    Estado —{" "}
                    {aviso.title.length > 28
                      ? aviso.title.slice(0, 28) + "…"
                      : aviso.title}
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 12,
                      color: "var(--texto-2)",
                      fontWeight: 600,
                    }}
                  >
                    {aviso.status === "draft"
                      ? "Borrador · aún no publicado"
                      : aviso.is_read
                        ? `Leído el ${aviso.read_at ? formatFecha(aviso.read_at) : "—"}`
                        : "Sin leer por el usuario actual"}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 11,
                      color: "var(--texto-3)",
                    }}
                  >
                    El desglose por familia estará disponible cuando el backend
                    exponga el endpoint de lecturas.
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--texto-3)",
            }}
          >
            Selecciona un comunicado o crea uno nuevo
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmEliminarOpen}
        titulo="Eliminar comunicado"
        mensaje={`¿Seguro que quieres eliminar "${aviso?.title}"? Esta acción no se puede deshacer.`}
        onConfirm={() => aviso && eliminarMutation.mutate(aviso.id)}
        onCancel={() => setConfirmEliminarOpen(false)}
      />
    </div>
  );
}
