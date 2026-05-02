import type { Grupo } from "./types";

export const GRUPOS: Grupo[] = [
    {
        id: 1,
        nombre: "Pollitos", nivel: "Comunidad Infantil · Maternal",
        guia: {
            inicial: "P", nombre: "Paola Reyes", rol: "Guía Montessori", desde: "2023", email: "paola.reyes@tlatoani.mx", avBg:
                "var(--amarillo-light)", avColor: "#B89600", avBorder: "var(--amarillo)"
        },
        totalAlumnos: 12, presentes: 11, ausentes: 1,
        alumnos: [
            { id: 1, inicial: "A", nombre: "Alicia Fuentes", familia: "Fuentes", edad: "2 años", status: "Presente", ultimaBitacora: "Hoy · Vida práctica" },
            { id: 2, inicial: "B", nombre: "Bruno Salinas", familia: "Salinas", edad: "2 años", status: "Presente", ultimaBitacora: "Ayer · Sensorial" },
            { id: 3, inicial: "C", nombre: "Camila Reyes", familia: "Reyes", edad: "3 años", status: "Presente", ultimaBitacora: "Hace 3 días" },
            { id: 4, inicial: "D", nombre: "Daniel Ortiz", familia: "Ortiz", edad: "2 años", status: "Ausente", ultimaBitacora: "Hace 5 días", bitacoraAlerta: true },
            { id: 5, inicial: "E", nombre: "Elena Vargas", familia: "Vargas", edad: "3 años", status: "Presente", ultimaBitacora: "Hoy · Lenguaje" },
            { id: 6, inicial: "F", nombre: "Felipe Mora", familia: "Mora", edad: "2 años", status: "Presente", ultimaBitacora: "Hace 2 días" },
        ],
        stats: [
            { num: "92%", lbl: "Asistencia promedio", color: "var(--verde)" },
            { num: "44", lbl: "Bitácoras escritas", color: "var(--turquesa)" },
            { num: "18", lbl: "Avisos publicados", color: "var(--amarillo-s)" },
            { num: "88%", lbl: "Confirmaciones", color: "var(--verde-s)" },
        ],
        config: { nivel: "Maternal", horario: "8:00am – 12:00pm", capacidad: "14 alumnos", cuota: "$2,800 MXN" },
        actividad: [
            { color: "var(--verde)", bold: "Paola", texto: " registró bitácora de Alicia · Vida práctica", hora: "Hoy · 9:00am" },
            { color: "var(--turquesa)", bold: "3 familias", texto: " confirmaron aviso de la semana", hora: "Hoy · 8:45am" },
            { color: "var(--amarillo)", texto: "Menú de comida compartida publicado", hora: "Ayer · 3pm" },
            { color: "var(--rosa)", bold: "Daniel", texto: " reportó ausencia hoy", hora: "Hoy · 7:55am" },
        ],
    },
    {
        id: 2,
        nombre: "Abejas", nivel: "Casa de niños · Preescolar",
        guia: {
            inicial: "S", nombre: "Sandra García", rol: "Guía Montessori", desde: "2022", email: "sandra.garcia@tlatoani.mx", avBg:
                "var(--turquesa-light)", avColor: "var(--turquesa-s)", avBorder: "var(--turquesa)"
        },
        totalAlumnos: 22, presentes: 19, ausentes: 3,
        alumnos: [
            { id: 1, inicial: "S", nombre: "Sofía Ramírez", familia: "Ramírez", edad: "4 años", status: "Presente", ultimaBitacora: "Hoy · Lenguaje" },
            { id: 2, inicial: "V", nombre: "Valeria Torres", familia: "Torres", edad: "4 años", status: "Retardo", ultimaBitacora: "Hace 3 días" },
            { id: 3, inicial: "M", nombre: "Mateo López", familia: "López", edad: "5 años", status: "Ausente", ultimaBitacora: "Hace 5 días" },
            { id: 4, inicial: "E", nombre: "Emilio Vega", familia: "Vega", edad: "4 años", status: "Presente", ultimaBitacora: "Hoy · Matemáticas" },
            { id: 5, inicial: "L", nombre: "Lucas Hernández", familia: "Hernández", edad: "5 años", status: "Presente", ultimaBitacora: "Hace 3 días · Sensorial" },
            { id: 6, inicial: "I", nombre: "Isabela Moreno", familia: "Moreno", edad: "4 años", status: "Presente", ultimaBitacora: "Sin bitácora esta semana", bitacoraAlerta: true },
        ],
        stats: [
            { num: "86%", lbl: "Asistencia promedio", color: "var(--verde)" },
            { num: "148", lbl: "Bitácoras escritas", color: "var(--turquesa)" },
            { num: "34", lbl: "Avisos publicados", color: "var(--amarillo-s)" },
            { num: "91%", lbl: "Confirmaciones", color: "var(--verde-s)" },
        ],
        config: { nivel: "Casa de niños", horario: "8:00am – 1:00pm", capacidad: "25 alumnos", cuota: "$3,200 MXN" },
        actividad: [
            { color: "var(--turquesa)", bold: "Mtra. Sandra", texto: " publicó aviso de excursión", hora: "Hoy · 8:30am" },
            { color: "var(--verde)", bold: "Sofía", texto: " · bitácora registrada en Lenguaje", hora: "Hoy · 10:30am" },
            { color: "var(--amarillo)", texto: "Menú de comida compartida publicado", hora: "Ayer · 3pm" },
            { color: "var(--rosa)", bold: "17 familias", texto: " confirmaron aviso de excursión", hora: "Hoy · 11am" },
        ],
    },
    {
        id: 3,
        nombre: "Halcones", nivel: "Taller 1 · Primaria baja",
        guia: {
            inicial: "R", nombre: "Roberto Lima", rol: "Guía Montessori", desde: "2021", email: "roberto.lima@tlatoani.mx", avBg:
                "var(--verde-light)", avColor: "var(--verde-s)", avBorder: "var(--verde)"
        },
        totalAlumnos: 29, presentes: 24, ausentes: 5,
        alumnos: [
            { id: 1, inicial: "D", nombre: "Diego Ramírez", familia: "Ramírez", edad: "7 años", status: "Presente", ultimaBitacora: "Hoy · Matemáticas" },
            { id: 2, inicial: "P", nombre: "Paula Castillo", familia: "Castillo", edad: "7 años", status: "Presente", ultimaBitacora: "Ayer · Lenguaje" },
            { id: 3, inicial: "J", nombre: "Juan Mendoza", familia: "Mendoza", edad: "8 años", status: "Ausente", ultimaBitacora: "Hace 4 días" },
            { id: 4, inicial: "A", nombre: "Ana Guzmán", familia: "Guzmán", edad: "7 años", status: "Presente", ultimaBitacora: "Hoy · Ciencias" },
            { id: 5, inicial: "R", nombre: "Rodrigo Pena", familia: "Pena", edad: "8 años", status: "Presente", ultimaBitacora: "Hace 2 días · Cultura" },
            { id: 6, inicial: "N", nombre: "Nicole Flores", familia: "Flores", edad: "7 años", status: "Ausente", ultimaBitacora: "Sin bitácora esta semana", bitacoraAlerta: true },
        ],
        stats: [
            { num: "83%", lbl: "Asistencia promedio", color: "var(--verde)" },
            { num: "201", lbl: "Bitácoras escritas", color: "var(--turquesa)" },
            { num: "41", lbl: "Avisos publicados", color: "var(--amarillo-s)" },
            { num: "87%", lbl: "Confirmaciones", color: "var(--verde-s)" },
        ],
        config: { nivel: "Taller 1", horario: "8:00am – 2:00pm", capacidad: "30 alumnos", cuota: "$3,500 MXN" },
        actividad: [
            { color: "var(--verde)", bold: "Mtro. Roberto", texto: " publicó plan de la semana", hora: "Hoy · 8:00am" },
            { color: "var(--turquesa)", bold: "Diego", texto: " · bitácora registrada en Matemáticas", hora: "Hoy · 10:00am" },
            { color: "var(--rojo)", bold: "2 alumnos", texto: " reportaron ausencia hoy", hora: "Hoy · 7:50am" },
            { color: "var(--amarillo)", texto: "Excursión confirmada para el viernes", hora: "Ayer · 5pm" },
        ],
    },
    {
        id: 4,
        nombre: "Lobos", nivel: "Taller 2 · Primaria alta",
        guia: {
            inicial: "C", nombre: "Carmen Ruiz", rol: "Guía Montessori", desde: "2020", email: "carmen.ruiz@tlatoani.mx", avBg:
                "var(--rosa-light)", avColor: "var(--rosa-s)", avBorder: "var(--rosa)"
        },
        totalAlumnos: 27, presentes: 23, ausentes: 4,
        alumnos: [
            { id: 1, inicial: "R", nombre: "Renata Hernández", familia: "Hernández", edad: "9 años", status: "Presente", ultimaBitacora: "Hoy · Historia" },
            { id: 2, inicial: "T", nombre: "Tomás García", familia: "García", edad: "10 años", status: "Presente", ultimaBitacora: "Ayer · Geografía" },
            { id: 3, inicial: "M", nombre: "Mia García", familia: "García", edad: "9 años", status: "Ausente", ultimaBitacora: "Hace 3 días" },
            { id: 4, inicial: "G", nombre: "Gabriel Ruiz", familia: "Ruiz", edad: "10 años", status: "Presente", ultimaBitacora: "Hoy · Matemáticas" },
            { id: 5, inicial: "V", nombre: "Valentina Cruz", familia: "Cruz", edad: "9 años", status: "Presente", ultimaBitacora: "Hace 2 días · Lenguaje" },
            { id: 6, inicial: "H", nombre: "Hugo Sánchez", familia: "Sánchez", edad: "10 años", status: "Ausente", ultimaBitacora: "Sin bitácora esta semana", bitacoraAlerta: true },
        ],
        stats: [
            { num: "85%", lbl: "Asistencia promedio", color: "var(--verde)" },
            { num: "189", lbl: "Bitácoras escritas", color: "var(--turquesa)" },
            { num: "38", lbl: "Avisos publicados", color: "var(--amarillo-s)" },
            { num: "89%", lbl: "Confirmaciones", color: "var(--verde-s)" },
        ],
        config: { nivel: "Taller 2", horario: "8:00am – 2:30pm", capacidad: "30 alumnos", cuota: "$3,800 MXN" },
        actividad: [
            { color: "var(--rosa)", bold: "Mtra. Carmen", texto: " publicó aviso de proyecto final", hora: "Hoy · 9:00am" },
            { color: "var(--verde)", bold: "Renata", texto: " · bitácora registrada en Historia", hora: "Hoy · 11:00am" },
            { color: "var(--rojo)", bold: "2 alumnos", texto: " reportaron ausencia hoy", hora: "Hoy · 7:55am" },
            { color: "var(--turquesa)", bold: "20 familias", texto: " confirmaron aviso de proyecto final", hora: "Ayer · 4pm" },
        ],
    },
];