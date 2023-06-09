import NavBarContainer from "../containers/navBarContainer";
import { redirect } from "next/navigation";
import getToken from "../utils/currentFetch";

export default async function MainLayout({ children }) {
  const tokenName = "authToken";
  const token = await getToken(tokenName);
  if (token.error) {
    return (
      <h1>
        No tienes permisos para ver esta página, inicia sesion para ver el
        contenido
      </h1>
    );
  }
  if (!token.payload) redirect("/");
  return (
    <>
      <NavBarContainer />
      {children}
    </>
  );
}
