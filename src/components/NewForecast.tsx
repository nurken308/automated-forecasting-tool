import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Upload } from 'lucide-react';

interface NewForecastProps {
  onBuild: (data: {
    file: File | null;
    forecastType: string;
    additionalFile: File | null;
    expectedChanges: string;
    useMacrofactors: boolean;
  }) => void;
}

export function NewForecast({ onBuild }: NewForecastProps) {
  const [file, setFile] = useState<File | null>(null);
  const [forecastType, setForecastType] = useState('');
  const [additionalFile, setAdditionalFile] = useState<File | null>(null);
  const [expectedChanges, setExpectedChanges] = useState('');
  const [useMacrofactors, setUseMacrofactors] = useState<boolean>(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAdditionalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAdditionalFile(e.target.files[0]);
    }
  };

  const handleBuild = () => {
    onBuild({ file, forecastType, additionalFile, expectedChanges, useMacrofactors });
  };

  return (
    <Card className="p-6">
      <h2 className="text-slate-900 mb-4">Новый прогноз</h2>
      <div className="space-y-5">
        <div>
          <Label htmlFor="excel-file">Загрузить Excel-файл с данными</Label>
          <div className="mt-2">
            <label
              htmlFor="excel-file"
              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:border-teal-500 cursor-pointer transition-colors"
            >
              {file ? (
                <div className="text-center">
                  <p className="text-sm text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">
                    Нажмите для загрузки файла
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Excel, CSV до 10 MB
                  </p>
                </div>
              )}
            </label>
            <input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="forecast-type">Что хотите спрогнозировать?</Label>
          <Select value={forecastType} onValueChange={setForecastType}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Выберите показатель" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overdue">Просрочка</SelectItem>
              <SelectItem value="sales">Продажи</SelectItem>
              <SelectItem value="revenue">Выручка</SelectItem>
              <SelectItem value="customers">Количество клиентов</SelectItem>
              <SelectItem value="ltv">Lifetime Value</SelectItem>
              <SelectItem value="churn">Отток клиентов</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3 block">Использовать макрофакторы</Label>
          <RadioGroup
            value={useMacrofactors ? 'with' : 'without'}
            onValueChange={(value) => setUseMacrofactors(value === 'with')}
          >
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="with" id="with-macro" />
              <Label htmlFor="with-macro" className="cursor-pointer">
                С макрофакторами (ВВП, инфляция, курс и т.д.)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="without" id="without-macro" />
              <Label htmlFor="without-macro" className="cursor-pointer">
                Без макрофакторов (только исторические данные)
              </Label>
            </div>
          </RadioGroup>
          {useMacrofactors && (
            <p className="text-sm text-slate-600 mt-2 p-3 bg-blue-50 rounded-lg">
              Модель будет учитывать внешние экономические факторы для более точного прогноза
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="additional-file">
            Добавить дополнительные регрессоры (опционально)
          </Label>
          <Input
            id="additional-file"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleAdditionalFileChange}
            className="mt-2"
          />
          {additionalFile && (
            <p className="text-sm text-slate-600 mt-1">{additionalFile.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="expected-changes">
            Ожидаемые изменения (опционально)
          </Label>
          <Input
            id="expected-changes"
            placeholder="например, +10% рост или -5% снижение"
            value={expectedChanges}
            onChange={(e) => setExpectedChanges(e.target.value)}
            className="mt-2"
          />
        </div>

        <Button
          onClick={handleBuild}
          className="w-full bg-teal-700 hover:bg-teal-800"
          disabled={!file || !forecastType}
        >
          Построить прогноз
        </Button>
      </div>
    </Card>
  );
}
