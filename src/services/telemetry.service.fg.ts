import { TelemetryFrame } from '../models/TelemetryFrame.fg.js';
import { TelemetryFrameInput } from '../schemas/telemetry.schema.fg.js';

export async function recordTelemetry(droneId: string, frame: TelemetryFrameInput) {
  await TelemetryFrame.create({
    droneId,
    payload: {
      lat: frame.lat,
      lng: frame.lng,
      alt: frame.alt,
      speed: frame.speed,
      batteryPct: frame.batteryPct,
      heading: frame.heading,
    },
    ts: frame.ts,
  });
}

export async function getLatestTelemetry(droneId: string) {
  return TelemetryFrame.findOne({ droneId }).sort({ ts: -1 }).exec();
}
