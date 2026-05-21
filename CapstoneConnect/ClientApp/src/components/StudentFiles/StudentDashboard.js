import React, { Fragment, useEffect, useState } from 'react'
import BannerImg from '../assets/banner_Image.png'
import useAuth from '../../context/useAuth'
import moment from 'moment';
import Layout from '../Layout/Layout'
import StudentTasks from './StudentTasks'
import Axios from '../../axios'
import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import StudentGuidelines from './StudentGuidelines';

function StudentDashboard() {
    const { userId, status } = useAuth()
    const [members, setMembers] = useState([])
    const [supervisors, setSupervisors] = useState([])
    const [details, setDetails] = useState([])
    
    const [loading, setLoading] = useState(false)
    
    //console.log(JSON.parse((localStorage.getItem('UserName')))); 
    const getCurrentFormattedDate = () => {
        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };
    const currentDate = getCurrentFormattedDate();

    const [isAdding, setIsAdding] = useState(false);
    const [evaluationRemarks, setEvaluationRemarks] = useState("")
    const getProposalRemarks = async () => {
        try {
            const response = await Axios.get(`UserManagement/fetchproposaldefence/${userId}`);
            if (response.status === 200 || response.status === 204) {
                setEvaluationRemarks(response.data)
                setIsAdding(true)
            }

        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const getMidRemarks = async () => {
        try {
            const response = await Axios.get(`UserManagement/midevaluation/${userId}`);
            if (response.status === 200) {
                setEvaluationRemarks(response.data)
                setIsAdding(true)
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const getFinalRemarks = async () => {
        try {
            const response = await Axios.get(`admin/fetchfinalevaluation/${userId}`);
            if (response.status === 200) {
                setEvaluationRemarks(response.data)
                setIsAdding(true)
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const getDashboardData = async () => {
        try {
            setLoading(true)
            const response = await Axios.get(`fypdashboard/dashboarddata/${userId}`);
            if (response.status === 200) {
                setMembers(response.data.members)
                setSupervisors(response.data.supervisors)
                setDetails(response.data.details)
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => { getDashboardData() }, [])

    const title = localStorage.getItem("title")

    return (
        <Layout>
            {/*<NavBar />
            <MainSideBar />*/}
            <div className='mainmargins'>
                {loading ? (<div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div></div>) : (
                    <Fragment>
                            {status === "Pending" ? (
                                <Fragment>
                                    <div className="stdDashMain">
                                        <div className="container">
                                            <div className="row">
                                    <div className="col-12">
                                        <div className="banner_sm">
                                            <div className="container">
                                                <div className="row">
                                                    <div className="bannertxt">
                                                        <h5 className='curDate'><strong>Project Title: </strong>{title}</h5>
                                                        <h5 className='curDate'><strong>Project Status: </strong>{status}</h5>
                                                        <h1>{currentDate}</h1>
                                                        {/*<h5>Manage and track your progress.</h5>*/}
                                                    </div>
                                                    <div className="bannerimg">
                                                        <img src={BannerImg} alt="BannerHeroImg" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <StudentGuidelines />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                        ) : (
                                    <div className="stdDashMain">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-md-8 col-xs-12">
                                                    <div className="banner">
                                                        <div className="container">
                                                            <div className="row">
                                                                <div className="bannertxt">
                                                                    <h5 className='curDate'><strong>Project Title: </strong>{title}</h5>
                                                                    <h5 className='curDate'><strong>Project Status: </strong>{status}</h5>
                                                                    <h1>{currentDate}</h1>
                                                                    {/*<h5>Manage and track your progress.</h5>*/}
                                                                </div>
                                                                <div className="bannerimg">
                                                                    <img src={BannerImg} alt="BannerHeroImg" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-xs-8">
                                                    <div className="feedback">
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <h4 style={{ color: "#1e6896" }}><strong>Supervisor Feedback</strong></h4>
                                                        </div>
                                                        <div className="feedback-content">
                                                            {details?.feedback?.length === 0 ? (
                                                                <p>No Feedback</p>
                                                            ) : (
                                                                <>
                                                                    {details?.feedback?.length > 0 && (
                                                                        <ul style={{ paddingLeft: '20px' }}>
                                                                            {details.feedback.slice(0, 2).map((item, index) => (
                                                                                <li key={index} style={{ listStyleType: 'disc', marginBottom: '10px' }}>
                                                                                    {item.feedback}
                                                                                    {index < details.feedback.slice(0, 2).length - 1 && (
                                                                                        <hr style={{ border: 'none', borderTop: '1px solid' }} />
                                                                                    )}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                <div className="dahboardContent">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="row">
                                                    <div className="col-sm-4 col-xs-d-none">
                                                        <div className="latTask">
                                                            
                                                                <h3>Team Members</h3>
                                                                {members.map((item, index) => {
                                                                    return (<h4 key={index }>{item.name} ({item.id})</h4>)
                                                                }
                                                                )}
                                                            
                                                        </div>
                                                        <div className="latTask">
                                                            <div className="SuepervisorsSec">
                                                                        <h3>Supervisors</h3>
                                                                {supervisors.map((item, index) => (<h4>{item.supervisorName}</h4>))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                            <div div className="col-sm-4 col-xs-6">
                                                                <div className="latTask">
                                                                    <h3>Project Progress</h3>
                                                                    <div style={{ width: '82%', height: '80%', margin: '0 auto' }}>
                                                                        <CircularProgressbar
                                                                            value={details.progress ?? 0}
                                                                            text={`${details.progress??0}%`}
                                                                            background
                                                                            backgroundPadding={6}
                                                                            styles={buildStyles({
                                                                                textSize: '14px',
                                                                                backgroundColor: "#3e98c7",
                                                                                textColor: "#fff",
                                                                                pathColor: "#fff",
                                                                                trailColor: "transparent"
                                                                            })}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-4 col-xs-6">
                                                    <div style={{boxShadow:"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px", borderRadius:"12px", minHeight:"89%"}}>
                                                        <div className="teamMembersSec">
                                                            <div style={{paddingTop:"16px", paddingLeft:"12px"}}>
                                                            <h3>Project Remarks</h3>
                                                            </div>
                                                            {(status === "Abstract" || status === "Pending" )&& (
                                                                <div style={{ display:"flex", justifyContent:'center', paddingTop:"12px"}}>
                                                                    <p>No Remarks Available</p>
                                                                </div>
                                                            )}
                                                            {(status === "Fyp1") && (
                                                                <div style={{paddingTop:"16px", paddingLeft:"12px"}} >
                                                                    <button style={{ width: "80%", margin: "2%" }} onClick={getProposalRemarks}>Proposal Remarks</button>
                                                                </div>
                                                            )}
                                                            {(status === "Fyp2") && (
                                                                <div style={{paddingTop:"16px", paddingLeft:"12px"}}>
                                                                    <button style={{ width: "80%", margin: "2%" }} onClick={getProposalRemarks}>Proposal Remarks</button>
                                                                    <button style={{ width: "80%", margin: "2%" }} onClick={getMidRemarks}>Mid Remarks</button>
                                                                </div>
                                                            )}
                                                                    {status === "Complete" && (
                                                                        <div style={{paddingTop:"16px", paddingLeft:"12px"}}>
                                                                            <button style={{ width: "80%", margin: "2%" }} onClick={getProposalRemarks}>Proposal Remarks</button>
                                                                            <button style={{ width: "80%", margin: "2%" }} onClick={getMidRemarks}>Mid Remarks</button>
                                                                            <button style={{ width: "80%", margin: "2%" }} onClick={getFinalRemarks}>Final Remarks</button>
                                                                        </div>
                                                                    )}
                                                                    </div>
                                                    </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                            <StudentTasks students={members} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Fragment>
                )}
            </div>
            {isAdding && (
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
                            }} onClick={() => setIsAdding(false)}>
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
                                            backgroundColor: '#FFA500'
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
                                                    evaluationRemarks.reponse === 'Approve' || evaluationRemarks.reponse === 'Strong Approve' ? '#32CD32' :
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
                            <button onClick={() => setIsAdding(false)} style={{ backgroundColor: '#fefefe', color: '#4682a9', border: 'none', padding: '5px 20px', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    )
}

export default StudentDashboard
