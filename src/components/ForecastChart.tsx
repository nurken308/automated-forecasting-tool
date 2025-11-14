import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { DataPoint } from '../App';

interface ForecastChartProps {
  data: DataPoint[];
  predictions: DataPoint[];
}

export function ForecastChart({ data, predictions }: ForecastChartProps) {
  const chartData = [
    ...data.map((d) => ({
      period: d.date || `Period ${d.x}`,
      actual: d.y,
      predicted: null,
    })),
    ...predictions.map((d) => ({
      period: d.date || `Period ${d.x}`,
      actual: null,
      predicted: d.y,
    })),
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="period"
          stroke="#64748b"
          tick={{ fill: '#64748b' }}
        />
        <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <ReferenceLine
          x={`Period ${data.length}`}
          stroke="#94a3b8"
          strokeDasharray="3 3"
          label={{ value: 'Forecast Start', position: 'top', fill: '#64748b' }}
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          name="Actual Data"
        />
        <Line
          type="monotone"
          dataKey="predicted"
          stroke="#10b981"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: '#10b981', r: 4 }}
          name="Forecast"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
