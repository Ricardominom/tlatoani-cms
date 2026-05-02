export type TipoEvento = "Festival" | "Suspension" | "Junta" | "Puente" | "Administrativo" | "FinPeriodo";
export type EstadoEvento = "Publicado" | "Borrador";

export interface DiaCal {
    num: number;
    otroMes: boolean;
    esHoy: boolean;
    esSel: boolean;
    esFinSemana: boolean;
    dotTipo?: "festival" | "suspension" | "junta" | "puente";
    pills?: { label: string; bg: string; color: string }[];
}

export interface EventoDetalle {
    nombre: string;
    bg: string;
    border: string;
    dotColor: string;
    textColor: string;
    tipoBg: string;
    tipoColor: string;
    tipoTxt: string;
    meta: string[];
}

export interface ChipEvento {
    label: string;
    bg: string;
    color: string;
}

export interface EventoLista {
    id: number;
    dia: number;
    mesCorto: string;
    nombre: string;
    chips: ChipEvento[];
    fechaBg: string;
    fechaColor: string;
    estado: EstadoEvento;
}

export interface MesEventos {
    nombre: string;
    eventos: EventoLista[];
}