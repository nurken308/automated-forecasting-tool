import { Card } from './ui/card';
import { TrendingUp, Target, Database } from 'lucide-react';
import { RegressionModel } from '../App';

interface MetricsDisplayProps {
  model: RegressionModel;
  dataPoints: number;
}

export function MetricsDisplay({ model, dataPoints }: MetricsDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-slate-600 text-sm">Slope (Trend)</p>
            <p className="text-slate-900 text-2xl">{model.slope.toFixed(3)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-slate-600 text-sm">R² (Accuracy)</p>
            <p className="text-slate-900 text-2xl">{(model.rSquared * 100).toFixed(1)}%</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Database className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-slate-600 text-sm">Data Points</p>
            <p className="text-slate-900 text-2xl">{dataPoints}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
