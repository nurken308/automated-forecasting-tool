import { Card } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { DataPoint } from '../App';

interface DataTableProps {
  data: DataPoint[];
  predictions: DataPoint[];
}

export function DataTable({ data, predictions }: DataTableProps) {
  const recentData = data.slice(-5);
  
  return (
    <Card className="p-6">
      <h2 className="text-slate-900 mb-4">Recent Data & Forecasts</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Period</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentData.map((point, index) => (
            <TableRow key={`data-${index}`}>
              <TableCell>{point.date || `Period ${point.x}`}</TableCell>
              <TableCell>{point.y.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant="secondary">Actual</Badge>
              </TableCell>
            </TableRow>
          ))}
          {predictions.map((point, index) => (
            <TableRow key={`pred-${index}`} className="bg-green-50">
              <TableCell>{point.date || `Period ${point.x}`}</TableCell>
              <TableCell>{point.y.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant="default" className="bg-green-600">Forecast</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
