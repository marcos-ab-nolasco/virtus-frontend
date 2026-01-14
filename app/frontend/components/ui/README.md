# UI Components

Componentes reutilizáveis de interface para o projeto Virtus.

## ErrorBoundary

Captura erros React e exibe uma interface amigável de fallback.

### Uso Básico

```tsx
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### Com Fallback Customizado

```tsx
<ErrorBoundary fallback={<div>Erro customizado!</div>}>
  <YourComponent />
</ErrorBoundary>
```

### Funcionalidades

- **Modo Desenvolvimento**: Mostra detalhes completos do erro e stack trace
- **Modo Produção**: Exibe apenas mensagem amigável sem detalhes técnicos
- **Ações de Recuperação**:
  - Botão "Tentar novamente" - reseta o estado do boundary
  - Botão "Ir para início" - redireciona para a home page
- **Logging**: Registra erros no console para debugging

---

## LoadingSpinner

Exibe um spinner animado de carregamento.

### Uso Básico

```tsx
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

function MyComponent() {
  return <LoadingSpinner />;
}
```

### Tamanhos Disponíveis

```tsx
// Pequeno
<LoadingSpinner size="sm" />

// Médio (padrão)
<LoadingSpinner size="md" />

// Grande
<LoadingSpinner size="lg" />

// Extra Grande
<LoadingSpinner size="xl" />
```

### Com Texto

```tsx
<LoadingSpinner size="lg" text="Carregando dados..." />
```

### Com Classe Customizada

```tsx
<LoadingSpinner className="my-8" text="Aguarde..." />
```

---

## Skeleton Components

Componentes de placeholder para estados de loading, melhorando a percepção de performance.

### SkeletonCard

Card completo com animação de pulse.

```tsx
import { SkeletonCard } from "@/components/ui/SkeletonCard";

function MyComponent() {
  return <SkeletonCard />;
}
```

### SkeletonText

Linha de texto placeholder.

```tsx
import { SkeletonText } from "@/components/ui/SkeletonCard";

<SkeletonText className="w-full" />
<SkeletonText className="w-3/4 mt-2" />
```

### SkeletonAvatar

Avatar circular placeholder.

```tsx
import { SkeletonAvatar } from "@/components/ui/SkeletonCard";

<SkeletonAvatar size="sm" />  // 8x8
<SkeletonAvatar size="md" />  // 12x12 (padrão)
<SkeletonAvatar size="lg" />  // 16x16
```

### Exemplo Completo

```tsx
function UserCard({ isLoading, user }) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <SkeletonAvatar size="lg" />
        <div className="flex-1">
          <SkeletonText className="w-1/2 mb-2" />
          <SkeletonText className="w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <img src={user.avatar} className="w-16 h-16 rounded-full" />
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    </div>
  );
}
```

---

## DashboardSkeleton

Skeleton screen completo para a página de dashboard.

### Uso

```tsx
import { DashboardSkeleton } from "@/components/ui/DashboardSkeleton";

function DashboardPage() {
  const { isLoading, data } = useData();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return <Dashboard data={data} />;
}
```

### Estrutura

O `DashboardSkeleton` replica a estrutura completa do dashboard:

- Navbar com logo e botão
- Card de informações do usuário
- Grid de cards de funcionalidades (2 colunas em desktop)
- Banner informativo

### Design Responsivo

Automaticamente se adapta aos breakpoints:

- **Mobile**: Layout de coluna única
- **Tablet (md:768px+)**: Grid de 2 colunas
- **Desktop**: Layout completo com max-width

---

## Button

Componente de botão reutilizável com múltiplas variantes e tamanhos.

### Uso Básico

```tsx
import Button from "@/components/ui/Button";

function MyComponent() {
  return <Button onClick={() => alert('Clicou!')}>Clique aqui</Button>;
}
```

### Variantes

```tsx
// Primary (padrão) - Ação principal
<Button variant="primary">Salvar</Button>

// Secondary - Ação secundária
<Button variant="secondary">Cancelar</Button>

// Ghost - Ação terciária/discreta
<Button variant="ghost">Ver detalhes</Button>

// Danger - Ação destrutiva
<Button variant="danger">Excluir</Button>
```

### Tamanhos

```tsx
<Button size="sm">Pequeno</Button>
<Button size="md">Médio (padrão)</Button>
<Button size="lg">Grande</Button>
```

### Estados

```tsx
// Desabilitado
<Button disabled>Não pode clicar</Button>

// Tipo submit em formulário
<Button type="submit">Enviar</Button>
```

---

## Input

Componente de input com label, validação e mensagens de erro.

### Uso Básico

```tsx
import Input from "@/components/ui/Input";

