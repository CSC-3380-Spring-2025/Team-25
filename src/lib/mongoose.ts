// This file connects to MongoDB using Mongoose
// Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.
// It provides a schema-based solution to model your application data.
import mongoose from 'mongoose';

const connectMongo = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};

export default connectMongo;