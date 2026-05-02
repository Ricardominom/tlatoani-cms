import type { Familia } from "./types";

export const FAMILIAS: Familia[] = [
    {
        id: 1,
        inicial: "R", nombre: "Familia Ramírez",
        hijos: [{ nombre: "Sofía", salon: "Abejas" }, { nombre: "Diego", salon: "Halcones" }],
        monto: 6400, pagoStatus: "Proximo", diasRestantes: 3,
        contacto: "Carlos Ramírez", telefono: "222 345 6789", email: "carlos.ramirez@gmail.com", desde: "ago 2024",
        padres: [
            { inicial: "C", nombre: "Carlos Ramírez", telefono: "222 345 6789", email: "carlos@gmail.com", rol: "Principal" },
            { inicial: "L", nombre: "Laura Mendoza", telefono: "222 456 7890", email: "laura@gmail.com", rol: "Mamá" },
        ],
        colegiatura: [
            { mes: "Ago 2025", monto: 3200, status: "pagado", pct: 1.0 },
            { mes: "Sep 2025", monto: 3200, status: "pagado", pct: 1.0 },
            { mes: "Oct 2025", monto: 3200, status: "pagado", pct: 1.0 },
            { mes: "Nov 2025", monto: 3200, status: "pendiente", pct: 0.6, diasRestantes: 3 },
            { mes: "Dic 2025", monto: 3200, status: "proximo", pct: 0.4 },
        ],
        actividad: [
            {
                color: "var(--turquesa)", bold: "Carlos", texto: " confirmó lectura del aviso de excursión", fecha: "Hoy · 9:10am"
            },
            {
                color: "var(--verde)", bold: "Pago de octubre", texto: " registrado · $3,200", fecha: "10 oct · 11:30am"
            },
            {
                color: "var(--rosa)", bold: "Mtra. Sandra", texto: " publicó bitácora de Sofía · Lenguaje", fecha: "Ayer · 10:30am"
            },
            {
                color: "var(--amarillo)", bold: "Turno de comida", texto: " de Sofía confirmado · pasta boloñesa", fecha: "Lun 21 oct · 8am"
            },
            {
                color: "var(--texto-3)", bold: "Diego", texto: " inscrito en Halcones · Taller 1", fecha: "Ago 2024 ·
  inscripción"},
      ],
        mesesPagados: 8, mesesPendientes: 2, totalPagado: "$25,600", avisosConfirmados: 14, bitacorasRecibidas: 28,
        notif: { avisos: true, colegiatura: true, comida: true, galeria: false },
    },
    {
        id: 2,
        inicial: "L", nombre: "Familia López",
        hijos: [{ nombre: "Mateo", salon: "Abejas" }],
        monto: 6400, pagoStatus: "Vencido",
        contacto: "Miguel López", telefono: "222 111 2222", email: "miguel.lopez@gmail.com", desde: "ene 2024",
        padres: [{ inicial: "M", nombre: "Miguel López", telefono: "222 111 2222", email: "miguel.lopez@gmail.com", rol: "Principal" }],
        colegiatura: [
            { mes: "Ago 2025", monto: 3200, status: "pagado", pct: 1.0 },
            { mes: "Sep 2025", monto: 3200, status: "pagado", pct: 1.0 },
            { mes: "Oct 2025", monto: 3200, status: "pendiente", pct: 0.3 },
            { mes: "Nov 2025", monto: 3200, status: "pendiente", pct: 0.0 },
        ],
        actividad: [
            { color: "var(--rojo)", bold: "Pago octubre", texto: " vencido hace 5 días", fecha: "5 oct · vencido" },
            { color: "var(--verde)", bold: "Pago sept", texto: " registrado · $3,200", fecha: "2 sep · 10am" },
        ],
        mesesPagados: 6, mesesPendientes: 4, totalPagado: "$19,200", avisosConfirmados: 9, bitacorasRecibidas: 12,
        notif: { avisos: true, colegiatura: false, comida: true, galeria: false },
    },
    {
        id: 3,
        inicial: "T", nombre: "Familia Torres",
        hijos: [{ nombre: "Valeria", salon: "Abejas" }],
        monto: 3200, pagoStatus: "Vencido",
        contacto: "Ana Torres", telefono: "222 333 4444", email: "ana.torres@gmail.com", desde: "ago 2023",
        padres: [{ inicial: "A", nombre: "Ana Torres", telefono: "222 333 4444", email: "ana.torres@gmail.com", rol: "Principal" }],
        colegiatura: [
            { mes: "Ago 2025", monto: 3200, status: "pagado", pct: 1.0 },
            { mes: "Sep 2025", monto: 3200, status: "pagado", pct: 1.0 },
            { mes: "Oct 2025", monto: 3200, status: "pendiente", pct: 0.0 },
        ],
        actividad: [
            { color: "var(--rojo)", bold: "Pago oct", texto: " sin registrar", fecha: "Pendiente" },
            { color: "var(--verde)", bold: "Pago sep", texto: " registrado · $3,200", fecha: "1 sep" },
        ],
        mesesPagados: 5, mesesPendientes: 3, totalPagado: "$16,000", avisosConfirmados: 7, bitacorasRecibidas: 9,
        notif: { avisos: true, colegiatura: true, comida: false, galeria: false },
    },
    {
        id: 4,
        inicial: "V", nombre: "Familia Vega",
        hijos: [{ nombre: "Emilio", salon: "Abejas" }],
        monto: 3200, pagoStatus: "Al corriente",
        contacto: "Roberto Vega", telefono: "222 555 6666", email: "roberto.vega@gmail.com", desde: "ago 2024",
        padres: [{ inicial: "R", nombre: "Roberto Vega", telefono: "222 555 6666", email: "roberto.vega@gmail.com", rol: "Principal" }],
        colegiatura: [
            { mes: "Ago 2025", monto: 3200, status: "pagado", pct: 1.0 },
            { mes: "Sep 2025", monto: 3200, status: "pagado", pct: 1.0 },
            { mes: "Oct 2025", monto: 3200, status: "pagado", pct: 1.0 },
        ],
        actividad: [
            { color: "var(--verde)", bold: "Pago oct", texto: " registrado · $3,200", fecha: "1 oct" },
        ],
        mesesPagados: 8, mesesPendientes: 0, totalPagado: "$25,600", avisosConfirmados: 11, bitacorasRecibidas: 10,
        notif: { avisos: true, colegiatura: true, comida: true, galeria: true },
    },
    {
        id: 5,
        inicial: "H", nombre: "Familia Hernández",
        hijos: [{ nombre: "Lucas", salon: "Abejas" }, { nombre: "Renata", salon: "Lobos" }],
        monto: 6400, pagoStatus: "Al corriente",
        contacto: "Pedro Hernández", telefono: "222 777 8888", email: "pedro.hdz@gmail.com", desde: "ene 2023",
        padres: [{ inicial: "P", nombre: "Pedro Hernández", telefono: "222 777 8888", email: "pedro.hdz@gmail.com", rol: "Principal" }],
        colegiatura: [
            { mes: "Ago 2025", monto: 3200, status: "pagado", pct: 1.0 },
            { mes: "Sep 2025", monto: 3200, status: "pagado", pct: 1.0 },
            { mes: "Oct 2025", monto: 3200, status: "pagado", pct: 1.0 },
        ],
        actividad: [
            { color: "var(--verde)", bold: "Pago oct", texto: " registrado · $6,400", fecha: "1 oct" },
        ],
        mesesPagados: 10, mesesPendientes: 0, totalPagado: "$32,000", avisosConfirmados: 18, bitacorasRecibidas: 22,
        notif: { avisos: true, colegiatura: true, comida: true, galeria: true },
    },
];