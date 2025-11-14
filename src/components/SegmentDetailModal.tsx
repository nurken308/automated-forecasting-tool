import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface SegmentDetailModalProps {
  segmentId: string | null;
  onClose: () => void;
}

export function SegmentDetailModal({ segmentId, onClose }: SegmentDetailModalProps) {
  if (!segmentId) return null;

  const segmentData = {
    '1': {
      name: 'Розничный сегмент',
      model: 'XGBoost',
      accuracy: 0.87,
      color: '#3b82f6',
    },
    '2': {
      name: 'Корпоративный сегмент',
      model: 'Linear Regression',
      accuracy: 0.92,
      color: '#a855f7',
    },
    '3': {
      name: 'МСБ сегмент',
      model: 'Random Forest',
      accuracy: 0.85,
      color: '#10b981',
    },
  }[segmentId] || {
    name: 'Сегмент',
    model: 'Model',
    accuracy: 0,
    color: '#000',
  };

  const forecastData = [
    { month: 'Текущий', value: 240000, lower: 235000, upper: 245000 },
    { month: 'Месяц 1', value: 245000, lower: 238000, upper: 252000 },
    { month: 'Месяц 2', value: 251000, lower: 242000, upper: 260000 },
    { month: 'Месяц 3', value: 258000, lower: 247000, upper: 269000 },
  ];

  const metricsData = [
    { name: 'MAE', value: 1250, benchmark: 1500 },
    { name: 'RMSE', value: 1680, benchmark: 2000 },
    { name: 'MAPE', value: 3.2, benchmark: 5.0 },
  ];

  return (
    <Dialog open={!!segmentId} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segmentData.color }} />
            {segmentData.name}
          </DialogTitle>
          <DialogDescription>
            Детальный прогноз и метрики качества модели
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-sm text-slate-600 mb-1">Модель</p>
              <Badge variant="secondary">{segmentData.model}</Badge>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-slate-600 mb-1">Точность</p>
              <p className="text-slate-900">{(segmentData.accuracy * 100).toFixed(0)}%</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-slate-600 mb-1">Горизонт</p>
              <p className="text-slate-900">3 месяца</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-slate-900 mb-4">Прогноз просрочки</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="lower"
                  stroke="#94a3b8"
                  strokeDasharray="3 3"
                  name="Нижняя граница"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={segmentData.color}
                  strokeWidth={3}
                  name="Прогноз"
                />
                <Line
                  type="monotone"
                  dataKey="upper"
                  stroke="#94a3b8"
                  strokeDasharray="3 3"
                  name="Верхняя граница"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-slate-900 mb-4">Метрики качества</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={segmentData.color} name="Текущая модель" />
                <Bar dataKey="benchmark" fill="#cbd5e1" name="Бенчмарк" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-slate-900 mb-4">Детальная таблица</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-slate-600">Период</th>
                    <th className="text-right py-2 text-slate-600">Прогноз (₸)</th>
                    <th className="text-right py-2 text-slate-600">Изменение (%)</th>
                    <th className="text-right py-2 text-slate-600">Доверительный интервал</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastData.slice(1).map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 text-slate-900">{row.month}</td>
                      <td className="text-right text-slate-900">{row.value.toLocaleString()}</td>
                      <td className="text-right text-slate-900">
                        +{((row.value / 240000 - 1) * 100).toFixed(1)}%
                      </td>
                      <td className="text-right text-slate-600">
                        {row.lower.toLocaleString()} - {row.upper.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}