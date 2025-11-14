import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, ArrowRight, Calendar } from 'lucide-react';

interface ForecastMetrics {
  month1: { value: number; change: number };
  month2: { value: number; change: number };
  month3: { value: number; change: number };
}

interface Segment {
  id: string;
  name: string;
  description: string;
  model: string;
  accuracy: number;
  lastUpdated: string;
  metrics: ForecastMetrics;
  color: string;
}

interface SavedForecastsProps {
  onViewDetails: (segmentId: string) => void;
}

export function SavedForecasts({ onViewDetails }: SavedForecastsProps) {
  const segments: Segment[] = [
    {
      id: '1',
      name: 'Розничный сегмент',
      description: 'Прогноз просрочки для розничных клиентов',
      model: 'XGBoost',
      accuracy: 0.87,
      lastUpdated: '2024-11-01',
      metrics: {
        month1: { value: 245000, change: 2.3 },
        month2: { value: 251000, change: 2.4 },
        month3: { value: 258000, change: 2.8 },
      },
      color: 'bg-blue-500',
    },
    {
      id: '2',
      name: 'Корпоративный сегмент',
      description: 'Прогноз просрочки для корпоративных клиентов',
      model: 'Linear Regression',
      accuracy: 0.92,
      lastUpdated: '2024-11-01',
      metrics: {
        month1: { value: 180000, change: -1.2 },
        month2: { value: 178000, change: -1.1 },
        month3: { value: 176000, change: -1.1 },
      },
      color: 'bg-purple-500',
    },
    {
      id: '3',
      name: 'МСБ сегмент',
      description: 'Прогноз просрочки для малого и среднего бизнеса',
      model: 'Random Forest',
      accuracy: 0.85,
      lastUpdated: '2024-11-01',
      metrics: {
        month1: { value: 156000, change: 3.1 },
        month2: { value: 161000, change: 3.2 },
        month3: { value: 166000, change: 3.1 },
      },
      color: 'bg-emerald-500',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-slate-900">Готовые прогнозы</h2>
        <p className="text-sm text-slate-600">Обновлено: {segments[0].lastUpdated}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {segments.map((segment) => (
          <Card
            key={segment.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${segment.color}`} />
                <div>
                  <h3 className="text-slate-900">{segment.name}</h3>
                  <p className="text-sm text-slate-600">{segment.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Модель:</span>
                <Badge variant="secondary">{segment.model}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Точность:</span>
                <span className="text-slate-900">{(segment.accuracy * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <p className="text-sm text-slate-600 mb-2">Прогноз на 3 месяца:</p>
              
              <div className="space-y-2">
                <MetricRow
                  label="Месяц 1"
                  value={segment.metrics.month1.value}
                  change={segment.metrics.month1.change}
                />
                <MetricRow
                  label="Месяц 2"
                  value={segment.metrics.month2.value}
                  change={segment.metrics.month2.change}
                />
                <MetricRow
                  label="Месяц 3"
                  value={segment.metrics.month3.value}
                  change={segment.metrics.month3.change}
                />
              </div>
            </div>

            <Button
              onClick={() => onViewDetails(segment.id)}
              className="w-full mt-4 bg-teal-700 hover:bg-teal-800"
            >
              Подробнее
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MetricRow({ label, value, change }: { label: string; value: number; change: number }) {
  const isPositive = change > 0;
  
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-slate-900">{value.toLocaleString()} ₸</span>
        <span
          className={`flex items-center gap-1 ${
            isPositive ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {Math.abs(change)}%
        </span>
      </div>
    </div>
  );
}
