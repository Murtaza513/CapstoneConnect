import React, { useState } from 'react';
import '../Layout/Sidebar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import vector1 from "../assets/Vector (1).png";
import vector2 from "../assets/Vector (2).png";
import vector3 from "../assets/Vector (3).png";
import vector4 from "../assets/profile-2user.png";
import vector5 from "../assets/Vector (4).png";
/*import vector6 from "./assets/Group.png";*/
import vector7 from "../assets/icons8-idea-24.png";
import vector8 from "../assets/Group 27.png";
import useAuth from '../../context/useAuth';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { pathname } = useLocation();
    const { role, userLogout } = useAuth();
    const [activePage, setActivePage] = useState('Dashboard');
    
    const studentItems = [
        { name: 'Dashboard', url: "/StudentDashboard", img: vector1 },
        { name: 'Calender', url: "/calendar", img: vector2  },
        { name: 'Supervisors', url: "/AdminSup", img: vector4 },
        { name: 'Project Repository', url: "/PrevProjects", img: vector5 },
        { name: 'Submission', url: "/ProposalsList", img: vector3 },
        { name: 'Fyp Guidelines', url: "/FypGuidline", img: vector5 },
        { name: 'Fortnightly', url: '/MomList', img: vector3 },
        { name: 'Queries', url: '/StudentQueries', img: vector5 }
    ];

    const adminItems = [
        { name: 'Dashboard', url: "/AdminCalender", img: vector1 },
        /*{ name: 'Calender', url: "/AdminCalender", img: vector2 },*/
        { name: 'Supervisors', url: "/AdminSup", img: vector4 },
        { name: 'Project Repository', url: "/PrevProjects", img: vector5 },
        { name: 'Ongoing Projects', url: "/OnGoingProjects", img: vector5 },
        { name: 'Queries', url: "/AdminQueries", img: vector3 },
        { name: 'Registrations', url: "/AdminRegistration", img: vector5  },
        { name: 'Fyp Guidelines', url: "/FypGuidline", img: vector7 },
    ];

    const supervisorItems = [
        { name: 'Dashboard', url: "/SupervisorDashboard", img: vector1 },
        { name: 'Calender', url: "/SupCal", img: vector2 }, 
        { name: 'Proposals', url: "/Proposals", img: vector4},
        { name: 'Supervisors', url: "/AdminSup", img: vector4 },
        { name: 'Project Repository', url: "/PrevProjects", img: vector5 },
        { name: 'Fyp Guidelines', url: "/FypGuidline", img: vector5 },
    ];
    const navigate = useNavigate(); 
    const handleClick = (url, name) => {
        setActivePage(name);
        navigate(url);
    };
    return (
        <div className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
            <span className="sidebar__close" onClick={toggleSidebar}>
                <i class="fa-solid fa-circle-chevron-left"></i>
            </span>
            <nav className="sidebar__nav">
            {role === "Admin" && 
                <ul>
                    {adminItems.map((item, index) => (
                        <div key={index} className={`sidebar__item ${pathname === item.url ? 'active' : ''}`}
                            onClick={() => handleClick(item.url, item.name)}
                        >
                        <li><img src={item.img} alt="" srcSet="" className='sideBarIcon' />{item.name}</li>
                    </div>
                ))}
               </ul>}
                {role === "FypGroup" &&
                    <ul>
                        {studentItems.map((item, index) => (
                            <div key={index} className={`sidebar__item ${pathname === item.url ? 'active' : ''}`}
                                onClick={() => handleClick(item.url, item.name)}
                            >
                                <li><img src={item.img} alt="" srcSet="" className='sideBarIcon' />{item.name}</li>
                            </div>
                        ))}
                    </ul>}
                {role === "Supervisor" && 
                    <ul>
                        {supervisorItems.map((item, index) => (
                            <div key={index} className={`sidebar__item ${pathname === item.url ? 'active' : ''}`}
                                onClick={() => handleClick(item.url, item.name)}
                            >
                                <li><img src={item.img} alt="" srcSet="" className='sideBarIcon' />{item.name}</li>
                            </div>
                        ))}
                    </ul>}
                <div className="endBtn">
                    <ul onClick={() => { userLogout(); navigate('/') }}>
                        <Link to=''><li><img src={vector8} alt="" srcSet="" className='sideBarIcon' />Log Out</li></Link>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
