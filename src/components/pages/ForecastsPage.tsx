import { useMemo, useState } from "react";
import { FileUpload } from "../FileUpload";
import { ForecastChart } from "../ForecastChart";
import { MetricsDisplay } from "../MetricsDisplay";
import { DataTable } from "../DataTable";
import { SavedForecasts } from "../SavedForecasts";
import { SegmentDetailModal } from "../SegmentDetailModal";
import { StressTesting } from "../StressTesting";
import { NewForecast } from "../NewForecast";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { DataPoint, RegressionModel } from "../../App";

// ✅ ВАЖНО: хук с бэка (который тянет прогнозы OLS)
import { useForecasts } from "../hooks/useForecasts";

export function ForecastsPage() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [model, setModel] = useState<RegressionModel | null>(null);
  const [autoUpdate, setAutoUpdate] = useState(false);

  // ✅ Ключ сегмента для модалки (именно строка: "Розничный сегмент", "Масс продукты", "БК+ВКЛ")
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  // ✅ Данные готовых прогнозов с API
  const { data: forecastsData, loading: forecastsLoading } = useForecasts();

  // оставил как было (если где-то используется)
  const [savedForecasts] = useState([
    {
      id: "1",
      name: "Прогноз просрочки",
      date: "2024-07-01",
      model: "Linear Regression",
      accuracy: 0.85,
    },
    {
      id: "2",
      name: "Прогноз просрочки",
      date: "2024-06-15",
      model: "Linear Regression",
      accuracy: 0.92,
    },
  ]);

  const calculateLinearRegression = (points: DataPoint[]): RegressionModel => {
    const n = points.length;
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const yMean = sumY / n;
    const ssTotal = points.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
    const ssResidual = points.reduce((sum, p) => {
      const predicted = slope * p.x + intercept;
      return sum + Math.pow(p.y - predicted, 2);
    }, 0);

    const rSquared = 1 - ssResidual / ssTotal;

    const maxX = Math.max(...points.map((p) => p.x));
    const forecastPoints = 5;
    const predictions: DataPoint[] = [];

    for (let i = 1; i <= forecastPoints; i++) {
      const x = maxX + i;
      const y = slope * x + intercept;
      predictions.push({ x, y });
    }

    return { slope, intercept, rSquared, predictions };
  };

  const handleDataUpload = (newData: DataPoint[]) => {
    setData(newData);
    const newModel = calculateLinearRegression(newData);
    setModel(newModel);
    toast.success("Данные загружены и прогноз построен");
  };

  const handleRefresh = () => {
    if (data.length > 0) {
      const updatedData = [...data];
      const lastX = Math.max(...data.map((p) => p.x));
      const randomY = data[data.length - 1].y + (Math.random() - 0.5) * 10;

      updatedData.push({ x: lastX + 1, y: randomY });
      setData(updatedData);

      const newModel = calculateLinearRegression(updatedData);
      setModel(newModel);

      toast.success("Данные обновлены и прогноз пересчитан");
    }
  };

  const toggleAutoUpdate = () => {
    setAutoUpdate(!autoUpdate);
    toast.info(!autoUpdate ? "Автообновление включено" : "Автообновление выключено");
  };

  // ✅ ВАЖНО: onViewDetails отдаёт СТРОКУ сегмента (например "Розничный сегмент"),
  // а мы эту строку кладем в selectedSegment — модалка по ней открывается.
  const handleViewForecast = (segmentKey: string) => {
    console.log("CLICKED segment:", segmentKey);
    setSelectedSegment(segmentKey);
  };

  const handleStressTest = (params: Record<string, string>) => {
    toast.success("Стресс-сценарий применён");
  };

  const handleBuildForecast = (payload: any) => {
    const macroText = payload.useMacrofactors ? "с макрофакторами" : "без макрофакторов";
    toast.success(`Прогноз построен успешно ${macroText}`);
  };

  // ✅ Удобно: чтобы не падать если forecastsData = null
  const safeForecastsData = useMemo(() => forecastsData ?? null, [forecastsData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Работа с прогнозами</h2>
          <p className="text-slate-600 mt-1">
            Загружайте данные и создавайте прогнозы на основе линейной регрессии
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={toggleAutoUpdate}
            variant={autoUpdate ? "default" : "outline"}
            className={autoUpdate ? "bg-teal-700 hover:bg-teal-800" : ""}
          >
            {autoUpdate ? "Автообновление ВКЛ" : "Автообновление ВЫКЛ"}
          </Button>

          <Button
            onClick={handleRefresh}
            disabled={data.length === 0}
            className="bg-teal-700 hover:bg-teal-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить данные
          </Button>
        </div>
      </div>

      <FileUpload onDataUpload={handleDataUpload} />

      {/* ✅ Готовые прогнозы с бэка */}
      {forecastsLoading ? (
        <div className="text-slate-600">Загрузка готовых прогнозов…</div>
      ) : (
        <SavedForecasts
          // ✅ ВАЖНО: SavedForecasts уже внутри сам использует useForecasts у тебя.
          // Но чтобы было надежно и не дублировать запросы, лучше сделать SavedForecasts с пропсом data.
          // Если ты НЕ хочешь менять SavedForecasts — оставь как есть и просто передай onViewDetails.
          onViewDetails={handleViewForecast}
        />
      )}

      {/* ✅ МОДАЛКА: открывается если selectedSegment !== null */}
      <SegmentDetailModal
        segmentKey={selectedSegment}
        data={safeForecastsData}
        onClose={() => setSelectedSegment(null)}
      />

      <StressTesting onRecalculate={handleStressTest} />

      <NewForecast onBuild={handleBuildForecast} />

      {data.length > 0 && model && (
        <>
          <MetricsDisplay model={model} dataPoints={data.length} />

          <Card className="p-6">
            <h2 className="text-slate-900 mb-4">Визуализация прогноза</h2>
            <ForecastChart data={data} predictions={model.predictions} />
          </Card>

          <DataTable data={data} predictions={model.predictions} />
        </>
      )}
    </div>
  );
}
