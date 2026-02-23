import { useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

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
} from "recharts";

interface SegmentDetailModalProps {
  segmentKey: string | null;
  data: any;
  onClose: () => void;
}

const SEGMENT_COLORS: Record<string, string> = {
  "Розничный сегмент": "#3b82f6",
  "Масс продукты": "#a855f7",
  "БК+ВКЛ": "#10b981",
};

export function SegmentDetailModal({ segmentKey, data, onClose }: SegmentDetailModalProps) {
  // если нет ключа — модалки нет
  if (!segmentKey) return null;

  // если ключ есть, но в data такого нет — покажем заглушку (важно для диагностики)
  const segment = data?.[segmentKey];
  if (!segment) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-900 font-semibold">Нет данных для: {segmentKey}</h3>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-900">✕</button>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Проверь, что segmentKey совпадает с ключами ответа бэка один в один.
          </p>
        </div>
      </div>
    );
  }

  const color = SEGMENT_COLORS[segmentKey] ?? "#64748b";

  // закрытие по ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const forecastChart = (segment.forecast ?? []).map((f: any) => ({
    month: formatMonth(f.date),
    value: Math.round(f.value),
  }));

  const coefChart = Object.entries(segment.coefficients ?? {})
    .filter(([k]) => k !== "const")
    .map(([name, value]: any) => ({
      name,
      value,
      fill: value > 0 ? "#22c55e" : "#ef4444",
    }));

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
          {/* header */}
          <div className="flex items-start justify-between border-b p-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <h2 className="text-slate-900 font-semibold text-lg">{segmentKey}</h2>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Детальный прогноз и структура модели
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-900 text-xl leading-none"
              aria-label="Close"
              type="button"
            >
              ✕
            </button>
          </div>

          {/* content */}
          <div className="space-y-6 p-6">
            {/* KPI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <p className="text-sm text-slate-600 mb-1">Модель</p>
                <Badge variant="secondary">OLS Linear Regression</Badge>
              </Card>

              <Card className="p-4">
                <p className="text-sm text-slate-600 mb-1">Adj R²</p>
                <p className="text-slate-900 font-semibold">
                  {(segment.r2_adj * 100).toFixed(2)}%
                </p>
              </Card>

              <Card className="p-4">
                <p className="text-sm text-slate-600 mb-1">Факторов</p>
                <p className="text-slate-900 font-semibold">
                  {(segment.features ?? []).length}
                </p>
              </Card>
            </div>

            {/* Forecast chart */}
            <Card className="p-6">
              <h3 className="text-slate-900 mb-4 font-semibold">Прогноз на 3 месяца</h3>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecastChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={4}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                    name="Прогноз"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Coefficients */}
            <Card className="p-6">
              <h3 className="text-slate-900 mb-4 font-semibold">
                Влияние факторов (коэффициенты)
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={coefChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Коэффициент" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Forecast table */}
            <Card className="p-6">
              <h3 className="text-slate-900 mb-4 font-semibold">Таблица прогноза</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-slate-600">Период</th>
                      <th className="text-right py-2 text-slate-600">Значение</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(segment.forecast ?? []).map((f: any) => (
                      <tr key={f.date} className="border-b">
                        <td className="py-2">{formatMonth(f.date)}</td>
                        <td className="text-right font-medium">
                          {Math.round(f.value).toLocaleString()} ₸
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* footer */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatMonth(dateStr: string) {
  return new Date(dateStr)
    .toLocaleDateString("ru-RU", { month: "long", year: "numeric" })
    .replace(" г.", "");
}
