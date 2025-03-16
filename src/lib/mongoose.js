// This file connects to MongoDB using Mongoose
//Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. 
//It provides a schema-based solution to model your application data.
import mongoose from 'mongoose';

const connectMongo = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectMongo;