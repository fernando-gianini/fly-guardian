# Blueprint Técnico — FlyGuardian

## 1. Visão Geral
O FlyGuardian é a plataforma integrada da DroneNation para transformar drones em guardiões aéreos inteligentes. A solução conecta planejamento, execução e distribuição de missões em contextos de segurança pública, privada e gestão de tráfego aéreo, reduzindo fricções operacionais e assegurando conformidade com normas brasileiras.

Com foco em usabilidade e automação, o produto entrega uma experiência centrada no operador/CCO, oferecendo integração nativa ao ecossistema regulatório (SARPAS NG e BR-UTM), monitoramento em tempo real para equipes externas e pilares sólidos de segurança, escalabilidade multi-tenant e observabilidade.

## 2. Objetivos Principais
- Simplificar operações com drones via lançamentos e gestão de missões em poucos passos.
- Integrar-se nativamente ao SARPAS NG e BR-UTM para autorizações automatizadas de voo.
- Oferecer visão em tempo real para equipes externas por links web e apps satélites.
- Garantir segurança operacional com RTH visível, takeover manual, logs completos e terrain following.
- Escalar como plataforma multi-tenant com personalização white-label por cliente.

## 3. Públicos-Alvo & Personas Resumidas
### Órgãos Públicos (Polícias, Defesa Civil, Prefeituras)
- **Objetivos:** patrulhamento eficiente, resposta rápida a incidentes, conformidade regulatória.
- **Dores:** aprovação de voos lenta, falta de visibilidade compartilhada, processos manuais.
- **KPIs:** tempo de autorização SARPAS, número de ocorrências atendidas, SLA de resposta.

### Segurança Privada (Vigilância, Condomínios, Indústrias, Agronegócio)
- **Objetivos:** proteção perimetral, redução de perdas, monitoramento 24/7.
- **Dores:** múltiplas ferramentas desconectadas, custos operacionais, ausência de evidências auditáveis.
- **KPIs:** incidentes detectados/prevenidos, tempo médio de resposta em campo, compliance contratual.

### Multi-Operadores / Futuro (Gestores de Frota, Dock Stations, Expansão)
- **Objetivos:** operar grandes frotas, garantir disponibilidade contínua, suportar padrões internacionais.
- **Dores:** falta de automação de manutenção, controle de habilitações, integração UTM global.
- **KPIs:** taxa de utilização de frota, disponibilidade de drones/docks, compliance ICAO/DECEA.

## 4. Estrutura de Produto (Módulos)
### Planejamento de Missões
- **APIs previstas:** `POST /missions`, `GET /missions/:id`, `POST /missions/:id/path`, importação DEM (`POST /missions/:id/dem`).
- **Dependências:** dados DEM (Google Earth/SRTM), serviço de estimativas (tempo, área, baterias), motor de roteamento.
- **Métricas/Logs:** duração de planejamento, número de revisões, logs de parâmetros (RTH, altitude, modo de rota).

### Operação e Comando (CCO)
- **APIs previstas:** `POST /operations`, `PATCH /operations/:id/state`, telemetria websocket (`/ws/telemetry`), comandos joystick (`POST /operations/:id/commands`).
- **Dependências:** streaming de vídeo, controle remoto (DJI SDK), serviço de autenticação e RBAC.
- **Métricas/Logs:** eventos de takeover, latência vídeo/mapa, logs de comandos manuais, disponibilidade de link.

### UTM Integrado (SARPAS/BR-UTM)
- **APIs previstas:** adapters `POST /utm/flight-plans`, `GET /utm/status/:id`, consulta NOTAMs (`GET /utm/notams`).
- **Dependências:** APIs oficiais SARPAS NG / BR-UTM, armazenamento de protocolos, fila de sincronização.
- **Métricas/Logs:** tempo de aprovação, taxa de rejeição, trilha de auditoria com payloads enviados/recebidos.

### Compartilhamento e Apps Satélites
- **APIs previstas:** `GET /share/:token` (web view), `GET /apps/security/feed`, `POST /apps/security/markers`, `POST /apps/resident/panic`.
- **Dependências:** serviço de tokens temporários, WebRTC/streams adaptados, push notifications/PTS.
- **Métricas/Logs:** sessões simultâneas, latência de streaming, uso de marcadores, acionamentos de emergência.

### Gestão de Frota e Compliance
- **APIs previstas:** `POST /assets/drones`, `GET /assets/telemetry`, `POST /maintenances`, `POST /licenses/check`.
- **Dependências:** banco multi-tenant, integração com telemetria histórica, alertas agendados.
- **Métricas/Logs:** horas de voo por drone, alertas de manutenção, status de licenças/pilotos.

### Camada de Inteligência Artificial (Futuro)
- **APIs previstas:** `POST /ai/detections`, `GET /ai/incidents`, `POST /ai/reactions`.
- **Dependências:** modelos de visão computacional, pipelines de eventos, armazenamento de evidências (vídeo/imagens).
- **Métricas/Logs:** precisão de detecção, falsos positivos, tempo de reação automatizada, consumo de GPU.

