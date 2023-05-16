// import { promises as fs } from "fs";
// export class ProductManager {
//   constructor(path) {
//     this.path = path;
//   }
//   async getProducts() {
//     const txt = await fs.readFile(this.path, "utf-8");
//     const storage = JSON.parse(txt);
//     return storage;
//   }
//   static incrementarID() {
//     if (this.idIncrement) {
//       this.idIncrement++;
//     } else {
//       this.idIncrement = 1;
//     }
//     return this.idIncrement;
//   }
//   async getProductById(id) {
//     const prods = await this.getProducts();
//     if (prods.some((prod) => prod.id === parseInt(id))) {
//       return prods.find((prod) => prod.id === parseInt(id));
//     } else {
//       return false;
//     }
//   }
//   async addProduct(
//     title,
//     description,
//     price,
//     thumbnail,
//     code,
//     status,
//     stock,
//     category
//   ) {
//     const prods = await this.getProducts();
//     try {
//       if (!title || title === "") {
//         console.log('"Faltan datos de title"');
//         return "Faltan datos de title";
//       }
//       if (!description || description === "") {
//         console.log("Faltan datos de description");
//         return "Faltan datos de description";
//       }
//       if (!price || price === "") {
//         console.log("Faltan datos de price");
//         return "Faltan datos de price";
//       }
//       if (!code || code === "") {
//         console.log("Faltan datos de code");
//         return "Faltan datos de code";
//       }
//       if (!stock || stock === "") {
//         console.log("Faltan datos de stock");
//         return "Faltan datos de stock";
//       }
//       if (status === "") {
//         status = true;
//       }
//       if (!category || category === "") {
//         console.log("Faltan datos de category");
//         return "Faltan datos de category";
//       }
//       if (prods.some((prod) => prod.code === code)) {
//         console.log("Ya existe un producto con este código");
//         return "Ya existe un producto con este código";
//       } else {
//         const id = ProductManager.incrementarID();
//         const product = {
//           id,
//           title,
//           description,
//           price,
//           thumbnail,
//           code,
//           stock,
//           status,
//           category,
//         };
//         prods.push(product);
//         await this.reescribirTxt("creado", prods);
//         return null;
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   async updateProduct(
//     id,
//     { title, description, price, thumbnail, code, status, stock, category }
//   ) {
//     try {
//       const prods = await this.getProducts();
//       if (prods.some((prod) => prod.id === parseInt(id))) {
//         let index = prods.findIndex((prod) => prod.id === parseInt(id));
//         prods[index].title = title;
//         prods[index].description = description;
//         prods[index].price = price;
//         prods[index].thumbnail = thumbnail;
//         prods[index].code = code;
//         prods[index].status = status;
//         prods[index].stock = stock;
//         prods[index].category = category;
//         await this.reescribirTxt("actualizado", prods);
//         return "Producto actualizado";
//       } else {
//         return "Producto no encontrado";
//       }
//     } catch (error) {
//       return error;
//     }
//   }

//   async deleteProduct(id) {
//     try {
//       const prods = await this.getProducts();
//       if (prods.some((prod) => prod.id === parseInt(id))) {
//         const prodsFiltrados = prods.filter((prod) => prod.id !== parseInt(id));
//         await this.reescribirTxt("eliminado", prodsFiltrados);
//         return "Producto eliminado";
//       } else {
//         return "Producto no encontrado";
//       }
//     } catch (error) {
//       return error;
//     }
//   }
//   async reescribirTxt(word, prods) {
//     try {
//       await fs.writeFile(this.path, "");
//       await fs.writeFile(this.path, JSON.stringify(prods));
//       return `producto ${word} exitosamente`;
//     } catch (error) {
//       console.error(error);
//     }
//   }
// }

/*
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

  static incrementarID() {
    if (this.idIncrement) {
      this.idIncrement++;
    } else {
      this.idIncrement = 1;
    }
    return this.idIncrement;
  }

  async getProductById(id) {
    const client = await MongoClient.connect(this.uri);
    const collection = client.db(this.dbName).collection(this.collectionName);
    const product = await collection.findOne({ id: parseInt(id) });
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
      if (!title || title === "") {
        console.log('"Faltan datos de title"');
        return "Faltan datos de title";
      }
      if (!description || description === "") {
        console.log("Faltan datos de description");
        return "Faltan datos de description";
      }
      if (!price || price === "") {
        console.log("Faltan datos de price");
        return "Faltan datos de price";
      }
      if (!code || code === "") {
        console.log("Faltan datos de code");
        return "Faltan datos de code";
      }
      if (!stock || stock === "") {
        console.log("Faltan datos de stock");
        return "Faltan datos de stock";
      }
      if (status === "") {
        status = true;
      }
      if (!category || category === "") {
        console.log("Faltan datos de category");
        return "Faltan datos de category";
      }

      const client = await MongoClient.connect(this.uri);
      const collection = client.db(this.dbName).collection(this.collectionName);

      if (await collection.findOne({ code })) {
        console.log("Ya existe un producto con este código");
        return "Ya existe un producto con este código";
      } else {
        const id = ProductManager.incrementarID();
        const product = {
          // _id,
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
      }
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

      if (await collection.findOne({ id: parseInt(id) })) {
        await collection.updateOne(
          { id: parseInt(id) },
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

      if (await collection.findOne({ _id: ObjectId(id) })) {
        await collection.deleteOne({ _id: ObjectId(id) });
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
*/
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
      if (!title || title === "") {
        console.log('"Faltan datos de title"');
        return "Faltan datos de title";
      }
      if (!description || description === "") {
        console.log("Faltan datos de description");
        return "Faltan datos de description";
      }
      if (!price || price === "") {
        console.log("Faltan datos de price");
        return "Faltan datos de price";
      }
      if (!code || code === "") {
        console.log("Faltan datos de code");
        return "Faltan datos de code";
      }
      if (!stock || stock === "") {
        console.log("Faltan datos de stock");
        return "Faltan datos de stock";
      }
      if (status === "") {
        status = true;
      }
      if (!category || category === "") {
        console.log("Faltan datos de category");
        return "Faltan datos de category";
      }

      const client = await MongoClient.connect(this.uri);
      const collection = client.db(this.dbName).collection(this.collectionName);

      if (await collection.findOne({ code })) {
        console.log("Ya existe un producto con este código");
        return "Ya existe un producto con este código";
      } else {
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
      }
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
