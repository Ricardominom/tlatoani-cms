import api from "./api";
import type { ApiStudent, AlumnoForm, PaginatedResponse } from "../pages/Alumnos/types";

function toPayload(form: AlumnoForm): Record<string, unknown> {
    return {
        group_uuid: form.group_uuid || undefined,
        name: form.name,
        last_name: form.last_name,
        birth_date: form.birth_date,
        curp: form.curp.toUpperCase(),
        blood_type: form.blood_type || null,
        allergies: form.allergies || null,
        medicines: form.medicines || null,
        active: form.active,
    };
}

export async function getAlumnos(params?: {
    search?: string;
    group_uuid?: string;
    active?: boolean;
    order_by?: "name" | "last_name" | "birth_date" | "curp" | "active";
    order_direction?: "asc" | "desc";
    per_page?: number;
}) {
    const res = await api.get<PaginatedResponse<ApiStudent>>("/v1/students", { params });
    return res.data;
}

export async function crearAlumno(data: AlumnoForm): Promise<ApiStudent> {
    const res = await api.post<{ data: ApiStudent }>("/v1/students", toPayload(data));
    return res.data.data;
}

export async function actualizarAlumno(uuid: string, data: AlumnoForm): Promise<ApiStudent> {
    const res = await api.put<{ data: ApiStudent }>(`/v1/students/${uuid}`, toPayload(data));
    return res.data.data;
}

export async function eliminarAlumno(uuid: string): Promise<void> {
    await api.delete(`/v1/students/${uuid}`);
}