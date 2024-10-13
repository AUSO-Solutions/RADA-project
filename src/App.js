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

  const PrivateRoute = ({ children }) => {
    const uid = store.getState().auth.user?.data?.uid
    if (uid) return children
    return <Navigate to={'/'} />
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient} >
          <BrowserRouter>
            <ToastContainer />
            <Modal />
            <Loading />
            <Routes>
              {routes.map(route => {
                const layout = route.layout
                const path = route.path
                const isPublic = route.isPublic
                const Component = layout ? <Layout>{route.Component}</Layout> : route.Component
                const Protect = isPublic ? Component : <PrivateRoute>{Component}</PrivateRoute>
                return (
                  <Route path={path} element={Protect} key={path} />
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
