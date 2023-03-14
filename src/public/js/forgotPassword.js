const form = document.getElementById("forgotPasswordForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dataForm = new FormData(form);
  const obj = {};

  dataForm.forEach((value, key) => (obj[key] = value));

  const url = "/auth/forgotpassword";
  const headers = {
    "Content-Type": "application/json",
  };
  const method = "PATCH";
  const body = JSON.stringify(obj);

  try {
    const response = await fetch(url, {
      headers,
      method,
      body,
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
});
