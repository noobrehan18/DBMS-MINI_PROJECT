import React, { useState } from "react";
import Input from "../Component/Input";
import Loader from "../Component/Loader";
import Table from "../Component/Table";
import api from "../Api/Api";
import useFetch from "../Hooks/UseFetch";
import { API_ENDPOINTS } from "../Utils/Constants";

export default function Cases() {
    const { data: cases, loading, setData } = useFetch(API_ENDPOINTS.cases);
    const [form, setForm] = useState({
        CRIME_ID: "",
        OFFICER_ID: "",
        FIR_NO: "",
        DATE_ASSIGNED: "",
        STATUS: "",
    });
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`${API_ENDPOINTS.cases}/${editingId}`, form);
                setData(cases.map((c) => (c.CASE_ID === editingId ? { ...c, ...form } : c)));
                alert("✅ Case updated!");
            } else {
                await api.post(API_ENDPOINTS.cases, form);
                alert("✅ Case added!");
                setData([...cases, { ...form }]);
            }
            setForm({ CRIME_ID: "", OFFICER_ID: "", FIR_NO: "", DATE_ASSIGNED: "", STATUS: "" });
            setEditingId(null);
        } catch (err) {
            console.error(err);
            alert("❌ Operation failed");
        }
    };

    const handleEdit = (caseData) => {
        setEditingId(caseData.CASE_ID);
        setForm({
            CRIME_ID: caseData.CRIME_ID,
            OFFICER_ID: caseData.OFFICER_ID,
            FIR_NO: caseData.FIR_NO,
            DATE_ASSIGNED: caseData.DATE_ASSIGNED,
            STATUS: caseData.STATUS,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this case?")) return;
        await api.delete(`${API_ENDPOINTS.cases}/${id}`);
        setData(cases.filter((c) => c.CASE_ID !== id));
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Cases</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 bg-white p-4 rounded-lg mb-6">
                <Input label="Crime ID" name="CRIME_ID" value={form.CRIME_ID} onChange={handleChange} />
                <Input label="Officer ID" name="OFFICER_ID" value={form.OFFICER_ID} onChange={handleChange} />
                <Input label="FIR No" name="FIR_NO" value={form.FIR_NO} onChange={handleChange} />
                <Input label="Date Assigned" type="date" name="DATE_ASSIGNED" value={form.DATE_ASSIGNED ? form.DATE_ASSIGNED.substring(0, 10) : ""} onChange={handleChange} />
                <Input label="Status" name="STATUS" value={form.STATUS} onChange={handleChange} />
                <button className="col-span-2 bg-blue-600 text-white py-2 rounded-md">
                    {editingId ? "Update Case" : "Add Case"}
                </button>
            </form>

            {loading ? (
                <Loader />
            ) : (
                <Table
                    columns={["CASE_ID", "CRIME_ID", "OFFICER_ID", "FIR_NO", "DATE_ASSIGNED", "STATUS"]}
                    data={cases}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
