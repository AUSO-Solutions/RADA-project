import ChangePassword from "./Auth/ChangePassword";
import ForgotPassword from "./Auth/ForgotPassword";
import UserLogin from "./Auth/Login";
import UserRegister from "./Auth/register";
import DataForm from "./dataform/dataform";
import Homepage from "./homepage";

export const user_routes = [
   
    { path: '/', Component: <Homepage />, layout: true },
    { path: '/login', Component: <UserLogin />, layout: true },
    { path: '/152/login', Component: <UserLogin />, layout: true },
    { path: '/147/login', Component: <UserLogin />, layout: true },
    { path: '/24/login', Component: <UserLogin />, layout: true },
    { path: '/152/register', Component: <UserRegister />, layout: true },
    { path: '/147/register', Component: <UserRegister />, layout: true },
    { path: '/24/register', Component: <UserRegister />, layout: true },
    { path: '/data-form', Component: <DataForm />, layout: true },
    { path: '/change-password', Component: <ChangePassword />, layout: true },
    { path: '/forgot-password', Component: <ForgotPassword />, layout: true },
]