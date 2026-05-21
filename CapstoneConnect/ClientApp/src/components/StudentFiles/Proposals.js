import React, { useEffect, useState } from 'react';
//import MainSideBar from './MainSideBar';
import NavBar from '../Layout/NavBar';
import SupSideBar from '../SupervisorFiles/SupSideBar';
import Axios from '../../axios';
import useAuth from '../../context/useAuth';
import MainSideBar from '../Layout/MainSideBar';
import moment from 'moment';
import Layout from '../Layout/Layout';
import { SuccessToaster } from '../Utils/Toaster';
import { ErrorToaster } from '../Utils/Toast';

const AccordionItem = ({status }) => {
    const { userId } = useAuth()
    const [isOpen, setIsOpen] = useState(false);
    const [btnLoading, setBtnLoading] = useState({
        approve: false,
        reject: false,
        download: false,
    });
    const [isAdding, setIsAdding] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [proposals, setProposalsData] = useState(null);
    const [subId, setSubId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [rejErr, SetRejErr] = useState(null)

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await Axios.post('supervisor/fetchproposal', {
                SupId: userId,
                Type_Submission: 1,
                status: status
            });
            setProposalsData(response.data);
        } catch (error) {
            ErrorToaster(error?.response?.data)
            console.error('Error fetching Data:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    const [openIndexes, setOpenIndexes] = useState([]);

    const toggleAccordion = (index) => {
        setOpenIndexes((prevIndexes) => {
            if (prevIndexes.includes(index)) {
                return prevIndexes.filter((i) => i !== index);
            } else {
                return [ index];
            }
        });
    };

    const handleApprove = async (subId, status) => {
        // Handle approve logic
        try {
            setBtnLoading(prevState => ({ ...prevState, approve: true }));
            const response = await Axios.post('supervisor/acceptproposals',{
                    SupId : userId,
                    SubmissionId: subId,
                    status
            })
            if (response.status === 200) {
                SuccessToaster('Project Approved');
            }
        } catch (error) {
            ErrorToaster(error?.response?.data)
            console.error('An error occurred', error);
        } finally {
            setBtnLoading(prevState => ({ ...prevState, approve: false }));
            fetchData()
        }

    };


    const openRejectModal = (subId) => {
        setIsAdding(true);
        setSubId(subId)
    };

    const submitRejection = async () => {
        if (!rejectionReason) {
            SetRejErr("Enter rejection reason")
            return
        } else {
            try {
                setBtnLoading(prevState => ({ ...prevState, reject: true }));
                const response = await Axios.post('supervisor/rejectproposal', {
                    SupId: userId,
                    SubmissionId: subId,
                    Feedback: rejectionReason
                });

                if (response.status === 200) {
                    SuccessToaster('Project Rejected');
                    setIsAdding(false);
                }
            } catch (error) {
                ErrorToaster(error?.response?.data)
                console.error('An error occurred', error);
            }
            finally {
                fetchData()
                setBtnLoading(prevState => ({ ...prevState, reject: false }));
            }
        }
    };

    
    //Download files
    const downloadFile = async (SubmissionId) => {
        try {
            setBtnLoading(prevState => ({ ...prevState, download: true }))
            const response = await Axios.post(`usermanagement/downloadsubmissionfile/${SubmissionId}`, {}, {
                responseType: 'arraybuffer'
            });
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
                ErrorToaster("Download failed")
                console.error('File download failed:', response?.message);
            }
        } catch (error) {
            ErrorToaster(error?.response?.data)
            console.error('An error occurred', error);
        } finally {
            setBtnLoading(prevState => ({ ...prevState, download: false }))
        }
    }
    const formatPlagiarism = (value) => (value * 100).toFixed(0);

   return (
       <>
           <div>
               {loading ? (
                   <div style={{ display: "flex", justifyContent: "center", width: "100%", paddingTop:"18px" }}>
                       <div className="spinner-border text-secondary" role="status">
                           <span className="visually-hidden">Loading...</span>
                       </div></div> 
               ) : (
                   <div>
                   {proposals?.length > 0 ?(
                               <>
                                   {proposals.map((proposal, index) => (
                                       <div className={`accordion-item ${openIndexes.includes(index) ? 'open' : ''}`} key={index}>
                                           <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                                               <h3 className='pNo'>{proposal.submission_Id}</h3>
                                               <h3 className='pName'>{proposal.fypTitle}</h3>
                                               <p className={proposal.plagiarism > 0.60 ? 'text-danger' : ''}>
                                                   Plagiarism {formatPlagiarism(proposal.plagiarism)}%
                                                   {proposal.plagiarism > 0.60 && (
                                                       <i className="fas fa-exclamation-triangle" style={{ marginLeft: '8px' }}></i>
                                                   )}
                                               </p>
                                               {/*<p className='shortDescrp'>{proposal.fypDescription ?? "---No Description---"}</p>*/}
                                               <p className='pDate'>{moment(proposal.submissionDate).format('MM/DD/YYYY')}</p>
                                               <p className='pStatus'>{proposal.status === "CoSupervisor Accepted" ? "CoSupervisor" : proposal.status}</p>
                                               <button className="accordion-arrow">
                                                   {openIndexes.includes(index) ? '-' : '+'}
                                               </button>
                                           </div>
                                           {openIndexes.includes(index) && (
                                               <div className="accordion-content">
                                                   <p>{proposal.fypDescription ?? "---No Description---"}</p>
                                                   <p style={{ fontWeight: 'bold' }}>Group Members:
                                                       <span style={{ fontStyle: 'italic', fontSize: 'small', paddingLeft: "2px" }}>{proposal.teamMembers}</span>
                                                   </p>
                                                   <p style={{ fontWeight: 'bold' }}>Supervisors:
                                                       <span style={{ fontStyle: 'italic', fontSize: 'small', paddingLeft: "2px" }}>{proposal.supervisor}, {proposal.coSupervisor}</span>
                                                   </p>
                                                   <div className="accordion-buttons">
                                                       {status === "Pending" && (
                                                           <>
                                                               <button onClick={() => { handleApprove(proposal.submission_Id, status) }}
                                                                   className={`statusApv ${btnLoading.approve ? 'disabled' : ''}`}
                                                                   disabled={btnLoading.approve}
                                                               >
                                                                   {btnLoading.approve ? 'Approving...' : 'Approve'}
                                                               </button>
                                                               <button onClick={() => openRejectModal(proposal.submission_Id)}
                                                                   className={`statusRej`}
                                                               >Reject</button>
                                                           </>
                                                       )}
                                                       <button onClick={() => downloadFile(proposal.submission_Id)}
                                                           className={`statusDwn ${btnLoading.download ? 'disabled' : ''}`}
                                                           disabled={btnLoading.download}
                                                       >
                                                           {btnLoading.download ? 'Downloading...' : 'Download'}
                                                       </button>
                                                   </div>
                                               </div>
                                           )}
                                       </div>
                                   ))}
                               </>
                   ):(
                       <p>No record Found</p>
                   ) }
                   </div>
                   
               ) }
           </div>
        
        <>
            {isAdding && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsAdding(false)}>&times;</span>
                        <h6>Proposal Rejection</h6>
                        <textarea
                               value={rejectionReason}
                               onChange={(e) => { setRejectionReason(e.target.value); SetRejErr(null) }}
                            placeholder="Enter the reason for rejection"
                            rows="4"
                            cols="50"
                        />
                       {rejErr && <div className="error-message" style={{ color: 'red', marginBottom: '8px', fontSize: "13px" }}>{rejErr}</div> }
                           {/*<button onClick={submitRejection}>Submit Rejection</button>*/}
                           <button onClick={submitRejection}
                               className={`addSupervisorButton ${btnLoading.reject ? 'disabled' : ''}`}
                               disabled={btnLoading.reject}
                           >
                               {btnLoading.reject ? 'Submitting...' : 'Submit Rejection'}
                           </button>
                    </div>
                </div>
            )}            </>
    </>
    );
};

