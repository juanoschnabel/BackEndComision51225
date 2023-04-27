const socket = io();
const title = document.getElementById("titulo");
const description = document.getElementById("descripcion");
const price = document.getElementById("precio");
const category = document.getElementById("categoria");
const stock = document.getElementById("stock");
const status = document.getElementById("status");
const thumbnail = document.getElementById("imagen");
const code = document.getElementById("codigo");
const idForm = document.getElementById("id");
const form = document.getElementById("form");
const enviar = document.getElementById("enviar");
const formEliminar = document.getElementById("eliminar");
const cards = document.getElementById("producto");
let productoIngresado = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nuevoProducto = {
    title: title.value,
    description: description.value,
    price: price.value,
    thumbnail: thumbnail.value,
    code: code.value,
    status: status.value,
    stock: stock.value,
    category: category.value,
  };
  productoIngresado.push(nuevoProducto);
  socket.emit("productoIngresado", productoIngresado);
  productoIngresado = [];
});
formEliminar.addEventListener("submit", (e) => {
  const id = Number(idForm.value);
  socket.emit("productoEliminado", id);
  console.log(id);
  e.preventDefault();
});

socket.on("nuevosproductos", (arrayProductos) => {
  actualizarListaProductos(arrayProductos);
});
const actualizarListaProductos = (arrayProductos) => {
  cards.innerHTML = "";
  arrayProductos.forEach((producto) => {
    cards.innerHTML += `      <div class="card">
    <div class="text-center">
      <source srcset="..." type="image/svg+xml" />
      <img
        src=${producto.thumbnail}
        class="img-fluid img-thumbnail"
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
      <p class="card-text">id: ${producto.id}</p>
    </div>
  </div>`;
  });
};
