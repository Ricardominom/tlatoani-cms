import { isAxiosError } from "axios";
import { alumnoSchema, paginatedResponseSchema, type Alumno, type AlumnoFormData, type AlumnosPaginados } from "../types";
import api from "./api";

type FiltrosAlumno = {
    search?: string;
    group_uuid?: string;
    active?: boolean;
    order_by?: "name" | "last_name" | "birth_date" | "curp" | "active";
    order_direction?: "asc" | "desc";
    per_page?: number;
}

const alumnosPaginadosSchema = paginatedResponseSchema(alumnoSchema);

function toPayload(form: AlumnoFormData): Record<string, unknown> {
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

function handleServiceError(error: unknown): never {
    if(isAxiosError(error)) {
        const message = (error.response?.data as { message?: string})?.message ?? error.message;
        throw new Error(message, { cause: error });
    }
    throw error;
}

export async function getAlumnos(params?: FiltrosAlumno): Promise<AlumnosPaginados> {
    try {
        const res = await api.get("/v1/students", { params });
        const parse = alumnosPaginadosSchema.parse(res.data);
        return parse;
    } catch (error) {
        handleServiceError(error);
    }
}

export async function crearAlumno(data: AlumnoFormData): Promise<Alumno> {
    try {
        const res = await api.post<{ data: unknown }>("/v1/students", toPayload(data));
        const parse = alumnoSchema.parse(res.data.data);
        return parse;
    } catch (error) {
        handleServiceError(error);
    }
}

export async function actualizarAlumno(uuid: string, data: AlumnoFormData): Promise<Alumno> {
    try {
        const res = await api.put<{ data: unknown }>(`/v1/students/${uuid}`, toPayload(data));
        const parse = alumnoSchema.parse(res.data.data);
        return parse;
    } catch (error) {
        handleServiceError(error);
    }
}

export async function eliminarAlumno(uuid: string): Promise<void> {
    try {
        await api.delete(`/v1/students/${uuid}`);
    } catch (error) {
        handleServiceError(error);
    }
}