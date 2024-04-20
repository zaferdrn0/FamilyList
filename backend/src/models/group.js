import mongoose from 'mongoose';
const { Schema } = mongoose;

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],
  data: [{
    type: Schema.Types.ObjectId,
    ref: 'Data'
  }],
  invitedUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }]
});

export const Group = mongoose.model('groups', GroupSchema);
