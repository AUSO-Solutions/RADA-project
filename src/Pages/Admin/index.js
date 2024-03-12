import Dashboard from "./dashboard";
import Reports from "./reports";
import UserData from "./usersdata";

export const admin_routes = [
    { path: '/admin', Component: <>ADMIN Login</>, layout: true },
    { path: '/admin/home', Component: <Dashboard />, layout: false },
    // { path: '/admin/home', Component: <UserData />, layout: false },
    { path: '/admin/reports', Component: <Reports />, layout: false },



]