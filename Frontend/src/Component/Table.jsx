import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function Table({ columns, data, onEdit, onDelete }) {
    if (!data || data.length === 0)
        return <p className="text-gray-500 text-center py-4">No records found.</p>;

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full bg-white text-sm border-collapse">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col}
                                className="px-4 py-2 text-left capitalize font-semibold whitespace-nowrap"
                            >
                                {col.replaceAll("_", " ")}
                            </th>
                        ))}
                        {(onEdit || onDelete) && (
                            <th className="px-4 py-2 text-center">Actions</th>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row, idx) => (
                        <tr
                            key={idx}
                            className="border-t hover:bg-blue-50 transition-colors duration-150"
                        >
                            {columns.map((col) => (
                                <td
                                    key={col}
                                    className="px-4 py-2 align-top text-gray-700 max-w-[200px] wrap-break-word"
                                >
                                    {row[col] !== null && row[col] !== undefined
                                        ? row[col].toString()
                                        : "-"}
                                </td>
                            ))}

                            {(onEdit || onDelete) && (
                                <td className="px-4 py-2 text-center flex justify-center gap-3">
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(row)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Edit Record"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() =>
                                                onDelete(row[columns[0]])
                                            }
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete Record"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
