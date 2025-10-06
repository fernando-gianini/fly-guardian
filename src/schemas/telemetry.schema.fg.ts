import { z } from 'zod';

export const telemetryPayloadSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  alt: z.number().min(0),
  speed: z.number().min(0),
  batteryPct: z.number().min(0).max(100),
  heading: z.number().min(0).max(360),
});

export const telemetryFrameSchema = z.object({
  lat: telemetryPayloadSchema.shape.lat,
  lng: telemetryPayloadSchema.shape.lng,
  alt: telemetryPayloadSchema.shape.alt,
  speed: telemetryPayloadSchema.shape.speed,
  batteryPct: telemetryPayloadSchema.shape.batteryPct,
  heading: telemetryPayloadSchema.shape.heading,
  ts: z.coerce.date(),
});

export type TelemetryFrameInput = z.infer<typeof telemetryFrameSchema>;
