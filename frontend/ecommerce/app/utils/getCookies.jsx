import { cookies } from "next/headers";

export default function getCookies(tokenName) {
  const cookieStore = cookies();
  const theme = cookieStore.get(tokenName);
  if (!theme) return { error: "no auth token" };
  const cookie = `${theme.name}=${theme.value}`;
  return { cookie };
}
