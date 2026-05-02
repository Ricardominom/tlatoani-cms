import type { GrupoUsuarios, Permiso, ActividadItem } from "./types";

export const GRUPOS_USUARIOS: GrupoUsuarios[] = [
    {
        label: "Administradores · 2",
        usuarios: [
            {
                id: 1, nombre: "Directora Martínez", inicial: "M",
                email: "maria.martinez@tlatoani.mx",
                rol: "Directivo", rolTxt: "Directivo",
                avBg: "#1E1E1E", avColor: "var(--amarillo)", avBorder: "rgba(245,200,0,0.3)",
                rolBg: "#1E1E1E", rolColor: "var(--amarillo)",
                online: true, ultimoAcceso: "En línea",
            },
            {
                id: 2, nombre: "Ana Martínez", inicial: "A",
                email: "ana.martinez@tlatoani.mx",
                rol: "Administrativa", rolTxt: "Administrativa",
                avBg: "var(--amarillo-light)", avColor: "#7A6200", avBorder: "var(--amarillo)",
                rolBg: "var(--amarillo-light)", rolColor: "#B89600", rolBorder: "#F0DC80",
                online: true, ultimoAcceso: "En línea",
            },
        ],
    },
    {
        label: "Maestros · 4",
        usuarios: [
            {
                id: 3, nombre: "Sandra García", inicial: "S",
                email: "sandra.garcia@tlatoani.mx",
                rol: "Maestra", rolTxt: "Maestra", grupo: "Abejas",
                avBg: "var(--turquesa-light)", avColor: "var(--turquesa-s)", avBorder: "var(--turquesa)",
                rolBg: "var(--turquesa-light)", rolColor: "var(--turquesa-s)",
                online: false, ultimoAcceso: "Hace 2h",
            },
            {
                id: 4, nombre: "Lupita Sánchez", inicial: "L",
                email: "lupita.sanchez@tlatoani.mx",
                rol: "Maestra", rolTxt: "Maestra", grupo: "Hormigas",
                avBg: "var(--verde-light)", avColor: "var(--verde-s)", avBorder: "var(--verde)",
                rolBg: "var(--verde-light)", rolColor: "var(--verde-s)",
                online: false, ultimoAcceso: "Ayer",
            },
            {
                id: 5, nombre: "Roberto Lima", inicial: "R",
                email: "roberto.lima@tlatoani.mx",
                rol: "Maestro", rolTxt: "Maestro", grupo: "Halcones",
                avBg: "var(--turquesa-light)", avColor: "var(--turquesa-s)", avBorder: "var(--turquesa)",
                rolBg: "var(--turquesa-light)", rolColor: "var(--turquesa-s)",
                online: false, ultimoAcceso: "Hace 1h",
            },
        ],
    },
    {
        label: "Padres · 93 (mostrando 4)",
        usuarios: [
            {
                id: 6, nombre: "Carlos Ramírez", inicial: "C",
                email: "carlos.ramirez@gmail.com",
                rol: "Padre", rolTxt: "Padre", hijos: "Sofía · Diego",
                avBg: "var(--amarillo-light)", avColor: "#7A6200", avBorder: "var(--amarillo)",
                rolBg: "var(--amarillo-light)", rolColor: "#B89600",
                online: false, ultimoAcceso: "Hace 30min",
            },
            {
                id: 7, nombre: "Familia Torres", inicial: "T",
                email: "torres.fam@gmail.com",
                rol: "SinAcceder", rolTxt: "Sin acceder", hijos: "Valeria",
                avBg: "var(--rosa-light)", avColor: "var(--rosa-s)", avBorder: "var(--rosa)",
                rolBg: "var(--rojo-light)", rolColor: "var(--rojo)",
                online: false, ultimoAcceso: "Nunca",
            },
            {
                id: 8, nombre: "Familia Vargas", inicial: "V",
                email: "vargas@gmail.com",
                rol: "Inactivo", rolTxt: "Inactivo", hijos: "Tomás",
                avBg: "#F0F0F0", avColor: "#888", avBorder: "#D0D0D0",
                rolBg: "#F5F5F5", rolColor: "#AAA",
                online: false, ultimoAcceso: "Dado de baja",
                inactivo: true,
            },
        ],
    },
];

export const PERMISOS: Permiso[] = [
    {
        key: "familias", label: "Familias", sub: "Ver y editar", iconBg: "var(--verde-light)", iconColor:
            "var(--verde-s)"
    },
    {
        key: "alumnos", label: "Alumnos", sub: "Ver y editar", iconBg: "var(--verde-light)", iconColor:
            "var(--verde-s)"
    },
    {
        key: "colegiaturas", label: "Colegiaturas", sub: "Ver, editar y registrar pagos", iconBg: "var(--rojo-light)", iconColor:
            "var(--rojo)"
    },
    {
        key: "comunicados", label: "Comunicados", sub: "Publicar a toda la escuela", iconBg: "var(--turquesa-light)", iconColor:
            "var(--turquesa-s)"
    },
    {
        key: "comida", label: "Comida compartida", sub: "Editar menú y publicar", iconBg: "var(--amarillo-light)", iconColor:
            "var(--amarillo-s)"
    },
    {
        key: "galeria", label: "Galería", sub: "Subir y organizar eventos", iconBg: "var(--rosa-light)", iconColor:
            "var(--rosa-s)"
    },
    {
        key: "usuarios", label: "Usuarios", sub: "Dar de alta y editar", iconBg: "#F0EDFA", iconColor:
            "#6B4FBB"
    },
    {
        key: "reportes", label: "Reportes", sub: "Solo lectura", iconBg: "var(--gris-bg)", iconColor:
            "var(--texto-2)"
    },
];

export const PERMISOS_DEFAULT: Record<string, "on" | "mid" | "off"> = {
    familias: "on", alumnos: "on", colegiaturas: "on", comunicados: "on",
    comida: "on", galeria: "on", usuarios: "mid", reportes: "off",
};

export const ACTIVIDAD: ActividadItem[] = [
    { texto: "Registró pago de ", bold: "Familia Vega", hora: "Hoy · 10:15am", color: "var(--verde)" },
    { texto: "Publicó comunicado de ", bold: "suspensión", hora: "Hoy · 8:00am", color: "var(--turquesa)" },
    { texto: "Editó menú de comida de ", bold: "Abejas", hora: "Ayer · 4:30pm", color: "var(--amarillo)" },
    { texto: "Dio de alta a ", bold: "Familia Mendoza", hora: "Lun 20 oct", color: "var(--rosa)" },
];