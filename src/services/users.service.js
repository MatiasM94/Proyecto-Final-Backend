import {
  createPersistUser,
  findOnePersistUser,
} from "../persists/user.persist.js";

const createUser = async (newUserInfo) => {
  try {
    const newUser = await createPersistUser(newUserInfo);
    return newUser;
  } catch (error) {
    console.log(error);
  }
};

const findOneUser = async (email) => {
  try {
    const findUser = await findOnePersistUser(email);
    return findUser;
  } catch (error) {
    console.log(error);
  }
};

export { findOneUser, createUser };
