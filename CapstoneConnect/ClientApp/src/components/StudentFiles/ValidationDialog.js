import React, { useState } from 'react';
import { ErrorToaster, SuccessToaster } from '../Utils/Toast';
import Axios from '../../axios';
import axios from '../../../../../node_modules/axios/index';
import { BASE_URL } from '../Utils/Config';

const ValidationDialog = ({ userId, setIsAuth, setFormValue, setAuthToken, setStudentId }) => {
    const [authdData, setAuthData] = useState({
        Id: '',
        Password: ''
    })
    const [idError, setIdError] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);

    const handleAuthChange = (e) => {
        const { name, value } = e.target;

        if (name === 'Id') {
            const idRegex = /^c(?=.*[a-zA-Z])(?=.*\d).+$/;
            if (idRegex.test(value)) {
                setIdError('');
            } else {
                setIdError('Please must enter valid student ID.');
            }
        }
        setAuthData({
            ...authdData,
            [e.target.name]: e.target.value
        });
    }

    const handleAuth = async (e) => {
        e.preventDefault();
        let submitData = {
            FypId: userId,
            Id: authdData.Id,
            Password: authdData.Password,
        }
        try {
            setBtnLoading(true)
            const response = await axios.post(`${BASE_URL}/account/verifystudent`, submitData);
            console.log("response-> ", response)
            if (response.status === 200) {
                localStorage.setItem("studentToken", response.data.token)
                localStorage.setItem("studentId", response.data.userName.id)
                setAuthToken(response.data.token)
                setStudentId(response.data.userName.id)
                SuccessToaster("Authenticated")
                setIsAuth(true)
                setFormValue("")

            } else if (response.status === 401) {
                ErrorToaster("Unauhtorized User")
            }
        }
        catch (error) {
            console.error('An error occurred', error);
            ErrorToaster(error?.response.data.title)
        } finally { setBtnLoading(false) }
    }


    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={() => { setIsAuth(false); setAuthData({ Id: "", Password: "" }); setFormValue("") }}>&times;</span>
                <h6>Please Enter Your Id Password</h6>
                <div className="row">
                    <div >
                        <label>ID</label>
                        <input type="text" className="form-control" name="Id" placeholder="Id" value={authdData.Id} onChange={handleAuthChange} />
                        {idError && <p style={{ color: 'red' }}>{idError}</p>}
                    </div>
                    <div >
                        <label>Password</label>
                        <input type="password" className="form-control" name="Password" placeholder="Password" value={authdData.Password} onChange={handleAuthChange} />
                    </div>
                    <button onClick={handleAuth}
                        className={`addSupervisorButton ${btnLoading ? 'disabled' : ''}`}
                        disabled={btnLoading}
                    >
                        {btnLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ValidationDialog;
