import { redirect } from "next/navigation";
import getToken from "./utils/currentFetch";
import Login from "./components/login";

export default async function Ecommerce() {
  const tokenName = "authToken";
  const token = await getToken(tokenName);

  if (token.payload) redirect("/products");
  return (
    <div className="flex justify-center items-center h-screen">
      <Login />
    </div>
  );
}
