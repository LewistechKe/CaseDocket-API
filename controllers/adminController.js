import sql from "mssql";
import config from "../config/database.js";

export const addUser = async (req, res) => {
  try {
    const { firstName, lastName, badgeNumber, password, role } = req.body;

    await sql.connect(config.sql);

    const request = new sql.Request(); 

    const query = `
      INSERT INTO Users (firstName, lastName, badgeNumber, password, role)
      VALUES (@firstName, @lastName, @badgeNumber, @password, @role)
    `;

    // Setting the input parameters for the query
    request.input('firstName', sql.VarChar(50), firstName);
    request.input('lastName', sql.VarChar(50), lastName);
    request.input('badgeNumber', sql.VarChar(20), badgeNumber);
    request.input('password', sql.VarChar(255), password);
    request.input('role', sql.VarChar(20), role);

    await request.query(query);

    res.status(200).json({ message: 'User added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the user' });
  }
};


//LOGIC TO RETRIEVE ALL USERS
export const getUsers = async (req, res) => {
	try {
		const pool = await sql.connect(config.sql);
		const query = `SELECT * FROM Users`;
		const result = await pool.query(query);

		const users = result.recordset;
		res.status(200).json(users);
	} catch (error) {
		console.error("Error:", error);
		res
			.status(500)
			.json({ error: "An error occurred while fetching the users." });
	} finally {
		sql.close();
	}
};
