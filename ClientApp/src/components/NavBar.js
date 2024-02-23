import React from 'react'
import logo from './assets/logo.png'
import { Link } from 'react-router-dom'
import Notificaton from './assets/Group 39889.png'
import userIcon from './assets/user profile.png'

function NavBar() {
  return (
    <div className='header'>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#"><img src={logo} className='navbarlogo'/></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 topbar">
                            {/* <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li> */
                            <li className="nav-item">   
                                <img src={Notificaton} alt="notification-img" srcset="" className='not-img'/>
                            </li> }
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src={userIcon} alt="user-icon" srcset="" />
                                </a>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="/">Logout</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
    </div>
  )
}

export default NavBar
