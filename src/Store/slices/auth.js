import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'todos',
    initialState: { user: {} },
    reducers: {
        setUser: (state, { payload }) => {
            if (payload) {
                console.log({payload})
                state.user = payload
                state.user.name = payload?.firstName + " " + payload?.lastName;
                state.user.loggedInAt = Date.now()
            }
        },
        logout: (state, { payload }) => {
            state = {}
            window.location.assign('/login')
        },
        reuse: (state, { payload }) => {
            state.user.lastUsedApp = Date.now()
        },
        refreshTokens: (state, {payload}) => {
            state.user.access_token = payload?.access_token
            state.user.refresh_token = payload?.refresh_token
            state.user.loggedInAt =  Date.now()
        }
    }
});

// this is for dispatch
export const { setUser, logout, reuse , refreshTokens} = authSlice.actions;

// this is for configureStore
export default authSlice.reducer;
