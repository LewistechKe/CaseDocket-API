import sql from 'mssql';
import config from '../config/database.js';

// RETRIEVE ALL FOLLOW-UP ENTRIES
export const getAllFollowups = async (req, res) => {
  try {
    const pool = await sql.connect(config.sql);
    const query = `SELECT * FROM Followups`;
    const result = await pool.request().query(query);

    const followups = result.recordset;
    res.status(200).json(followups);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while retrieving follow-ups' });
  } finally {
    sql.close();
  }
};

// ADD A NEW FOLLOW-UP
export const addFollowup = async (req, res) => {
  try {
    const { caseNumber, dateFollowedUp, description, actionTaken, status } = req.body;

    const pool = await sql.connect(config.sql);

    const query = `INSERT INTO Followups ( caseNumber, dateFollowedUp, description, actionTaken, status)
                   VALUES ( @caseNumber, @dateFollowedUp, @description, @actionTaken, @status)`;

    const result = await pool.request()
      .input('caseNumber', sql.VarChar(50), caseNumber)
      .input('dateFollowedUp', sql.Date, dateFollowedUp)
      .input('description', sql.NVarChar(sql.MAX), description)
      .input('actionTaken', sql.NVarChar(sql.MAX), actionTaken)
      .input('status', sql.VarChar(20), status)
      .query(query);

    res.status(200).json({ message: 'Follow-up added successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while adding the follow-up' });
  } finally {
    sql.close();
  }
};
