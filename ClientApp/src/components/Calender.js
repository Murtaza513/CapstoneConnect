import React from 'react'
import NavBar from './NavBar'
import MainSideBar from './MainSideBar'


export default function Calender() {
    return (
        <div>
            <NavBar />
            <MainSideBar />
            <div className="calenderMain">
                <div className="conatiner">
                    <h2>FYP Calendar</h2>
                    <div className="innersection">
                        <div className="sec1">
                            <h3>FYP Proposal Evaluations</h3>
                            <ul>
                                <li><h5>Proposal Submission Starts:</h5>
                                    <p className='date'>Sep 11, 2023</p>
                                </li>
                                <li><h5>Proposal Submission Deadline:</h5>
                                    <p className='date'>Oct 21, 2023</p>
                                </li>
                                <li><h5>Proposal Evaluation Starts:</h5>
                                    <p className='date'>Oct 9, 2023</p>
                                </li>
                                <li><h5>Proposal Evaluation Deadline:</h5>
                                    <p className='date'>Oct 20, 2023</p>
                                </li>
                            </ul>
                        </div>
                        <div className="sec1">
                            <h3>8th Semester</h3>
                            <ul>
                                <li><h5>SRDS / Demo Submission Starts:</h5>
                                    <p className='date'>Sep 11, 2023</p>
                                </li>
                                <li><h5>SRDS / Demo Submission Deadline:</h5>
                                    <p className='date'>Sep 11, 2023</p>
                                </li>
                                <li><h5>Internal Evaluation 7th Starts:</h5>
                                    <p className='date'>Sep 11, 2023</p>
                                </li>
                                <li><h5>Internal Evaluation 7th Deadline:</h5>
                                    <p className='date'>Sep 11, 2023</p>
                                </li>
                            </ul>
                        </div>
                        <div className="sec1">
                            <h3>FYP Proposal Evaluations</h3>
                            <ul>
                                <li><h5>Proposal Submission Starts:</h5>
                                    <p className='date'>Sep 11, 2023</p>
                                </li>
                                <li><h5>Proposal Submission Starts:</h5>
                                    <p className='date'>Sep 11, 2023</p>
                                </li>
                                <li><h5>Proposal Submission Starts:</h5>
                                    <p className='date'>Sep 11, 2023</p>
                                </li>
                                <li><h5>Proposal Submission Starts:</h5>
                                    <p className='date'>Sep 11, 2023</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
