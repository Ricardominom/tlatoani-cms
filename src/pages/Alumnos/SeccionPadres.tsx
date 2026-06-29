import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { MdAdd, MdClose, MdEdit, MdLinkOff } from "react-icons/md";
import { useDebounce } from "../../hooks/useDebounce";
import { getUsuarios, crearUsuario } from "../../services/usuariosService";
import {
  vincularFamilyMember,
  actualizarFamilyMember,
  desvincularFamilyMember,
} from "../../services/familyMembersService";
import {
  familyMemberUpdateFormSchema,
  padreNuevoFormSchema,
  type FamilyMember,
  type FamilyMemberUpdateFormData,
  type PadreNuevoFormData,
  type PadrePendiente,
  type Usuario,
} from "../../types";
import styles from "./SeccionPadres.module.css";

// Sub-forms

const relacionInicial: FamilyMemberUpdateFormData = {
  relationship: "",
  primary_contact: false,
};

const padreNuevoInicial: PadreNuevoFormData = {
  name: "",
  last_name: "",
  email: "",
  phone_number: "",
  password: "",
  password_confirmation: "",
  relationship: "",
  primary_contact: false,
};

// Props

interface PropsModoCrear {
  modo: "crear";
  padresPendientes: PadrePendiente[];
  onChangePendientes: (pads: PadrePendiente[]) => void;
}

interface PropsModoEditar {
  modo: "editar";
  studentUuid: string;
  familyMembers: FamilyMember[];
}

type Props = PropsModoCrear | PropsModoEditar;

// Componente

