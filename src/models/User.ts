import mongoose, { Document, Schema, Model } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  timestamps: true
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
