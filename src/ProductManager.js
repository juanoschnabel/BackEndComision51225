import { promises as fs } from "fs";
export class ProductManager {
  constructor(path) {
    this.products = [];
    this.idCounter = 1;
    this.path = path;
  }
  async getProducts() {
    const txt = await fs.readFile(this.path, "utf-8");
    return JSON.parse(txt);
  }

  async getProductById(id) {
    try {
      const prodsJSON = await fs.readFile(this.path, "utf-8");
      const prods = JSON.parse(prodsJSON);
      if (prods.some((prod) => prod.id === parseInt(id))) {
        return prods.find((prod) => prod.id === parseInt(id));
      } else {
        return "Producto no encontrado";
      }
    } catch (error) {
      console.error("Error al leer el archivo JSON:", error);
      return "Error al leer el archivo JSON";
    }
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
      if (!title || title === "") return console.log("Faltan datos de title");
      if (!description || description === "")
        return console.log("Faltan datos de description");
      if (!price || price === "") return console.log("Faltan datos de price");
      if (!code || code === "") return console.log("Faltan datos de code");
      if (!stock || stock === "") return console.log("Faltan datos de stock");
      if (!status || status === "") return (status = true);
      if (!category || category === "") return "Faltan datos de category";
      const codes = this.products.map((product) => product.code);
      if (codes.includes(code)) {
        console.log("Ya existe un producto con este código");
      } else {
        const id = this.idCounter++;
        const product = {
          id,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          status,
          category,
        };
        this.products.push(product);
        this.reescribirTxt("creado");
      }
    } catch (error) {
      return error;
    }
  }

  async updateProduct(
    id,
    { title, description, price, thumbnail, code, status, stock, category }
  ) {
    try {
      const prodsJSON = await fs.readFile(this.path, "utf-8");
      const prods = JSON.parse(prodsJSON);
      if (prods.some((prod) => prod.id === parseInt(id))) {
        let index = prods.findIndex((prod) => prod.id === parseInt(id));
        prods[index].title = title;
        prods[index].description = description;
        prods[index].price = price;
        prods[index].thumbnail = thumbnail;
        prods[index].code = code;
        prods[index].status = status;
        prods[index].stock = stock;
        prods[index].category = category;
        await fs.writeFile(this.path, JSON.stringify(prods));
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
      const prodsJSON = await fs.readFile(this.path, "utf-8");
      const prods = JSON.parse(prodsJSON);
      if (prods.some((prod) => prod.id === parseInt(id))) {
        const prodsFiltrados = prods.filter((prod) => prod.id !== parseInt(id));
        await fs.writeFile(this.path, JSON.stringify(prodsFiltrados));
        return "Producto eliminado";
      } else {
        return "Producto no encontrado";
      }
    } catch (error) {
      return error;
    }
  }
  async reescribirTxt(word) {
    try {
      await fs.writeFile(this.path, "");
      await fs.writeFile(this.path, JSON.stringify(this.products));
      console.log(`producto ${word} exitosamente`);
    } catch (error) {
      console.error(error);
    }
  }
}
