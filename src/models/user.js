const db = require("../config/database");

async function createUser(user) {
  const sql = `
    INSERT INTO user (firstName, lastName, emailId, password, age, gender)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.execute(sql, [
    user.firstName,
    user.lastName,
    user.emailId,
    user.password,
    user.age,
    user.gender
  ]);
  return result.insertId;
}

async function getUsers() {
  const [rows] = await db.execute("SELECT * FROM user");
  return rows;
}

module.exports = { createUser, getUsers };
