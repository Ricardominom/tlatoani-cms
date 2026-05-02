export type Tipo =
    | "General"
    | "Urgente"
    | "Festival"
    | "Junta"
    | "Comida"
    | "Recordatorio";

export type Filtro = "todos" | "borrador" | "publicado";

export interface Comunicado {
    id: number;
    titulo: string;
    preview: string;
    body: string;
    tipo: Tipo;
    destinos: string[];
    status: "publicado" | "borrador";
    fecha: string;
    confirmados?: number;
    totalFamilias?: number;
    adjunto?: { nombre: string; size: string };
}

export interface ConfRow {
    inicial: string;
    nombre: string;
    hijos: string;
    hora: string;
    leyo: boolean;
    bg: string;
    color: string;
    border: string;
}