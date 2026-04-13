const { request, response } = require("express");

module.exports = function (server) {
  const { readLastUsedDepartmentId } = require("../utils");

  let departmentsIdCounter = readLastUsedDepartmentId();
  const jsonServer = require("json-server");
  const router = jsonServer.router("db.json");

  //endpoint=create/update department

  server.post("/api/departments", (request, response) => {
    const requestBody = request.body;

    if (
      requestBody.name === undefined ||
      requestBody.name === null ||
      requestBody.name.trim() === ""
    ) {
      return response
        .status(403)
        .json({ message: "Name of department must be provided!" });
    }

    if (requestBody.id === undefined) {
      console.log("debugging");
      let departmentId = ++departmentsIdCounter;
      const newDepartment = {
        id: departmentId,
        name: requestBody.name,
        employee_list: [],
      };

      const departmentsData = router.db.get("departments").value();
      departmentsData.push(newDepartment);
      router.db.set("departments", departmentsData).write();

      const lastUsedId = router.db.get("lastUsedId").value();
      lastUsedId.departmentId = departmentsIdCounter;
      router.db.set("lastUsedId", lastUsedId).write();

      response.status(203).json(newDepartment);
    } else {
      const departmentData = router.db.get("departments").value();
      const departmentId = parseInt(requestBody.id, 10);
      const index = departmentData.findIndex(
        (dept) => dept.id === departmentId
      );

      if (index === -1) {
        return response.status(404).json({ message: "Department not found" });
      } else {
        departmentData[index] = {
          ...departmentData[index],
          ...requestBody,
        };

        router.db.set("departments", departmentData).write();
        response.json(departmentData[index]);
      }
    }
  });

  //Endpoint -gell all departments

  server.get("/api/departments/all", (request, response) => {
    const departmentData = router.db.get("departments").value();
    response.status(200).json(departmentData);
  });

  //Endpoint- fetch department by Id

  server.get("/api/departments/:id", (request, response) => {
    const departmentId = parseInt(request.params.id);
    // console.log(departmentId);
    const departmentData = router.db.get("departments").value();

    const department = departmentData.find((dept) => dept.id === departmentId);

    if (!department) {
      return response.status(404).json({ message: "Department not found!" });
    } else {
      response.status(200).json(department);
    }
  });

  //Endpoint-delete department by id

  server.delete("/api/department/delete/:id", (request, response) => {
    const departmentId = parseInt(request.params.id);
    const departmentData = router.db.get("departments").value();
    const departmentIndex = departmentData.findIndex(
      (dept) => dept.id === departmentId
    );

    if (departmentIndex === -1) {
      return response.status(404).json({ message: "Department not found!" });
    }

    const department = departmentData[departmentIndex];

    if (department.employee_list.length > 0) {
      return response
        .status(400)
        .json({ message: "Cannot delete this department with employees!" });
    }

    const updateDepartments = departmentData.filter(
      (dept) => dept.id !== departmentId
    );

    router.db.set("departments", updateDepartments).write();
    response.json({
      message: `Department with ${departmentId} deleted successfully!`,
    });
  });
};
