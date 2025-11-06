import React from "react";

export default function Card({ title, value, icon, color = "from-blue-400 to-blue-600" }) {
    return (
        <div className={`bg-linear-to-br ${color} p-5 rounded-2xl shadow-lg flex items-center justify-between transform transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-900/40`}>
            <div>
                <h3 className="text-sm text-blue-100 uppercase tracking-wide font-semibold">
                    {title}
                </h3>
                <p className="text-3xl font-bold mt-1">{value}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full shadow-inner text-white">
                {icon}
            </div>
        </div>
    );
}
