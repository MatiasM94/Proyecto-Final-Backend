function back() {
  window.history.back();
}

async function comprar(info) {
  console.log("finalizaste la compra");
  const arrayInfo = info.split(",", 2);
  const ticketInfo = {
    priceFinally: arrayInfo[1],
  };
  console.log(ticketInfo);
  const response = await fetch(
    `http://localhost:3000/api/carts/${arrayInfo[0]}/purchase`,
    {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(ticketInfo),
    }
  );
  const data = await response.json();
  console.log(data);
  return;
}
