# FlyGuardian Backend (Etapa 1)

Backend base em Node.js 20+, TypeScript, Express, MongoDB (Mongoose), Pino e Zod.

## Requisitos
- Node.js 20+
- npm 9+
- Docker (opcional, para MongoDB)

## Setup
1) Instalar dependências:
```
npm install
```
2) Copiar `.env.example` para `.env` e ajustar variáveis (as chaves RSA podem conter `\n`, elas serão normalizadas automaticamente).
3) Validar tipos/compilação sempre que necessário:
```
npm run typecheck
```

## Geração de chaves RSA
```
# Private key
openssl genrsa -out jwtRS256.key 2048
# Public key
openssl rsa -in jwtRS256.key -pubout -out jwtRS256.key.pub
# Coloque o conteúdo em JWT_PRIVATE_KEY e JWT_PUBLIC_KEY (PEM)
```

## Desenvolvimento
```
npm run dev
```
App expõe GET /health em `http://localhost:4000/health`.

## Build e produção
```
npm run build
npm start
```

## Docker
- Build da aplicação fora do container (gera `dist/`).
- Rodar Mongo com docker-compose:
```
docker compose up -d mongo mongo-express
```
Mongo Express: http://localhost:8081 (admin/admin)

## Teste manual
```
curl -s http://localhost:4000/health | jq
# {
#   "status": "ok",
#   "uptime": 12,
#   "timestamp": "2024-05-01T12:00:00.000Z",
#   "environment": "development"
# }
```
