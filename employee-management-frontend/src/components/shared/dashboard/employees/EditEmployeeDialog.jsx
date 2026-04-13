import { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const readResponse = async (response) => {
    const text = await response.text();

    if (!text) {
        return {};
    }

    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
};

const EditEmployeeDialog = ({
    employee,
    departments,
    onEmployeeUpdated,
    onEmployeeDeleted,
}) => {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(employee.status);
    const [departmentName, setDepartmentName] = useState(
        employee.department_name || "Unasigned"
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setStatus(employee.status);
        setDepartmentName(employee.department_name || "Unasigned");
    }, [employee]);

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
                        user_id: employee.user_id,
                        status: value,
                    }),
                }
            );

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(data.message || "Failed to update status.");
            }

            setStatus(value);
            toast.success("Success", {
                description: `Status updated to ${data.data.status}.`,
            });
            onEmployeeUpdated();
        } catch (error) {
            toast.error("Error", {
                description: error.message || "Failed to update status.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDepartmentChange = async (value) => {
        setLoading(true);

        try {
            const department = departments.find((item) => item.name === value);

            if (!department) {
                throw new Error("Invalid department.");
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/employees/update-department`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        user_id: employee.user_id,
                        department_id: department.id,
                    }),
                }
            );

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update department."
                );
            }

            setDepartmentName(value);
            toast.success("Success", {
                description: data.message,
            });
            onEmployeeUpdated();
        } catch (error) {
            toast.error("Error", {
                description: error.message || "Failed to update department.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/employees/${employee.user_id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete employee.");
            }

            toast.success("Success", {
                description: data.message || "Employee deleted successfully.",
            });
            setOpen(false);
            onEmployeeDeleted();
        } catch (error) {
            toast.error("Error", {
                description: error.message || "Failed to delete employee.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" title="Edit employee">
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit employee</DialogTitle>
                    <DialogDescription>
                        Manage status, department, or delete this employee.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <p className="font-medium">{employee.user_name}</p>
                        <p className="text-sm text-muted-foreground">
                            {employee.email}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Status</p>
                        <Select
                            value={status}
                            onValueChange={handleStatusChange}
                            disabled={loading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="employee">
                                    Employee
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Department</p>
                        <Select
                            value={departmentName}
                            onValueChange={handleDepartmentChange}
                            disabled={loading || departments.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.length === 0 ? (
                                    <SelectItem value="no-departments" disabled>
                                        No departments available
                                    </SelectItem>
                                ) : (
                                    departments.map((department) => (
                                        <SelectItem
                                            key={department.id}
                                            value={department.name}
                                        >
                                            {department.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="justify-between">
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        <Trash />
                        Delete employee
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditEmployeeDialog;
