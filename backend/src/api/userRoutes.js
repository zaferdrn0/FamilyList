import express from 'express';
import { authenticate } from '../middleware/authentication.js';
import { User } from '../models/user.js';
import { Group } from '../models/group.js';
import bcrypt from 'bcrypt';


const router = express.Router();

router.post('/login', async (req, res) => {
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

router.post('/register', async (req, res) => {
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

router.get('/logout', (req, res) => {
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

router.get('/check-auth', (req, res) => {
  if (req.session.userId) {
    // If the session contains a userId, the user is logged in
    res.json({ isLoggedIn: true, userId: req.session.userId });
  } else {
    // If there is no userId in the session, the user is not logged in
    res.json({ isLoggedIn: false });
  }
});

router.get('/current', authenticate, async (req, res) => {
  try {

    const user = await User.findById(req.session.userId)
      .select('-password -__v')
      .populate({
        path: 'invites',
        populate: [
          { path: 'groupId', select: 'name' },
          { path: 'invitedBy', select: 'username' }
        ]
      });

    res.json(user);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/invite-group', authenticate, async (req, res) => {
  try {
    const { groupId, users } = req.body;
    const user = req.session.userId
    const invitePromises = users.map(userId =>
      User.findByIdAndUpdate(userId, {
        $push: { invites: { groupId, invitedBy: user, status: 'pending' } }
      }, { new: true })
    );
    await Promise.all(invitePromises);
    res.status(200).json({ message: 'Invites sent successfully.' });
  } catch (error) {
    console.error('Error sending invites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/list', authenticate, async (req, res) => {
  try {
    // Use the userId from the session to find users where the user is a member
    const users = await User.find().select('username');
    res.json(users);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('/invite-group-reply', authenticate, async (req, res) => {
  try {
    const { groupId, reply } = req.body; // Response and group ID from the frontend
    const userId = req.session.userId; // User ID from the session
    // Find the user and update or delete the invite
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const inviteIndex = user.invites.findIndex(invite => invite.groupId.toString() === groupId);

    // Check if the invite exists
    if (inviteIndex === -1) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    if (reply === 'accepted') {
      // If the invite is accepted, add the user to the group and remove the invite
      await Group.findByIdAndUpdate(groupId, { $addToSet: { users: userId } }); // Add user to the group
      user.invites.splice(inviteIndex, 1); // Remove the invite
    } else if (reply === 'rejected') {
      // If the invite is rejected, just remove the invite
      user.invites.splice(inviteIndex, 1); // Remove the invite
    } else {
      return res.status(400).json({ error: 'Invalid reply' });
    }

    await user.save(); // Update the user
    res.status(200).json({ message: 'Reply processed successfully.' });
  } catch (error) {
    console.error('Error processing invite reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;