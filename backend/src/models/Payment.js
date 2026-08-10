import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  provider: { type: String, enum: ['razorpay'], required: true },
  providerOrderId: { type: String, index: true },
  providerPaymentId: { type: String, index: true },
  status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
