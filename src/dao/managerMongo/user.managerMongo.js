import User from "../models/users.models.js";

class UserManager {
  async create(newUser) {
    const user = await User.create(newUser);
    return user;
  }

  async findOne(email) {
    const user = await User.findOne({ email });
    return user;
  }
}

export default UserManager;
