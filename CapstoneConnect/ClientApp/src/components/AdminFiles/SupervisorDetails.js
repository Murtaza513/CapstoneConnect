import React, { Fragment, useState } from 'react';
import NavBar from '../Layout/NavBar'
import AdminSideBar from './AdminSideBar';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuth from '../../context/useAuth';
import Layout from '../Layout/Layout';
import { ErrorToaster, SuccessToaster } from '../Utils/Toaster';
import Axios from '../../axios';

const SupervisorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false);
    const [isRankEditing, setIsRankEditing] = useState(false);
    const { role } = useAuth();
    const [supervisor, setSupervisor] = useState({
        id: '',
        username: '',
        email: '',
        phoneNumber: '',
        department: '',
        projectsSupervised: '',
        avgGrade: '',
        avgRank: '',
        rank: '',
        ongoingProjects: []
    });

    useEffect(() => {
        const fetchSupervisors = async () => {
            try {
                setLoading(true)
                const response = await Axios.get(`UserManagement/GetSupervisor/${id}`);
                if (response.status === 200) {
                    const data = response.data;
                    setSupervisor({
                        id: data.id,
                        username: data.username,
                        email: data.email,
                        phoneNumber: data.phoneNumber,
                        department: data.department,
                        projectsSupervised: data.projectsSupervised,
                        avgGrade: data.avgGrade,
                        avgRank: data.avgRank,
                        rank: data.adminRank,
                        ongoingProjects: data.onGoingProject
                    });
                } else {
                    console.log(response.data);
                }
            } catch (error) {
                console.error('Error fetching supervisors:', error);
            } finally { setLoading(false) }
        };

        fetchSupervisors();
    }, [id]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const response = await Axios.put(`Admin/UpdateSupervisor/${id}`, supervisor);
            if (response.status === 200) {
                SuccessToaster("Rank updated successfully")
                console.log('Supervisor updated successfully');
            } else {
                console.error('Failed to update supervisor');
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating supervisor:', error);
        }
    };


    const handleRankEdit =async () => {
        
        try {
            const response = await Axios.put(`Admin/UpdateSupervisor/${id}`,
                { Id: id, AdminRank: supervisor.rank });
            if (response.status === 200) {
                SuccessToaster("Rank updated successfully")
                console.log('Rank updated successfully');
            } else {
                console.error('Failed to update supervisor');
            }
            setIsRankEditing(false)
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating supervisor:', error);
        }

    };

    const handleRankSave = () => {
        setIsRankEditing(false);
        // Add functionality to save the edited rank (e.g., send to server)
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSupervisor({
            ...supervisor,
            [name]: value
        });
    };

    const handleRemoveProject = (id) => {
        const newProjects = supervisor.ongoingProjects.filter(project => project.id !== id);
        setSupervisor({
            ...supervisor,
            ongoingProjects: newProjects
        });
    };
    return (
        <Layout>
            {/*<NavBar />
            <MainSideBar />*/}
            <div className='mainmargins'>
                <div className="project-page AdmSupDetails">
                    
                    {loading ? (<div style={{ display: "flex", justifyContent: "center", width: "100%", paddingTop: "18px" }}>
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div></div>):( 
                    <div className="project-info">
                        <h2>Supervisor Details</h2>
                        <p><strong>Id:</strong> {isEditing ? <input type="text" name="id" value={supervisor.id} onChange={handleChange} disabled /> : supervisor.id}</p>
                        <p><strong>Name:</strong> {isEditing ? <input type="text" name="username" value={supervisor.username} onChange={handleChange} /> : supervisor.username}</p>
                        <p><strong>Email:</strong> {isEditing ? <input type="text" name="email" value={supervisor.email} onChange={handleChange} /> : supervisor.email}</p>
                        <p><strong>phoneNumber:</strong> {isEditing ? <input type="text" name="phoneNumber" value={supervisor.phoneNumber} onChange={handleChange} /> : supervisor.phoneNumber}</p>
                        <p><strong>Department:</strong> {isEditing ? <input type="text" name="department" value={supervisor.department} onChange={handleChange} /> : supervisor.department}</p>
                        <p><strong>No Of Project Supervised:</strong> {supervisor.projectsSupervised}</p>
                        <p><strong>Average Grading:</strong> {supervisor.avgGrade}</p>
                        <p><strong>Average Rating:</strong> {supervisor.avgRank}</p>
                        <p><strong>Rank:</strong> {isRankEditing ? <input type="text" name="rank" value={supervisor.rank} onChange={handleChange} /> : supervisor.rank}</p>
                        <p><strong>On Going Projects:</strong></p>
                        {Object.keys(supervisor.ongoingProjects).length === 0 ? (
                            <p>No ongoing projects</p>
                        ) : (
                            <ul>
                                {Object.keys(supervisor.ongoingProjects).map((projectId, index) => (
                                    <li key={index}>
                                        {isEditing ? (
                                            <>
                                                {supervisor.ongoingProjects[projectId]} : {projectId}
                                            </>
                                        ) : (
                                            <>
                                                <strong>{supervisor.ongoingProjects[projectId]}</strong> : {projectId}
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}

                        </div>)}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="supervisorBtns">
                        {/*{isEditing ?
                            <div>
                                <button onClick={handleSave}>Save</button>
                            </div>
                            :
                            <div>
                                <button onClick={handleEdit}>Edit</button>
                                <button onClick={handleRankEdit}>{isRankEditing ? 'Save Rank' : 'Give Rank'}</button>
                            </div>
                        }
                        {isRankEditing &&
                            <div>
                                <button onClick={handleRankSave}>Cancel</button>
                            </div>
                        }*/}
                        
                            {role === "Admin" &&
                                <Fragment>
                                    {isEditing ?
                                        <div>
                                            <button onClick={handleSave}>Save</button>
                                        </div>
                                        :
                                        <div>
                                            <button onClick={handleEdit}>Edit</button>
                                            <button onClick={() => {
                                                if (isRankEditing) {
                                                    handleRankEdit();
                                                } else {
                                                    setIsRankEditing(true);
                                                }
                                            }}>
                                                {isRankEditing ? 'Save Rank' : 'Give Rank'}
                                            </button>
                                        </div>}
                        </Fragment>
                        }
                        </div>
                        <button onClick={()=>navigate(-1) }>Back</button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SupervisorDetails;
