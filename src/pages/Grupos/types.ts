
// TIPOS DE LA API

export interface ApiLevel {
    id: string;
    name: string;
    description: string | null;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface ApiGroup {
    id: string;
    uuid: string;
    level_id: number;
    teacher_id: number | null;
    name: string;
    color: string;
    icon_path: string | null;
    entry_time: string | null;
    dismissal_time: string | null;
    monthly_fee: string;
    capacity: number;
    active: boolean;
    created_at: string;
    updated_at: string;
    level?: ApiLevel;
}

export interface PaginatedResponse<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

// TIPOS DE FORMULARIOS (modales)
export interface NivelForm {
    name: string;
    description: string;
    order: number;
}

export interface GrupoForm {
    level_uuid: string;
    name: string;
    color: string;
    icon_path: string;
    entry_time: string;
    dismissal_time: string;
    monthly_fee: string;
    capacity: number;
    active: boolean;
}

// TIPOS DE UI (componente interno)

export type StatusAsist = "Presente" | "Ausente" | "Retardo";
export type FiltroAsist = "todos" | "presentes" | "ausentes";

export interface AlumnoGrupo {
    id: number;
    inicial: string;
    nombre: string;
    familia: string;
    edad: string;
    status: StatusAsist;
    ultimaBitacora: string;
    bitacoraAlerta?: boolean;
}