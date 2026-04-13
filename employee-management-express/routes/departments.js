const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Endpoint to create department
router.post("/", authMiddleware, async (req, res) => {
    const { name } = req.body;

    try {
        if (!name) {
            return res
                .status(400)
                .json({ message: "Bad request. Name is required" });
        }

        if (req.user.status !== "admin") {
            return res
                .status(403)
                .json({ message: "Access denied. Admins only." });
        }

        const query = `INSERT INTO departments (name) VALUES ($1) RETURNING *`;
        const result = await pool.query(query, [name]);

        // res.status(201).json({
        //     success: true,
        //     message: "Department Created Successfully",
        //     data: result.rows[0],
        // });
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Endpoint to assign user to a department
router.post("/assign", authMiddleware, async (req, res) => {
    const { user_id, department_id } = req.body;

    try {
        if (req.user.status !== "admin") {
            return res
                .status(403)
                .json({ message: "Access denied. Admins only." });
        }

        if (!user_id || !department_id) {
            return res.status(400).json({
                message:
                    "Bad request. Both user_id:Number and department_id:Number are required!",
            });
        }

        const query =
            "Insert INTO users_departments (user_id, departments_id) VALUES ($1, $2) RETURNING *";
        const result = await pool.query(query, [user_id, department_id]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to get all departments
router.get("/", authMiddleware, async (req, res) => {
    try {
        const query = `
            SELECT 
                d.id,
                d.name,
                COUNT(ud.user_id) AS employee_count
            FROM departments d
            LEFT JOIN users_departments ud ON d.id = ud.departments_id
            GROUP BY d.id
            ORDER BY d.id ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to get department by id
router.get("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT 
                d.id,
                d.name,
                COUNT(ud.user_id) AS employee_count
            FROM departments d
            LEFT JOIN users_departments ud ON d.id = ud.departments_id
            WHERE d.id = $1
            GROUP BY d.id
        `;
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Department not found!" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to delete department
router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({
                message: "Bad request. Department id is required!",
            });
        }

        if (req.user.status !== "admin") {
            return res
                .status(403)
                .json({ message: "Access denied. Admin only." });
        }

        const query = "DELETE FROM departments WHERE id = $1 RETURNING *";
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Department not found!" });
        }

        res.status(200).json({ message: "Department deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to update department by id
router.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        if (req.user.status !== "admin") {
            return res
                .status(403)
                .json({ message: "Access denied. Admin only." });
        }

        if (!id || !name || name.length <= 2) {
            return res.status(400).json({
                message:
                    "id is required, name is required and name must be longer than 2 characters!",
            });
        }

        const query = `UPDATE departments SET name = $1 WHERE id = $2 RETURNING *`;
        const result = await pool.query(query, [name, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Department not found!" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
