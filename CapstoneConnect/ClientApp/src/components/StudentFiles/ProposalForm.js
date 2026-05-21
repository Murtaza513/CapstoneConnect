import React, { useState } from 'react';
import axios from 'axios';
function ProposalForm() {
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
        file: ''
        // Add any other fields as necessary
    });

    //const handleSubmit = async (e) => {
    //    e.preventDefault();
    //    console.log('Submitting proposal...');
    //    try {
    //        const response = await axios.post('https://localhost:7266/account/Proposal', proposalData);
    //        console.log('Proposal submitted successfully:', response.data);
    //        setSubmissionStatus('approved');
    //    } catch (error) {
    //        console.error('Error submitting proposal:', error);
    //    }
    //};

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting proposal...');

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

    const handleImageChange = (e) => {
        setProposalData({ ...proposalData, file: e.target.files[0] });
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col">
                        <label>Project Title</label>
                        <input type="text" className="form-control" name="Title" value={proposalData.Title} onChange={handleChange} />
                    </div>
                    <div className="col">
                        <label>Supervisor</label>
                        <select className="form-control" name="Supervisor" value={proposalData.Supervisor} onChange={handleChange} >
                            <option value="">Select Supervisor</option>
                            <option>Ma'am Urooj</option>
                            <option>Ma'am Yusra</option>
                            <option>Ma'am Sohaan</option>
                            <option>Sir Conrad</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label>Team Lead</label>

                        <input type="text" className="form-control" name="TeamLead" placeholder="Team Lead" value={proposalData.TeamLead} onChange={handleChange} />
                    </div>
                    <div className="col">
                        <label>Team Lead Id</label>
                        <input type="text" className="form-control" name="TeamLead_Id" placeholder="Team Lead ID" value={proposalData.TeamLead_Id} onChange={handleChange} />
                    </div>
                    <div className="col">
                        <label>Member1 Name</label>
                        <input type="text" className="form-control" name="Member1" placeholder="Member1 Name" value={proposalData.Member1} onChange={handleChange} />
                    </div>
                    <div className="col">
                        <label>Member1 Id</label>
                        <input type="text" className="form-control" name="Member1_Id" placeholder="Member1 Id" value={proposalData.Member1_Id} onChange={handleChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label>Member2 Name</label>
                        <input type="text" className="form-control" name="Member2" placeholder="Member2 Name" value={proposalData.Member2} onChange={handleChange} />
                    </div>
                    <div className="col">
                        <label>Member2 Id</label>
                        <input type="text" className="form-control" name="Member2_Id" placeholder="Member2 Id" value={proposalData.Member2_Id} onChange={handleChange} />
                    </div>
                    <div className="col">
                        <label>Member3 Name</label>
                        <input type="text" className="form-control" name="Member3" placeholder="Member3 Name" value={proposalData.Member3} onChange={handleChange} />
                    </div>
                    <div className="col">
                        <label>Member3 Id</label>
                        <input type="text" className="form-control" name="Member3_Id" placeholder="Member3 Id" value={proposalData.Member3_Id} onChange={handleChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label>Project Description</label>
                        <textarea className="form-control" name="Project_Description" value={proposalData.Project_Description} onChange={handleChange}></textarea>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label>Tags</label>
                        <input type="text" className="form-control" name="Tags" placeholder="Tags" value={proposalData.Tags} onChange={handleChange} />
                    </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                <label htmlFor="fileInput" style={{ marginRight: '10px' }}>
                    Upload document:
                </label>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleImageChange}
                />
                </div>
                <div className="row">
                    <div className="col">
                        <button type="submit">Submit Proposal</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default ProposalForm