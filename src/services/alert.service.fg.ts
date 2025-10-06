import mongoose from 'mongoose';
import { Alert, AlertDocument, AlertStatus } from '../models/Alert.fg.js';
import {
  CreateEmergencyAlertInput,
  CreatePoliceAlertInput,
  ListAlertsInput,
  UpdateAlertStatusInput,
} from '../schemas/alert.schema.fg.js';
import { Roles } from '../types/roles.fg.js';
import { sendWhatsAppMessage } from '../integrations/whatsapp.adapter.fg.js';
import { logger } from '../utils/logger.fg.js';
import { AppError } from '../utils/errors.fg.js';

interface UserContext {
  id: string;
  role: Roles;
}

const STATUS_FLOW: Record<AlertStatus, AlertStatus[]> = {
  aberto: ['em_atendimento', 'resolvido'],
  em_atendimento: ['resolvido'],
  resolvido: [],
};

function buildTimeline(event: string, meta?: Record<string, unknown>) {
  return { event, at: new Date(), meta };
}

export async function createEmergencyAlert(
  data: CreateEmergencyAlertInput,
  user: UserContext
): Promise<AlertDocument> {
  const timeline = [buildTimeline('created', { by: user.id, role: user.role })];
  const alert = await Alert.create({
    createdBy: user.id,
    role: user.role,
    location: data.location,
    note: data.note,
    priority: data.priority,
    type: 'emergency',
    status: 'aberto',
    timeline,
  });

  logger.info({ alertId: alert.id, userId: user.id }, 'alerta de emergencia criado');
  return alert;
}

export async function createPolice190Alert(
  data: CreatePoliceAlertInput,
  user: UserContext
): Promise<AlertDocument> {
  const timeline = [buildTimeline('created', { by: user.id, role: user.role, type: '190' })];

  const alert = await Alert.create({
    createdBy: user.id,
    role: user.role,
    location: data.location ?? { lat: 0, lng: 0 },
    note: data.note,
    priority: 'high',
    type: 'police_190',
    status: 'aberto',
    timeline,
  });

  await sendWhatsAppMessage({
    to: 'whatsapp:+5511999999999',
    body: `ALERTA 190 - Drone ${alert.id} | Usuario ${user.id}`,
  });

  alert.timeline.push(buildTimeline('notified_whatsapp'));
  await alert.save();

  logger.warn({ alertId: alert.id }, 'alerta 190 criado e notificado (mock)');
  return alert;
}

export async function updateAlertStatus(
  id: string,
  payload: UpdateAlertStatusInput,
  user: UserContext
): Promise<AlertDocument> {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(400, 'Identificador invalido');
  }

  const alert = await Alert.findById(id).exec();
  if (!alert) {
    throw new AppError(404, 'Alerta nao encontrado');
  }

  const allowedNext = STATUS_FLOW[alert.status as AlertStatus];
  if (!allowedNext.includes(payload.status)) {
    throw new AppError(400, 'Transicao de status invalida');
  }

  alert.status = payload.status as AlertStatus;
  alert.timeline.push(buildTimeline('status_changed', { to: payload.status, by: user.id }));
  await alert.save();

  logger.info({ alertId: alert.id, status: payload.status }, 'status de alerta atualizado');
  return alert;
}

export async function listAlerts(filters: ListAlertsInput, user: UserContext): Promise<AlertDocument[]> {
  const query: Record<string, unknown> = {};
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.from || filters.to) {
    query.createdAt = {};
    if (filters.from) {
      (query.createdAt as Record<string, Date>).$gte = filters.from;
    }
    if (filters.to) {
      (query.createdAt as Record<string, Date>).$lte = filters.to;
    }
  }

  if (user.role === Roles.morador) {
    query.createdBy = user.id;
  }

  return Alert.find(query)
    .sort({ createdAt: -1 })
    .exec();
}
