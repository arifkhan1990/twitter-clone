import db from "../../../libs/dbConnection";
import Post from "../../../models/Post";

export default async function handler(req, res) {
  db().catch(() => res.status(405).send({ error: "Error in the Connections" }));

  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const { postId } = req.query;

    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid ID');
    }

    const post = await Post.find({
      where: {
        id: postId,
      },
      include: {
        user: true,
        comments: {
          include: {
            users: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
      },
    });

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
