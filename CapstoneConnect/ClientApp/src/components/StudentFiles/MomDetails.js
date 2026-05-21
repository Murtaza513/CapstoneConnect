
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Axios from '../../axios';
import Layout from '../Layout/Layout';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MomPdfDetail from './MomPdfDetail';
import { SuccessToaster } from '../Utils/Toaster';
import { ErrorToaster } from '../Utils/Toast';

const MomDetails = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [momData, setMomData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    /*console.log(project);*/

    const fetchMomData = async () => {
        try {
            setLoading(true);
            const response = await Axios.get(`usermanagement/getmom/${projectId}`);
            
            setMomData(response.data);
        } catch (error) {
            console.error('Error fetching MOM data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMomData();
    }, [projectId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMomData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const response = await Axios.post(`studentmanagement/updatemeetingminutes`, momData);
            if (response.status === 200) {
                SuccessToaster('MOM updated successfully');
                console.log('MOM updated successfully');
            } else {
                console.error('Failed to update MOM');
            }
            setIsEditing(false);
        } catch (error) {
            ErrorToaster("Somethin went wrong")
            console.error('Error updating MOM:', error);
        }
    };

    return (
        <Layout>
            {/*<NavBar />
            <MainSideBar />*/}
            <div className='mainmargins'>
                <div className="project-page">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom:"12px" }}>
                        
                        <PDFDownloadLink
                            document={<MomPdfDetail momData={momData} />}
                            fileName={`MOM_Details_${momData?.meetingNumber}.pdf`}
                        >
                            {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
                        </PDFDownloadLink>
                    </div>
                    {loading ? <div style={{ display: "flex", justifyContent: "center", width: "100%", paddingTop: "18px" }}>
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div></div> :
                        <div className="project-info">
                            <h2>MOM Details</h2>
                            <p>
                                <strong>Meeting Number:</strong> {isEditing ? <input type="text" name="meetingNumber" value={momData.meetingNumber} onChange={handleChange} disabled /> : momData.meetingNumber}
                            </p>
                            <p>
                                <strong>Date:</strong> {isEditing ? <input type="date" name="date" value={new Date(momData.date).toISOString().substr(0, 10)} onChange={handleChange} /> : new Date(momData.date).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Location:</strong> {isEditing ? <input type="text" name="location" value={momData.location} onChange={handleChange} /> : momData.location}
                            </p>
                            <p>
                                <strong>List of Participants:</strong> {isEditing ? <input type="text" name="listOfParticipants" value={momData.listOfParticipants} onChange={handleChange} /> : momData.listOfParticipants}
                            </p>
                            <p>
                                <strong>Agenda:</strong> {isEditing ? <input type="text" name="agenda" value={momData.agenda} onChange={handleChange} /> : momData.agenda}
                            </p>
                            <p>
                                <strong>Description:</strong> {isEditing ? <input type="text" name="description" value={momData.description} onChange={handleChange} /> : momData.description}
                            </p>
                        </div>
                    }
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            {isEditing ? (
                                <button onClick={handleSave}>Save</button>
                            ) : (
                                <button onClick={handleEdit}>Edit</button>
                            )}
                        </div>
                        <button onClick={() => navigate(-1)}>Back</button>
                    </div>
                </div>
            </div>
        </Layout>

    );
};

export default MomDetails;
