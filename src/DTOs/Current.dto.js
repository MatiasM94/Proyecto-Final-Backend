class CurrentDTO {
  constructor(current) {
    this._id = current._id;
    this.nombre = current.nombre;
    this.apellido = current.apellido;
    this.email = current.email;
    this.role = current.role;
  }
}

export default CurrentDTO;
