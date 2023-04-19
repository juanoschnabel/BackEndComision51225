import { promises as fs } from "fs";

export class CartManager {
  constructor(path) {
    this.path = path;
  }
  static incrementarID() {
    if (this.idIncrement) {
      this.idIncrement++;
    } else {
      this.idIncrement = 1;
    }
    return this.idIncrement;
  }
  async createCarrito() {
    const cartsJSON = await fs.readFile(this.path, "utf-8");
    const carts = JSON.parse(cartsJSON);
    const carrito = {
      id: CartManager.incrementarID(),
      products: [],
    };
    carts.push(carrito);
    await fs.writeFile(this.path, "");
    await fs.writeFile(this.path, JSON.stringify(carts));
    return "Carrito creado";
  }
  async getCartById(id) {
    try {
      const cartsJSON = await fs.readFile(this.path, "utf-8");
      const carts = JSON.parse(cartsJSON);
      if (carts.some((cart) => cart.id === parseInt(id))) {
        return carts.find((cart) => cart.id === parseInt(id));
      } else {
        return "Carrito no encontrado";
      }
    } catch (error) {
      return error;
    }
  }

  async addProductCart(id, quantity, idCart) {
    const cartsJSON = await fs.readFile(this.path, "utf-8");
    const carts = JSON.parse(cartsJSON);
    const carrito = carts.find((cart) => cart.id === parseInt(idCart));
    const productIndex = carrito.products.findIndex(
      (product) => product.id === parseInt(id)
    );
    if (productIndex !== -1) {
      carrito.products[productIndex].quantity += parseInt(quantity);
    } else {
      const newProduct = {
        id: parseInt(id),
        quantity: parseInt(quantity),
      };
      carrito.products.push(newProduct);
    }
    const cartIndex = carts.findIndex((cart) => cart.id === parseInt(idCart));
    carts[cartIndex] = carrito;
    await fs.writeFile(this.path, "");
    await fs.writeFile(this.path, JSON.stringify(carts));
  }
}
