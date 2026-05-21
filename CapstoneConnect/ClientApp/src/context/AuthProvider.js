import React from "react";
import AuthContext from "../context/AuthContext";
import useProvideAuth from "./useProvideAuth";

const AuthProvider = ({ children }) => {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
