import Profile from "Pages/Profile";
import Dashboard from "./dashboard";
import Reports from "./reports";
import CreateUsers from "./users";
import Users from "./users/users";
import Groups from "./group";
import Roles from "./roles";
import ActivityLog from "./ActivityLog";
import Assets from "./assets";
import Group from "./group/group";
// import UserData from "./usersdata";

export const admin_routes = [
    { path: '/admin', Component: <>ADMIN Login</>, layout: true },
    { path: '/admin/home', Component: <Dashboard />, layout: false },
    { path: '/admin/users', Component: <Users />, layout: true },
    { path: '/admin/groups', Component: <Groups />, layout: true },
    { path: '/admin/roles-and-permissions', Component: <Roles />, layout: true },
    { path: '/admin/activity-log', Component: <ActivityLog />, layout: true },
    { path: '/admin/create-users', Component: <CreateUsers />, layout: false },
    { path: '/admin/reports', Component: <Reports />, layout: false },
    { path: '/admin/manage-assets', Component: <Assets />, layout: true },
    { path: '/admin/group', Component: <Group />, layout: true },
    { path: '/profile', Component: <Profile />, layout: false },
]