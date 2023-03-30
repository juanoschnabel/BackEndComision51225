class ProductManager {
  constructor() {
    this.products = [];
    this.idCounter = 1;
  }

  generateId() {
    return this.idCounter++;
  }

  getProducts() {
    console.log(this.products);
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      console.log(product);
    } else {
      console.log("Producto no encontrado");
    }
  }

  addProduct(title, description, price, thumbnail, code, stock) {
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
      console.log("Producto creado exitosamente");
    }
  }
}

const productManager = new ProductManager();

productManager.addProduct(
  "GUANTE BOXEO EVERLAST",
  "GUANTE EVERLAST 12 OZ BOXEO, KICK BOXING, MUAY THAY",
  250000,
  "img.jpg",
  80,
  25
);

productManager.addProduct(
  "PAR DE VENDAS 3M",
  "VENDAS DE BOXEO 3 METROS",
  800,
  "img.jpg",
  100,
  10
);

productManager.addProduct(
  "GUANTINES PARA BOLSA BOXEO",
  "GUANTINES PARA BOLSA DE BOXEO, KICK BOXING, MUAY THAY. TALLE S-M-L",
  200,
  "img.jpg",
  55,
  12
);

productManager.addProduct(
  "BOLSA DE BOXEO RELLENO DE TELA",
  "BOLSA DE BOXEO 120CM CON RELLENO DE TELA PARA BOXEO, KICK BOXING, MUAY THAY",
  180,
  "img.jpg",
  58,
  120
);

productManager.getProducts();
productManager.getProductById(2);
