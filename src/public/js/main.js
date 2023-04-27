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
const inputDeleteButtons = document.querySelectorAll("#inputDelete");
let productoIngresado = [];
inputDeleteButtons.forEach((inputDeleteButton) => {
  inputDeleteButton.addEventListener("click", (e) => {
    e.preventDefault();
    let id = Number(e.target.value);
    socket.emit("productoEliminado", id);
    console.log(id);
    id;
  });
});
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

socket.on("nuevosproductos", (arrayProductos) => {
  actualizarListaProductos(arrayProductos);
});
const actualizarListaProductos = (arrayProductos) => {
  cards.innerHTML = "";
  arrayProductos.forEach((producto) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="text-center">
        <img src="${producto.thumbnail}" class="img-fluid img-thumbnail" alt="Imagen del producto"/>
      </div>
      <div class="card-body">
        <h5 class="card-title">titulo: ${producto.title}</h5>
        <p class="card-text">descripcion: ${producto.description}</p>
        <p class="card-text">precio: ${producto.price}</p>
        <p class="card-text">codigo: ${producto.code}</p>
        <p class="card-text">stock: ${producto.stock}</p>
        <p class="card-text">estado: ${producto.status}</p>
        <p class="card-text">categoria: ${producto.category}</p>
        <p class="card-text">id: ${producto.id}</p>
      </div>`;
    const deleteButtonContainer = document.createElement("div");
    deleteButtonContainer.id = "inputDelete";
    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-primary";
    deleteButton.value = producto.id;
    deleteButton.textContent = "ELIMINAR";
    deleteButton.addEventListener("click", (e) => {
      let id = Number(e.target.value);
      socket.emit("productoEliminado", id);
      console.log(id);
      e.preventDefault();
    });
    deleteButtonContainer.appendChild(deleteButton);
    card.appendChild(deleteButtonContainer);
    cards.appendChild(card);
  });
};
