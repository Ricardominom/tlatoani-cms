export type PagoEstado = "Vencido" | "EstaSemana" | "AlCorriente";
export type FiltroColeg = "todas" | "vencidas" | "estaSemana" | "corriente";

export interface HijoColeg {
    nombre: string;
    salon: string;
}

export interface FamiliaColeg {
    id: number;
    nombre: string;
    inicial: string;
    avBg: string;
    avColor: string;
    avBorder: string;
    hijos: HijoColeg[];
    cuotaMensual: number;
    monto: number;
    estado: PagoEstado;
    vencimientoTxt: string;
    estadoTxt: string;
    mesesPagados: number;
    mesesPendientes: number;
    mesesPendientesList: string[];
}

export interface MesCiclo {
    nombre: string;
    tipo: "ok" | "pend" | "fut";
}