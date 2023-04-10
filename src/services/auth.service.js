import {
  createPersistUser,
  findOnePersistUser,
} from "../persists/user.persist.js";

const createUser = async (newUserInfo) => {
  try {
    if (user) {
      console.log("El usuario ya existe");
      return done(null, true);
    }

    const newUserInfo = {
      first_name,
      last_name,
      email: username,
      age,
      password: createHash(password),
    };

    if (username === "adminCoder@coder.com") {
      newUserInfo.role = "admin";
    } else {
      newUserInfo.role = "user";
    }

    const newUser = await createPersistUser(newUserInfo);
  } catch (error) {
    console.log(error);
  }
};

const findOneUser = async (email) => {
  const findUser = await findOnePersistUser(email);
  return findUser;
};

export { createUser, findOneUser };
