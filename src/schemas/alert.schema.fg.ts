import { z } from 'zod';
import { Roles } from '../types/roles.fg.js';

export const alertPriorityValues = ['low', 'medium', 'high'] as const;
export const alertStatusValues = ['aberto', 'em_atendimento', 'resolvido'] as const;
export const alertTypeValues = ['emergency', 'police_190'] as const;

const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const createEmergencyAlertSchema = z.object({
  location: locationSchema,
  note: z.string().max(500).optional(),
  priority: z.enum(alertPriorityValues).default('medium'),
});

export const createPoliceAlertSchema = z.object({
  location: locationSchema.optional(),
  note: z.string().max(500).optional(),
});

export const listAlertsSchema = z.object({
  status: z.enum(alertStatusValues).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const updateAlertStatusSchema = z.object({
  status: z.enum(['em_atendimento', 'resolvido']),
});

export type CreateEmergencyAlertInput = z.infer<typeof createEmergencyAlertSchema>;
export type CreatePoliceAlertInput = z.infer<typeof createPoliceAlertSchema>;
export type ListAlertsInput = z.infer<typeof listAlertsSchema>;
export type UpdateAlertStatusInput = z.infer<typeof updateAlertStatusSchema>;
export type UserRole = Roles;
