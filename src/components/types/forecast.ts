export interface ForecastPoint {
  date: string;
  value: number;
}

export interface SegmentForecast {
  r2_adj: number;
  features: string[];
  coefficients: Record<string, number>;
  forecast: ForecastPoint[];
}

export type ForecastResponse = Record<string, SegmentForecast>;