function MyForm() {
  return <Input label="Email" name="email" type="email" />;
}
```

### Com Validação

```tsx
<Input
  label="Senha"
  name="password"
  type="password"
  error="Senha deve ter pelo menos 8 caracteres"
  required
/>
```

### Tipos Disponíveis

```tsx
<Input type="text" name="name" label="Nome" />
<Input type="email" name="email" label="Email" />
<Input type="password" name="password" label="Senha" />
<Input type="number" name="age" label="Idade" />
```

### Com React Hook Form

```tsx
import { useForm } from 'react-hook-form';

function MyForm() {
  const { register, formState: { errors } } = useForm();

  return (
    <Input
      label="Email"
      {...register('email')}
      error={errors.email?.message}
    />
  );
}
```

---

## Card

Componente de container para agrupar conteúdo relacionado.

### Uso Básico

```tsx
import Card from "@/components/ui/Card";

function MyComponent() {
  return (
    <Card>
      <h3>Título do Card</h3>
      <p>Conteúdo do card aqui.</p>
    </Card>
  );
}
```

### Tamanhos de Padding

```tsx
<Card padding="sm">Padding pequeno</Card>
<Card padding="md">Padding médio (padrão)</Card>
<Card padding="lg">Padding grande</Card>
```

### Com/Sem Sombra

```tsx
<Card shadow>Com sombra (padrão)</Card>
<Card shadow={false}>Sem sombra</Card>
```

---

## Badge

Componente de badge/pill para status e categorias.

### Uso Básico

```tsx
import Badge from "@/components/ui/Badge";

function MyComponent() {
  return <Badge>Novo</Badge>;
}
```

### Variantes

```tsx
<Badge variant="success">Conectado</Badge>
<Badge variant="error">Erro</Badge>
<Badge variant="warning">Atenção</Badge>
<Badge variant="neutral">Inativo</Badge>
```

### Tamanhos

```tsx
<Badge size="sm">Pequeno</Badge>
<Badge size="md">Médio (padrão)</Badge>
```

### Exemplo de Uso com Status

```tsx
function ConnectionStatus({ connected }) {
  return (
    <div>
      {connected ? (
        <Badge variant="success">Conectado</Badge>
      ) : (
        <Badge variant="neutral">Desconectado</Badge>
      )}
    </div>
  );
}
```

---

## Boas Práticas

### 1. Sempre use Skeleton para loading de dados

❌ **Evite:**

```tsx
if (isLoading) return <div>Carregando...</div>;
```

✅ **Prefira:**

```tsx
if (isLoading) return <DashboardSkeleton />;
```

### 2. Mantenha dimensões consistentes

O skeleton deve ter as mesmas dimensões do conteúdo real para evitar layout shift.

```tsx
// Skeleton e conteúdo real devem ter mesma estrutura
<div className="p-6">  {/* mesmo padding */}
  <SkeletonText className="h-6 w-3/4" />
</div>

<div className="p-6">
  <h2 className="h-6">Título Real</h2>
</div>
```

### 3. Use ErrorBoundary em pontos estratégicos

```tsx
// ✅ No root layout
<ErrorBoundary>
  <App />
</ErrorBoundary>

// ✅ Em rotas principais
<ErrorBoundary>
  <DashboardPage />
</ErrorBoundary>

// ✅ Em componentes críticos
<ErrorBoundary fallback={<FallbackSimples />}>
  <ComponenteComplexo />
</ErrorBoundary>
```

### 4. Tamanhos de spinner apropriados

- `sm`: Dentro de botões ou elementos pequenos
- `md`: Loading states em cards
- `lg`: Loading de páginas ou seções grandes
- `xl`: Tela cheia de loading

---

## Acessibilidade

Todos os componentes seguem boas práticas de acessibilidade:

- **ErrorBoundary**: Botões nativos com foco e navegação por teclado
- **LoadingSpinner**: Texto opcional para screen readers
- **Skeletons**: Decorativos (não interferem com screen readers)

---

## Compatibilidade

- ✅ Next.js 15+
- ✅ React 19+
- ✅ Tailwind CSS 4+
- ✅ Todos os navegadores modernos

---

## Testes

Todos os componentes possuem cobertura de testes completa em `__tests__/components/ui/`.

Para rodar os testes:

```bash
pnpm test
```

---

## Estilo

Todos os componentes usam:

- **Tailwind CSS** para estilos
- **Animações nativas** do Tailwind (`animate-spin`, `animate-pulse`)
- **Design system** consistente com o resto da aplicação
- **Tema de cores** baseado em cinzas e azul primário
