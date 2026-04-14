const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const departmentsRoutes = require("./routes/departments");
const employeesRoutes = require("./routes/employees");
const tasksRoutes = require("./routes/tasks");

const app = express();
const allowedOrigins = (process.env.DOMAIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }

            const isExplicitlyAllowed = allowedOrigins.includes(origin);
            const isVercelPreview = /\.vercel\.app$/.test(new URL(origin).hostname);
            const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

            if (isExplicitlyAllowed || isVercelPreview || isLocalhost) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
    })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/tasks", tasksRoutes);

const PORT = process.env.PORT || 8095;

app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});
