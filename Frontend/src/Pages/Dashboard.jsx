import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { BarChart3, UserCheck, FileText, Shield, AlertCircle } from "lucide-react";
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

                // Group crimes by type
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
        <div className="min-h-screen bg-blue-300 p-8">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
                    Welcome, <span className="text-blue-600 capitalize">{user?.username}</span>
                </h1>
                <p className="text-gray-600 mt-1">
                    {user?.role === "admin"
                        ? "You have full administrative access to manage system data."
                        : "You have limited access as an authorized officer."}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <SummaryCard
                    title="Total Crimes"
                    value={summary.crimes}
                    icon={<AlertCircle size={24} />}
                    color="blue"
                />
                <SummaryCard
                    title="Active Officers"
                    value={summary.officers}
                    icon={<Shield size={24} />}
                    color="indigo"
                />
                <SummaryCard
                    title="Registered Suspects"
                    value={summary.suspects}
                    icon={<UserCheck size={24} />}
                    color="amber"
                />
                <SummaryCard
                    title="Filed FIRs"
                    value={summary.firs}
                    icon={<FileText size={24} />}
                    color="emerald"
                />
            </div>

            {/* Analytics Chart */}
            <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 transition-all hover:shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart3 size={20} className="text-blue-600" />
                    Crime Statistics by Type
                </h2>

                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="type" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#f9fafb",
                                    borderRadius: "8px",
                                    border: "1px solid #e5e7eb",
                                }}
                                labelStyle={{ color: "#374151" }}
                            />
                            <Legend />
                            <Bar
                                dataKey="count"
                                fill="#3b82f6"
                                radius={[6, 6, 0, 0]}
                                barSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-500 text-center py-10">
                        No crime records found yet.
                    </p>
                )}
            </div>
        </div>
    );
}

/* ----------------------------- Helper Card ----------------------------- */
function SummaryCard({ title, value, icon, color }) {
    const colorMap = {
        blue: "bg-blue-50 text-blue-600",
        indigo: "bg-indigo-50 text-indigo-600",
        amber: "bg-amber-50 text-amber-600",
        emerald: "bg-emerald-50 text-emerald-600",
    };

    return (
        <div className="bg-white border border-blue-600 rounded-xl shadow-sm hover:shadow-md transition-all p-5 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-1">{value}</h2>
            </div>
            <div className={`p-3 rounded-full ${colorMap[color]} shadow-inner`}>
                {icon}
            </div>
        </div>
    );
}
