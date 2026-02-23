import { useEffect, useState } from "react";

export function useForecasts() {
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://10.20.42.67:8000/OLS/forecast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch forecast");
        }
        return res.json();
      })
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
