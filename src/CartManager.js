import { MongoClient } from "mongodb";

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
