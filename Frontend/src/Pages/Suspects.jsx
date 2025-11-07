import React, { useState } from "react";
import Input from "../Component/Input";
import Loader from "../Component/Loader";
import Table from "../Component/Table";
import api from "../Api/Api";
import useFetch from "../Hooks/UseFetch";
import { API_ENDPOINTS } from "../Utils/Constants";

export default function Suspects() {
    const { data: suspects, loading, setData } = useFetch(API_ENDPOINTS.suspects);
    const [form, setForm] = useState({
        NAME: "",
        AGE: "",
        GENDER: "",
        ADDRESS: "",
        CRIME_RECORD_STATUS: "",
    });
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`${API_ENDPOINTS.suspects}/${editingId}`, form);
                setData(suspects.map((s) => (s.SUSPECT_ID === editingId ? { ...s, ...form } : s)));
                alert("✅ Suspect updated!");
            } else {
                await api.post(API_ENDPOINTS.suspects, form);
                alert("✅ Suspect added!");
                setData([...suspects, { ...form }]);
            }
            setForm({ NAME: "", AGE: "", GENDER: "", ADDRESS: "", CRIME_RECORD_STATUS: "" });
            setEditingId(null);
        } catch (err) {
            console.error(err);
            alert("❌ Operation failed");
        }
    };

    const handleEdit = (suspect) => {
        setEditingId(suspect.SUSPECT_ID);
        setForm({
            NAME: suspect.NAME,
            AGE: suspect.AGE,
            GENDER: suspect.GENDER,
            ADDRESS: suspect.ADDRESS,
            CRIME_RECORD_STATUS: suspect.CRIME_RECORD_STATUS,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this suspect?")) return;
        await api.delete(`${API_ENDPOINTS.suspects}/${id}`);
        setData(suspects.filter((s) => s.SUSPECT_ID !== id));
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Suspects</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 bg-white p-4 rounded-lg mb-6">
                <Input label="Name" name="NAME" value={form.NAME} onChange={handleChange} />
                <Input label="Age" name="AGE" value={form.AGE} onChange={handleChange} />
                <Input label="Gender" name="GENDER" value={form.GENDER} onChange={handleChange} />
                <Input label="Address" name="ADDRESS" value={form.ADDRESS} onChange={handleChange} />
                <Input label="Crime Record Status" name="CRIME_RECORD_STATUS" value={form.CRIME_RECORD_STATUS} onChange={handleChange} />
                <button className="col-span-2 bg-blue-600 text-white py-2 rounded-md">
                    {editingId ? "Update Suspect" : "Add Suspect"}
                </button>
            </form>

            {loading ? (
                <Loader />
            ) : (
                <Table
                    columns={["SUSPECT_ID", "NAME", "AGE", "GENDER", "ADDRESS", "CRIME_RECORD_STATUS"]}
                    data={suspects}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
