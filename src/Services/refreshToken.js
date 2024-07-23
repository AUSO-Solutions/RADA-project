import { apiRequest } from "Services"
import { store } from "Store"
import { refreshTokens } from "Store/slices/auth"

export const refreshToken = async () => {
    try {

        const data = await apiRequest({
            method: 'get',
            url: '/users/token/refresh',

        })
       store.dispatch(refreshTokens(data))
    } catch (error) {

    }
}