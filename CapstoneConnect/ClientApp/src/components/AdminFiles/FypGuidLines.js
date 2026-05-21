import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {SuccessToaster} from '../../components/Utils/Toast'
import { ErrorToaster } from '../Utils/Toaster';
import useAuth from '../../context/useAuth';
import Layout from '../Layout/Layout';
import { Tooltip as ReactTooltip } from "react-tooltip";
import Pagination from '../Utils/Pagination';
import '../Utils/Loader.css';
import Axios from '../../axios';

function FypGuidLines() {
    const { role } = useAuth()
    const { status } = useAuth()
    const [loading, setLoading] = useState(false);
    const [docLoading, setDocLoading] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [loadSelect, setLoadSelect] = useState(false);
    const [options, setOptios] = useState([]);
    const [isComplete, setIsComplete] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const toggleRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    const [guideLines, setGuideLines] = useState([])
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); 

    const [selectedOption, setSelectedOption] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedSubmitType, setSelectedSubmitType] = useState('');

    const [updateGuide, setUpdateGuide] = useState(null)
    
    const [descData, setDescData] = useState({
        Title: '',
        Description: '',
        files:''
    });

    const handleClose = () => {
        setIsAdding(false)
        setUpdateGuide(null)
        setDescData({
            Title: '',
            Description: '',
            files: ''
        })
        setSelectedSection("")
        setSelectedSubmitType("")
    }
    //Handle File Upload
    const handleFileUpload = (e) => {
        setDescData({ ...descData, files: e.target.files[0] });
    };

    const handleDescChange = (e) => {
        setDescData({
            ...descData,
            [e.target.name]: e.target.value
        });
    };

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
        setCurrentPage(1);
    };

    const handleUploadClick = () => {
        setIsAdding(true)
    };

    const handleGuidline = async (e) => {
        e.preventDefault();
        setDocLoading(true)
        try {
            const formData = new FormData();
            formData.append('Section', selectedSection);
            formData.append('title', descData.Title);
            formData.append('Description', descData.Description);
            formData.append('SubmissionType', selectedSubmitType);
            formData.append('files', descData.files);
            if (updateGuide) {
                formData.append('Id', updateGuide);
                const response = await Axios.post(`admin/updateguideline`, formData);
                if (response.status === 200) {
                    setUpdateGuide(null)
                    setIsAdding(false)
                    handleClose()
                    SuccessToaster("Update Successfuly")
                }
            } else {
                formData.append('files', descData.files);
                if (!selectedSection || !descData.Description || !descData.files || !selectedSubmitType) {
                    alert("Please fill all fields before submitting.");
                    return;
                } else {
                    const response = await Axios.post(`admin/addguidelines`, formData);
                    if (response.status === 200) {
                        setIsAdding(false)
                        SuccessToaster("Add Successfuly")
                    }
                }
            }
        }
        catch (error) {
            console.log("err=>", error)
            ErrorToaster("Something Went Wrong")
        } finally {
            setDocLoading(false);
            fetchGuidlines()
            setUpdateGuide(null)
        }
    }

    const fetchGuidlines = async () => {
        try {
            setLoading(true)
            const response = await Axios.get(`usermanagement/fetchguidelines`);
            setGuideLines(response?.data)
        } catch (error) {
            ErrorToaster("Data loading failed")
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false)
        }
    };

    const handleSelectSection = async (e) => {
        setSelectedSection(e.target.value)
        let type = e.target.value
        try {
            setLoadSelect(true)
            const response = await Axios.get(`usermanagement/submissiontypes/${type}`);
            
            if (response.data.isCompletedSuccessfully) {
                setLoadSelect(false)
                setOptios(response.data.result)
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    const downloadDocs = async (id) => {
        try {
            const response = await Axios.post(`usermanagement/downloadfile/${id}`, {}, {
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

    const UpdateGuide = (data) => {
        setIsAdding(true)
        setSelectedSection(data.section)
        setSelectedSubmitType(data.submissionType)
        setDescData({ ...descData, Description: data.description })
        setUpdateGuide(data.id)
    }

    const DeleteGuide = async () => {
        const response = await Axios.post(`admin/deleteguideline/${deleteId}`)
        if (response.status === 200) {
            SuccessToaster("Deleted")
            fetchGuidlines();
            setIsComplete(false)
        }
    }

    useEffect(() => {
        fetchGuidlines();
        return () => {
            setUpdateGuide(null);
        };
    }, [])

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filterdGuideLine = guideLines?.filter(guide => {
        return (selectedOption ? guide.section === selectedOption : true) &&
            Object.values(guide).some(value => String(value).toLowerCase().includes(searchQuery.toLowerCase()))
    })
    
    const indexOfLastProject = currentPage * itemsPerPage;
    const indexOfFirstProject = indexOfLastProject - itemsPerPage;
    const currentProjects = filterdGuideLine.slice(indexOfFirstProject, indexOfLastProject);

    const totalPages = Math.ceil(filterdGuideLine.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Layout>
            {/*<NavBar />
            <MainSideBar />*/}
            <div className='mainmargins'>
                <div className="headingContainer">
                    <div className="row">
                        {docLoading && <div className="loader-container">
                            <div className="loader"></div>
                        </div> }
                        <h2>Fyp Guidelines</h2>
                        {loading ? <div style={{ display: "flex", justifyContent: "center", width: "100%", paddingTop: "18px" }}>
                            <div className="spinner-border text-secondary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div></div>:
                            <div className="adminRegis">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px" }}>
                                    <div style={{ width: "20em" }}><input type="text" placeholder="Search by project name..."
                                        value={searchQuery} onChange={handleSearchChange} /></div>
                                    {role === "Admin" &&
                                        <div style={{ display: "flex", marginRight: "0.5em", width: "19em" }}>
                                            <select className="form-control custom-select" value={selectedOption} onChange={handleSelectChange} style={{ marginRight: '8px' }}>
                                                <option value="" disabled>Select Guide Type</option>
                                                <option value="Abstract">Abstract</option>
                                                <option value="Fyp1">Fyp1</option>
                                                <option value="Fyp2">Fyp2</option>
                                                <option value="Complete">Completed</option>
                                                <option value="Supervisor">Supervisors</option>
                                            </select>
                                            <ReactTooltip
                                                id="my-tooltip-1"
                                                place="bottom"
                                                content="Upload Guidline Doc"
                                                variant="info"
                                            />
                                            <div data-tooltip-id="my-tooltip-1" style={{ display: "flex", alignItems: "center", marginLeft: "0.5em", width: "12em" }}>
                                                <i className="fas fa-upload" style={{ cursor: 'pointer', fontSize: '24px', marginRight: '4px' }} onClick={handleUploadClick}></i>
                                                <span style={{ cursor: 'pointer' }} onClick={handleUploadClick}>Upload</span>
                                            </div>
                                        </div>
                                    }
                                </div>  
                                {selectedOption === "Fyp1" || status === "Fyp1" || status === "Abstract" ? (
                                    <>
                                        <div className="table-responsive">
                                        <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "8px" }}>
                                            <h4>Fyp 1 Guidlines</h4>
                                        </div>
                                            <table className="minimalist-table">
                                            <thead>
                                                <tr>
                                                    <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "50%" }}>File Name</th>
                                                    <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "30%", textAlign: "center" }}>Download File</th>
                                                    {role === "Admin" &&
                                                        <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "5%" }}>Action</th>
                                                    }
                                                    <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "50px" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentProjects?.map((item, index) => (
                                                    <React.Fragment key={index}>
                                                        <tr>
                                                            <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>{item.submissionType}</td>
                                                            <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button onClick={() => downloadDocs(item.id)}>Downland Document</button></td>
                                                            {role === "Admin" &&
                                                                <>
                                                                    <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button style={{ background: "#4682a9" }} onClick={() => UpdateGuide(item)}>Update</button></td>
                                                                    <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button style={{ background: "#e3050c" }} onClick={() => { setIsComplete(true); setDeleteId(item.id) }}>Delete</button></td>
                                                                </>
                                                            }
                                                            <td style={{ borderBottom: "1px solid #ddd", padding: "8px", textAlign: "center", cursor: "pointer" }} onClick={() => toggleRow(index)}>
                                                                {expandedRow === index ? (
                                                                    <i className="fa fa-minus" style={{ color: "#dc3545" }}></i>
                                                                ) : (
                                                                    <i className="fa fa-plus" style={{ color: "#28a745" }}></i>
                                                                )}
                                                            </td>
                                                        </tr>
                                                        {expandedRow === index && (
                                                            <tr>
                                                                <td colSpan="3" style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                                                                    <p style={{ whiteSpace: "pre-line" }}>{item.description}</p>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
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
                                    </>
                                ): selectedOption === "Abstract" || status === "Abstract" ?(
                                        <>
                                            <div className="table-responsive">
                                            <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "8px" }}>
                                                <h4>Abstract Guidlines</h4>
                                                </div>
                                                <table className="minimalist-table">
                                                <thead>
                                                    <tr>
                                                        <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "50%" }}>File Name</th>
                                                        <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "30%", textAlign: "center" }}>Download File</th>
                                                        {role === "Admin" &&
                                                            <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "5%" }}>Action</th>
                                                        }
                                                        <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "50px" }}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentProjects?.map((item, index) => (
                                                        <React.Fragment key={index}>
                                                            <tr>
                                                                <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>{item.submissionType}</td>
                                                                <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button onClick={() => downloadDocs(item.id)}>Downland Document</button></td>
                                                                {role === "Admin" &&
                                                                    <>
                                                                        <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button style={{ background: "#4682a9" }} onClick={() => UpdateGuide(item)}>Update</button></td>
                                                                        <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button style={{ background: "#e3050c" }} onClick={() => { setIsComplete(true); setDeleteId(item.id) }}>Delete</button></td>
                                                                    </>
                                                                }
                                                                <td style={{ borderBottom: "1px solid #ddd", padding: "8px", textAlign: "center", cursor: "pointer" }} onClick={() => toggleRow(index)}>
                                                                    {expandedRow === index ? (
                                                                        <i className="fa fa-minus" style={{ color: "#dc3545" }}></i>
                                                                    ) : (
                                                                        <i className="fa fa-plus" style={{ color: "#28a745" }}></i>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            {expandedRow === index && (
                                                                <tr>
                                                                    <td colSpan="3" style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                                                                        <p style={{ whiteSpace: "pre-line" }}>{item.description}</p>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </React.Fragment>
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
                                        </>
                                ):selectedOption === "Complete" || status === "Complete" ?(
                                <>
                                <div className="table-responsive">
                                    <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "8px" }}>
                                        <h4>Guidlines For Complete</h4>
                                    </div>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr>
                                                <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "50%" }}>File Name</th>
                                                <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "30%", textAlign: "center" }}>Download File</th>
                                                {role === "Admin" &&
                                                    <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "5%" }}>Action</th>
                                                }
                                                <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "50px" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentProjects?.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    <tr>
                                                        <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>{item.submissionType}</td>
                                                        <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button onClick={() => downloadDocs(item.id)}>Downland Document</button></td>
                                                        {role === "Admin" &&
                                                            <>
                                                                <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button style={{ background: "#4682a9" }} onClick={() => UpdateGuide(item)}>Update</button></td>
                                                                <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button style={{ background: "#e3050c" }} onClick={() => { setIsComplete(true); setDeleteId(item.id) }}>Delete</button></td>
                                                            </>
                                                        }
                                                        <td style={{ borderBottom: "1px solid #ddd", padding: "8px", textAlign: "center", cursor: "pointer" }} onClick={() => toggleRow(index)}>
                                                            {expandedRow === index ? (
                                                                <i className="fa fa-minus" style={{ color: "#dc3545" }}></i>
                                                            ) : (
                                                                <i className="fa fa-plus" style={{ color: "#28a745" }}></i>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    {expandedRow === index && (
                                                        <tr>
                                                            <td colSpan="3" style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                                                                <p style={{ whiteSpace: "pre-line" }}>{item.description}</p>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
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
                                </>
                                ):selectedOption === "Fyp2" || status === "Fyp2" ?(
                                <>
                                    <div className="table-responsive">
                                    <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "8px" }}>
                                        <h4>Fyp 2 Guidlines</h4>
                                    </div>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr>
                                                <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "50%" }}>File Name</th>
                                                <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "30%", textAlign: "center" }}>Download File</th>
                                                {role === "Admin" &&
                                                    <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "5%" }}>Action</th>
                                                }
                                                <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "50px" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentProjects?.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    <tr>
                                                        <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>{item.submissionType}</td>
                                                        <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button onClick={() => downloadDocs(item.id)}>Downland Document</button></td>
                                                        {role === "Admin" &&
                                                            <>
                                                                <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button style={{ background: "#4682a9" }} onClick={() => UpdateGuide(item)}>Update</button></td>
                                                                <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button style={{ background: "#e3050c" }} onClick={() => { setIsComplete(true); setDeleteId(item.id) }}>Delete</button></td>
                                                            </>
                                                        }
                                                        <td style={{ borderBottom: "1px solid #ddd", padding: "8px", textAlign: "center", cursor: "pointer" }} onClick={() => toggleRow(index)}>
                                                            {expandedRow === index ? (
                                                                <i className="fa fa-minus" style={{ color: "#dc3545" }}></i>
                                                            ) : (
                                                                <i className="fa fa-plus" style={{ color: "#28a745" }}></i>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    {expandedRow === index && (
                                                        <tr>
                                                            <td colSpan="3" style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                                                                <p style={{ whiteSpace: "pre-line" }}>{item.description}</p>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
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
                                </>
                                    ) : selectedOption === "Supervisor" || role === "Supervisor" ? (
                                            <>
                                            <div className="table-responsive">
                                                <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "8px" }}>
                                                    <h4>Supervisor</h4>
                                                </div>
                                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "50%" }}>File Name</th>
                                                            <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "30%", textAlign: "center" }}>Download File</th>
                                                            {role === "Admin" &&
                                                                <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "5%" }}>Action</th>
                                                            }
                                                            <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "50px" }}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentProjects?.map((item, index) => (
                                                            <React.Fragment key={index}>
                                                                <tr>
                                                                    <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>{item.submissionType}</td>
                                                                    <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button onClick={() => downloadDocs(item.id)}>Downland Document</button></td>
                                                                    {role === "Admin" &&
                                                                        <>
                                                                            <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button style={{ background: "#4682a9" }} onClick={() => UpdateGuide(item)}>Update</button></td>
                                                                            <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button style={{ background: "#e3050c" }} onClick={() => { setIsComplete(true); setDeleteId(item.id) }}>Delete</button></td>
                                                                        </>
                                                                    }
                                                                    <td style={{ borderBottom: "1px solid #ddd", padding: "8px", textAlign: "center", cursor: "pointer" }} onClick={() => toggleRow(index)}>
                                                                        {expandedRow === index ? (
                                                                            <i className="fa fa-minus" style={{ color: "#dc3545" }}></i>
                                                                        ) : (
                                                                            <i className="fa fa-plus" style={{ color: "#28a745" }}></i>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                {expandedRow === index && (
                                                                    <tr>
                                                                        <td colSpan="3" style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                                                                            <p style={{ whiteSpace: "pre-line" }}>{item.description}</p>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </React.Fragment>
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
                                            </>
                                ):selectedOption === "Supervisor" || role === "Admin" ?(
                                    <>
                                       <div className="table-responsive">
                                        <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "8px" }}>
                                            <h4>All Guidelines</h4>
                                        </div>
                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "50%" }}>File Name</th>
                                                    <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "30%", textAlign: "center" }}>Download File</th>
                                                    {role === "Admin" &&
                                                        <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "5%" }}>Action</th>
                                                    }
                                                    <th style={{ borderBottom: "1px solid #ddd", padding: "8px", width: "50px" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentProjects?.map((item, index) => (
                                                    <React.Fragment key={index}>
                                                        <tr>
                                                            <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>{item.submissionType}</td>
                                                            <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button onClick={() => downloadDocs(item.id)}>Downland Document</button></td>
                                                            {role === "Admin" &&
                                                                <>
                                                                    <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button style={{ background: "#4682a9" }} onClick={() => UpdateGuide(item)}>Update</button></td>
                                                                    <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}><button style={{ background: "#e3050c" }} onClick={() => { setIsComplete(true); setDeleteId(item.id) }}>Delete</button></td>
                                                                </>
                                                            }
                                                            <td style={{ borderBottom: "1px solid #ddd", padding: "8px", textAlign: "center", cursor: "pointer" }} onClick={() => toggleRow(index)}>
                                                                {expandedRow === index ? (
                                                                    <i className="fa fa-minus" style={{ color: "#dc3545" }}></i>
                                                                ) : (
                                                                    <i className="fa fa-plus" style={{ color: "#28a745" }}></i>
                                                                )}
                                                            </td>
                                                        </tr>
                                                        {expandedRow === index && (
                                                            <tr>
                                                                <td colSpan="3" style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                                                                    <p style={{ whiteSpace: "pre-line" }}>{item.description}</p>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
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
                                    </>
                                ):status === "Rejected" && (<div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "8px" }}>
                                    <h5>Your FYP approval is rejected</h5>
                                </div>) }
                            </div>
                        }
                    </div>
                </div>
            </div>
            {/* View Modal */}
            {isAdding && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleClose}>&times;</span>
                        <div style={{ display: "flex", justifyContent:"center" }}><h5>Upload Guidlines</h5></div>
                        <div className="row">
                            <div style={{ paddingBottom:"8px" }}>
                                <label>Section Type</label>
                                <select className="form-control custom-select" value={selectedSection} onChange={(e) => handleSelectSection(e) } style={{ marginRight: '8px' }}>
                                    <option value="" disabled>Select Guide Type</option>
                                    <option value="Abstract">Abstract</option>
                                    <option value="Fyp1">Fyp1</option>
                                    <option value="Fyp2">Fyp2</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Supervisor">Supervisors</option>
                                </select>
                            </div>
                                {loadSelect ? <p>loading..</p>:
                            <div style={{ paddingBottom:"8px" }}>
                                <label>File Type</label>
                                <select className="form-control custom-select" value={selectedSubmitType} onChange={(e) => setSelectedSubmitType(e.target.value)} style={{ marginRight: '8px' }}>
                                    <option value="" disabled>Select File Type</option>
                                    {options.map((item, index) => (
                                        <option key={index} value={item}>{item}</option>
                                    ))}
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                                }
                            <div style={{ paddingBottom: "8px" }}>
                                <label>Upload:</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.txt"
                                    onChange={handleFileUpload}
                                />
                            </div>
                            {selectedSubmitType === "Other" &&
                                <div style={{ paddingBottom: "8px" }}>
                                    <label>Title</label>
                                    <input type="text" className="form-control custom-form" name="Title" placeholder="Title" value={descData.Title} onChange={handleDescChange} />
                                </div>}
                            <div style={{ paddingBottom: "8px" }}>
                                <label>Description</label>
                                <textarea type="text" className="form-control custom-form" name="Description" placeholder="Description" value={descData.Description} onChange={handleDescChange} />
                            </div>

                            <button onClick={handleGuidline}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
            { isComplete &&
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsComplete(false)}>&times;</span>
                        <div style={{ display: "flex", justifyContent: "center", paddingTop: "8px" }}>
                            <h5>Are you sure?</h5>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "8px" }}>
                            <h6>you won't be able to revert this</h6>
                        </div>
                        <button style={{ background: "#e3050c" }} onClick={DeleteGuide}>Delete</button>
                    </div>
                </div>
             }
        </Layout>
    );
}

export default FypGuidLines;
