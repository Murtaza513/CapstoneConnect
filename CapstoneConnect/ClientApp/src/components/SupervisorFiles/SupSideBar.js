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


export default function SupSideBar() {
    const navigate = useNavigate();
    const [redirect, setRedirect] = useState(false);

    const handleLogin = (e) => {
        console.log("test1");
        e.preventDefault();
        setRedirect(true);

    };

    if (redirect) {
        console.log("tet");
        navigate("/supervisors");
    }
    return (
        <div>
            <div className="sidebar-main">
                <div className="sidebar-items">
                    <ul>
                        <Link to='/SupervisorDashboard'><li><img src={vector1} alt="" srcSet="" className='sideBarIcon' />Dashboard</li></Link>
                        <Link to='/SupCal'><li><img src={vector2} alt="" srcSet="" className='sideBarIcon' />Calender</li></Link>
                        <Link to='/Proposals'><li><img src={vector4} alt="" srcSet="" className='sideBarIcon' />Proposals</li></Link>
                        {/*<li onClick={handleLogin}><img src={vector4} alt="" srcSet="" className='sideBarIcon' />Supervisors</li>*/}
                        <Link to='/SupPrevProj'><li><img src={vector5} alt="" srcSet="" className='sideBarIcon' />Project Repository</li></Link>
                        {/*<li><Link to='/'><img src={vector7} alt="" srcSet="" className='sideBarIcon' />FYP Ideas</Link></li>*/}
                        {/*<Link to='/SubmitProposal'><li><img src={vector3} alt="" srcSet="" className='sideBarIcon' />Submission</li></Link>*/}
                        {/*<li><Link to='/'><img src={vector6} alt="" srcSet="" className='sideBarIcon' />Lorem Ipsum</Link></li>*/}
                    </ul>
                </div>
                <div className="endBtn">
                    <ul>
                        <Link to='/'><li><img src={vector8} alt="" srcSet="" className='sideBarIcon' />Log Out</li></Link>
                    </ul>
                </div>
            </div>
        </div>
    )
}
