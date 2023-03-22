
import serverAuth from "../../../libs/serverAuth";
import db from "../../../libs/dbConnection";
import Post from "../../../models/Post";
import PostFeed from "../../../components/posts/PostFeed";

export default async function handler(req, res) {
  db().catch(() => res.status(405).send({ error: "Error in the Connections" }));
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    
    if (req.method === 'POST') {
      const { currentUser } = await serverAuth(req);
      const { body } = req.body;

      const post = await Post.create({
          body,
          userId: currentUser.id
      });

      return res.status(200).json(post);
    }

    if (req.method === 'GET') {
      const { userId } = req.query;

      let posts;

      if (userId && typeof userId === 'string') {
        posts = await Post.find({
          where: {
            userId
          },
          include: {
            users: true,
            comments: true
          },
          orderBy: {
            createdAt: 'desc'
          },
        });
      } else {

        posts = await Post.find({
          
        });
      }
      console.log(posts);
      return res.status(200).json(posts);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}