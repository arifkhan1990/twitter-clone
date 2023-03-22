import bcrypt from "bcrypt";
import db from "../../libs/dbConnection";
import User from "../../models/User";

export default async function handler(req, res) {
  db().catch(() =>
    res.status(405).send({ error: "Error in the Connections" })
  );

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
    return res.status(200).json(user);
  } catch (error) {
    console.log({ error });
    return res.status(400).end();
  }
}
