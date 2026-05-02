import type { FamiliaColeg, MesCiclo } from "./types";

export const FAMILIAS_COLEG: FamiliaColeg[] = [
    {
        id: 1, nombre: "Familia López", inicial: "L",
        avBg: "var(--rojo-light)", avColor: "var(--rojo)", avBorder: "#F5C8C8",
        hijos: [{ nombre: "Mateo", salon: "Abejas" }],
        cuotaMensual: 3200, monto: 6400,
        estado: "Vencido", vencimientoTxt: "Vencido hace 5 días", estadoTxt: "Vencido · 2 meses",
        mesesPagados: 8, mesesPendientes: 2, mesesPendientesList: ["Noviembre", "Diciembre"],
    },
    {
        id: 2, nombre: "Familia Torres", inicial: "T",
        avBg: "var(--rojo-light)", avColor: "var(--rojo)", avBorder: "#F5C8C8",
        hijos: [{ nombre: "Valeria", salon: "Abejas" }],
        cuotaMensual: 3200, monto: 3200,
        estado: "Vencido", vencimientoTxt: "Vencido hace 5 días", estadoTxt: "Vencido",
        mesesPagados: 9, mesesPendientes: 1, mesesPendientesList: ["Noviembre"],
    },
    {
        id: 3, nombre: "Familia Ramírez", inicial: "R",
        avBg: "var(--amarillo-light)", avColor: "#7A6200", avBorder: "var(--amarillo)",
        hijos: [{ nombre: "Sofía", salon: "Abejas" }, { nombre: "Diego", salon: "Halcones" }],
        cuotaMensual: 3200, monto: 6400,
        estado: "EstaSemana", vencimientoTxt: "Vie 25 oct · 3 días", estadoTxt: "Vence en 3 días",
        mesesPagados: 8, mesesPendientes: 2, mesesPendientesList: ["Noviembre", "Diciembre"],
    },
    {
        id: 4, nombre: "Familia Mendoza", inicial: "M",
        avBg: "var(--turquesa-light)", avColor: "var(--turquesa-s)", avBorder: "var(--turquesa)",
        hijos: [{ nombre: "Carlos", salon: "Halcones" }],
        cuotaMensual: 3200, monto: 3200,
        estado: "EstaSemana", vencimientoTxt: "Vie 25 oct · 3 días", estadoTxt: "Vence en 3 días",
        mesesPagados: 9, mesesPendientes: 1, mesesPendientesList: ["Noviembre"],
    },
    {
        id: 5, nombre: "Familia Vega", inicial: "V",
        avBg: "var(--verde-light)", avColor: "var(--verde-s)", avBorder: "var(--verde)",
        hijos: [{ nombre: "Emilio", salon: "Abejas" }],
        cuotaMensual: 3200, monto: 3200,
        estado: "AlCorriente", vencimientoTxt: "Pagado el 10 oct", estadoTxt: "✓ Al corriente",
        mesesPagados: 10, mesesPendientes: 0, mesesPendientesList: [],
    },
    {
        id: 6, nombre: "Familia Hernández", inicial: "H",
        avBg: "#F0F0F0", avColor: "#555", avBorder: "#D0D0D0",
        hijos: [{ nombre: "Lucas", salon: "Abejas" }, { nombre: "Renata", salon: "Lobos" }],
        cuotaMensual: 6400, monto: 6400,
        estado: "AlCorriente", vencimientoTxt: "Pagado el 8 oct", estadoTxt: "✓ Al corriente",
        mesesPagados: 10, mesesPendientes: 0, mesesPendientesList: [],
    },
];

export const MESES_CICLO: MesCiclo[] = [
    { nombre: "Ago", tipo: "ok" },
    { nombre: "Sep", tipo: "ok" },
    { nombre: "Oct", tipo: "ok" },
    { nombre: "Nov", tipo: "ok" },
    { nombre: "Dic", tipo: "ok" },
    { nombre: "Ene", tipo: "ok" },
    { nombre: "Feb", tipo: "ok" },
    { nombre: "Mar", tipo: "ok" },
    { nombre: "Abr", tipo: "pend" },
    { nombre: "May", tipo: "fut" },
];