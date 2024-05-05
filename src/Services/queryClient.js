import { apiRequest } from ".";
import { QueryClient } from 'react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: async ({ queryKey: [url] }) => {
                if (typeof url === 'string') {
                    const data  = await apiRequest({ url: url.toLowerCase(), hasAuth: true, showError: false })
                    // console.log(data)
                    return data
                }
                throw new Error('Invalid QueryKey')
            },
            refetchOnReconnect: true,
            enabled: true

        },
    }
});

queryClient.clear();