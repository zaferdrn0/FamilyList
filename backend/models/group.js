import mongoose from 'mongoose';
const { Schema } = mongoose;

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }]
});

export const Group = mongoose.model('groups', GroupSchema);
