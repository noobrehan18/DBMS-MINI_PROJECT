import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Home, Shield, Users, FileText, Briefcase, AlertCircle } from "lucide-react";

export default function Sidebar({ isOpen, toggleSidebar, role }) {
    const { pathname } = useLocation();

    // Menu items filtered by role
    const navItems = [
        { name: "Dashboard", path: "/", icon: <Home />, roles: ["admin", "officer"] },
        { name: "Crimes", path: "/crimes", icon: <AlertCircle />, roles: ["admin", "officer"] },
        { name: "Officers", path: "/officers", icon: <Shield />, roles: ["admin"] },
        { name: "Suspects", path: "/suspects", icon: <Users />, roles: ["admin", "officer"] },
        { name: "Cases", path: "/cases", icon: <Briefcase />, roles: ["admin", "officer"] },
        { name: "FIRs", path: "/firs", icon: <FileText />, roles: ["admin", "officer"] },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black/30 lg:hidden transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={() => toggleSidebar(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed lg:static z-40 h-full w-64 bg-white/90 backdrop-blur-md border-r border-blue-100 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                <div className="p-6 border-b border-blue-100">
                    <h2 className="text-2xl font-bold text-blue-700 tracking-tight">
                        Police CRM
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {role === "admin" ? "Administrator" : "Officer"} Panel
                    </p>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems
                        .filter((item) => item.roles.includes(role))
                        .map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => toggleSidebar(false)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium ${pathname === item.path
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                                    }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                </nav>
            </aside>
        </>
    );
}
