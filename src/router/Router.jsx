import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import ErrorPage from "../shared/ErrorPage";
import ProtectedRoute from "../layout/ProtectedRoute";
import ProductDetails from "../components/ProductDetails";
import CartPage from "../components/CartPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement:<ErrorPage/>,
    children: [
      {
        path: "/",
        element: <ProtectedRoute> <Home /></ProtectedRoute> ,
      },{
        path:"/products/:id",
        element: <ProtectedRoute>  <ProductDetails/></ProtectedRoute> 
      },{
        path:'/cart',
        element:<CartPage/>
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Register />,
  },
]);
