import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import Header from "../../../components/shared/dashboard/Header";
import CreateEmployeeDialog from "@/components/shared/dashboard/employees/CreateEmployeeDialog";
import EmployeesList from "@/components/shared/dashboard/employees/EmployeesList";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "@/store/employeesSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const EmployeesPage = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const {
        data: employees,
        pagination,
        loading,
        error,
    } = useSelector((state) => state.employees);

    useEffect(() => {
        dispatch(fetchEmployees({ page: currentPage, limit: pageSize })).catch(
            (error) => toast.error("Error", { description: error })
        );
    }, [dispatch, currentPage, pageSize]);

    const handleNextPage = () => {
        if (currentPage < pagination.totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    return (
        <Layout>
            <Header
                title="Employees Management"
                subtitle="Here's a list of all employees."
            >
                <CreateEmployeeDialog />
            </Header>

            {loading ? (
                <p className="text-center">Loading Employees...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <>
                    <EmployeesList employees={employees} />
                    <div className="flex items-center justify-between mt-6 p-4">
                        <div className="text-sm text-gray-600">
                            Page {pagination.page} of {pagination.totalPages} |
                            Total: {pagination.total} employees
                        </div>

                        <div className="flex gap-2 items-center">
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="px-3 py-1 border border-gray-300 rounded text-sm"
                            >
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={50}>50 per page</option>
                                <option value={100}>100 per page</option>
                            </select>

                            <Button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                variant="outline"
                            >
                                Previous
                            </Button>

                            <Button
                                onClick={handleNextPage}
                                disabled={currentPage === pagination.totalPages}
                                variant="outline"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Layout>
    );
};

export default EmployeesPage;
