const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Endpoint - get all users and their departments(or show "Unassigned");
// router.get("/all-users", authMiddleware, async (req, res) => {
//     try {
//         const query = `
//         SELECT
//           u.id AS user_id,
//           u.username AS user_name,
//           u.email,
//           u.status,
//           COALESCE(d.name, 'Unasigned') AS department_name
//           FROM users u
//           LEFT JOIN users_departments ud ON u.id = ud.user_id
//           LEFT JOIN departments d ON d.id = ud.department_id
//           ORDER BY u.id ASC LIMIT 10;
//       `;

//         const result = await pool.query(query);

//         res.status(200).json(result.rows);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
router.get("/all-users", authMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const countQuery = `SELECT COUNT(*) as total FROM users;`;
        const countResult = await pool.query(countQuery);
        const total = parseInt(countResult.rows[0].total);

        const query = `
        SELECT 
          u.id AS user_id,
          u.username AS user_name,
          u.email,
          u.status,
          COALESCE(d.name, 'Unasigned') AS department_name
          FROM users u
          LEFT JOIN users_departments ud ON u.id = ud.user_id
          LEFT JOIN departments d ON d.id = ud.departments_id
          ORDER BY u.id ASC LIMIT $1 OFFSET $2;
      `;

        const result = await pool.query(query, [limit, offset]);

        res.status(200).json({
            data: result.rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint - get all employees by department_id
router.get("/department/:department_id", authMiddleware, async (req, res) => {
    const { department_id } = req.params;

    try {
        const query = `
        SELECT 
          u.id AS user_id,
          u.username AS user_name,
          u.email,
          d.name AS department_name
        FROM users u
        INNER JOIN users_departments ud ON u.id = ud.user_id
        INNER JOIN departments d ON d.id = ud.departments_id
        WHERE d.id = $1
        ORDER BY u.id ASC;
      `;

        const result = await pool.query(query, [department_id]);
        if (result.rows.length === 0) {
            return res.status(200).json({
                message: "No employees found for this specific department.",
            });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Endpoint - update user department;
router.put("/update-department", authMiddleware, async (req, res) => {
    const { user_id, department_id } = req.body;

    try {
        if (req.user.status !== "admin") {
            return res
                .status(403)
                .json({ message: "Access denied. Admins only." });
        }

        const departmentCheckQuery = `SELECT id FROM departments WHERE id = $1;`;

        const departmentCheck = await pool.query(departmentCheckQuery, [
            department_id,
        ]);

        if (departmentCheck.rowCount === 0) {
            return res.status(404).json({ message: "Department not found." });
        }

        const updateDepartmentQuery = `
          UPDATE users_departments SET departments_id = $1 WHERE user_id = $2 RETURNING *;
        `;

        const result = await pool.query(updateDepartmentQuery, [
            department_id,
            user_id,
        ]);

        if (result.rowCount === 0) {
            const asignDepartmentQuery = `INSERT INTO users_departments (user_id, departments_id) VALUES ($1, $2);`;

            const result = await pool.query(asignDepartmentQuery, [
                user_id,
                department_id,
            ]);

            if (result.rowCount === 0) {
                return res
                    .status(404)
                    .json({ message: "User or department not found." });
            }

            return res.status(201).json({
                message: "Department asigned successfully.",
                data: result.rows[0],
            });
        }

        res.status(200).json({
            message: "Department asigned successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint - update user status
router.put("/update-status", authMiddleware, async (req, res) => {
    const { user_id, status } = req.body;

    try {
        if (req.user.status !== "admin") {
            return res
                .status(403)
                .json({ message: "Access denied. Admins only." });
        }

        const allowedStatuses = ["admin", "employee"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Allowed values: 'admin', 'employee'.",
            });
        }

        const query = `UPDATE users SET status = $1 WHERE id = $2 RETURNING id, username, email, status;`;

        const result = await pool.query(query, [status, user_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User status updated successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
