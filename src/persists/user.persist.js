import User from "../dao/models/users.models.js";

const createPersistUser = async (newUserInfo) => {
  const newUser = await User.create(newUserInfo);
  return newUser;
};

const findOnePersistUser = async (prop) => {
  const user = await User.findOne(prop);
  return user;
};

export { createPersistUser, findOnePersistUser };
