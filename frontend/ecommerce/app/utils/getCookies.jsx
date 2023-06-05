import { cookies } from "next/headers";

export default function getCookies() {
  const cookieStore = cookies();
  const theme = cookieStore.get("authToken");
  if (!theme) return { error: "no auth token" };
  const cookie = `${theme.name}=${theme.value}`;
  return { cookie };
}
