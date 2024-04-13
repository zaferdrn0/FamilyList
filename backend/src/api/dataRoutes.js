import express from 'express';
import { authenticate } from '../middleware/authentication.js';
import { Group } from '../models/group.js';
import { Data, DataPriority, DataType } from '../models/data.js';
import { wss } from '../index.js';
import { WebSocket } from 'ws';

const router = express.Router();

router.post('/add', authenticate, async (req, res) => {
  try {
    const { name, assignedUsers, dataType, dataPriority, groupId } = req.body;

    const newData = new Data({
      name: name,
      assignedUsers: assignedUsers,
      dataType: dataType,
      dataPriority: dataPriority
    });

    await newData.save();

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    group.data.push(newData._id);
    await group.save();

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


router.delete('/delete', async (req, res) => {
  try {
    const data = await Data.findByIdAndDelete(req.body.id);
    res.json(data);
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/list-priority', async (req, res) => {
  try {
    const data = await DataPriority.find();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/list-type', async (req, res) => {
  try {
    const data = await DataType.find();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;