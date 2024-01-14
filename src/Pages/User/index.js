import UserLogin from "./Auth/Login";

export const user_routes = [
    { path: '/', Component: <UserLogin />, layout: true },
]