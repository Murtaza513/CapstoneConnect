import React from 'react'
import NavBar from '../Layout/NavBar'
import calIcon from '../assets/uis_calender.png'
import clockIcon from '../assets/mdi_clock-time-four-outline.png'
import sup1 from '../assets/Ellipse 12.png'
import sup2 from '../assets/Ellipse 12 (1).png'
import sup3 from '../assets/Ellipse 12 (2).png'
import sup4 from '../assets/Ellipse 12 (3).png'
import sup5 from '../assets/Ellipse 12 (4).png'
import sup6 from '../assets/Ellipse 12 (5).png'
import MainSideBar from '../Layout/MainSideBar'

function Supervisors() {
    return (
        <div>
            <NavBar />
            <MainSideBar />
            <div className='mainmargins'>
                <div className="supervisorMain">
                    <div className="container">
                        <div className="row">
                            <h2>supervisors</h2>
                        </div>
                        <div className="super2">
                            <p className="total_s">Total Supervisors : 245</p>
                            <p className="availble_s">Available : 225</p>
                            <p className="occupied_s">Occupied : 25</p>
                        </div>
                        <div className="row super3">
                            <div className="col-3">
                                <div className="supervisor_card">
                                    <div className="imgSec">
                                        <img src={sup1} alt="" />
                                        <h4 className="superviorTitle">
                                            Supervisor 1
                                        </h4>
                                    </div>
                                    <p className='supervisorDescrp'>Lorem ipsum dolor sit amet, consect adipisicing elit, sed do eiusmod.</p>
                                    <p className='superviorSubj'>Subject : Network Engineering</p>
                                    <div className="supervisorSchdule">
                                        <div className="date">
                                            <img src={calIcon} alt="" />
                                            <p>3-01-2023</p>
                                        </div>
                                        <div className="time">
                                            <img src={clockIcon} alt="" />
                                            <p>12:30 AM - 01:40 PM</p>
                                        </div>
                                    </div>
                                    <button>View Details</button>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="supervisor_card">
                                    <div className="imgSec">
                                        <img src={sup2} alt="" />
                                        <h4 className="superviorTitle">
                                            Supervisor 2
                                        </h4>
                                    </div>
                                    <p className='supervisorDescrp'>Lorem ipsum dolor sit amet, consect adipisicing elit, sed do eiusmod.</p>
                                    <p className='superviorSubj'>Subject : Network Engineering</p>
                                    <div className="supervisorSchdule">
                                        <div className="date">
                                            <img src={calIcon} alt="" />
                                            <p>3-01-2023</p>
                                        </div>
                                        <div className="time">
                                            <img src={clockIcon} alt="" />
                                            <p>12:30 AM - 01:40 PM</p>
                                        </div>
                                    </div>
                                    <button>View Details</button>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="supervisor_card">
                                    <div className="imgSec">
                                        <img src={sup3} alt="" />
                                        <h4 className="superviorTitle">
                                            Supervisor 3
                                        </h4>
                                    </div>
                                    <p className='supervisorDescrp'>Lorem ipsum dolor sit amet, consect adipisicing elit, sed do eiusmod.</p>
                                    <p className='superviorSubj'>Subject : Network Engineering</p>
                                    <div className="supervisorSchdule">
                                        <div className="date">
                                            <img src={calIcon} alt="" />
                                            <p>3-01-2023</p>
                                        </div>
                                        <div className="time">
                                            <img src={clockIcon} alt="" />
                                            <p>12:30 AM - 01:40 PM</p>
                                        </div>
                                    </div>
                                    <button>View Details</button>
                                </div>
                            </div>


                        </div>
                        <div className="row super3">
                            <div className="col-3">
                                <div className="supervisor_card">
                                    <div className="imgSec">
                                        <img src={sup4} alt="" />
                                        <h4 className="superviorTitle">
                                            Supervisor 4
                                        </h4>
                                    </div>
                                    <p className='supervisorDescrp'>Lorem ipsum dolor sit amet, consect adipisicing elit, sed do eiusmod.</p>
                                    <p className='superviorSubj'>Subject : Network Engineering</p>
                                    <div className="supervisorSchdule">
                                        <div className="date">
                                            <img src={calIcon} alt="" />
                                            <p>3-01-2023</p>
                                        </div>
                                        <div className="time">
                                            <img src={clockIcon} alt="" />
                                            <p>12:30 AM - 01:40 PM</p>
                                        </div>
                                    </div>
                                    <button>View Details</button>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="supervisor_card">
                                    <div className="imgSec">
                                        <img src={sup5} alt="" />
                                        <h4 className="superviorTitle">
                                            Supervisor 5
                                        </h4>
                                    </div>
                                    <p className='supervisorDescrp'>Lorem ipsum dolor sit amet, consect adipisicing elit, sed do eiusmod.</p>
                                    <p className='superviorSubj'>Subject : Network Engineering</p>
                                    <div className="supervisorSchdule">
                                        <div className="date">
                                            <img src={calIcon} alt="" />
                                            <p>3-01-2023</p>
                                        </div>
                                        <div className="time">
                                            <img src={clockIcon} alt="" />
                                            <p>12:30 AM - 01:40 PM</p>
                                        </div>
                                    </div>
                                    <button>View Details</button>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="supervisor_card">
                                    <div className="imgSec">
                                        <img src={sup6} alt="" />
                                        <h4 className="superviorTitle">
                                            Supervisor 6
                                        </h4>
                                    </div>
                                    <p className='supervisorDescrp'>Lorem ipsum dolor sit amet, consect adipisicing elit, sed do eiusmod.</p>
                                    <p className='superviorSubj'>Subject : Network Engineering</p>
                                    <div className="supervisorSchdule">
                                        <div className="date">
                                            <img src={calIcon} alt="" />
                                            <p>3-01-2023</p>
                                        </div>
                                        <div className="time">
                                            <img src={clockIcon} alt="" />
                                            <p>12:30 AM - 01:40 PM</p>
                                        </div>
                                    </div>
                                    <button>View Details</button>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Supervisors