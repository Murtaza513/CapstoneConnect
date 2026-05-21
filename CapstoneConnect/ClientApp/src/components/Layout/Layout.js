import React, { useState } from 'react';
import Header from './Header';
import Sidebar from '../Layout/Sidebar';
import MainSidebar from '../Layout/MainSideBar'
import './Layout.css';

const Layout = ({children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="layout">
            <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen } />
            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            {/*<MainSidebar/>*/}
            <div style={{ display: "flex", justifyContent: "end", width:"100%" }}>
                <main className="layout__content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
