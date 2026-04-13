import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchDepartments } from "@/store/departmentsSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditEmployeeStatus from "./EditEmployeeStatus";
import EditEmployeeDepartment from "./EditEmployeeDepartment";

const EmployeesList = ({ employees }) => {
  const dispatch = useDispatch();
  const { departments, loading, error } = useSelector(
      (state) => state.departments
  );

  useEffect(() => {
      dispatch(fetchDepartments());
  }, [dispatch]);

  const [updatedEmployees, setUpdatedEmployees] = useState([]);

  useEffect(() => {
      setUpdatedEmployees(employees);
  }, [employees]);

  return (
      <Table>
          <TableHeader>
              <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Departments</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
              {updatedEmployees.length < 0 ? (
                  <TableCell colSpan="5">No Employees found</TableCell>
              ) : (
                  updatedEmployees.map((employee, index) => (
                      <TableRow key={index}>
                          <TableCell>{employee.user_id}</TableCell>
                          <TableCell>{employee.user_name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>
                              <EditEmployeeStatus
                                  userId={employee.user_id}
                                  currentStatus={employee.status}
                              />
                          </TableCell>
                          <TableCell>
                              {loading && "Loading"}
                              {departments.length === 0 && "No departments"}
                              {!loading &&
                                  !error &&
                                  departments.length > 0 && (
                                      <EditEmployeeDepartment
                                          userId={employee.user_id}
                                          currentDepartmentName={
                                              employee.department_name
                                          }
                                          departments={departments}
                                      />
                                  )}
                          </TableCell>
                      </TableRow>
                  ))
              )}
          </TableBody>
      </Table>
  );
};

export default EmployeesList;
