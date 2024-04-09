import express from 'express';
import mongoose from 'mongoose';
import { User } from './models/user.js';
const app = express();
const port = 4000;

app.use(express.json()); // To process JSON requests

// Mongodb database connection
mongoose.connect('mongodb://localhost:27017/FamilyList')
  .then(() => console.log('Successfully connect Mongo DB'))
  .catch(err => console.error('MongoDB connect error:', err));

app.listen(port, () => {
  console.log(`Server ${port} port running...`);
});