export default function SeccionPadres(props: Props) {
  const queryClient = useQueryClient();

  // Vista activa del panel
  type Vista = "lista" | "buscar-existente" | "crear-nuevo" | "editar-relacion";
  const [vista, setVista] = useState<Vista>("lista");
  const [tabPanel, setTabPanel] = useState<"buscar" | "nuevo">("buscar");

  // Para modo editar: cuál padre estamos editando
  const [miembroEditando, setMiembroEditando] = useState<FamilyMember | null>(
    null,
  );

  // Búsqueda de usuario existente
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedTerm = useDebounce(searchTerm, 300);

  // Usuario seleccionado de la búsqueda (antes de confirmar relación)
  const [usuarioSel, setUsuarioSel] = useState<Usuario | null>(null);

  // Búsqueda de usuarios
  const { data: usuariosRes, isFetching: buscando } = useQuery({
    queryKey: ["usuarios-search", debouncedTerm],
    queryFn: () =>
      getUsuarios({ search: debouncedTerm, role: "family", per_page: 10 }),
    enabled: debouncedTerm.length >= 2,
  });
  const usuariosEncontrados = usuariosRes?.data ?? [];

  // Form: definir relación (usuario existente)
  const relacionForm = useForm<FamilyMemberUpdateFormData>({
    resolver: zodResolver(familyMemberUpdateFormSchema),
    defaultValues: relacionInicial,
  });
  const relacionPrimario = useWatch({
    control: relacionForm.control,
    name: "primary_contact",
  });

  // Form: crear padre nuevo
  const nuevoForm = useForm<PadreNuevoFormData>({
    resolver: zodResolver(padreNuevoFormSchema),
    defaultValues: padreNuevoInicial,
  });
  const nuevoPrimario = useWatch({
    control: nuevoForm.control,
    name: "primary_contact",
  });

  // Form: editar relación existente (modo editar)
  const editarForm = useForm<FamilyMemberUpdateFormData>({
    resolver: zodResolver(familyMemberUpdateFormSchema),
    defaultValues: relacionInicial,
  });
  const editarPrimario = useWatch({
    control: editarForm.control,
    name: "primary_contact",
  });

  // Mutations (solo modo editar)
  const vincularMutation = useMutation({
    mutationFn: (data: {
      user_uuid: string;
      relationship: string;
      primary_contact: boolean;
    }) => vincularFamilyMember((props as PropsModoEditar).studentUuid, data),
    onSuccess: () => {
      toast.success("Padre vinculado");
      queryClient.invalidateQueries({
        queryKey: ["family-members", (props as PropsModoEditar).studentUuid],
      });
      resetPanel();
    },
    onError: (err) => {
      relacionForm.setError("root", {
        message: err instanceof Error ? err.message : "Error al vincular",
      });
    },
  });

  const actualizarMutation = useMutation({
    mutationFn: (data: FamilyMemberUpdateFormData) =>
      actualizarFamilyMember(
        (props as PropsModoEditar).studentUuid,
        miembroEditando!.id,
        data,
      ),
    onSuccess: () => {
      toast.success("Relación actualizada");
      queryClient.invalidateQueries({
        queryKey: ["family-members", (props as PropsModoEditar).studentUuid],
      });
      resetPanel();
    },
    onError: (err) => {
      editarForm.setError("root", {
        message: err instanceof Error ? err.message : "Error al actualizar",
      });
    },
  });

  const desvincularMutation = useMutation({
    mutationFn: (userUuid: string) =>
      desvincularFamilyMember((props as PropsModoEditar).studentUuid, userUuid),
    onSuccess: () => {
      toast.success("Padre desvinculado");
      queryClient.invalidateQueries({
        queryKey: ["family-members", (props as PropsModoEditar).studentUuid],
      });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Error al desvincular");
    },
  });

  const crearYVincularMutation = useMutation({
    mutationFn: async (data: PadreNuevoFormData) => {
      const usuarioCreado = await crearUsuario({
        name: data.name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        password: data.password,
        password_confirmation: data.password_confirmation,
        role: "family",
        active: true,
      });
      await vincularFamilyMember((props as PropsModoEditar).studentUuid, {
        user_uuid: usuarioCreado.id,
        relationship: data.relationship,
        primary_contact: data.primary_contact,
      });
    },
    onSuccess: () => {
      toast.success("Padre creado y vinculado");
      queryClient.invalidateQueries({
        queryKey: ["family-members", (props as PropsModoEditar).studentUuid],
      });
      resetPanel();
    },
    onError: (err) => {
      nuevoForm.setError("root", {
        message: err instanceof Error ? err.message : "Error al crear el padre",
      });
    },
  });

  // Helpers
  function resetPanel() {
    setVista("lista");
    setSearchTerm("");
    setUsuarioSel(null);
    setMiembroEditando(null);
    relacionForm.reset(relacionInicial);
    nuevoForm.reset(padreNuevoInicial);
    editarForm.reset(relacionInicial);
  }

  function abrirEditar(miembro: FamilyMember) {
    setMiembroEditando(miembro);
    editarForm.reset({
      relationship: miembro.relationship,
      primary_contact: miembro.primary_contact,
    });
    setVista("editar-relacion");
  }

  // Confirmación: agregar padre existente (modo crear)
  function confirmarExistente(data: FamilyMemberUpdateFormData) {
    if (!usuarioSel) return;
    if (props.modo === "crear") {
      const nuevo: PadrePendiente = {
        tipo: "existente",
        usuario: usuarioSel,
        relationship: data.relationship,
        primary_contact: data.primary_contact,
      };
      props.onChangePendientes([...props.padresPendientes, nuevo]);
      resetPanel();
    } else {
      vincularMutation.mutate({
        user_uuid: usuarioSel.id,
        relationship: data.relationship,
        primary_contact: data.primary_contact,
      });
    }
  }

  function confirmarNuevo(data: PadreNuevoFormData) {
    if (props.modo === "crear") {
      const nuevo: PadrePendiente = { tipo: "nuevo", formData: data };
      props.onChangePendientes([...props.padresPendientes, nuevo]);
      resetPanel();
    } else {
      crearYVincularMutation.mutate(data);
    }
  }

  // Lista a renderizar
  const lista: {
    id: string;
    nombre: string;
    email?: string;
    relationship: string;
    primary_contact: boolean;
  }[] =
    props.modo === "editar"
      ? props.familyMembers.map((m) => ({
          id: m.id,
          nombre: `${m.name} ${m.last_name}`,
          email: m.email,
          relationship: m.relationship,
          primary_contact: m.primary_contact,
        }))
      : props.padresPendientes.map((p, i) => ({
          id: String(i),
          nombre:
            p.tipo === "existente"
              ? `${p.usuario.name} ${p.usuario.last_name}`
              : `${p.formData.name} ${p.formData.last_name}`,
          email: p.tipo === "existente" ? p.usuario.email : p.formData.email,
          relationship:
            p.tipo === "existente" ? p.relationship : p.formData.relationship,
          primary_contact:
            p.tipo === "existente"
              ? p.primary_contact
              : p.formData.primary_contact,
        }));

  // Render
  return (
    <div className={styles.seccion}>
      <div className={styles.seccionHeader}>
        <span className={styles.seccionTitulo}>Padres / Tutores</span>
        {vista === "lista" && (
          <button
            type="button"
            className={styles.btnAgregar}
            onClick={() => {
              setVista("buscar-existente");
              setTabPanel("buscar");
            }}
          >
            <MdAdd size={14} />
            Agregar
          </button>
        )}
      </div>

      {/* ── Lista de padres ── */}
      {vista === "lista" && (
        <div className={styles.lista}>
          {lista.length === 0 && (
            <span className={styles.sinResultados}>
              Sin padres o tutores registrados
            </span>
          )}
          {lista.map((p) => (
            <div key={p.id} className={styles.padreCard}>
              <div className={styles.padreInfo}>
                <span className={styles.padreNombre}>{p.nombre}</span>
                <span className={styles.padreMeta}>
                  {p.relationship}
                  {p.email ? ` · ${p.email}` : ""}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {p.primary_contact && (
                  <span className={styles.padreBadge}>Contacto principal</span>
                )}
                {props.modo === "editar" && (
                  <div className={styles.padreAcciones}>
                    <button
                      type="button"
                      className={styles.btnIcono}
                      onClick={() => {
                        const miembro = (
                          props as PropsModoEditar
                        ).familyMembers.find((m) => m.id === p.id);
                        if (miembro) abrirEditar(miembro);
                      }}
                    >
                      <MdEdit size={14} />
                    </button>
                    <button
                      type="button"
                      className={`${styles.btnIcono} ${styles.btnIconoRojo}`}
                      onClick={() => desvincularMutation.mutate(p.id)}
                    >
                      <MdLinkOff size={14} />
                    </button>
                  </div>
                )}
                {props.modo === "crear" && (
                  <button
                    type="button"
                    className={`${styles.btnIcono} ${styles.btnIconoRojo}`}
                    onClick={() => {
                      const index = Number(p.id);
                      props.onChangePendientes(
                        (props as PropsModoCrear).padresPendientes.filter(
                          (_, i) => i !== index,
                        ),
                      );
                    }}
                  >
                    <MdClose size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Panel: agregar padre (buscar existente o crear nuevo) ── */}
      {vista === "buscar-existente" && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitulo}>Agregar padre / tutor</span>
            <button
              type="button"
              className={styles.btnVolver}
              onClick={resetPanel}
            >
              Cancelar
            </button>
          </div>

          <div className={styles.tabsBar}>
            <button
              type="button"
              className={`${styles.tab} ${tabPanel === "buscar" ? styles.tabActivo : ""}`}
              onClick={() => setTabPanel("buscar")}
            >
              Buscar existente
            </button>
            <button
              type="button"
              className={styles.btnConfirmar}
              onClick={nuevoForm.handleSubmit(confirmarNuevo)}
            >
              Agregar
            </button>
            Cámbialo por:
            <button
              type="button"
              className={styles.btnConfirmar}
              onClick={nuevoForm.handleSubmit(confirmarNuevo)}
              disabled={crearYVincularMutation.isPending}
            >
              {crearYVincularMutation.isPending ? "Creando…" : "Agregar"}
            </button>
          </div>

          {/* Tab: buscar usuario existente */}
          {tabPanel === "buscar" && !usuarioSel && (
            <>
              <div className={styles.campo}>
                <span className={styles.label}>Buscar por nombre o correo</span>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Escribe al menos 2 caracteres…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {buscando && <p className={styles.sinResultados}>Buscando…</p>}
              {!buscando &&
                debouncedTerm.length >= 2 &&
                usuariosEncontrados.length === 0 && (
                  <p className={styles.sinResultados}>Sin resultados</p>
                )}
              <div className={styles.resultados}>
                {usuariosEncontrados.map((u) => (
                  <div
                    key={u.id}
                    className={styles.resultadoItem}
                    onClick={() => {
                      setUsuarioSel(u);
                      relacionForm.reset(relacionInicial);
                    }}
                  >
                    <div>
                      <div className={styles.resultadoNombre}>
                        {u.name} {u.last_name}
                      </div>
                      <div className={styles.resultadoEmail}>{u.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Sub-panel: confirmar relación del usuario seleccionado */}
          {tabPanel === "buscar" && usuarioSel && (
            <div>
              {relacionForm.formState.errors.root && (
                <div className={styles.errorPanel}>
                  {relacionForm.formState.errors.root.message}
                </div>
              )}
              <div className={styles.padreCard} style={{ marginBottom: 12 }}>
                <div className={styles.padreInfo}>
                  <span className={styles.padreNombre}>
                    {usuarioSel.name} {usuarioSel.last_name}
                  </span>
                  <span className={styles.padreMeta}>{usuarioSel.email}</span>
                </div>
                <button
                  type="button"
                  className={styles.btnIcono}
                  onClick={() => setUsuarioSel(null)}
                >
                  <MdClose size={14} />
                </button>
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Relación *</span>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="ej. Mamá, Papá, Tutor…"
                  {...relacionForm.register("relationship")}
                />
                {relacionForm.formState.errors.relationship && (
                  <span className={styles.errorField}>
                    {relacionForm.formState.errors.relationship.message}
                  </span>
                )}
              </div>
              <div className={styles.toggleRow}>
                <span className={styles.toggleLbl}>Contacto principal</span>
                <div
                  className={`${styles.toggle} ${relacionPrimario ? styles.togOn : styles.togOff}`}
                  onClick={() =>
                    relacionForm.setValue("primary_contact", !relacionPrimario)
                  }
                >
                  <div
                    className={`${styles.tThumb} ${relacionPrimario ? styles.onPos : styles.offPos}`}
                  />
                </div>
              </div>
              <div className={styles.panelFooter}>
                <button
                  type="button"
                  onClick={relacionForm.handleSubmit(confirmarExistente)}
                  className={styles.btnConfirmar}
                  disabled={vincularMutation.isPending}
                >
                  {vincularMutation.isPending ? "Vinculando…" : "Confirmar"}
                </button>
              </div>
            </div>
          )}

          {/* Tab: crear padre nuevo */}
          {tabPanel === "nuevo" && (
            <div>
              {nuevoForm.formState.errors.root && (
                <div className={styles.errorPanel}>
                  {nuevoForm.formState.errors.root.message}
                </div>
              )}
              <div className={styles.g2}>
                <div className={styles.campo}>
                  <span className={styles.label}>Nombre *</span>
                  <input
                    className={styles.input}
                    type="text"
                    {...nuevoForm.register("name")}
                  />
                  {nuevoForm.formState.errors.name && (
                    <span className={styles.errorField}>
                      {nuevoForm.formState.errors.name.message}
                    </span>
                  )}
                </div>
                <div className={styles.campo}>
                  <span className={styles.label}>Apellidos *</span>
                  <input
                    className={styles.input}
                    type="text"
                    {...nuevoForm.register("last_name")}
                  />
                  {nuevoForm.formState.errors.last_name && (
                    <span className={styles.errorField}>
                      {nuevoForm.formState.errors.last_name.message}
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Correo *</span>
                <input
                  className={styles.input}
                  type="email"
                  {...nuevoForm.register("email")}
                />
                {nuevoForm.formState.errors.email && (
                  <span className={styles.errorField}>
                    {nuevoForm.formState.errors.email.message}
                  </span>
                )}
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Teléfono</span>
                <input
                  className={styles.input}
                  type="tel"
                  maxLength={13}
                  {...nuevoForm.register("phone_number")}
                />
              </div>
              <div className={styles.g2}>
                <div className={styles.campo}>
                  <span className={styles.label}>Contraseña *</span>
                  <input
                    className={styles.input}
                    type="password"
                    {...nuevoForm.register("password")}
                  />
                  {nuevoForm.formState.errors.password && (
                    <span className={styles.errorField}>
                      {nuevoForm.formState.errors.password.message}
                    </span>
                  )}
                </div>
                <div className={styles.campo}>
                  <span className={styles.label}>Confirmar contraseña *</span>
                  <input
                    className={styles.input}
                    type="password"
                    {...nuevoForm.register("password_confirmation")}
                  />
                  {nuevoForm.formState.errors.password_confirmation && (
                    <span className={styles.errorField}>
                      {nuevoForm.formState.errors.password_confirmation.message}
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Relación *</span>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="ej. Mamá, Papá, Tutor…"
                  {...nuevoForm.register("relationship")}
                />
                {nuevoForm.formState.errors.relationship && (
                  <span className={styles.errorField}>
                    {nuevoForm.formState.errors.relationship.message}
                  </span>
                )}
              </div>
              <div className={styles.toggleRow}>
                <span className={styles.toggleLbl}>Contacto principal</span>
                <div
                  className={`${styles.toggle} ${nuevoPrimario ? styles.togOn : styles.togOff}`}
                  onClick={() =>
                    nuevoForm.setValue("primary_contact", !nuevoPrimario)
                  }
                >
                  <div
                    className={`${styles.tThumb} ${nuevoPrimario ? styles.onPos : styles.offPos}`}
                  />
                </div>
              </div>
              <div className={styles.panelFooter}>
                <button
                  type="button"
                  className={styles.btnConfirmar}
                  onClick={nuevoForm.handleSubmit(confirmarNuevo)}
                >
                  Agregar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Panel: editar relación existente (solo modo editar) ── */}
      {vista === "editar-relacion" && miembroEditando && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitulo}>Editar relación</span>
            <button
              type="button"
              className={styles.btnVolver}
              onClick={resetPanel}
            >
              Cancelar
            </button>
          </div>
          <div>
            {editarForm.formState.errors.root && (
              <div className={styles.errorPanel}>
                {editarForm.formState.errors.root.message}
              </div>
            )}
            <div className={styles.padreCard} style={{ marginBottom: 12 }}>
              <div className={styles.padreInfo}>
                <span className={styles.padreNombre}>
                  {miembroEditando.name} {miembroEditando.last_name}
                </span>
                <span className={styles.padreMeta}>
                  {miembroEditando.email}
                </span>
              </div>
            </div>
            <div className={styles.campo}>
              <span className={styles.label}>Relación *</span>
              <input
                className={styles.input}
                type="text"
                placeholder="ej. Mamá, Papá…"
                {...editarForm.register("relationship")}
              />
              {editarForm.formState.errors.relationship && (
                <span className={styles.errorField}>
                  {editarForm.formState.errors.relationship.message}
                </span>
              )}
            </div>
            <div className={styles.toggleRow}>
              <span className={styles.toggleLbl}>Contacto principal</span>
              <div
                className={`${styles.toggle} ${editarPrimario ? styles.togOn : styles.togOff}`}
                onClick={() =>
                  editarForm.setValue("primary_contact", !editarPrimario)
                }
              >
                <div
                  className={`${styles.tThumb} ${editarPrimario ? styles.onPos : styles.offPos}`}
                />
              </div>
            </div>
            <div className={styles.panelFooter}>
              <button
                type="button"
                onClick={editarForm.handleSubmit((data) =>
                  actualizarMutation.mutate(data),
                )}
                className={styles.btnConfirmar}
                disabled={actualizarMutation.isPending}
              >
                {actualizarMutation.isPending
                  ? "Guardando…"
                  : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
