import React, { useState } from 'react';
import MainSideBar from '../Layout/MainSideBar';
import NavBar from '../Layout/NavBar';
import axios from 'axios'; // Import Axios for making HTTP requests
import ProposalForm from './ProposalForm';

export default function SubmitProposal() {

    const getInitialState = () => {
        const value = "proposal";
        return value;
    };

    const [formValue, setFormValue] = useState(getInitialState);

    const handleSelectChange = (e) => {
        setFormValue(e.target.value);
    };

    return (
        <div>
            <NavBar />
            <MainSideBar />
            <div className='mainmargins'>
                <div className="container">
                    <div className="submitProposalMain">
                        <div style={{ display: 'flex', justifyContent: "space-between", }}>
                            {formValue === 'proposal' ? <div><h2>Submit proposal</h2></div> :
                                formValue === 'acceptance' ? <div><h2>Submit acceptance form</h2></div> :
                                    formValue === 'progress' ? <div><h2>Submit progress report</h2></div> : 
                                        formValue === 'documentation' ? <div><h2>Submit documentation</h2></div>:null } 
                            <div>
                                <select className="form-control" value={formValue} onChange={handleSelectChange}>
                                    <option value="proposal">Submit Propsal</option>
                                    <option value="acceptance">Acceptance Form</option>
                                    <option value="progress">Progress Report</option>
                                    <option value="documentation">Documentation</option>
                                </select>
                                {/*<p>{`You selected ${formValue}`}</p>*/}
                            </div>
                        </div>
                        {formValue === 'proposal' ? (
                            <div className="row">
                                <ProposalForm/>
                            </div>
                        ) :
                            formValue === 'acceptance' ? (
                                <div>Acceptance Form</div>
                            ) : formValue === 'progress' ? (
                                    <div>Progress Report</div>
                                ) : formValue === 'documentation' ? (
                                        <div>documentation</div>
                            ):null
/*                            (
                            <div className="row subStatus">
                                <div className="col">
                                    <h3>Proposal Status: <span>Pending</span></h3>
                                </div>
                            </div>
                                )*/
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}