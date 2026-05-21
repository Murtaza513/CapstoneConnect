import React, { Fragment, useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import './UserProfile.css';
import Axios from '../../axios';
import useAuth from '../../context/useAuth';
import { SuccessToaster } from '../Utils/Toaster';
import { ErrorToaster } from '../Utils/Toast';

const UserProfile = () => {
    const { userId, role } = useAuth();
    // Initial profile data
    const [loader, setLoader] = useState(false)
    const [user, setUser] = useState("");
    const fetchProfile = async () => {
        let url;
        switch (role) {
            case 'FypGroup':
                url = `studentmanagement/getfypprofile/${userId}`;
                break;
            case 'Supervisor':
                url = `supervisor/getsupervisorprofile/${userId}`;
                break;
            case 'Admin':
                url = `admin/getadminprofile/${userId}`;
                break;
            default:
                url = null;
        }
        setLoader(true)
        try {
            const response = await Axios.get(url);
            
            if (response.status === 200) {
                setUser(response.data)
            }
        }
        catch (err) {
            ErrorToaster("Network Error")
        }
        finally {
            setLoader(false)
        }
    }
    

    // Handle password change
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords({
            ...passwords,
            [name]: value,
        });
        setError('');
    };

    const updatePassword = async (e) => {
        e.preventDefault();

        // Check for empty fields
        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            setError('Please fill all fields.');
            return;
        }

        // Check if new password and confirm password match
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('New password and confirm password do not match.');
            return;
        }

        try {
            const response = await Axios.post(`account/changepassword`, {
                SupId: userId,
                CurrentPassword: passwords.currentPassword,
                NewPassword: passwords.newPassword,
                ConfirmPassword: passwords.confirmPassword,
            });

            if (response.status === 200) {
                // Clear error and show success message
                setError('');
                SuccessToaster('Password updated successfully');
                
            } else {
                console.error('Failed to update password');
                ErrorToaster('Incorrect Password');
            }
        } catch (error) {
            ErrorToaster('Incorrect Password');
            console.error('Error updating password:', error);
        }
    };
    useEffect(() => {
        fetchProfile()
    }, [])

    return (
        <Layout>
            <div className='mainmargins'>
                <div className="project-page">
                    {loader ? (<div style={{ display: "flex", justifyContent: "center", width: "100%", paddingTop: "18px" }}>
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div></div>) : (
                        <div className="project-info">
                            <h2>User Profile</h2>

                                {/* Profile Section */}
                            {role === "FypGroup" ?
                            <Fragment>
                            <p>Fyp ID: {user.fypId}</p>
                            <p>Fyp Name: {user.fypTitle}</p>
                            <p>Registered Email: {user.registeredEmail}</p>
                                <p>TeamLead: {user.teamLeadName}</p>
                            <p>TeamLead CGPA: {user.teamLeadCGPA}</p>
                            <p>Number of Members: {user.membersName?.length}</p>
                            <p>Team Members: {user?.membersName?.map((name, index) => (
                                <span key={index}>
                                    {name} (CGPA: {user.membersCGPA[index]})
                                    {index < user.membersName.length - 1 ? ', ' : ''}
                                </span>
                            ))}</p>
                            {/*<p>Supervisor: {user.supervisorName}</p>*/}
                            </Fragment> :
                            role === "Supervisor" ?
                            <Fragment>
                            <p>ID: {user.supervisorId}</p>
                            <p>Name: {user.supervisorName}</p>
                            <p>Registered Email: {user.registeredEmail}</p>
                            <p>Department: {user.department}</p>
                            <p>Preferences: {user.preferences}</p>
                            </Fragment>:
                            role === "Admin" ?
                            <Fragment>
                            <p>ID: {user.adminId}</p>
                            <p>Name: {user.adminUsername}</p>
                            <p>Registered Email: {user.adminEmail}</p>
                            </Fragment>: null
                        }

                            {/* Change Password Section */}
                                <form onSubmit={updatePassword}>
                                    <div className="change-password-section">
                                        <div style={{ width: "100%" }}>
                                            <h3>Change Password</h3>
                                        </div>
                                        <label>
                                            Current Password:
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={passwords.currentPassword}
                                                onChange={handlePasswordChange}
                                            />
                                        </label>
                                        <label>
                                            New Password:
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwords.newPassword}
                                                onChange={handlePasswordChange}
                                            />
                                        </label>
                                        <div style={{ width: "49%" }}>
                                            <label>
                                                Confirm New Password:
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={passwords.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                />
                                            </label>
                                        </div>
                                        {error && <p style={{ color: 'red' }}>{error}</p>}
                                        <div style={{ width: "100%" }}>
                                            <button type="submit">Change Password</button>
                                        </div>
                                    </div>
                                </form>
                        </div>)}
                </div>
            </div>
        </Layout>
    );
};

export default UserProfile;
