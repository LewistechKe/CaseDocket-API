import sql from "mssql";
import exceljs from "exceljs";
import config from "../config/database.js";

// Regular expression to validate case number format
const caseNumberRegex = /^CASE00[1-9]$|^CASE0[1-9][0-9]$|^CASE100$/;

// Logic to retrieve the highest existing case number
export const getNextCaseNumber = async (req, res) => {
	try {
		await sql.connect(config.sql);
		const request = new sql.Request();

		// Query to retrieve the highest existing case number
		const query =
			"SELECT MAX(CAST(SUBSTRING(caseNumber, 5, LEN(caseNumber) - 4) AS INT)) AS maxCaseNumber FROM Cases;";

		const result = await request.query(query);
		let maxCaseNumber = result.recordset[0].maxCaseNumber;

		// Calculate the next case number
		let nextCaseNumber = "CASE001";
		if (maxCaseNumber) {
			maxCaseNumber++;
			const currentNumber = "CASE" + maxCaseNumber.toString().padStart(3, "0");
			nextCaseNumber = currentNumber;
		}

		res.status(200).json({ nextCaseNumber });
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({
			message: "An error occurred while retrieving the next case number",
		});
	} finally {
		sql.close();
	}
};

// Logic to add a new case
export const addCase = async (req, res) => {
	try {
		await sql.connect(config.sql);

		const {
			caseNumber,
			incidentType,
			dateCaseAdded,
			description,
			actionTaken,
			imageData,
			status,
		} = req.body;

		// Validate case number format
		if (!caseNumberRegex.test(caseNumber)) {
			return res.status(400).json({ message: "Invalid case number format" });
		}

		const request = new sql.Request();

		// Check if case number already exists
		const checkQuery = `SELECT * FROM Cases WHERE caseNumber = @caseNumber`;
		request.input("caseNumber", sql.VarChar(50), caseNumber);
		const { recordset } = await request.query(checkQuery);

		if (recordset.length > 0) {
			return res.status(400).json({ message: "Case number already exists" });
		}

		const query = `INSERT INTO Cases (caseNumber, incidentType, dateCaseAdded, description, actionTaken, imageData, status)
                   VALUES (@caseNumber, @incidentType, @dateCaseAdded, @description, @actionTaken, @imageData, @status)`;

		// request.input("caseNumber", sql.VarChar(50), caseNumber);
		request.input("incidentType", sql.VarChar(50), incidentType);
		request.input("dateCaseAdded", sql.Date, dateCaseAdded);
		request.input("description", sql.NVarChar(sql.MAX), description);
		request.input("actionTaken", sql.NVarChar(sql.MAX), actionTaken);
		request.input("imageData", sql.VarBinary(sql.MAX), imageData);
		request.input("status", sql.VarChar(20), status);

		await request.query(query);

		res.status(200).json({ message: "Case added successfully" });
	} catch (error) {
		console.error("Error:", error);
		res
			.status(500)
			.json({ message: "An error occurred while adding the case" });
	} finally {
		sql.close();
	}
};

// EXPORT CASES AS AN EXCEL FILE
export const exportCases = async (req, res) => {
	try {
		await sql.connect(config.sql);
		const request = new sql.Request();

		const query = "SELECT * FROM Cases";
		const result = await request.query(query);

		const workbook = new exceljs.Workbook();
		const worksheet = workbook.addWorksheet("Cases");

		worksheet.columns = [
			{ header: "ID", key: "id", width: 10 },
			{ header: "Case Number", key: "caseNumber", width: 20 },
			{ header: "Incident Type", key: "incidentType", width: 20 },
			{ header: "Date Case Added", key: "dateCaseAdded", width: 15 },
			{ header: "Description", key: "description", width: 30 },
			{ header: "Action Taken", key: "actionTaken", width: 30 },
			{ header: "Status", key: "status", width: 15 },
		];

		result.recordset.forEach((caseData) => {
			worksheet.addRow(caseData);
		});

		res.setHeader(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		);
		res.setHeader("Content-Disposition", "attachment; filename=cases.xlsx");

		await workbook.xlsx.write(res);

		res.end();
	} catch (error) {
		console.error("Error:", error);
		res
			.status(500)
			.json({ message: "An error occurred while exporting the cases" });
	} finally {
		sql.close();
	}
};

// LOGIC TO SEARCH FOR A SPECIFIC CASE
export const searchCase = async (req, res) => {
	try {
		await sql.connect(config.sql);
		const { caseNumber } = req.params;
		const request = new sql.Request();

		const query = `SELECT * FROM Cases WHERE caseNumber = @caseNumber`;

		request.input("caseNumber", sql.VarChar(50), caseNumber);
		const result = await request.query(query);
		const caseDetails = result.recordset[0];

		res.status(200).json(caseDetails);
	} catch (error) {
		console.error("Error:", error);
		res
			.status(500)
			.json({ message: "An error occurred while searching for the case" });
	} finally {
		sql.close();
	}
};

// LOGIC TO UPDATE A CASE
export const updateCase = async (req, res) => {
	try {
		const { id } = req.params;
		const { incidentType, dateCaseAdded, description, actionTaken, status } =
			req.body;

		await sql.connect(config.sql);

		const request = new sql.Request();

		const query = `UPDATE Cases SET
                   incidentType = @incidentType,
                   dateCaseAdded = @dateCaseAdded,
                   description = @description,
                   actionTaken = @actionTaken,
                   status = @status
                   WHERE id = @id`;

		request.input("incidentType", sql.VarChar(50), incidentType);
		request.input("dateCaseAdded", sql.Date, dateCaseAdded);
		request.input("description", sql.NVarChar(sql.MAX), description);
		request.input("actionTaken", sql.NVarChar(sql.MAX), actionTaken);
		request.input("status", sql.VarChar(20), status);
		request.input("id", sql.Int, id);

		await request.query(query);

		res.status(200).json({ message: "Case updated successfully" });
	} catch (error) {
		console.error("Error:", error);
		res
			.status(500)
			.json({ message: "An error occurred while updating the case" });
	} finally {
		sql.close();
	}
};

// LOGIC TO GET ALL CASES
export const getAllCases = async (req, res) => {
	try {
		await sql.connect(config.sql);
		const request = new sql.Request();
		const query = "SELECT * FROM Cases";
		const result = await request.query(query);
		res.status(200).json(result.recordset);
	} catch (error) {
		console.error("Error:", error);
		res
			.status(500)
			.json({ message: "An error occurred while getting all cases" });
	} finally {
		sql.close();
	}
};
