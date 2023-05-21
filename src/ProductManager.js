import { MongoClient, ObjectId } from "mongodb";

export class ProductManager {
  constructor(uri, dbName, collectionName) {
    this.uri = uri;
    this.dbName = dbName;
    this.collectionName = collectionName;
  }

  async getProducts() {
    const client = await MongoClient.connect(this.uri);
    const collection = client.db(this.dbName).collection(this.collectionName);
    const products = await collection.find().toArray();
    client.close();
    return products;
  }

  async getProductById(id) {
    const client = await MongoClient.connect(this.uri);
    const collection = client.db(this.dbName).collection(this.collectionName);
    const product = await collection.findOne({ _id: ObjectId(id) });
    client.close();
    return product;
  }

  async addProduct(
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    stock,
    category
  ) {
    try {
      const client = await MongoClient.connect(this.uri);
      const collection = client.db(this.dbName).collection(this.collectionName);
      const product = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      };
      await collection.insertOne(product);
      client.close();
      return null;
    } catch (error) {
      console.error(error);
    }
  }

  async updateProduct(
    id,
    { title, description, price, thumbnail, code, status, stock, category }
  ) {
    try {
      const client = await MongoClient.connect(this.uri);
      const collection = client.db(this.dbName).collection(this.collectionName);

      if (await collection.findOne({ _id: ObjectId(id) })) {
        await collection.updateOne(
          { _id: ObjectId(id) },
          {
            $set: {
              title,
              description,
              price,
              thumbnail,
              code,
              status,
              stock,
              category,
            },
          }
        );
        client.close();
        return "Producto actualizado";
      } else {
        return "Producto no encontrado";
      }
    } catch (error) {
      return error;
    }
  }

  async deleteProduct(id) {
    try {
      const client = await MongoClient.connect(this.uri);
      const collection = client.db(this.dbName).collection(this.collectionName);

      if (await collection.findOne({ _id: new ObjectId(id) })) {
        await collection.deleteOne({ _id: new ObjectId(id) });
        client.close();
        return "Producto eliminado";
      } else {
        return "Producto no encontrado";
      }
    } catch (error) {
      return error;
    }
  }
}
