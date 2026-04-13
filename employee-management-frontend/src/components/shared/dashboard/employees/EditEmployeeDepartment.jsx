import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const EditEmployeeDepartment = ({
    userId,
    currentDepartmentName,
    departments,
}) => {
    const [selectedDepartment, setSelectedDepartment] = useState(
        currentDepartmentName
    );

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentDepartmentName) {
            setSelectedDepartment(currentDepartmentName);
        } else {
            setSelectedDepartment("No department selected");
        }
    }, [currentDepartmentName]);

    const handleDepartmentChange = async (value) => {
        setLoading(true);
        try {
            const department = departments.find((dept) => dept.name === value);
            const newDepartmentId = department ? department.id : null;

            if (!newDepartmentId) {
                throw new Error("Invalid department.");
            }

            const response = await fetch(
                `${
                    import.meta.env.VITE_API_URL
                }/api/employees/update-department`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        department_id: newDepartmentId,
                        user_id: userId,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update department.");
            }

            setSelectedDepartment(value);

            const data = await response.json();

            toast.success("Success", { description: data.message });
        } catch (error) {
            toast.error("Error", {
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Select
            value={selectedDepartment}
            onValueChange={handleDepartmentChange}
            disabled={loading}
        >
            <SelectTrigger className="w-fit h-5 font-medium">
                <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem disabled="true" value="Unasigned">
                    Unasigned
                </SelectItem>
                {departments.map((department) => (
                    <SelectItem key={department.id} value={department.name}>
                        {department.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default EditEmployeeDepartment;
