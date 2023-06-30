import express from 'express';
import { addCase, exportCases, searchCase, updateCase, getAllCases, getNextCaseNumber } from '../controllers/casesController.js';

const router = express.Router();

router.get('/Cases', getAllCases);
router.get('/Cases/:caseNumber', searchCase);
router.post('/Cases/addCase', addCase);
router.get('/nextCaseNumber', getNextCaseNumber); 
router.get('/export', exportCases);
router.put('/Cases/:id', updateCase);

export default router;
