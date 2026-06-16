import { mealSchema, mealShiftSchema, type MealFormData, type MealShiftFormData } from "../types";
import api from "./api";
import { isAxiosError } from "axios";
import { z } from "zod";

type FiltrosMeals = {
    search?: string;
    per_page?: number;
    order_by?: string;
    order_direction?: 'asc' | 'desc';
}

type FiltrosMealShifts = {
    student_uuid?: string;
    meal_uuid?: string;
    date?: string;
    status?: 'pending' | 'confirmed' | 'served' | 'cancelled';
    per_page?: number;
}

function handleServiceError(error: unknown): never {
    if (isAxiosError(error)) {
        const message = (error.response?.data as { message?: string })?.message ?? error.message;
        throw new Error(message, { cause: error });
    }
    throw error;
}

const mealsResponseSchema = z.object({ data: z.array(mealSchema) });
const mealShiftsResponseSchema = z.object({ data: z.array(mealShiftSchema) });

export async function getMeals(params?: FiltrosMeals) {
    try {
        const res = await api.get<unknown>('/v1/meals', { params });
        return mealsResponseSchema.parse(res.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function crearMeal(data: MealFormData) {
    try {
        const res = await api.post<unknown>('/v1/meals', data);
        const body = res.data as { data: unknown };
        return mealSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function actualizarMeal(uuid: string, data: Partial<MealFormData>) {
    try {
        const res = await api.put<unknown>(`/v1/meals/${uuid}`, data);
        const body = res.data as { data: unknown };
        return mealSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function getMealShifts(params?: FiltrosMealShifts) {
    try {
        const res = await api.get<unknown>('/v1/meal-shifts', { params });
        return mealShiftsResponseSchema.parse(res.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function crearMealShift(data: MealShiftFormData) {
    try {
        const res = await api.post<unknown>('/v1/meal-shifts', data);
        const body = res.data as { data: unknown };
        return mealShiftSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function actualizarMealShift(uuid: string, data: Partial<MealShiftFormData>) {
    try {
        const res = await api.put<unknown>(`/v1/meal-shifts/${uuid}`, data);
        const body = res.data as { data: unknown };
        return mealShiftSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}