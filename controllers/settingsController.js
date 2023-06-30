// settingsController.js

import sql from 'mssql';



// Logic to update user details
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, employeeId, currentPassword, newPassword } = req.body;

  try {
    // Create a new connection pool
    const pool = await sql.connect(dbConfig);

    // Perform database operations to update the user details
    const updateUserQuery = `
      UPDATE Users
      SET firstName = @firstName, lastName = @lastName, badgeNumber = @badgeNumber, password = @newPassword
      WHERE id = @id
    `;

    const result = await pool.request()
      .input('firstName', sql.VarChar(50), name.firstName)
      .input('lastName', sql.VarChar(50), name.lastName)
      .input('badgeNumber', sql.VarChar(20), employeeId)
      .input('newPassword', sql.VarChar(255), newPassword)
      .input('id', sql.Int, id)
      .query(updateUserQuery);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'User details updated successfully.' });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Failed to update user details.' });
  } finally {
    sql.close();
  }
};
