// onst { connect } = require('mongoose');
import mongoose from 'mongoose'

const dbConnector = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

export default dbConnector