const Tab = ({ label, isActive, onClick }) => {
    return (
        <div className={`tab ${isActive ? 'active' : ''}`} onClick={onClick}>
            {label}
        </div>
    );
};

function Proposals() {

    const [activeTab, setActiveTab] = useState('Tab 1');

    const handleTabClick = (tabLabel) => {
        setActiveTab(tabLabel);
    };


    return (
        <Layout>
            {/*<NavBar />
            <MainSideBar />*/}
            <div className='mainmargins'>
                <div className='headingContainer'>
                    <div className="row">
                        <div className="ProposalsMaainn">
                            <h2>proposals</h2>
                            <div className="tabs-container">
                                <div className="tabs">
                                    <Tab label="Pending Proposals" isActive={activeTab === 'Tab 1'} onClick={() => handleTabClick('Tab 1')} />
                                    <Tab label="Approved" className='app' isActive={activeTab === 'Tab 2'} onClick={() => handleTabClick('Tab 2')} />
                                    <Tab label="Rejected" className='rej' isActive={activeTab === 'Tab 3'} onClick={() => handleTabClick('Tab 3')} />
                                </div>
                                <div className="tab-content">
                                    {activeTab === 'Tab 1' && <div><div className="accordion">
                                        < AccordionItem status={"Pending" } />
                                    </div></div>}
                                    {activeTab === 'Tab 2' && <div><div className="accordion">
                                        < AccordionItem status={"Approved"} />
                                    </div></div>}
                                    {activeTab === 'Tab 3' && <div><div className="accordion">
                                        < AccordionItem status={"Rejected"} />
                                    </div></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Proposals
