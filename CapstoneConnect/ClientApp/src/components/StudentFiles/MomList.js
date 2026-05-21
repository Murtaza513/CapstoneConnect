import React, { useState, useEffect } from 'react';
import Layout from "../Layout/Layout";
import Axios from '../../axios';
import Pagination from '../Utils/Pagination';
import { Link } from 'react-router-dom'
import { PDFDownloadLink } from '@react-pdf/renderer';
import MomPdf from './MomPdf';
import TagsInput from './TagsInput';
import { ErrorToaster, SuccessToaster } from '../Utils/Toast';
import useAuth from '../../context/useAuth';
import moment from "moment";

const MomList = () => {
    const { userId } = useAuth()
    const [searchQuery, setSearchQuery] = useState("");
    const [momData, setMomData] = useState([]);
    const [giveStatus, setGiveStatus] = useState("")
    const [loading, setLoading] = useState(false)
    const [btnLoading, setBtnLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [minutesErr, setMinutesErr] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); 

    const [isOpen, setIsOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const deleteMom = async () => {
        try {
            const response = await Axios.post(`studentmanagement/deletemeetingminutes/${deleteId}`);
            if (response.status === 200) {
                SuccessToaster('MOM deleted successfully');
                setIsOpen(false);
                fetchMom()
            } else {
                console.error('Failed to delete MOM');
            }
        } catch (error) {
            ErrorToaster("Error deleting MOM")
            console.error('Error deleting MOM:', error);
        } finally {
            setDeleteId(null);
        }
    };

    const [minutesData, setMinutesData] = useState({
        Agenda: '',
        Description: '',
        Date: '',
        Participants: []
    });
    
    const handleMinuteChange = (e) => {
        setMinutesErr(null)
        setMinutesData({
            ...minutesData,
            [e.target.name]: e.target.value
        });
    };

    const addTag = (tag) => {
        if (minutesData.Participants) {
            let newTag = [...minutesData.Participants, tag]
            setMinutesData({ ...minutesData, Participants: newTag });
        }
        else {
            console.log("les Tag-> ")
            setMinutesData({ ...minutesData, Participants: [tag] });
        }
    };

    const removeTag = (index) => {
        setMinutesData({ ...minutesData, Participants: minutesData?.Participants?.filter((_, i) => i !== index) });
    };

    const handleMinutes = async (e) => {
        e.preventDefault()
        const data = {
            Date: minutesData.Date,
            Location: giveStatus,
            ListOfParticipants: minutesData.Participants.join(', '),
            FypId: userId,
            Agenda: minutesData.Agenda,
            Description: minutesData.Description,
        }
        
        if (!giveStatus || !minutesData.Date || !minutesData.Participants || !minutesData.Agenda || !minutesData.Description) {
            setMinutesErr("Select and fill feedback status")
            console.log("if is true")
            return
        }
        try {
            setBtnLoading(true)
            const response = await Axios.post("studentmanagement/addmeetingminutes", data)
            
            if (response.status === 200) {
                SuccessToaster("Minutes Uploaded")
                console.log(response)
                setMinutesData({
                    Agenda: '',
                    Description: '',
                    Date: '',
                    Participants: []
                })
                setIsAdding(false)
            }
        }
        catch (err) {
            ErrorToaster("Something Went Wrong")
        }
        finally {
            fetchMom()
            setBtnLoading(false)
        }
    }

    const fetchMom = async () => {
        try {
            setLoading(true)
            const response = await Axios.get(`usermanagement/getfortnightlysheetfypgrp/${userId}`);
            setMomData(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false)
        }
    };

    const formattedProjects = momData.map(data => ({
        id: data.id,
        date: data.date, 
        agenda: data.agenda,
        attendedBy: data.listOfParticipants.split(',').slice(0, 2).map(participant => participant.trim()),
    }));
    
    useEffect(() => {
        fetchMom();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredProjects = momData?.filter(project => {
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
            {/*<NavBar />
            <MainSideBar />*/}
            <div className='mainmargins'>
                <div className="headingContainer">
                    <div className="row">
                        <h2>Fortnightly Sheet</h2>
                    </div>
                    <div>
                        <div className="prevProjectMain">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ width: "25%", paddingTop: "12px", paddingBottom: "26px" }}>
                                    <input type="text" placeholder="Search by project name..."
                                        value={searchQuery} onChange={handleSearchChange} />
                                </div>
                                <div >
                                    <button style={{ marginRight: "10px" }} onClick={() => setIsAdding(true)}>Add Minutes</button>
                                    <PDFDownloadLink document={<MomPdf projects={formattedProjects} />} fileName="fortnightly_sheet.pdf">
                                    {({ loading }) => (
                                        <button >
                                            {loading ? 'Generating PDF...' : 'Download PDF'}
                                        </button>
                                    )}
                                </PDFDownloadLink>
                                </div>
                            </div>
                            {loading ? (
                                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                    <div className="spinner-border text-secondary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div></div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="minimalist-table">
                                        <thead>
                                            <tr>
                                                <th>Meeting Number</th>
                                                <th>Date</th>
                                                <th>Agenda</th>
                                                <th>Attended By</th>
                                                <th></th>
                                                <th>View</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentProjects?.map(project => (
                                                <tr key={project.id}>
                                                    <td>{project.meetingNumber}</td>
                                                    <td>{moment(project.date).format('MM/DD/YYYY')}</td>
                                                    <td>{project.agenda}</td>
                                                    <td>{project.listOfParticipants}</td>
                                                    <td></td>
                                                    <td>
                                                        <Link to={`/momDetail/${project.id}`} state={{ project }} className="view-link">
                                                            <button class="action-button">View</button>
                                                        </Link>
                                                        <button
                                                            style={{ background: "#e3050c", marginLeft: "8px" }}
                                                            onClick={() => { setIsOpen(true); setDeleteId(project.id); }}
                                                        >
                                                            Delete
                                                        </button>
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
                {isAdding && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => {
                                setIsAdding(false); setMinutesData({ Agenda: '', Description: '', Date: '', Participants: [] })}
                                }>&times;</span>
                            <h6>Add MOM</h6>
                            <input style={{ width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box"
                            }} type="date" className="form-control custom-form" name="Date" placeholder="Date" value={minutesData.Date} onChange={(e) => handleMinuteChange(e)} />
                            <input type="text" className="form-control custom-form" name="Agenda" placeholder="Agenda" value={minutesData.Agenda} onChange={(e)=>handleMinuteChange(e)} />
                            <div style={{ paddingBottom: "4px" }}>
                                <label>Add Participants</label>
                                <TagsInput tags={minutesData?.Participants} addTag={addTag} removeTags={removeTag} />
                            </div>
                            <textarea value={minutesData.Description} onChange={(e) => handleMinuteChange(e)} type="text" className="form-control" name="Description"
                                placeholder="Enter your description here" rows="4" cols="50" />
                            <select className="form-control custom-select" value={giveStatus || ''} onChange={(e) => { setGiveStatus(e.target.value); setMinutesErr(null) }}>
                                <option value="" disabled hidden>Select meeting location</option>
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                            </select>
                            {minutesErr && <div className="error-message" style={{ color: 'red', marginBottom: '8px', fontSize: "13px" }}>{minutesErr}</div>}
                            
                            <button onClick={handleMinutes}
                                className={`addSupervisorButton ${btnLoading ? 'disabled' : ''}`}
                                disabled={btnLoading}
                            >
                                {btnLoading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                )}
                {isOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setIsOpen(false)}>&times;</span>
                            <div style={{ display: "flex", justifyContent: "center", paddingTop: "8px" }}>
                                <h5>Are you sure?</h5>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", paddingBottom: "8px" }}>
                                <h6>You won't be able to revert this.</h6>
                            </div>
                            <button style={{ background: "#e3050c" }} onClick={deleteMom}>Delete</button>
                            <button style={{ marginLeft: "8px" }} onClick={() => setIsOpen(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );

}

export default MomList;