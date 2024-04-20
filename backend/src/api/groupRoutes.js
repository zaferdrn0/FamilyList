import express from 'express';
import { authenticate } from '../middleware/authentication.js';
import { Group } from '../models/group.js';

const router = express.Router();

router.get('/list', authenticate, async (req, res) => {
  try {

    // Use the userId from the session to find groups where the user is a member
    const groups = await Group.find({ users: req.session.userId })

    res.json(groups);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/create', async (req, res) => {
  try {
    const newGroup = new Group({
      name: req.body.name,
      users: req.body.users
    })
    await newGroup.save()
    res.json(newGroup);
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.get('/information/:group_id', authenticate, async (req, res) => {
  try {
    const { group_id } = req.params;
    const userId = req.session.userId;

    const group = await Group.findById(group_id)
      .populate({
        path: 'data',
        populate: [
          { path: 'dataType', select: 'name' },
          { path: 'dataPriority', select: 'name' },
          { path: 'assignedUsers', select: 'username' }
        ]
      });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const isUserInGroup = group.users.some(user => user.equals(userId));
    if (!isUserInGroup) {
      return res.status(403).json({ error: 'User not in group' });
    } else {
      res.json(group);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;