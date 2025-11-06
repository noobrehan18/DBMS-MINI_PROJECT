import React from "react";
import { Menu } from "lucide-react";
import { useAuth } from "../Context/AuthContext";

export default function Navbar({ toggleSidebar }) {
    const { user, logout } = useAuth();

    return (
        <nav className="flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm px-6 py-3 border-b border-blue-100">
            {/* Left: Menu button for mobile */}
            <button
                onClick={toggleSidebar}
                className="text-blue-600 lg:hidden focus:outline-none"
            >
                <Menu size={24} />
            </button>

            {/* Center: Title */}
            <h1 className="text-lg font-semibold text-blue-700 tracking-wide">
                Police Crime Management System
            </h1>

            {/* Right: User Info */}
            <div className="flex items-center gap-4">
                {user && (
                    <>
                        <p className="text-sm text-gray-600 font-medium">
                            {user.username}{" "}
                            <span className="text-blue-500">({user.role})</span>
                        </p>
                        <button
                            onClick={logout}
                            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
