import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  bio: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  emailVerified: {
    type: Date,
  },
  image: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  followingIds: {
    type: [String],
  },
  hasNotification: {
    type: Boolean,
    default: false
  },
  posts: {
    type: [Schema.Types.ObjectId],
    ref: 'Post',
  },
  comments: {
    type: [Schema.Types.ObjectId],
    ref: 'Comment',
  },
  notifications: {
    type: [Schema.Types.ObjectId],
    ref: 'Notification',
  }
},{ timestamps: true });

const User = mongoose.models.User || model('User', UserSchema);

export default User;