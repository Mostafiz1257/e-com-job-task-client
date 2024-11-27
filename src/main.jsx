import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider } from 'react-router-dom'
import { router } from './router/Router.jsx'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.js'
import { Toaster, toast } from 'sonner'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <Toaster />
  <RouterProvider router={router}></RouterProvider>
  </PersistGate>
    </Provider>
  </StrictMode>,
)
