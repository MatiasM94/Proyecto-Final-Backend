function back() {
  window.history.back();
}

async function comprar(info) {
  const arrayInfo = info.split(",", 2);
  const id = arrayInfo[0];
  const ticketInfo = {
    priceFinally: arrayInfo[1],
  };
  console.log(ticketInfo);
  const response = await fetch(
    `http://localhost:3000/api/carts/${id}/purchase`,
    {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({ ticketInfo, id }),
    }
  );
  const data = await response.json();
  console.log(data);
  window.location.href = "http://localhost:3000/products";
  return;
}
