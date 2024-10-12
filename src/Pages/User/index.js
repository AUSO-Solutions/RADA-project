import ChangePassword from "./Auth/ChangePassword";
import ForgotPassword from "./Auth/ForgotPassword";
// import UserLogin from "./Auth/Login";
import FieldOperatorCTA from "./Auth/fieldOperatorCTA";
import Dashboard from "./Dashboard";
import FDC from "./FieldDataCapture/DailyoOperation";
import OilGasAccountingTable from "./FieldDataCapture/DailyoOperation/OilAndGasAccount/OilGasAccountingTable";
import GasTable from "./FieldDataCapture/DailyoOperation/VolumeMeasurement/GasTable";
import VolumeMeasurementTable from "./FieldDataCapture/DailyoOperation/VolumeMeasurement/VolumeMeasurementTable";
import FGSurveyData from "./FieldDataCapture/FGSurveyData";
import MERData from "./FieldDataCapture/MerData";
import MERDataTable from "./FieldDataCapture/MerData/MERData/MERDataTable";
import MERScheduleTable from "./FieldDataCapture/MerData/Schedule/ScheduleTable";
// import MerData from "./FieldDataCapture/MerData/MerData";
// import SurveyData from "./FieldDataCapture/SurveyData";
import WellTest from "./FieldDataCapture/WellTest";
import IPSCTable from "./FieldDataCapture/WellTest/IPSC/IPSCTable";
import ScheduleTable from "./FieldDataCapture/WellTest/Schedule/ScheduleTable";
import WellTestDataTable from "./FieldDataCapture/WellTest/WellTest/WellTestDataTable";
// import UserRegister from "./Auth/register";
import DataForm from "./dataform/dataform";
import Homepage from "./homepage";

export const user_routes = [

    { path: '/', Component: <Homepage />, layout: false, isPublic: true },
    { path: '/users/dashboard', Component: <Dashboard />, layout: true, isPublic: false },
    { path: '/users/fdc/daily', Component: <FDC />, layout: true, isPublic: false },
    { path: '/users/fdc/daily/volume-measurement-table', Component: <VolumeMeasurementTable />, layout: true, isPublic: false },
    { path: '/users/fdc/daily/gas-table', Component: <GasTable />, layout: true, isPublic: false },
    { path: '/users/fdc/daily/oil-and-gas-accounting-table', Component: <OilGasAccountingTable />, layout: true, isPublic: false },
    // { path: '/users/fdc/mer-data', Component: <MerData />, layout: true, isPublic : false },
    { path: '/users/fdc/mer-data', Component: <MERData />, layout: true, isPublic: false },
    { path: '/users/fdc/mer-data/schedule-table', Component: < MERScheduleTable />, layout: true, isPublic: false },
    { path: '/users/fdc/mer-data/mer-data-result-table', Component: <MERDataTable />, layout: true, isPublic: false },
    { path: '/users/fdc/Well-test-data', Component: <WellTest />, layout: true, isPublic: false },
    { path: '/users/fdc/Well-test-data/schedule-table', Component: <ScheduleTable />, layout: true, isPublic: false },
    { path: '/users/fdc/Well-test-data/well-test-table', Component: <WellTestDataTable />, layout: true, isPublic: false },
    { path: '/users/fdc/Well-test-data/ipsc-table', Component: <IPSCTable />, layout: true, isPublic: false },
    // { path: '/users/fdc/survey-data', Component: <SurveyData />, layout: true, isPublic : false },
    { path: '/users/fdc/survey-data', Component: <FGSurveyData />, layout: true, isPublic: false },
    // { path: '/152/login', Component: <UserLogin />, layout: true, isPublic : false },
    // { path: '/147/login', Component: <UserLogin />, layout: true, isPublic : false },
    // { path: '/24/login', Component: <UserLogin />, layout: true, isPublic : false },
    // { path: '/152/register', Component: <UserRegister />, layout: true, isPublic : false },
    // { path: '/147/register', Component: <UserRegister />, layout: true, isPublic : false },
    // { path: '/24/register', Component: <UserRegister />, layout: true, isPublic : false },
    { path: '/data-form', Component: <DataForm />, layout: true, isPublic: false },
    { path: '/change-password', Component: <ChangePassword />, layout: true, isPublic: false },
    { path: '/forgot-password', Component: <ForgotPassword />, layout: false, isPublic: true },
    { path: '/field-op-cta', Component: <FieldOperatorCTA />, layout: true, isPublic: false },
]