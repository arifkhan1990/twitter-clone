import { NextApiRequest, NextApiResponse } from "next";

import db from "../../libs/dbConnection";
import serverAuth from "../../libs/serverAuth";
import Notification from "../../models/Notification";
import User from "../../models/User";

export default async function handler(req, res) {
  db().catch(() => res.status(405).send({ error: "Error in the Connections" }));
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).end();
  }

  try {
    const { userId } = req.body;

    const { currentUser } = await serverAuth(req);

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid ID");
    }

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("Invalid ID");
    }

    let updatedFollowingIds = [...(user.followingIds || [])];

    if (req.method === "POST") {
      updatedFollowingIds.push(userId);

      // NOTIFICATION PART START
      try {
        await Notification.create({
          body: "Someone followed you!",
          userId,
        });

        await User.findOneAndUpdate(
          {
            id: userId,
          },
          { $set: { hasNotification: true } }
        );
      } catch (error) {
        console.log(error);
      }
      // NOTIFICATION PART END
    }

    if (req.method === "DELETE") {
      updatedFollowingIds = updatedFollowingIds.filter(
        (followingId) => followingId !== userId
      );
    }

    const updatedUser = await User.findByIdAndUpdate({
      where: {
        id: currentUser.id,
      },
      data: {
        followingIds: updatedFollowingIds,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
