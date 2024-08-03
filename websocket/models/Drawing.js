import mongoose from 'mongoose';

const DrawingSchema = new mongoose.Schema({
  data: {
    type: Array,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

export default mongoose.models.Drawing || mongoose.model('Drawing', DrawingSchema);
