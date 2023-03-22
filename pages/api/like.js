import { NextApiRequest, NextApiResponse } from "next";

import db from '../../libs/dbConnection';
import serverAuth from "../../libs/serverAuth";
import Notification from "../../models/Notification";
import Post from "../../models/Post";
import User from "../../models/User";

export default async function handler(req, res) {
  db().catch(() => res.status(405).send({ error: "Error in the Connections" }));
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).end();
  }

  try {
    const { postId } = req.body;

    const { currentUser } = await serverAuth(req);

    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid ID');
    }

    const post = await Post.findById({
        id: postId
    });

    if (!post) {
      throw new Error('Invalid ID');
    }

    let updatedLikedIds = [...(post.likedIds || [])];

    if (req.method === 'POST') {
      updatedLikedIds.push(currentUser.id);
      
      // NOTIFICATION PART START
      try {
        const post = await Post.findById({
          id: postId
      });
    
        if (post?.userId) {
          await Notification.create({
              body: 'Someone liked your tweet!',
              userId: post.userId
          });
    
          await User.findByIdAndUpdate({
            where: {
              id: post.userId
            },
            data: {
              hasNotification: true
            }
          });
        }
      } catch(error) {
        console.log(error);
      }
      // NOTIFICATION PART END
    }

    if (req.method === 'DELETE') {
      updatedLikedIds = updatedLikedIds.filter((likedId) => likedId !== currentUser?.id);
    }

    const updatedPost = await Post.findByIdAndUpdate({
      where: {
        id: postId
      },
      data: {
        likedIds: updatedLikedIds
      }
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}