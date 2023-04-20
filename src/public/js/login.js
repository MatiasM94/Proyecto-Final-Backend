const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dataForm = new FormData(form);
  const obj = {};

  dataForm.forEach((value, key) => (obj[key] = value));

  const url = "/api/auth/login";
  const headers = {
    "Content-Type": "application/json",
  };
  const method = "POST";
  const body = JSON.stringify(obj);

  try {
    const response = await fetch(url, {
      headers,
      method,
      body,
    });
    const data = await response.json();
    console.log(data);
    if (data.role === "user" || data.role === "admin") {
      return (window.location.href = "http://localhost:3000/products");
    }
  } catch (error) {
    console.log(error);
  }
});

function signup() {
  return (window.location.href = "http://localhost:3000/signup");
}
