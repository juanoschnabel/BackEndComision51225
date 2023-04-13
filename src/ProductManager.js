import { promises as fs } from "fs";
export class ProductManager {
  constructor(path) {
    this.products = [];
    this.idCounter = 1;
    this.path = path;
  }

  async getProducts() {
    const txt = await fs.readFile(this.path, "utf-8");
    return txt;
  }
  async getProductsFromFile() {
    return this.products;
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

  async addProduct(title, description, price, thumbnail, code, stock) {
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
      };
      this.products.push(product);
      try {
        this.reescribirTxt("creado");
      } catch (error) {
        return error;
      }
    }
  }
  async updateProduct(id, campo, valor) {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      product[campo] = valor;
      try {
        this.reescribirTxt("actualizado");
      } catch (error) {
        return error;
      }
    } else {
      console.log("Producto no encontrado");
    }
  }

  async deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      const prod = this.products;
      console.log(prod);
      try {
        this.reescribirTxt("eliminado");
      } catch (error) {
        return error;
      }
    } else {
      console.log("Producto no encontrado");
    }
  }

  async reescribirTxt(word) {
    await fs.writeFile(this.path, ""); //me aseguro que el 'info.txt' quede completamente en blanco
    await fs.writeFile(this.path, JSON.stringify(this.products)); //REESCRIBO EL INFO.TXT CON LA NUEVA INFORMACION
    console.log(`producto ${word} exitosamente`);
  }
}
const productManager = new ProductManager("./info.txt");

productManager.addProduct(
  "GUANTES BOXEO",
  "GUANTES",
  250000,
  "img.jpg",
  80,
  25
);

productManager.addProduct("VENDAS 3M", "VENDAS", 800, "img.jpg", 100, 10);

productManager.addProduct("GUANTINES", "GUANTINES", 200, "img.jpg", 55, 12);

productManager.addProduct("BOLSA DE BOXEO", "BOLSA", 180, "img.jpg", 58, 120);
productManager.addProduct(
  "BOTINES DE FUTBOL",
  "BOTINES",
  200,
  "img.jpg",
  95,
  250
);
productManager.addProduct("CIELO TIERRA", "CT", 100, "img.jpg", 35, 498);
productManager.addProduct("PERA", "PERA", 180, "img.jpg", 23, 120);
productManager.addProduct("SOPORTE BOLSA", "SOPORTE", 180, "img.jpg", 98, 120);
productManager.addProduct("PESA RUSA", "PR", 180, "img.jpg", 15, 120);
productManager.addProduct("MANCUERNA", "MNC", 180, "img.jpg", 17, 120);
// productManager.getProducts();
productManager.getProductById(1);
// productManager.updateProduct(
//   3,
//   "thumbnail",
//   "este es un cambio en la ruta de la imagen"
// );
// productManager.deleteProduct(3);
