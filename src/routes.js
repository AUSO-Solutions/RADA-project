
import { admin_routes } from "Pages/Admin"
import { user_routes } from "Pages/User"
// import { fdc_routes } from "Pages/FDC"

const routes =
    [
        ...admin_routes,
        ...user_routes,
        
    ]
export { routes }