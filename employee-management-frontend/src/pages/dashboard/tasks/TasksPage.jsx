import React from "react";
import Header from "@/components/shared/dashboard/Header";
import CreateTaskDialog from "@/components/shared/dashboard/tasks/CreateTaskDialog";
import TaskList from "@/components/shared/dashboard/tasks/TaskList";
import Layout from "../Layout";

const TasksPage = () => {
    return (
        <Layout>
            <Header title="Tasks Manager" subtitle="Here's list of your tasks!">
                <CreateTaskDialog />
            </Header>
            <TaskList />
        </Layout>
    );
};

export default TasksPage;
