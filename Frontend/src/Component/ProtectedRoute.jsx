import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { token, user } = useAuth();

    if (!token) return <Navigate to="/login" replace />;
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role))
        return <div className="p-6 text-center text-red-500">Access Denied</div>;

    return children;
}
