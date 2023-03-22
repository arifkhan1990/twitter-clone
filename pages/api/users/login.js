import db from "../../../libs/dbConnection";
import User from "../../../models/User";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    console.log("HI");
  db().catch(() => res.status(405).send({ error: "Error in the Connections" }));
  
  if (req.method !== "GET") {
    return res.status(405).end();
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({error: { msg: 'Please enter all fields' }});
  }

  
  try {

    const user = await User.findOne({email: email});
    if (!user) throw Error('User does not exist');
    
    const isMatch =  bcrypt.compareSync(password, user.password);
    if (!isMatch) throw Error('Invalid credentials');
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 3600 });
    if (!token) throw Error('Couldnt sign the token');

   return res.status(200).json({
      token,
      status: 'success',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(400).end();
  }
}