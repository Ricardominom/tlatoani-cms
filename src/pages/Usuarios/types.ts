export type RolUsuario = "Directivo" | "Administrativa" | "Maestra" | "Maestro" | "Padre" | "SinAcceder" | "Inactivo";
export type FiltroRol = "todos" | "padres" | "maestros" | "admin";
export type PermisoEstado = "on" | "mid" | "off";

export interface Usuario {
    id: number;
    nombre: string;
    inicial: string;
    email: string;
    rol: RolUsuario;
    rolTxt: string;
    grupo?: string;
    hijos?: string;
    avBg: string;
    avColor: string;
    avBorder: string;
    rolBg: string;
    rolColor: string;
    rolBorder?: string;
    online: boolean;
    ultimoAcceso: string;
    inactivo?: boolean;
}

export interface GrupoUsuarios {
    label: string;
    usuarios: Usuario[];
}

export interface Permiso {
    key: string;
    label: string;
    sub: string;
    iconBg: string;
    iconColor: string;
}

export interface ActividadItem {
    texto: string;
    bold: string;
    hora: string;
    color: string;
}