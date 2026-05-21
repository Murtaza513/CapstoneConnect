import React, { Component } from 'react';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { AdminRoutes, StudentRoutes, SupervisorRoutes } from './routes/AppRoutes';

import './custom.css';
import LoginPage from './components/Auth/LoginPage';
import SignUpPage from './components/Auth/SignUpPage';
import useAuth from './context/useAuth';
import PageNotFound from './components/Common/PageNotFound'
import { ConnectionProvider } from './context/ConnectionContext';

/*export default class App extends Component {
    static displayName = App.name;
    const user = localStorage.getItem("user")

  render() {
    return (
      
        <Routes>
            <Route element={user ? <Outlet /> : <Navigate to="/login" /> }>
                {AppRoutes.map((route, index) => {
                    const { element, ...rest } = route;
                    return <Route key={index} {...rest} element={element} />;
                })}
            </Route>
        </Routes>
      
    );
  }
}*/

function App() {
    const { user } = useAuth();
    const { userId } = useAuth();
    const { role } = useAuth();
    return (
        /*<Routes>
            {AppRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}
        </Routes>*/
        <ConnectionProvider userId={userId} role={role}>
        <Routes>
            {role === 'Admin' && (
                <Route element={user ? <Outlet /> : <Navigate to="/" />}>
                    {AdminRoutes.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element} />
                    ))}
                </Route>
            )}
            {role === 'Supervisor' && (
                <Route element={user ? <Outlet /> : <Navigate to="/" />}>
                    {SupervisorRoutes.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element} />
                    ))}
                </Route>
            )}
            {role === 'FypGroup' && (
                <Route element={user ? <Outlet /> : <Navigate to="/" />}>
                    {StudentRoutes.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element} />
                    ))}
                </Route>
            )}

            <Route path="/" element={role === "Admin" ? <Navigate to="/AdminCalender" /> : role === "FypGroup" ? <Navigate to="/StudentDashboard" /> : role === "Supervisor" ? <Navigate to="/SupervisorDashboard"/> : <LoginPage />} />
            <Route path="/SignUpPage" element={<SignUpPage />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
        </ConnectionProvider>
    );
}

export default App;