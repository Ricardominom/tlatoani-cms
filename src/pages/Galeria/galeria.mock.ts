import type { Evento, FotoItem } from "./types";

export const EVENTOS: Evento[] = [
    {
        id: 1, nombre: "Festival de Halloween", emoji: "🎃",
        fechaTxt: "31 oct 2025", tipo: "Festival", tipoTxt: "Festival", fotos: 14,
        estado: "Borrador",
        thumbBg: "linear-gradient(135deg,var(--rosa-light),#F8C8E0)",
        tagBg: "var(--rosa-light)", tagColor: "var(--rosa-s)",
        heroBg: "linear-gradient(135deg,var(--rosa-light),#F8D0E8)",
        heroColor: "var(--rosa-s)",
        heroChipBg: "rgba(229,41,126,0.1)", heroChipColor: "var(--rosa-s)",
        heroMeta: "Toda la escuela · 10am–1pm",
    },
    {
        id: 2, nombre: "Festival de otoño", emoji: "🍂",
        fechaTxt: "18 oct 2025", tipo: "Festival", tipoTxt: "Festival", fotos: 28,
        estado: "Publicado",
        thumbBg: "linear-gradient(135deg,var(--turquesa-light),#B8E8F5)",
        tagBg: "var(--turquesa-light)", tagColor: "var(--turquesa-s)",
        heroBg: "linear-gradient(135deg,var(--turquesa-light),#C8F0F8)",
        heroColor: "var(--turquesa-s)",
        heroChipBg: "rgba(0,174,204,0.1)", heroChipColor: "var(--turquesa-s)",
        heroMeta: "Toda la escuela · 9am–12pm",
    },
    {
        id: 3, nombre: "Excursión al jardín botánico", emoji: "🌿",
        fechaTxt: "10 oct 2025", tipo: "Excursion", tipoTxt: "Excursión", fotos: 41,
        estado: "Publicado",
        thumbBg: "linear-gradient(135deg,var(--verde-light),#C8EAA8)",
        tagBg: "var(--verde-light)", tagColor: "var(--verde-s)",
        heroBg: "linear-gradient(135deg,var(--verde-light),#D4F0B8)",
        heroColor: "var(--verde-s)",
        heroChipBg: "rgba(123,196,65,0.12)", heroChipColor: "var(--verde-s)",
        heroMeta: "Casa de niños · 8am–2pm",
    },
    {
        id: 4, nombre: "Experimentos de ciencias", emoji: "🔬",
        fechaTxt: "2 oct 2025", tipo: "Actividad", tipoTxt: "Actividad", fotos: 19,
        estado: "Publicado",
        thumbBg: "linear-gradient(135deg,var(--amarillo-light),#FFE880)",
        tagBg: "var(--amarillo-light)", tagColor: "#B89600",
        heroBg: "linear-gradient(135deg,var(--amarillo-light),#FFF0A0)",
        heroColor: "var(--amarillo-s)",
        heroChipBg: "rgba(245,200,0,0.15)", heroChipColor: "#7A6200",
        heroMeta: "Primaria · 10am–12pm",
    },
    {
        id: 5, nombre: "Primer día del ciclo", emoji: "🎒",
        fechaTxt: "18 ago 2025", tipo: "InicioCiclo", tipoTxt: "Inicio ciclo", fotos: 22,
        estado: "Publicado",
        thumbBg: "linear-gradient(135deg,#E8F0FE,#C8D8F8)",
        tagBg: "var(--verde-light)", tagColor: "var(--verde-s)",
        heroBg: "linear-gradient(135deg,#E8F0FE,#D0E0FC)",
        heroColor: "#3B5EA6",
        heroChipBg: "rgba(59,94,166,0.1)", heroChipColor: "#3B5EA6",
        heroMeta: "Toda la escuela · 8am–1pm",
    },
];

export const FOTOS_HALLOWEEN: FotoItem[] = [
    { id: 1, emoji: "👻", bg: "linear-gradient(135deg,#2D1B4E,#4A2070)", salon: "Abejas", variante: "tall" },
    { id: 2, emoji: "🎃", bg: "linear-gradient(135deg,#FF6B35,#FF9A3C)", salon: "Todos", variante: "normal" },
    { id: 3, emoji: "🧙", bg: "linear-gradient(135deg,#1B4E2D,#2A7A3E)", salon: "Hormigas", variante: "normal" },
    { id: 4, emoji: "🕷️", bg: "linear-gradient(135deg,#4A0E1A,#8B1A2A)", salon: "Halcones", variante: "wide" },
    { id: 5, emoji: "🦇", bg: "linear-gradient(135deg,#2D1B00,#6B4400)", salon: "Lobos", variante: "normal" },
    { id: 6, emoji: "🌙", bg: "linear-gradient(135deg,#3B0E4E,#6B1A7A)", salon: "Abejas", variante: "normal" },
    { id: 7, emoji: "🍬", bg: "linear-gradient(135deg,#4E2B0E,#8B5A1A)", salon: "Todos", variante: "normal" },
    { id: 8, emoji: "⭐", bg: "linear-gradient(135deg,#0E1B4E,#1A3B8B)", salon: "Hormigas", variante: "normal" },
];

export const SALONES_GALERIA = ["Todos", "Abejas", "Hormigas", "Halcones", "Lobos"];