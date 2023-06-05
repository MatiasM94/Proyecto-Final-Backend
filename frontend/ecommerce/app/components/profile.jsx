export default function ProfileInfo({ payload }) {
  const { nombre, apellido, email, role } = payload;

  return (
    <section>
      <h1>Nombre</h1>
      <p>{nombre}</p>
      <h1>Apellido</h1>
      <p>{apellido}</p>
      <h1>Email</h1>
      <p>{email}</p>
      <h1>Role</h1>
      <p>{role}</p>
    </section>
  );
}
