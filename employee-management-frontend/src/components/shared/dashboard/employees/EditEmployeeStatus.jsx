import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { toast } from "sonner";

const EditEmployeeStatus = ({ userId, currentStatus }) => {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);

    const statuses = [
        { value: "admin", label: "Admin" },
        { value: "employee", label: "Employee" },
    ];

    const handleStatusChange = async (value) => {
        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/employees/update-status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        status: value,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update employee status");
            }

            const result = await response.json();
            setStatus(result.data.status);

            toast.success("Success", {
                description: `Status updated to ${result.data.status}`,
            });
        } catch (error) {
            toast.error("Error", {
                description: error.message || "Failed to update status.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Select
            value={status}
            onValueChange={(value) => handleStatusChange(value)}
            disabled={loading}
        >
            <SelectTrigger className="w-fit h-5 text-xs font-medium">
                <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
                {loading ? (
                    <SelectItem>Loading</SelectItem>
                ) : (
                    statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                            {status.label}
                        </SelectItem>
                    ))
                )}
            </SelectContent>
        </Select>
    );
};

export default EditEmployeeStatus;
