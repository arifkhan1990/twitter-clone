import Notification from '../../../models/Notification';
import User from '../../../models/User';
import db from '../../../libs/dbConnection';

export default async function handler(req, res) {
  db().catch(() => res.status(405).send({ error: "Error in the Connections" }));

  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid ID');
    }

    const notifications = await Notification.find({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    await User.update({
      where: {
        id: userId
      },
      data: {
        hasNotification: false,
      }
    });

    return res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}