/*
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
*/
import { MongoClient, ObjectId } from "mongodb";

export class CartManager {
  constructor(uri, dbName, collectionName) {
    this.uri = uri;
    this.dbName = dbName;
    this.collectionName = collectionName;
  }
  async getCarts() {
    const client = await MongoClient.connect(this.uri);
    const collection = client.db(this.dbName).collection(this.collectionName);
    const carts = await collection.find().toArray();
    client.close();
    return carts;
  }
  async createCarrito(data) {
    const client = await MongoClient.connect(this.uri);
    const collection = client.db(this.dbName).collection(this.collectionName);
    const newCart = { products: data };
    await collection.insertOne(newCart);
    client.close();
  }
  async addProductCart(id, quantity, idCart) {
    const carrito = await Carrito.findOneAndUpdate(
      { _id: idCart, "products.id": id },
      { $inc: { "products.$.quantity": quantity } },
      { new: true }
    );
    if (!carrito) {
      await Carrito.findOneAndUpdate(
        { _id: idCart },
        { $push: { products: { id, quantity } } }
      );
    }
  }
}
