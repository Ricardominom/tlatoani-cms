import type { DiaCal, EventoDetalle, MesEventos } from "./types";

export const CELDAS_OCTUBRE: DiaCal[] = [
    // Sep overflow
    { num: 29, otroMes: true, esHoy: false, esSel: false, esFinSemana: false },
    { num: 30, otroMes: true, esHoy: false, esSel: false, esFinSemana: false },
    // Semana 1
    { num: 1, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 2, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 3, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 4, otroMes: false, esHoy: false, esSel: false, esFinSemana: true },
    { num: 5, otroMes: false, esHoy: false, esSel: false, esFinSemana: true },
    // Semana 2
    { num: 6, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 7, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 8, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 9, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 10, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 11, otroMes: false, esHoy: false, esSel: false, esFinSemana: true },
    { num: 12, otroMes: false, esHoy: false, esSel: false, esFinSemana: true },
    // Semana 3
    { num: 13, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 14, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 15, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 16, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 17, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 18, otroMes: false, esHoy: false, esSel: false, esFinSemana: true },
    { num: 19, otroMes: false, esHoy: false, esSel: false, esFinSemana: true },
    // Semana 4
    { num: 20, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 21, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    {
        num: 22, otroMes: false, esHoy: true, esSel: false, esFinSemana: false, dotTipo: "junta",
        pills: [{ label: "Bitácoras Halcones", bg: "#1E1E1E", color: "var(--amarillo)" }]
    },
    { num: 23, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 24, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 25, otroMes: false, esHoy: false, esSel: false, esFinSemana: true, dotTipo: "suspension" },
    { num: 26, otroMes: false, esHoy: false, esSel: false, esFinSemana: true },
    // Semana 5
    { num: 27, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    {
        num: 28, otroMes: false, esHoy: false, esSel: true, esFinSemana: false, dotTipo: "junta",
        pills: [
            { label: "Junta Abejas", bg: "var(--turquesa-light)", color: "var(--turquesa-s)" },
            { label: "Entrega reportes", bg: "var(--amarillo-light)", color: "#7A6200" },
        ]
    },
    { num: 29, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    { num: 30, otroMes: false, esHoy: false, esSel: false, esFinSemana: false },
    {
        num: 31, otroMes: false, esHoy: false, esSel: false, esFinSemana: false, dotTipo: "festival",
        pills: [{ label: "🎃 Festival Halloween", bg: "var(--rosa-light)", color: "var(--rosa-s)" }]
    },
    // Nov overflow
    { num: 1, otroMes: true, esHoy: false, esSel: false, esFinSemana: true },
    { num: 2, otroMes: true, esHoy: false, esSel: false, esFinSemana: true },
];

export const EVENTOS_DIA_SEL: EventoDetalle[] = [
    {
        nombre: "Junta de ambiente — Abejas",
        bg: "var(--turquesa-light)", border: "#A8DFF0",
        dotColor: "var(--turquesa)", textColor: "var(--turquesa-s)",
        tipoTxt: "Junta", tipoBg: "var(--turquesa-light)", tipoColor: "var(--turquesa-s)",
        meta: ["1:15pm – 2:30pm", "Abejas · padres", "Mtra. Sandra"],
    },
    {
        nombre: "Entrega de reportes",
        bg: "var(--amarillo-light)", border: "#F0DC80",
        dotColor: "var(--amarillo)", textColor: "#7A6200",
        tipoTxt: "Administrativo", tipoBg: "var(--amarillo-light)", tipoColor: "#B89600",
        meta: ["Todo el día", "Toda la escuela"],
    },
];

export const DOT_COLOR: Record<string, string> = {
    festival: "var(--rosa)",
    suspension: "var(--rojo)",
    junta: "var(--turquesa)",
    puente: "#F57C00",
};

export const PROXIMOS_EVENTOS: MesEventos[] = [
    {
        nombre: "Octubre 2025",
        eventos: [
            {
                id: 1, dia: 25, mesCorto: "oct", nombre: "Suspensión de clases — Día del maestro",
                fechaBg: "var(--rojo-light)", fechaColor: "var(--rojo)",
                chips: [
                    { label: "Suspensión", bg: "var(--rojo-light)", color: "var(--rojo)" },
                    { label: "Toda la escuela", bg: "var(--gris-bg)", color: "var(--texto-2)" },
                    { label: "Todo el día", bg: "var(--gris-bg)", color: "var(--texto-2)" },
                ],
                estado: "Publicado",
            },
            {
                id: 2, dia: 28, mesCorto: "oct", nombre: "Junta de ambiente — Abejas",
                fechaBg: "var(--turquesa-light)", fechaColor: "var(--turquesa)",
                chips: [
                    { label: "Junta", bg: "var(--turquesa-light)", color: "var(--turquesa-s)" },
                    { label: "Abejas", bg: "var(--amarillo-light)", color: "#7A6200" },
                    { label: "1:15pm", bg: "var(--gris-bg)", color: "var(--texto-2)" },
                ],
                estado: "Publicado",
            },
            {
                id: 3, dia: 31, mesCorto: "oct", nombre: "Festival de Halloween",
                fechaBg: "var(--rosa-light)", fechaColor: "var(--rosa)",
                chips: [
                    { label: "Festival", bg: "var(--rosa-light)", color: "var(--rosa-s)" },
                    { label: "Toda la escuela", bg: "var(--gris-bg)", color: "var(--texto-2)" },
                    { label: "10am – 1pm", bg: "var(--gris-bg)", color: "var(--texto-2)" },
                ],
                estado: "Publicado",
            },
        ],
    },
    {
        nombre: "Noviembre 2025",
        eventos: [
            {
                id: 4, dia: 17, mesCorto: "nov", nombre: "Día de la Revolución — Puente",
                fechaBg: "var(--naranja-light,#FFF3E0)", fechaColor: "#F57C00",
                chips: [
                    { label: "Puente", bg: "#FFF3E0", color: "#F57C00" },
                    { label: "Toda la escuela", bg: "var(--gris-bg)", color: "var(--texto-2)" },
                    { label: "Lun 17 y Mar 18", bg: "var(--gris-bg)", color: "var(--texto-2)" },
                ],
                estado: "Borrador",
            },
            {
                id: 5, dia: 25, mesCorto: "nov", nombre: "Junta de ambiente — Lobos y Halcones",
                fechaBg: "var(--turquesa-light)", fechaColor: "var(--turquesa)",
                chips: [
                    { label: "Junta", bg: "var(--turquesa-light)", color: "var(--turquesa-s)" },
                    { label: "Lobos", bg: "var(--rosa-light)", color: "var(--rosa-s)" },
                    { label: "Halcones", bg: "var(--turquesa-light)", color: "var(--turquesa-s)" },
                    { label: "1:15pm", bg: "var(--gris-bg)", color: "var(--texto-2)" },
                ],
                estado: "Borrador",
            },
        ],
    },
    {
        nombre: "Diciembre 2025",
        eventos: [
            {
                id: 6, dia: 12, mesCorto: "dic", nombre: "Festival de Navidad y posada escolar",
                fechaBg: "var(--rosa-light)", fechaColor: "var(--rosa)",
                chips: [
                    { label: "Festival", bg: "var(--rosa-light)", color: "var(--rosa-s)" },
                    { label: "Toda la escuela", bg: "var(--gris-bg)", color: "var(--texto-2)" },
                    { label: "9am – 1pm", bg: "var(--gris-bg)", color: "var(--texto-2)" },
                ],
                estado: "Borrador",
            },
            {
                id: 7, dia: 19, mesCorto: "dic", nombre: "Último día de clases — primer semestre",
                fechaBg: "var(--verde-light)", fechaColor: "var(--verde-s)",
                chips: [
                    { label: "Fin de período", bg: "var(--verde-light)", color: "var(--verde-s)" },
                    { label: "Toda la escuela", bg: "var(--gris-bg)", color: "var(--texto-2)" },
                ],
                estado: "Borrador",
            },
        ],
    },
];