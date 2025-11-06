import React from "react";
import { useAuth } from "../Context/AuthContext";
import {
    BarChart3,
    UserCheck,
    FileText,
    Shield,
    AlertCircle,
} from "lucide-react";
import Card from "../Component/Card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

export default function Dashboard() {
    const { user } = useAuth();

    // Sample analytics data
    const data = [
        { month: "Jan", theft: 12, assault: 8, fraud: 6 },
        { month: "Feb", theft: 9, assault: 12, fraud: 4 },
        { month: "Mar", theft: 15, assault: 10, fraud: 8 },
        { month: "Apr", theft: 8, assault: 7, fraud: 5 },
        { month: "May", theft: 14, assault: 11, fraud: 9 },
    ];

    return (
        <div className="min-h-screen p-6 bg-linear-to-br from-blue-950 via-blue-900 to-blue-800 text-white rounded-xl shadow-inner">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome,{" "}
                    <span className="text-blue-300 capitalize">{user?.username}</span>
                </h1>
                <p className="text-blue-200 mt-1 text-sm opacity-80">
                    {user?.role === "admin"
                        ? "You have full administrative access."
                        : "You have restricted access as a Police Officer."}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card
                    title="Total Crimes"
                    value="128"
                    icon={<AlertCircle size={28} />}
                    color="from-red-400 to-red-600"
                />
                <Card
                    title="Active Officers"
                    value="52"
                    icon={<Shield size={28} />}
                    color="from-blue-400 to-blue-600"
                />
                <Card
                    title="Registered Suspects"
                    value="87"
                    icon={<UserCheck size={28} />}
                    color="from-yellow-400 to-yellow-600"
                />
                <Card
                    title="Filed FIRs"
                    value="64"
                    icon={<FileText size={28} />}
                    color="from-green-400 to-green-600"
                />
            </div>

            {/* Analytics Chart */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-blue-100 mb-4 flex items-center gap-2">
                    <BarChart3 size={22} /> Crime Statistics (Monthly)
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" opacity={0.2} />
                        <XAxis dataKey="month" stroke="#cbd5e1" />
                        <YAxis stroke="#cbd5e1" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1e3a8a",
                                borderRadius: "10px",
                                color: "white",
                            }}
                        />
                        <Legend />
                        <Bar dataKey="theft" fill="#3b82f6" />
                        <Bar dataKey="assault" fill="#ef4444" />
                        <Bar dataKey="fraud" fill="#facc15" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Recent Activities */}
            <div className="mt-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-blue-100 mb-3">
                    Recent Activities
                </h2>
                <ul className="space-y-2 text-blue-100 text-sm">
                    <li>🚔 Case #C-145 assigned to Officer Rahul Singh</li>
                    <li>📝 FIR #F-211 filed for theft in Sector 9</li>
                    <li>🧾 Suspect record updated — Ramesh Kumar</li>
                    <li>✅ Case #C-110 marked as closed</li>
                </ul>
            </div>
        </div>
    );
}
