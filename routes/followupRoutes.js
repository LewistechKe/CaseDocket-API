// // followupRoutes.js

// import express from 'express';
// import { getAllFollowups, addFollowup, searchFollowup } from '../controllers/followupController.js';

// const router = express.Router();

// router.get('/Followups', getAllFollowups);
// router.get('/Followups/:caseNumber', searchFollowup);
// router.post('/Followups', addFollowup);

// export default router;

// FollowUpRoutes.js

import express from 'express';
import { getAllFollowups, addFollowup } from '../controllers/followupController.js';

const router = express.Router();

// Route to retrieve all follow-up entries
router.get('/followups', getAllFollowups);

// Route to add a new follow-up entry
router.post('/followups', addFollowup);

export default router;






