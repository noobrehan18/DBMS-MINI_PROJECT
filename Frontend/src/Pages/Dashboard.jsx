import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { BarChart3, UserCheck, FileText, Shield, AlertCircle } from "lucide-react";
import Card from "../Component/Card";
import api from "../Api/Api";
import { API_ENDPOINTS } from "../Utils/Constants";
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
    const [summary, setSummary] = useState({
        crimes: 0,
        officers: 0,
        suspects: 0,
        firs: 0,
    });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const [crimes, officers, suspects, firs] = await Promise.all([
                    api.get(API_ENDPOINTS.crimes),
                    api.get(API_ENDPOINTS.officers),
                    api.get(API_ENDPOINTS.suspects),
                    api.get(API_ENDPOINTS.firs),
                ]);

                setSummary({
                    crimes: crimes.data.length,
                    officers: officers.data.length,
                    suspects: suspects.data.length,
                    firs: firs.data.length,
                });

                // ✅ Prepare chart data grouped by crime type
                const crimeCounts = crimes.data.reduce((acc, c) => {
                    acc[c.CRIME_TYPE] = (acc[c.CRIME_TYPE] || 0) + 1;
                    return acc;
                }, {});
                const chartArr = Object.entries(crimeCounts).map(([type, count]) => ({
                    type,
                    count,
                }));
                setChartData(chartArr);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="min-h-screen p-6 bg-linear-to-br from-blue-950 via-blue-900 to-blue-800 text-white rounded-xl shadow-inner">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome, <span className="text-blue-300 capitalize">{user?.username}</span>
                </h1>
                <p className="text-blue-200 mt-1 text-sm opacity-80">
                    {user?.role === "admin"
                        ? "You have full administrative access."
                        : "You have restricted access as a Police Officer."}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card title="Total Crimes" value={summary.crimes} icon={<AlertCircle size={28} />} color="from-red-400 to-red-600" />
                <Card title="Active Officers" value={summary.officers} icon={<Shield size={28} />} color="from-blue-400 to-blue-600" />
                <Card title="Registered Suspects" value={summary.suspects} icon={<UserCheck size={28} />} color="from-yellow-400 to-yellow-600" />
                <Card title="Filed FIRs" value={summary.firs} icon={<FileText size={28} />} color="from-green-400 to-green-600" />
            </div>

            {/* Analytics Chart */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-blue-100 mb-4 flex items-center gap-2">
                    <BarChart3 size={22} /> Crime Statistics by Type
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" opacity={0.2} />
                        <XAxis dataKey="type" stroke="#cbd5e1" />
                        <YAxis stroke="#cbd5e1" />
                        <Tooltip contentStyle={{ backgroundColor: "#1e3a8a", color: "white" }} />
                        <Legend />
                        <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
