import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import vector1 from "../assets/Vector (1).png";
import vector2 from "../assets/Vector (2).png";
import vector3 from "../assets/Vector (3).png";
import vector4 from "../assets/profile-2user.png";
import vector5 from "../assets/Vector (4).png";
/*import vector6 from "./assets/Group.png";*/
import vector7 from "../assets/icons8-idea-24.png";
import vector8 from "../assets/Group 27.png";
import useAuth from '../../context/useAuth';


export default function AdminSideBar() {
    const navigate = useNavigate();
    const [redirect, setRedirect] = useState(false);
    const { userLogout} = useAuth();

    const handleLogin = (e) => {
        console.log("test1");
        e.preventDefault();
        setRedirect(true);

    };

    if (redirect) {
        
        navigate("/supervisors");
    }
    return (
        <div>
            <div className="sidebar-main">
                <div className="sidebar-items">
                    <ul>
                        <Link to='/AdminCalender'><li><img src={vector1} alt="" srcSet="" className='sideBarIcon' />Dashboard</li></Link>
                        <Link to='/AdminCalender'><li><img src={vector2} alt="" srcSet="" className='sideBarIcon' />Calender</li></Link>
                        <Link to='/AdminSup'><li><img src={vector4} alt="" srcSet="" className='sideBarIcon' />Supervisors</li></Link>
                        <Link to='/AdminQueries'><li><img src={vector5} alt="" srcSet="" className='sideBarIcon' />Queries</li></Link>
                        <Link to='/AdminRegistration'><li><img src={vector5} alt="" srcSet="" className='sideBarIcon' />Registrations</li></Link>
                        {/*<li onClick={handleLogin}><img src={vector4} alt="" srcSet="" className='sideBarIcon' />Supervisors</li>*/}
                        <Link to='/AdminDocs'><li><img src={vector5} alt="" srcSet="" className='sideBarIcon' />Admin Docs</li></Link>
                        {/*<li><Link to='/'><img src={vector7} alt="" srcSet="" className='sideBarIcon' />FYP Ideas</Link></li>*/}
                        {/*<Link to='/SubmitProposal'><li><img src={vector3} alt="" srcSet="" className='sideBarIcon' />Submission</li></Link>*/}
                        {/*<li><Link to='/'><img src={vector6} alt="" srcSet="" className='sideBarIcon' />Lorem Ipsum</Link></li>*/}
                    </ul>
                </div>
                <div className="endBtn">
                    <ul onClick={() => { userLogout(); navigate('/') }}>
                        <Link to=''><li><img src={vector8} alt="" srcSet="" className='sideBarIcon' />Log Out</li></Link>
                    </ul>
                </div>
            </div>
        </div>
    )
}
