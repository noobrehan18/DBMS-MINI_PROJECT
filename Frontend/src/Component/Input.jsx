import React from "react";

export default function Input({ label, type = "text", value, onChange, name, placeholder }) {
    return (
        <div className="flex flex-col">
            {label && <label className="text-sm text-gray-700 mb-1">{label}</label>}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="p-2 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
        </div>
    );
}
