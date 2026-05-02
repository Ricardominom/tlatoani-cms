import type { Comunicado, ConfRow } from "./types";

export const COMUNICADOS: Comunicado[] = [
    {
        id: 1,
        titulo: "Suspensión de clases — 25 de octubre",
        preview: "El próximo viernes 25 no habrá clases por el día del maestro…",
        body: "Estimadas familias,\n\nLes comunicamos que el próximo viernes 25 de octubre no habrá clases en el colegio, con motivo del Día del Maestro.\n\nLas actividades se reanudan con normalidad el lunes 28 de octubre.Agradecemos su comprensión y les deseamos un excelente fin de semana largo.",
      tipo: "Urgente",
        destinos: ["Toda la escuela"],
        status: "publicado",
        fecha: "Hoy · 8am",
        confirmados: 74,
        totalFamilias: 102,
        adjunto: { nombre: "Calendario_octubre_2025.pdf", size: "245 KB · PDF" }
    },
    {
        id: 2,
        titulo: "Junta de ambiente — Abejas · 28 oct",
        preview: "Los invitamos a la junta de ambiente el martes 28 de octubre…",
        body: "Estimadas familias de Abejas,\n\nLes invitamos a la junta de ambiente del martes 28 de octubre a las 8:00am en el salón principal.La asistencia es muy importante para el buen funcionamiento del grupo.",
      tipo: "Junta",
        destinos: ["Abejas"],
        status: "publicado",
        fecha: "Ayer · 3pm",
        confirmados: 18,
        totalFamilias: 22
    },
    {
        id: 3,
        titulo: "Festival de Halloween · 31 oct",
        preview: "Este jueves 31 celebraremos Halloween con disfraces y actividades…",
        body: "Estimadas familias,\n\nEste jueves 31 de octubre celebraremos nuestro festival de Halloween. Los niños pueden venir disfrazados. Habrá actividades y dulces para todos.",
      tipo: "Festival",
        destinos: ["Toda la escuela"],
        status: "publicado",
        fecha: "Lun 20 oct",
        confirmados: 89,
        totalFamilias: 100
    },
    {
        id: 4,
        titulo: "Menú de comida — Abejas noviembre",
        preview: "El menú de comida compartida para el mes de noviembre ya está…",
        body: "Estimadas familias de Abejas,\n\nEl menú de comida compartida para el mes de noviembre ya está disponible. Por favor revisen el calendario adjunto y confirmen su participación.",
      tipo: "Comida",
        destinos: ["Abejas"],
        status: "publicado",
        fecha: "Lun 20 oct",
        confirmados: 22,
        totalFamilias: 22
    }
];

export const CONFIRMACIONES: ConfRow[] = [
    {
        inicial: "R", nombre: "Familia Ramírez", hijos: "Sofía · Diego", hora: "Hoy · 8:14am", leyo: true, bg: "var(--amarillo-light)",
        color: "#7A6200", border: "var(--amarillo)"
    },
    {
        inicial: "V", nombre: "Familia Vega", hijos: "Emilio", hora: "Hoy · 8:22am", leyo: true, bg: "var(--verde-light)",
        color: "var(--verde-s)", border: "var(--verde)"
    },
    {
        inicial: "H", nombre: "Familia Hernández", hijos: "Lucas · Renata", hora: "Hoy · 9:01am", leyo: true, bg: "var(--turquesa-light)",
        color: "var(--turquesa-s)", border: "var(--turquesa)"
    },
    {
        inicial: "G", nombre: "Familia García", hijos: "Mia", hora: "Hoy · 9:45am", leyo: true, bg: "var(--rosa-light)",
        color: "var(--rosa-s)", border: "var(--rosa)"
    },
    {
        inicial: "M", nombre: "Familia Mendoza", hijos: "Carlos", hora: "Hoy · 10:12am", leyo: true, bg: "#F0F0F0",
        color: "#888", border: "#D0D0D0"
    },
    {
        inicial: "P", nombre: "Familia Pérez", hijos: "Ana", hora: "—", leyo: false, bg: "#F0F0F0",
        color: "#888", border: "#D0D0D0"
    },
    {
        inicial: "L", nombre: "Familia López", hijos: "Mateo · Sandra", hora: "—", leyo: false, bg: "#F0F0F0",
        color: "#888", border: "#D0D0D0"
    },
];