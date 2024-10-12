import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
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
import Loading from "Components/Loading";

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient} >
          <BrowserRouter>
            <ToastContainer />
            <Modal />
            <Loading />
            {/* <Refresh/> */}
            <Routes>
              {routes.map(route => {
                const layout = route.layout
                const path = route.path
                const isPublic = route.isPublic
                if (!isPublic) {
                  const uid = store.getState().auth.user?.data?.uid
                  console.log( uid )
                  if (!uid) return <Route path={path} element={<Navigate to={'/'} />} key={path} />
                }
                const Component = layout ? <Layout>{route.Component}</Layout> : route.Component
                return (
                  <Route path={path} element={Component} key={path} />
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
