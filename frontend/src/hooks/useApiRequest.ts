import { AxiosResponse } from "axios";
import { useState } from "react";

export const useApiRequest = <Data>() => {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const request = (requestHandler: () => Promise<AxiosResponse>) => {
    requestHandler()
      .then((response) => {
        setData(response.data);
        setError(null);
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Something went wrong";
        setError(errorMessage);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { data, error, loading, request };
};
