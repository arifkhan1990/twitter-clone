import db from "../../../libs/dbConnection";
import User from "../../../models/User";

export default async function handler(req, res) {
  db().catch(() => res.status(405).send({ error: "Error in the Connections" }));
  
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const users = await User.find({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
