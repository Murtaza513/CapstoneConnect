import React, { useState } from "react";

const useProvideAuth = () => {
    const [user, setUser] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [status, setStatus] = useState(localStorage.getItem("status"));
    const [userId, setUserId] = useState(localStorage.getItem("userId"));
    const [title, setTitle] = useState(localStorage.getItem("title"));
    const [student, setStudent] = useState(localStorage.getItem("studentToken"));

    // *User
    const userLogin = (data) => {
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("status", data.status);
        localStorage.setItem("userId", data?.userName?.id);
        localStorage.setItem("title", data?.userName?.userName);
        setUser(data.token);
        setRole(data.role);
        setStatus(data.status)
        setUserId(data?.userName?.id)
        setTitle(data?.userName?.userName)
    };

    // *Logout
    const userLogout = async () => {
        setUser(null);
        setRole(null);
        setStatus(null);
        setUserId(null);
        setTitle(null);
        setStudent(null);
        localStorage.clear();
    };

    // *Verify Token
    const verifyToken = () => {
        const token = localStorage.getItem("token");
        setUser(token);
    };

    return {
        user,
        role,
        student,
        status,
        userId,
        title,
        userLogin,
        verifyToken,
        userLogout,
        setStudent
    };
};

export default useProvideAuth;
