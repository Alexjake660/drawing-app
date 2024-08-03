// pages/api/auth.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { username, password } = req.body;

        if (req.url.includes('signup')) {
          const hashedPassword = await bcrypt.hash(password, 10);
          const user = await User.create({ username, password: hashedPassword });

          res.status(201).json({ success: true, data: user });
        } else if (req.url.includes('login')) {
          const user = await User.findOne({ username });

          if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
          }

          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
          }

          const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1d' });

          res.status(200).json({ success: true, token });
        }
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
