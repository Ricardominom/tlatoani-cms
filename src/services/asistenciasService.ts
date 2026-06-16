import { attendanceSchema, type AttendanceFormData } from "../types";
import api from "./api";
import { isAxiosError } from "axios";
import { z } from "zod";

type FiltrosAsistencias = {
    student_uuid?: string;
    group_uuid?: string;
    date?: string;
    status?: 'present' | 'absent' | 'late' | 'excused';
    per_page?: number;
    order_by?: string;
    order_direction?: 'asc' | 'desc';
}

function handleServiceError(error: unknown): never {
    if (isAxiosError(error)) {
        const message = (error.response?.data as { message?: string })?.message ?? error.message;
        throw new Error(message, { cause: error });
    }
    throw error;
}

const asistenciasResponseSchema = z.object({ data: z.array(attendanceSchema) });

export async function getAsistencias(params?: FiltrosAsistencias) {
    try {
        const res = await api.get<unknown>('/v1/attendances', { params });
        return asistenciasResponseSchema.parse(res.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function crearAsistencia(data: AttendanceFormData) {
    try {
        const res = await api.post<unknown>('/v1/attendances', data);
        const body = res.data as { data: unknown };
        return attendanceSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function actualizarAsistencia(uuid: string, data: Partial<AttendanceFormData>) {
    try {
        const res = await api.put<unknown>(`/v1/attendances/${uuid}`, data);
        const body = res.data as { data: unknown };
        return attendanceSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}