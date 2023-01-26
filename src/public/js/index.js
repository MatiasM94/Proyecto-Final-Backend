const socket = io();

const container = document.querySelector(".cards-container");

socket.on("realTimeProducts", (arg) => {
  container.innerHTML = "";
  const { productsInJson } = arg;
  productsInJson.forEach((product) => {
    const productList = document.createElement("div");
    productList.innerHTML = `
                <h3>ID: ${product.id}</h3>
                <h3>Title: ${product.title}</h3>
                <h3>Description: ${product.description}</h3>
                <h3>Price: ${product.price}</h3>
                <h3>Status: ${product.status}</h3>
                <h3>stock: ${product.stock}</h3>
                <h3>code: ${product.code}</h3>`;
    productList.className = "cards";
    productList.setAttribute("id", `${product.id}`);
    container.appendChild(productList);
  });
});

socket.on("addProduct", (arg) => {
  const { newProduct } = arg;
  const productList = document.createElement("div");
  productList.innerHTML = `
                <h3>ID: ${newProduct.id}</h3>
                <h3>Title: ${newProduct.title}</h3>
                <h3>Description: ${newProduct.description}</h3>
                <h3>Price: ${newProduct.price}</h3>
                <h3>Status: ${newProduct.status}</h3>
                <h3>stock: ${newProduct.stock}</h3>
                <h3>code: ${newProduct.code}</h3>`;
  productList.className = "cards";
  productList.setAttribute("id", `${newProduct.id}`);
  container.appendChild(productList);
});

socket.on("deleteProduct", (arg) => {
  const { productDelete } = arg;

  const eliminar = document.getElementById(productDelete.id);
  container.removeChild(eliminar);
});
