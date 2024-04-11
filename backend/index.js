import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import session from 'express-session';
import WebSocket, { WebSocketServer } from 'ws';
import MongoStore from 'connect-mongo';
import { User } from './models/user.js';
import { Data, DataPriority, DataType } from './models/data.js';
const app = express();
const port = process.env.PORT;

app.use(express.json()); // To process JSON requests

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false, 
  saveUninitialized: false, 
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_ADDRESS }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 
  }
}));

// Mongodb database connection
mongoose.connect(process.env.MONGODB_ADDRESS)
  .then(() => console.log('Successfully connect Mongo DB'))
  .catch(err => console.error('MongoDB connect error:', err));

const server = app.listen(4001, () => {
  console.log(`Server is running on port 4001`);
});

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
  
  app.post('/api/add-data', async (req, res) => {
    try {
      const newData = new Data(
        {
         name: req.body.name,
         assignedUsers: req.body.assignedUsers,
         dataType: req.body.type,
         dataPriority: req.body.priority
        })
        
      await newData.save()
      const populatedData = await Data.findById(newData._id)
      .populate('dataType', 'name')
      .populate('dataPriority', 'name');
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(populatedData));
        }
      });
  
      res.json(populatedData);
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/get-data', async (req, res) => {
    try {
      const data = await Data.find()
        .populate('dataType')
        .populate('dataPriority');
      res.json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/delete-data', async (req, res) =>{
    try {
      const data = await Data.findByIdAndDelete(req.body.id);
      res.json(data);
    } catch (error) { 
      console.error('Error deleting data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  app.get('/api/get-data-priority', async (req, res) => {
    try {
      const data = await DataPriority.find(); // Tüm verileri çek
      res.json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    } 
  });

  app.get('/api/get-data-type', async (req, res) => { 
    try {
      const data = await DataType.find(); // Tüm verileri çek
      res.json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    } 
  });

  app.post('/api/user-register', async (req, res) => {
    try {
      const { username, password } = req.body;

      // Check if username or password is empty
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }

      // Additional validations for username and password can be performed here
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      }

      // Create a new user
      const newUser = new User({
        username,
        password,
        groups: [] // Groups initially empty
      });

      // Save the user to the database
      await newUser.save();

      // Send a successful response
      res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
      console.error('User creation process error:', error);

      // You can make the error message more specific
      // For instance, handling a unique constraint violation from MongoDB
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Username is already taken.' });
      }

      // General error response
      res.status(500).json({ message: 'User creation process error.' });
    }
});


app.post('/api/user-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database by username
    const user = await User.findOne({ username });
    if (!user) {
      // If the user is not found, return a 400 status with a user not found message
      return res.status(400).json({ message: 'User not found.' });
    }

    // Compare the submitted password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If the passwords do not match, return a 400 status with an invalid password message
      return res.status(400).json({ message: 'Invalid password.' });
    }
    
    // If the user is verified, initialize the session
    req.session.userId = user._id; // Save the user's ID in the session
    req.session.username = user.username; // Optionally save other user details in the session
    
    // Send a successful login response
    res.json({ message: 'User logged in successfully.', session: req.session });
  } catch (error) {
    // Log any errors and return a 500 status with a login process error message
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login process error.' });
  }
});

app.get('/api/logout', (req, res) => {
  // Destroy the user's session to log them out
  req.session.destroy(err => {
    if (err) {
      // If there was an error destroying the session, return an error response
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout process error.' });
    }
    
    // Clear the session cookie
    res.clearCookie('connect.sid');
    
    // Send a successful logout response
    res.json({ message: 'Logged out successfully.' });
  });
});

app.get('/api/check-auth', (req, res) => {
  if (req.session.userId) {
    // If the session contains a userId, the user is logged in
    res.json({ isLoggedIn: true, userId: req.session.userId });
  } else {
    // If there is no userId in the session, the user is not logged in
    res.json({ isLoggedIn: false });
  }
});

app.listen(port, () => {
  console.log(`Server ${port} port running...`);
});
