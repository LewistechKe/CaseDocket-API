
import express from 'express';
import { addUser, getUsers } from '../controllers/adminController.js';

const router = express.Router();

// Route to add a user
router.post('/users', addUser);

// Route to get all users
router.get('/users', getUsers);

export default router;
