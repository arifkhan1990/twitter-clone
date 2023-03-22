import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';
// Create Schema
const CommentSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  userId : {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  CommentId: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }
},
{ timestamps: true });

const Comment = mongoose.models.Comment || model('Comment', CommentSchema);

export default Comment;