import { promises as fs } from "fs";
class ProductManager {
  constructor(path) {
    this.products = [];
    this.idCounter = 1;
    this.path = path;
  }

  generateId() {
    return this.idCounter++;
  }

  async getProducts() {
    console.log(this.products);
  }

  async getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      console.log(product);
    } else {
      console.log("Producto no encontrado");
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    const codes = this.products.map((product) => product.code);
    if (codes.includes(code)) {
      console.log("Ya existe un producto con este código");
    } else {
      const id = this.generateId();
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
        await fs.writeFile(this.path, ""); //me aseguro que el 'info.txt' quede completamente en blanco
        this.reescribirTxt("eliminado"); //ejecuto el metodo reescribir con la nueva informacion
      } catch (error) {
        return error;
      }
    } else {
      console.log("Producto no encontrado");
    }
  }

  async reescribirTxt(word) {
    await fs.writeFile(this.path, JSON.stringify(this.products)); //REESCRIBO EL INFO.TXT CON LA NUEVA INFORMACION
    console.log(`producto ${word} exitosamente`);
  }
}

const productManager = new ProductManager("./info.txt");

productManager.addProduct(
  "GUANTES BOXEO EVERLAST",
  "GUANTE EVERLAST 12 OZ",
  250000,
  "img.jpg",
  80,
  25
);

productManager.addProduct(
  "VENDAS 3M",
  "VENDAS DE 3 METROS",
  800,
  "img.jpg",
  100,
  10
);

productManager.addProduct(
  "GUANTINES",
  "GUANTINES PARA BOLSA DE BOXEO, KICK BOXING, MUAY THAY. TALLE S-M-L",
  200,
  "img.jpg",
  55,
  12
);

productManager.addProduct(
  "BOLSA DE BOXEO",
  "BOLSA DE BOXEO 120CM CON RELLENO DE TELA PARA BOXEO, KICK BOXING, MUAY THAY",
  180,
  "img.jpg",
  58,
  120
);
productManager.getProducts();
productManager.getProductById(2);
productManager.updateProduct(
  3,
  "thumbnail",
  "este es un cambio en la ruta de la imagen"
);
productManager.deleteProduct(5);
