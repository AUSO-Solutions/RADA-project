import { useState, useCallback } from 'react';
import { apiRequest } from 'Services';

export default function useApi(url, method = 'post') {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const makeRequest = useCallback(async (payload) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiRequest({ url, method, payload });
            setData(response.data);
        } catch (err) {
            setError(err);
        }
        setIsLoading(false);
    }, [url,method]);

    return { makeRequest, data, isLoading, error };
}

