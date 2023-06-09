import getCookies from "@/app/utils/getCookies";
import ProfileInfo from "../../components/profile";

export async function getProfile() {
  const tokenName = "authToken";
  const { cookie, error } = getCookies(tokenName);

  if (error) return error;

  const response = await fetch("http://localhost:3000/api/auth/current", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${cookie};path=/;expires=Session`,
    },
    next: { revalidate: 600 },
  });

  const data = await response.json();
  console.log(data);
  return { data };
}

export default async function Profile() {
  const { data } = await getProfile();
  return <ProfileInfo payload={data.payload} />;
}
