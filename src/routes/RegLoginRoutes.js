import express from 'express';
import { registerUser, loginUser } from '../controllers/RegLoginController.js';

const RegLoginRoutes = express.Router();

// Register a new user
RegLoginRoutes.post('/register', registerUser);
// Login an existing user
RegLoginRoutes.post('/login', loginUser);


export default RegLoginRoutes;
