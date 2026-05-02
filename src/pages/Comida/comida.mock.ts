import type { Turno, AlumnoDisponible, RecetaDia } from "./types";

export const SALONES_COMIDA = [
  "Abejas", "Hormigas", "Halcones", "Lobos", "Leones", "Pandas", "Pollitos"
];

export const TURNOS: Turno[] = [
  {
    id: 1, diaNum: 3, diaNombre: "Lun",
    alumno: { nombre: "Sofía Ramírez", familia: "Fam. Ramírez", inicial: "S", salon: "Abejas" },
    platillo: "Sopa de fideos", estado: "Entrego", tipo: "pasado",
  },
  {
    id: 2, diaNum: 4, diaNombre: "Mar",
    alumno: { nombre: "Valeria Torres", familia: "Fam. Torres", inicial: "V", salon: "Abejas" },
    platillo: "Arroz con pollo", estado: "Entrego", tipo: "pasado",
  },
  {
    id: 3, diaNum: 5, diaNombre: "Hoy",
    alumno: { nombre: "Emilio Vega", familia: "Fam. Vega", inicial: "E", salon: "Abejas" },
    platillo: "Pasta boloñesa", estado: "Confirmo", tipo: "hoy",
  },
  {
    id: 4, diaNum: 6, diaNombre: "Jue",
    alumno: { nombre: "Lucas Hernández", familia: "Fam. Hernández", inicial: "L", salon: "Abejas" },
    platillo: "Quesadillas con frijoles", estado: "Pendiente", tipo: "asignado",
  },
  {
    id: 5, diaNum: 7, diaNombre: "Vie",
    alumno: { nombre: "Isabela Moreno", familia: "Fam. Moreno", inicial: "I", salon: "Abejas" },
    platillo: "", estado: "SinReceta", tipo: "sinReceta",
  },
  {
    id: 6, diaNum: 10, diaNombre: "Lun",
    alumno: null, platillo: "", estado: "SinAsignar", tipo: "vacio",
  },
  {
    id: 7, diaNum: 11, diaNombre: "Mar",
    alumno: null, platillo: "", estado: "SinAsignar", tipo: "vacio",
  },
  {
    id: 8, diaNum: 12, diaNombre: "Mié",
    alumno: { nombre: "Mateo López", familia: "Fam. López", inicial: "M", salon: "Abejas" },
    platillo: "Enchiladas verdes", estado: "Pendiente", tipo: "asignado",
  },
];

export const ALUMNOS_DISPONIBLES: AlumnoDisponible[] = [
  { nombre: "Diego Castillo", familia: "Fam. Castillo", inicial: "D", salon: "Abejas", asignado: false, turnoTxt: "Sin turno en nov" },
  { nombre: "Ana Flores", familia: "Fam. Flores", inicial: "A", salon: "Abejas", asignado: false, turnoTxt: "Sin turno en nov" },
  { nombre: "Pablo Soto", familia: "Fam. Soto", inicial: "P", salon: "Abejas", asignado: false, turnoTxt: "Sin turno en nov" },
  {
    nombre: "Sofía Ramírez", familia: "Fam. Ramírez", inicial: "S", salon: "Abejas", asignado: true, turnoTxt: "Nov 3 · Sopa de fideos"
  },
  {
    nombre: "Valeria Torres", familia: "Fam. Torres", inicial: "V", salon: "Abejas", asignado: true, turnoTxt: "Nov 4 · Arroz con pollo"
  },
];

export const RECETA_HOY: RecetaDia = {
  alumnoNombre: "Emilio",
  diaTxt: "Nov 5",
  platillo: "Pasta boloñesa",
  porciones: 22,
  ingredientes: [
    { item: "Carne molida de res", cantidad: "2.5 kg" },
    { item: "Pasta espagueti", cantidad: "1.8 kg" },
    { item: "Jitomate bola", cantidad: "1.2 kg" },
    { item: "Cebolla blanca", cantidad: "3 pzas" },
    { item: "Puré de tomate", cantidad: "800 ml" },
    { item: "Aceite, sal y pimienta", cantidad: "" },
  ],
  nota: "Traer cubiertos desechables y recipiente con tapa antes de las 12:30pm",
};