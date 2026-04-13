import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { deleteTask, fetchTasks } from "@/store/tasksSlice";

const TaskList = () => {
    const dispatch = useDispatch();
    const { tasks, loading, error } = useSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    return (
        <Card className="mt-6">
            <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-4">Tasks</h2>

                {loading ? (
                    <p>Loading tasks...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : tasks.length === 0 ? (
                    <p className="text-muted-foreground">No tasks found.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Task ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>{task.task_id}</TableCell>
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell className="capitalize">
                                        {task.status}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {task.priority}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() =>
                                                dispatch(deleteTask(task.id))
                                            }
                                        >
                                            <Trash />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};

export default TaskList;
