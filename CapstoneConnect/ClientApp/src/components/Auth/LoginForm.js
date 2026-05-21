import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import useAuth from '../../context/useAuth';
import { ErrorToaster, SuccessToaster } from '../Utils/Toaster';
import { BASE_URL } from '../Utils/Config';
export default function LoginForm() {
    const [Id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [redirectStudent, setRedirectStudent] = useState(false);
    const [redirectAdmin, setRedirectAdmin] = useState(false);
    const [redirectSupervisor, setRedirectSupervisor] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [redirectFypGroup, setRedirectFypGroup] = useState(false);
    const [idError, setIdError] = useState(null);
    const [passError, setPassError] = useState(null);

    const navigate = useNavigate();
    const { userLogin, userLogout } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!Id) {
            setIdError('Please fill Id');
            return;
        }
        if (!Id || !password) {
            setPassError('Please fill Password');
            return;
        }
        try {
            setIsLoading(true)
            const response = await fetch(`${BASE_URL}/account/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Id, password, rememberMe })
            });
            const data = await response.json();
            
            if (data.status === 401) {
                ErrorToaster("Invalid Email or Password")
            }
            if (response.ok) {
                userLogin(data)
                if (data.role === "Student") {
                    setRedirectStudent(false)
                    ErrorToaster("User Is Not Valid")
                    userLogout()
                }
                if (data.role === "Admin") {
                    setRedirectAdmin(true)
                    SuccessToaster("Login Successful")
                }
                if (data.role === "Supervisor") {
                    setRedirectSupervisor(true)
                    SuccessToaster("Login Successful")
                }
                if (data.role === "FypGroup") {
                    setRedirectFypGroup(true);
                SuccessToaster("Login Successful")
                }

            }
        } catch (error) {
            ErrorToaster("Login Failed")
            console.error('An error occurred', error);
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        /*if (redirectStudent) {
            console.log("In student")
            navigate("/StudentDashboard");
        }*/
        if (redirectAdmin) {
            console.log("In Admin")
            navigate("/AdminCalender");
        }
        if (redirectSupervisor) {
            console.log("In Supervisor")
            navigate("/SupervisorDashboard");
        }
        if (redirectFypGroup) {
            console.log("FYP")
            navigate("/StudentDashboard");
        }

    }, [ redirectAdmin, redirectSupervisor, redirectFypGroup]);

    //if (redirectStudent) {
    //    navigate("/StudentDashboard");
    //}
    //if (redirectAdmin) {
    //    //Add admin Logic
    //    //navigate("/StudentDashboard");
    //}
    //if (redirectSupervisor) {
    //    navigate("/SupervisorDashboard");
    //}

    return (
        <div className='loginform'>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="exampleInputId1" className="form-label">Enter your username or Id address</label>
                    {idError && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{idError}</div>}
                    <input
                        type="text"
                        className="form-control"
                        id="exampleInputId1"
                        aria-describedby="IdHelp"
                        placeholder='Username or Id address'
                        value={Id}
                        onChange={(e) => { setId(e.target.value); setIdError(null) }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Enter your Password</label>
                    {passError && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{passError}</div>}
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => {setPassword(e.target.value);setPassError(null)}}
                    />
                </div>
                <button
                    type="submit"
                    className={`signInBtn ${isLoading ? 'disabled' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
                <Link to='/SignUpPage' className='signUpBtn'><li>Register Now</li></Link>
                {/*<button className='signUpBtn'>Register Now</button>*/}
            </form>
        </div>
    );
}
