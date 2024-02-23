import illustration from './assets/Illustration.png';
import React from 'react'
import LoginForm from './LoginForm'
import './CompStyle.css'

export default function LoginPage() {

    let imgstyle = {
        width: '70%',
        margin: '0 auto'

    }

    let mainbox = {
        height: '100vh'
    }


    return (
        <div>
           
            <div className="container-fluid" >
                <div className="row" style={mainbox}>
                    <div className="col-6 d-flex justify-content-center alignment-items-center flex-column" style={{ backgroundColor: '#4682A9', padding: '0 100px' }}>
                        <div className="formcontainerr text-start">
                            <h4 className='text-light' >Welcome to CaptsoneConnect</h4>
                            <h2 className='text-light' >Sign in</h2>
                            <LoginForm/>
                            
                        </div>
                    </div>
                    <div className="col-6 d-flex justify-content-center alignment-items-center flex-column">
                        <img src={illustration} alt="" style={imgstyle} />
                    </div>
                </div>
            </div>
            
        </div>
    )
}
