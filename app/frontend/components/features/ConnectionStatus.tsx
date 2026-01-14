import { Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface ConnectionStatusProps {
  provider: 'GOOGLE' | 'OUTLOOK';
  connected: boolean;
  lastSync?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

const providerInfo = {
  GOOGLE: {
    name: 'Google Calendar',
    icon: <Calendar className="w-6 h-6 text-primary-600" />,
  },
  OUTLOOK: {
    name: 'Outlook Calendar',
    icon: <Calendar className="w-6 h-6 text-blue-600" />,
  },
};

function formatLastSync(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 1) return 'agora mesmo';
  if (diffInMinutes === 1) return '1 minuto atrás';
  if (diffInMinutes < 60) return `${diffInMinutes} minutos atrás`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) return '1 hora atrás';
  if (diffInHours < 24) return `${diffInHours} horas atrás`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '1 dia atrás';
  return `${diffInDays} dias atrás`;
}

export default function ConnectionStatus({
  provider,
  connected,
  lastSync,
  onConnect,
  onDisconnect,
}: ConnectionStatusProps) {
  const info = providerInfo[provider];

  const handleDisconnect = () => {
    const confirmed = window.confirm(
      `Tem certeza que deseja desconectar ${info.name}? Você perderá acesso às funcionalidades de calendário.`
    );
    if (confirmed) {
      onDisconnect();
    }
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-neutral-50 rounded-lg flex items-center justify-center flex-shrink-0">
            {info.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              {info.name}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={connected ? 'success' : 'neutral'}>
                {connected ? 'Conectado' : 'Desconectado'}
              </Badge>
            </div>
            {connected && lastSync && (
              <p className="text-sm text-neutral-500">
                Última sincronização: {formatLastSync(lastSync)}
              </p>
            )}
          </div>
        </div>
        <div>
          {connected ? (
            <Button
              variant="danger"
              size="sm"
              onClick={handleDisconnect}
            >
              Desconectar
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={onConnect}
            >
              Conectar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
