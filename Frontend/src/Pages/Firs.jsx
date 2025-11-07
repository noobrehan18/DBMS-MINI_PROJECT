import React, { useState } from "react";
import Input from "../Component/Input";
import Loader from "../Component/Loader";
import Table from "../Component/Table";
import api from "../Api/Api";
import useFetch from "../Hooks/UseFetch";
import { API_ENDPOINTS } from "../Utils/Constants";

export default function Firs() {
    const { data: firs, loading, setData, refetch } = useFetch(API_ENDPOINTS.firs);
    const [form, setForm] = useState({
        COMPLAINT_ID: "",
        FIR_DATE: "",
        CRIME_TYPE: "",
        CRIME_LOCATION: "",
        DESCRIPTION: "",
        COMPLAINANT_NAME: "",
        COMPLAINANT_CONTACT: "",
    });
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Update existing FIR
                await api.put(`${API_ENDPOINTS.firs}/${editingId}`, form);
                alert("✅ FIR updated successfully!");
            } else {
                // Add new FIR
                await api.post(API_ENDPOINTS.firs, form);
                alert("✅ FIR added successfully!");
            }

            // ✅ Always refetch latest data from DB
            await refetch();

            // Reset form
            setForm({
                COMPLAINT_ID: "",
                FIR_DATE: "",
                CRIME_TYPE: "",
                CRIME_LOCATION: "",
                DESCRIPTION: "",
                COMPLAINANT_NAME: "",
                COMPLAINANT_CONTACT: "",
            });
            setEditingId(null);
        } catch (err) {
            console.error("❌ Operation failed:", err);
            alert("❌ Operation failed");
        }
    };

    const handleEdit = (fir) => {
        setEditingId(fir.FIR_NO);
        setForm({
            COMPLAINT_ID: fir.COMPLAINT_ID,
            FIR_DATE: fir.FIR_DATE ? fir.FIR_DATE.substring(0, 10) : "",
            CRIME_TYPE: fir.CRIME_TYPE,
            CRIME_LOCATION: fir.CRIME_LOCATION,
            DESCRIPTION: fir.DESCRIPTION,
            COMPLAINANT_NAME: fir.COMPLAINANT_NAME,
            COMPLAINANT_CONTACT: fir.COMPLAINANT_CONTACT,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this FIR?")) return;
        try {
            await api.delete(`${API_ENDPOINTS.firs}/${id}`);
            setData(firs.filter((f) => f.FIR_NO !== id));
            alert("🗑️ FIR deleted successfully");
        } catch (err) {
            console.error(err);
            alert("❌ Failed to delete FIR");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">FIRs</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 bg-white p-4 rounded-lg mb-6 shadow-sm">
                <Input label="Complaint ID" name="COMPLAINT_ID" value={form.COMPLAINT_ID} onChange={handleChange} />
                <Input label="FIR Date" type="date" name="FIR_DATE" value={form.FIR_DATE} onChange={handleChange} />
                <Input label="Crime Type" name="CRIME_TYPE" value={form.CRIME_TYPE} onChange={handleChange} />
                <Input label="Crime Location" name="CRIME_LOCATION" value={form.CRIME_LOCATION} onChange={handleChange} />
                <Input label="Complainant Name" name="COMPLAINANT_NAME" value={form.COMPLAINANT_NAME} onChange={handleChange} />
                <Input label="Complainant Contact" name="COMPLAINANT_CONTACT" value={form.COMPLAINANT_CONTACT} onChange={handleChange} />
                <textarea
                    name="DESCRIPTION"
                    placeholder="Enter detailed description"
                    value={form.DESCRIPTION}
                    onChange={handleChange}
                    className="col-span-2 border rounded-md p-2"
                    rows="3"
                ></textarea>
                <button type="submit" className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
                    {editingId ? "Update FIR" : "Add FIR"}
                </button>
            </form>

            {loading ? (
                <Loader />
            ) : (
                <Table
                    columns={[
                        "FIR_NO",
                        "COMPLAINT_ID",
                        "FIR_DATE",
                        "CRIME_TYPE",
                        "CRIME_LOCATION",
                        "DESCRIPTION",
                        "COMPLAINANT_NAME",
                        "COMPLAINANT_CONTACT",
                    ]}
                    data={firs}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
