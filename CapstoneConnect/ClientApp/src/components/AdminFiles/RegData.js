import React, { useState } from 'react';
import AdminSideBar from './AdminSideBar';
import NavBar from '../Layout/NavBar'
import axios from 'axios'; // Import Axios for making HTTP requests
import { SuccessToaster } from '../Utils/Toaster';

export default function RegData() {

    const [submissionStatus, setSubmissionStatus] = useState('pending');
    const [proposalData, setProposalData] = useState({
        Title: '',
        Supervisor: '',
        TeamLead: '', // You may set this value based on the logged-in user
        TeamLead_Id: '',
        Member1: '',
        Member1_Id: '',
        Member2: '',
        Member2_Id: '',
        Member3: '',
        Member3_Id: '',
        Project_Description: '',
        Tags: '',
        // Add any other fields as necessary
    });


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://localhost:7266/account/Proposal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ proposalData })

            });
        }
        catch (error) {
            console.error('An error occurred', error);
        }
    };

    const handleChange = (e) => {
        setProposalData({
            ...proposalData,
            [e.target.name]: e.target.value
        });
    };
    const handleApprove = () => {
        // Handle approve logic
        SuccessToaster('Project Approved');

    };

    const handleReject = () => {
        // Handle reject logic
        alert('Project Rejected');
    };
    return (

        <div>
            <NavBar />
            <AdminSideBar />
            <div className='mainmargins'>
                <div className="container">
                    <div className="submitProposalMain Registrationdata">
                        <div className="row">
                            <h2>Submit proposal</h2>
                        </div>
                        {submissionStatus === 'pending' ? (
                            <div className="row">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col">
                                            <label>Project Title</label>
                                            <input
                                                type="text"
                                                value="Capstone Connect"
                                                disabled={true} 
                                            />
                                        </div>
                                        
                                        <div className="col">
                                            <label>Email</label>
                                            <input
                                                type="text"
                                                value="Loremipsum@gmail.com"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <label>Team Lead</label>
                                            <input
                                                type="text"
                                                value="TeamLead Name"
                                                disabled={true}
                                            />
                                        </div>

                                        <div className="col">
                                            <label>Team Lead Cgpa</label>
                                            <input
                                                type="text"
                                                value="3.6"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <label>Member 1</label>
                                            <input
                                                type="text"
                                                value="Member 1 Name"
                                                disabled={true}
                                            />
                                        </div>

                                        <div className="col">
                                            <label>Member 1 Cgpa</label>
                                            <input
                                                type="text"
                                                value="3.3"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <label>Member 2</label>
                                            <input
                                                type="text"
                                                value="Member 2 Name"
                                                disabled={true}
                                            />
                                        </div>

                                        <div className="col">
                                            <label>Member 2 Cgpa</label>
                                            <input
                                                type="text"
                                                value="3.1"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>

                                    

                                    <div className="row">
                                        <div className="col">
                                            <button className="appprovee" onClick={handleApprove}>Approve</button>
                                        </div>
                                        <div className="col">
                                            <button className="rejecttt" onClick={handleReject}>Reject</button>
                                        </div>
                                        <div className="col">
                                           
                                        </div>
                                        <div className="col">

                                        </div>
                                        <div className="col">
                                           
                                        </div>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="row subStatus">
                                <div className="col">
                                    <h3>Proposal Status: <span>Pending</span></h3>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}