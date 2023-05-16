import { MongoClient } from "mongodb";

export class MessagesManager {
  constructor(uri, dbName, collectionName) {
    this.uri = uri;
    this.dbName = dbName;
    this.collectionName = collectionName;
  }

  async addMessage(user, message) {
    try {
      const client = await MongoClient.connect(this.uri);
      const collection = client.db(this.dbName).collection(this.collectionName);
      const mensaje = {
        user,
        message,
      };
      await collection.insertOne(mensaje);
      client.close();
    } catch (error) {
      console.error(error);
    }
  }
}
