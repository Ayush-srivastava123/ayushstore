import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  storageKey: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date
}, { timestamps: true });

prescriptionSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Prescription', prescriptionSchema);
