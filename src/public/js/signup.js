const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dataForm = new FormData(form);
  const obj = {};

  dataForm.forEach((value, key) => (obj[key] = value));

  const { first_name, last_name, age, email, password } = obj;
  if (!first_name || !last_name || !age || !email || !password) return;

  const url = "/api/users/register";
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
    const { exist } = data;
    if (exist) return console.log(data.message);

    const { first_name, last_name, age, email, password } = obj;
    if (first_name && last_name && age && email && password) {
      window.location.href = "http://localhost:3000/";
    }
  } catch (error) {
    console.log(error);
  }
});
