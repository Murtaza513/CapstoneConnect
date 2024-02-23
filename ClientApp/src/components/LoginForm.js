import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://localhost:44335/account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                // Handle successful login (e.g., store token in localStorage, redirect user)
                console.log('Login successful', data);
            } else {
                // Handle login error (e.g., display error message)
                console.error('Login failed');
            }
        } catch (error) {
            console.error('An error occurred', error);
        }
    };

    return (
        <div className='loginform'>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Enter your username or email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder='Username or email address'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Enter your Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className='signInBtn'>Sign in</button>
            </form>
        </div>
    );
}
