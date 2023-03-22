import serverAuth from "../../libs/serverAuth";
import db from "../../libs/dbConnection";
import User from "../../models/User";

export default async function handler(req, res) {
  db().catch(() => res.status(405).send({ error: "Error in the Connections" }));

  if (req.method !== 'PATCH') {
    return res.status(405).end();
  }

  try {
    const { currentUser } = await serverAuth(req);

    const { name, username, bio, profileImage, coverImage } = req.body;

    if (!name || !username) {
      throw new Error('Missing fields');
    }

    const updatedUser = await User.findByIdAndUpdate(
      {
        id: currentUser.id,
      }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}