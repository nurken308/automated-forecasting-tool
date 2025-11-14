import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

export function SettingsPage() {
  const handleSave = () => {
    toast.success('Настройки сохранены');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900">Настройки</h2>
        <p className="text-slate-600 mt-1">
          Управление настройками системы прогнозирования
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-slate-900 mb-4">Общие настройки</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Автоматическое обновление данных</Label>
              <p className="text-sm text-slate-600">
                Обновлять прогнозы при получении новых данных
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Уведомления</Label>
              <p className="text-sm text-slate-600">
                Получать уведомления о новых прогнозах
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Email отчеты</Label>
              <p className="text-sm text-slate-600">
                Отправлять еженедельные отчеты на почту
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-slate-900 mb-4">Параметры модели</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="forecast-horizon">Горизонт прогнозирования (дни)</Label>
            <Input
              id="forecast-horizon"
              type="number"
              defaultValue="30"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="confidence-level">Уровень доверия (%)</Label>
            <Input
              id="confidence-level"
              type="number"
              defaultValue="95"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="model-type">Модель по умолчанию</Label>
            <Input
              id="model-type"
              defaultValue="Linear Regression"
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-slate-900 mb-4">Интеграция GPT</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="api-key">API ключ</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              className="mt-2"
            />
            <p className="text-sm text-slate-600 mt-1">
              Введите ваш API ключ для активации AI ассистента
            </p>
          </div>

          <div>
            <Label htmlFor="department">Отдел</Label>
            <Input
              id="department"
              defaultValue="Аналитический отдел"
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-teal-700 hover:bg-teal-800">
          Сохранить изменения
        </Button>
      </div>
    </div>
  );
}
