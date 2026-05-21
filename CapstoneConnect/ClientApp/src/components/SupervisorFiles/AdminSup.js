import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import { Tooltip as ReactTooltip } from "react-tooltip";
import Layout from '../Layout/Layout';
import Axios from '../../axios';
import { ErrorToaster, SuccessToaster } from '../Utils/Toaster';
// Import CSS file for AdminSup component

function AdminSup() {
    const [supervisors, setSupervisors] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);
    const [newSupervisor, setNewSupervisor] = useState({
        id: '',
        username: '',
        email: '',
        phoneNumber: '',
        department: '',
        fypPreferences: ''
    });
    const { role, userId } = useAuth()
    const [loading, setLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState(null)

    const fetchSupervisors = async () => {
        try {
            setLoading(true)
            const response = await Axios.get('UserManagement/GetAllSupervisors');
            setSupervisors(response.data);
        } catch (error) {
            console.error('Error fetching supervisors:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchSupervisors();
    }, []);

    const handleAddSupervisor = async () => {
        console.log(newSupervisor);
        if (!newSupervisor.id || !newSupervisor.username || !newSupervisor.email || !newSupervisor.phoneNumber || !newSupervisor.department || !newSupervisor.fypPreferences) {
            setValidationErrors("Select and fill all fields")
            return
        } else {
            try {
                setBtnLoading(true)
                const response = await Axios.post('Admin/AddSupervisor', newSupervisor);
                fetchSupervisors();
                console.log("Supervisor added successfully", response);
                SuccessToaster("Supervisor added successfully");
                setIsAdding(false)
                setNewSupervisor({
                    id: '',
                    username: '',
                    email: '',
                    phoneNumber: '',
                    department: '',
                    fypPreferences: ''
                })
            } catch (error) {
                console.error('Error adding supervisor:', error);
                ErrorToaster(error.response.data);
            } finally {
                setBtnLoading(false)
            }
        }
    };


    const handleDelete = async () => {
        try {
            const response = await Axios.delete(`Admin/DeleteSupervisor/${deleteId}`);
            if (response.status === 200) {
                console.log("resp delete-> ", response);
                SuccessToaster(response.data.message)
                fetchSupervisors()
                setIsDelete(null)
            }
        }
        catch (error) {
            console.log("error is ", error)
            ErrorToaster(error.response.data)
        }
        
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSupervisor(prevState => ({
            ...prevState,
            [name]: value
        }));
        setValidationErrors(null)
    };

    return (
        <Layout>
            {/*<NavBar />
            <MainSideBar />*/}
            <div className='mainmargins'>
                <div className="supervisorMain AdmSup">
                    <div className="container AdminSupCont">
                        <div className="row">
                            <h2>Supervisors</h2>
                        </div>
                        <div className="super2 AdmSupRow2">
                            <div className="superCurrdDtails">
                                <p className="total_s">Total Supervisors : {supervisors.length}</p>
                            </div>
                            <div className="newSupAddBtn">
                                {role === "Admin" &&
                                    <button className="addButton" onClick={() => setIsAdding(true)}>
                                        Add New <i className="fas fa-plus"></i>
                                    </button>}
                            </div>
                        </div>
                        <div>
                            {loading ? (<div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                <div className="spinner-border text-secondary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div></div>) :
                                (
                                    <div className="row super3">
                                        {supervisors.map(supervisor => (
                                            <div className="col-sm-12 col-md-6 col-lg-4" key={supervisor.id}>
                                                <div className="card" >
                                                    {/*<div className="card-header"
                                                        style={{ display: userId === supervisor.id ? 'flex' : 'block', justifyContent: 'space-between', alignItems: 'center' }}
                                                    >*/}
                                                    
                                                    <div className="card-header" >
                                                        <div style={{ width: "60%" }}><h4>{supervisor.username}</h4></div>
                                                        {role === "Admin" ?
                                                            <div style={{ width: "40%" }}>
                                                                <Link data-tooltip-id="my-tooltip-1" to={`/supervisor/${supervisor.id}`} state={{ supervisor: supervisor }} className="viewButton">
                                                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                                                </Link>
                                                                <button data-tooltip-id="my-tooltip-2" onClick={() => { setIsDelete(true); setDeleteId(supervisor.id) }} className="deleteButton"><i class="fa-solid fa-trash-can"></i></button>
                                                            </div> :
                                                            <div style={{ width: "20%" }}>
                                                                <Link data-tooltip-id="my-tooltip-1" to={`/supervisor/${supervisor.id}`} state={{ supervisor: supervisor }} className="viewButton">
                                                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                                                </Link>
                                                            </div>
                                                    }
                                                    </div>
                                                    <div className="card-body">
                                                        <p><strong>ID:</strong> {supervisor.id}</p>
                                                        <p><strong>Email:</strong> {supervisor.email}</p>
                                                        <p><strong>Department:</strong> {supervisor.department}</p>
                                                        <p className="pref-paragraph"><strong>FypPreferences:</strong> {supervisor.fypPreferences}</p>
                                                    </div>
                                                </div>
                                                <ReactTooltip
                                                    id="my-tooltip-1"
                                                    place="bottom"
                                                    content="View"
                                                    variant="info"
                                                />
                                                <ReactTooltip
                                                    id="my-tooltip-2"
                                                    place="bottom"
                                                    content="Delete"
                                                    variant="error"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Add New Supervisor Form */}
            {isAdding && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsAdding(false)}>&times;</span>
                        <h2>Add New Supervisor</h2>
                        <form>
                            <label>ID:</label>
                            <input type="text" name="id" value={newSupervisor.id} onChange={handleChange} />
                            <label>Name:</label>
                            <input type="text" name="username" value={newSupervisor.username} onChange={handleChange} />
                            <label>Email:</label>
                            <input type="text" name="email" value={newSupervisor.email} onChange={handleChange} />
                            <label>Phone Number:</label>
                            <input type="text" name="phoneNumber" value={newSupervisor.phoneNumber} onChange={handleChange} />
                            <label>Department:</label>
                            <input type="text" name="department" value={newSupervisor.department} onChange={handleChange} />
                            <label>Fyp Preferences</label>
                            <textarea name="fypPreferences" value={newSupervisor.fypPreferences} onChange={handleChange}></textarea>
                            {validationErrors && <div className="error-message" style={{ color: 'red', marginBottom: '8px', fontSize: "13px" }}>{validationErrors}</div>}
                            {/*<button type="button" onClick={handleAddSupervisor} className="addSupervisorButton">Add Supervisor</button>*/}
                            <button
                                type="button"
                                onClick={handleAddSupervisor}
                                className={`addSupervisorButton ${btnLoading ? 'disabled' : ''}`}
                                disabled={btnLoading}
                            >
                                {btnLoading ? 'Supervisor Adding...' : 'Add Supervisor'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {isDelete &&
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsDelete(false)}>&times;</span>
                        <div style={{ display: "flex", justifyContent: "center", paddingTop: "8px" }}>
                            <h5>Are you sure?</h5>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "8px" }}>
                            <h6>you won't be able to revert this</h6>
                        </div>
                        <button style={{ background: "#e3050c" }} onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            }
        </Layout>
    );
}

export default AdminSup;
