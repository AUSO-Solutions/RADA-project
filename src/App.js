import { BrowserRouter, Route, Routes } from "react-router-dom"
import { routes } from "./routes";
import { Layout } from "Partials";
import './index.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <BrowserRouter>
    <ToastContainer />
      <Routes>
        {routes.map(route => {
          const layout = route.layout
          const path = route.path
          const Component = layout ? <Layout>{route.Component}</Layout> : route.Component
          return (
            <Route path={path} element={Component} />
          )
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
