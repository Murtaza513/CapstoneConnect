import React, { useEffect, useState } from 'react'
import axios from 'axios';
import useAuth from '../../context/useAuth';
import TagsInput from './TagsInput';
import moment from 'moment';
import { ErrorToaster, SuccessToaster } from '../Utils/Toast';
import ValidationDialog from './ValidationDialog';
import DocForm from './DocForm';
import FeedBackDialog from './FeedbackDialog';
import Layout from '../Layout/Layout';
import Pagination from '../Utils/Pagination';
import Axios from '../../axios';


function ProposalsList() {
    const { userId, status } = useAuth()
    const [authToken, setAuthToken] = useState(localStorage.getItem("studentToken"))
    const [studentId, setStudentId] = useState(localStorage.getItem("studentId"))
    const [isAdding, setIsAdding] = useState(false);
    const [isAuth, setIsAuth] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [docLoading, setDocLoading] = useState(false);
    const [formValue, setFormValue] = useState("");
    const [proposals, setProposals] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    /*pagination*/
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    const [supervisors, setSupervisors] = useState([]);
    const [docType, setDocType] = useState("")
    const [abstractStatus, setAbstractStatus] = useState(false)
    const [pendingAbstract, setPendingAbstract] = useState(false)

    const [options, setOptions] = useState([])
    const [showFeedBack, setShowFeedBack] = useState(false)
    const [feedBackId, setFeedBackId] = useState("")
    const [btnLoading, setBtnLoading] = useState(false);

    /*Description Modal Logic*/
    const [tagArray, setTagArray] = useState(null)
    const [descData, setDescData] = useState({
        Title: '',
        TeamId: '',
        Description: '',
        Tag: []
    });

    const handleDescChange = (e) => {
        setDescData({
            ...descData,
            [e.target.name]: e.target.value
        });
        setDescError(null)
    };

    const addTag = (tag) => {
        setDescError(null)
        if (descData.Tag) {

            let newTag = [...descData.Tag, tag]
            setDescData({ ...descData, Tag: newTag });
        }
        else {
            setDescData({ ...descData, Tag: [tag] });
        }
    };

    const removeTag = (index) => {
        setDescData({ ...descData, Tag: descData?.Tag?.filter((_, i) => i !== index) });
    };

    const fetchDescription = async () => {
        try {
            const response = await Axios.get(`studentmanagement/description/${userId}`);
            setTagArray(response?.data?.tags?.split(","))
            setDescData({
                Title: response?.data?.title,
                TeamId: response?.data?.id,
                Description: response?.data?.projectDescription,
                Tag: response?.data?.tags?.split(",")
            })
            if (response.data.tags === null || response.data.projectDescription === null || response?.data?.title === null) {
                setIsAdding(true);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const [descError, setDescError] = useState(null);

    const handleDesc = async (e) => {
        e.preventDefault();
        if (!descData.Title || !descData.Description || descData.Tag.length === 0) {
            setDescError("Please fill all fields")
            return
        }
        else {
            setBtnLoading(true)
            let submitData = {
                id: userId,
                title: descData.Title,
                projectDescription: descData.Description,
                tags: descData.Tag.join(','),
            }

            try {
                const response = await Axios.post('studentmanagement/updatedescription', submitData);
                if (response.status === 200) {
                    SuccessToaster("Successfuly Updated")
                    setIsAdding(false)
                }
            }
            catch (error) {
                console.error('An error occurred', error);
                ErrorToaster(error?.response?.data?.message)
            }
            finally {
                fetchDescription();
                setBtnLoading(false)
            }
        }

    }
    //

    //For Submitted Propsals
    const fetchProposals = async () => {
        try {
            setIsLoading(true)
            const response = await Axios.get(`usermanagement/fetchsubmission/${userId}`);
            setProposals(response.data);
            const abstract = response?.data?.some((item) => item.submission_Type === "Abstract" && item.status === "Accepted")
            setAbstractStatus(abstract)
            const pendingAbstracts = response?.data?.filter(
                (item) => item.submission_Type === "Abstract" && item.status === "Pending"
            ).length > 2;
            setPendingAbstract(pendingAbstracts)
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setIsLoading(false)
        }
    };

    // For List of Supervisors
    const fetchSupervisors = async () => {
        try {
            const response = await Axios.get('studentmanagement/availablesupervisor');
            console.log("Ress:Supervisor-> ", response)
            setSupervisors(response.data);
        } catch (error) {
            console.error('Error fetching supervisors:', error);
        }
    };

    //Download files
    const downloadFile = async (id) => {
        console.log("Downloading file...");
        try {
            const response = await Axios.post(`usermanagement/downloadsubmissionfile/${id}`, {}, {
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
                ErrorToaster("Download failed");
                console.error('File download failed:', response?.message);
            }
        } catch (error) {
            ErrorToaster(error?.response?.data);
            console.error('An error occurred', error);
        }
    }

    //Handle File type to submit
    const handleSelectChange = (e) => {
        setFormValue(e.target.value);
        setDocType(e.target.value);
        setIsAuth(true)
    };

    const docOptions = async (e) => {
        try {
            const response = await Axios.get(`studentmanagement/eligiblesubmissions/${userId}`);
            if (response.status === 200) {
                setOptions(response.data)
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    //
    useEffect(() => {
        docOptions();
        fetchProposals();
        fetchSupervisors();
        fetchDescription();
    }, [])

    const formatPlagiarism = (value) => (value * 100).toFixed(0);

    const filteredProjects = proposals?.filter(project => {
        const values = Object?.values(project)?.map(value => String(value)?.toLowerCase());
        return values?.some(value => value?.includes(searchQuery?.toLowerCase()));
    });

    const indexOfLastProject = currentPage * itemsPerPage;
    const indexOfFirstProject = indexOfLastProject - itemsPerPage;
    const currentProjects = filteredProjects?.slice(indexOfFirstProject, indexOfLastProject);

    const totalPages = Math.ceil(proposals?.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <Layout>
            {/*<NavBar />
            <MainSideBar />*/}
            <div className='mainmargins'>
                <div className="headingContainer">
                    {docLoading && <div className="loader-container">
                        <div className="loader"></div>
                    </div>}
                    <div className="row">
                        <h2>Submitted Documents</h2>
                        <div className="prevProjectMain">
                            <div style={{ width: "100%", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ width: "28%", paddingTop: "10px" }}><input type="text" className="form-control" placeholder="Search By Name..." value={searchQuery}
                                    onChange={handleSearchChange}
                                /></div>
                                <div style={{ width: "50%", display: "flex", justifyContent: "space-between", width: "width" }}>
                                    <div style={{ width: "55%" }} >
                                        <select className="form-control custom-select" value={formValue || ''} onChange={handleSelectChange}>
                                            <option value="" disabled hidden>Document Type</option>
                                            {pendingAbstract ? (<option value="" disabled >No Doc </option>) : (
                                                <>
                                                    {!abstractStatus ? (
                                                        <option value="Abstract">Submit Abstract</option>
                                                    ) : (
                                                        options?.map((option, index) => {
                                                            if (option !== 'Abstract') {
                                                                return <option key={index} value={option}>{option}</option>;
                                                            }
                                                        })
                                                    )}
                                                </>
                                            )}
                                        </select>
                                    </div>
                                    <button style={{ width: "43%" }} onClick={() => setIsAdding(true)}>Description</button>
                                </div>
                            </div>
                            {authToken && isAuth &&
                                <DocForm abstractStatus={abstractStatus} setFormValue={setFormValue} setIsAuth={setIsAuth} supervisors={supervisors} fetchProposals={fetchProposals} docOptions={docOptions} studentId={studentId} docType={docType} setDocLoading={setDocLoading} />
                            }
                            <div>
                            </div>
                            {isLoading ? (<div style={{ display: "flex", justifyContent: "center", width: "100%", paddingTop: "18px" }}>
                                <div className="spinner-border text-secondary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div></div>) : (
                                <div className="table-responsive">
                                    <table className="minimalist-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>File Type</th>
                                                <th>SUPERVISIOR</th>
                                                <th>CO-SUPERVISIOR</th>
                                                <th>Date</th>
                                                <th className="text-center">Status</th>
                                                <th>plagiarism</th>
                                                <th>Download</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentProjects?.map(proposal => (
                                                <tr key={proposal.id}>
                                                    <td>{proposal.id}</td>
                                                    <td>{proposal.submission_Type}</td>
                                                    <td>{proposal.supervisor_Name}</td>
                                                    <td>{proposal.co_Supervisor_Name}</td>
                                                    <td>{moment(proposal.date).format('MM/DD/YYYY')}</td>
                                                    <td className="text-center">{proposal.status === "Accepted" || proposal.status === "Review" ?
                                                        <button onClick={() => { setShowFeedBack(true); setFeedBackId(proposal.id) }} style={{ backgroundColor: "limegreen", borderRadius: "18px", width: "98px" }} >{proposal.status}</button> :
                                                        <button disabled style={{ backgroundColor: "grey", cursor: "default", borderRadius: "18px", width: "98px" }}>{proposal.status}</button>}
                                                    </td>
                                                    <td className={proposal.plagiarism > 0.60 ? 'text-danger' : ''}>
                                                        {formatPlagiarism(proposal.plagiarism)}%
                                                        {proposal.plagiarism > 0.60 && (
                                                            <i className="fas fa-exclamation-triangle" style={{ marginLeft: '8px' }}></i>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button onClick={() => downloadFile(proposal.id)}>Download</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div style={{ width: "50%", display: "flex", justifyContent: "flex-end", paddingTop: "16px" }}>
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* View Modal */}
            {isAdding && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsAdding(false)}>&times;</span>
                        <h6>Propsal Description</h6>
                        <div className="row">
                            <div >
                                <label>Title</label>
                                <input required type="text" className="form-control" name="Title" placeholder="Title" value={descData.Title} onChange={handleDescChange} />
                            </div>
                            <div >
                                <label>Description</label>
                                <textarea required type="text" className="form-control" name="Description" placeholder="Description" value={descData.Description} onChange={handleDescChange} />
                            </div>
                            <div >
                                <label>Tags</label>
                                <TagsInput tags={descData.Tag} addTag={addTag} removeTags={removeTag} />
                            </div>
                            {descError && <div className="error-message" style={{ color: 'red', marginBottom: '8px', fontSize: "13px" }}>{descError}</div>}
                            {/*<button onClick={handleDesc}>Submit</button>*/}
                            <button onClick={handleDesc}
                                className={`addSupervisorButton ${btnLoading ? 'disabled' : ''}`}
                                disabled={btnLoading}
                            >
                                {btnLoading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {!authToken && formValue && <ValidationDialog userId={userId} setIsAuth={setIsAuth} setFormValue={setFormValue} setAuthToken={setAuthToken} setStudentId={setStudentId} />}
            {showFeedBack && <FeedBackDialog feedBackId={feedBackId} setShowFeedBack={setShowFeedBack} />}
        </Layout>
    )
}
export default ProposalsList