import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { useForecasts } from "./hooks/useForecasts";

export function SavedForecasts({ onViewDetails }) {
  const { data, loading } = useForecasts();

  if (loading) return <div>Загрузка…</div>;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-slate-900">Готовые прогнозы</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Object.entries(data).map(([segmentName, segment]) => {
          const forecast = segment.forecast.slice(0, 3);

          return (
            <Card
              key={segmentName}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-slate-900">{segmentName}</h3>

              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-slate-600">Модель:</span>
                <Badge variant="secondary">OLS Linear Regression</Badge>
              </div>

              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-slate-600">Adj R²:</span>
                <span className="text-slate-900">
                  {(segment.r2_adj * 100).toFixed(2)}%
                </span>
              </div>

              <div className="border-t mt-4 pt-4 space-y-2">
                {forecast.map((item, idx) => {
                  const prev = idx > 0 ? forecast[idx - 1].value : null;
                  const change =
                    prev !== null
                      ? ((item.value / prev - 1) * 100)
                      : null;

                  return (
                    <MetricRow
                      key={item.date}
                      label={formatMonth(item.date).replace(" г.", "")}
                      value={item.value}
                      change={change}
                    />
                  );
                })}
              </div>

              <Button
                className="w-full mt-4 bg-teal-700 hover:bg-teal-800"
                onClick={() => {
                  console.log("CLICKED", segmentName);
                  onViewDetails?.(segmentName);
                }}
              >
                Подробнее
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  change,
}: {
  label: string;
  value: number;
  change: number | null;
}) {
  const isPositive = change !== null && change > 0;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>

      <div className="flex items-center gap-2">
        <span className="text-slate-900">
          {value.toLocaleString()} ₸
        </span>

        {change !== null && (
          <span
            className={`flex items-center gap-1 ${
              isPositive ? "text-red-600" : "text-green-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

function formatMonth(dateStr: string) {
  const date = new Date(dateStr);

  return date.toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  });
}