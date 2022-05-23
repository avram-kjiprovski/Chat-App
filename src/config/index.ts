import mongoose from 'mongoose'

export const dbConnector = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};