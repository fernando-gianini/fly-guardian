import { z } from 'zod';

export const missionStatusValues = ['planejada', 'em_execucao', 'concluida', 'falha'] as const;
export const missionStatusSchema = z.enum(missionStatusValues);

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const waypointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  alt: z.number().min(0),
  speed: z.number().positive().optional(),
});

export const createMissionSchema = z.object({
  name: z.string().min(1, 'Nome obrigatorio'),
  droneId: z.string().regex(objectIdRegex, 'DroneId invalido'),
  waypoints: z.array(waypointSchema).min(1, 'Informe ao menos um waypoint'),
  etaSeconds: z.number().int().positive(),
  status: missionStatusSchema.default('planejada'),
  tenantId: z.string().min(1).optional(),
  notes: z.string().max(1000).optional(),
});

export const updateMissionSchema = z
  .object({
    name: z.string().min(1).optional(),
    droneId: z.string().regex(objectIdRegex, 'DroneId invalido').optional(),
    waypoints: z.array(waypointSchema).min(1).optional(),
    etaSeconds: z.number().int().positive().optional(),
    status: missionStatusSchema.optional(),
    tenantId: z.string().min(1).optional(),
    notes: z.string().max(1000).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Nenhum campo informado para atualizacao',
  });

export const updateMissionStatusSchema = z.object({
  status: missionStatusSchema,
  approvedBy: z.string().min(1).optional(),
  notes: z.string().max(1000).optional(),
});

export type CreateMissionInput = z.infer<typeof createMissionSchema>;
export type UpdateMissionInput = z.infer<typeof updateMissionSchema>;
export type UpdateMissionStatusInput = z.infer<typeof updateMissionStatusSchema>;
