import { faker } from "@faker-js/faker";

faker.locale = "es";

export const generateProduct = () => {
  const products = [];
  const productsInfo = {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    status: faker.datatype.boolean(),
    thumbnails: [{ url: faker.image.imageUrl() }],
    stock: faker.random.numeric(2),
    code: faker.database.mongodbObjectId(),
    category: faker.commerce.product(),
  };

  for (let i = 0; i < 100; i++) {
    products.push(productsInfo);
  }
  return products;
};
