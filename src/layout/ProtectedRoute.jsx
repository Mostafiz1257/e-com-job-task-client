
import { useCurrentToken } from "../redux/features/auth/authSlice";
import { useAppSelector } from "../redux/hooks";
// import {   useCurrentToken } from "../redux/features/auth/authSlice";
// import {useAppSelector} from "../redux/features/auth/authSlice"
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => { // Destructure `children`
    const token = useAppSelector(useCurrentToken);
  
    if (!token) {
      return <Navigate to="/login" replace={true} />;
    }
  
    return children;
  };
  
  export default ProtectedRoute;