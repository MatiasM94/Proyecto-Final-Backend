import bcryt from "bcrypt";

export const createHash = (password) => {
  const salt = bcryt.genSaltSync(10);
  const passEncrypted = bcryt.hashSync(password, salt);

  return passEncrypted;
};

export const isValidPassword = (user, password) => {
  const response = bcryt.compareSync(password, user.password);

  return response;
};
