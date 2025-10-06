import { z } from 'zod';

export const droneStatusValues = ['ativo', 'manutencao', 'inativo'] as const;
export const droneStatusSchema = z.enum(droneStatusValues);

export const createDroneSchema = z.object({
  model: z.string().min(1, 'Modelo obrigatorio'),
  status: droneStatusSchema.default('ativo'),
  batteryPct: z.number().int().min(0).max(100),
  serial: z.string().min(1, 'Serial obrigatorio'),
  notes: z.string().max(500).optional(),
  tenantId: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  manufacturer: z.string().min(1).optional(),
});

export const updateDroneSchema = z
  .object({
    model: z.string().min(1).optional(),
    status: droneStatusSchema.optional(),
    batteryPct: z.number().int().min(0).max(100).optional(),
    serial: z.string().min(1).optional(),
    notes: z.string().max(500).optional(),
    tenantId: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    manufacturer: z.string().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Nenhum campo informado para atualizacao',
  });

export type CreateDroneInput = z.infer<typeof createDroneSchema>;
export type UpdateDroneInput = z.infer<typeof updateDroneSchema>;
