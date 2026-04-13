const jsonServer = require("json-server");
const server = jsonServer.create();
const jsonServerPort = 8095;
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

const departmentsRoute = require("./routes/departments");
const employeesRoute = require("./routes/employees");

departmentsRoute(server);
employeesRoute(server);

server.listen(jsonServerPort, () => {
  console.log(
    `Your website is running on port: http://localhost:${jsonServerPort}`
  );
});
