import bcrypt from "bcrypt";
import User from "../models/User";
import jwt from 'jsonwebtoken';
import { error } from "console";

const loginAuth = async (credentials) => {
  const { email, password } = credentials;

  if (!email || !password) {
    return res.status(400).json({error: { msg: 'Please enter all fields' }});
  }

  try {

    const user = await User.findOne({email});

    if (!user) throw Error('User does not exist');
    
    const isMatch =  bcrypt.compareSync(password, user.password);
    if (!isMatch) throw Error('Invalid credentials');
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 3600 });

    if (!token) throw Error('Couldnt sign the token');

   return {user, token};

  } catch (e) { return {e};}
};

export { loginAuth };
