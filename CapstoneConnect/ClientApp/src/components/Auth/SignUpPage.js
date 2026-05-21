import React from 'react'
import illustration from '../assets/Illustration.png';
import LoginForm from './LoginForm'
import '../CompStyle.css'
import  { useState } from 'react';
import FypRegistrationForm from './FypRegistrationForm';


export default function SignUpPage() {

    let imgstyle = {
        width: '70%',
        margin: '0 auto'

    }

    let mainbox = {
        height: '100vh'
    }

    const [formData, setFormData] = useState({
        teamName: '',
        email: '',
        teamLeadName: '',
        teamLeadRollNo: '',
        member1Name: '',
        member1RollNo: '',
        member2Name: '',
        member2RollNo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can handle form submission logic here, such as sending data to a server
        console.log(formData);
    };

    return (


        <div>
            <div className="container-fluid registerr" >
                <div className="row" style={mainbox}>
                    <div className="leftcolreg col-md-6 d-flex justify-content-center alignment-items-center flex-column" style={{ backgroundColor: '#4682A9', padding: '0 60px' }}>
                        <div className="formcontainerr text-start signup-form fypregform">
                            <h4 className='text-light' >Welcome to CaptsoneConnect</h4>
                            <h2 className='text-light' >Sign Up</h2>
                            <FypRegistrationForm/>
                            {/*<form onSubmit={handleSubmit}>*/}
                            {/*    <input type="text" name="teamName" value={formData.teamName} onChange={handleChange} placeholder="Team Name" required /><br /><br />*/}
                            {/*    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required /><br /><br />*/}
                            {/*    <input type="text" name="teamLeadName" value={formData.teamLeadName} onChange={handleChange} placeholder="Team Lead Name" required /><br /><br />*/}
                            {/*    <input type="text" name="teamLeadRollNo" value={formData.teamLeadRollNo} onChange={handleChange} placeholder="Team Lead Roll No" required /><br /><br />*/}
                            {/*    <input type="text" name="member1Name" value={formData.member1Name} onChange={handleChange} placeholder="Member 1 Name" required /><br /><br />*/}
                            {/*    <input type="text" name="member1RollNo" value={formData.member1RollNo} onChange={handleChange} placeholder="Member 1 Roll No" required /><br /><br />*/}
                            {/*    <input type="text" name="member2Name" value={formData.member2Name} onChange={handleChange} placeholder="Member 2 Name" required /><br /><br />*/}
                            {/*    <input type="text" name="member2RollNo" value={formData.member2RollNo} onChange={handleChange} placeholder="Member 2 Roll No" required /><br /><br />*/}
                            {/*    <input type="submit" value="Submit" />*/}
                            {/*</form>*/}

                        </div>
                    </div>
                    <div className="col-md-6 d-flex carousel-container justify-content-center alignment-items-center flex-column">
                        <img src={illustration} alt="" style={imgstyle} />
                    </div>
                </div>
            </div>

        </div>
    )
}
