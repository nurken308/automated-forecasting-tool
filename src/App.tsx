import { useState } from 'react';
import { Header } from './components/Header';
import { ForecastsPage } from './components/pages/ForecastsPage';
import { AIAssistantPage } from './components/pages/AIAssistantPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { Toaster } from './components/ui/sonner';

export interface DataPoint {
  x: number;
  y: number;
  date?: string;
}

export interface RegressionModel {
  slope: number;
  intercept: number;
  rSquared: number;
  predictions: DataPoint[];
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('forecasts');

  const renderPage = () => {
    switch (currentPage) {
      case 'forecasts':
        return <ForecastsPage />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <ForecastsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster />
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="max-w-7xl mx-auto px-8 py-6">
        {renderPage()}
      </main>
    </div>
  );
}
