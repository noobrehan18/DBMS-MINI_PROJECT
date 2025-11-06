import React, { useState } from "react";
import Input from "../Component/Input";
import Loader from "../Component/Loader";
import Table from "../Component/Table";
import api from "../Api/Api";
import useFetch from "../Hooks/useFetch";
import { API_ENDPOINTS } from "../Utils/Constants";

export default function Officers() {
    const { data: officers, loading, setData } = useFetch(API_ENDPOINTS.officers);
    const [form, setForm] = useState({
        NAME: "",
        RANK: "",
        CONTACT_NO: "",
        STATION_ID: "",
    });
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`${API_ENDPOINTS.officers}/${editingId}`, form);
                alert("✅ Officer updated successfully!");
                setData(
                    officers.map((off) => (off.OFFICER_ID === editingId ? { ...off, ...form } : off))
                );
            } else {
                const res = await api.post(API_ENDPOINTS.officers, form);
                alert("✅ Officer added!");
                setData([...officers, { ...form }]);
            }
            setForm({ NAME: "", RANK: "", CONTACT_NO: "", STATION_ID: "" });
            setEditingId(null);
        } catch (err) {
            console.error(err);
            alert("❌ Failed to save officer");
        }
    };

    const handleEdit = (off) => {
        setEditingId(off.OFFICER_ID);
        setForm({
            NAME: off.NAME,
            RANK: off.RANK,
            CONTACT_NO: off.CONTACT_NO,
            STATION_ID: off.STATION_ID,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this officer?")) return;
        try {
            await api.delete(`${API_ENDPOINTS.officers}/${id}`);
            setData(officers.filter((off) => off.OFFICER_ID !== id));
            alert("🗑️ Officer deleted successfully");
        } catch (err) {
            console.error(err);
            alert("❌ Failed to delete officer");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Officers</h2>
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-3 bg-white p-4 rounded-lg shadow-sm mb-6"
            >
                <Input label="Name" name="NAME" value={form.NAME} onChange={handleChange} />
                <Input label="Rank" name="RANK" value={form.RANK} onChange={handleChange} />
                <Input label="Contact No" name="CONTACT_NO" value={form.CONTACT_NO} onChange={handleChange} />
                <Input label="Station ID" name="STATION_ID" value={form.STATION_ID} onChange={handleChange} />
                <button type="submit" className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
                    {editingId ? "Update Officer" : "Add Officer"}
                </button>
            </form>

            {loading ? (
                <Loader />
            ) : (
                <Table
                    columns={["OFFICER_ID", "NAME", "RANK", "CONTACT_NO", "STATION_ID"]}
                    data={officers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
