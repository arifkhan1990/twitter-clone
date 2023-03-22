
import db from '../../../libs/dbConnection';
import User from "../../../models/User";

export default async function handler(req, res) {
  db().catch(() =>
    res.status(405).send({ error: "Error in the Connections" })
  );

  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid ID');
    }

    const existingUser = await User.find({
      where: {
        id: userId
      }
    });

    const followersCount = await User.count({
      where: {
        followingIds: {
          has: userId
        }
      }
    })

    return res.status(200).json({ ...existingUser, followersCount });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
};