## 5. Fluxo Operacional (Exemplo)
```
[Operador] -> [Planejador] -> [SARPAS/BR-UTM] -> [Decolar] -> [Compartilhar] -> [Relatório]
```
1. Operador acessa o FlyGuardian, escolhe drone disponível e configura missão.
2. Sistema envia solicitação automática ao SARPAS/BR-UTM e, com autorização, habilita o botão de decolagem.
3. Durante o voo, operador monitora mapa+vídeo, assume controle se necessário e compartilha feed com equipes externas.
4. Ao encerrar, gera-se relatório automático com logs, métricas e mídia.

## 6. Diferenciais do FlyGuardian
- Integração nativa com BR-UTM/DECEA e SARPAS NG.
- Interface instintiva desenhada para operadores sob estresse.
- Customização white-label para órgãos públicos e clientes privados.
- Ecossistema multi-nível (CCO, segurança em terra, moradores) em uma única plataforma.
- Terrain following e RTH inteligente garantindo segurança em áreas complexas.
- Escalabilidade para operar de missões solo a redes com dock stations.

## 7. Roadmap Macro — Etapas 1–8
- **Etapa 1 — Fundamentos (concluída):** setup do repositório, TypeScript/ESM, health-check e ambiente .env.
- **Etapa 2 — Autenticação (concluída):** endpoints `/auth/*`, fluxo JWT RS256, arquivo `.http` de testes.
- **Etapa 3 — Planejamento de Missões:** CRUD de missões, importação DEM, estimativas automáticas, validações zod.
- **Etapa 4 — Operação & Streaming:** telemetria em tempo real, integração DJI SDK/WebRTC, painel CCO.
- **Etapa 5 — UTM Integrado:** adapters SARPAS/BR-UTM, fila de sincronização, monitoramento de protocolos.
- **Etapa 6 — Compartilhamento & Apps:** links web, apps segurança/morador, comunicação PTT.
- **Etapa 7 — Gestão de Frota & White-label:** cadastro de ativos, compliance, customização multi-tenant.
- **Etapa 8 — IA & Dock Stations:** detecção inteligente, automações de reação, integração com docks e expansão internacional.

## 8. Implicações Técnicas
- **UTM/SARPAS:** criar clients para endpoints (placeholders) `POST /sarpa/flight-plan`, `GET /br-utm/status`; manter conformidade com protocolos DECEA e registro de logs oficiais.
- **DJI SDK / WebRTC:** utilizar DJI Pilot/Onboard SDK para comandos, encapsular streaming via WebRTC (SFU) com fallback HLS.
- **Multi-tenant / White-label:** separar tenants via chave `tenantId`, temas configuráveis (logo/paleta/CNAME), isolamento lógico na camada de dados.
- **Segurança:** tokens JWT RS256 com rotação de chaves, RBAC por perfis (admin_global, cliente, operador, morador), auditoria de acessos e rate-limit adaptativo.
- **Observabilidade:** logs estruturados com pino, correlação por `traceId`, preparar métricas (Prometheus/OpenTelemetry) e alertas para eventos críticos (perda de link, falha UTM).

## 9. Backlog Inicial
| ID   | Módulo                       | Item                                                   | Critério de Aceite                                                                 | Prioridade | Etapa |
|------|------------------------------|--------------------------------------------------------|------------------------------------------------------------------------------------|------------|-------|
| BG-01| Planejamento de Missões      | Criar endpoints CRUD de missões                        | `POST/GET/PUT/DELETE /missions` com validação e persistência                       | P0         | 3     |
| BG-02| Planejamento de Missões      | Importar DEM e estimar RTH                             | Upload de DEM e cálculos de distância/tempo/baterias disponíveis                   | P0         | 3     |
| BG-03| Operação e Comando           | Painel tempo real com mapa+vídeo                       | Web UI com telemetria WebSocket e stream de vídeo estável                          | P0         | 4     |
| BG-04| Operação e Comando           | Takeover manual e logs de comandos                     | Registro de todos os comandos e troca AUTO/ASSISTED/MANUAL                         | P1         | 4     |
| BG-05| UTM Integrado                | Adapter SARPAS/BR-UTM para solicitar voos              | Endpoint interno dispara pedido e armazena protocolo + status                      | P0         | 5     |
| BG-06| Compartilhamento & Apps      | Link web view-only                                     | URL temporária com vídeo + telemetria para forças externas                         | P0         | 6     |
| BG-07| Gestão de Frota & Compliance | Cadastro de drones/pilotos com alertas de licenças     | CRUD de ativos + scheduler de alertas por validade                                 | P1         | 7     |
| BG-08| Multi-tenant/White-label     | Theming por cliente                                    | Tema aplicável via configuração (logo, cores, domínio)                              | P1         | 7     |
| BG-09| Camada IA                    | MVP detecção de pessoas/veículos                       | Endpoint retorna eventos classificados com ≥80% de confiança                       | P1         | 8     |
| BG-10| Dock Stations                | Integração inicial com dock station                    | Sincronização de status e comandos básicos (abrir/fechar)                          | P1         | 8     |

## 10. Como Usar este Blueprint
1. Gere o backlog detalhado das próximas sprints a partir dos itens P0/P1, refinando critérios e estimativas.
2. Para cada feature planejada, crie arquivos `.http` específicos (seguindo o padrão atual) para validar as APIs desenvolvidas.
3. Inicie a implementação da Etapa 3 seguindo as dependências listadas, garantindo logs e métricas desde o início.
