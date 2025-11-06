import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../Context/AuthContext";

export default function Layout() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const { user } = useAuth();

    return (
        <div className="flex h-screen overflow-hidden bg-linear-to-br from-blue-50 via-blue-100 to-white">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={setSidebarOpen}
                role={user?.role}
            />

            {/* Main Content */}
            <div className="flex flex-col flex-1 transition-all duration-300">
                {/* Top Navbar */}
                <Navbar toggleSidebar={toggleSidebar} />

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6 text-gray-800 bg-transparent">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
