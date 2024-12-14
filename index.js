import express from 'express';
import { config } from 'dotenv';
import {DBconn, gracefulShutdown} from './DBconn.js';
import RegLoginRoutes from './src/routes/RegLoginRoutes.js'
import CustomerRoutes from './src/routes/CustomerRoutes.js'
import CallRoutes from './src/routes/CallRoutes.js'
import cors from 'cors';
import jwt from 'jsonwebtoken';

// Load environment variables
config();

const port = process.env.PORT || 5000;
const app = express();

// Connect to the database
DBconn();
// Setup graceful shutdown
gracefulShutdown();


// CORS configuration
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.sendStatus(401); // Unauthorized

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden

    // Create a new access token
    const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ accessToken: newAccessToken });
  });
});


app.use('/api/users', RegLoginRoutes);
app.use('/api/customer' , CustomerRoutes);
app.use('/api/call' , CallRoutes);

// Health Check Route (for testing)
app.get('/', (req, res) => {
  res.send('Hello world!');
});

// Global error handler for unhandled errors
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).send('Internal server error');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})