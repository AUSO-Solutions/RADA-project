import { BrowserRouter, Route, Routes } from "react-router-dom"
import { routes } from "./routes";
import './index.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { persistor, store } from "Store";
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClientProvider } from 'react-query'
import { queryClient } from "Services/queryClient";
import Modal from "Components/Modal";

import Layout from "Components/layout";

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient} >
          <BrowserRouter>
            <ToastContainer />
            <Modal />
            {/* <Refresh/> */}
            <Routes>
              {routes.map(route => {
                const layout = route.layout
                const path = route.path
                const Component = layout ? <Layout>{route.Component}</Layout> : route.Component
                return (
                  <Route path={path} element={Component}  key={path} />
                )
              })}
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
