import { getSession } from "next-auth/react";
import User from "../models/User";

import db from "./dbConnection";

const serverAuth = async (req) => {
  db().catch(() => res.status(405).send({ error: "Error in the Connections" }));
  const session = await getSession({ req });

  if (!session?.user?.email) {
    throw new Error("Not signed in");
  } else {
    const currentUser = await User.findOne({
      email: session.user.email,
    });
    
    if (!currentUser) {
      throw new Error("Not signed in");
    }

    return { currentUser };
  }
};

export default serverAuth;
