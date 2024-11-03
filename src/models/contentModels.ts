import { Schema, model } from 'mongoose';

const contentSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: [String],
});

export default model('Content', contentSchema);
