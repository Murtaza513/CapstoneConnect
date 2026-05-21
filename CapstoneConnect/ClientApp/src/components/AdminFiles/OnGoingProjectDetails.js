import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Axios from '../../axios';
import EvaluationDialog from '../SupervisorFiles/EvaluationDialog';
import Layout from '../Layout/Layout';
import moment from "moment";
import { ErrorToaster } from '../Utils/Toast';

const OnGoingProjectDetails = ({ projects }) => {
    const [jury, setJury] = useState([])
    const { projectId } = useParams();
    const navigate = useNavigate()
    const location = useLocation();
    const { project } = location.state;
    const [projectData, setProjectData] = useState();
    const [isAdding, setIsAdding] = useState(false);
    const [isRemarks, setIsRemarks] = useState(false);
    const [selectedRemark, setSelectedRemark] = useState('');
    const [selectedJury, setSelectedJury] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState("")
    const [descData, setDescData] = useState({
        Title: '',
        Remarks: '',
        dated: '',
        Tag:[]
    });

    const [loading, setLoading] = useState(false)

    const [evaluationRemarks, setEvaluationRemarks] = useState("")

    const handleClose = () => {
        setIsAdding(false)
    }

    const handleDescChange = (e) => {
        setDescData({
            ...descData,
            [e.target.name]: e.target.value
        });
    };

    const fetchSupervisors = async () => {
        try {
            const response = await Axios.get('UserManagement/GetAllSupervisors');
            setJury(response.data);
        } catch (error) {
            console.error('Error fetching supervisors:', error);
        }
    };

    const fetchProjectDetails = async () => {
        setLoading(true)
        try {
            const response = await Axios.get(`admin/ongoingprojectsbyid/${projectId}`);
            setProjectData(response.data)
        } catch (error) {
            console.error('Error fetching supervisors:', error);
        }
        finally {
            setLoading(false)
        }
    };
    
    const getProposalRemarks = async () => {
        try {
            const response = await Axios.get(`UserManagement/fetchproposaldefence/${projectId}`);
            if (response.status === 200 || response.status === 204) {
                setEvaluationRemarks(response.data)
                setIsRemarks(true)
            }

        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const getMidRemarks = async () => {
        try {
            const response = await Axios.get(`UserManagement/midevaluation/${projectId}`);
            if (response.status === 200) {
                setEvaluationRemarks(response.data)
                setIsRemarks(true)
            }
            if (response.status === 204) {
                ErrorToaster("No Content To Display")
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    useEffect(() => {
        fetchSupervisors();
        fetchProjectDetails();
        /*fetchEvaluation();*/
    }, []);
    
    return (
        <Layout>
            {/*<NavBar />
            <MainSideBar />*/}
            <div className='mainmargins'>
                <div className="project-page">
                    <h2>OnGoing Project Details</h2>
                    {loading ? <div style={{ display: "flex", justifyContent: "center", width: "100%", paddingTop: "18px" }}>
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div></div> :
                    <div className="project-info">
                        <div className="view-submit" style={{ display: "flex", justifyContent: "space-between", alignItems:"center" }}>
                            <h2>{projectData?.title}</h2>
                            <button onClick={() => navigate('/SubmitDocs', { state: { data: projectId } })}>View Submissions</button>
                        </div>
                        <p><strong>Project ID: </strong> {project.id}</p>
                        <p><strong>Status:</strong> {project.status}</p>
                        <p><strong>Supervisor:</strong> {projectData?.supervisor}</p>
                            <p><strong>Co-Supervisor:</strong> {projectData?.coSupervisor}</p>
                            <p><strong>Number of Members:</strong> {projectData?.members && Object.values(projectData?.members).length}</p>
                            <p><strong>TeamLead:</strong> {projectData?.teamlead}</p>
                            <p><strong>Team Members:</strong> {projectData?.members &&
                                Object.values(projectData?.members).map((member, index, arr) => (
                                    member !== projectData?.teamlead && (
                                        <span key={index}>
                                            {member}{index < arr.length - 1 ? ', ' : ''}
                                        </span>)
                                    ))
                                }
                            </p>
                            <p><strong>Description:</strong> {projectData?.description ?? "--"}</p>
                    </div>
                    }
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{display:'flex'}}>
                        {project.status !== "Fyp2" && (
                            <button style={{backgroundColor:"#6ac3f7"}} onClick={() => setIsAdding(true)}>
                                {project.status === "Abstract" ? "Proposal Defence"
                                    : project.status === "Fyp1" ? "Mid Evaluation" :
                                        project.status === "Complete" ? "Final Evaluation" :
                                            project.status === "ReEvaluation" ? "ReEvaluation" : null}
                                </button>
                            )}
                        {project.status === "Fyp1" && (
                            <button onClick={getProposalRemarks }>Proposal Remarks</button>
                        )}
                        {( project.status === "Fyp2" || project.status === "Complete" )&& (
                            <div>
                                <button onClick={getProposalRemarks }>Proposal Remarks</button>
                                <button onClick={getMidRemarks}>Mid Remarks</button>
                            </div>
                        )}
                        </div>
                        <div>
                            <button onClick={() => navigate(-1)}>Back</button>
                        </div>
                    </div>
                </div>
            </div>
            {isAdding && (
                <EvaluationDialog status={project.status} handleClose={handleClose} descData={descData} handleDescChange={handleDescChange}
                    fetchSupervisors={fetchSupervisors} jury={jury} selectedJury={selectedJury} setSelectedJury={setSelectedJury} selectedRemark={selectedRemark}
                    selectedGrade={selectedGrade} setSelectedRemark={setSelectedRemark} setSelectedGrade={setSelectedGrade} setDescData={setDescData}
                    projectId={projectId} members={projectData?.members} />
            )}
            {isRemarks && (
                <div className="modal" style={{
                    display: 'block', position: 'fixed', zIndex: '1', left: '0', top: '0', width: '100%', height: '100%',
                    overflow: 'auto', backgroundColor: 'rgba(0,0,0,0.4)'
                }}>
                    <div className="modal-content" style={{ margin: '15% auto', padding: '0', border: '1px solid #888', width: '80%', position: 'relative' }}>
                        <div style={{
                            borderTopLeftRadius: "4px", borderTopRightRadius: "4px", backgroundColor: '#4682a9',
                            padding: '10px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            width: '100%', boxSizing: 'border-box'
                        }}>
                            <span className="close" style={{
                                color: '#aaa', float: 'right', fontSize: '28px', fontWeight: 'bold', cursor: 'pointer',
                                margin: '10px'
                            }} onClick={() => setIsRemarks(false)}>
                                &times;
                            </span>
                            <div >
                                <h4 style={{ margin: 0 }}>Evaluation Remarks</h4>
                            </div>
                            <div></div>
                        </div>
                        {evaluationRemarks ?
                            <div className="row" style={{ padding: '20px' }}>
                                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "2px" }}>
                                    <span ><span style={{ fontWeight: 'bold' }}>FYP ID:</span> {evaluationRemarks.fypId}</span>
                                    <span ><span style={{ fontWeight: 'bold' }}>Dated:</span> {moment(evaluationRemarks.evaluationDate).format('MM/DD/YYYY')}</span>
                                </div>
                                <div style={{ paddingBottom: '8px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Jury:</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', }}>
                                        {evaluationRemarks?.internalJury?.split(', ')?.map((name, index) => (
                                            <span key={index} style={{ backgroundColor: '#e0f7fa', color: '#00796b', padding: '5px 10px', borderRadius: '15px', fontSize: '14px' }}>
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                    <label style={{ fontWeight: 'bold' }}>External Jury:</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', }}>
                                        {evaluationRemarks?.externalJury?.split(', ')?.map((name, index) => (
                                            <span key={index} style={{ backgroundColor: '#e0f7fa', color: '#00796b', padding: '5px 10px', borderRadius: '15px', fontSize: '14px' }}>
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {evaluationRemarks?.midGrade ? 
                                <div style={{ paddingBottom: '8px', paddingTop: '8px', display: 'flex', alignItems: 'center' }}>
                                    <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Grade</label>
                                    <span style={{
                                        padding: '5px 10px',
                                        borderRadius: '15px',
                                        color: '#fff',
                                        backgroundColor:'#FFA500'
                                    }}>
                                        {evaluationRemarks.midGrade}
                                    </span>
                                    </div> :
                                    <div style={{ paddingBottom: '8px', paddingTop: '8px', display: 'flex', alignItems: 'center' }}>
                                        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Response Status</label>
                                        <span style={{
                                        padding: '5px 10px',
                                        borderRadius: '15px',
                                        color: '#fff',
                                        backgroundColor:
                                            evaluationRemarks.reponse === 'Re-evaluate' ? '#FFA500' :
                                                evaluationRemarks.reponse === 'Approve' || "Strong Approve" ? '#32CD32' :
                                                    evaluationRemarks.reponse === 'Rejected' ? '#FF6347' : '#000'
                                    }}>
                                        {evaluationRemarks.reponse}
                                        </span>
                                    </div>
                                }
                                <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '8px' }}>
                                    <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px', width: '100%', textAlign: 'center' }}>
                                        <label style={{ fontWeight: 'bold' }}>Remarks:</label>
                                        <p style={{ textAlign: 'left' }}>{evaluationRemarks.remarks}</p>
                                    </div>
                                </div>
                            </div> :
                            <div style={{ display: "flex", justifyContent: "center", minHeight: "100px" }}>
                                <h5 style={{ paddingTop: "10px" }}>No Remarks Uploaded</h5>
                            </div>
                        }
                        <div style={{ backgroundColor: '#4682a9', padding: '10px', color: '#fff', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                            <button onClick={() => setIsRemarks(false)} style={{ backgroundColor: '#fefefe', color: '#4682a9', border: 'none', padding: '5px 20px', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default OnGoingProjectDetails;
