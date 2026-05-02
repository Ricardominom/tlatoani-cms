export type PagoStatus = "Al corriente" | "Vencido" | "Proximo";

export interface HijoRef {
    nombre: string;
    salon: string;
}

export interface Padre {
    inicial: string;
    nombre: string;
    telefono: string;
    email: string;
    rol: string;
}

export interface MesColegiatura {
    mes: string;
    monto: number;
    status: "pagado" | "proximo" | "pendiente";
    pct: number;
    diasRestantes?: number;
}

export interface ActividadItem {
    color: string;
    texto: string;
    bold: string;
    fecha: string;
}

export interface Familia {
    id: number;
    inicial: string;
    nombre: string;
    hijos: HijoRef[];
    monto: number;
    pagoStatus: PagoStatus;
    diasRestantes?: number;
    contacto: string;
    telefono: string;
    email: string;
    desde: string;
    padres: Padre[];
    colegiatura: MesColegiatura[];
    actividad: ActividadItem[];
    mesesPagados: number;
    mesesPendientes: number;
    totalPagado: string;
    avisosConfirmados: number;
    bitacorasRecibidas: number;
    notif: {
        avisos: boolean;
        colegiatura: boolean;
        comida: boolean;
        galeria: boolean;
    };
}