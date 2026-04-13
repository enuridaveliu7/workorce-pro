const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Import Routes
const authRoutes = require("./routes/auth");
const departmentsRoutes = require("./routes/departments");
const employeesRoutes = require("./routes/employees");
const tasksRoutes = require("./routes/tasks");

const app = express();

app.use(cors({ origin: process.env.DOMAIN }));
app.use(express.json());

// Use Routes
app.use("/api/auth", authRoutes); //http://localhost:8095/api/auth
app.use("/api/departments", departmentsRoutes); //http://localhost:8095/api/departments/
app.use("/api/employees", employeesRoutes); //http://localhost:8095/api/employees/
app.use("/api/tasks", tasksRoutes); //http://localhost:8095/api/tasks/

const PORT = process.env.PORT || 8095;

app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});
