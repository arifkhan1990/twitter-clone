import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';
// Create Schema
const NotificationSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  userId : {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},{ timestamps: true });

const Notification = mongoose.models.Notification || model('Notification', NotificationSchema);

export default Notification;