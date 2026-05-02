export interface Alumno {
    id: number;
    nombre: string;
    inicial: string;
    salon: string;
    nivel: string;
    edad: string;
    status: "Presente" | "Ausente" | "Retardo";
}