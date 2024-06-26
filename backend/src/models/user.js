import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const inviteSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'groups',
    required: true
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'groups'
  }],
  invites: [inviteSchema]
});
// Pre-save hook to hash the password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with our new salt
    const hash = await bcrypt.hash(this.password, salt);
    // Override the plaintext password with the hashed one
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

export const User = mongoose.model('users', userSchema);
