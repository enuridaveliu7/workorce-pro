const { request, response } = require("express");

module.exports = function (server) {
  const { readLastUsedEmployeeId } = require("../utils");
  const jsonServer = require("json-server");
  const router = jsonServer.router("db.json");
  let employeeIdCounter = readLastUsedEmployeeId();

  //Endpoint -create new employee by department Id and update existing employee by id:

  server.post("/api/employee/:id", (request, response) => {
    const departmentId = parseInt(request.params.id);
    const requestBody = request.body;

    const departmentsData = router.db.get("departments").value();
    const index = departmentsData.findIndex((dept) => dept.id === departmentId);

    if (index === -1) {
      return response.status(404).json({ message: "Department not found!" });
    }

    const department = departmentsData[index];
    const employeeList = department.employee_list;

    if (requestBody.id === undefined) {
      let employeeId = ++employeeIdCounter;

      const newEmployee = {
        id: employeeId,
        name: requestBody.name,
        address: requestBody.address,
        email: requestBody.email,
        phone: requestBody.phone,
      };

      employeeList.push(newEmployee);
      department.employee_list = employeeList;

      router.db.set("departments", departmentsData).write();
      const lastUsedId = router.db.get("lastUsedId").value();
      lastUsedId.employeeId = employeeIdCounter;
      router.db.set("lastUsedId", lastUsedId).write();

      response.status(201).json(departmentsData[index]);
    } else {
      const employeeIndex = department.employee_list.findIndex(
        (empl) => empl.id === requestBody.id
      );

      if (employeeIndex === -1) {
        return response.status(404).json({ message: "Employee not found!" });
      } else {
        requestBody.id = parseInt(requestBody.id);

        const updatedEmployee = {
          id: requestBody.id,
          name: requestBody.name,
          address: requestBody.address,
          email: requestBody.email,
          phone: requestBody.phone,
        };

        department.employee_list[employeeIndex] = {
          ...department.employee_list[employeeIndex],
          ...updatedEmployee,
        };

        router.db.set("departments", departmentsData).write();
        response.status(201).json(department.employee_list[employeeIndex]);
      }
    }
  });

  //Endpoint -get all employees by department id

  server.get("/api/employees/list/:departmentId", (request, response) => {
    const departmentId = parseInt(request.params.departmentId);
    const departmentsData = router.db.get("departments").value();

    const department = departmentsData.find((dept) => dept.id === departmentId);

    if (!department) {
      return response.status(404).json({ message: "Department not found" });
    } else {
      const departmentEmployees = department.employee_list;
      response.status(201).json({
        total: departmentEmployees.length,
        employees: departmentEmployees,
      });
    }
  });

  //Endpoint get employee by id

  server.get("/api/employee/:dept_id/:emp_id", (request, response) => {
    const departmentId = parseInt(request.params.dept_id);
    const employeeId = parseInt(request.params.emp_id);
    const departmentsData = router.db.get("departments").value();
    const department = departmentsData.find((dept) => dept.id === departmentId);

    if (!department) {
      return response.status(404).json({ message: "Department not found!" });
    } else {
      const employee = department.employee_list.find(
        (emp) => emp.id === employeeId
      );

      return employee
        ? response.status(201).json(employee)
        : response.status(404).json({ message: "Employee not found" });
    }
  });

  //Endpoint - delete employee by id:

  server.delete("/api/employee/delete/:id", (request, response) => {
    const employeeId = parseInt(request.params.id);
    const departmentsData = router.db.get("departments").value();

    let employeeDeleted = false;

    departmentsData.forEach((department) => {
      const employeeIndex = department.employee_list.findIndex(
        (empl) => empl.id === employeeId
      );

      if (employeeIndex !== -1) {
        department = department.employee_list.splice(employeeIndex, 1);
        employeeDeleted = true;
      }
    });

    if (employeeDeleted) {
      router.db.set("departments", departmentsData).write();
      return response.json({
        message: "Employee deleted successfully",
        departmentsData,
      });
    } else {
      response
        .status(404)
        .json({ message: "Employee not found in any department" });
    }
  });
};
