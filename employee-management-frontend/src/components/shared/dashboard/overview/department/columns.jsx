"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil } from "lucide-react";
import { Link } from "react-router";
import DeleteButton from "./DeleteButton";

export const columns = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Department Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div>{row.getValue("name")}</div>;
        },
    },
    {
        accessorKey: "employee_count",
        header: () => <>Employees</>,
        cell: ({ row }) => {
            return <div>{row.getValue("employee_count")}</div>;
        },
    },
    {
        accessorKey: "id",
        header: () => <>Actions</>,
        cell: ({ row }) => {
            const id = row.getValue("id");
            const name = row.getValue("name");

            return (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" asChild>
                        <Link to={`/edit-department/${id}`}>
                            <Pencil />
                        </Link>
                    </Button>

                    <DeleteButton
                        departmentId={id}
                        departmentName={name}
                        onDelete={() => window.location.reload()}
                    />
                </div>
            );
        },
    },
];
