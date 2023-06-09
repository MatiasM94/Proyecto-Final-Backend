import PasswordResetForm from "@/app/components/PasswordResetForm";
import getToken from "@/app/utils/currentFetch";
import getCookies from "@/app/utils/getCookies";
import { redirect, useRouter } from "next/navigation";

export default async function RestorePassword() {
  const tokenName = "emailToken";
  const token = await getToken(tokenName);
  if (!token.payload) redirect("/");

  return <PasswordResetForm />;
}
