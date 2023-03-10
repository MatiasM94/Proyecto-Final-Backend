function pageController(page) {
  if (!page) return;
  window.location.href = `http://localhost:3000/products?page=${page}`;
}

let cart;
async function addToCart(pid) {
  try {
    const productToAdd = { product: pid };

    if (cart) {
      const response = await fetch(`http://localhost:3000/api/carts/${cart}`, {
        method: "PATCH",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(productToAdd),
      });
      const data = await response.json();
      console.log(data);
      return;
    }

    const response = await fetch("http://localhost:3000/api/carts/", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(productToAdd),
    });
    const data = await response.json();
    console.log(data);
    cart = data.cartAdded._id;
    return;
  } catch (error) {
    console.log(error);
  }
}

function goToCart() {
  if (!cart) return;
  window.location.href = `http://localhost:3000/carts/${cart}`;
}

function logout() {
  window.location.href = "http://localhost:3000/auth/logout";
}
