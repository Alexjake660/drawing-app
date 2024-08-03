// pages/api/drawings.js
import dbConnect from '../../utils/dbConnect';
import Drawing from '../../models/Drawing';
import { verify } from 'jsonwebtoken';

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const drawings = await Drawing.find({}).populate('createdBy', 'username');
        res.status(200).json({ success: true, data: drawings });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = verify(token, 'your_jwt_secret');
        const { data } = req.body;

        const drawing = await Drawing.create({ data, createdBy: decoded.id });
        res.status(201).json({ success: true, data: drawing });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
