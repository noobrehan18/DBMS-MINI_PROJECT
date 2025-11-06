import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { ShieldCheck, UserCheck } from "lucide-react";

export default function Login() {
    const [role, setRole] = useState("admin");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(username, password);
        if (res.ok) navigate("/");
        else setError(res.error);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 via-blue-700 to-blue-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/polished-metal.png')] opacity-10"></div>

            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-10 w-[90%] max-w-md text-center">
                <div className="flex justify-center mb-5">
                    <div className="bg-blue-600 p-3 rounded-full shadow-md">
                        {role === "admin" ? (
                            <ShieldCheck className="text-white w-8 h-8" />
                        ) : (
                            <UserCheck className="text-white w-8 h-8" />
                        )}
                    </div>
                </div>

                <h2 className="text-3xl font-extrabold text-white mb-3">
                    {role === "admin" ? "Admin Login" : "Officer Login"}
                </h2>
                <p className="text-blue-100 mb-6 text-sm">
                    Secure access to the Police Crime Management System
                </p>

                <div className="relative w-full bg-white/10 border border-white/20 rounded-lg overflow-hidden mb-6">
                    <div
                        className={`absolute top-0 h-full w-1/2 bg-blue-600 rounded-lg transition-all duration-300 ${role === "admin" ? "left-0" : "left-1/2"
                            }`}
                    ></div>
                    <div className="relative z-10 flex">
                        <button
                            type="button"
                            onClick={() => setRole("admin")}
                            className={`w-1/2 py-2 flex items-center justify-center gap-2 text-sm font-semibold ${role === "admin"
                                ? "text-white"
                                : "text-blue-100 hover:text-blue-200"
                                }`}
                        >
                            <ShieldCheck size={18} /> Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("officer")}
                            className={`w-1/2 py-2 flex items-center justify-center gap-2 text-sm font-semibold ${role === "officer"
                                ? "text-white"
                                : "text-blue-100 hover:text-blue-200"
                                }`}
                        >
                            <UserCheck size={18} /> Officer
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="text-sm bg-red-500/20 text-red-200 py-2 mb-3 rounded">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder={`Enter ${role} username`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold shadow-lg transition"
                    >
                        {role === "admin" ? "Login as Admin" : "Login as Officer"}
                    </button>
                </form>

                <p className="mt-6 text-blue-100 text-sm opacity-70">
                    Hint: admin/admin123 or officer/officer123
                </p>
            </div>
        </div>
    );
}
