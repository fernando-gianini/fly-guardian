import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import { StreamLog, StreamLogDocument } from '../models/StreamLog.fg.js';
import { AppError } from '../utils/errors.fg.js';
import { logger } from '../utils/logger.fg.js';

const MOCK_SDP_OFFER = [
  'v=0',
  'o=- 0 0 IN IP4 127.0.0.1',
  's=FlyGuardian Mock Stream',
  't=0 0',
  'm=video 9 UDP/TLS/RTP/SAVPF 96',
  'c=IN IP4 0.0.0.0',
  'a=rtpmap:96 H264/90000',
].join('\n');

type ActiveSession = {
  sessionId: string;
  droneId: string;
  startedAt: Date;
  sdpOffer: string;
  sdpAnswer?: string;
  iceCandidates: string[];
  logId: mongoose.Types.ObjectId;
};

const activeSessions = new Map<string, ActiveSession>();

export async function startStreamSession(droneId: string): Promise<{ sessionId: string; sdpOffer: string }> {
  const sessionId = randomUUID();
  const startedAt = new Date();

  const log = await StreamLog.create({
    sessionId,
    droneId,
    startedAt,
  });

  activeSessions.set(sessionId, {
    sessionId,
    droneId,
    startedAt,
    sdpOffer: MOCK_SDP_OFFER,
    iceCandidates: [],
    logId: log._id as mongoose.Types.ObjectId,
  });

  logger.info({ sessionId, droneId, startedAt }, 'stream session started');

  return { sessionId, sdpOffer: MOCK_SDP_OFFER };
}

function getActiveSession(sessionId: string): ActiveSession {
  const session = activeSessions.get(sessionId);
  if (!session) {
    throw new AppError(404, 'Sessao nao encontrada');
  }
  return session;
}

export async function submitStreamAnswer(sessionId: string, sdpAnswer: string): Promise<void> {
  const session = getActiveSession(sessionId);
  session.sdpAnswer = sdpAnswer;
  logger.debug({ sessionId }, 'stream answer recebida');
}

export async function submitIceCandidate(sessionId: string, candidate: string): Promise<void> {
  const session = getActiveSession(sessionId);
  session.iceCandidates.push(candidate);
  logger.debug({ sessionId, total: session.iceCandidates.length }, 'stream ice candidate recebida');
}

export async function stopStreamSession(
  sessionId: string,
  reason?: string
): Promise<StreamLogDocument> {
  const session = getActiveSession(sessionId);
  activeSessions.delete(sessionId);

  const endedAt = new Date();
  const update: Record<string, unknown> = {
    endedAt,
  };

  if (reason) {
    update.errors = [{ reason }];
  }

  const log = await StreamLog.findOneAndUpdate({ sessionId }, update, {
    new: true,
    runValidators: true,
  }).exec();

  if (!log) {
    throw new AppError(404, 'Log de sessao nao encontrado');
  }

  logger.info({ sessionId, endedAt, reason }, 'stream session finalizada');
  return log;
}

export async function listStreamLogs(filters: {
  droneId?: string;
  sessionId?: string;
}): Promise<StreamLogDocument[]> {
  const query: Record<string, unknown> = {};
  if (filters.droneId) {
    query.droneId = filters.droneId;
  }
  if (filters.sessionId) {
    query.sessionId = filters.sessionId;
  }
  return StreamLog.find(query).sort({ startedAt: -1 }).exec();
}
