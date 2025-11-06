import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../Api/Api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            api.defaults.headers.Authorization = `Bearer ${token}`;
        } else {
            localStorage.removeItem("token");
            delete api.defaults.headers.Authorization;
        }

        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [token, user]);

    const login = async (username, password) => {
        try {
            const res = await api.post("/auth/login", { username, password });
            setToken(res.data.token);
            setUser(res.data.user);
            return { ok: true };
        } catch (err) {
            return { ok: false, error: err.response?.data?.error || "Login failed" };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
