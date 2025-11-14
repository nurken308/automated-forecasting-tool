import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { RotateCcw } from 'lucide-react';

interface StressTestingProps {
  onRecalculate: (params: Record<string, string>) => void;
}

export function StressTesting({ onRecalculate }: StressTestingProps) {
  const [params, setParams] = useState({
    // Макроэкономические
    gdpGrowth: '2.5',
    inflation: '8.0',
    unemployment: '5.2',
    interestRate: '16.0',
    exchangeRate: '450',
    oilPrice: '80',
    // Клиентские
    avgIncome: '250000',
    avgAge: '35',
    avgCreditScore: '720',
    avgDebtToIncome: '35',
    newClientsRate: '5.2',
    churRate: '2.1',
    // Продуктовые
    avgLoanAmount: '1500000',
    avgLoanTerm: '36',
    avgInterestRate: '18.5',
    overdueRate: '8.0',
    collectionRate: '65',
    writeOffRate: '3.2',
  });

  const [baselineForecast] = useState([
    { month: 'М1', baseline: 245000, stressed: 245000 },
    { month: 'М2', baseline: 251000, stressed: 251000 },
    { month: 'М3', baseline: 258000, stressed: 258000 },
  ]);

  const [stressedForecast, setStressedForecast] = useState(baselineForecast);

  const handleParamChange = (key: string, value: string) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    
    // Simulate forecast recalculation
    const impact = Math.random() * 0.2 + 0.9; // 0.9 to 1.1
    setStressedForecast(
      baselineForecast.map((item) => ({
        ...item,
        stressed: Math.round(item.baseline * impact),
      }))
    );
  };

  const handleReset = () => {
    setParams({
      gdpGrowth: '2.5',
      inflation: '8.0',
      unemployment: '5.2',
      interestRate: '16.0',
      exchangeRate: '450',
      oilPrice: '80',
      avgIncome: '250000',
      avgAge: '35',
      avgCreditScore: '720',
      avgDebtToIncome: '35',
      newClientsRate: '5.2',
      churRate: '2.1',
      avgLoanAmount: '1500000',
      avgLoanTerm: '36',
      avgInterestRate: '18.5',
      overdueRate: '8.0',
      collectionRate: '65',
      writeOffRate: '3.2',
    });
    setStressedForecast(baselineForecast);
  };

  const macroParams = [
    { key: 'gdpGrowth', label: 'Рост ВВП (%)', unit: '%' },
    { key: 'inflation', label: 'Инфляция (%)', unit: '%' },
    { key: 'unemployment', label: 'Безработица (%)', unit: '%' },
    { key: 'interestRate', label: 'Базовая ставка (%)', unit: '%' },
    { key: 'exchangeRate', label: 'Курс USD/KZT', unit: '₸' },
    { key: 'oilPrice', label: 'Цена на нефть ($/баррель)', unit: '$' },
  ];

  const clientParams = [
    { key: 'avgIncome', label: 'Средний доход клиента', unit: '₸' },
    { key: 'avgAge', label: 'Средний возраст', unit: 'лет' },
    { key: 'avgCreditScore', label: 'Средний кредитный рейтинг', unit: '' },
    { key: 'avgDebtToIncome', label: 'Долговая нагрузка (%)', unit: '%' },
    { key: 'newClientsRate', label: 'Прирост клиентов (%)', unit: '%' },
    { key: 'churRate', label: 'Отток клиентов (%)', unit: '%' },
  ];

  const productParams = [
    { key: 'avgLoanAmount', label: 'Средняя сумма кредита', unit: '₸' },
    { key: 'avgLoanTerm', label: 'Средний срок кредита', unit: 'мес' },
    { key: 'avgInterestRate', label: 'Средняя ставка (%)', unit: '%' },
    { key: 'overdueRate', label: 'Уровень просрочки (%)', unit: '%' },
    { key: 'collectionRate', label: 'Эффективность взыскания (%)', unit: '%' },
    { key: 'writeOffRate', label: 'Списания (%)', unit: '%' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-slate-900">Стресс-тестирование</h2>
        <Button onClick={handleReset} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          Сбросить
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-slate-900 mb-4">Параметры сценария</h3>
          
          <Tabs defaultValue="macro" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="macro">Макро</TabsTrigger>
              <TabsTrigger value="client">Клиенты</TabsTrigger>
              <TabsTrigger value="product">Продукты</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] mt-4">
              <TabsContent value="macro" className="space-y-4">
                {macroParams.map(({ key, label, unit }) => (
                  <div key={key}>
                    <Label htmlFor={key} className="text-sm">
                      {label}
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id={key}
                        value={params[key as keyof typeof params]}
                        onChange={(e) => handleParamChange(key, e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-sm text-slate-600 flex items-center min-w-[40px]">
                        {unit}
                      </span>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="client" className="space-y-4">
                {clientParams.map(({ key, label, unit }) => (
                  <div key={key}>
                    <Label htmlFor={key} className="text-sm">
                      {label}
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id={key}
                        value={params[key as keyof typeof params]}
                        onChange={(e) => handleParamChange(key, e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-sm text-slate-600 flex items-center min-w-[40px]">
                        {unit}
                      </span>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="product" className="space-y-4">
                {productParams.map(({ key, label, unit }) => (
                  <div key={key}>
                    <Label htmlFor={key} className="text-sm">
                      {label}
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id={key}
                        value={params[key as keyof typeof params]}
                        onChange={(e) => handleParamChange(key, e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-sm text-slate-600 flex items-center min-w-[40px]">
                        {unit}
                      </span>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </Card>

        <Card className="p-6">
          <h3 className="text-slate-900 mb-4">Сравнение прогнозов</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stressedForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="baseline"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Базовый сценарий"
              />
              <Line
                type="monotone"
                dataKey="stressed"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Стресс-сценарий"
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-3">
            <h4 className="text-sm text-slate-900">Влияние на прогноз:</h4>
            {stressedForecast.map((item, index) => {
              const diff = item.stressed - item.baseline;
              const pct = ((diff / item.baseline) * 100).toFixed(1);
              const isNegative = diff < 0;
              
              return (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{item.month}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900">
                      {item.stressed.toLocaleString()} ₸
                    </span>
                    <span
                      className={`${
                        isNegative ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      ({isNegative ? '' : '+'}
                      {pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            onClick={() => onRecalculate(params)}
            className="w-full mt-6 bg-teal-700 hover:bg-teal-800"
          >
            Применить сценарий
          </Button>
        </Card>
      </div>
    </div>
  );
}
