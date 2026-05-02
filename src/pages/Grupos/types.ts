
export type StatusAsist = "Presente" | "Ausente" | "Retardo";
export type FiltroAsist = "todos" | "presentes" | "ausentes";

export interface AlumnoGrupo {
    id: number;
    inicial: string;
    nombre: string;
    familia: string;
    edad: string;
    status: StatusAsist;
    ultimaBitacora: string;
    bitacoraAlerta?: boolean;
}

export interface Guia {
    inicial: string;
    nombre: string;
    rol: string;
    desde: string;
    email: string;
    avBg: string;
    avColor: string;
    avBorder: string;
}

export interface StatGrupo {
    num: string;
    lbl: string;
    color: string;
}

export interface ConfigGrupo {
    nivel: string;
    horario: string;
    capacidad: string;
    cuota: string;
}

export interface ActividadGrupo {
    color: string;
    bold?: string;
    texto: string;
    hora: string;
}

export interface Grupo {
    id: number;
    nombre: string;
    nivel: string;
    guia: Guia;
    totalAlumnos: number;
    presentes: number;
    ausentes: number;
    alumnos: AlumnoGrupo[];
    stats: StatGrupo[];
    config: ConfigGrupo;
    actividad: ActividadGrupo[];
}