import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { BarChart3, Bot, Settings } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src="https://sun1-28.userapi.com/s/v1/ig2/hRBuQn4g0eP52lYON4xpCZ8-K8qGN0K_CkROHfLLpc5COHwlaMUREt_7skcXbrAvSw7falBu-DmAUqUrzd_x2SIt.jpg?size=1280x1280&quality=95&crop=0,0,1280,1280&ava=1"
              alt="Logo"
              className="w-10 h-10 rounded-lg"
            />
            <div>
              <h1 className="text-slate-900">Forecast Analytics</h1>
              <p className="text-sm text-slate-600">Direction of Portfolio Analytics</p>
            </div>
          </div>
          
          <nav className="flex gap-2">
            <Button
              variant={currentPage === 'forecasts' ? 'default' : 'ghost'}
              onClick={() => onNavigate('forecasts')}
              className={currentPage === 'forecasts' ? 'bg-teal-700 hover:bg-teal-800' : ''}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Прогнозы
            </Button>
            <Button
              variant={currentPage === 'ai-assistant' ? 'default' : 'ghost'}
              onClick={() => onNavigate('ai-assistant')}
              className={currentPage === 'ai-assistant' ? 'bg-teal-700 hover:bg-teal-800' : ''}
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Ассистент
            </Button>
            <Button
              variant={currentPage === 'settings' ? 'default' : 'ghost'}
              onClick={() => onNavigate('settings')}
              className={currentPage === 'settings' ? 'bg-teal-700 hover:bg-teal-800' : ''}
            >
              <Settings className="w-4 h-4 mr-2" />
              Настройки
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
