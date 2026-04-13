const jsonServer = require("json-server");
const router = jsonServer.router("db.json");

function readLastUsedDepartmentId() {
  try {
    const data = router.db.get("lastUsedId").value();
    return data.departmentId;
  } catch (error) {
    console.log("Error from readLastUsedDepartmentId", error);
    return -1;
  }
}

function readLastUsedEmployeeId() {
  try {
    const data = router.db.get("lastUsedId").value();
    return data.employeeId;
  } catch (error) {
    console.log("Error from readLastUsedEmployeeId", error);

    return -1;
  }
}

function writeLastUsedDepartmentId(value) {
  const lastUsedId = router.db.get("lastUsedId").value();
  lastUsedId.departmentId = value;
  router.db.set("lastUsedId", lastUsedId).write();
}

function writeLastUsedEmployeeId(value) {
  const lastUsedId = router.db.get("lastUsedId").value();
  lastUsedId.employeeId = value;
  router.db.set("lastUsedId", lastUsedId).write();
}

module.exports = {
  readLastUsedDepartmentId,
  readLastUsedEmployeeId,
  writeLastUsedDepartmentId,
  writeLastUsedEmployeeId,
};
