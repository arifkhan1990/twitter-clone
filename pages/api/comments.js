
import serverAuth from "../../libs/serverAuth";
import db from "../../libs/dbConnection";
import Comment from "../../models/Comment";
import Post from "../../models/Post";
import Notification from "../../models/Notification";
import User from "../../models/User";

export default async function handler(req, res) {
  db().catch(() => res.status(405).send({ error: "Error in the Connections" }));

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { currentUser } = await serverAuth(req);
    const { body } = req.body;
    const { postId } = req.query;

    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid ID');
    }

    const comment = await Comment.create({
      data: {
        body,
        userId: currentUser.id,
        postId
      }
    });

    // NOTIFICATION PART START
    try {
      const post = await Post.find({
        where: {
          id: postId,
        }
      });

      if (post?.userId) {
        await Notification.create({
          data: {
            body: 'Someone replied on your tweet!',
            userId: post.userId
          }
        });

        await User.update({
          where: {
            id: post.userId
          },
          data: {
            hasNotification: true
          }
        });
      }
    }
    catch (error) {
      console.log(error);
    }
    // NOTIFICATION PART END

    return res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}