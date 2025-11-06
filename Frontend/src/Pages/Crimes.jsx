import React, { useState } from "react";
import Input from "../Component/Input";
import Loader from "../Component/Loader";
import Table from "../Component/Table";
import api from "../Api/Api";
import useFetch from "../Hooks/useFetch";
import { API_ENDPOINTS } from "../Utils/Constants";

export default function Crimes() {
    const { data: crimes, loading, setData } = useFetch(API_ENDPOINTS.crimes);
    const [form, setForm] = useState({
        CRIME_TYPE: "",
        CRIME_DATE: "",
        CRIME_LOCATION: "",
        DESCRIPTION: "",
        VICTIM_NAME: "",
    });
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`${API_ENDPOINTS.crimes}/${editingId}`, form);
                setData(crimes.map((c) => (c.CRIME_ID === editingId ? { ...c, ...form } : c)));
                alert("✅ Crime updated successfully!");
            } else {
                await api.post(API_ENDPOINTS.crimes, form);
                alert("✅ Crime added!");
                setData([...crimes, { ...form }]);
            }
            setForm({ CRIME_TYPE: "", CRIME_DATE: "", CRIME_LOCATION: "", DESCRIPTION: "", VICTIM_NAME: "" });
            setEditingId(null);
        } catch (err) {
            console.error(err);
            alert("❌ Operation failed");
        }
    };

    const handleEdit = (crime) => {
        setEditingId(crime.CRIME_ID);
        setForm({
            CRIME_TYPE: crime.CRIME_TYPE,
            CRIME_DATE: crime.CRIME_DATE,
            CRIME_LOCATION: crime.CRIME_LOCATION,
            DESCRIPTION: crime.DESCRIPTION,
            VICTIM_NAME: crime.VICTIM_NAME,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this record?")) return;
        await api.delete(`${API_ENDPOINTS.crimes}/${id}`);
        setData(crimes.filter((c) => c.CRIME_ID !== id));
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Crimes</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 bg-white p-4 rounded-lg mb-6">
                <Input label="Type" name="CRIME_TYPE" value={form.CRIME_TYPE} onChange={handleChange} />
                <Input label="Date" type="date" name="CRIME_DATE" value={form.DATE_FIELD ? form.CRIME_DATE.substring(0, 10) : ""} onChange={handleChange} />
                <Input label="Location" name="CRIME_LOCATION" value={form.CRIME_LOCATION} onChange={handleChange} />
                <Input label="Description" name="DESCRIPTION" value={form.DESCRIPTION} onChange={handleChange} />
                <Input label="Victim" name="VICTIM_NAME" value={form.VICTIM_NAME} onChange={handleChange} />
                <button className="col-span-2 bg-blue-600 text-white py-2 rounded-md">
                    {editingId ? "Update Crime" : "Add Crime"}
                </button>
            </form>

            {loading ? (
                <Loader />
            ) : (
                <Table
                    columns={["CRIME_ID", "CRIME_TYPE", "CRIME_DATE", "CRIME_LOCATION", "DESCRIPTION", "VICTIM_NAME"]}
                    data={crimes}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
