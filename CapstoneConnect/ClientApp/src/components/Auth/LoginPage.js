import React from 'react';
import LoginForm from '../Auth/LoginForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import illustration2 from '../assets/Illustration2.jpg';
import illustration3 from '../assets/Illustration3.png';
import illustration from '../assets/Illustration.png';
import '../CompStyle.css';
import Carousel from 'react-bootstrap/Carousel';

export default function LoginPage() {
    let imgstyle = {
        width: '100vw',
        height: '100vh',
        margin: '0 auto',
        objectFit: 'cover'
    };

    let mainbox = {
        height: '100vh'
    };

    return (
        <div>
            <div className="container-fluid">
                <div className="row" style={mainbox}>
                    <div className="leftcolreg col-md-6 d-flex justify-content-center alignment-items-center flex-column" style={{ backgroundColor: '#4682A9', padding: '0 60px' }}>
                        <div className="formcontainerr text-start">
                            <h4 className='text-light'>Welcome to CapstoneConnect</h4>
                            <h2 className='text-light'>Sign in</h2>
                            <LoginForm />
                        </div>
                    </div>
                    <div className="col-md-6 d-sm-flex d-none carousel-container justify-content-center alignment-items-center flex-column">
                        <Carousel interval={3000}>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={illustration}
                                    alt="First slide"
                                    style={imgstyle}
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={illustration2}
                                    alt="Second slide"
                                    style={imgstyle}
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={illustration3}
                                    alt="Third slide"
                                    style={imgstyle}
                                />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
}