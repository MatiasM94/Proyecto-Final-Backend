const { cookies } = require("next/headers");

export default async function getToken() {
  const cookieStore = cookies();
  const theme = cookieStore.get("authToken");
  if (!theme) return { error: "no auth token" };
  const cookie = `${theme.name}=${theme.value}`;

  try {
    const response = await fetch("http://localhost:3000/api/auth/current", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${cookie};path=/;expires=Session`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error };
  }
}
