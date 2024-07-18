import ChangePassword from "./Auth/ChangePassword";
import ForgotPassword from "./Auth/ForgotPassword";
import UserLogin from "./Auth/Login";
import FieldOperatorCTA from "./Auth/fieldOperatorCTA";
import Dashboard from "./Dashboard";
import FDC from "./FieldDataCapture";
import MerData from "./FieldDataCapture/MerData";
import SurveyData from "./FieldDataCapture/SurveyData";
import WellTestData from "./FieldDataCapture/WellTestData";
// import UserRegister from "./Auth/register";
import DataForm from "./dataform/dataform";
import Homepage from "./homepage";

export const user_routes = [
   
    { path: '/', Component: <Homepage />, layout: false },
    { path: '/users/dashboard', Component: <Dashboard />, layout: true },
    { path: '/users/fdc/daily', Component: <FDC />, layout: true },
    { path: '/users/fdc/mer-data', Component: <MerData />, layout: true },
    { path: '/users/fdc/Well-test-data', Component: <WellTestData />, layout: true },
    { path: '/users/fdc/survey-data', Component: <SurveyData />, layout: true },
    // { path: '/152/login', Component: <UserLogin />, layout: true },
    // { path: '/147/login', Component: <UserLogin />, layout: true },
    // { path: '/24/login', Component: <UserLogin />, layout: true },
    // { path: '/152/register', Component: <UserRegister />, layout: true },
    // { path: '/147/register', Component: <UserRegister />, layout: true },
    // { path: '/24/register', Component: <UserRegister />, layout: true },
    { path: '/data-form', Component: <DataForm />, layout: true },
    { path: '/change-password', Component: <ChangePassword />, layout: true },
    { path: '/forgot-password', Component: <ForgotPassword />, layout: true },
    { path: '/field-op-cta', Component: <FieldOperatorCTA />, layout: true },
]