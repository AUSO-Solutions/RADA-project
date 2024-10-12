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
    { path: '/admin', Component: <>ADMIN Login</>, layout: true, isPublic : false },
    { path: '/admin/home', Component: <Dashboard />, layout: false, isPublic : false },
    { path: '/admin/users', Component: <Users />, layout: true, isPublic : false },
    { path: '/admin/groups', Component: <Groups />, layout: true, isPublic : false },
    { path: '/admin/roles-and-permissions', Component: <Roles />, layout: true, isPublic : false },
    { path: '/admin/activity-log', Component: <ActivityLog />, layout: true, isPublic : false },
    { path: '/admin/create-users', Component: <CreateUsers />, layout: false, isPublic : false },
    { path: '/admin/reports', Component: <Reports />, layout: false, isPublic : false },
    { path: '/admin/manage-assets', Component: <Assets />, layout: true, isPublic : false },
    { path: '/admin/groups/:groupId', Component: <Group />, layout: true, isPublic : false },
    { path: '/profile', Component: <Profile />, layout: false, isPublic : false },
]