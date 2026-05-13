import { z } from 'zod';

// Nivel
export const nivelSchema = z.object({
    id: z.number(),
    uuid: z.string(),
    name: z.string(),
    description: z.string(),
    order: z.number()
})

export type Nivel = z.infer<typeof nivelSchema>

// Grupos
export const grupoSchema = z.object({
    uuid: z.string(),
    level_uuid: z.string(),
    name: z.string(),
    teacher_id: z.number(),
    color: z.string(),
    icon_path: z.string(),
    entry_time: z.string(),
    dismissal_time: z.string(),
    monthly_fee: z.number(),
    capacity: z.string(),
    active: z.string(),
})

export type Grupo = z.infer<typeof grupoSchema>
export type GrupoFormData = Pick<Grupo, 'name' | 'color' | 'icon_path' | 'entry_time'| 'dismissal_time' | 'monthly_fee' | 'capacity' | 'active'>