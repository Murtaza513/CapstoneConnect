import FypRegistrationForm from "../components/Auth/FypRegistrationForm";
import LoginPage from "../components/Auth/LoginPage";
import SignUpPage from "../components/Auth/SignUpPage";
import { Navigate } from 'react-router-dom';
const PublicRoutes = [
    { path: "*", element: <Navigate to="/" /> },
    {
        path: '/SignUpPage',
        element: <SignUpPage />
    },
    {
        path: '/',
        element: <LoginPage />
    },
    { path: '/FypRegistrationForm', element: <FypRegistrationForm /> },
    
]

export default PublicRoutes;