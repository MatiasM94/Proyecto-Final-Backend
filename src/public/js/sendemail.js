const form = document.getElementById("restablecerPassword");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dataForm = new FormData(form);
  const obj = {};

  dataForm.forEach((value, key) => (obj[key] = value));

  const url = "/api/mail";
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

    window.location.href = "http://localhost:3000/verificacion";
  } catch (error) {
    console.log(error);
  }
});
