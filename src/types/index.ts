import { z } from 'zod';

// Nivel
export const nivelSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    order: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
});
export const nivelFormSchema = z.object({
    name: z.string().min(1, 'El nombre del nivel es requerido'),
    description: z.string().nullable(),
    order: z.number().min(1, 'El orden debe ser mayor a 0')
});

// Grupos
export const grupoSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    teacher_id: z.number().optional(),
    color: z.string(),
    icon_path: z.string().nullable(),
    entry_time: z.string().nullable(),
    dismissal_time: z.string().nullable(),
    monthly_fee: z.string(),
    capacity: z.number(),
    active: z.boolean(),
    level: nivelSchema.optional(),
    created_at: z.string(),
    updated_at: z.string(),
})
export const grupoFormSchema = z.object({
    name: z.string().min(1, 'El nombre del grupo es requerido'),
    color: z.string().min(1, 'El color es requerido'),
    icon_path: z.string().nullable(),
    entry_time: z.string().nullable(),
    dismissal_time: z.string().nullable(),
    monthly_fee: z.string(),
    capacity: z.number(),
    active: z.boolean(),
    level_uuid: z.string().min(1, 'El nivel es requerido'),
})

//Respues de pagina
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
    z.object({
        data: z.array(itemSchema),
        links: z.object({
            first: z.string().nullable(),
            last: z.string().nullable(),
            prev: z.string().nullable(),   
            next: z.string().nullable(),  
        }),
        meta: z.object({
            current_page: z.number(),
            from: z.number(),             
            last_page: z.number(),        
            per_page: z.number(),
            to: z.number(),              
            total: z.number(),
            path: z.string(),             
            links: z.array(z.object({     
                url: z.string().nullable(),
                label: z.string(),
                page: z.number().nullable(),
                active: z.boolean(),
            })),
        }),
    })

export type Nivel = z.infer<typeof nivelSchema>
export type Grupo = z.infer<typeof grupoSchema>

export type PaginatedResponse<T extends z.ZodTypeAny> = z.infer<ReturnType<typeof paginatedResponseSchema<T>>>

export type NivelFormData = z.infer<typeof nivelFormSchema>
export type GrupoFormData = z.infer<typeof grupoFormSchema>
export type NivelesPaginados = PaginatedResponse<typeof nivelSchema>
export type GruposPaginados = PaginatedResponse<typeof grupoSchema>