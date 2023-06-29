class UsersInfoDTO {
  constructor(user) {
    this.id = user._id;
    this.nombre = user.first_name;
    this.apellido = user.last_name;
    this.email = user.email || user.googleId;
    this.rol = user.role;
    this.last_connection = user.last_connection || null;
  }
}

export default UsersInfoDTO;
