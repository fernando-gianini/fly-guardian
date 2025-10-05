# Backlog FlyGuardian

## Etapa 3 - Planejamento e Historico
| ID | Titulo | Criterios de Aceite (resumo) | Prioridade | Artefatos |
|----|--------|------------------------------|------------|-----------|
| OPS-301 | CRUD multi-tenant de drones | Modelos + endpoints /api/drones com validacao zod, RBAC por role e testes Jest/Supertest + .http | P0 | [src/models/Drone.fg.ts](../src/models/Drone.fg.ts)<br>[src/controllers/drones.controller.fg.ts](../src/controllers/drones.controller.fg.ts)<br>[tests/drones.http](../tests/drones.http) |
| OPS-302 | Planejamento e CRUD de missoes | Fluxo completo de criacao/edicao com estimativas, status auditado e validacao de rota + testes e arquivo .http | P0 | [src/models/Mission.fg.ts](../src/models/Mission.fg.ts)<br>[src/services/missions.service.fg.ts](../src/services/missions.service.fg.ts)<br>[tests/missions.http](../tests/missions.http) |
| OPS-303 | Registro historico de voos | Persistencia automatica ao encerrar missao, filtros por drone/data e logs correlacionados | P0 | [src/models/FlightHistory.fg.ts](../src/models/FlightHistory.fg.ts)<br>[src/controllers/flightHistory.controller.fg.ts](../src/controllers/flightHistory.controller.fg.ts)<br>[tests/flightHistory.http](../tests/flightHistory.http) |

## Etapa 4 - Streaming & Monitoramento
| ID | Titulo | Criterios de Aceite (resumo) | Prioridade | Artefatos |
|----|--------|------------------------------|------------|-----------|
| OPS-401 | Placeholders DJI SDK e gateway WebRTC | Clientes stub conectam/encerram sessoes, rotas REST e logs estruturados com traceId | P0 | [src/services/streaming/djiSdk.client.fg.ts](../src/services/streaming/djiSdk.client.fg.ts)<br>[src/services/streaming/webrtc.gateway.fg.ts](../src/services/streaming/webrtc.gateway.fg.ts)<br>[tests/streaming.http](../tests/streaming.http) |
| OPS-402 | Monitoramento e logs de telemetria | WebSocket /ws/telemetry validado, metricas simuladas e integracao com FlightHistory | P1 | [src/controllers/monitoring.controller.fg.ts](../src/controllers/monitoring.controller.fg.ts)<br>[src/utils/logging/telemetry.logger.fg.ts](../src/utils/logging/telemetry.logger.fg.ts)<br>[tests/monitoring.http](../tests/monitoring.http) |

## Etapa 5 - Alertas & Emergencias
| ID | Titulo | Criterios de Aceite (resumo) | Prioridade | Artefatos |
|----|--------|------------------------------|------------|-----------|
| OPS-501 | Endpoints de alerta com integracao WhatsApp/Twilio | Disparo POST /api/alerts com provider mock, rate-limit e logs auditaveis | P0 | [src/controllers/alerts.controller.fg.ts](../src/controllers/alerts.controller.fg.ts)<br>[src/services/alerts/whatsapp.provider.fg.ts](../src/services/alerts/whatsapp.provider.fg.ts)<br>[tests/alerts.http](../tests/alerts.http) |
| OPS-502 | Auditoria e relatorios de alertas | Historico filtravel, exportacao CSV/PDF (stub) e documentacao de auditoria | P1 | [src/models/AlertEvent.fg.ts](../src/models/AlertEvent.fg.ts)<br>[src/services/alerts/alertHistory.service.fg.ts](../src/services/alerts/alertHistory.service.fg.ts)<br>[docs/alerts-auditoria.md](./alerts-auditoria.md) |

## Etapa 6 - Chat em Tempo Real
| ID | Titulo | Criterios de Aceite (resumo) | Prioridade | Artefatos |
|----|--------|------------------------------|------------|-----------|
| OPS-601 | Servidor WebSocket e salas de chat | Autenticacao JWT RS256, rooms por missao e logs de join/leave | P0 | [src/gateways/chat/ws.server.fg.ts](../src/gateways/chat/ws.server.fg.ts)<br>[src/utils/chat/auth.guard.fg.ts](../src/utils/chat/auth.guard.fg.ts)<br>[docs/chat-protocol.md](./chat-protocol.md) |
| OPS-602 | Persistencia e testes do chat | Historico REST, TTL e testes e2e simulando dois clientes WebSocket | P1 | [src/models/ChatMessage.fg.ts](../src/models/ChatMessage.fg.ts)<br>[tests/chat.ws.spec.fg.ts](../tests/chat.ws.spec.fg.ts)<br>[tests/chat.http](../tests/chat.http) |

## Etapa 7 - Pagamentos & Assinaturas
| ID | Titulo | Criterios de Aceite (resumo) | Prioridade | Artefatos |
|----|--------|------------------------------|------------|-----------|
| OPS-701 | Mock de gateway e planos | Gateway mock com intents, planos BRL/USD e eventos logados | P0 | [src/services/billing/gateway.mock.fg.ts](../src/services/billing/gateway.mock.fg.ts)<br>[src/routes/billing.routes.fg.ts](../src/routes/billing.routes.fg.ts)<br>[tests/billing.http](../tests/billing.http) |
| OPS-702 | Relatorios e conciliacao | API de relatorios financeiros, exportacao CSV e template documental | P1 | [src/models/Subscription.fg.ts](../src/models/Subscription.fg.ts)<br>[src/services/billing/report.service.fg.ts](../src/services/billing/report.service.fg.ts)<br>[docs/billing-report-template.md](./billing-report-template.md) |

## Etapa 8 - Paineis Web & Mobile
| ID | Titulo | Criterios de Aceite (resumo) | Prioridade | Artefatos |
|----|--------|------------------------------|------------|-----------|
| OPS-801 | Scaffold painel web (React) | App Vite/React com login, dashboard de missoes e WebSocket stub | P0 | [apps/web/package.json](../apps/web/package.json)<br>[apps/web/src/App.tsx](../apps/web/src/App.tsx)<br>[apps/web/src/pages/Dashboard.tsx](../apps/web/src/pages/Dashboard.tsx) |
| OPS-802 | Scaffold aplicativo mobile (React Native) | App Expo com login, lista de missoes e player WebRTC/HLS placeholder | P1 | [apps/mobile/package.json](../apps/mobile/package.json)<br>[apps/mobile/App.tsx](../apps/mobile/App.tsx)<br>[docs/mobile-auth-flow.md](./mobile-auth-flow.md) |
