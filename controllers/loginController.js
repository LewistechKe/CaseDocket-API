import sql from 'mssql';
import config from '../config/database.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  console.log('user details');
  const { badgeNumber, password } = req.body;
  console.log(badgeNumber, password);
  
  try {
    let pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input('badgeNumber', sql.VarChar, badgeNumber)
      .query('SELECT * FROM Users WHERE badgenumber = @badgeNumber');
    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed. Wrong credentials.' });
    }

    if (password !== user.password) {
      return res.status(401).json({ error: 'Authentication failed. Wrong credentials.' });
    }

    const token = jwt.sign({ badgeNumber: user.badgeNumber, id: user.id }, process.env.JWT_SECRET);
    res.status(200).json({ badgeNumber: user.badgeNumber, id: user.id, token: `JWT ${token}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
};
