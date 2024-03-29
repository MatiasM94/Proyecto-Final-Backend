import User from "../models/users.models.js";

class UserManager {
  async find() {
    const users = await User.find({});
    return users;
  }

  async findOne(email) {
    const user = await User.findOne(email);
    return user;
  }

  async create(newUserInfo) {
    const newUser = await User.create(newUserInfo);
    return newUser;
  }

  async updateOne(email, password) {
    const updateUser = await User.updateOne(email, password);
    return updateUser;
  }

  async deleteOne(uid) {
    const deleteUser = await User.deleteOne(uid);
    return deleteUser;
  }
}

export default UserManager;
