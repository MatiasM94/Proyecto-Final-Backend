const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dataForm = new FormData(form);
  const obj = {};

  dataForm.forEach((value, key) => (obj[key] = value));

  const url = "/api/user/login";
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

    if (data.message.role === "user" || data.message.role === "admin") {
      return (window.location.href = "http://localhost:3000/products");
    }
    console.log(data);
  } catch (error) {
    console.log(error);
  }
});

function signup() {
  return (window.location.href = "http://localhost:3000/signup");
}
