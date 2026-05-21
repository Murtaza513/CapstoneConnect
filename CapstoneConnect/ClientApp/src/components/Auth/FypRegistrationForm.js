
import React, { useState, useEffect, Fragment } from 'react';
import './RegisterationStyle.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { ErrorToaster, SuccessToaster } from '../Utils/Toast';
import Axios from '../../axios';

const FypRegistrationForm = () => {
    const [step, setStep] = useState(1);
    const [noOfMembers, setNoOfMembers] = useState(2);
    const [projectTitle, setProjectTitle] = useState('');
    const [teamLeadId, setTeamLeadId] = useState('');
    const [teamLeadEmail, setTeamLeadEmail] = useState('');
    const [teamLeadEmailConfirmed, setTeamLeadEmailConfirmed] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [memberIds, setMemberIds] = useState([]);
    const [memberOtps, setMemberOtps] = useState([]);
    const [projectId, setProjectId] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);

    /*Error validation handling*/
    const [noOfMembersError, setNoOfMembersError] = useState(null);
    const [projectTitleError, setProjectTitleError] = useState(null);
    const [teamLeadIdError, setTeamLeadIdError] = useState(null);

    // Timeline Steps
    const renderTimeline = () => (
        <div className="timeline">
            <div className={`timeline-step ${step === 1 ? 'active' : ''}`}>Step 1</div>
            <div className={`timeline-step ${step === 2 ? 'active' : ''}`}>Step 2</div>
        </div>
    );

    // Step 1 Handlers
    const handleGroupNumberChange = (e) => setNoOfMembers(e.target.value);
    const handleProjectTitleChange = (e) => setProjectTitle(e.target.value);
    const handleTeamLeadIdChange = (e) => setTeamLeadId(e.target.value);

    const handleNextStep1 = async () => {

        let hasError = false;

        if (!noOfMembers) {
            setNoOfMembersError('Please select the number of group members');
            hasError = true;
        }

        if (!projectTitle) {
            setProjectTitleError('Please enter the project title');
            hasError = true;
        }

        if (!teamLeadId) {
            setTeamLeadIdError('Please enter the team lead ID');
            hasError = true;
        }

        if (hasError) {
            return;
        }
        try {
            setBtnLoading(true)
            const response = await Axios.post('account/verifyteamlead', {
                projectTitle: projectTitle,
                Num_Members: noOfMembers,
                TeamleadId: teamLeadId.trim()
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }, withCredentials: true
            });
            
            if (response.status === 200) {
                const data = response.data;
                setTeamLeadEmail(data.email);
                setOtpSent(true);
            }
        } catch (error) {
            ErrorToaster(error?.response?.data?.message)
            console.error('Error:', error);
        } finally {
            setBtnLoading(false)
        }
    };

    const handleTeamLeadEmailConfirm = async () => {
        try {
            setBtnLoading(true)
            const response = await Axios.post(
                'account/verify',
                { id: teamLeadId, key: otp },
                { withCredentials: true }
            );
            
            if (response.status === 200) {
                setTeamLeadEmailConfirmed(true);
                setStep(2);
                SuccessToaster(response.data.message)
                setOtpSent(false);
            }
        } catch (error) {
            ErrorToaster(error?.response?.data?.message)
            console.error('Error:', error);
        } finally { setBtnLoading(false) }
    };

    // Step 2 Handlers
    const handleMemberIdChange = (index, e) => {
        const newMemberIds = [...memberIds];
        newMemberIds[index] = e.target.value;
        setMemberIds(newMemberIds);
    };

    const handleOtpAgain = async () => {
        let allRequestsSuccessful = true;
        try {
            setBtnLoading(true)
            for (let i = 0; i < memberIds.length; i++) {
                const memberId = memberIds[i];
                const response = await Axios.post(
                    'account/verify',
                    { Id: memberId, key: memberOtps[i] },
                    { withCredentials: true },
                );
                
                if (response.status !== 200) {
                    allRequestsSuccessful = false;
                    setOtpSent(true);
                    ErrorToaster(`Error verifying member ${memberId}`)
                }
            }
            if (allRequestsSuccessful) {
                try {
                    const response = await Axios.post(
                        '/account/RegisterFYP',
                        {
                            teamLeadId: teamLeadId,
                            students: memberIds,
                            fypTitle: projectTitle
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            withCredentials: true
                        }
                    );
                    if (response.status === 200) {
                        const data = response.data;
                        setProjectId(data.projectId);
                        
                        setStep(3);
                        SuccessToaster("FYP Registration completed successfully.");
                    }
                } catch (error) {
                    console.error('Error during FYP registration:', error);
                    ErrorToaster(error?.response?.data?.message)
                }
            }
        } catch (error) {
            setOtpSent(true);
            ErrorToaster(error?.response?.data?.message)
            console.error('Error:', error);
        } finally { setBtnLoading(false) }
    }

    const handleNextStep2 = async () => {
        try {
            setBtnLoading(true)
            for (let i = 0; i < memberIds.length; i++) {
                const memberId = memberIds[i];
                const response = await Axios.post(
                    `account/verifyteammember/${memberId}`, {},
                    { withCredentials: true }
                );
                
                if (response.status === 200) {
                    setOtpSent(true);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            ErrorToaster(error?.response?.data?.message)
        } finally { setBtnLoading(false) }
    };

    const handleMemberOtpChange = (index, e) => {
        const newOtps = [...memberOtps];
        newOtps[index] = e.target.value;
        setMemberOtps(newOtps);
    };

    const renderMemberInputs = () => (
        Array.from({ length: parseInt(noOfMembers) - 1 }).map((_, i) => (
            <div key={i}>
                <label>Enter member {i + 1} ID:</label>
                <input
                    type="text"
                    value={memberIds[i] || ''}
                    onChange={(e) => handleMemberIdChange(i, e)}
                />
            </div>
        ))
    );

    const renderMemberOtp = () => (
        Array.from({ length: parseInt(noOfMembers) - 1 }).map((_, i) => (
            <div key={i}>
                <label>Enter OTP for member {i + 1}:</label>
                <input
                    type="text"
                    value={memberOtps[i] || ''}
                    onChange={(e) => handleMemberOtpChange(i, e)}
                />
            </div>
        ))
    );


    return (
        <div className="registration-form">
            {step!== 3 && <Fragment>
                {renderTimeline()}
            </Fragment>}
            {step === 1 && (
                <div>
                    <div className="form-group">
                        <label>Select number of group members:</label>
                        <select
                            className="form-control custom-select"
                            value={noOfMembers}
                            onChange={(e) => { setNoOfMembers(e.target.value); setNoOfMembersError(null); }}
                        >
                            <option value="">Select</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                        {noOfMembersError && <div className="error-message">{noOfMembersError}</div>}
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Enter project title:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={projectTitle}
                            onChange={(e) => { setProjectTitle(e.target.value); setProjectTitleError(null); }}
                        />
                        {projectTitleError && <div className="error-message">{projectTitleError}</div>}
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Enter team lead ID:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={teamLeadId}
                            onChange={(e) => { setTeamLeadId(e.target.value); setTeamLeadIdError(null); }}
                        />
                        {teamLeadIdError && <div className="error-message">{teamLeadIdError}</div>}
                    </div>
                    <br />
                    <button onClick={handleNextStep1}
                        className={`btn btn-primary ${btnLoading ? 'disabled' : ''}`}
                        disabled={btnLoading}
                    >
                        {btnLoading ? 'Loading...' : 'Next'}
                    </button>
                    <div className='loginform'>
                        <Link to='/' className='signUpBtn'><li>Back to login</li></Link>
                    </div>
                    {otpSent && (
                        <div>
                            <label>Enter OTP:</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            {/*<button onClick={handleTeamLeadEmailConfirm}>Submit OTP</button>*/}
                            <button onClick={handleTeamLeadEmailConfirm}
                                className={`btn btn-primary ${btnLoading ? 'disabled' : ''}`}
                                disabled={btnLoading}
                            >
                                {btnLoading ? 'OTP Submitting...' : 'Submit OTP'}
                            </button>
                        </div>
                    )}
                </div>
            )}
            {step === 2 && (
                <div>
                    {renderMemberInputs()}
                    {!otpSent && <button onClick={handleNextStep2}>Next</button>}
                    <button onClick={() => setStep(1)}>Back</button>
                    {otpSent && (
                        <Fragment>
                            {renderMemberOtp()}
                            {/*<button onClick={handleOtpAgain}>Submit OTPs</button>*/}
                            <button onClick={handleOtpAgain}
                                className={`btn btn-primary ${btnLoading ? 'disabled' : ''}`}
                                disabled={btnLoading}
                            >
                                {btnLoading ? 'OTPs Submitting...' : 'Submit OTPs'}
                            </button>
                        </Fragment>
                    )}
                </div>
            )}
            {step === 3 && (
                <Fragment>
                    <div>
                        <p>Your FYP Ids and your application is sent to admin. When it's approved, a confirmation email will be sent to the team lead.</p>
                    </div>
                    <div className='loginform'>
                        <Link to='/' className='signUpBtn'><li>Back to login</li></Link>
                    </div>

                </Fragment>
            )}
        </div>
    );
};
export default FypRegistrationForm;