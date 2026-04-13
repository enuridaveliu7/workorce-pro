const pool = require("../config/db");
const bcrypt = require("bcrypt");

async function seedUsers(count = 500) {
  console.log(`Seeding ${count} users...`);

  try {
    const hashedPassword = await bcrypt.hash("123456", 10);

    for (let i = 1; i <= count; i++) {
      const username = `user${i}`;
      const email = `user${i}@example.com`;
      const status = Math.random() < 0.05 ? "admin" : "employee";

      await pool.query(
        "INSERT INTO users (username, email, password, status) VALUES ($1, $2, $3, $4)",
        [username, email, hashedPassword, status]
      );

      if (i % 100 === 0) {
        console.log(`Inserted ${i}/${count} users...`);
      }
    }

    console.log(`✅ Successfully seeded ${count} users!`);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await pool.end();
  }
}
const userCount = process.argv[2] ? parseInt(process.argv[2]) : 500;
seedUsers(userCount);
