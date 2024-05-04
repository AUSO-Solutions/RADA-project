import Dashboard from "./dashboard";
import Reports from "./reports";
import CreateUsers from "./users";
// import UserData from "./usersdata";

export const admin_routes = [
    { path: '/admin', Component: <>ADMIN Login</>, layout: true },
    { path: '/admin/home', Component: <Dashboard />, layout: false },
    { path: '/admin/create-users', Component: <CreateUsers />, layout: false },
    { path: '/admin/reports', Component: <Reports />, layout: false },
]