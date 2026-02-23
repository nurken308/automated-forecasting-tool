import { useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { DataPoint } from '../App';

interface FileUploadProps {
  onDataUpload: (data: DataPoint[]) => void;
}

export function FileUpload({ onDataUpload }: FileUploadProps) {
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Assume first column is X (or time period) and second column is Y (value)
          const parsedData: DataPoint[] = jsonData.map((row: any, index) => {
            const keys = Object.keys(row);
            return {
              x: index + 1,
              y: parseFloat(row[keys[1]] || row[keys[0]]) || 0,
              date: row[keys[0]]?.toString(),
            };
          });

          if (parsedData.length < 2) {
            toast.error('Please upload a file with at least 2 data points');
            return;
          }

          onDataUpload(parsedData);
        } catch (error) {
          toast.error('Error parsing Excel file');
          console.error(error);
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [onDataUpload]
  );

  const loadSampleData = () => {
    // Generate sample data
    const sampleData: DataPoint[] = [];
    const baseValue = 100;
    const trend = 5;
    
    for (let i = 1; i <= 12; i++) {
      const noise = (Math.random() - 0.5) * 10;
      sampleData.push({
        x: i,
        y: baseValue + trend * i + noise,
        date: `Month ${i}`,
      });
    }
    
    onDataUpload(sampleData);
    toast.success('Sample data loaded');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FileSpreadsheet className="w-5 h-5 text-slate-600" />
            <h3 className="text-slate-900">Upload Data</h3>
          </div>
          <p className="text-slate-600 text-sm">
            Upload an Excel file with your time series data. First column: dates/periods, Second column: values.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={loadSampleData}>
            Load Sample Data
          </Button>
          <label htmlFor="file-upload">
            <Button asChild>
              <span className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload Excel
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
    </Card>
  );
}
