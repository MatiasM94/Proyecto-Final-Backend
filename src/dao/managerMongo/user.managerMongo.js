import User from "../models/users.models.js";

class UserManager {
  async findOne(email) {
    const user = await User.findOne(email);
    return user;
  }

  async create(newUserInfo) {
    const newUser = await User.create(newUserInfo);
    return newUser;
  }

  async update(email, password) {
    const updateUser = await User.updateOne(email, password);
    return updateUser;
  }
}

export default UserManager;
