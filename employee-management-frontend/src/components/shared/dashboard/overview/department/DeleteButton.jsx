import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const DeleteButton = ({ departmentId, departmentName, onDelete }) => {
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDeleteConfirm = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `${
                    import.meta.env.VITE_API_URL
                }/api/departments/${departmentId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete department");
            }

            toast.success("Success", {
                description: `Department "${departmentName}" has been deleted successfully.`,
            });
            onDelete();
            setShowDialog(false);
        } catch (error) {
            toast.error("Error", {
                description: error.message || "An unexpected error ocurred.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="destructive"
                size="icon"
                onClick={() => setShowDialog(true)}
                className="cursor-pointer"
            >
                <Trash />
            </Button>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Department</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{" "}
                            <strong>{departmentName}?</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DeleteButton;
