import React from "react";
import Layout from "../Layout";
import Header from "../../../components/shared/dashboard/Header";
import DepartmentCard from "../../../components/shared/dashboard/overview/department/DepartmentCard";
import DepartmentEmployees from "@/components/shared/dashboard/overview/department/DepartmentEmployees";

const EditDepartmentPage = () => {
    return (
        <Layout>
            <Header
                title="Department Details"
                subtitle="Here you can edit department's name and asign or remove employees from this department"
            />

            <div className="flex lg:flex-row flex-col gap-5">
                <div>
                    <DepartmentCard />
                </div>
                <div className="w-full h-screen">
                    <DepartmentEmployees />
                </div>
            </div>
        </Layout>
    );
};

export default EditDepartmentPage;
