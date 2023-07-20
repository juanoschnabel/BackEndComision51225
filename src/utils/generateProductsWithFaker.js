import { fakerES, faker } from "@faker-js/faker";
export const generateProducts = () => {
  return {
    title: fakerES.commerce.productName(),
    description: fakerES.commerce.productDescription(),
    code: fakerES.commerce.department(),
    category: fakerES.commerce.productMaterial(),
    price: fakerES.commerce.price(),
    stock: faker.string.numeric(),
    _id: fakerES.database.mongodbObjectId(),
    thumbnail: faker.image.url(),
  };
};
