import React from 'react'
import { Link } from 'react-router-dom'
import vector1 from "./assets/Vector (1).png";
import vector2 from "./assets/Vector (2).png";
import vector3 from "./assets/Vector (3).png";
import vector4 from "./assets/profile-2user.png";
import vector5 from "./assets/Vector (4).png";
import vector6 from "./assets/Group.png";
import vector7 from "./assets/icons8-idea-24.png";
import vector8 from "./assets/Group 27.png";

export default function MainSideBar() {
  return (
    <div>
      <div className="sidebar-main">
        <div className="sidebar-items">
            <ul>
                <li><Link to='/'><img src={vector1} alt="" srcset="" className='sideBarIcon' />Dashboard</Link></li>
                <li><Link to='/'><img src={vector2} alt="" srcset="" className='sideBarIcon' />Calender</Link></li>
                <li><Link to='/'><img src={vector4} alt="" srcset="" className='sideBarIcon' />Supervisors</Link></li>
                <li><Link to='/'><img src={vector5} alt="" srcset="" className='sideBarIcon' />Project Repository</Link></li>
                <li><Link to='/'><img src={vector7} alt="" srcset="" className='sideBarIcon' />FYP Ideas</Link></li>
                <li><Link to='/'><img src={vector3} alt="" srcset="" className='sideBarIcon' />Submission</Link></li>
                <li><Link to='/'><img src={vector6} alt="" srcset="" className='sideBarIcon' />Lorem Ipsum</Link></li>
            </ul>
        </div>
        <div className="endBtn">
            <ul>
            <li><Link to='/'><img src={vector8} alt="" srcset="" className='sideBarIcon' />Log Out</Link></li>
            </ul>
        </div>
      </div>
    </div>
  )
}
