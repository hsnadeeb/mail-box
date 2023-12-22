import { useState } from 'react';

const useFetch = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (url, options = {}) => {
    setIsLoading(true);

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
      setIsLoading(false);

      return { data: result, response };
    } catch (error) {
      setError(error.message);
      setIsLoading(false);

      return { error };
    }
  };

  return { data, isLoading, error, fetchData };
};

export default useFetch;
