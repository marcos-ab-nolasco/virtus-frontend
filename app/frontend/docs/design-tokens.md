# Design Tokens

Documentação visual dos tokens de design do sistema Virtus.

## Cores

### Primary (Azul)
Utilizada para ações principais, links e elementos interativos importantes.

- `primary-50` → `#eff6ff` - Muito clara
- `primary-100` → `#dbeafe`
- `primary-200` → `#bfdbfe`
- `primary-300` → `#93c5fd`
- `primary-400` → `#60a5fa`
- `primary-500` → `#3b82f6` - **Base**
- `primary-600` → `#2563eb`
- `primary-700` → `#1d4ed8` - **Hover/Active**
- `primary-800` → `#1e40af`
- `primary-900` → `#1e3a8a`
- `primary-950` → `#172554` - Muito escura

### Secondary (Verde)
Utilizada para indicadores de sucesso e ações secundárias.

- `secondary-50` → `#f0fdf4`
- `secondary-100` → `#dcfce7`
- `secondary-200` → `#bbf7d0`
- `secondary-300` → `#86efac`
- `secondary-400` → `#4ade80`
- `secondary-500` → `#22c55e` - **Base**
- `secondary-600` → `#16a34a`
- `secondary-700` → `#15803d`
- `secondary-800` → `#166534`
- `secondary-900` → `#14532d`

### Error (Vermelho)
Utilizada para mensagens de erro, estados de falha e ações destrutivas.

- `error-50` → `#fef2f2`
- `error-100` → `#fee2e2`
- `error-200` → `#fecaca`
- `error-300` → `#fca5a5`
- `error-400` → `#f87171`
- `error-500` → `#ef4444` - **Base**
- `error-600` → `#dc2626`
- `error-700` → `#b91c1c`
- `error-800` → `#991b1b`
- `error-900` → `#7f1d1d`

### Warning (Amarelo/Laranja)
Utilizada para avisos e alertas que requerem atenção.

- `warning-50` → `#fffbeb`
- `warning-100` → `#fef3c7`
- `warning-200` → `#fde68a`
- `warning-300` → `#fcd34d`
- `warning-400` → `#fbbf24`
- `warning-500` → `#f59e0b` - **Base**
- `warning-600` → `#d97706`
- `warning-700` → `#b45309`
- `warning-800` → `#92400e`
- `warning-900` → `#78350f`

### Neutral (Cinzas)
Utilizada para textos, bordas, backgrounds e elementos neutros.

- `neutral-50` → `#fafafa` - Background muito claro
- `neutral-100` → `#f5f5f5` - Background claro
- `neutral-200` → `#e5e5e5` - Bordas
- `neutral-300` → `#d4d4d4`
- `neutral-400` → `#a3a3a3` - Texto secundário
- `neutral-500` → `#737373` - Texto terciário
- `neutral-600` → `#525252`
- `neutral-700` → `#404040` - Texto primário
- `neutral-800` → `#262626`
- `neutral-900` → `#171717` - Muito escuro
- `neutral-950` → `#0a0a0a`

## Tipografia

Usando as fontes **Geist Sans** e **Geist Mono** configuradas no projeto.

### Tamanhos de Fonte (Tailwind defaults)
- `text-xs` → 0.75rem (12px)
- `text-sm` → 0.875rem (14px)
- `text-base` → 1rem (16px)
- `text-lg` → 1.125rem (18px)
- `text-xl` → 1.25rem (20px)
- `text-2xl` → 1.5rem (24px)
- `text-3xl` → 1.875rem (30px)
- `text-4xl` → 2.25rem (36px)

### Pesos de Fonte
- `font-light` → 300
- `font-normal` → 400
- `font-medium` → 500
- `font-semibold` → 600
- `font-bold` → 700

## Espaçamento

Usando escala padrão do Tailwind (base: 0.25rem / 4px):
- `spacing-1` → 0.25rem (4px)
- `spacing-2` → 0.5rem (8px)
- `spacing-3` → 0.75rem (12px)
- `spacing-4` → 1rem (16px)
- `spacing-6` → 1.5rem (24px)
- `spacing-8` → 2rem (32px)
- `spacing-12` → 3rem (48px)
- `spacing-16` → 4rem (64px)

## Border Radius

- `rounded-sm` → 0.375rem (6px)
- `rounded` / `rounded-md` → 0.5rem (8px) - **Padrão**
- `rounded-lg` → 1rem (16px)
- `rounded-xl` → 1.5rem (24px)
- `rounded-2xl` → 2rem (32px)
- `rounded-full` → 9999px (círculo completo)

## Sombras (Box Shadow)

- `shadow-sm` → Sombra muito sutil
- `shadow` → Sombra padrão
- `shadow-md` → Sombra média
- `shadow-lg` → Sombra grande
- `shadow-xl` → Sombra extra grande

## Uso Recomendado

### Botões
- **Primary Button:** `bg-primary-500 hover:bg-primary-700 text-white`
- **Secondary Button:** `border-2 border-primary-500 text-primary-700 hover:bg-primary-50`
- **Danger Button:** `bg-error-500 hover:bg-error-700 text-white`
- **Ghost Button:** `text-primary-700 hover:bg-primary-50`

### Cards
- **Background:** `bg-white`
- **Border:** `border border-neutral-200`
- **Shadow:** `shadow-md`
- **Radius:** `rounded-lg`

### Inputs
- **Default:** `border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200`
- **Error:** `border-error-500 focus:border-error-600 focus:ring-error-200`
- **Disabled:** `bg-neutral-100 text-neutral-500 cursor-not-allowed`

### Badges
- **Success:** `bg-secondary-100 text-secondary-800`
- **Error:** `bg-error-100 text-error-800`
- **Warning:** `bg-warning-100 text-warning-800`
- **Neutral:** `bg-neutral-100 text-neutral-800`

### Textos
- **Heading:** `text-neutral-900 font-semibold`
- **Body:** `text-neutral-700`
- **Secondary:** `text-neutral-500`
- **Link:** `text-primary-600 hover:text-primary-800 underline`

## Acessibilidade

### Contraste de Cores
Todas as combinações de cores atendem aos padrões WCAG AA:
- Texto escuro em background claro: mínimo `neutral-700` em `white`
- Texto claro em background escuro: `white` em backgrounds `primary-600+`, `error-600+`, etc.

### Estados Interativos
Sempre fornecer indicadores visuais para:
- `:hover` - Mudança de cor ou sombra
- `:focus` - Ring colorido (focus:ring-2)
- `:active` - Cor mais escura
- `:disabled` - Opacidade reduzida e cursor not-allowed
