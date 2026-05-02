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
    {
      id: 5,
      nombre: "Hormigas", nivel: "Comunidad Infantil · Maternal",
      guia: { inicial: "L", nombre: "Laura Pérez", rol: "Guía Montessori", desde: "2023", email: "laura.perez@tlatoani.mx", avBg:
  "var(--verde-light)", avColor: "var(--verde-s)", avBorder: "var(--verde)" },
      totalAlumnos: 18, presentes: 16, ausentes: 2,
      alumnos: [
        { id: 1, inicial: "A", nombre: "Aldo Reyes",     familia: "Reyes",   edad: "2 años", status: "Presente", ultimaBitacora: "Hoy · Sensorial" },
        { id: 2, inicial: "B", nombre: "Bianca Torres",  familia: "Torres",  edad: "3 años", status: "Presente", ultimaBitacora: "Ayer · Vida práctica" },
        { id: 3, inicial: "C", nombre: "Carlos Ibáñez",  familia: "Ibáñez",  edad: "2 años", status: "Ausente",  ultimaBitacora: "Hace 4 días", bitacoraAlerta: true },
        { id: 4, inicial: "D", nombre: "Diana Soto",     familia: "Soto",    edad: "3 años", status: "Presente", ultimaBitacora: "Hoy · Lenguaje" },
        { id: 5, inicial: "E", nombre: "Ernesto Gil",    familia: "Gil",     edad: "2 años", status: "Presente", ultimaBitacora: "Hace 2 días"
   },
        { id: 6, inicial: "F", nombre: "Fernanda Cruz",  familia: "Cruz",    edad: "3 años", status: "Ausente",  ultimaBitacora: "Hace 3 días"
   },
      ],
      stats: [
        { num: "89%", lbl: "Asistencia promedio", color: "var(--verde)" },
        { num: "62",  lbl: "Bitácoras escritas",  color: "var(--turquesa)" },
        { num: "22",  lbl: "Avisos publicados",   color: "var(--amarillo-s)" },
        { num: "85%", lbl: "Confirmaciones",      color: "var(--verde-s)" },
      ],
      config: { nivel: "Maternal", horario: "8:00am – 12:00pm", capacidad: "20 alumnos", cuota: "$2,800 MXN" },
      actividad: [
        { color: "var(--verde)",    bold: "Laura",      texto: " registró bitácora de Diana · Lenguaje",   hora: "Hoy · 9:15am"  },
        { color: "var(--rojo)",     bold: "Carlos",     texto: " reportó ausencia hoy",                    hora: "Hoy · 7:50am"  },
        { color: "var(--turquesa)", bold: "12 familias",texto: " confirmaron aviso semanal",               hora: "Ayer · 6pm"    },
        { color: "var(--amarillo)", texto: "Menú de comida publicado",                                     hora: "Ayer · 3pm"    },
      ],
    },
    {
      id: 6,
      nombre: "Leones", nivel: "Taller 1 · Primaria baja",
      guia: { inicial: "M", nombre: "Miguel Sosa", rol: "Guía Montessori", desde: "2021", email: "miguel.sosa@tlatoani.mx", avBg: "#FFF3E0",
  avColor: "#C25F00", avBorder: "#FF8C00" },
      totalAlumnos: 24, presentes: 21, ausentes: 3,
      alumnos: [
        { id: 1, inicial: "G", nombre: "Gabriel Ríos",   familia: "Ríos",    edad: "7 años", status: "Presente", ultimaBitacora: "Hoy · Historia" },
        { id: 2, inicial: "H", nombre: "Héctor Lara",    familia: "Lara",    edad: "8 años", status: "Presente", ultimaBitacora: "Ayer · Matemáticas" },
        { id: 3, inicial: "I", nombre: "Iris Campos",    familia: "Campos",  edad: "7 años", status: "Ausente",  ultimaBitacora: "Hace 3 días"
   },
        { id: 4, inicial: "J", nombre: "Jorge Medina",   familia: "Medina",  edad: "8 años", status: "Presente", ultimaBitacora: "Hoy · Ciencias" },
        { id: 5, inicial: "K", nombre: "Karen Peña",     familia: "Peña",    edad: "7 años", status: "Presente", ultimaBitacora: "Sin bitácora esta semana", bitacoraAlerta: true },
        { id: 6, inicial: "L", nombre: "Luis Navarro",   familia: "Navarro", edad: "8 años", status: "Ausente",  ultimaBitacora: "Hace 5 días"
   },
      ],
      stats: [
        { num: "88%", lbl: "Asistencia promedio", color: "var(--verde)" },
        { num: "175", lbl: "Bitácoras escritas",  color: "var(--turquesa)" },
        { num: "36",  lbl: "Avisos publicados",   color: "var(--amarillo-s)" },
        { num: "90%", lbl: "Confirmaciones",      color: "var(--verde-s)" },
      ],
      config: { nivel: "Taller 1", horario: "8:00am – 2:00pm", capacidad: "30 alumnos", cuota: "$3,500 MXN" },
      actividad: [
        { color: "#FF8C00",         bold: "Miguel",      texto: " publicó plan de proyectos",               hora: "Hoy · 8:00am"  },
        { color: "var(--verde)",    bold: "Gabriel",     texto: " · bitácora registrada en Historia",        hora: "Hoy · 10:30am" },
        { color: "var(--rojo)",     bold: "2 alumnos",   texto: " reportaron ausencia hoy",                 hora: "Hoy · 7:55am"  },
        { color: "var(--turquesa)", bold: "18 familias", texto: " confirmaron aviso de la semana",           hora: "Ayer · 5pm"    },
      ],
    },
    {
      id: 7,
      nombre: "Pandas", nivel: "Comunidad Infantil · Maternal",
      guia: { inicial: "V", nombre: "Valeria Mora", rol: "Guía Montessori", desde: "2024", email: "valeria.mora@tlatoani.mx", avBg: "#EDE9FF",
   avColor: "#4A3DAF", avBorder: "#6B5CE7" },
      totalAlumnos: 10, presentes: 9, ausentes: 1,
      alumnos: [
        { id: 1, inicial: "M", nombre: "Maya Romo",      familia: "Romo",    edad: "2 años", status: "Presente", ultimaBitacora: "Hoy · Vida práctica" },
        { id: 2, inicial: "N", nombre: "Nicolás Aguilar",familia: "Aguilar", edad: "2 años", status: "Presente", ultimaBitacora: "Ayer · Sensorial" },
        { id: 3, inicial: "O", nombre: "Olivia Stein",   familia: "Stein",   edad: "3 años", status: "Ausente",  ultimaBitacora: "Hace 2 días"
   },
        { id: 4, inicial: "P", nombre: "Pablo Meza",     familia: "Meza",    edad: "2 años", status: "Presente", ultimaBitacora: "Hoy · Lenguaje" },
        { id: 5, inicial: "Q", nombre: "Quetzal Díaz",   familia: "Díaz",    edad: "3 años", status: "Presente", ultimaBitacora: "Hace 3 días"
   },
        { id: 6, inicial: "R", nombre: "Renata Fuentes", familia: "Fuentes", edad: "2 años", status: "Presente", ultimaBitacora: "Sin bitácora esta semana", bitacoraAlerta: true },
      ],
      stats: [
        { num: "90%", lbl: "Asistencia promedio", color: "var(--verde)" },
        { num: "38",  lbl: "Bitácoras escritas",  color: "var(--turquesa)" },
        { num: "14",  lbl: "Avisos publicados",   color: "var(--amarillo-s)" },
        { num: "92%", lbl: "Confirmaciones",      color: "var(--verde-s)" },
      ],
      config: { nivel: "Maternal", horario: "8:00am – 12:00pm", capacidad: "12 alumnos", cuota: "$2,800 MXN" },
      actividad: [
        { color: "#6B5CE7",         bold: "Valeria",     texto: " registró bitácora de Maya · Vida práctica", hora: "Hoy · 9:00am"  },
        { color: "var(--turquesa)", bold: "8 familias",  texto: " confirmaron aviso semanal",                 hora: "Hoy · 10am"    },
        { color: "var(--rojo)",     bold: "Olivia",      texto: " reportó ausencia hoy",                      hora: "Hoy · 7:58am"  },
        { color: "var(--amarillo)", texto: "Menú de comida publicado",                                        hora: "Ayer · 3pm"    },
      ],
    },
];