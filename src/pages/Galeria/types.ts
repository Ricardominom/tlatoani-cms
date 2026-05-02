export type TipoEvento = "Festival" | "Excursion" | "Actividad" | "InicioCiclo";
export type EstadoEvento = "Borrador" | "Publicado";
export type FotoVariante = "normal" | "tall" | "wide";

export interface Evento {
    id: number;
    nombre: string;
    emoji: string;
    fechaTxt: string;
    tipo: TipoEvento;
    tipoTxt: string;
    fotos: number;
    estado: EstadoEvento;
    thumbBg: string;
    tagBg: string;
    tagColor: string;
    heroBg: string;
    heroColor: string;
    heroChipBg: string;
    heroChipColor: string;
    heroMeta: string;
}

export interface FotoItem {
    id: number;
    emoji: string;
    bg: string;
    salon: string;
    variante: FotoVariante;
}