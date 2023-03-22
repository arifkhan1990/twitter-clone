import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';
// Create Schema
const PostSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  userId : {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  likedIds: [Schema.Types.ObjectId],
  image: String,
  comments: []
},{ timestamps: true });

const Post = mongoose.models.Post || model('Post', PostSchema);

export default Post;