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
import EditEmployeeDialog from "./EditEmployeeDialog";

const EmployeesList = ({ employees, onEmployeesChanged }) => {
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
                  <TableHead className="text-right">Actions</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
              {updatedEmployees.length < 0 ? (
                  <TableCell colSpan="6">No Employees found</TableCell>
              ) : (
                  updatedEmployees.map((employee, index) => (
                      <TableRow key={index}>
                          <TableCell>{employee.user_id}</TableCell>
                          <TableCell>{employee.user_name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell className="capitalize">
                              {employee.status}
                          </TableCell>
                          <TableCell className="capitalize">
                              {employee.department_name || "Unasigned"}
                          </TableCell>
                          <TableCell className="text-right">
                              <EditEmployeeDialog
                                          employee={employee}
                                          departments={departments}
                                          onEmployeeUpdated={onEmployeesChanged}
                                          onEmployeeDeleted={onEmployeesChanged}
                                      />
                              {loading && " Loading departments..."}
                              {error && " Department list unavailable"}
                          </TableCell>
                      </TableRow>
                  ))
              )}
          </TableBody>
      </Table>
  );
};

export default EmployeesList;
