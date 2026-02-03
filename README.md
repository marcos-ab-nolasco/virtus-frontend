# Virtus Frontend

Frontend web do Virtus v3 (React/Next.js), focado em validar agentes/skills antes dos canais finais.

## Estado da construcao

### Concluido (M1-M3)
- Autenticacao completa: login/cadastro, rotas protegidas e sessao.
- Base visual: design system inicial, layout de navegacao e chat.
- OAuth UI: fluxo de conexao com Google Calendar e status de integracao.
- Chat web basico para conversar com o agente e testar fluxos.
- Onboarding UI: conversacao guiada com progress indicator, formularios inline e tela de conclusao.

### Em andamento
- M4: integracao do chat com agentes/skills do backend e refinamentos de UX do fluxo conversacional.

## Visao geral do produto final
- Experiencia conversacional completa (onboarding + chat) para operar o assistente.
- Integracao transparente com calendario para contexto e execucao de tarefas.
- UI consistente para gerenciar perfil, preferencias e integracoes.
- Base pronta para expansao de canais (ex.: WhatsApp).

## Proximos passos
- Conectar chat ao orquestrador/skills com estados claros e feedback de erro.
- Ajustar telemetria do frontend para acompanhar uso e sucesso dos fluxos.
- Revisar acessibilidade e performance das telas principais.

## Como se conecta ao backend
- Consome a API REST autenticada (JWT) do backend.
- O chat envia mensagens para o agente/orquestrador e exibe respostas.
- O OAuth web dispara o fluxo de autorizacao e reflete o estado da integracao.
  - O OAuth do Google e apenas para calendario (nao e login social).

## Arquitetura (alto nivel)
- Next.js com rotas e layouts para navegacao e areas protegidas.
- Camada de estado para sessao e chat (store) e forms validados.
- Componentes de UI reutilizaveis + chat components para fluxos conversacionais.

## Estrutura de pastas (resumo)
- `app/frontend/src`: paginas, layouts e rotas do app
- `app/frontend/components`: UI e componentes de chat reutilizaveis
- `app/frontend/store`: estado global (sessao/chat)
- `app/frontend/hooks`: hooks customizados
- `app/frontend/lib`: helpers e clientes API
- `app/frontend/types`: tipos compartilhados

## Notas importantes
- Requer o backend rodando com a API em `/api/v1`.
- O chat atual e um sandbox; o assistente final ainda sera acoplado.
