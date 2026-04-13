const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tasks ORDER BY id ASC"
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    const { task_id, title, status, priority } = req.body;

    try {
        if (!task_id || !title || !status || !priority) {
            return res.status(400).json({
                message: "task_id, title, status and priority are required.",
            });
        }

        const result = await pool.query(
            "INSERT INTO tasks (task_id, title, status, priority) VALUES ($1, $2, $3, $4) RETURNING *",
            [task_id, title, status, priority]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, status, priority } = req.body;

    try {
        const result = await pool.query(
            "UPDATE tasks SET title = $1, status = $2, priority = $3 WHERE id = $4 RETURNING *",
            [title, status, priority, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Task not found." });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Task not found." });
        }

        res.status(200).json({ message: "Task deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
