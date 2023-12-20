import { useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import axios from './useAxios';

interface RequestData {
  data: any;
  loading: boolean;
  error: Error | null;
}

interface RequestConfig extends AxiosRequestConfig {
  url: string;
}

interface RequestHook extends RequestData {
  makeRequest: (config: RequestConfig) => void;
}

function useRequest(): RequestHook {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const makeRequest = async (config: RequestConfig) => {
    console.log(config)
    setLoading(true);
    try {
      const response = await axios(config);
      setData(response.data);
      console.log(response.data);
    } catch (error: any) {
      setError(error);
      console.error('Error making request:', error);
      if (error?.response?.data?.errors?.[0]?.message) {
        console.log(error, 1)
        // alert(error?.response?.data?.errors?.[0]?.message);
      } else {
        console.log(error, error?.response?.data, 2)
        // alert(error?.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, makeRequest };
}

export default useRequest;
