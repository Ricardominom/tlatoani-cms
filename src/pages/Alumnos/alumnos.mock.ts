export const SALONES_FILTER = [
    { label: "Todos", count: 102 },
    { label: "Abejas", count: 22 },
    { label: "Hormigas", count: 24 },
    { label: "Halcones", count: 29 },
    { label: "Lobos", count: 27 },
];

export const ASISTENCIA = [
    { dia: 1, tipo: "vac" }, { dia: 2, tipo: "pres" }, { dia: 3, tipo: "pres" },
    { dia: 4, tipo: "pres" }, { dia: 7, tipo: "pres" }, { dia: 8, tipo: "aus" },
    { dia: 9, tipo: "pres" }, { dia: 10, tipo: "pres" }, { dia: 11, tipo: "pres" },
    { dia: 14, tipo: "pres" }, { dia: 15, tipo: "pres" }, { dia: 16, tipo: "tard" },
    { dia: 17, tipo: "pres" }, { dia: 18, tipo: "pres" }, { dia: 21, tipo: "pres" },
    { dia: 22, tipo: "hoy" },
];

export const AREAS = [
    {
        nombre: "Lenguaje", color: "var(--turquesa)", pct: 0.85, count: 11, nivel: "Logrado", nBg: "var(--verde-light)", nColor:
            "var(--verde-s)"
    },
    {
        nombre: "Matemáticas", color: "var(--amarillo)", pct: 0.62, count: 8, nivel: "En proceso", nBg: "var(--turquesa-light)", nColor:
            "var(--turquesa-s)"
    },
    {
        nombre: "Vida práctica", color: "var(--verde)", pct: 0.62, count: 8, nivel: "En proceso", nBg: "var(--turquesa-light)", nColor:
            "var(--turquesa-s)"
    },
    {
        nombre: "Sensorial", color: "var(--rosa)", pct: 0.38, count: 5, nivel: "Iniciando", nBg: "var(--amarillo-light)", nColor:
            "#B89600"
    },
    {
        nombre: "Cultura", color: "var(--texto-3)", pct: 0.23, count: 3, nivel: "Iniciando", nBg: "var(--gris-bg)", nColor:
            "var(--texto-3)"
    },
];

export const AUTORIZADOS = [
    {
        inicial: "C", nombre: "Carlos Ramírez", rel: "Papá", tel: "222 345 6789", badge: "Principal", bg: "var(--amarillo-light)",
        color: "#7A6200", border: "var(--amarillo)", badgeBg: "var(--amarillo-light)", badgeColor: "#B89600"
    },
    {
        inicial: "L", nombre: "Laura Mendoza", rel: "Mamá", tel: "222 456 7890", badge: "Principal", bg: "var(--rosa-light)",
        color: "var(--rosa-s)", border: "var(--rosa)", badgeBg: "var(--rosa-light)", badgeColor: "var(--rosa-s)"
    },
    {
        inicial: "R", nombre: "Rosa Flores", rel: "Abuela materna", tel: "222 567 8901", badge: "Autorizada", bg: "var(--verde-light)",
        color: "var(--verde-s)", border: "var(--verde)", badgeBg: "var(--verde-light)", badgeColor: "var(--verde-s)"
    },
];

export const BITACORAS = [
    {
        area: "Lenguaje", areaBg: "var(--turquesa-light)", areaColor: "var(--turquesa-s)", fecha: "Hoy · 10:30am", texto: "Completó sola el trabajo de letras móviles.Formó su nombre completo sin ayuda.", nivel: "🌟 Logrado", nivelBg: "var(--verde - light) ",
        nivelColor: "var(--verde-s)"
    },
    {
        area: "Vida práctica", areaBg: "var(--verde-light)", areaColor: "var(--verde-s)", fecha: "Ayer · 2:15pm", texto: "Ayudó a compañeros a servir agua con mucha concentración y cuidado.", nivel: "🌿 En proceso", nivelBg:
            "var(--turquesa-light)", nivelColor: "var(--turquesa-s)"
    },
    {
        area: "Matemáticas", areaBg: "var(--amarillo-light)", areaColor: "#B89600", fecha: "Lun 14 oct", texto: "Exploró las perlas doradas e identificó el cubo de 1000 correctamente.", nivel: "🌿 En proceso", nivelBg: "var(--turquesa - light)",
        nivelColor: "var(--turquesa-s)"
    },
];