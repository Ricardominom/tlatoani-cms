import { z } from 'zod';

// Nivel
export const nivelSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    order: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
})

// Grupos
export const grupoSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    teacher_id: z.number(),
    color: z.string(),
    icon_path: z.string().nullable(),
    entry_time: z.string().nullable(),
    dismissal_time: z.string().nullable,
    monthly_fee: z.string(),
    capacity: z.number(),
    active: z.string(),
    level: nivelSchema,
    created_at: z.string(),
    updated_at: z.string(),
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

export type PaginatedResponseS = z.infer<ReturnType<typeof paginatedResponseSchema<typeof grupoSchema>>>

export type NivelFormData = Pick<Nivel, 'name' | 'description' | 'order'>
export type GrupoFormData = Pick<Grupo, 'name' | 'color' | 'icon_path' | 'entry_time'| 'dismissal_time' | 'monthly_fee' | 'capacity' | 'active'>