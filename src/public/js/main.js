const socket = io();
const titulo = document.getElementById("titulo");
const descripcion = document.getElementById("descripcion");
const precio = document.getElementById("precio");
const categoria = document.getElementById("categoria");
const stock = document.getElementById("stock");
const status = document.getElementById("status");
const imagen = document.getElementById("imagen");
const codigo = document.getElementById("codigo");
const form = document.getElementById("form");
const cards = document.getElementById("producto");
let products;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  socket.emit("mensaje", {
    titulo: titulo.value,
    descripcion: descripcion.value,
    precio: precio.value,
    categoria: categoria.value,
    stock: stock.value,
    status: status.value,
    imagen: imagen.value,
    codigo: codigo.value,
    products: products,
  });
  // limpiar los campos después de enviar el formulario
  titulo.value = "";
  descripcion.value = "";
  precio.value = "";
  categoria.value = "";
  stock.value = "";
  status.value = "";
  imagen.value = "";
  codigo.value = "";
});

socket.on("productos", (arrayProductos) => {
  cards.innerHTML = "";
  arrayProductos.forEach((producto) => {
    cards.innerHTML += `<div class="card-group d-flex">
    <div class="row row-cols-12">
      <div class="card">
        <div class="text-center">
          <source srcset="..." type="image/svg+xml" />
          <img
            class="img-fluid img-thumbnail"
            src=${producto.thumbnail}
            alt="Imagen del producto"
          /></div>
        <div class="card-body">
          <h5 class="card-title">titulo: ${producto.title}</h5>
          <p class="card-text">descripcion: ${producto.description}</p>
          <p class="card-text">precio: ${producto.price}</p>
          <p class="card-text">codigo: ${producto.code}</p>
          <p class="card-text">stock: ${producto.stock}</p>
          <p class="card-text">estado: ${producto.status}</p>
          <p class="card-text">categoria: ${producto.category}</p>
        </div>
      </div>
    </div>
  </div>`;
  });
});
