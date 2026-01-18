# virtus frontend

Frontend web do Virtus v3 (React SPA), pensado para validar agentes/skills com qualidade antes do canal WhatsApp.

## O que existe hoje
- Autenticacao completa (M1): login/cadastro, rotas protegidas, cliente API com estado de sessao.
- Base visual (M2): design system inicial, layout de navegacao e componentes de chat.
- OAuth UI (M2): fluxo de conexao com Google Calendar e status de integracao.
- Chat web basico para conversar com o agente e testar fluxos.
- Onboarding UI (M3): interface conversacional de configuracao inicial com progress indicator, formularios inline, typing indicator e tela de conclusao.

## Como isso se conecta ao backend
- O frontend consome a API REST autenticada (JWT) do backend.
- O chat envia mensagens para o agente/orquestrador e exibe respostas.
- O OAuth web dispara o fluxo de autorizacao e reflete o estado da integracao.

## Arquitetura (alto nivel)
- Next.js com rotas e layouts para navegacao e areas protegidas.
- Camada de estado para sessao e chat (store) e forms validados.
- Componentes de UI reutilizaveis + chat components para fluxos conversacionais.

## Principais bibliotecas
- Next.js, React, Tailwind CSS
- react-hook-form + zod
- zustand
- openapi-fetch

## Estrutura de pastas (resumo)
- `app/frontend/src`: paginas, layouts e rotas do app
- `app/frontend/components`: UI e componentes de chat reutilizaveis
- `app/frontend/store`: estado global (sessao/chat)
- `app/frontend/hooks`: hooks customizados
- `app/frontend/lib`: helpers e clientes API
- `app/frontend/types`: tipos compartilhados

## Proximos passos imediatos
- M4: integracao com agentes e skills do backend.
