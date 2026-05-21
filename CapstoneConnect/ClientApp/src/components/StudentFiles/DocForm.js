import React, { useEffect, useState } from 'react';
import { ErrorToaster, SuccessToaster } from '../Utils/Toast';
import useAuth from '../../context/useAuth';
import Axios from '../../axios';

const DocForm = ({ setFormValue, setIsAuth, fetchProposals, docOptions, studentId, supervisors, docType, abstractStatus, setDocLoading }) => {
    
    const { userId } = useAuth()
    const [proposalData, setProposalData] = useState({
        SupervisorID: '',
        CoSupervisorID: '',
        files: ''
    });

    const [formFill, setFormFill] = useState(false)
    const isFormValid = !abstractStatus ? proposalData.SupervisorID && proposalData.CoSupervisorID && proposalData.files : proposalData.files;
    //Handle Proposal Submission Data
    const handleChange = (e) => {
        setProposalData({
            ...proposalData,
            [e.target.name]: e.target.value
        });
    };

    //Handle File Upload
    const handleFileUpload = (e) => {
        setProposalData({ ...proposalData, files: e.target.files[0] });
    };

    // Handle Proposal Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            setFormFill(true)
            return
        }
        else {
            setDocLoading(true)
            const formData = new FormData();
            formData.append('FypGroupId', userId);
            formData.append('type', docType);
            formData.append('files', proposalData.files);
            formData.append('SupervisorID', proposalData.SupervisorID);
            formData.append('CoSupervisorID', proposalData.CoSupervisorID);
            formData.append('StudentId', studentId);

            try {
                const response = await Axios.post('studentmanagement/uploaddocument',formData);

                if (response.status === 200) {
                    SuccessToaster("Docs uploaded")
                    setIsAuth(false)
                    setProposalData("");
                    docOptions()
                }
            }
            catch (error) {
                ErrorToaster(error?.response?.data?.message)
            }
            finally {
                setFormValue("");
                fetchProposals()
                setFormFill(false)
                setDocLoading(false)
            }

        }
            };

    // Filter supervisors for Supervisor select field
    const availableSupervisor = supervisors?.filter(
        supervisor => supervisor.id !== proposalData.CoSupervisorID
    );

    // Filter supervisors for CoSupervisor select field
    const availableCoSupervisor = supervisors?.filter(
        supervisor => supervisor.id !== proposalData.SupervisorID
    );

    useEffect(() => {
            if (isFormValid) {
                setFormFill(false)
            }
    }, [proposalData])

    return (
        <div className="form-container">
            <div>
                <button type="button" className="cancel-button" onClick={() => {
                    setFormValue(""); setProposalData({
                        SupervisorID: '',
                        CoSupervisorID: '',
                        files: ''
                    }); setIsAuth(false)
                }}>
                    <span>X</span> {/* Close icon */}
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-inner">
                    <div className="upload-group">
                        <label htmlFor="fileInput">
                            Upload Document:
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileUpload}
                        />
                    </div>
                    {!abstractStatus &&
                        <>
                            <div className="form-group">
                                <select className="form-control" name="SupervisorID" value={proposalData.SupervisorID} onChange={handleChange} >
                                    <option value="">Select Supervisor</option>
                                    {availableSupervisor.map(supervisor => (
                                        <option key={supervisor.id} value={supervisor.id}>{supervisor.username}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <select className="form-control" name="CoSupervisorID" value={proposalData.CoSupervisorID} onChange={handleChange} >
                                    <option value="">Select CoSupervisor</option>
                                    {availableCoSupervisor.map(supervisor => (
                                        <option key={supervisor.id} value={supervisor.id}>{supervisor.username}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    }
                    <div className="form-group">
                        <button type="submit" disabled={formFill}>Submit</button>
                    </div>
                </div>
                {formFill && (
                    <div className="error-message">
                        Make sure to upload doc & select all fields.
                    </div>
                )}
            </form>
        </div>
    )
}

export default DocForm;
