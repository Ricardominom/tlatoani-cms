export type TipoFila = "pasado" | "hoy" | "asignado" | "sinReceta" | "vacio";
export type EstadoTurno = "Entrego" | "Confirmo" | "Pendiente" | "SinReceta" | "SinAsignar";

export interface AlumnoTurno {
    nombre: string;
    familia: string;
    inicial: string;
    salon: string;
}

export interface Turno {
    id: number;
    diaNum: number;
    diaNombre: string;
    alumno: AlumnoTurno | null;
    platillo: string;
    estado: EstadoTurno;
    tipo: TipoFila;
}

export interface AlumnoDisponible {
    nombre: string;
    familia: string;
    inicial: string;
    salon: string;
    asignado: boolean;
    turnoTxt: string;
}

export interface RecetaIngrediente {
    item: string;
    cantidad: string;
}

export interface RecetaDia {
    alumnoNombre: string;
    diaTxt: string;
    platillo: string;
    porciones: number;
    ingredientes: RecetaIngrediente[];
    nota: string;
}