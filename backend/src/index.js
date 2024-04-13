import express from 'express';
import 'dotenv/config';
import { connectDB } from './config/mongoose.js';
import { sessionMiddleware } from './config/session.js';
import { setupWebSocket } from './config/websocket.js';
import userRoutes from './api/userRoutes.js';
import groupRoutes from './api/groupRoutes.js';
import dataRoutes from './api/dataRoutes.js';
const app = express();
const port = process.env.PORT;

app.use(express.json()); // To process JSON requests

app.use(sessionMiddleware);

// Mongodb database connection
connectDB();
const server = app.listen(4001, () => {
  console.log(`WebSocket server is running on port 4001`);
});
export const wss = setupWebSocket(server);

app.use('/api/user', userRoutes)
app.use('/api/group', groupRoutes)
app.use('/api/data', dataRoutes)
app.listen(port, () => {
  console.log(`Server ${port} port running...`);
});