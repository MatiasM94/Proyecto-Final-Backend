import mongoose from "mongoose";

const userCollection = "user";

const userSchema = new mongoose.Schema({
  googleId: String,
  first_name: String,
  last_name: String,
  age: Number,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    require: true,
  },
});

const User = mongoose.model(userCollection, userSchema);

export default User;
