import React, { useEffect, useState } from 'react'
//import MainSideBar from './MainSideBar'
import NavBar from '../Layout/NavBar'
import { Link } from 'react-router-dom'
import SupSideBar from './SupSideBar'
import MainSideBar from '../Layout/MainSideBar'
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from '../../axios'
import moment from 'moment';
import { ErrorToaster, SuccessToaster } from '../Utils/Toast'
import useAuth from '../../context/useAuth'
import Layout from '../Layout/Layout'
import Pagination from '../Utils/Pagination'
// import { useEffect } from "react";

const heaadings = [
    "Id","File Name","Project Title", "Submitted By","Date", "Status", "Plagiarism", "Feedback", "Download"
]

function SubmittedDocs() {
    const { role } = useAuth()
    const location = useLocation();
    const navigate = useNavigate()
    const fypId = location.state?.data;
    const [isAdding, setIsAdding] = useState(false);
    const [feedBack, setFeedBack] = useState('');
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [btnLoading, setBtnLoading] = useState({});
    const [submitId, setSubmitId] = useState("")
    const [giveStatus, setGiveStatus] = useState("")
    const [feedbackErr, setFeedbackErr] = useState(null)
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    const getProjects = async () => {
        try {
            setLoading(true)
            const response = await Axios.get(`usermanagement/fetchsubmission/${fypId}`)
            if (response.status === 200) {
                setProjects(response.data)
            }
        }
        catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const submitFeedback = async (e) => {
        e.preventDefault()
        if (!giveStatus || !feedBack) {
            setFeedbackErr("Select and fill feedback status")
            return
        } else {
            try {
                setBtnLoading(true)
                const response = await Axios.post('supervisor/addorupdatefeedback', {
                    SubmissionId: submitId,
                    Feedback: feedBack,
                    Status: giveStatus
                });

                if (response.status === 200) {
                    SuccessToaster("Feedback Uploaded")
                    setIsAdding(false);
                    setFeedBack("");
                    setGiveStatus("")
                }
            } catch (error) {
                console.error('An error occurred', error);
            }
            finally {
                getProjects()
                setBtnLoading(false)
            }
        }
    };

    const fetchFeedback = async (id) => {
        try {
            const response = await Axios.get(`usermanagement/fetchfeedback/${id}`);
            setFeedBack(response?.data?.value?.feedback);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    useEffect(() => {
        getProjects()
    }, [])

    const downloadFile = async (id) => {
        console.log("Downloading file...");
        try {
            setBtnLoading(prevState => ({ ...prevState, [id]: true }));
            const response = await Axios.post(`usermanagement/downloadfile/${id}`, {}, {
                responseType: 'arraybuffer'
            });
            console.log(response)
            if (response.status === 200) {
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const contentDisposition = response.headers['content-disposition'];
                let fileName = 'downloaded_file';

                if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
                    const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                    if (fileNameMatch != null && fileNameMatch[1]) {
                        fileName = fileNameMatch[1].replace(/['"]/g, '');
                    }
                }

                const contentType = response.headers['content-type'];
                let fileExtension = '';

                switch (contentType) {
                    case 'application/pdf':
                        fileExtension = '.pdf';
                        break;
                    case 'application/msword':
                        fileExtension = '.doc';
                        break;
                    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                        fileExtension = '.docx';
                        break;
                    case 'application/vnd.ms-powerpoint':
                        fileExtension = '.ppt';
                        break;
                    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                        fileExtension = '.pptx';
                        break;
                    default:
                        fileExtension = '';
                }

                if (!fileName.endsWith(fileExtension)) {
                    fileName += fileExtension;
                }

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                ErrorToaster("Download failed");
                console.error('File download failed:', response?.message);
            }
        } catch (error) {
            ErrorToaster(error?.message);
            console.error('An error occurred', error);
        } finally { setBtnLoading(prevState => ({ ...prevState, [id]: false })); }
    }

    const handleFeedbackDialog = (id) => {
        setIsAdding(true)
        setSubmitId(id)
        fetchFeedback(id)
    }

    const formatPlagiarism = (value) => (value * 100).toFixed(0);

    const filteredProjects = projects?.filter(project => {
        const values = Object?.values(project)?.map(value => String(value)?.toLowerCase());
        return values?.some(value => value?.includes(searchQuery?.toLowerCase()));
    });

    const indexOfLastProject = currentPage * itemsPerPage;
    const indexOfFirstProject = indexOfLastProject - itemsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Layout>
            <div className='mainmargins'>
                <div className="headingContainer">
                    <div className="row">
                        <h2>Submitted Documents</h2>
                    </div>
                    <div style={{ paddingTop: "20px" }}>
                        <div className="prevProjectMain">
                            <div style={{ width: "25%", paddingTop: "12px" }}>
                                <input type="text" className="form-control" placeholder="Search By Name..." value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <br />
                            </div>
                            {loading ? <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                <div className="spinner-border text-secondary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div></div> :
                                <div className="table-responsive">
                                <table className="minimalist-table">
                                <thead>
                                    <tr>
                                        {heaadings?.map((project, index) => {
                                            if (role === "Admin" && project === "Feedback") {
                                                return null;
                                            }
                                            return (

                                                <th key={index}>{project}</th>
                                            )
                                        }) }

                                    </tr>
                                </thead>
                                
                                <tbody>
                                    {projects.length > 0 ? (
                                        <>
                                            {currentProjects.map((project, index) => {
                                                if (project.submission_Type === "Abstract" && project.status !== "Accepted") {
                                                    return null; // Skip rendering this row
                                                }
                                                return (
                                                    <tr key={index}>
                                                        <td style={{ paddingTop: "18px" }}>{project.id}</td>
                                                        <td style={{ paddingTop: "18px" }}>{project.submission_Type}</td>
                                                        <td style={{ paddingTop: "18px" }}>{project.project_Title}</td>
                                                        <td style={{ paddingTop: "18px" }}>{project.submitted_By}</td>
                                                        <td style={{ paddingTop: "18px" }}>{moment(project.date).format('MM/DD/YYYY')}</td>
                                                        <td style={{ paddingTop: "18px" }}>{project.status}</td>
                                                        <td style={{ paddingTop: "18px" }} className={project.plagiarism > 0.60 ? 'text-danger' : ''}>
                                                            {formatPlagiarism(project.plagiarism)}%
                                                            {project.plagiarism > 0.60 && (
                                                                <i className="fas fa-exclamation-triangle" style={{ marginLeft: '8px' }}></i>
                                                            )}
                                                        </td>
                                                        {role === "Supervisor" &&
                                                        <td>
                                                            <button onClick={() => handleFeedbackDialog(project.id)}>Feedback</button>
                                                        </td>}
                                                        <td>
                                                            <button onClick={() => downloadFile(project.id)}
                                                                className={`addSupervisorButton ${btnLoading[project.id] ? 'disabled' : ''}`}
                                                                disabled={btnLoading[project.id]}
                                                            >
                                                                {btnLoading[project.id] ? 'Loading...' : 'Download'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </>
                                    ): (
                                        <tr >
                                            <div style={{padding:"10px"}}>No Record Found.</div>
                                        </tr>
                                    )}
                                    
                                    </tbody>
                            </table>
                            <div style={{width:"50%", display:"flex", justifyContent:"flex-end", paddingTop:"16px"}}>
                                    <Pagination 
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    />
                                    </div>
                                    <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", padding:"10px" }}>
                                        <button onClick={() => navigate(-1)}>Back</button>
                                    </div>
                                </div>
                                }
                        </div>
                    </div>
                </div>
            </div>
            <>
                {isAdding && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => { setIsAdding(false); setFeedBack(null) }}>&times;</span>
                            <h6>Add Feedback</h6>
                            <textarea
                                value={feedBack}
                                onChange={(e) => { setFeedBack(e.target.value); setFeedbackErr(null)}}
                                placeholder="Enter your feedback here"
                                rows="4"
                                cols="50"
                            />
                            <select className="form-control custom-select" value={giveStatus || ''} onChange={(e) => { setGiveStatus(e.target.value); setFeedbackErr(null) }}>
                                <option value="" disabled hidden>Select an Option</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Review">Review</option>
                            </select>
                            {feedbackErr && <div className="error-message" style={{ color: 'red', marginBottom: '8px', fontSize: "13px" }}>{feedbackErr}</div>}
                            <button
                                onClick={submitFeedback}
                                className={`addSupervisorButton ${btnLoading ? 'disabled' : ''}`}
                                disabled={btnLoading}
                            >
                                {btnLoading ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </div>
                    </div>
                )}
            </>
        </Layout>
    )
}

export default SubmittedDocs
