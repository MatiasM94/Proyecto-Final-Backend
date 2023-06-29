import { createHash } from "../utils/cryptPassword.utils.js";

class UserDTO {
  constructor(user) {
    this.googleId = user?.googleId;
    this.first_name = user.body.first_name;
    this.last_name = user.body.last_name;
    this.age = user.body?.age;
    this.email = user.username;
    this.password = createHash(user.password);
  }
}

export default UserDTO;
