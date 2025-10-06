import { z } from 'zod';

export const startStreamSessionSchema = z.object({
  droneId: z.string().min(1, 'droneId obrigatorio'),
});

export const streamAnswerSchema = z.object({
  sdpAnswer: z.string().min(1, 'sdpAnswer obrigatorio'),
});

export const streamIceCandidateSchema = z.object({
  candidate: z.string().min(1, 'candidate obrigatorio'),
});

export const stopStreamSessionSchema = z.object({
  reason: z.string().min(1).optional(),
});

export const streamLogsQuerySchema = z.object({
  droneId: z.string().min(1).optional(),
  sessionId: z.string().min(1).optional(),
});

export type StartStreamSessionInput = z.infer<typeof startStreamSessionSchema>;
export type StreamAnswerInput = z.infer<typeof streamAnswerSchema>;
export type StreamIceCandidateInput = z.infer<typeof streamIceCandidateSchema>;
export type StopStreamSessionInput = z.infer<typeof stopStreamSessionSchema>;
export type StreamLogsQueryInput = z.infer<typeof streamLogsQuerySchema>;
