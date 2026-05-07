import type { ApiGroup } from "../Grupos/types";
  export type { PaginatedResponse } from "../Grupos/types";                                                                                   
                                          
  // ── TIPOS DE LA API                                                             
                                                                                                                                              
  export interface ApiStudent {                                                                                                               
    id: string;                                                                                                                               
    name: string; 
    last_name: string;
    birth_date: string;
    curp: string;
    photo_path: string | null;
    blood_type: string | null;
    allergies: string | null;
    medicines: string | null;
    active: boolean;
    created_at: string;
    updated_at: string;
    group: ApiGroup | null;
  }

  // ── TIPO DE FORMULARIO 
  export interface AlumnoForm {
    group_uuid: string;
    name: string;
    last_name: string;
    birth_date: string;
    curp: string;
    blood_type: string;
    allergies: string;
    medicines: string;
    active: boolean;
  }

  // ── TIPOS DE UI

  export type FiltroAlumnos = "todos" | "activos" | "inactivos";